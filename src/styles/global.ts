import { createGlobalStyle } from "styled-components"
import { normalize } from "styled-normalize"
import Averta from 'src/assets/fonts/Averta-normal.woff2'
import AvertaBold from 'src/assets/fonts/Averta-ExtraBold.woff2'

const GlobalStyles = createGlobalStyle`
  ${normalize}


  @font-face {
    font-family: "Averta";
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local("Averta-Regular"), 
      url(${Averta}) format("woff2");
  }

  @font-face {
    font-family: "Averta";
    font-style: normal;
    font-weight: 800;
    font-display: swap;
    src: local("Averta-Extrabold"),
      url(${AvertaBold}) format("woff2");
  }

  body {
    font-family: 'Averta', sans-serif;
    margin: 0;
    padding: 0;
  }
`

export default GlobalStyles
