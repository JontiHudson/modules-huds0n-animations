import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import {
  separateInnerOuterStyles,
  shallowCompareArrays,
} from '@huds0n/utilities';

import { theming } from './theming';
import * as Types from './types';

export namespace ContentsFaderContainer {
  export type Props = Types.Props;
  export type Component = React.ComponentClass<Props> & {
    theming: typeof theming;
  };
}

type State = {
  currentAnim: Animated.Value;
  currentKey: string;
  firstMount: boolean;
  forceUpdate: () => void;
  prevChildren: Types.Children;
  prevDependencies: Types.Dependencies;
  prevElements: Map<string, JSX.Element>;
};

export const ContentsFaderContainer: ContentsFaderContainer.Component = class ContentsFaderContainerComponent extends React.Component<
  Types.Props,
  State
> {
  static theming = theming;
  static DEFAULT_ANIMATION_DURATION = 500;

  static getDerivedStateFromProps(props: Types.Props, state: State) {
    const {
      currentAnim,
      currentKey,
      firstMount,
      forceUpdate,
      prevChildren,
      prevDependencies,
      prevElements,
    } = state;
    const {
      animate = true,
      animationDuration = ContentsFaderContainerComponent.DEFAULT_ANIMATION_DURATION,
      children,
      dependencies,
      fadeOverlap = 1 / 3,
      style,
      useNativeDriver = true,
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
          forceUpdate();
        });
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
        }).start();
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

  constructor(props: Types.Props) {
    super(props);

    this.state = {
      currentAnim: new Animated.Value(0),
      currentKey: 'INITIAL_KEY',
      firstMount: true,
      forceUpdate: this.forceUpdate.bind(this),
      prevChildren: null,
      prevDependencies: props.dependencies,
      prevElements: new Map(),
    };
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
      <View {...viewProps} style={outerStyle}>
        {[
          ...Array.from(prevElements.values()),
          <Animated.View
            key={currentKey}
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
