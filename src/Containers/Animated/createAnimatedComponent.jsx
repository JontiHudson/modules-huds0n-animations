"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnimatedComponent = void 0;
const tslib_1 = require("tslib");
const react_1 = (0, tslib_1.__importStar)(require("react"));
const react_native_1 = require("react-native");
const utilities_1 = require("@huds0n/utilities");
const AnimatorStyle_1 = require("../../AnimatorStyle");
function ensureClassComponent(Component) {
    if (typeof Component === "function" &&
        !!Component.prototype.isReactComponent) {
        return Component;
    }
    return class extends react_1.default.Component {
        constructor(props) {
            super(props);
        }
        render() {
            return <Component {...this.props}/>;
        }
    };
}
function createAnimatedComponent(Component) {
    const AnimatedComponent = react_native_1.Animated.createAnimatedComponent(ensureClassComponent(Component));
    return react_1.default.forwardRef((_a, ref) => {
        var { attach, defaultAnimation, useNativeDriver, style, animate } = _a, props = (0, tslib_1.__rest)(_a, ["attach", "defaultAnimation", "useNativeDriver", "style", "animate"]);
        const copiedRef = (0, utilities_1.useRef)(null);
        const AnimatorStyle = (0, AnimatorStyle_1.useAnimatorStyle)({
            defaultAnimation,
            initialStyle: style,
            useNativeDriver,
        });
        (0, utilities_1.useEffect)(() => {
            attach && AnimatorStyle.attach(attach);
        }, [attach === null || attach === void 0 ? void 0 : attach.animatedValue, JSON.stringify(attach), attach === null || attach === void 0 ? void 0 : attach.deps], { layout: "BEFORE" });
        const prevStyle = (0, utilities_1.usePrev)(style) || {};
        (0, utilities_1.useEffect)(() => {
            if (style) {
                const changedStyle = Object.fromEntries(Object.entries(react_native_1.StyleSheet.flatten(style)).filter(([key, prop]) => prop !== react_native_1.StyleSheet.flatten(prevStyle)[key]));
                AnimatorStyle.setStyle(changedStyle);
            }
        }, [JSON.stringify(style)], { layout: "BEFORE", skipMounts: true });
        const animationChangeDep = typeof animate === "function"
            ? animate
            : animate && JSON.stringify((0, utilities_1.toArray)(animate).map((a) => a.to));
        (0, utilities_1.useEffect)(() => {
            if (!animate || typeof animate === "function")
                return;
            AnimatorStyle.animate(animate);
        }, [animationChangeDep], { layout: "BEFORE" });
        (0, utilities_1.useEffect)(() => {
            if (typeof animate === "function") {
                (0, utilities_1.measureNodeAsync)(copiedRef.current).then((layout) => {
                    AnimatorStyle.animate(animate(layout));
                });
            }
        }, [animationChangeDep], { layout: "AFTER" });
        (0, react_1.useImperativeHandle)(ref, () => (Object.assign(Object.assign({}, copiedRef.current), { animate: AnimatorStyle.animate, attach: AnimatorStyle.attach, setStyle: AnimatorStyle.setStyle })));
        return (<AnimatedComponent ref={copiedRef} {...props} style={AnimatorStyle.style}/>);
    });
}
exports.createAnimatedComponent = createAnimatedComponent;
