"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveableView = void 0;
const tslib_1 = require("tslib");
const react_1 = (0, tslib_1.__importStar)(require("react"));
const react_native_1 = require("react-native");
const utilities_1 = require("@huds0n/utilities");
function limitNum(source, limit) {
    if (source < limit[0])
        return limit[0];
    if (source > limit[1])
        return limit[1];
    return source;
}
function closestNum(source, arr) {
    return arr.reduce((prev, curr) => Math.abs(curr - source) < Math.abs(prev - source) ? curr : prev);
}
exports.MoveableView = react_1.default.forwardRef(({ children, enable = true, limitX, limitY, onMoveStart, onMoveEnd, onRelease, snapX, snapY, style, useNativeDriver = true, ...props }, ref) => {
    const pan = (0, react_1.useRef)(new react_native_1.Animated.ValueXY()).current;
    const x = (0, utilities_1.useAnimatedCurrentValue)(pan.x);
    const y = (0, utilities_1.useAnimatedCurrentValue)(pan.y);
    const currentCoordinates = {
        get x() {
            return x.current;
        },
        get y() {
            return y.current;
        },
    };
    const limitDep = JSON.stringify(limitX) + JSON.stringify(limitY);
    const snapDep = JSON.stringify(snapX) + JSON.stringify(snapY);
    const [isMoving, setIsMoving] = (0, utilities_1.useState)(false);
    (0, utilities_1.useEffect)(() => {
        isMoving
            ? onMoveStart?.({ ...currentCoordinates })
            : onMoveEnd?.({ ...currentCoordinates });
    }, [isMoving], { layout: "BEFORE" });
    const snapTo = (0, utilities_1.useCallback)((toValue, animate = "SPRING") => {
        const atPosition = Math.round(currentCoordinates.x) === toValue.x &&
            Math.round(currentCoordinates.y) === toValue.y;
        if (atPosition || !animate) {
            pan.setValue(toValue);
        }
        else if (animate === "SPRING") {
            setIsMoving(true);
            react_native_1.Animated.spring(pan, {
                toValue,
                bounciness: 0,
                useNativeDriver,
            }).start(() => {
                setIsMoving(false);
            });
        }
        else {
            setIsMoving(true);
            react_native_1.Animated.timing(pan, {
                duration: animate,
                easing: react_native_1.Easing.ease,
                toValue,
                useNativeDriver,
            }).start(() => {
                setIsMoving(false);
            });
        }
    }, [onMoveStart, onMoveEnd]);
    const snapToClosest = (0, utilities_1.useCallback)(() => {
        let { x, y } = currentCoordinates;
        if (snapX) {
            x = closestNum(x, snapX);
        }
        if (snapY) {
            y = closestNum(y, snapY);
        }
        snapTo({ x, y });
        return { x, y };
    }, [snapDep, snapTo]);
    (0, react_1.useImperativeHandle)(ref, () => ({ currentCoordinates, pan, snapTo, snapToClosest }), [snapToClosest]);
    (0, utilities_1.useEffect)(() => {
        snapToClosest();
    }, [snapDep]);
    const offset = (0, react_1.useRef)({ x: 0, y: 0 });
    const panResponder = (0, utilities_1.useMemo)(() => react_native_1.PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponder: () => enable,
        onMoveShouldSetPanResponderCapture: () => false,
        onPanResponderTerminationRequest: () => enable,
        onPanResponderGrant: () => {
            setIsMoving(true);
            offset.current = { ...currentCoordinates };
        },
        onPanResponderMove: (event, gesture) => {
            const toValue = { x: 0, y: 0 };
            if (limitX) {
                toValue.x = limitNum(gesture.dx + offset.current.x, limitX);
            }
            if (limitY) {
                toValue.y = limitNum(gesture.dy + offset.current.y, limitY);
            }
            react_native_1.Animated.timing(pan, {
                duration: 0,
                toValue,
                useNativeDriver,
            }).start();
        },
        onPanResponderRelease: () => {
            const endCoordinates = snapToClosest();
            onRelease?.(endCoordinates);
        },
    }), [limitDep, snapToClosest, enable]);
    return (<react_native_1.Animated.View {...props} {...panResponder.panHandlers} style={[
            style,
            { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
        ]}>
        {children}
      </react_native_1.Animated.View>);
});
