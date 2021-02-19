import { ViewStyle } from 'react-native';

import { AnimatedView } from '../Containers';

import * as Types from './types';

export function flattenAnimationHx<ItemT>(
  animations: Types.ItemAnimation<ItemT>[],
  baseStyle: Types.ItemStartStyle<ItemT>,
  info: Types.AnimatedItemInfo<ItemT>,
): ViewStyle {
  // @ts-ignore
  return animations.reduce(
    (acc, animation) => ({
      ...acc,
      ...flattenProp<AnimatedView.Animation>(animation, info).to,
    }),
    flattenProp<ViewStyle>(baseStyle, info),
  );
}

export function flattenProp<T>(prop: any, info: any): T {
  if (typeof prop === 'function') {
    return prop(info);
  }
  return prop;
}
