# Integrating Gnosis Safe Proxy Kit with the frontend (Compound App Example)
# App can be found live here: http://green-summer.surge.sh/

## Web3/Ethers.js

Gnosis Safe Proxy Kit is a smart contract on the Ethereum blockchain. There are two popular libraries for interacting with the blockchain: [web3.js](https://github.com/ethereum/web3.js) and [ethers.js](https://github.com/ethers-io/ethers.js/). Your users will need a wallet that supports web3, in this tutorial we will use [web3connect](https://web3connect.com/) library which provides integrations with the majority of popular wallets.

## Background information

Our example project will be a [React](reactjs.org) application bootstrapped with [create-react-app](https://github.com/facebook/create-react-app) which uses [Evergreen UI Kit](https://evergreen.segment.com/components/). We are also going to use [TypeScript](typescriptlang.org) as our language. For more information on those projects, visit their websites. We assume you are familiar with those technologies as our tutorial we'll only cover things you need to integrate the Gnosis Safe Contract Proxy kit and not, for example, how to setup a React project.

## Installing contract-proxy-kit

To install the CPK, run following command in the root directory of your project:

If you are using [yarn](https://yarnpkg.com/):
```
yarn add contract-proxy-kit
```
Or if [npm](npmjs.com)
```
npm i contract-proxy-kit
```

## Wallet integration

Let's create a button component which would trigger the web3connect modal:

```jsx
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
        package: WalletConnectProvider,
        options: {
          infuraId: INFURA_ID
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
```

`INFURA_ID` is a token which can be used to access Ethereum blockchain API. You can get one by visiting [Infura website](https://infura.io/)

Then you can use this component in your `App.tsx`

```
import React, { useState } from "react"
import Web3 from "web3"
import ConnectButton from "src/components/ConnectButton"

const App: React.FC = () => {
  const [web3, setWeb3] = React.useState<any>(undefined)

  const onWeb3Connect = (provider: any) => {
    if (provider) {
      setWeb3(new Web3(provider))
    }
  }

  return (
    <>
      <ConnectButton onConnect={onWeb3Connect} />
    </>
  )
}
```

## Initializing CPK instance

As soon as we got the wallet integration provider, we're ready to initialize the CPK instance. In case of web3.js, we do this simply by calling CPK.create and passing provider instance as an option with `web3` key, so our `App.tsx` looks like this now:

```
import React, { useState, useEffect } from "react"
import Web3 from "web3"
import CPK from "contract-proxy-kit"
import ConnectButton from "src/components/ConnectButton"

const App: React.FC = () => {
  const [web3, setWeb3] = React.useState<any>(undefined)
  const [proxyKit, setProxyKit] = React.useState<CPK | undefined>(undefined)

  const onWeb3Connect = (provider: any) => {
    if (provider) {
      setWeb3(new Web3(provider))
    }
  }

  useEffect(() => {
    const initializeCPK = async () => {
      setProxyKit(await CPK.create({ web3 }))
    }

    initializeCPK()
  }, [web3])

  return (
    <>
      <ConnectButton onConnect={onWeb3Connect} />
    </>
  )
}
```