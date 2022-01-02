import React from 'react';
import { Animated, ListRenderItemInfo, View, ViewProps } from 'react-native';

import { FlatList } from '@huds0n/components';
import {
  useAnimatedValue,
  useAnimatedCurrentValue,
  useCallback,
  useMemo,
  useState,
} from '@huds0n/utilities';

import { AnimatedView } from '../Containers';

import * as Types from './types';

type State = {
  refs: {
    AnimatedListComponent: Animated.AnimatedComponent<
      React.ComponentType<Types.BaseListProps>
    >;
    animationAnim: Animated.Value;
    animationValue: React.MutableRefObject<number>;
    animateInNumber: number;
    offsetAnim: Animated.Value;
    offsetValue: React.MutableRefObject<number>;
  };
  animationInStarted: boolean;
  animationInComplete: boolean;
  flatListLength: number;
};

type SetStateFn = (stateFn: (state: State) => State) => void;

export function AnimatedList(props: Types.ListProps) {
  const [state, setState] = handleState(props);

  return handleRender(props, state, setState);
}

function handleState({
  ListComponent,
  horizontal,
  contentOffset,
  offsetAnim = new Animated.Value(
    (horizontal ? contentOffset?.x : contentOffset?.y) || 0,
  ),
}: Types.ListProps) {
  const animationAnim = useAnimatedValue(-10000);
  const offsetValue = useAnimatedCurrentValue(offsetAnim);
  const animationValue = useAnimatedCurrentValue(animationAnim);

  return useState<State>(() => ({
    refs: {
      AnimatedListComponent: Animated.createAnimatedComponent(
        ListComponent || FlatList,
      ),
      animationAnim,
      animationValue,
      animateInNumber: 0,
      offsetAnim,
      offsetValue,
    },
    animationInComplete: false,
    animationInStarted: false,
    flatListLength: 0,
  }));
}

function handleRender(
  props: Types.ListProps,
  state: State,
  setState: SetStateFn,
) {
  const {
    headerOffset,
    footerOffset,
    scrollEnabled = true,
    style,
    ...passedProps
  } = props;
  const {
    animationInComplete,
    flatListLength,
    refs: { AnimatedListComponent },
  } = state;

  const onScroll = handleOnScroll(props, state);
  const renderItem = handleRenderItem(props, state, setState);
  const contentOffset = handleInitialOffset(props, state);

  return (
    <View
      onLayout={handleLayout(props, setState)}
      style={[{ height: '100%', width: '100%' }, style]}
    >
      {!!flatListLength && (
        <AnimatedListComponent
          style={{ height: '100%', width: '100%' }}
          scrollEventThrottle={16}
          {...passedProps}
          contentOffset={contentOffset}
          onScroll={onScroll}
          renderItem={renderItem}
          scrollEnabled={scrollEnabled && animationInComplete}
          ListHeaderComponent={
            headerOffset ? (
              <View style={{ height: headerOffset, width: headerOffset }} />
            ) : undefined
          }
          ListFooterComponent={
            footerOffset ? (
              <View style={{ height: footerOffset, width: footerOffset }} />
            ) : undefined
          }
        />
      )}
    </View>
  );
}

function handleLayout(
  props: Types.ListProps,
  setState: SetStateFn,
): ViewProps['onLayout'] {
  return useCallback(({ nativeEvent: { layout } }) => {
    const flatListLength = props.horizontal ? layout.width : layout.height;

    setState((currentState) => ({
      ...currentState,
      flatListLength,
    }));
  });
}

function animateIn(
  props: Types.ListProps,
  state: State,
  setState: SetStateFn,
  flatListLength: number,
) {
  const {
    animationDuration = 2500,
    animationDelay = 0,
    onAnimationEnd,
    useNativeDriver = false,
  } = props;
  const {
    refs: { animationAnim, offsetValue },
  } = state;

  setState((s) => ({ ...s, animationInStarted: true }));

  animationAnim.setValue(-flatListLength + offsetValue.current);

  setTimeout(() => {
    Animated.timing(animationAnim, {
      toValue: offsetValue.current,
      duration: animationDuration,
      useNativeDriver,
    }).start(({ finished }) => {
      if (finished) {
        onAnimationEnd?.();
        setState((currentState) => ({
          ...currentState,
          animationInComplete: true,
        }));
      } else {
        setTimeout(() => animateIn(props, state, setState, flatListLength), 50);
      }
    });
  }, animationDelay);
}

function handleOnScroll(
  { horizontal, onScroll, useNativeDriver = false }: Types.ListProps,
  { animationInComplete, refs: { offsetAnim } }: State,
): Types.BaseListProps['onScroll'] {
  return useCallback(
    (event) => {
      if (!animationInComplete) return undefined;

      const {
        nativeEvent: {
          contentOffset: { x, y },
        },
      } = event;

      Animated.timing(offsetAnim, {
        toValue: horizontal ? x : y,
        duration: 0,
        useNativeDriver,
      }).start();
      onScroll?.(event);
    },
    [animationInComplete],
  );
}

function handleRenderItem(
  props: Types.ListProps,
  state: State,
  setState: SetStateFn,
) {
  const { renderItem, useNativeDriver = false } = props;
  const {
    animationInComplete,
    animationInStarted,
    flatListLength,
    refs: { animationAnim, animationValue, offsetAnim, offsetValue },
  } = state;

  return useCallback(
    (info) => {
      const { at, over, start, end, row } = getAttachPoints(
        props,
        flatListLength,
        info,
      );

      if (
        !state.animationInStarted &&
        state.refs.animateInNumber < info.index
      ) {
        state.refs.animateInNumber = info.index;
      }

      return (
        <AnimatedView
          onLayout={() => {
            if (!state.animationInStarted) {
              if (info.index === state.refs.animateInNumber) {
                animateIn(props, state, setState, flatListLength);
              }
            }
          }}
          attach={
            state.animationInStarted
              ? {
                  at,
                  over,
                  animatedValue: animationInComplete
                    ? offsetAnim
                    : animationAnim,
                  deps: flatListLength,
                }
              : undefined
          }
          style={{ flex: 1, opacity: state.animationInStarted ? 1 : 0 }}
          useNativeDriver={useNativeDriver}
        >
          {renderItem({
            ...info,
            start,
            end,
            row,
            offsetAnim: animationInComplete ? offsetAnim : animationAnim,
            offsetValue: animationInComplete ? offsetValue : animationValue,
          })}
        </AnimatedView>
      );
    },
    [renderItem, animationInComplete, animationInStarted, flatListLength],
  );
}

function getAttachPoints(
  { at, over, headerOffset = 0, itemLength, numColumns = 1 }: Types.ListProps,
  flatListLength: number,
  info: ListRenderItemInfo<any>,
) {
  const { index } = info;
  const row = Math.floor(index / numColumns);

  const start = headerOffset + row * itemLength;
  const end = start - flatListLength;

  return {
    at: at?.({ index, row, start, end }),
    over: over?.({ index, row, start, end }),
    start,
    end,
    row,
  };
}

function handleInitialOffset(
  { horizontal }: Types.ListProps,
  { refs: { offsetValue } }: State,
) {
  return useMemo(() =>
    horizontal
      ? { x: offsetValue.current, y: 0 }
      : { x: 0, y: offsetValue.current },
  );
}
