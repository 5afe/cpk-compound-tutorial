# Integrating Gnosis Safe Proxy Kit with the frontend (Compound App Tutorial)
# App can be found live here: https://gnosis.github.io/cpk-compound-tutorial/

## Introduction

This tutorial will teach you how you can use Gnosis Safe Contract Proxy Kit to perform batched transactions and interact with smart contracts. 
This tutorial is meant for those with a basic knowledge of Ethereum and Solidity. Furthermore, you should have some basic knowledge in JavaScript.
 
In this Tutorial we will cover: 

- How to install and initialize CPK
- How to interact with the CPK JavaScript library
- How to perform a transaction
- How to interact with a smart contract
- How to use batched transactions

## Web3/Ethers.js

Gnosis Safe Proxy Kit is a smart contract on the Ethereum blockchain. There are two popular libraries for interacting with the blockchain: [web3.js](https://github.com/ethereum/web3.js) and [ethers.js](https://github.com/ethers-io/ethers.js/). Your users will need a wallet that supports web3, in this tutorial we will use [web3connect](https://web3connect.com/) library which provides integrations with the majority of popular wallets.

## Background information

Our example project will be a [React](https://reactjs.org) application bootstrapped with [create-react-app](https://github.com/facebook/create-react-app) which uses [Evergreen UI Kit](https://evergreen.segment.com/components/). We are also going to use [TypeScript](https://typescriptlang.org) as our language. For more information on those projects, visit their websites. We assume you are familiar with those technologies as our tutorial will only cover things you need to integrate the Gnosis Safe Contract Proxy kit and not, for example, how to setup a React project.

## Useful links

- [Source code for the tutorial app](https://github.com/gnosis/cpk-compound-tutorial)
- [Contract Proxy Kit documentation](https://github.com/gnosis/contract-proxy-kit)
- [Video introduction to Building with Safe Apps SDK & Contract Proxy Kit](https://www.youtube.com/watch?v=YGw8WfBw5OI)
- [Web3.js docs](https://web3js.readthedocs.io/)

## Installing contract-proxy-kit

To install the CPK, run following command in the root directory of your project:

If you are using [yarn](https://yarnpkg.com/):
```
yarn add contract-proxy-kit
```
Or if [npm](https://npmjs.com)
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

```jsx
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

```jsx
import React, { useState, useEffect } from "react"
import Web3 from "web3"
import CPK, { Web3Adapter } from "contract-proxy-kit"
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
      const ethLibAdapter = new Web3Adapter({ web3 })
      const cpk = await CPK.create({ ethLibAdapter })
      setProxyKit(cpk)
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

## Fetching the necessary data from the blockchain

First we need to initialize the DAI and Compound DAI token contracts instances, the ABI can be found [here](https://github.com/gnosis/cpk-compound-tutorial/blob/master/src/abis/CErc20.json):

```jsx
import React, { useMemo } from "react"
import cERC20Abi from "src/abis/CErc20.json"

interface ICompoundForm {
  web3: any
  address: string
  cpk: CPK
}

const DAI_ADDRESS = '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa'
const CDAI_ADDRESS = '0x6D7F0754FFeb405d23C51CE938289d4835bE3b14'

const BLOCKS_PER_YEAR = (365.25 * 24 * 3600) / 15
const DECIMALS_18 = 10 ** 18

const CompoundForm: React.FC<ICompoundForm> = ({ web3, address, cpk }) => {
  const dai = useMemo(() => new web3.eth.Contract(cERC20Abi, DAI_ADDRESS), [
    web3
  ])
  const cDai = useMemo(() => new web3.eth.Contract(cERC20Abi, CDAI_ADDRESS), [
    web3
  ])

  return <div />
}
```

Let's write a function that will fetch the data required for investment calculations and save them into our state variables:

```jsx
import React, { useState } from "react"
import BigNumber from "bignumber.js"

const CompoundForm: React.FC<ICompoundForm> = ({ web3, address, cpk }) => {
  ...
  const [cDaiSupplyAPR, setCDaiSupplyAPR] = useState<string>("0")
  const [daiBalance, setDaiBalance] = useState<number>(0)
  const [cDaiLocked, setCDaiLocked] = useState<number>(0)

  const getData = async () => {
    // supply rate
    const cDaiSupplyRate = await cDai.methods.supplyRatePerBlock().call()
    const res = new BigNumber(cDaiSupplyRate)
      .times(BLOCKS_PER_YEAR)
      .div(DECIMALS_18)
      .times(100)
      .toFixed(2)
    setCDaiSupplyAPR(res)

    // dai Balance of user's connected wallet
    const daiBalance = await dai.methods.balanceOf(address).call()
    setDaiBalance(daiBalance)

    // current dai locked 
    const daiLocked = await cDai.methods.balanceOfUnderlying(cpk.address).call()
    setCDaiLocked(daiLocked)
  }
  ...
  return <div />
}
```

Notice that in `daiLocked` we use the address of a proxy, because in the result proxy will hold the locked funds. Proxy contract will be deployed when you first initiate the transaction with it, but the address is available by accessing `address` property of the CPK instance even when it's not deployed yet.

## Using CPK instance to invest DAI into Compound

First, we need to fund the proxy with the amount of DAI we want to invest:

```jsx
await dai.methods.transfer(cpk.address, daiAmount).send({ from: address })
```

Second, we need to prepare an array of transactions to execute for the Contract Proxy Kit:

```jsx
const txs = [
  {
    operation: CPK.Call,
    to: DAI_ADDRESS,
    value: 0,
    data: dai.methods.approve(CDAI_ADDRESS, daiAmount).encodeABI()
  },
  {
    operation: CPK.Call,
    to: CDAI_ADDRESS,
    value: 0,
    data: cDai.methods.mint(daiAmount).encodeABI()
  }
]
```

And then we simply execute it by calling `execTransactions` on the CPK instance:

```jsx
await cpk.execTransactions(txs)
```

`execTransactions` will return an object with [promiEvent](https://web3js.readthedocs.io/en/v1.2.5/callbacks-promises-events.html#promievent) property you can use to subscribe for updates.
