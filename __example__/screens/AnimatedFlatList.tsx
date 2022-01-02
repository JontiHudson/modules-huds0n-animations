import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import {
  AnimatedList,
  AnimatedText,
  AnimatedView,
  AnimationSheet,
} from '@huds0n/animations';
import { Button } from '@huds0n/components';
import { useAnimatedValue } from '@huds0n/utilities';

import { DemoState } from '../state';

export default function AnimatedFlatListScreen() {
  const offsetAnim = useAnimatedValue(0);

  const backPress = () => DemoState.setProp('screen', 'WELCOME');

  return (
    <View style={styles.container}>
      <AnimatedText
        attach={{
          at: animations.header,
          animatedValue: offsetAnim,
        }}
        style={styles.headerText}
        useNativeDriver
      >
        Demo List
      </AnimatedText>

      <AnimatedList
        animationDuration={4000}
        itemLength={150}
        at={animations.listElements}
        data={DEMO_DATA}
        offsetAnim={offsetAnim}
        headerOffset={28}
        keyName="value"
        numColumns={2}
        renderItem={() => {
          return (
            <View style={styles.itemContainer}>
              <Image source={{ uri: PICTURE_URI }} style={styles.itemPicture} />
            </View>
          );
        }}
        useNativeDriver
        reverseZIndex
        style={styles.flatlist}
      />

      <AnimatedView
        attach={{
          at: animations.footer,
          animatedValue: offsetAnim,
        }}
        useNativeDriver
        style={styles.footer}
      >
        <Button onPress={backPress}>Back</Button>
      </AnimatedView>
    </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  headerText: {
    alignSelf: 'center',
    textAlign: 'center',
    backgroundColor: 'blue',
    color: 'white',
    fontSize: 30,
    height: 60,
    paddingTop: 10,
    paddingBottom: 10,
    position: 'absolute',
    top: 0,
    width: '200%',
    zIndex: 100,
  },
  footer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    paddingVertical: 10,
    position: 'absolute',
    width: '100%',
  },
  flatlist: {
    paddingTop: 30,
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
  header: [
    { input: 0, style: { transform: [{ translateY: 0 }, { scale: 1 }] } },
    { input: 30, style: { transform: [{ translateY: -15 }, { scale: 0.5 }] } },
  ],

  footer: [
    { input: 0, style: { transform: [{ translateY: 0 }] } },
    { input: 60, style: { transform: [{ translateY: 60 }] } },
  ],

  listElements: ({ index, start, end }) => [
    { input: start + 150, style: { opacity: 0.5 } },

    { input: start, style: { opacity: 1 } },

    {
      input: end + 200,
      style: { opacity: 1 },
    },

    {
      input: end + 100,
      style: {
        transform: [
          { translateX: 0 },
          { translateY: 0 },
          { scale: 1 },
          { rotate: '0deg' },
        ],
      },
    },

    {
      input: end,
      style: {
        opacity: 0,
        transform: [
          { translateX: index % 2 ? 150 : -150 },
          { translateY: -150 },
          { scale: 0 },
          { rotate: index % 2 ? '-360deg' : '360deg' },
        ],
      },
    },
  ],
});
