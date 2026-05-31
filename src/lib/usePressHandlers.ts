import { useRef } from "react";
import type { MouseEvent, PointerEvent, TouchEvent } from "react";

type PressEvent<T extends HTMLElement> =
  | MouseEvent<T>
  | PointerEvent<T>
  | TouchEvent<T>;

type PressOptions = {
  disabled?: boolean;
};

export function usePressHandlers<T extends HTMLElement>(
  onPress: () => void,
  options: PressOptions = {},
) {
  const handledNativePress = useRef(false);

  const runPress = (event: PressEvent<T>) => {
    if (options.disabled) return;
    event.preventDefault();
    onPress();
  };

  return {
    onClick: (event: MouseEvent<T>) => {
      if (handledNativePress.current) {
        handledNativePress.current = false;
        return;
      }

      runPress(event);
    },
    onPointerUp: (event: PointerEvent<T>) => {
      if (event.pointerType === "mouse") return;
      handledNativePress.current = true;
      runPress(event);
    },
    onTouchEnd: (event: TouchEvent<T>) => {
      if (handledNativePress.current) return;
      handledNativePress.current = true;
      runPress(event);
    },
  };
}
