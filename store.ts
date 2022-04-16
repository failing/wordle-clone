import { atom, selector,  } from "recoil";

type KeyboardState = {
  char?: string;
  bannedChars: string;
}

const keyboardState = atom<KeyboardState>({
    key: 'keyboardState', // unique ID (with respect to other atoms/selectors)
    default: {
      bannedChars: ""
    }, // default value (aka initial value)
});

const lastPressedKey = selector({
    key: 'lastPressedKey', // unique ID (with respect to other atoms/selectors)
    get: ({get}) => {
      const state = get(keyboardState);
      return {input: state.char};
    }
});

const bannedKeys = selector({
  key: 'bannedKeys',
  get: ({get}) => {
    const state = get(keyboardState);

    return state.bannedChars;
  }
})

export {keyboardState, lastPressedKey, bannedKeys};