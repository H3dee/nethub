export const MS_PER_SECOND = 1_000;
export const REGULAR_INTERVAL_TIME = 15_000;
export const INITIAL_INTERVAL_TIME = 20_000;

export const eventCodes = {
  MOUSE_MOVE: 512,
  MOUSE_DOWN: 513,
  MOUSE_UP: 514,
  DRAG: 515
};

export const eventNames = {
  [eventCodes.MOUSE_MOVE]: 'Move',
  [eventCodes.MOUSE_DOWN]: 'Pressed',
  [eventCodes.MOUSE_UP]: 'Released',
  [eventCodes.DRAG]: "Drag"
};

export const buttonCodes = {
  LEFT: 0,
  RIGHT: 2,
  MIDDLE: 1,
  NO_BUTTON: 1000
}

export const buttonNames = {
  [buttonCodes.LEFT]: "Left",
  [buttonCodes.RIGHT]: "Right",
  [buttonCodes.NO_BUTTON]: "NoButton"
}