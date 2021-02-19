export const themingAnimatedView = {
  props: {
    animate: {
      to: 'viewStyle',
    },
    attach: {
      to: 'viewStyle',
    },
    style: 'viewStyle',
  },
} as const;

export const themingAnimatedText = {
  props: {
    animate: {
      to: 'textStyle',
    },
    attach: {
      to: 'textStyle',
    },
    style: 'textStyle',
  },
} as const;
