import React from 'react';
import { Animated, ViewProps } from 'react-native';

import { SharedState } from '@huds0n/shared-state';

type AnimatingMapType = Map<
  string,
  { _id: string; Component: React.ReactElement; opacityAnim: Animated.Value }
>;

export type State = {
  currentContentsId: null | string;
  isAnimating: boolean;
  animatingMap: AnimatingMapType;
};

export type ComponentSharedState = SharedState<State>;

export type Children = React.ReactNode | React.ReactNode;

export type Dependencies = any;

export type Props = ViewProps & {
  animate?: boolean;
  animationDuration?: number;
  children?: Children;
  dependencies: Dependencies;
  easing?: (value: number) => number;
  fadeOverlap?: number;
  onAnimationEnd?: (dependencies: Dependencies) => void;
  onAnimationStart?: (dependencies: Dependencies) => void;
  useNativeDriver?: boolean;
};

export type ContentsProps = Props & {
  _id: string;
  State: SharedState<State>;
  reRender: () => void;
};
