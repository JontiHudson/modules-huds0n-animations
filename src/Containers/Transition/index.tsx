import React from 'react';
import { Animated, Dimensions, View } from 'react-native';

import {
  separateInnerOuterStyles,
  useEffect,
  useLayout,
} from '@huds0n/utilities';

import { ContentsFaderContainer } from '../ContentsFader';

import { useAnimatorStyle } from '../../AnimatorStyle';

export namespace TransitionContainer {
  export type Props = ContentsFaderContainer.Props & {
    backgroundColor?: string | null;
    overrideColor?: string;
    onSizeChange?: (newSize: { height: number; width: number }) => any;
  };

  export type Component = React.FunctionComponent<Props>;
}

export function TransitionContainer({
  animate = true,
  animationDuration,
  backgroundColor,
  children,
  dependencies,
  fadeOverlap,
  onAnimationEnd,
  onAnimationStart,
  onSizeChange,
  style,
  pointerEvents,
  useNativeDriver,
  ...viewProps
}: TransitionContainer.Props) {
  const {
    innerStyle: {
      alignItems = 'center',
      justifyContent = 'center',
      ...innerStyle
    },
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
      onSizeChange?.({ height, width });
      animate
        ? AnimatorStyle.animate({
            to: { height, width },
            duration: animationDuration,
          })
        : AnimatorStyle.setStyle({ height, width });
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
            alignItems,
            justifyContent,
            overflow: 'hidden',
          },
          !animate && { height: undefined, width: undefined },
        ]}
      >
        <ContentsFaderContainer
          animate={animate}
          animationDuration={animationDuration || 1000}
          dependencies={dependencies}
          fadeOverlap={fadeOverlap}
          onAnimationEnd={onAnimationEnd}
          onAnimationStart={onAnimationStart}
          pointerEvents={pointerEvents}
          style={{
            alignItems,
            justifyContent,
            position: 'absolute',
            height: outerStyle.height
              ? '100%'
              : Dimensions.get('screen').height,
            width: outerStyle.width ? '100%' : Dimensions.get('screen').width,
            ...innerStyle,
          }}
          useNativeDriver={useNativeDriver}
        >
          {children}
        </ContentsFaderContainer>
      </Animated.View>
    </>
  );
}
