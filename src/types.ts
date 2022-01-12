import { PropsWithChildren, RefObject } from "react";
import {
  Animated,
  ListRenderItem as ListRenderItemRN,
  ListRenderItemInfo as ListRenderItemInfoRN,
  StyleProp,
  TextStyle,
  ViewStyle,
  ViewProps,
} from "react-native";

import { ComponentTypes } from "@huds0n/components";
import type { UtilityTypes } from "@huds0n/utilities";

export declare namespace Types {
  export type UseAnimatorStyleOptions = {
    animateOnMount?: AnimationProp;
    defaultAnimation?: DefaultAnimation;
    initialStyle?: StyleProp<ViewStyle>;
    useNativeDriver?: boolean;
  };

  export type AnimatorStyleOptions = UseAnimatorStyleOptions & {
    forceUpdateFn: () => void;
  };

  export type Animation = CommonAnimation &
    TimingAnimation &
    SpringAnimation &
    Partial<DecayAnimation>;

  export type DefaultAnimation = Omit<AnimationProp, "to">;

  export type Loop = number | boolean | { current: boolean };

  type CommonAnimation = {
    to: StyleProp<TextStyle>;
    loop?: Loop;
    onAnimationEnd?: OnAnimationEnd;
    onAnimationStart?: OnAnimationStart;
    type?: "TIMING" | "SPRING" | "DECAY";
  };

  export type OnAnimationStart = (animation: Animation) => void;
  export type OnAnimationEnd = (
    attachedProps: string[]
  ) => void | AnimationProp;

  type TimingAnimation = Omit<
    Parameters<typeof Animated.timing>[1],
    "toValue" | "useNativeDriver"
  >;
  type SpringAnimation = Omit<
    Parameters<typeof Animated.spring>[1],
    "toValue" | "useNativeDriver"
  >;
  type DecayAnimation = Omit<
    Parameters<typeof Animated.decay>[1],
    "toValue" | "useNativeDriver"
  >;

  export type AnimationProp = Animation | Animation[];

  export type LayoutAnimationProp = (
    layout: UtilityTypes.NodeMeasurements
  ) => AnimationProp;

  export type AttachProp = {
    at?: AttachPoint[];
    over?: AttachFunction;
    animatedValue: Animated.Value | number;
    deps?: any;
    easing?: EasingFunction;
    spring?: boolean | SpringAnimation;
    onAttach?: () => void;
  };

  export type EasingFunction = (value: number) => number;

  export type AttachPoint = {
    input: number;
    style: StyleProp<TextStyle>;
  };

  export type AttachFunction = {
    inputStart: number;
    inputEnd: number;
    points: number;
    fn: (input: number, progress: number) => TextStyle;
  };

  export type AnimateStyle<ItemT = any> =
    | ViewStyle
    | ((info: ListRenderItemInfoRN<ItemT>) => ViewStyle);

  type ExtractRef<P extends {}> = P extends { ref?: RefObject<infer R> }
    ? R
    : {};

  export type AnimatedComponentRef<C extends React.ComponentType<any>> = {
    animate: (animation: AnimationProp) => void;
    attach: (attach: AttachProp) => void;
    setStyle: (style: StyleProp<ViewStyle>) => void;
  } & (C extends new (...args: any) => any
    ? InstanceType<C>
    : C extends React.ComponentType<infer P>
    ? ExtractRef<P>
    : {});

  export type AnimatedComponentProps<P extends {}> = PropsWithChildren<P> & {
    animate?: AnimationProp | LayoutAnimationProp;
    attach?: AttachProp;
    defaultAnimation?: DefaultAnimation;
    useNativeDriver?: boolean;
  };

  export type AnimatedComponent<C extends React.ComponentType<any>> =
    C extends React.ComponentType<infer P>
      ? React.ForwardRefExoticComponent<
          React.PropsWithoutRef<AnimatedComponentProps<P>> &
            React.RefAttributes<AnimatedComponentRef<C>>
        >
      : never;

  export type ColorFaderContainerProps = ViewProps & {
    animate?: boolean;
    animation?: DefaultAnimation;
    backgroundColor?: string | null;
    children?: React.ReactElement | null | false;
    overrideColor?: string;
  };

  export type ContentsFaderContainerProps = ViewProps & {
    animate?: boolean;
    animationDuration?: number;
    children?: React.ReactNode | React.ReactNode[];
    dependencies: any;
    easing?: (value: number) => number;
    fadeOverlap?: number;
    onAnimationEnd?: (dependencies: any) => void;
    onAnimationStart?: (dependencies: any) => void;
    useNativeDriver?: boolean;
  };

  export type MoveableSnapAnimation = false | number | "SPRING";
  export type MoveableRef = {
    currentCoordinates: Coordinates;
    pan: Animated.ValueXY;
    snapTo: (coordinates: Coordinates, animate?: MoveableSnapAnimation) => void;
    snapToClosest: () => Coordinates;
  };

  type Coordinates = { x: number; y: number };

  export type MoveableProps = ViewProps & {
    children?: React.ReactNode;
    onMoveStart?: (coordinates: Coordinates) => any;
    onMoveEnd?: (coordinates: Coordinates) => any;
    onRelease?: (coordinates: Coordinates) => any;
    enable?: boolean;
    limitX?: [number, number];
    limitY?: [number, number];
    snapX?: number[];
    snapY?: number[];
    useNativeDriver?: boolean;
  };

  export type TransitionContainerProps = ContentsFaderContainerProps & {
    backgroundColor?: string | null;
    overrideColor?: string;
    onSizeChange?: (newSize: { height: number; width: number }) => any;
  };

  export type ListElementAttachPosition = {
    index: number;
    row: number;
    start: number;
    end: number;
  };

  export type ListRenderItemInfo<ItemT> = ListRenderItemInfoRN<ItemT> & {
    offsetAnim: Animated.Value;
    offsetValue: React.MutableRefObject<number>;
  } & ListElementAttachPosition;

  export type BaseListProps = {
    ListHeaderComponent?: React.ReactNode;
    ListFooterComponent?: React.ReactNode;
    contentOffset?: ComponentTypes.FlatListProps["contentOffset"];
    onScroll?: ComponentTypes.FlatListProps["onScroll"];
    renderItem?: ListRenderItemRN<any> | null;
    scrollEnabled?: boolean;
    style?: StyleProp<ViewStyle>;
  };

  export type AnimatedListProps<ItemT> = {
    animationDelay?: number;
    animationDuration?: number;
    at?: (elementPosition: ListElementAttachPosition) => AttachProp["at"];
    itemLength: number;
    footerOffset?: number;
    headerOffset?: number;
    ListComponent?: React.ComponentType<any>;
    offsetAnim?: Animated.Value;
    onAnimationEnd?: () => any;
    over?: (elementPosition: ListElementAttachPosition) => AttachProp["over"];
    renderItem: (info: ListRenderItemInfo<ItemT>) => React.ReactElement | null;
    useNativeDriver?: boolean;
  };

  export type ListProps<
    L extends BaseListProps = ComponentTypes.FlatListProps,
    ItemT = any
  > = Omit<
    L,
    | "renderItem"
    | "ListHeaderComponent"
    | "ListEmptyComponent"
    | "ListFooterComponent"
  > &
    AnimatedListProps<ItemT>;
}
