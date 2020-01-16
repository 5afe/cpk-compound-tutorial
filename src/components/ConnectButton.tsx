import * as React from "react"
import Web3Connect from "web3connect"
import WalletConnectProvider from "@walletconnect/web3-provider"

type Props = {
  onConnect: Function
}

const ConnectButton: React.FC<Props> = ({ onConnect }) => (
  <Web3Connect.Button
    network="rinkeby"
    providerOptions={{
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "INFURA_ID" // required
        }
      }
    }}
    onConnect={onConnect}
    onClose={() => {
      console.log("Web3Connect Modal Closed") // modal has closed
    }}
  />
)

export default ConnectButton
