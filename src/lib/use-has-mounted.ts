import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

// Returns false during SSR/hydration and true once mounted on the client,
// without the setState-in-effect pattern that trips the react-hooks lint rule.
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
