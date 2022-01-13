"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimatedList = void 0;
const tslib_1 = require("tslib");
const react_1 = (0, tslib_1.__importDefault)(require("react"));
const react_native_1 = require("react-native");
const components_1 = require("@huds0n/components");
const utilities_1 = require("@huds0n/utilities");
const Containers_1 = require("../Containers");
function AnimatedList(props) {
    const [state, setState] = handleState(props);
    return handleRender(props, state, setState);
}
exports.AnimatedList = AnimatedList;
function handleState({ ListComponent, horizontal, contentOffset, offsetAnim = new react_native_1.Animated.Value((horizontal ? contentOffset === null || contentOffset === void 0 ? void 0 : contentOffset.x : contentOffset === null || contentOffset === void 0 ? void 0 : contentOffset.y) || 0), }) {
    const animationAnim = (0, utilities_1.useAnimatedValue)(-10000);
    const offsetValue = (0, utilities_1.useAnimatedCurrentValue)(offsetAnim);
    const animationValue = (0, utilities_1.useAnimatedCurrentValue)(animationAnim);
    return (0, utilities_1.useState)(() => ({
        refs: {
            AnimatedListComponent: react_native_1.Animated.createAnimatedComponent(ListComponent || components_1.FlatList),
            animationAnim,
            animationValue,
            animateInNumber: 0,
            offsetAnim,
            offsetValue,
        },
        animationInComplete: false,
        animationInStarted: false,
        flatListLength: 0,
    }));
}
function handleRender(props, state, setState) {
    const { headerOffset, footerOffset, scrollEnabled = true, style } = props, passedProps = (0, tslib_1.__rest)(props, ["headerOffset", "footerOffset", "scrollEnabled", "style"]);
    const { animationInComplete, flatListLength, refs: { AnimatedListComponent }, } = state;
    const onScroll = handleOnScroll(props, state);
    const renderItem = handleRenderItem(props, state, setState);
    const contentOffset = handleInitialOffset(props, state);
    return (<react_native_1.View onLayout={handleLayout(props, setState)} style={[{ height: "100%", width: "100%" }, style]}>
      {!!flatListLength && (<AnimatedListComponent style={{ height: "100%", width: "100%" }} scrollEventThrottle={16} {...passedProps} contentOffset={contentOffset} onScroll={onScroll} renderItem={renderItem} scrollEnabled={scrollEnabled && animationInComplete} ListHeaderComponent={headerOffset ? (<react_native_1.View style={{ height: headerOffset, width: headerOffset }}/>) : undefined} ListFooterComponent={footerOffset ? (<react_native_1.View style={{ height: footerOffset, width: footerOffset }}/>) : undefined}/>)}
    </react_native_1.View>);
}
function handleLayout(props, setState) {
    return (0, utilities_1.useCallback)(({ nativeEvent: { layout } }) => {
        const flatListLength = props.horizontal ? layout.width : layout.height;
        setState((currentState) => (Object.assign(Object.assign({}, currentState), { flatListLength })));
    });
}
function animateIn(props, state, setState, flatListLength) {
    const { animationDuration = 2500, animationDelay = 0, onAnimationEnd, useNativeDriver = false, } = props;
    const { refs: { animationAnim, offsetValue }, } = state;
    setState((s) => (Object.assign(Object.assign({}, s), { animationInStarted: true })));
    animationAnim.setValue(-flatListLength + offsetValue.current);
    setTimeout(() => {
        react_native_1.Animated.timing(animationAnim, {
            toValue: offsetValue.current,
            duration: animationDuration,
            useNativeDriver,
        }).start(({ finished }) => {
            if (finished) {
                onAnimationEnd === null || onAnimationEnd === void 0 ? void 0 : onAnimationEnd();
                setState((currentState) => (Object.assign(Object.assign({}, currentState), { animationInComplete: true })));
            }
            else {
                setTimeout(() => animateIn(props, state, setState, flatListLength), 50);
            }
        });
    }, animationDelay);
}
function handleOnScroll({ horizontal, onScroll, useNativeDriver = false }, { animationInComplete, refs: { offsetAnim } }) {
    return (0, utilities_1.useCallback)((event) => {
        if (!animationInComplete)
            return undefined;
        const { nativeEvent: { contentOffset: { x, y }, }, } = event;
        react_native_1.Animated.timing(offsetAnim, {
            toValue: horizontal ? x : y,
            duration: 0,
            useNativeDriver,
        }).start();
        onScroll === null || onScroll === void 0 ? void 0 : onScroll(event);
    }, [animationInComplete]);
}
function handleRenderItem(props, state, setState) {
    const { renderItem, useNativeDriver = false } = props;
    const { animationInComplete, animationInStarted, flatListLength, refs: { animationAnim, animationValue, offsetAnim, offsetValue }, } = state;
    return (0, utilities_1.useCallback)((info) => {
        const { at, over, start, end, row } = getAttachPoints(props, flatListLength, info);
        if (!state.animationInStarted &&
            state.refs.animateInNumber < info.index) {
            state.refs.animateInNumber = info.index;
        }
        return (<Containers_1.AnimatedView onLayout={() => {
                if (!state.animationInStarted) {
                    if (info.index === state.refs.animateInNumber) {
                        animateIn(props, state, setState, flatListLength);
                    }
                }
            }} attach={state.animationInStarted
                ? {
                    at,
                    over,
                    animatedValue: animationInComplete
                        ? offsetAnim
                        : animationAnim,
                    deps: flatListLength,
                }
                : undefined} style={{ flex: 1, opacity: state.animationInStarted ? 1 : 0 }} useNativeDriver={useNativeDriver}>
          {renderItem(Object.assign(Object.assign({}, info), { start,
                end,
                row, offsetAnim: animationInComplete ? offsetAnim : animationAnim, offsetValue: animationInComplete ? offsetValue : animationValue }))}
        </Containers_1.AnimatedView>);
    }, [renderItem, animationInComplete, animationInStarted, flatListLength]);
}
function getAttachPoints({ at, over, headerOffset = 0, itemLength, numColumns = 1 }, flatListLength, info) {
    const { index } = info;
    const row = Math.floor(index / numColumns);
    const start = headerOffset + row * itemLength;
    const end = start - flatListLength;
    return {
        at: at === null || at === void 0 ? void 0 : at({ index, row, start, end }),
        over: over === null || over === void 0 ? void 0 : over({ index, row, start, end }),
        start,
        end,
        row,
    };
}
function handleInitialOffset({ horizontal }, { refs: { offsetValue } }) {
    return (0, utilities_1.useMemo)(() => horizontal
        ? { x: offsetValue.current, y: 0 }
        : { x: 0, y: offsetValue.current });
}
