import { useEffect, useState } from 'react'
import React from 'react';
import styles from '../../styles/characterbox.module.css';
import { AnimatePresence, motion } from "framer-motion"
import clsx from 'clsx';

export type CharacterInputType = "correct" | "correct-character" | "invalid" | "untouched";

type CharacterInputBoxProps = {
    characterInputResult?: CharacterInputType;
    letter?: string;
}

export const CharacterInputBox = React.forwardRef(function CharacterInputBox({ characterInputResult, letter }: CharacterInputBoxProps, ref: any) {
    const [character, setCharacter] = useState<string>("");
    const [currentInputResult, setInputResult] = useState(characterInputResult);

    const keyframes = [0.2, 0.4, 0.6, 0.8, 1, 1.2, 1];


    const variants = {
        default: { opacity: 1},
        completed: { opacity: [0.5, 1], transition: { duration: 0.5 } },
    }

    useEffect(() => {
        if (typeof letter !== 'undefined') {
            setCharacter(letter);
        }
    }, [letter]);

    useEffect(() => {
        setInputResult(characterInputResult);
    }, [characterInputResult]);

    return (
        <AnimatePresence>
            <motion.div className={clsx(styles.letterBox, currentInputResult)} animate={currentInputResult === 'untouched' ? "default" : "completed"}
                variants={variants}>
                {character &&
                    <motion.span exit={{ scale: keyframes.slice().reverse(), transition: { duration: 0.05 } }} animate={{ scale: keyframes, opacity: 1 }} transition={{ duration: 0.1 }}>
                        {character}
                    </motion.span>
                }
            </motion.div>
        </AnimatePresence >
    );
});
