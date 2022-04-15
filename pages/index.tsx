import { Box, Container } from '@chakra-ui/react'
import { WordStack } from 'components/character-input/word-stack'
import { Header } from 'components/header'
import { GameKeyboard } from 'components/keyboard/keyboard'
import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Wordle Clone #420</title>
            </Head>

            <Container height={'100%'} display={'flex'} flexDirection={'column'}>
                <Header title={'Wordle Clone #420'} ></Header>
                <Box css={{ "::-webkit-scrollbar": { display: 'none' } }} justifyContent={'center'} display={'flex'} flexGrow={1} marginTop={'50px'} marginBottom={'25px'} overflowY={'auto'}>
                    <WordStack onFinishedGame={() => console.log(1)} maxTries={10} correctWord='hello'></WordStack>
                </Box>

                <GameKeyboard></GameKeyboard>
            </Container>
        </div>
    );
}

export default Home
