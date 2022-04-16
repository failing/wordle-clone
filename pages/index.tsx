import { Box, Button, Container, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Progress, useDisclosure } from '@chakra-ui/react'
import { WordStack } from 'components/character-input/word-stack'
import { Header } from 'components/header'
import { Text } from '@chakra-ui/react';
import { GameKeyboard } from 'components/keyboard/keyboard'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useState } from 'react';

const Home: NextPage = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [finalAttempts, setFinalAttempts] = useState(0);
    const [wonGame, setWonGame] = useState(false);
    const router = useRouter();
    
    const words = [
        "tests",
        "hello",
        "fonts",
        "words",
        "clone",
    ]

    const maskVowels = (word: string) => {
        return word.replace('a', '*').replace('e', '*').replace('i', '*').replace('o', '*').replace('u', '*');
    }

    const randomIndex = Math.floor(Math.random() * words.length);
    const gameWord = words[randomIndex];
    const maskWord = maskVowels(gameWord);

    const playAgain = () => {
        setTimeout(() => router.reload(), 300);
        onClose();
    }

    const showEndModal = (result: any, attempts: number) => {
        setWonGame(result);
        setFinalAttempts(attempts);
        setTimeout(() => onOpen(), 200);
    };

    return (
        <div>
            <Head>
                <title>Wordle Clone</title>
            </Head>

            <Container height={'100%'} display={'flex'} flexDirection={'column'}>
                <Header title={'Wordle Clone'} ></Header>
                <Box display='flex' justifyContent='center' pt={8}>
                    <Text fontSize={'lg'} fontWeight={'bold'}>The winning word could be</Text> <Text fontWeight={'bold'} fontSize={'lg'} textTransform={'uppercase'} ml={1}>{maskWord}</Text>
                </Box>

                <Box css={{ "::-webkit-scrollbar": { display: 'none' } }} justifyContent={'center'} display={'flex'} flexGrow={1} marginTop={'25px'} marginBottom={'25px'} overflowY={'auto'}>
                    <WordStack onFinishedGame={showEndModal} maxTries={10} correctWord={gameWord}></WordStack>
                </Box>

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Game Over</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text>You {wonGame == false ? 'lost' : 'won!'}</Text>
                            {wonGame && 
                                <Text>You did so in {finalAttempts} attempt{finalAttempts > 1 ? 's' : ''} - Well done!</Text>
                            }
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={playAgain}>
                                Play again
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>


                <GameKeyboard></GameKeyboard>
            </Container>
        </div>
    );
}

export default Home
