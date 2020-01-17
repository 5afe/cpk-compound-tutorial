import React from "react"
import Web3 from "web3"
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
  const [web3, setWeb3] = React.useState<any>(undefined)

  const onWeb3Connect = (provider: any) => {
    if (provider) {
      setWeb3(new Web3(provider))
    }
  }

  return (
    <SAppContainer>
      <img src={SafeLogo} alt="Gnosis Safe Logo" width="100"></img>
      <h1>Safe Contract Proxy Kit Compound Example</h1>
      <p>Start by connecting your wallet using button below.</p>
      {!web3 ? (
        <ConnectButton onConnect={onWeb3Connect} />
      ) : (
        "Connected provider."
      )}
    </SAppContainer>
  )
}

export default App
