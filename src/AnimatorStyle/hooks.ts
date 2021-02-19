import { useMemo, useForceUpdate } from '@huds0n/utilities';

import { AnimatorStyle } from './Class';
import * as Types from './types';

export namespace useAnimatorStyle {
  export type Animation = Types.Animation;
  export type AnimationProp = Types.AnimationProp;
  export type AttachProp = Types.AttachProp;
  export type DefaultConfig = Types.DefaultConfig;
  export type Loop = Types.Loop;
  export type AnimationEndEvent = Types.AnimationEndEvent;
  export type OnAnimationEndFn = Types.OnAnimationEndFn;
  export type OnAnimationStartFn = Types.OnAnimationStartFn;
  export type Options = Types.HookOptions;
}

export function useAnimatorStyle(options: useAnimatorStyle.Options) {
  const forceUpdateFn = useForceUpdate();
  return useMemo(() => new AnimatorStyle({ ...options, forceUpdateFn }));
}
