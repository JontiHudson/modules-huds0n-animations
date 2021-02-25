import { Text as TextRN, TextProps } from 'react-native';

import { createAnimatedComponent } from './createAnimatedComponent';
import { themingAnimatedText } from './theming';

export namespace AnimatedText {
  export type Props = createAnimatedComponent.AnimatedProps<TextProps>;
  export type Ref = createAnimatedComponent.AnimatedRef<typeof TextRN>;

  export type Component = createAnimatedComponent.Animated<typeof TextRN> & {
    theming: typeof themingAnimatedText;
  };

  export type Animation = createAnimatedComponent.Animation;
  export type AnimationProp = createAnimatedComponent.AnimationProp;
  export type DefaultConfig = createAnimatedComponent.DefaultConfig;
  export type Loop = createAnimatedComponent.Loop;
  export type OnAnimationStartFn = createAnimatedComponent.OnAnimationStartFn;
  export type OnAnimationEndFn = createAnimatedComponent.OnAnimationEndFn;
}

export const AnimatedText: AnimatedText.Component = Object.assign(
  createAnimatedComponent(TextRN),
  { theming: themingAnimatedText },
);
