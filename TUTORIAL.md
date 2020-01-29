# Integrating Gnosis Safe Proxy Kit with the frontend (Compound App Example)
# App can be found live here: http://green-summer.surge.sh/

## Web3/Ethers.js

Gnosis Safe Proxy Kit is a smart contract on the Ethereum blockchain. There are two popular libraries for interacting with the blockchain: [web3.js](https://github.com/ethereum/web3.js) and [ethers.js](https://github.com/ethers-io/ethers.js/). Your users will need a wallet that supports web3, in this tutorial we will use [web3connect](https://web3connect.com/) library which provides integrations with the majority of popular wallets.

## Background information

Our example project will be a [React](reactjs.org) application bootstrapped with [create-react-app](https://github.com/facebook/create-react-app) which uses [Evergreen UI Kit](https://evergreen.segment.com/components/). We are also going to use [TypeScript](typescriptlang.org) as our language. For more information on those projects, visit their websites.

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