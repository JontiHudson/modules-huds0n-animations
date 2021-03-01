import React from 'react';
import { StyleSheet } from 'react-native';
import TinyColor from 'tinycolor2';

import { AnimatedView } from '@huds0n/animations';
import { Button, View } from '@huds0n/components';
import { useForceUpdate } from '@huds0n/utilities';

import { DemoState } from '../state';

export default function RandomAnimate() {
  const backPress = () => DemoState.setProp('screen', 'WELCOME');

  const randomHeight = Math.random() * 400;
  const randomWidth = Math.floor(Math.random() * 100) + '%';

  const randomBorderWidth = Math.random() * 30;
  const randomBorderRadius = Math.random() * randomHeight;

  const randomBackgroundColor = TinyColor.random().toRgbString();
  const randomBorderColor = TinyColor.random().toHexString();

  const randomTranslateX = Math.random() * 100 - 50;
  const randomTranslateY = Math.random() * 100 - 50;
  const randomRotate = Math.floor(Math.random() * 360) + 'deg';

  const randomRefresh = Math.random() * 3000;

  const forceUpdate = useForceUpdate();

  setTimeout(() => {
    forceUpdate();
  }, randomRefresh);

  return (
    <>
      <View style={styles.contentsContainer}>
        <AnimatedView
          animate={{
            to: {
              backgroundColor: randomBackgroundColor,
              borderColor: randomBorderColor,
              borderRadius: randomBorderRadius,
              borderWidth: randomBorderWidth,
              height: randomHeight,
              width: randomWidth,
              transform: [
                { translateX: randomTranslateX },
                { translateY: randomTranslateY },
                { rotate: randomRotate },
              ],
            },
            duration: 2000,
          }}
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
    justifyContent: 'center',
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
