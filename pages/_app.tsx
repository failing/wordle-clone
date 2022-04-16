
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { ChakraProvider } from '@chakra-ui/react'
import theme from 'theme'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot >
    </ChakraProvider>
  )
}

export default MyApp
