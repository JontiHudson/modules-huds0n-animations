import React from 'react';
import { Animated, Dimensions, View } from 'react-native';

import {
  separateInnerOuterStyles,
  useEffect,
  useLayout,
} from '@huds0n/utilities';

import { ContentsFaderContainer } from '../ContentsFader';

import { useAnimatorStyle } from '../../AnimatorStyle';

import { theming } from './theming';

export namespace TransitionContainer {
  export type Props = ContentsFaderContainer.Props & {
    backgroundColor?: string | null;
    overrideColor?: string;
  };

  export type Component = React.FunctionComponent<Props> & {
    theming: typeof theming;
  };
}

function _TransitionContainer({
  animate = true,
  animationDuration,
  backgroundColor,
  children,
  dependencies,
  fadeOverlap,
  style,
  ...viewProps
}: TransitionContainer.Props) {
  const {
    innerStyle,
    outerStyle: { backgroundColor: styleBackgroundColor, ...outerStyle },
  } = separateInnerOuterStyles(style);

  const AnimatorStyle = useAnimatorStyle({
    initialStyle: {
      backgroundColor: backgroundColor || styleBackgroundColor || undefined,
    },
  });

  useEffect(
    () => {
      animate &&
        AnimatorStyle.animate({
          to: { backgroundColor: backgroundColor || undefined },
          duration: animationDuration,
        });
    },
    [backgroundColor],
    { layout: 'BEFORE', skipMounts: true },
  );

  const [{ height, width }, onLayout] = useLayout();

  useEffect(
    () => {
      AnimatorStyle.animate({
        to: { height, width },
        duration: animationDuration,
      });
    },
    [height, width],
    { layout: 'AFTER' },
  );

  return (
    <>
      <View
        onLayout={onLayout}
        pointerEvents="none"
        style={{
          ...innerStyle,
          position: 'absolute',
          opacity: 0,
        }}
      >
        {children}
      </View>
      <Animated.View
        {...viewProps}
        pointerEvents="box-none"
        style={[
          AnimatorStyle.style,
          {
            ...outerStyle,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          },
        ]}
      >
        <ContentsFaderContainer
          animationDuration={animationDuration || 1000}
          fadeOverlap={fadeOverlap}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            height: outerStyle.height
              ? '100%'
              : Dimensions.get('screen').height,
            width: outerStyle.width ? '100%' : Dimensions.get('screen').width,
            ...innerStyle,
          }}
          dependencies={dependencies}
        >
          {children}
        </ContentsFaderContainer>
      </Animated.View>
    </>
  );
}

export const TransitionContainer: TransitionContainer.Component = Object.assign(
  _TransitionContainer,
  { theming },
);
