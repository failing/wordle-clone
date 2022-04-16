import produce from "immer";
import React, { useEffect, useRef, useState } from "react"
import { CharacterInputBox, CharacterInputType } from "./character-box"
import { useRecoilValue, useResetRecoilState } from "recoil";
import hotkeys from 'hotkeys-js';
import styles from './../../styles/wordrow.module.css';
import { lastPressedKey, bannedKeys, keyboardState } from "store";

interface CharacterState {
    letter: string,
    state: CharacterInputType;
}

interface WordState {
    word: CharacterState[];
    currentIndex: number
}

type WordRowProps = {
    length: number;
    onComplete: (correct: boolean, charactersToRemove: string[]) => void;
    correctWord: string;
}

export const WordRow = ({ length, onComplete, correctWord }: WordRowProps) => {
    const [currentWord, setCurrentWord] = useState<WordState>({ word: [...Array(length)].map((x, i) => ({ letter: '', state: 'untouched' })), currentIndex: 0 });
    const [frozen, setFrozen] = useState(false);
    const keyboardInput = useRecoilValue(lastPressedKey);
    const filterLetters = useRecoilValue(bannedKeys);
    const filterReset = useResetRecoilState(keyboardState);
    const controlKeys = ['Backspace', 'Enter'];
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView();
        }
        hotkeys.setScope("keyboard-scope");
        hotkeys('*', "keyboard-scope", (e: KeyboardEvent) => {
            handleKeyboardInput(e);
        });

        return () => {
            hotkeys.deleteScope('keyboard-scope');
        }
    });

    const handleKeyboardInput = (event: KeyboardEvent) => {
        if (event.type !== 'keydown') {
            return;
        }

        if (frozen) {
            return;
        }

        if (/[a-z]/i.test(event.key)) {
            if (controlKeys.includes(event.key)) {
                handleControlKeyboardInput(event.key);
            }
            else {
                if (currentWord.currentIndex < length && event.key.length === 1 && !filterLetters.includes(event.key.toUpperCase())) {
                    setCurrentWord(
                        produce(currentWord, draft => {
                            draft.word[draft.currentIndex].letter = event.key;
                            draft.currentIndex += 1;
                        })
                    );
                }
            }
        }
    }

    const handleControlKeyboardInput = (input: string) => {
        if (input === 'Enter') {
            tryFinishGame();
        }
        else if (input === 'Backspace') {
            if (currentWord.currentIndex >= 1) {
                setCurrentWord(produce(currentWord, draft => {
                    const newIndex = currentWord.currentIndex - 1;
                    draft.currentIndex = newIndex;
                    draft.word[newIndex].letter = '';
                }));
            }
        }
    }

    const tryFinishGame = () => {
        if (currentWord.currentIndex === length) {
            filterReset();
            setFrozen(true);
            const bannedCharacters = assignValidtyToCharacters();
            onComplete(currentWord.word.map(r => r.letter).join("").toLocaleLowerCase() === correctWord, bannedCharacters);
        }
    }

    useEffect(() => {
        if (keyboardInput.input && !frozen) {
            if (keyboardInput.input === '{bksp}') {
                if (currentWord.currentIndex >= 1) {
                    setCurrentWord(
                        produce((draft) => {
                            const newIndex = currentWord.currentIndex - 1;
                            draft.currentIndex = newIndex;
                            draft.word[newIndex].letter = '';
                        })
                    );
                }
            }
            else if (keyboardInput.input === '{enter}') {
                tryFinishGame();
            } else if (currentWord.currentIndex !== length) {
                setCurrentWord(
                    produce(currentWord, draft => {
                        draft.word[draft.currentIndex].letter = keyboardInput.input as string;
                        draft.currentIndex += 1;
                    })
                );
            }
        }
    }, [keyboardInput.input])

    const assignValidtyToCharacters = () => {
        const wordStateArray: CharacterState[] = currentWord.word.map(r => ({letter: r.letter, state: 'invalid'}));
        let word = correctWord;
        let currentChar = currentWord.word.map(r => r.letter);
        
        // Need to exhaust the entire string first
        for (let i = 0;i<currentChar.length;i++) {
            if (currentChar[i] === correctWord[i]) {
                word = word.replace(correctWord[i], '');
                wordStateArray[i] = {letter: currentChar[i], state: 'correct'};
                continue;
            }
        }

        // Then check any other chars whose state is still in the invalid state
        for(let i = 0;i<wordStateArray.length;i++) {
            if (word.includes(currentChar[i]) && wordStateArray[i].state === 'invalid') {
                word = word.replace(currentChar[i], '');
                wordStateArray[i] = {letter: currentChar[i], state: 'correct-character'};
                continue;
            }
        }

        setCurrentWord(produce(currentWord, draft => {
            for(let i = 0;i<currentWord.currentIndex;i++) {
                draft.word[i].state = wordStateArray[i].state;
            }
        }));

        return Array.from(new Set(wordStateArray.filter(r => {
            if (r.state === 'invalid' && !wordStateArray.some(a => a.letter === r.letter && (a.state === 'correct' || a.state === 'correct-character'))) {
                return true
            }
            return false;
        }).map(r => r.letter)));
    }

    return (
        <div className={styles.row} ref={ref}>
            {[...Array(length)].map((_, i) => <CharacterInputBox key={i} characterInputResult={currentWord.word[i].state} letter={currentWord.word[i].letter}></CharacterInputBox>)}
        </div>
    )
}