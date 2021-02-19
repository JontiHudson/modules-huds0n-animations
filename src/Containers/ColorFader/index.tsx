import React from 'react';
import { Animated, StyleSheet } from 'react-native';

import { useEffect } from '@huds0n/utilities';

import { useAnimatorStyle } from '../../AnimatorStyle';

import { theming } from './theming';
import * as Types from './types';

export namespace ColorFaderContainer {
  export type Children = Types.Children;
  export type Props = Types.Props;

  export type Component = React.FunctionComponent<Props> & {
    theming: typeof theming;
  };
}

function _ColorFaderContainer(props: ColorFaderContainer.Props) {
  const {
    animate = true,
    animation,
    backgroundColor,
    children,
    overrideColor,
    style,
    ...viewProps
  } = props;

  const AnimatorStyle = useAnimatorStyle({
    initialStyle: {
      backgroundColor:
        backgroundColor ||
        StyleSheet.flatten(style).backgroundColor ||
        undefined,
    },
  });

  useEffect(
    () => {
      animate &&
        AnimatorStyle.animate({
          ...animation,
          to: { backgroundColor: backgroundColor || undefined },
        });
    },
    [backgroundColor],
    { layout: 'BEFORE', skipMounts: true },
  );

  return (
    <Animated.View
      {...viewProps}
      style={[
        style,
        AnimatorStyle.style,
        !!overrideColor && { backgroundColor: overrideColor },
      ]}
    >
      {children}
    </Animated.View>
  );
}

export const ColorFaderContainer: ColorFaderContainer.Component = Object.assign(
  _ColorFaderContainer,
  { theming },
);
