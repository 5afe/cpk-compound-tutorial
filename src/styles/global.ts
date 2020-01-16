import { createGlobalStyle } from 'styled-components'
import { normalize } from 'styled-normalize'

const GlobalStyles = createGlobalStyle`
  ${normalize}

  body {
    font-family: 'Karla', sans-serif;
    margin: 0;
    padding: 0;
  }
`

export default GlobalStyles
