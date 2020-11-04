import { theme } from '@gnosis.pm/safe-react-components'
import React from 'react'
import App from 'src/components/App'
import GlobalStyles from 'src/styles/global'
import { ThemeProvider } from 'styled-components'

const Root: React.FC = () => (
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)

export default Root
