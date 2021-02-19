import React from 'react';
import { PanResponder, StyleSheet } from 'react-native';

import { AnimatedView } from '@huds0n/animations';
import { Button, Icon, View } from '@huds0n/components';
import { useAnimatedValue, useRef } from '@huds0n/utilities';

import { DemoState } from '../state';

export default function PanHandler() {
  const backPress = () => DemoState.setProp('screen', 'WELCOME');

  const panY = useAnimatedValue();

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
    }),
  ).current;

  return (
    <>
      <View style={styles.contentsContainer}>
        <AnimatedView
          {...panResponder.panHandlers}
          attach={{
            to: styles.boxEnd,
            animatedValue: panY,
            inputRange: [0, 300],
          }}
          style={styles.boxStart}
        />
      </View>
      <Button onPress={backPress} style={styles.backButton}>
        Back
      </Button>
    </>
  );
}

const colors = {
  BLUE: 'blue',
  RED: 'red',
};

const styles = StyleSheet.create({
  backButton: {
    bottom: 10,
    left: 10,
    position: 'absolute',
  },
  contentsContainer: {
    alignItems: 'center',
    flex: 1,
  },
  boxStart: {
    backgroundColor: colors.RED,
    height: 50,
    width: 50,
  },
  boxEnd: {
    backgroundColor: colors.BLUE,
    height: 250,
    top: 300,
    width: 250,
    transform: [{ rotate: '360deg' }],
  },
});

const icons = Icon.createSheet({
  base: {
    set: 'AntDesign',
    size: 40,
  },
  down: {
    name: 'caretdown',
    containerStyle: {
      alignSelf: 'center',
      marginTop: 80,
      position: 'absolute',
    },
  },
  left: {
    name: 'caretleft',
    containerStyle: {
      alignSelf: 'flex-start',
      marginTop: 40,
      position: 'absolute',
    },
  },
  right: {
    name: 'caretright',
    containerStyle: {
      alignSelf: 'flex-end',
      marginTop: 40,
      position: 'absolute',
    },
  },
  up: {
    name: 'caretup',
    containerStyle: {
      alignSelf: 'center',
      position: 'absolute',
    },
  },
});
