import React from 'react';
import { Dimensions, Image, StyleSheet } from 'react-native';

import { AnimationSheet, AnimatedFlatList } from '@huds0n/animations';
import { Button, View } from '@huds0n/components';
import { useCallback, useState, useRef } from '@huds0n/utilities';

import { DemoState } from '../state';

export default function AnimatedFlatListScreen() {
  const animatedListRef = useRef<AnimatedFlatList>(null);
  const [show, setShow] = useState(true);

  const itemAnimate: AnimatedFlatList.ItemAnimation = useCallback(
    (info) => (show ? animations.in : animations.out(info)),
    [show],
  );

  const backPress = () => DemoState.setProp('screen', 'WELCOME');

  const transitionPress = () => setShow(!show);
  const transitionLabel = show ? 'Hide' : 'Show';

  const flashButtonPress = () =>
    animatedListRef.current?.animate(animations.flash);

  return (
    <>
      <View style={styles.header}>
        <Button onPress={backPress}>Back</Button>
        <Button onPress={transitionPress}>{transitionLabel}</Button>
        <Button onPress={flashButtonPress}>Flash</Button>
      </View>

      <AnimatedFlatList
        ref={animatedListRef}
        data={DEMO_DATA}
        fade={{ bottom: true }}
        keyName="value"
        itemAnimate={itemAnimate}
        itemStartStyle={itemStartStyle}
        numColumns={2}
        renderItem={renderItem}
        useNativeDriver
      />
    </>
  );
}

const DEMO_DATA = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
  { value: 6 },
  { value: 7 },
  { value: 8 },
  { value: 9 },
  { value: 10 },
  { value: 11 },
  { value: 12 },
  { value: 13 },
  { value: 14 },
  { value: 15 },
  { value: 16 },
  { value: 17 },
  { value: 18 },
  { value: 19 },
  { value: 20 },
];

const PICTURE_URI =
  'https://c4.wallpaperflare.com/wallpaper/500/442/354/outrun-vaporwave-hd-wallpaper-preview.jpg';

function renderItem() {
  return (
    <View style={styles.itemContainer}>
      <Image source={{ uri: PICTURE_URI }} style={styles.itemPicture} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  itemContainer: {
    height: 150,
    flex: 1,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemPicture: {
    borderWidth: 2,
    height: '100%',
    width: '100%',
  },
});

const animations = AnimationSheet.create({
  flash: {
    to: { opacity: 0 },
    loop: 3,
    duration: 250,
  },
  in: {
    to: {
      opacity: 1,
      transform: [
        { scale: 1 },
        {
          translateX: 0,
        },
      ],
    },
    stagger: 250,
    staggerByRow: true,
    duration: 500,
  },
  out: ({ index }) => ({
    to: {
      opacity: 0,
      transform: [
        { scale: 0 },
        {
          translateX:
            index % 2 === 0
              ? -Dimensions.get('screen').width
              : Dimensions.get('screen').width,
        },
      ],
    },
    stagger: -250,
    staggerByRow: true,
    duration: 500,
  }),
});

const itemStartStyle: AnimatedFlatList.ItemStartStyle = (info) => ({
  ...animations.out(info).to,
  flex: 1,
});
