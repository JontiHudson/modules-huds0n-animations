import React, { useState } from 'react';
import { Easing, StyleSheet } from 'react-native';

import { AnimatedView } from '@huds0n/animations';
import { Button, Icon, View } from '@huds0n/components';

import { DemoState } from '../state';

export default function MoveBall() {
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  const whileUpPress = () => {
    const interval = setInterval(
      () => setTop((currentTop) => currentTop - 10),
      100,
    );
    return () => {
      clearInterval(interval);
    };
  };

  const whileDownPress = () => {
    const interval = setInterval(
      () => setTop((currentTop) => currentTop + 10),
      100,
    );
    return () => {
      clearInterval(interval);
    };
  };

  const whileLeftPress = () => {
    const interval = setInterval(
      () => setLeft((currentLeft) => currentLeft - 10),
      100,
    );
    return () => {
      clearInterval(interval);
    };
  };

  const whileRightPress = () => {
    const interval = setInterval(
      () => setLeft((currentLeft) => currentLeft + 10),
      100,
    );
    return () => {
      clearInterval(interval);
    };
  };

  const backPress = () => DemoState.setProp('screen', 'WELCOME');

  return (
    <>
      <View style={styles.contentsContainer}>
        <AnimatedView
          animate={{ to: { top, left }, duration: 100, easing: Easing.linear }}
          style={styles.ball}
        />
      </View>
      <View style={styles.controlsContainer}>
        <Icon {...icons.base} {...icons.up} whilePress={whileUpPress} />
        <Icon {...icons.base} {...icons.left} whilePress={whileLeftPress} />
        <Icon {...icons.base} {...icons.right} whilePress={whileRightPress} />
        <Icon {...icons.base} {...icons.down} whilePress={whileDownPress} />
      </View>
      <Button onPress={backPress} style={styles.backButton}>
        Back
      </Button>
    </>
  );
}

const colors = {
  RED: 'red',
};

const styles = StyleSheet.create({
  ball: {
    backgroundColor: colors.RED,
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  backButton: {
    bottom: 10,
    left: 10,
    position: 'absolute',
  },
  contentsContainer: {
    flex: 1,
  },
  controlsContainer: {
    alignSelf: 'center',
    borderRadius: 20,
    borderWidth: 1,
    height: 120,
    width: 120,
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
