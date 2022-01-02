import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import {
  separateInnerOuterStyles,
  shallowCompareArrays,
} from '@huds0n/utilities';

import * as Types from './types';

export namespace ContentsFaderContainer {
  export type Props = Types.Props;
  export type Component = React.ComponentClass<Props>;
}

type State = {
  currentAnim: Animated.Value;
  currentKey: string;
  firstMount: boolean;
  update: () => void;
  prevChildren: Types.Children;
  prevDependencies: Types.Dependencies;
  prevElements: Map<string, JSX.Element>;
};

export const ContentsFaderContainer: ContentsFaderContainer.Component = class ContentsFaderContainerComponent extends React.Component<
  Types.Props,
  State
> {
  static DEFAULT_ANIMATION_DURATION = 500;
  static DEFAULT_FADE_OVERLAP = 1 / 3;

  static getDerivedStateFromProps(props: Types.Props, state: State) {
    const {
      currentAnim,
      currentKey,
      firstMount,
      prevChildren,
      prevDependencies,
      prevElements,
      update,
    } = state;
    const {
      animate = true,
      animationDuration = ContentsFaderContainerComponent.DEFAULT_ANIMATION_DURATION,
      children,
      dependencies,
      pointerEvents,
      fadeOverlap = ContentsFaderContainerComponent.DEFAULT_FADE_OVERLAP,
      style,
      useNativeDriver = true,
      onAnimationEnd,
      onAnimationStart,
    } = props;

    const depsChanged =
      firstMount || !shallowCompareArrays(prevDependencies, dependencies);

    let nextAnim = currentAnim;
    let nextKey = currentKey;

    if (depsChanged) {
      nextKey = Math.random().toString(36).substr(2, 9);

      const { innerStyle } = separateInnerOuterStyles(style);

      prevChildren &&
        prevElements.set(
          currentKey,
          <Animated.View
            key={currentKey}
            pointerEvents="none"
            style={StyleSheet.flatten([
              {
                position: 'absolute',
                height: '100%',
                width: '100%',
              },
              innerStyle,
              { opacity: currentAnim },
            ])}
          >
            {prevChildren}
          </Animated.View>,
        );

      if (animate) {
        Animated.timing(currentAnim, {
          toValue: 0,
          duration: animationDuration * (0.5 + fadeOverlap / 2),
          useNativeDriver,
        }).start(() => {
          prevElements.delete(currentKey);
          update();
          onAnimationEnd?.(dependencies);
        });
        onAnimationStart?.(dependencies);
      } else {
        prevElements.clear();
      }

      nextAnim = new Animated.Value(0);

      if (animate) {
        Animated.timing(nextAnim, {
          toValue: 1,
          delay: firstMount ? 0 : animationDuration * (0.5 - fadeOverlap / 2),
          duration: animationDuration * (0.5 + fadeOverlap / 2),
          useNativeDriver,
        }).start(() => {
          onAnimationEnd?.(dependencies);
        });
        onAnimationStart?.(dependencies);
      } else {
        nextAnim.setValue(1);
      }
    }

    return {
      currentAnim: nextAnim,
      currentKey: nextKey,
      firstMount: false,
      prevChildren: children,
      prevDependencies: dependencies,
    };
  }

  mounted: boolean;

  constructor(props: Types.Props) {
    super(props);

    this.mounted = true;
    this.state = {
      currentAnim: new Animated.Value(0),
      currentKey: 'INITIAL_KEY',
      firstMount: true,
      prevChildren: null,
      prevDependencies: props.dependencies,
      prevElements: new Map(),
      update: this.update.bind(this),
    };
  }

  update() {
    this.mounted && this.forceUpdate();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const {
      animate = true,
      animationDuration,
      children,
      style,
      pointerEvents,
      dependencies,
      ...viewProps
    } = this.props;
    const { currentAnim, currentKey, prevElements } = this.state;

    const { innerStyle, outerStyle } = separateInnerOuterStyles(style);

    return (
      <View
        {...viewProps}
        pointerEvents={pointerEvents}
        style={[outerStyle, { backgroundColor: innerStyle.backgroundColor }]}
      >
        {[
          ...Array.from(prevElements.values()),
          <Animated.View
            key={currentKey}
            pointerEvents={pointerEvents}
            style={StyleSheet.flatten([
              {
                position: 'absolute',
                height: '100%',
                width: '100%',
              },
              innerStyle,
              { opacity: currentAnim },
            ])}
          >
            {children}
          </Animated.View>,
        ]}
      </View>
    );
  }
};
