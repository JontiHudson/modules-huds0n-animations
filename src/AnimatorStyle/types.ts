import { Animated, StyleProp, TextStyle, ViewStyle } from 'react-native';

export type AnimationStyle = Animated.WithAnimatedValue<ViewStyle>;
export type AnimationTransform = Record<string, any>;

export type AnimationValues = {
  animatedValue: Animated.Value;
  interpolation: Animated.AnimatedInterpolation;
  outputRange: any[] | null;
};
export type AnimationValueStore = Record<string, AnimationValues>;

export type OnAnimationStartFn = (animation: Animation) => void;
export type OnAnimationEndFn = (attachedProps: string[]) => void;

export type Loop = number | boolean | { current: boolean };

type CommonAnimation = {
  to: StyleProp<TextStyle>;
  loop?: Loop;
  onAnimationEnd?: OnAnimationEndFn;
  onAnimationStart?: OnAnimationStartFn;
  type?: 'TIMING' | 'SPRING' | 'DECAY';
};

type TimingAnimation = Omit<
  Parameters<typeof Animated.timing>[1],
  'toValue' | 'useNativeDriver'
>;
type SpringAnimation = Omit<
  Parameters<typeof Animated.spring>[1],
  'toValue' | 'useNativeDriver'
>;
type DecayAnimation = Omit<
  Parameters<typeof Animated.decay>[1],
  'toValue' | 'useNativeDriver'
>;

export type Animation = CommonAnimation &
  TimingAnimation &
  SpringAnimation &
  Partial<DecayAnimation>;

export type AnimationProp = Animation | Animation[];

export type AttachProp = {
  at?: AttachPoint[];
  over?: AttachFunction;
  animatedValue: Animated.Value;
  easing?: EasingFn;
  spring?: boolean | SpringAnimation;
};

export type AttachFunction = {
  inputStart: number;
  inputEnd: number;
  points: number;
  fn: (input: number) => TextStyle;
};

export type EasingFn = (value: number) => number;

export type AttachPoint = {
  input: number;
  style: StyleProp<TextStyle>;
};

export type AttachStyle = {
  [styleProps: string]: {
    input: number;
    value: any;
  }[];
};

export type DefaultConfig =
  | undefined
  | Partial<Omit<TimingAnimation, 'to' | 'onAnimationEnd'>>
  | Partial<Omit<SpringAnimation, 'to' | 'onAnimationEnd'>>
  | Partial<Omit<DecayAnimation, 'to' | 'onAnimationEnd' | 'velocity'>>;

export type HookOptions = {
  animateOnMount?: AnimationProp;
  defaultConfig?: DefaultConfig;
  initialStyle?: StyleProp<ViewStyle>;
  useNativeDriver?: boolean;
};

export type ForceUpdateFn = () => void;

export type ClassOptions = HookOptions & { forceUpdateFn: ForceUpdateFn };

export type Color = string | null | undefined;
export type RGBA = { r: number; g: number; b: number; a: number };

export enum StyleType {
  Number = 0,
  Color = 1,
  Percentage = 2,
  Degrees = 3,
}
