import React, { useMemo, useState } from "react"
import styled from "styled-components"
import BigNumber from "bignumber.js"
import { TabNavigation, Tab, Paragraph, TextInput, Button } from "evergreen-ui"
import cERC20Abi from "src/abis/CErc20.json"
import { CDAI_ADDRESS, DAI_ADDRESS } from "src/contracts"

interface ICompoundForm {
  web3: any
  address: string
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

const CompoundForm: React.FC<ICompoundForm> = ({ web3, address }) => {
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

  React.useEffect(() => {
    const getData = async () => {
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
      const daiLocked = await cDai.methods.balanceOfUnderlying(address).call()
      setCDaiLocked(daiLocked)
    }

    getData()
  }, [address, cDai, dai])

  return (
    <SContainer>
      <Paragraph>
        <b>DAI APR: </b>
        {cDaiSupplyAPR}
      </Paragraph>
      <Paragraph>
        <b>DAI BALANCE: </b>
        {daiBalance}
      </Paragraph>
      <Paragraph>
        <b>DAI LOCKED: </b>
        {cDaiLocked}
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
      <TextInput name="daiAmount" placeholder="DAI Amount" marginTop="20px" />
      <Button appearance="primary" intent="success" marginTop="10px">
        Invest
      </Button>
    </SContainer>
  )
}

export default CompoundForm
