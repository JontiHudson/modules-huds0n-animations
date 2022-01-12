"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = (0, tslib_1.__importStar)(require("react"));
const react_native_1 = require("react-native");
const animations_1 = require("@huds0n/animations");
const components_1 = require("@huds0n/components");
const state_1 = require("../state");
function Welcome() {
    const [buttonId, setButtonId] = (0, react_1.useState)(0);
    const menuButtons = [
        {
            text: "Animated List",
            onPress: () => {
                state_1.DemoState.setProp("screen", "ANIMATED_FLAT_LIST");
            },
            backgroundColor: colors.PEACH,
        },
        {
            text: "Move Ball",
            onPress: () => {
                state_1.DemoState.setProp("screen", "MOVE_BALL");
            },
            backgroundColor: colors.LIGHT_GREEN,
        },
        {
            text: "Panhandler",
            onPress: () => {
                state_1.DemoState.setProp("screen", "PANHANDLER");
            },
            backgroundColor: colors.NAVY,
        },
        {
            text: "Random Animate",
            onPress: () => {
                state_1.DemoState.setProp("screen", "RANDOM_ANIMATE");
            },
            backgroundColor: colors.PEACH,
        },
        {
            text: "Transition Container",
            onPress: () => {
                state_1.DemoState.setProp("screen", "TRANSITION_CONTAINER");
            },
            backgroundColor: colors.LIGHT_BLUE,
        },
    ];
    const currentButton = menuButtons[buttonId];
    const prevPress = () => {
        setButtonId((currentId) => currentId > 0 ? currentId - 1 : menuButtons.length - 1);
    };
    const nextPress = () => {
        setButtonId((currentId) => currentId < menuButtons.length - 1 ? currentId + 1 : 0);
    };
    return (<>
      <animations_1.AnimatedView animate={animations.textPopIn} style={styles.textContainer} useNativeDriver>
        <animations_1.AnimatedText animate={animations.textFlash} style={styles.textStart}>
          Welcome
        </animations_1.AnimatedText>
      </animations_1.AnimatedView>

      <animations_1.AnimatedView animate={animations.footerSlideIn} style={styles.footer} useNativeDriver>
        <components_1.Button feedback="fade" onPress={prevPress} style={[styles.footerSideButton, { backgroundColor: colors.TEAL }]}>
          Prev
        </components_1.Button>

        <react_native_1.View style={styles.footerCenterButtonContainer}>
          <components_1.Pressable feedback="fade" onPress={currentButton.onPress}>
            <animations_1.TransitionContainer backgroundColor={currentButton.backgroundColor} style={{
            borderWidth: react_native_1.StyleSheet.hairlineWidth,
            height: 40,
            padding: 10,
            borderRadius: 10,
        }} dependencies={currentButton.text}>
              <react_native_1.Text style={styles.footerCenterButtonText}>
                {currentButton.text}
              </react_native_1.Text>
            </animations_1.TransitionContainer>
          </components_1.Pressable>
        </react_native_1.View>

        <components_1.Button feedback="fade" onPress={nextPress} style={[styles.footerSideButton, { backgroundColor: colors.NAVY }]}>
          Next
        </components_1.Button>
      </animations_1.AnimatedView>
    </>);
}
exports.default = Welcome;
const colors = {
    ORANGE: "#990000",
    RED: "#ffa500",
    TEAL: "#20b2aa",
    NAVY: "#468499",
    PEACH: "#faebd7",
    LIGHT_GREEN: "#dcedc1",
    LIGHT_BLUE: "#c0d6e4",
};
const styles = react_native_1.StyleSheet.create({
    footer: {
        position: "absolute",
        flexDirection: "row",
        bottom: 0,
        height: 60,
        width: "100%",
        transform: [{ translateY: 60 }],
    },
    footerCenterButton: {
        borderRadius: 10,
        borderWidth: react_native_1.StyleSheet.hairlineWidth,
        height: 40,
        padding: 10,
    },
    footerCenterButtonContainer: {
        alignItems: "center",
        flex: 2,
        justifyContent: "center",
    },
    footerCenterButtonText: {
        textAlign: "center",
    },
    footerSideButton: {
        flex: 1,
        margin: 10,
    },
    textContainer: {
        alignItems: "center",
        height: "100%",
        justifyContent: "center",
        position: "absolute",
        width: "100%",
    },
    textStart: {
        color: colors.ORANGE,
        fontSize: 48,
    },
});
const animations = animations_1.AnimationSheet.create({
    footerSlideIn: {
        to: {
            opacity: 1,
            transform: [{ translateY: 0 }],
        },
        duration: 1000,
    },
    textPopIn: {
        to: { transform: [{ scale: 1 }] },
        type: "SPRING",
        bounciness: 10,
        speed: 1,
    },
    textFlash: {
        to: { color: colors.RED },
        duration: 150,
        loop: true,
    },
});
