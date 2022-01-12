import React, { useImperativeHandle } from "react";
import { Animated, StyleProp, StyleSheet, ViewStyle } from "react-native";

import {
  measureNodeAsync,
  toArray,
  useEffect,
  usePrev,
  useRef,
} from "@huds0n/utilities";

import { useAnimatorStyle } from "../../AnimatorStyle";
import type { Types } from "../../types";

function ensureClassComponent<P>(
  Component: ((props: P & any) => React.ReactElement) | React.ComponentType<P>
): React.ComponentType<any> {
  if (
    typeof Component === "function" &&
    !!Component.prototype.isReactComponent
  ) {
    return Component;
  }

  return class extends React.Component {
    constructor(props: P) {
      super(props);
    }

    render() {
      // @ts-ignore
      return <Component {...this.props} />;
    }
  };
}

export function createAnimatedComponent<
  C extends ((props: P & any) => React.ReactElement) | React.ComponentType<P>,
  P extends { style?: S },
  S extends StyleProp<ViewStyle>
>(Component: C): Types.AnimatedComponent<C> {
  const AnimatedComponent = Animated.createAnimatedComponent(
    ensureClassComponent(Component)
  );

  // @ts-ignore
  return React.forwardRef<
    Types.AnimatedComponentRef<C>,
    Types.AnimatedComponentProps<P>
  >(
    (
      { attach, defaultAnimation, useNativeDriver, style, animate, ...props },
      ref
    ) => {
      const copiedRef = useRef<any>(null);

      const AnimatorStyle = useAnimatorStyle({
        defaultAnimation,
        initialStyle: style,
        useNativeDriver,
      });

      useEffect(
        () => {
          attach && AnimatorStyle.attach(attach);
        },
        [attach?.animatedValue, JSON.stringify(attach), attach?.deps],
        { layout: "BEFORE" }
      );

      const prevStyle = usePrev(style) || {};

      useEffect(
        () => {
          if (style) {
            const changedStyle = Object.fromEntries(
              Object.entries(StyleSheet.flatten(style)).filter(
                // @ts-ignore
                ([key, prop]) => prop !== StyleSheet.flatten(prevStyle)[key]
              )
            );

            AnimatorStyle.setStyle(changedStyle);
          }
        },
        [JSON.stringify(style)],
        { layout: "BEFORE", skipMounts: true }
      );

      const animationChangeDep =
        typeof animate === "function"
          ? animate
          : animate && JSON.stringify(toArray(animate).map((a) => a.to));

      useEffect(
        () => {
          if (!animate || typeof animate === "function") return;

          AnimatorStyle.animate(animate);
        },
        [animationChangeDep],
        { layout: "BEFORE" }
      );

      useEffect(
        () => {
          if (typeof animate === "function") {
            measureNodeAsync(copiedRef.current).then((layout) => {
              AnimatorStyle.animate(animate(layout));
            });
          }
        },
        [animationChangeDep],
        { layout: "AFTER" }
      );

      useImperativeHandle(
        ref,
        () =>
          ({
            ...copiedRef.current,
            animate: AnimatorStyle.animate,
            attach: AnimatorStyle.attach,
            setStyle: AnimatorStyle.setStyle,
          } as Types.AnimatedComponentRef<C>)
      );

      return (
        // @ts-ignore
        <AnimatedComponent
          ref={copiedRef}
          {...props}
          style={AnimatorStyle.style}
        />
      );
    }
  );
}
