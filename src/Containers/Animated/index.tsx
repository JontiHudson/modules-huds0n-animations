import { Text, View } from "react-native";

import { createAnimatedComponent } from "./createAnimatedComponent";

export const AnimatedText = createAnimatedComponent(Text);
export const AnimatedView = createAnimatedComponent(View);

export * from "./createAnimatedComponent";
