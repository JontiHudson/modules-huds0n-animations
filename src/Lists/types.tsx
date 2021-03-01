import {
  Animated,
  ListRenderItem as ListRenderItemRN,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { FlatList } from '@huds0n/components';

import { AnimatedView } from '../Containers';

export type AnimateStyle<ItemT = any> =
  | ViewStyle
  | ((info: FlatList.ListRenderItemInfo<ItemT>) => ViewStyle);

export type ElementPosition = {
  index: number;
  row: number;
  start: number;
  end: number;
};

export type ListRenderItemInfo<ItemT> = FlatList.ListRenderItemInfo<ItemT> & {
  offsetAnim: Animated.Value;
  offsetValue: React.MutableRefObject<number>;
} & ElementPosition;

export type BaseListProps = {
  ListHeaderComponent?: React.ReactNode;
  ListFooterComponent?: React.ReactNode;
  contentOffset?: FlatList.Props['contentOffset'];
  onScroll?: FlatList.Props['onScroll'];
  renderItem?: ListRenderItemRN<any> | null;
  scrollEnabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export type AnimatedListProps<ItemT> = {
  animationDelay?: number;
  animationDuration?: number;
  at?: (elementPosition: ElementPosition) => AnimatedView.AttachProp['at'];
  itemLength: number;
  footerOffset?: number;
  headerOffset?: number;
  ListComponent?: React.ComponentType<any>;
  offsetAnim?: Animated.Value;
  onAnimationEnd?: () => any;
  over?: (elementPosition: ElementPosition) => AnimatedView.AttachProp['over'];
  renderItem: (info: ListRenderItemInfo<ItemT>) => React.ReactElement | null;
  useNativeDriver?: boolean;
};

export type ListProps<
  L extends BaseListProps = FlatList.Props,
  ItemT = any
> = Omit<
  L,
  | 'renderItem'
  | 'ListHeaderComponent'
  | 'ListEmptyComponent'
  | 'ListFooterComponent'
> &
  AnimatedListProps<ItemT>;
