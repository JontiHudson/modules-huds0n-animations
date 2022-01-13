"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = (0, tslib_1.__importStar)(require("react"));
const react_native_1 = require("react-native");
const animations_1 = require("@huds0n/animations");
const components_1 = require("@huds0n/components");
const state_1 = require("../state");
const AnimationSheet_1 = require("../../src/AnimationSheet");
function PanHandler() {
    const backPress = () => state_1.DemoState.setProp("screen", "WELCOME");
    const panY = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    const panResponder = (0, react_1.useRef)(react_native_1.PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            panY.setOffset(panY._value);
        },
        onPanResponderMove: (event, gesture) => {
            panY.setValue(gesture.dy);
        },
        onPanResponderRelease: () => {
            panY.flattenOffset();
        },
    })).current;
    return (<>
      <react_native_1.View style={styles.contentsContainer}>
        <react_native_1.View style={styles.columnContainer}>
          <animations_1.AnimatedView {...panResponder.panHandlers} attach={{
            at: animations.left,
            animatedValue: panY,
        }} style={styles.viewBase}/>
        </react_native_1.View>
        <react_native_1.View style={styles.columnContainer}>
          <animations_1.AnimatedView attach={{
            over: animations.right,
            animatedValue: panY,
        }} style={[styles.viewBase, { backgroundColor: colors.GREEN }]}/>
        </react_native_1.View>
      </react_native_1.View>
      <components_1.Button onPress={backPress} style={styles.backButton}>
        Back
      </components_1.Button>
    </>);
}
exports.default = PanHandler;
const colors = {
    BLUE: "blue",
    RED: "red",
    GREEN: "green",
    BLACK: "black",
};
const styles = react_native_1.StyleSheet.create({
    backButton: {
        bottom: 10,
        left: 10,
        position: "absolute",
    },
    contentsContainer: {
        flexDirection: "row",
        flex: 1,
    },
    columnContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    viewBase: {
        height: 50,
        width: 50,
    },
});
const animations = AnimationSheet_1.AttachSheet.create({
    left: [
        {
            input: -200,
            style: {
                backgroundColor: colors.BLUE,
                transform: [{ translateY: -200 }],
            },
        },
        {
            input: 0,
            style: { backgroundColor: colors.BLACK },
        },
        {
            input: 200,
            style: {
                backgroundColor: colors.RED,
                transform: [{ translateY: 200 }],
            },
        },
    ],
    right: {
        inputStart: -200,
        inputEnd: 200,
        points: 20,
        fn: (input) => ({
            transform: [
                { translateY: input },
                {
                    translateX: Math.pow(input / 200, 3) * 80,
                },
            ],
        }),
    },
});
