import type { MouseEvent } from "react";

type PressOptions = {
  disabled?: boolean;
};

export function usePressHandlers<T extends HTMLElement>(
  onPress: () => void,
  options: PressOptions = {},
) {
  const runPress = (event: MouseEvent<T>) => {
    if (options.disabled) return;
    event.preventDefault();
    onPress();
  };

  return {
    onClick: (event: MouseEvent<T>) => {
      runPress(event);
    },
  };
}
