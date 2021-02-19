import { View as ViewRN, ViewProps } from 'react-native';

import { createAnimatedComponent } from './createAnimatedComponent';
import { themingAnimatedView } from './theming';

export namespace AnimatedView {
  export type Props = createAnimatedComponent.AnimatedProps<ViewProps>;
  export type Ref = createAnimatedComponent.AnimatedRef<typeof ViewRN>;

  export type Component = createAnimatedComponent.Animated<typeof ViewRN> & {
    theming: typeof themingAnimatedView;
  };

  export type Animation = createAnimatedComponent.Animation;
  export type AnimationProp = createAnimatedComponent.AnimationProp;
  export type DefaultConfig = createAnimatedComponent.DefaultConfig;
  export type Loop = createAnimatedComponent.Loop;
  export type AnimationEndEvent = createAnimatedComponent.AnimationEndEvent;
  export type OnAnimationStartFn = createAnimatedComponent.OnAnimationStartFn;
  export type OnAnimationEndFn = createAnimatedComponent.OnAnimationEndFn;
}

export const AnimatedView: AnimatedView.Component = Object.assign(
  createAnimatedComponent(ViewRN),
  { theming: themingAnimatedView },
);
