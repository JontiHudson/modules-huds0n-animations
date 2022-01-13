"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitionContainer = void 0;
const tslib_1 = require("tslib");
const react_1 = (0, tslib_1.__importDefault)(require("react"));
const react_native_1 = require("react-native");
const utilities_1 = require("@huds0n/utilities");
const ContentsFader_1 = require("../ContentsFader");
const AnimatorStyle_1 = require("../../AnimatorStyle");
function TransitionContainer({ animate = true, animationDuration, backgroundColor, children, dependencies, fadeOverlap, onAnimationEnd, onAnimationStart, onSizeChange, style, pointerEvents, useNativeDriver, ...viewProps }) {
    const { innerStyle: { alignItems = "center", justifyContent = "center", ...innerStyle }, outerStyle: { backgroundColor: styleBackgroundColor, ...outerStyle }, } = (0, utilities_1.separateInnerOuterStyles)(style);
    const AnimatorStyle = (0, AnimatorStyle_1.useAnimatorStyle)({
        initialStyle: {
            backgroundColor: backgroundColor || styleBackgroundColor || undefined,
        },
    });
    (0, utilities_1.useEffect)(() => {
        animate &&
            AnimatorStyle.animate({
                to: { backgroundColor: backgroundColor || undefined },
                duration: animationDuration,
            });
    }, [backgroundColor], { layout: "BEFORE", skipMounts: true });
    const [{ height, width }, onLayout] = (0, utilities_1.useLayout)();
    (0, utilities_1.useEffect)(() => {
        onSizeChange?.({ height, width });
        animate
            ? AnimatorStyle.animate({
                to: { height, width },
                duration: animationDuration,
            })
            : AnimatorStyle.setStyle({ height, width });
    }, [height, width], { layout: "AFTER" });
    return (<>
      <react_native_1.View onLayout={onLayout} pointerEvents="none" style={{
            ...innerStyle,
            position: "absolute",
            opacity: 0,
        }}>
        {children}
      </react_native_1.View>
      <react_native_1.Animated.View {...viewProps} pointerEvents="box-none" style={[
            AnimatorStyle.style,
            {
                ...outerStyle,
                alignItems,
                justifyContent,
                overflow: "hidden",
            },
            !animate && { height: undefined, width: undefined },
        ]}>
        <ContentsFader_1.ContentsFaderContainer animate={animate} animationDuration={animationDuration || 1000} dependencies={dependencies} fadeOverlap={fadeOverlap} onAnimationEnd={onAnimationEnd} onAnimationStart={onAnimationStart} pointerEvents={pointerEvents} style={{
            alignItems,
            justifyContent,
            position: "absolute",
            height: outerStyle.height
                ? "100%"
                : react_native_1.Dimensions.get("screen").height,
            width: outerStyle.width ? "100%" : react_native_1.Dimensions.get("screen").width,
            ...innerStyle,
        }} useNativeDriver={useNativeDriver}>
          {children}
        </ContentsFader_1.ContentsFaderContainer>
      </react_native_1.Animated.View>
    </>);
}
exports.TransitionContainer = TransitionContainer;
