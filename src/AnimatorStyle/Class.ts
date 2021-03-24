import {
  Animated,
  LogBox,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';

import Error from '@huds0n/error';
import { mapObject, toArray } from '@huds0n/utilities';

import {
  colorToRGBAString,
  getStartNumber,
  getStartColor,
  getStartString,
  TRANSPARENT_STRING,
} from './helpers';
import {
  Animation,
  AnimationProp,
  AnimationStyle,
  AnimationTransform,
  AnimationValues,
  AnimationValueStore,
  AttachProp,
  AttachPoint,
  AttachStyle,
  ClassOptions,
  DefaultConfig,
  EasingFn,
  ForceUpdateFn,
  StyleType,
} from './types';

LogBox.ignoreLogs([`Trying to remove a child that doesn't exist`]);

export class AnimatorStyle {
  private static DEFAULT_DURATION = 1000;
  private static DEFAULT_VELOCITY = 250;
  private static _animationCache = new Map<symbol, (() => void)[]>();
  static runCached(id: symbol) {
    AnimatorStyle._animationCache.get(id)?.forEach((a) => a());
    AnimatorStyle._animationCache.delete(id);
  }

  private _animatedValueProgress: Map<Animated.Value, number>;
  private _defaultConfig: DefaultConfig;
  private _forceUpdateFn: ForceUpdateFn;
  private _style: AnimationStyle;
  private _styleAnim: AnimationValueStore;
  private _transform: AnimationTransform;
  private _transformAnim: AnimationValueStore;
  private _useNativeDriver: boolean;

  private static _transformArrayToObj(
    transformArray: AnimationStyle['transform'] = [],
  ): AnimationTransform {
    return transformArray.reduce((acc, t) => ({ ...acc, ...t }), {});
  }

  constructor({
    animateOnMount,
    defaultConfig,
    initialStyle = {},
    forceUpdateFn,
    useNativeDriver = false,
  }: ClassOptions) {
    const { transform, ...style } = StyleSheet.flatten(initialStyle);

    this._animatedValueProgress = new Map();
    this._defaultConfig = defaultConfig;
    this._forceUpdateFn = forceUpdateFn;
    this._style = style;
    this._styleAnim = {};
    this._transform = AnimatorStyle._transformArrayToObj(transform);
    this._transformAnim = {};
    this._useNativeDriver = useNativeDriver;

    if (animateOnMount) {
      this.animate(animateOnMount);
    }

    this.animate = this.animate.bind(this);
    this.attach = this.attach.bind(this);
    this.removeAllListeners = this.removeAllListeners.bind(this);
    this.setStyle = this.setStyle.bind(this);
  }

  get style(): AnimationStyle {
    const transform: any = Object.entries(this._transform).map(
      ([key, value]) => ({
        [key]: value,
      }),
    );

    return { ...this._style, transform };
  }

  setStyle(style: StyleProp<ViewStyle>) {
    const { transform: newTransform, ...newStyle } = StyleSheet.flatten(style);

    this._style = { ...this._style, ...newStyle };
    this._transform = {
      ...this._transform,
      ...AnimatorStyle._transformArrayToObj(newTransform),
    };

    this._forceUpdateFn();
  }

  // Animate Methods

  animate(animation: AnimationProp) {
    const animations = toArray(animation);
    animations.forEach((a) => {
      const animatedValue = this._handleAnimation(StyleSheet.flatten(a.to));
      this._handleAnimatedValue(a, animatedValue);
    });

    this._forceUpdateFn();

    animations.forEach((a) => {
      a.delay
        ? setTimeout(() => a.onAnimationStart?.(a), a.delay)
        : a.onAnimationStart?.(a);
    });
  }

  private _handleAnimation(
    to: TextStyle,
    animatedValue = new Animated.Value(0),
  ) {
    this._handleAnimateStyle(to, animatedValue);
    this._handleAnimateTransform(to, animatedValue);

    this._configureAnimatedValue(animatedValue);

    return animatedValue;
  }

  private _configureAnimatedValue(animatedValue: Animated.Value) {
    animatedValue.setValue(0);
    this._animatedValueProgress.set(animatedValue, 0);

    animatedValue.addListener(({ value }) => {
      this._animatedValueProgress.set(animatedValue, value);
    });

    this._forceUpdateFn();
  }

  private _handleAnimateStyle(to: TextStyle, animatedValue: Animated.Value) {
    const { transform, ...style } = to;

    this._updateAnimStore(style, this._styleAnim, this._style, animatedValue);

    Object.entries(this._styleAnim).forEach(([key, { interpolation }]) => {
      // @ts-ignore
      this._style[key] = interpolation;
    });
  }

  private _handleAnimateTransform(
    to: TextStyle,
    animatedValue: Animated.Value,
  ) {
    const { transform } = to;

    if (transform) {
      const transformObj = transform.reduce((acc, t) => ({ ...acc, ...t }), {});

      this._updateAnimStore(
        transformObj,
        this._transformAnim,
        this._transform,
        animatedValue,
      );

      this._transform = {
        ...this._transform,
        ...mapObject<
          AnimationValueStore,
          AnimationValues,
          Animated.AnimatedInterpolation
        >(this._transformAnim, ({ interpolation }) => interpolation),
      };
    }
  }

  private _updateAnimStore(
    styleProps: { [prop: string]: any },
    valueStore: AnimationValueStore,
    styleStore: any,
    animatedValue: Animated.Value,
  ) {
    Object.entries(styleProps).forEach(([styleKey, endValue]) => {
      let startValue;

      let styleType = StyleType.Number;

      if (styleKey.match('color') || styleKey.match('Color')) {
        styleType = StyleType.Color;
      } else if (typeof endValue === 'string') {
        if (endValue.match('%')) {
          styleType = StyleType.Percentage;
        } else if (endValue.match('deg')) {
          styleType = StyleType.Degrees;
        }
      }

      try {
        if (valueStore[styleKey]?.outputRange) {
          const {
            animatedValue: oldAnimatedValue,
            // @ts-ignore
            outputRange: [oldStart, oldEnd],
          } = valueStore[styleKey];

          const progress =
            this._animatedValueProgress.get(oldAnimatedValue) || 0;

          startValue = oldEnd;

          if (progress !== 1) {
            switch (styleType) {
              case StyleType.Number:
                startValue = getStartNumber(oldStart, oldEnd, progress);
                break;

              case StyleType.Color:
                startValue = getStartColor(
                  oldStart,
                  oldEnd,
                  progress,
                  endValue,
                );
                endValue = colorToRGBAString(endValue);

                break;

              case StyleType.Percentage:
                startValue = getStartString(oldStart, oldEnd, progress, '%');
                break;

              case StyleType.Degrees:
                startValue = getStartString(oldStart, oldEnd, progress, 'deg');
                break;
            }
          }

          const outputRange = [startValue, endValue];

          const interpolation = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange,
          });

          valueStore[styleKey] = {
            animatedValue,
            interpolation,
            outputRange,
          };
        } else {
          switch (styleType) {
            case StyleType.Number:
              startValue = styleStore[styleKey] || 0;
              break;

            case StyleType.Color:
              startValue =
                colorToRGBAString(styleStore[styleKey]) || TRANSPARENT_STRING;
              endValue = colorToRGBAString(endValue);
              break;

            case StyleType.Percentage:
              startValue = styleStore[styleKey] || '0%';
              break;

            case StyleType.Degrees:
              startValue = styleStore[styleKey] || '0deg';
              break;
          }

          const outputRange = [startValue, endValue];

          const interpolation = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange,
          });

          valueStore[styleKey] = {
            animatedValue,
            interpolation,
            outputRange,
          };
        }
      } catch (e) {
        throw Error.transform(e, {
          name: 'Animation Style Handler Error',
          code: 'INITIALIZE_STYLE_ERROR',
          message: `Style prop ${styleKey} could not be interpolated. Please check start and end values`,
          severity: 'MEDIUM',
          info: {
            currentStyle: this._style,
            endValue,
            key: styleKey,
            startValue,
          },
        });
      }
    });
  }

  private _handleAnimatedValue(
    animation: Animation,
    animatedValue: Animated.Value,
  ) {
    const animationCallback = this._getAnimationCallback(
      animation,
      animatedValue,
    );

    const composite = this._getCompositeAnimation(animation, animatedValue);

    composite.start(animationCallback);
  }

  private _getAnimationCallback(
    animation: Animation,
    animatedValue: Animated.Value,
  ) {
    return () => {
      const attachedProps = this._getAnimatedValueAttachedProps(animatedValue);

      if (typeof animation.loop === 'number') {
        animation.loop = animation.loop - 0.5;
      }

      if (attachedProps.length && this._shouldRepeat(animation)) {
        this._handleAnimatedValue(animation, animatedValue);

        return;
      }

      animatedValue.removeAllListeners();

      const chainedAnimation = animation.onAnimationEnd?.(attachedProps);

      if (chainedAnimation) {
        requestAnimationFrame(() => {
          this.animate(chainedAnimation);
        });
      }
    };
  }

  private _getAnimatedValueAttachedProps(animatedValue: Animated.Value) {
    const styleProps = Object.entries(this._styleAnim)
      .filter(([key, store]) => store.animatedValue === animatedValue)
      .map(([key]) => key);

    const transformProps = Object.entries(this._transformAnim)
      .filter(([key, store]) => store.animatedValue === animatedValue)
      .map(([key]) => key);

    return [...styleProps, ...transformProps];
  }

  private _shouldRepeat({ loop }: Animation) {
    return (
      loop === true ||
      (typeof loop === 'number' && loop > 0) ||
      (typeof loop === 'object' && loop.current)
    );
  }

  private _getCompositeAnimation(
    animation: Animation,
    animatedValue: Animated.Value,
  ) {
    const progress = this._animatedValueProgress.get(animatedValue) || 0;

    const toValue = progress < 0.5 ? 1 : 0;

    return (animation.type === 'DECAY'
      ? Animated.decay
      : animation.type === 'SPRING'
      ? Animated.spring
      : Animated.timing)(animatedValue, {
      duration: AnimatorStyle.DEFAULT_DURATION,
      // @ts-ignore
      velocity:
        animation.type === 'DECAY' ? AnimatorStyle.DEFAULT_VELOCITY : undefined,
      ...this._defaultConfig,
      ...animation,
      toValue,
      useNativeDriver: this._useNativeDriver,
    });
  }

  removeAllListeners() {
    this._animatedValueProgress.forEach((progress, animatedValue) => {
      animatedValue.removeAllListeners();
    });
  }

  // Attach Methods

  attach(attachProp: AttachProp) {
    const animatedValue = this._handleAttachedValue(attachProp);

    const at = this._handleAt(attachProp);

    this._handleAttachStyle(animatedValue, at, attachProp.easing);
    this._handleAttachTransform(animatedValue, at, attachProp.easing);

    this._forceUpdateFn();

    attachProp.onAttach?.();

    return animatedValue;
  }

  private _handleAttachedValue({ animatedValue, spring }: AttachProp) {
    if (typeof animatedValue === 'number') {
      return new Animated.Value(animatedValue);
    }

    if (!spring) {
      return animatedValue;
    }

    // @ts-ignore
    const linkAnimatedValue = new Animated.Value(animatedValue._value);

    Animated.spring(linkAnimatedValue, {
      useNativeDriver: this._useNativeDriver,
      ...(typeof spring === 'object' && { spring }),
      toValue: animatedValue,
    }).start();

    return linkAnimatedValue;
  }

  private _handleAt({ at = [], over }: AttachProp) {
    if (!over) {
      return at.sort((a, b) => a.input - b.input);
    }

    if (over.points < 2) {
      throw new Error({
        name: 'Animation Style Handler Error',
        code: 'INSUFFICIENT_OVER_POINTS',
        message: `At least 2 points are required to attach over`,
        severity: 'MEDIUM',
      });
    }

    const overRange = over.inputEnd - over.inputStart;
    const overPointInterval = overRange / (over.points - 1);

    let point = 0;
    const overPoints = [...at];

    while (point < over.points) {
      const input = over.inputStart + point * overPointInterval;

      overPoints.push({
        input,
        style: over.fn(input, point / over.points),
      });

      point++;
    }

    return overPoints.sort((a, b) => a.input - b.input);
  }

  private _handleAttachStyle(
    animatedValue: Animated.Value,
    at: AttachPoint[],
    easing?: EasingFn,
  ) {
    const stylePoints = at.reduce<AttachStyle>((acc, a) => {
      const { transform, ...style } = StyleSheet.flatten(a.style);

      Object.entries(style).forEach(([key, value]) => {
        acc[key] = acc[key]
          ? [...acc[key], { input: a.input, value }]
          : [{ input: a.input, value }];
      });
      return acc;
    }, {});

    this._updateAttachStore(
      stylePoints,
      this._styleAnim,
      animatedValue,
      easing,
    );

    Object.entries(this._styleAnim).forEach(([key, { interpolation }]) => {
      // @ts-ignore
      this._style[key] = interpolation;
    });
  }

  private _handleAttachTransform(
    animatedValue: Animated.Value,
    at: AttachPoint[],
    easing?: EasingFn,
  ) {
    const transformPoints = at.reduce<AttachStyle>((acc, a) => {
      const { transform } = StyleSheet.flatten(a.style);

      if (!transform) {
        return acc;
      }

      const transformObj = transform.reduce((acc, t) => ({ ...acc, ...t }), {});

      Object.entries(transformObj).forEach(([key, value]) => {
        acc[key] = acc[key]
          ? [...acc[key], { input: a.input, value }]
          : [{ input: a.input, value }];
      });
      return acc;
    }, {});

    this._updateAttachStore(
      transformPoints,
      this._transformAnim,
      animatedValue,
      easing,
    );

    this._transform = {
      ...this._transform,
      ...mapObject<
        AnimationValueStore,
        AnimationValues,
        Animated.AnimatedInterpolation
      >(this._transformAnim, ({ interpolation }) => interpolation),
    };
  }

  private _updateAttachStore(
    attachStyle: AttachStyle,
    valueStore: AnimationValueStore,
    animatedValue: Animated.Value,
    easing?: EasingFn,
  ) {
    Object.entries(attachStyle).forEach(([styleKey, positionValues]) => {
      try {
        if (!positionValues.length) {
          return;
        }

        if (positionValues.length === 1) {
          valueStore[styleKey] = {
            animatedValue,
            interpolation: positionValues[0].value,
            outputRange: null,
          };
          return;
        }

        const isColor = styleKey.match('color') || styleKey.match('Color');

        const inputRange = positionValues.map((p) => p.input);
        const outputRange = isColor
          ? positionValues.map((p) => colorToRGBAString(p.value))
          : positionValues.map((p) => p.value);

        const interpolation = animatedValue.interpolate({
          inputRange,
          outputRange,
          extrapolate: 'clamp',
          ...(easing && { easing }),
        });

        valueStore[styleKey] = {
          animatedValue,
          interpolation,
          outputRange,
        };
      } catch (e) {
        throw Error.transform(e, {
          name: 'Animation Style Handler Error',
          code: 'INITIALIZE_STYLE_ERROR',
          message: `Style prop ${styleKey} could not be interpolated. Please check start and end values`,
          severity: 'MEDIUM',
          info: {
            currentStyle: this._style,
            key: styleKey,
          },
        });
      }
    });
  }
}
