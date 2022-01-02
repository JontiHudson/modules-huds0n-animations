import { View as ViewRN, ViewProps } from 'react-native';

import { createAnimatedComponent } from './createAnimatedComponent';

export namespace AnimatedView {
  export type Props = createAnimatedComponent.AnimatedProps<ViewProps>;
  export type Ref = createAnimatedComponent.AnimatedRef<typeof ViewRN>;

  export type Component = createAnimatedComponent.Animated<typeof ViewRN>;

  export type Animation = createAnimatedComponent.Animation;
  export type AnimationProp = createAnimatedComponent.AnimationProp;
  export type AttachProp = createAnimatedComponent.AttachProp;
  export type DefaultConfig = createAnimatedComponent.DefaultConfig;
  export type Loop = createAnimatedComponent.Loop;
  export type OnAnimationStartFn = createAnimatedComponent.OnAnimationStartFn;
  export type OnAnimationEndFn = createAnimatedComponent.OnAnimationEndFn;
}

export const AnimatedView: AnimatedView.Component =
  createAnimatedComponent(ViewRN);
