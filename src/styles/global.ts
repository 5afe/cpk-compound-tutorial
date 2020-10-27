import avertaBoldFont from '@gnosis.pm/safe-react-components/dist/fonts/averta-bold.woff2'
import avertaFont from '@gnosis.pm/safe-react-components/dist/fonts/averta-normal.woff2'
import { createGlobalStyle } from "styled-components"
import { normalize } from "styled-normalize"

const GlobalStyles = createGlobalStyle`
  ${normalize}

  @font-face {
    font-family: 'Averta';
    font-display: swap;
    src: local('Averta'), local('Averta Bold'),
    url(${avertaFont}) format('woff2'),
    url(${avertaBoldFont}) format('woff');
  }

  body {
    font-family: 'Averta', sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
  }

  .web3connect-connect-button {
    background-color: #008c73 !important;
  }

  .walletconnect-qrcode__base {
    left: 0;
  }

  a {
    color: #008c73;
  }
`

export default GlobalStyles
