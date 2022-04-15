import { useCallback, useState } from "react"
import { WordRow } from "./word-row"
import { Grid } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { keyboardState } from "pages/store";

type WordStackProps = {
    maxTries: number;
    correctWord: string;
    onFinishedGame: (result: any, tries: number) => void;
}

export const WordStack = ({ maxTries, correctWord, onFinishedGame }: WordStackProps) => {
    const [currentLength, setCurrentLength] = useState<number>(1);
    const [text, setText] = useRecoilState(keyboardState);

    const handleCompleteWord = (correct: boolean, bannedWords: string[]) => {
        if (currentLength < maxTries) {
            console.log(bannedWords);
            setText({...text, bannedChars: text.bannedChars + " " + bannedWords.map(r => r.toUpperCase()).join(" ")});
            if (correct) {
                onFinishedGame(true, currentLength);
                return;
            }
            else {
                setCurrentLength(currentLength + 1);
            }
        }
        else {
            onFinishedGame(false, maxTries);
        }
    }

    return (
        <Grid width={350} height={460} templateRows='repeat(6, 1fr)' gridGap={'2'}>
            {[...Array(currentLength)].map((_, i) => 
                <WordRow key={i} correctWord={correctWord} onComplete={handleCompleteWord} length={correctWord.length}></WordRow>
            )}
        </Grid>
    )
}