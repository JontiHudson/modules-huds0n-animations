"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimatedView = exports.AnimatedText = void 0;
const tslib_1 = require("tslib");
const react_native_1 = require("react-native");
const createAnimatedComponent_1 = require("./createAnimatedComponent");
exports.AnimatedText = (0, createAnimatedComponent_1.createAnimatedComponent)(react_native_1.Text);
exports.AnimatedView = (0, createAnimatedComponent_1.createAnimatedComponent)(react_native_1.View);
(0, tslib_1.__exportStar)(require("./createAnimatedComponent"), exports);
