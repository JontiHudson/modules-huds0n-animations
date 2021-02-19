import { Animated, ViewProps } from 'react-native';

import { useAnimatorStyle } from '../../AnimatorStyle';

export type Children = React.ReactElement | null | false;

export type Props = ViewProps & {
  animate?: boolean;
  animation?: Omit<useAnimatorStyle.Animation, 'to'>;
  backgroundColor?: string | null;
  children?: Children;
  overrideColor?: string;
};

export type ColorAnim = Animated.AnimatedInterpolation | undefined | string;

export type RGBA = { r: number; g: number; b: number; a: number };
