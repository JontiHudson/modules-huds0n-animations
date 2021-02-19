import {
  ListRenderItemInfo as ListRenderItemInfoRN,
  ViewStyle,
} from 'react-native';

import { FlatList } from '@huds0n/components';
import { LazyList } from '@huds0n/lazy-list';

import { AnimatedView } from '../Containers';

export type ListRenderItemInfo<ItemT = any> = ListRenderItemInfoRN<ItemT>;

export type ListRenderItem<ItemT = any> = (
  info: ListRenderItemInfo<ItemT>,
) => React.ReactElement | null;

export type OnAnimationEndFn<ItemT = any> = () =>
  | ItemAnimation<ItemT>
  | undefined;

export type Animation<ItemT = any> = Omit<
  AnimatedView.Animation,
  'onAnimationEnd' | 'onAnimationEnd'
> & {
  onAnimationEnd?: OnAnimationEndFn<ItemT>;
  stagger?: number;
  staggerByRow?: boolean;
};

export type AnimatedItemInfo<ItemT = any> = {
  item: ItemT;
  index: number;
};

export type ItemStartStyle<ItemT = any> =
  | ViewStyle
  | ((info: AnimatedItemInfo<ItemT>) => ViewStyle);

export type ItemAnimation<ItemT = any> =
  | Animation
  | ((info: AnimatedItemInfo<ItemT>) => Animation);

export type AnimatedListProps<ItemT> = {
  itemAnimate?: ItemAnimation<ItemT>;
  itemStartStyle: ItemStartStyle<ItemT>;
  renderItem: ListRenderItem<ItemT>;
  useNativeDriver?: boolean;
};

export type FlatListProps<ItemT = any> = Omit<
  FlatList.Props<ItemT>,
  'extraData' | 'horizontal' | 'renderItem'
> &
  AnimatedListProps<ItemT>;

export type LazyListProps<ItemT = any> = Omit<
  LazyList.Props<ItemT>,
  'extraData' | 'horizontal' | 'renderItem'
> &
  AnimatedListProps<ItemT> & {
    refreshItemAnimate?: ItemAnimation<ItemT>;
  };

export type StartEnd = { startIndex: number; endIndex: number };
export type VisibilityDetails = {
  startIndex: number;
  endIndex: number;
};

export type Frame = {
  index: number;
  offset: number;
  length: number;
};

export type State<ItemT> = {
  currentAnimation: null | ItemAnimation<ItemT>;
  isAnimating: boolean;
  ListRef: any;
  reorientating: boolean;
};
