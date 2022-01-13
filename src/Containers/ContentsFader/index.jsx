"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentsFaderContainer = void 0;
const tslib_1 = require("tslib");
const react_1 = (0, tslib_1.__importDefault)(require("react"));
const react_native_1 = require("react-native");
const utilities_1 = require("@huds0n/utilities");
const ContentsFaderContainer = class ContentsFaderContainerComponent extends react_1.default.Component {
    static DEFAULT_ANIMATION_DURATION = 500;
    static DEFAULT_FADE_OVERLAP = 1 / 3;
    static getDerivedStateFromProps(props, state) {
        const { currentAnim, currentKey, firstMount, prevChildren, prevDependencies, prevElements, update, } = state;
        const { animate = true, animationDuration = ContentsFaderContainerComponent.DEFAULT_ANIMATION_DURATION, children, dependencies, fadeOverlap = ContentsFaderContainerComponent.DEFAULT_FADE_OVERLAP, style, useNativeDriver = true, onAnimationEnd, onAnimationStart, } = props;
        const depsChanged = firstMount || !(0, utilities_1.shallowCompareArrays)(prevDependencies, dependencies);
        let nextAnim = currentAnim;
        let nextKey = currentKey;
        if (depsChanged) {
            nextKey = Math.random().toString(36).substr(2, 9);
            const { innerStyle } = (0, utilities_1.separateInnerOuterStyles)(style);
            prevChildren &&
                prevElements.set(currentKey, <react_native_1.Animated.View key={currentKey} pointerEvents="none" style={react_native_1.StyleSheet.flatten([
                        {
                            position: "absolute",
                            height: "100%",
                            width: "100%",
                        },
                        innerStyle,
                        { opacity: currentAnim },
                    ])}>
            {prevChildren}
          </react_native_1.Animated.View>);
            if (animate) {
                react_native_1.Animated.timing(currentAnim, {
                    toValue: 0,
                    duration: animationDuration * (0.5 + fadeOverlap / 2),
                    useNativeDriver,
                }).start(() => {
                    prevElements.delete(currentKey);
                    update();
                    onAnimationEnd?.(dependencies);
                });
                onAnimationStart?.(dependencies);
            }
            else {
                prevElements.clear();
            }
            nextAnim = new react_native_1.Animated.Value(0);
            if (animate) {
                react_native_1.Animated.timing(nextAnim, {
                    toValue: 1,
                    delay: firstMount ? 0 : animationDuration * (0.5 - fadeOverlap / 2),
                    duration: animationDuration * (0.5 + fadeOverlap / 2),
                    useNativeDriver,
                }).start(() => {
                    onAnimationEnd?.(dependencies);
                });
                onAnimationStart?.(dependencies);
            }
            else {
                nextAnim.setValue(1);
            }
        }
        return {
            currentAnim: nextAnim,
            currentKey: nextKey,
            firstMount: false,
            prevChildren: children,
            prevDependencies: dependencies,
        };
    }
    mounted;
    constructor(props) {
        super(props);
        this.mounted = true;
        this.state = {
            currentAnim: new react_native_1.Animated.Value(0),
            currentKey: "INITIAL_KEY",
            firstMount: true,
            prevChildren: null,
            prevDependencies: props.dependencies,
            prevElements: new Map(),
            update: this.update.bind(this),
        };
    }
    update() {
        this.mounted && this.forceUpdate();
    }
    componentWillUnmount() {
        this.mounted = false;
    }
    render() {
        const { animate = true, animationDuration, children, style, pointerEvents, dependencies, ...viewProps } = this.props;
        const { currentAnim, currentKey, prevElements } = this.state;
        const { innerStyle, outerStyle } = (0, utilities_1.separateInnerOuterStyles)(style);
        return (<react_native_1.View {...viewProps} pointerEvents={pointerEvents} style={[outerStyle, { backgroundColor: innerStyle.backgroundColor }]}>
        {[
                ...Array.from(prevElements.values()),
                <react_native_1.Animated.View key={currentKey} pointerEvents={pointerEvents} style={react_native_1.StyleSheet.flatten([
                        {
                            position: "absolute",
                            height: "100%",
                            width: "100%",
                        },
                        innerStyle,
                        { opacity: currentAnim },
                    ])}>
            {children}
          </react_native_1.Animated.View>,
            ]}
      </react_native_1.View>);
    }
};
exports.ContentsFaderContainer = ContentsFaderContainer;
