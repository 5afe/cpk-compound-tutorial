import {
  Button,
  EthHashInfo,
  Tab,
  TabItem,
  Text,
  TextField
} from '@gnosis.pm/safe-react-components'
import BigNumber from 'bignumber.js'
import CPK from 'contract-proxy-kit'
import React, { useCallback, useMemo, useState } from 'react'
import cERC20Abi from 'src/abis/CErc20.json'
import { CDAI_ADDRESS, DAI_ADDRESS } from 'src/contracts'
import styled from 'styled-components'

interface ICompoundForm {
  web3: any
  address: string
  cpk: CPK
}

const BLOCKS_PER_YEAR = (365.25 * 24 * 3600) / 15
const DECIMALS_18 = 10 ** 18

const SContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 25px;
`

const Line = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 0;

  @media screen and (max-width: 768px) {
    display: block;
  }
`

const TitleLine = styled.div`
  margin-right: 10px;
`

const formatNumber = (value: number) =>
  new BigNumber(value).div(DECIMALS_18).toFixed(4)

const tabs: TabItem[] = [
  {
    id: '1',
    label: 'Invest',
    icon: 'transactionsInactive'
  },
  {
    id: '2',
    label: 'Withdraw',
    icon: 'transactionsInactive'
  }
]

const CompoundForm: React.FC<ICompoundForm> = ({ web3, address, cpk }) => {
  const dai = useMemo(() => new web3.eth.Contract(cERC20Abi, DAI_ADDRESS), [
    web3
  ])
  const cDai = useMemo(() => new web3.eth.Contract(cERC20Abi, CDAI_ADDRESS), [
    web3
  ])
  const [cDaiSupplyAPR, setCDaiSupplyAPR] = useState<string>('0')
  const [proxyDaiBalance, setProxyDaiBalance] = useState<number>(0)
  const [daiBalance, setDaiBalance] = useState<number>(0)
  const [cDaiLocked, setCDaiLocked] = useState<number>(0)
  const [daiInputAmount, setDaiInputAmount] = useState<string>('')
  const [selectedTab, setSelectedTab] = useState('1')

  const getData = useCallback(async () => {
    // supplyRate
    const cDaiSupplyRate = await cDai.methods.supplyRatePerBlock().call()
    const res = new BigNumber(cDaiSupplyRate)
      .times(BLOCKS_PER_YEAR)
      .div(DECIMALS_18)
      .times(100)
      .toFixed(2)
    setCDaiSupplyAPR(res)

    // DAI Balance
    const daiBalance = await dai.methods.balanceOf(address).call()
    setDaiBalance(daiBalance)

    // proxy DAI Balance
    const proxyDaiBalance = await dai.methods.balanceOf(cpk.address).call()
    setProxyDaiBalance(proxyDaiBalance)

    // DAI Locked
    const daiLocked = await cDai.methods.balanceOfUnderlying(cpk.address).call()
    setCDaiLocked(daiLocked)
  }, [address, cDai.methods, cpk, dai.methods])

  const lockDai = async () => {
    if (!daiInputAmount) {
      return
    }

    const daiAmount = new BigNumber(daiInputAmount)
      .times(DECIMALS_18)
      .toNumber()

    if (cpk.address !== address) {
      if (proxyDaiBalance < daiAmount) {
        await dai.methods
          .transfer(cpk.address, (daiAmount - proxyDaiBalance).toString())
          .send({ from: address })
      }
    }

    const txs = [
      {
        operation: CPK.Call,
        to: DAI_ADDRESS,
        value: '0',
        data: dai.methods
          .approve(CDAI_ADDRESS, daiAmount.toString())
          .encodeABI()
      },
      {
        operation: CPK.Call,
        to: CDAI_ADDRESS,
        value: '0',
        data: cDai.methods.mint(daiAmount.toString()).encodeABI()
      }
    ]

    const txResult: any = await cpk.execTransactions(txs)
    await new Promise((resolve, reject) =>
      txResult.promiEvent
        ?.then((receipt: any) => resolve(receipt))
        .catch(reject)
    )
    getData()
  }

  const withdrawDai = async () => {
    if (!daiInputAmount) {
      return
    }

    const daiAmount = new BigNumber(daiInputAmount)
      .times(DECIMALS_18)
      .toString()

    const txs = [
      {
        operation: CPK.Call,
        to: CDAI_ADDRESS,
        value: 0,
        data: cDai.methods.redeemUnderlying(daiAmount).encodeABI()
      },
      {
        operation: CPK.Call,
        to: DAI_ADDRESS,
        value: 0,
        data: dai.methods.transfer(address, daiAmount).encodeABI()
      }
    ]

    const txResult: any = await cpk.execTransactions(txs)
    await new Promise((resolve, reject) =>
      txResult.promiEvent
        ?.then((receipt: any) => resolve(receipt))
        .catch(reject)
    )
    getData()
  }

  React.useEffect(() => {
    getData()
  }, [address, cDai, dai, getData])

  return (
    <SContainer>
      <Line>
        <TitleLine>
          <Text size="xl" strong>
            Proxy address:
          </Text>
        </TitleLine>
        {cpk.address && (
          <EthHashInfo
            hash={cpk.address}
            textSize="xl"
            showCopyBtn
            showIdenticon
            showEtherscanBtn
            network="rinkeby"
          />
        )}
      </Line>
      <Line>
        <TitleLine>
          <Text size="xl" strong>
            Proxy Dai balance:
          </Text>
        </TitleLine>
        <Text size="xl">{formatNumber(proxyDaiBalance)}</Text>
      </Line>
      <Line>
        <TitleLine>
          <Text size="xl" strong>
            Dai APR:
          </Text>
        </TitleLine>
        <Text size="xl">{cDaiSupplyAPR}%</Text>
      </Line>
      <Line>
        <TitleLine>
          <Text size="xl" strong>
            DAI balance:
          </Text>
        </TitleLine>
        <Text size="xl">
          {formatNumber(daiBalance)}{' '}
          <a href="https://ethereum.stackexchange.com/a/80204" target="_blank" rel="noreferrer">
            (Request Testnet DAI?)
          </a>
        </Text>
      </Line>
      <Line>
        <TitleLine>
          <Text size="xl" strong>
            DAI locked:
          </Text>
        </TitleLine>
        <Text size="xl">{formatNumber(cDaiLocked)}</Text>
      </Line>
      <br />
      <Tab
        onChange={setSelectedTab}
        selectedTab={selectedTab}
        variant="outlined"
        items={tabs}
      />
      <br />
      <TextField
        id="daiAmount"
        label="DAI Amount"
        value={daiInputAmount}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setDaiInputAmount(event.target.value)
        }}
      />
      <br />
      {selectedTab === '1' && (
        <Button size="lg" color="primary" variant="contained" onClick={lockDai}>
          Invest
        </Button>
      )}
      {selectedTab === '2' && (
        <Button
          size="lg"
          color="primary"
          variant="contained"
          onClick={withdrawDai}
        >
          Withdraw
        </Button>
      )}
    </SContainer>
  )
}

export default CompoundForm
