import { useEffect, useRef } from "react";
import { replaceEqualDeep } from "@tanstack/react-query";

// https://github.com/TanStack/query/issues/6840#issuecomment-2385133632
export function useStable<T>(value: T) {
  const ref = useRef(value);
  const stable = replaceEqualDeep(ref.current, value);
  useEffect(() => {
    ref.current = stable;
  }, [stable]);
  return stable;
}
