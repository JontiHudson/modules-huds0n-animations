import React, { useImperativeHandle, useRef } from "react";
import { Animated, Easing, PanResponder } from "react-native";

import {
  useAnimatedCurrentValue,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "@huds0n/utilities";

import type { Types } from "../../types";

function limitNum(source: number, limit: [number, number]) {
  if (source < limit[0]) return limit[0];
  if (source > limit[1]) return limit[1];
  return source;
}

function closestNum(source: number, arr: number[]) {
  return arr.reduce((prev, curr) =>
    Math.abs(curr - source) < Math.abs(prev - source) ? curr : prev
  );
}

export const MoveableView = React.forwardRef<
  Types.MoveableRef,
  Types.MoveableProps
>(
  (
    {
      children,
      enable = true,
      limitX,
      limitY,
      onMoveStart,
      onMoveEnd,
      onRelease,
      snapX,
      snapY,
      style,
      useNativeDriver = true,
      ...props
    },
    ref
  ) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const x = useAnimatedCurrentValue(pan.x);
    const y = useAnimatedCurrentValue(pan.y);

    const currentCoordinates = {
      get x() {
        return x.current;
      },
      get y() {
        return y.current;
      },
    };

    const limitDep = JSON.stringify(limitX) + JSON.stringify(limitY);
    const snapDep = JSON.stringify(snapX) + JSON.stringify(snapY);

    const [isMoving, setIsMoving] = useState(false);

    useEffect(
      () => {
        isMoving
          ? onMoveStart?.({ ...currentCoordinates })
          : onMoveEnd?.({ ...currentCoordinates });
      },
      [isMoving],
      { layout: "BEFORE" }
    );

    const snapTo: Types.MoveableRef["snapTo"] = useCallback(
      (toValue, animate = "SPRING") => {
        // Stops unneeded animation when movements are small
        const atPosition =
          Math.round(currentCoordinates.x) === toValue.x &&
          Math.round(currentCoordinates.y) === toValue.y;

        if (atPosition || !animate) {
          pan.setValue(toValue);
        } else if (animate === "SPRING") {
          setIsMoving(true);

          Animated.spring(pan, {
            toValue,
            bounciness: 0,
            useNativeDriver,
          }).start(() => {
            setIsMoving(false);
          });
        } else {
          setIsMoving(true);

          Animated.timing(pan, {
            duration: animate,
            easing: Easing.ease,
            toValue,
            useNativeDriver,
          }).start(() => {
            setIsMoving(false);
          });
        }
      },
      [onMoveStart, onMoveEnd]
    );

    const snapToClosest = useCallback(() => {
      let { x, y } = currentCoordinates;

      if (snapX) {
        x = closestNum(x, snapX);
      }

      if (snapY) {
        y = closestNum(y, snapY);
      }

      snapTo({ x, y });

      return { x, y };
    }, [snapDep, snapTo]);

    useImperativeHandle(
      ref,
      () => ({ currentCoordinates, pan, snapTo, snapToClosest }),
      [snapToClosest]
    );

    useEffect(() => {
      snapToClosest();
    }, [snapDep]);

    const offset = useRef({ x: 0, y: 0 });
    const panResponder = useMemo(
      () =>
        PanResponder.create({
          onStartShouldSetPanResponder: () => false,
          onStartShouldSetPanResponderCapture: () => false,
          onMoveShouldSetPanResponder: () => enable,
          onMoveShouldSetPanResponderCapture: () => false,
          onPanResponderTerminationRequest: () => enable,
          onPanResponderGrant: () => {
            setIsMoving(true);
            offset.current = { ...currentCoordinates };
          },
          onPanResponderMove: (event, gesture) => {
            const toValue = { x: 0, y: 0 };
            if (limitX) {
              toValue.x = limitNum(gesture.dx + offset.current.x, limitX);
            }
            if (limitY) {
              toValue.y = limitNum(gesture.dy + offset.current.y, limitY);
            }

            Animated.timing(pan, {
              duration: 0,
              toValue,
              useNativeDriver,
            }).start();
          },
          onPanResponderRelease: () => {
            const endCoordinates = snapToClosest();
            onRelease?.(endCoordinates);
          },
        }),
      [limitDep, snapToClosest, enable]
    );

    return (
      <Animated.View
        {...props}
        {...panResponder.panHandlers}
        style={[
          style,
          { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
        ]}
      >
        {children}
      </Animated.View>
    );
  }
);
