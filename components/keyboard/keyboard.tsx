import { AnimatePresence, motion } from "framer-motion";
import { keyboardState } from "pages/store";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { useRecoilState, useResetRecoilState } from "recoil";

export const GameKeyboard = () => {
    const filterReset = useResetRecoilState(keyboardState);
    const [text, setText] = useRecoilState(keyboardState);

    const onInput = (char: string) => {
        filterReset();
        setText({...text, char: char});
    }

    return (
        <AnimatePresence initial={true}>
            <motion.section
                key="content"
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0 }
                }}
                transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
                <Keyboard
                    useButtonTag={true}
                    theme="hg-theme-default dark-keyboard"
                    onKeyPress={onInput}
                    buttonAttributes={
                        text.bannedChars && text.bannedChars.length > 0 && [
                          {
                            attribute: "disabled",
                            value: "true",
                            buttons: text.bannedChars
                          }
                        ]
                      }
                    disableButtonHold={true}
                    display={
                        {
                            '{bksp}': '⌫',
                            '{enter}': 'ENTER',
                        }
                    }
                    layout={
                        {
                            default: [
                                "Q W E R T Y U I O P",
                                "A S D F G H J K L {enter}",
                                "Z X C V B N M {bksp}",
                            ]
                        }
                    }
                />
            </motion.section>
        </AnimatePresence>

    )
}