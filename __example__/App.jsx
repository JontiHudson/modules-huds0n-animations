"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = (0, tslib_1.__importDefault)(require("react"));
const react_native_1 = require("react-native");
const animations_1 = require("@huds0n/animations");
const AnimatedFlatList_1 = (0, tslib_1.__importDefault)(require("./screens/AnimatedFlatList"));
const MoveBall_1 = (0, tslib_1.__importDefault)(require("./screens/MoveBall"));
const PanHandler_1 = (0, tslib_1.__importDefault)(require("./screens/PanHandler"));
const RandomAnimate_1 = (0, tslib_1.__importDefault)(require("./screens/RandomAnimate"));
const TransitionContainer_1 = (0, tslib_1.__importDefault)(require("./screens/TransitionContainer"));
const Welcome_1 = (0, tslib_1.__importDefault)(require("./screens/Welcome"));
const state_1 = require("./state");
function App() {
    const [screen] = state_1.DemoState.useProp("screen");
    const ScreenSwitch = {
        ANIMATED_FLAT_LIST: <AnimatedFlatList_1.default />,
        MOVE_BALL: <MoveBall_1.default />,
        PANHANDLER: <PanHandler_1.default />,
        RANDOM_ANIMATE: <RandomAnimate_1.default />,
        TRANSITION_CONTAINER: <TransitionContainer_1.default />,
        WELCOME: <Welcome_1.default />,
    };
    const CurrentScreen = ScreenSwitch[screen];
    return (<react_native_1.SafeAreaView style={styles.safeAreaView}>
      <animations_1.ContentsFaderContainer animationDuration={500} style={styles.contentsFaderContainer} dependencies={screen}>
        {CurrentScreen}
      </animations_1.ContentsFaderContainer>
    </react_native_1.SafeAreaView>);
}
exports.default = App;
const styles = react_native_1.StyleSheet.create({
    contentsFaderContainer: { flex: 1 },
    safeAreaView: { flex: 1 },
});
