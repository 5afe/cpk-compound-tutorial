import React, { useMemo } from "react"
import cERC20Abi from "src/abis/CErc20.json"
import { CDAI_ADDRESS, DAI_ADDRESS } from "src/contracts"

interface ICompoundForm {
  web3: any
}

const CompoundForm: React.FC<ICompoundForm> = ({ web3 }) => {
  const dai = useMemo(() => new web3.eth.Contract(cERC20Abi, DAI_ADDRESS), [
    web3
  ])
  const cDai = useMemo(() => new web3.eth.Contract(cERC20Abi, CDAI_ADDRESS), [
    web3
  ])
  console.log(dai, cDai)

  return <div></div>
}

export default CompoundForm
