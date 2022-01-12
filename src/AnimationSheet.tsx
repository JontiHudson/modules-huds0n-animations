import type { Types } from "./types";

export const AnimationSheet = {
  create: <
    A extends {
      [name: string]: Types.AnimationProp | Types.LayoutAnimationProp;
    }
  >(
    animation: A
  ) => animation,
};

export const AttachSheet = {
  create: <
    A extends {
      [name: string]:
        | Types.AttachPoint[]
        | Types.AttachFunction
        | ((
            elementPosition: Types.ListElementAttachPosition
          ) => Types.AttachPoint[])
        | ((
            elementPosition: Types.ListElementAttachPosition
          ) => Types.AttachFunction);
    }
  >(
    animation: A
  ) => animation,
};
