import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { ContentsFaderContainer } from '@huds0n/animations';

import AnimatedFlatList from './screens/AnimatedFlatList';
import MoveBall from './screens/MoveBall';
import PanHandler from './screens/PanHandler';
import TransitionContainer from './screens/TransitionContainer';
import Welcome from './screens/Welcome';

import { DemoState } from './state';

export default function App() {
  const [screen] = DemoState.useProp('screen');

  const ScreenSwitch = {
    ANIMATED_FLAT_LIST: <AnimatedFlatList />,
    MOVE_BALL: <MoveBall />,
    PANHANDLER: <PanHandler />,
    TRANSITION_CONTAINER: <TransitionContainer />,
    WELCOME: <Welcome />,
  };

  const CurrentScreen = ScreenSwitch[screen];

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ContentsFaderContainer
        animationDuration={500}
        style={styles.contentsFaderContainer}
        dependencies={screen}
      >
        {CurrentScreen}
      </ContentsFaderContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentsFaderContainer: { flex: 1 },
  safeAreaView: { flex: 1 },
});
