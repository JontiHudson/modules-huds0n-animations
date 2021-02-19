import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { TransitionContainer } from '@huds0n/animations';
import { Button, View } from '@huds0n/components';
import { useState } from '@huds0n/utilities';

import { DemoState } from '../state';

export default function TransitionContainerScreen() {
  const [show, setShow] = useState(true);

  const backPress = () => DemoState.setProp('screen', 'WELCOME');

  const transitionPress = () => setShow(!show);
  const transitionLabel = show ? 'Hide' : 'Show';

  return (
    <>
      <View style={styles.contentsContainer}>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum
        </Text>

        <TransitionContainer
          style={styles.transitionContainer}
          dependencies={show ? 'SHOW' : 'HIDE'}
        >
          {show && (
            <Text style={styles.text}>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
              eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam
              est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
              velit, sed quia non numquam eius modi tempora incidunt ut labore
              et dolore magnam aliquam quaerat voluptatem.
            </Text>
          )}
        </TransitionContainer>

        <Text style={styles.text}>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
          aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
          qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
          dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed
          quia non numquam eius modi tempora incidunt ut labore et dolore magnam
          aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
          exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex
          ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in
          ea voluptate velit esse quam nihil molestiae consequatur, vel illum
          qui dolorem eum fugiat quo voluptas nulla pariatur?
        </Text>
      </View>
      <View style={styles.footer}>
        <Button onPress={backPress}>Back</Button>
        <Button onPress={transitionPress}>{transitionLabel}</Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  contentsContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  text: { padding: 20 },
  transitionContainer: { width: '100%' },
});
