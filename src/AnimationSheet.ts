import * as Types from './Lists/types';

function create<
  A extends Record<string, Types.Animation | Types.ItemAnimation>
>(animations: A) {
  return animations;
}

export const AnimationSheet = { create };
