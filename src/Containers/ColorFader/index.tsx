import React from "react";
import { Animated, StyleSheet } from "react-native";

import { useEffect } from "@huds0n/utilities";

import { useAnimatorStyle } from "../../AnimatorStyle";

import type { Types } from "../../types";

export function ColorFaderContainer(props: Types.ColorFaderContainerProps) {
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
    { layout: "BEFORE", skipMounts: true }
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
