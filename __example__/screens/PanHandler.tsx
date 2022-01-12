import React, { useRef } from "react";
import { Animated, PanResponder, StyleSheet, View } from "react-native";

import { AnimatedView, AnimationSheet } from "@huds0n/animations";
import { Button } from "@huds0n/components";

import { DemoState } from "../state";
import { AttachSheet } from "../../src/AnimationSheet";

export default function PanHandler() {
  const backPress = () => DemoState.setProp("screen", "WELCOME");

  const panY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // @ts-ignore
        panY.setOffset(panY._value);
      },
      onPanResponderMove: (event, gesture) => {
        panY.setValue(gesture.dy);
      },
      onPanResponderRelease: () => {
        panY.flattenOffset();
      },
    })
  ).current;

  return (
    <>
      <View style={styles.contentsContainer}>
        <View style={styles.columnContainer}>
          <AnimatedView
            {...panResponder.panHandlers}
            attach={{
              at: animations.left,
              animatedValue: panY,
            }}
            style={styles.viewBase}
          />
        </View>
        <View style={styles.columnContainer}>
          <AnimatedView
            attach={{
              over: animations.right,
              animatedValue: panY,
            }}
            style={[styles.viewBase, { backgroundColor: colors.GREEN }]}
          />
        </View>
      </View>
      <Button onPress={backPress} style={styles.backButton}>
        Back
      </Button>
    </>
  );
}

const colors = {
  BLUE: "blue",
  RED: "red",
  GREEN: "green",
  BLACK: "black",
};

const styles = StyleSheet.create({
  backButton: {
    bottom: 10,
    left: 10,
    position: "absolute",
  },
  contentsContainer: {
    flexDirection: "row",
    flex: 1,
  },
  columnContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  viewBase: {
    height: 50,
    width: 50,
  },
});

const animations = AttachSheet.create({
  left: [
    {
      input: -200,
      style: {
        backgroundColor: colors.BLUE,
        transform: [{ translateY: -200 }],
      },
    },
    {
      input: 0,
      style: { backgroundColor: colors.BLACK },
    },
    {
      input: 200,
      style: {
        backgroundColor: colors.RED,
        transform: [{ translateY: 200 }],
      },
    },
  ],
  right: {
    inputStart: -200,
    inputEnd: 200,
    points: 20,
    fn: (input) => ({
      transform: [
        { translateY: input },
        {
          translateX: Math.pow(input / 200, 3) * 80,
        },
      ],
    }),
  },
});
