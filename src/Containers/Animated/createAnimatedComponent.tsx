import React, {
  PropsWithChildren,
  useImperativeHandle,
  RefObject,
} from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';

import {
  toArray,
  useEffect,
  usePrev,
  useRef,
  measureNodeAsync,
  getNodeId,
} from '@huds0n/utilities';

import { useAnimatorStyle } from '../../AnimatorStyle';

export namespace createAnimatedComponent {
  type ExtractRef<P extends {}> = P extends { ref?: RefObject<infer R> }
    ? R
    : {};

  export type AnimatedRef<C extends React.ComponentType<any>> = {
    animate: (animation: useAnimatorStyle.AnimationProp) => void;
    attach: (
      to: ViewStyle | TextStyle,
      animatedValue: Animated.Value | Animated.AnimatedInterpolation,
      inputRange: [number, number],
      useNativeDriver?: boolean,
    ) => void;
    setStyle: (style: StyleProp<ViewStyle>) => void;
  } & (C extends new (...args: any) => any
    ? InstanceType<C>
    : C extends React.ComponentType<infer P>
    ? ExtractRef<P>
    : {});

  export type AnimationProp =
    | useAnimatorStyle.AnimationProp
    | ((
        layout: measureNodeAsync.NodeMeasurements,
      ) => useAnimatorStyle.AnimationProp);

  export type AttachProp = useAnimatorStyle.AttachProp;

  export type AnimatedProps<P extends {}> = PropsWithChildren<P> &
    Omit<useAnimatorStyle.Options, 'animateOnMount' | 'initialStyle'> & {
      animate?: AnimationProp;
      attach?: AttachProp;
    };

  export type Animated<
    C extends React.ComponentType<any>
  > = C extends React.ComponentType<infer P>
    ? React.ForwardRefExoticComponent<
        React.PropsWithoutRef<AnimatedProps<P>> &
          React.RefAttributes<AnimatedRef<C>>
      >
    : never;

  export type Animation = useAnimatorStyle.Animation;
  export type DefaultConfig = useAnimatorStyle.DefaultConfig;
  export type Loop = useAnimatorStyle.Loop;
  export type OnAnimationEndFn = useAnimatorStyle.OnAnimationEndFn;
  export type OnAnimationStartFn = useAnimatorStyle.OnAnimationStartFn;
}

function ensureClassComponent<P>(
  Component: ((props: P & any) => React.ReactElement) | React.ComponentType<P>,
): React.ComponentType<any> {
  if (
    typeof Component === 'function' &&
    !!Component.prototype.isReactComponent
  ) {
    return Component;
  }

  return class extends React.Component {
    constructor(props: P) {
      super(props);
    }

    render() {
      // @ts-ignore
      return <Component {...this.props} />;
    }
  };
}

export function createAnimatedComponent<
  C extends ((props: P & any) => React.ReactElement) | React.ComponentType<P>,
  P extends { style?: S },
  S extends StyleProp<ViewStyle>
>(Component: C): createAnimatedComponent.Animated<C> {
  const AnimatedComponent = Animated.createAnimatedComponent(
    ensureClassComponent(Component),
  );

  // @ts-ignore
  return React.forwardRef<any, createAnimatedComponent.AnimatedProps<P>>(
    (
      { attach, defaultConfig, useNativeDriver, style, animate, ...props },
      ref,
    ) => {
      const copiedRef = useRef<any>(null);

      const AnimatorStyle = useAnimatorStyle({
        defaultConfig,
        initialStyle: style,
        useNativeDriver,
      });

      useEffect(() => {
        attach && AnimatorStyle.attach(attach);
      }, [attach?.animatedValue, JSON.stringify(attach)]);

      const prevStyle = usePrev(style) || {};

      useEffect(
        () => {
          if (style) {
            const changedStyle = Object.fromEntries(
              Object.entries(StyleSheet.flatten(style)).filter(
                // @ts-ignore
                ([key, prop]) => prop !== StyleSheet.flatten(prevStyle)[key],
              ),
            );

            AnimatorStyle.setStyle(changedStyle);
          }
        },
        [JSON.stringify(style)],
        { layout: 'BEFORE', skipMounts: true },
      );

      useEffect(
        () => {
          if (!animate) return;

          if (typeof animate === 'function') {
            setTimeout(() => {
              measureNodeAsync(getNodeId(copiedRef)).then((layout) => {
                AnimatorStyle.animate(animate(layout));
              });
            });
          } else {
            AnimatorStyle.animate(animate);
          }
        },
        [
          animate &&
            (typeof animate === 'function'
              ? animate.toString()
              : JSON.stringify(toArray(animate).map((a) => a.to))),
        ],
        { layout: 'BEFORE' },
      );

      useImperativeHandle(
        ref,
        () =>
          ({
            ...copiedRef.current,
            animate: AnimatorStyle.animate,
            attach: AnimatorStyle.attach,
            setStyle: AnimatorStyle.setStyle,
          } as createAnimatedComponent.AnimatedRef<C>),
      );

      return (
        // @ts-ignore
        <AnimatedComponent
          ref={copiedRef}
          {...props}
          style={AnimatorStyle.style}
        />
      );
    },
  );
}
