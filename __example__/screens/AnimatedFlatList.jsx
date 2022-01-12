"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = (0, tslib_1.__importDefault)(require("react"));
const react_native_1 = require("react-native");
const animations_1 = require("@huds0n/animations");
const components_1 = require("@huds0n/components");
const utilities_1 = require("@huds0n/utilities");
const state_1 = require("../state");
const AnimationSheet_1 = require("../../src/AnimationSheet");
function AnimatedFlatListScreen() {
    const offsetAnim = (0, utilities_1.useAnimatedValue)(0);
    const backPress = () => state_1.DemoState.setProp("screen", "WELCOME");
    return (<react_native_1.View style={styles.container}>
      <animations_1.AnimatedText attach={{
            at: animations.header,
            animatedValue: offsetAnim,
        }} style={styles.headerText} useNativeDriver>
        Demo List
      </animations_1.AnimatedText>

      <animations_1.AnimatedList animationDuration={4000} itemLength={150} at={animations.listElements} data={DEMO_DATA} offsetAnim={offsetAnim} headerOffset={28} keyName="value" numColumns={2} renderItem={() => {
            return (<react_native_1.View style={styles.itemContainer}>
              <react_native_1.Image source={{ uri: PICTURE_URI }} style={styles.itemPicture}/>
            </react_native_1.View>);
        }} useNativeDriver reverseZIndex style={styles.flatlist}/>

      <animations_1.AnimatedView attach={{
            at: animations.footer,
            animatedValue: offsetAnim,
        }} useNativeDriver style={styles.footer}>
        <components_1.Button onPress={backPress}>Back</components_1.Button>
      </animations_1.AnimatedView>
    </react_native_1.View>);
}
exports.default = AnimatedFlatListScreen;
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
const PICTURE_URI = "https://c4.wallpaperflare.com/wallpaper/500/442/354/outrun-vaporwave-hd-wallpaper-preview.jpg";
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        overflow: "hidden",
    },
    headerText: {
        alignSelf: "center",
        textAlign: "center",
        backgroundColor: "blue",
        color: "white",
        fontSize: 30,
        height: 60,
        paddingTop: 10,
        paddingBottom: 10,
        position: "absolute",
        top: 0,
        width: "200%",
        zIndex: 100,
    },
    footer: {
        backgroundColor: "white",
        borderTopWidth: 1,
        bottom: 0,
        flexDirection: "row",
        height: 60,
        justifyContent: "center",
        paddingVertical: 10,
        position: "absolute",
        width: "100%",
    },
    flatlist: {
        paddingTop: 30,
    },
    itemContainer: {
        height: 150,
        flex: 1,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    itemPicture: {
        borderWidth: 2,
        height: "100%",
        width: "100%",
    },
});
const animations = AnimationSheet_1.AttachSheet.create({
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
                    { rotate: "0deg" },
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
                    { rotate: index % 2 ? "-360deg" : "360deg" },
                ],
            },
        },
    ],
});
