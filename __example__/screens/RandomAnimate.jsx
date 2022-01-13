"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = (0, tslib_1.__importDefault)(require("react"));
const react_native_1 = require("react-native");
const tinycolor2_1 = (0, tslib_1.__importDefault)(require("tinycolor2"));
const animations_1 = require("@huds0n/animations");
const components_1 = require("@huds0n/components");
const utilities_1 = require("@huds0n/utilities");
const state_1 = require("../state");
function RandomAnimate() {
    const backPress = () => state_1.DemoState.setProp('screen', 'WELCOME');
    const randomHeight = Math.random() * 400;
    const randomWidth = Math.floor(Math.random() * 100) + '%';
    const randomBorderWidth = Math.random() * 30;
    const randomBorderRadius = Math.random() * randomHeight;
    const randomBackgroundColor = tinycolor2_1.default.random().toRgbString();
    const randomBorderColor = tinycolor2_1.default.random().toHexString();
    const randomTranslateX = Math.random() * 100 - 50;
    const randomTranslateY = Math.random() * 100 - 50;
    const randomRotate = Math.floor(Math.random() * 360) + 'deg';
    const randomRefresh = Math.random() * 3000;
    const forceUpdate = (0, utilities_1.useForceUpdate)();
    setTimeout(() => {
        forceUpdate();
    }, randomRefresh);
    return (<>
      <react_native_1.View style={styles.contentsContainer}>
        <animations_1.AnimatedView animate={{
            to: {
                backgroundColor: randomBackgroundColor,
                borderColor: randomBorderColor,
                borderRadius: randomBorderRadius,
                borderWidth: randomBorderWidth,
                height: randomHeight,
                width: randomWidth,
                transform: [
                    { translateX: randomTranslateX },
                    { translateY: randomTranslateY },
                    { rotate: randomRotate },
                ],
            },
            duration: 2000,
        }}/>
      </react_native_1.View>
      <components_1.Button onPress={backPress} style={styles.backButton}>
        Back
      </components_1.Button>
    </>);
}
exports.default = RandomAnimate;
const colors = {
    BLUE: 'blue',
    RED: 'red',
};
const styles = react_native_1.StyleSheet.create({
    backButton: {
        bottom: 10,
        left: 10,
        position: 'absolute',
    },
    contentsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    boxStart: {
        backgroundColor: colors.RED,
        height: 50,
        width: 50,
    },
    boxEnd: {
        backgroundColor: colors.BLUE,
        height: 250,
        top: 300,
        width: 250,
        transform: [{ rotate: '360deg' }],
    },
});
