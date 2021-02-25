import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import {
  AnimatedText,
  AnimatedView,
  AnimationSheet,
  TransitionContainer,
} from '@huds0n/animations';
import { Button, Pressable, View } from '@huds0n/components';

import { DemoState } from '../state';

export default function Welcome() {
  const [buttonId, setButtonId] = useState(0);

  const menuButtons = [
    {
      text: 'Animated List',
      onPress: () => {
        DemoState.setProp('screen', 'ANIMATED_FLAT_LIST');
      },
      backgroundColor: colors.PEACH,
    },
    {
      text: 'Move Ball',
      onPress: () => {
        DemoState.setProp('screen', 'MOVE_BALL');
      },
      backgroundColor: colors.LIGHT_GREEN,
    },
    {
      text: 'Panhandler',
      onPress: () => {
        DemoState.setProp('screen', 'PANHANDLER');
      },
      backgroundColor: colors.NAVY,
    },
    {
      text: 'Random Animate',
      onPress: () => {
        DemoState.setProp('screen', 'RANDOM_ANIMATE');
      },
      backgroundColor: colors.PEACH,
    },
    {
      text: 'Transition Container',
      onPress: () => {
        DemoState.setProp('screen', 'TRANSITION_CONTAINER');
      },
      backgroundColor: colors.LIGHT_BLUE,
    },
  ];

  const currentButton = menuButtons[buttonId];

  const prevPress = () => {
    setButtonId((currentId) =>
      currentId > 0 ? currentId - 1 : menuButtons.length - 1,
    );
  };

  const nextPress = () => {
    setButtonId((currentId) =>
      currentId < menuButtons.length - 1 ? currentId + 1 : 0,
    );
  };

  return (
    <>
      <View style={styles.textContainer}>
        <AnimatedText
          animate={[animations.textPopIn, animations.textFlash]}
          style={styles.textStart}
        >
          Welcome
        </AnimatedText>
      </View>
      <View style={styles.footerContainer}>
        <AnimatedView animate={animations.footerSlideIn} style={styles.footer}>
          <Button
            feedback="fade"
            onPress={prevPress}
            style={[styles.footerSideButton, { backgroundColor: colors.TEAL }]}
          >
            Prev
          </Button>

          <View style={styles.footerCenterButtonContainer}>
            <Pressable feedback="fade" onPress={currentButton.onPress}>
              <TransitionContainer
                backgroundColor={currentButton.backgroundColor}
                style={{
                  borderWidth: StyleSheet.hairlineWidth,
                  height: 40,
                  padding: 10,
                  borderRadius: 10,
                }}
                dependencies={currentButton.text}
              >
                <Text style={styles.footerCenterButtonText}>
                  {currentButton.text}
                </Text>
              </TransitionContainer>
            </Pressable>
          </View>

          <Button
            feedback="fade"
            onPress={nextPress}
            style={[styles.footerSideButton, { backgroundColor: colors.NAVY }]}
          >
            Next
          </Button>
        </AnimatedView>
      </View>
    </>
  );
}

const colors = {
  ORANGE: '#990000',
  RED: '#ffa500',
  TEAL: '#20b2aa',
  NAVY: '#468499',
  PEACH: '#faebd7',
  LIGHT_GREEN: '#dcedc1',
  LIGHT_BLUE: '#c0d6e4',
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    top: '100%',
  },
  footerCenterButton: {
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    height: 40,
    padding: 10,
  },
  footerCenterButtonContainer: {
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center',
  },
  footerCenterButtonText: {
    textAlign: 'center',
  },
  footerContainer: {
    height: '100%',
    justifyContent: 'flex-end',
    position: 'absolute',
    width: '100%',
  },
  footerSideButton: {
    flex: 1,
    margin: 10,
  },
  textContainer: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
  textStart: {
    color: colors.ORANGE,
    fontSize: 48,
    transform: [{ scale: 0 }],
  },
});

const animations = AnimationSheet.create({
  footerSlideIn: {
    to: { top: '0%' },
    duration: 2000,
  },
  textPopIn: {
    to: { transform: [{ scale: 1 }] },
    type: 'SPRING',
    bounciness: 10,
    speed: 1,
  },
  textFlash: {
    to: { color: colors.RED },
    duration: 150,
    loop: true,
  },
});
