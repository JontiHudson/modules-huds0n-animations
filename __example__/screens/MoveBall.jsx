"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = (0, tslib_1.__importStar)(require("react"));
const react_native_1 = require("react-native");
const animations_1 = require("@huds0n/animations");
const components_1 = require("@huds0n/components");
const state_1 = require("../state");
function MoveBall() {
    const [top, setTop] = (0, react_1.useState)(0);
    const [left, setLeft] = (0, react_1.useState)(0);
    const whileUpPress = () => {
        const interval = setInterval(() => setTop((currentTop) => currentTop - 10), 100);
        return () => {
            clearInterval(interval);
        };
    };
    const whileDownPress = () => {
        const interval = setInterval(() => setTop((currentTop) => currentTop + 10), 100);
        return () => {
            clearInterval(interval);
        };
    };
    const whileLeftPress = () => {
        const interval = setInterval(() => setLeft((currentLeft) => currentLeft - 10), 100);
        return () => {
            clearInterval(interval);
        };
    };
    const whileRightPress = () => {
        const interval = setInterval(() => setLeft((currentLeft) => currentLeft + 10), 100);
        return () => {
            clearInterval(interval);
        };
    };
    const backPress = () => state_1.DemoState.setProp("screen", "WELCOME");
    return (<>
      <react_native_1.View style={styles.contentsContainer}>
        <animations_1.AnimatedView animate={{ to: { top, left }, duration: 100, easing: react_native_1.Easing.linear }} style={styles.ball}/>
      </react_native_1.View>
      <react_native_1.View style={styles.controlsContainer}>
        <components_1.Icon {...icons.base} {...icons.up} whilePress={whileUpPress}/>
        <components_1.Icon {...icons.base} {...icons.left} whilePress={whileLeftPress}/>
        <components_1.Icon {...icons.base} {...icons.right} whilePress={whileRightPress}/>
        <components_1.Icon {...icons.base} {...icons.down} whilePress={whileDownPress}/>
      </react_native_1.View>
      <components_1.Button onPress={backPress} style={styles.backButton}>
        Back
      </components_1.Button>
    </>);
}
exports.default = MoveBall;
const colors = {
    RED: "red",
};
const styles = react_native_1.StyleSheet.create({
    ball: {
        backgroundColor: colors.RED,
        borderRadius: 20,
        height: 40,
        width: 40,
    },
    backButton: {
        bottom: 10,
        left: 10,
        position: "absolute",
    },
    contentsContainer: {
        flex: 1,
    },
    controlsContainer: {
        alignSelf: "center",
        borderRadius: 20,
        borderWidth: 1,
        height: 120,
        width: 120,
    },
});
const icons = {
    base: {
        set: "AntDesign",
        size: 40,
    },
    down: {
        name: "caretdown",
        containerStyle: {
            alignSelf: "center",
            marginTop: 80,
            position: "absolute",
        },
    },
    left: {
        name: "caretleft",
        containerStyle: {
            alignSelf: "flex-start",
            marginTop: 40,
            position: "absolute",
        },
    },
    right: {
        name: "caretright",
        containerStyle: {
            alignSelf: "flex-end",
            marginTop: 40,
            position: "absolute",
        },
    },
    up: {
        name: "caretup",
        containerStyle: {
            alignSelf: "center",
            position: "absolute",
        },
    },
};
