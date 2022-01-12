"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorFaderContainer = void 0;
const tslib_1 = require("tslib");
const react_1 = (0, tslib_1.__importDefault)(require("react"));
const react_native_1 = require("react-native");
const utilities_1 = require("@huds0n/utilities");
const AnimatorStyle_1 = require("../../AnimatorStyle");
function ColorFaderContainer(props) {
    const { animate = true, animation, backgroundColor, children, overrideColor, style, ...viewProps } = props;
    const AnimatorStyle = (0, AnimatorStyle_1.useAnimatorStyle)({
        initialStyle: {
            backgroundColor: backgroundColor ||
                react_native_1.StyleSheet.flatten(style).backgroundColor ||
                undefined,
        },
    });
    (0, utilities_1.useEffect)(() => {
        animate &&
            AnimatorStyle.animate({
                ...animation,
                to: { backgroundColor: backgroundColor || undefined },
            });
    }, [backgroundColor], { layout: "BEFORE", skipMounts: true });
    return (<react_native_1.Animated.View {...viewProps} style={[
            style,
            AnimatorStyle.style,
            !!overrideColor && { backgroundColor: overrideColor },
        ]}>
      {children}
    </react_native_1.Animated.View>);
}
exports.ColorFaderContainer = ColorFaderContainer;
