import React from "react"
import styled from "styled-components"
import ConnectButton from "src/components/ConnectButton"
import SafeLogo from "src/assets/icons/safe-logo.svg"

const SAppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const App: React.FC = () => {
  return (
    <SAppContainer>
      <img src={SafeLogo} alt="Gnosis Safe Logo" width="100"></img>
      <h1>Safe Contract Proxy Kit Compound Example</h1>
      <p>Start by connecting your wallet using button below.</p>
      <ConnectButton />
    </SAppContainer>
  )
}

export default App
