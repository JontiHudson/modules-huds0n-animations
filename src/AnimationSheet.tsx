import { useAnimatorStyle } from './AnimatorStyle';
import { ElementPosition } from './Lists/types';

export const AnimationSheet = {
  create: <
    A extends {
      [name: string]:
        | useAnimatorStyle.AnimationProp
        | useAnimatorStyle.AttachProp['at']
        | useAnimatorStyle.AttachProp['over']
        | ((
            elementPosition: ElementPosition,
          ) => useAnimatorStyle.AttachProp['at'])
        | ((
            elementPosition: ElementPosition,
          ) => useAnimatorStyle.AttachProp['over']);
    }
  >(
    animation: A,
  ) => animation,
};
