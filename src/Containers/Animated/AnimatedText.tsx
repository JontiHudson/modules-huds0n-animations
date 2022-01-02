import { Text as TextRN, TextProps } from 'react-native';

import { createAnimatedComponent } from './createAnimatedComponent';

export namespace AnimatedText {
  export type Props = createAnimatedComponent.AnimatedProps<TextProps>;
  export type Ref = createAnimatedComponent.AnimatedRef<typeof TextRN>;

  export type Component = createAnimatedComponent.Animated<typeof TextRN>;

  export type Animation = createAnimatedComponent.Animation;
  export type AnimationProp = createAnimatedComponent.AnimationProp;
  export type AttachProp = createAnimatedComponent.AttachProp;
  export type DefaultConfig = createAnimatedComponent.DefaultConfig;
  export type Loop = createAnimatedComponent.Loop;
  export type OnAnimationStartFn = createAnimatedComponent.OnAnimationStartFn;
  export type OnAnimationEndFn = createAnimatedComponent.OnAnimationEndFn;
}

export const AnimatedText: AnimatedText.Component =
  createAnimatedComponent(TextRN);
