import { useMemo, useForceUpdate } from "@huds0n/utilities";

import { AnimatorStyle } from "./Class";
import type { Types } from "../types";

export function useAnimatorStyle(options: Types.UseAnimatorStyleOptions) {
  const forceUpdateFn = useForceUpdate();
  return useMemo(() => new AnimatorStyle({ ...options, forceUpdateFn }));
}
