import React, { useMemo, useState, useCallback } from "react"
import styled from "styled-components"
import BigNumber from "bignumber.js"
import { TabNavigation, Tab, Paragraph, TextInput, Button } from "evergreen-ui"
import cERC20Abi from "src/abis/CErc20.json"
import { CDAI_ADDRESS, DAI_ADDRESS } from "src/contracts"
import CPK from "contract-proxy-kit"

interface ICompoundForm {
  web3: any
  address: string
  cpk: CPK
}

type CompoundOperation = "invest" | "withdraw"

const BLOCKS_PER_YEAR = (365.25 * 24 * 3600) / 15
const DECIMALS_18 = 10 ** 18

const SContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 25px;
`

const SMobileLineBreak = styled.br`
  display: none;

  @media screen and (max-width: 768px) {
    display: initial;
  }
`

const formatNumber = (value: number) =>
  new BigNumber(value).div(DECIMALS_18).toFixed(4)

const CompoundForm: React.FC<ICompoundForm> = ({ web3, address, cpk }) => {
  const dai = useMemo(() => new web3.eth.Contract(cERC20Abi, DAI_ADDRESS), [
    web3
  ])
  const cDai = useMemo(() => new web3.eth.Contract(cERC20Abi, CDAI_ADDRESS), [
    web3
  ])
  const [userOperation, setUserOperation] = useState<CompoundOperation>(
    "invest"
  )
  const [cDaiSupplyAPR, setCDaiSupplyAPR] = useState<string>("0")
  const [daiBalance, setDaiBalance] = useState<number>(0)
  const [cDaiLocked, setCDaiLocked] = useState<number>(0)
  const [daiInputAmount, setDaiInputAmount] = useState<string>("")

  const getData = useCallback(async () => {
    // supplyRate
    const cDaiSupplyRate = await cDai.methods.supplyRatePerBlock().call()
    const res = new BigNumber(cDaiSupplyRate)
      .times(BLOCKS_PER_YEAR)
      .div(DECIMALS_18)
      .times(100)
      .toFixed(2)
    setCDaiSupplyAPR(res)

    // dai Balance
    const daiBalance = await dai.methods.balanceOf(address).call()
    setDaiBalance(daiBalance)

    // dai Locked
    const daiLocked = await cDai.methods.balanceOfUnderlying(cpk.address).call()
    setCDaiLocked(daiLocked)
  }, [address, cDai.methods, cpk.address, dai.methods])

  const lockDai = async () => {
    if (!daiInputAmount) {
      return
    }

    const daiAmount = new BigNumber(daiInputAmount)
      .times(DECIMALS_18)
      .toNumber()

    if (cpk.address !== address) {
      const proxyDaiBalance = await dai.methods.balanceOf(cpk.address).call()
      if (proxyDaiBalance < daiAmount) {
        await dai.methods.transfer(cpk.address, (daiAmount - proxyDaiBalance).toString()).send({ from: address })
      }
    }

    const txs = [
      {
        operation: "0",
        to: DAI_ADDRESS,
        value: "0",
        data: dai.methods.approve(CDAI_ADDRESS, daiAmount.toString()).encodeABI()
      },
      {
        operation: "0",
        to: CDAI_ADDRESS,
        value: "0",
        data: cDai.methods.mint(daiAmount.toString()).encodeABI()
      }
    ]

    await cpk.execTransactions(txs)

    getData()
  }

  const withdrawDai = async () => {
    if (!daiInputAmount) {
      return
    }

    if (!daiInputAmount) {
      return
    }

    const daiAmount = new BigNumber(daiInputAmount)
      .times(DECIMALS_18)
      .toString()

    const txs = [
      {
        operation: CPK.CALL,
        to: CDAI_ADDRESS,
        value: 0,
        data: cDai.methods.redeemUnderlying(daiAmount).encodeABI()
      },
      {
        operation: CPK.CALL,
        to: DAI_ADDRESS,
        value: 0,
        data: dai.methods.transfer(address, daiAmount).encodeABI()
      }
    ]

    await cpk.execTransactions(txs)

    getData()
  }

  React.useEffect(() => {
    getData()
  }, [address, cDai, dai, getData])

  return (
    <SContainer>
      <Paragraph textAlign="left">
        <b>PROXY ADDRESS: </b>
        <SMobileLineBreak />
        {cpk.address}
      </Paragraph>
      <Paragraph>
        <b>DAI APR: </b>
        {cDaiSupplyAPR}
      </Paragraph>
      <Paragraph>
        <b>DAI BALANCE: </b>
        {formatNumber(daiBalance)}
      </Paragraph>
      <Paragraph>
        <b>DAI LOCKED: </b>
        {formatNumber(cDaiLocked)}
      </Paragraph>

      <TabNavigation marginTop="20px">
        {["invest", "withdraw"].map(tab => (
          <Tab
            key={tab}
            isSelected={userOperation === tab}
            // @ts-ignore
            onSelect={() => setUserOperation(tab)}
          >
            {tab[0].toUpperCase() + tab.slice(1)}
          </Tab>
        ))}
      </TabNavigation>
      <TextInput
        name="daiAmount"
        placeholder="DAI Amount"
        marginTop="20px"
        value={daiInputAmount}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setDaiInputAmount(event.target.value)
        }}
      />
      <Button
        appearance="primary"
        intent="success"
        marginTop="10px"
        onClick={userOperation === "invest" ? lockDai : withdrawDai}
      >
        {userOperation === "invest" ? "Invest" : "Withdraw"}
      </Button>
    </SContainer>
  )
}

export default CompoundForm
