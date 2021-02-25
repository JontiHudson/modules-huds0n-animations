import { SharedState } from '@huds0n/shared-state';

export type ScreenName =
  | 'ANIMATED_FLAT_LIST'
  | 'MOVE_BALL'
  | 'PANHANDLER'
  | 'RANDOM_ANIMATE'
  | 'TRANSITION_CONTAINER'
  | 'WELCOME';

type DemoState = {
  screen: ScreenName;
};

export const DemoState = new SharedState<DemoState>({
  screen: 'WELCOME',
});
