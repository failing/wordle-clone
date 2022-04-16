import { Heading } from '@chakra-ui/react';
import React from 'react';

type HeaderProps = {
    title: string,
}

export const Header = ({ title }: HeaderProps) => {
    return (<header>
        <Heading textAlign={'center'} as='h1' size={'3xl'}>
            {title}
        </Heading>
    </header>
    )
}