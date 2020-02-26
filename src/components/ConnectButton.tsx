import * as React from "react"
import Web3Connect from "web3connect"
import WalletConnectProvider from '@walletconnect/web3-provider'

type Props = {
  onConnect: Function
}

const ConnectButton: React.FC<Props> = ({ onConnect }) => (
  <Web3Connect.Button
    network="rinkeby"
    providerOptions={{
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "b42c928da8fd4c1f90374b18aa9ac6ba"
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
