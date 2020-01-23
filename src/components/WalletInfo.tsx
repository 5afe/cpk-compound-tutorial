import React from "react"
import makeBlockie from "ethereum-blockies-base64"
import styled from "styled-components"

const SContainer = styled.div`
  display: flex;
  align-items: center;
`

const SImg = styled.img`
  border-radius: 8px;
  height: 50px;
  width: 50px;
  margin-right: 10px;
`

const AccountInfo: React.FC<{ address: string }> = ({ address }) => {
  if (!address) {
    return null
  }

  return (
    <SContainer>
      <SImg src={makeBlockie(address)} alt="Wallet Icon" />
      {address}
    </SContainer>
  )
}

export default AccountInfo
