import React from "react"
import { Redirect } from "react-router-dom"
import styled from "styled-components/macro"
import { TINK_LINK_DEPLOYED, TINK_LINK_LOCAL } from "../constants"
import { getAccessToken } from "../lib/accessToken"
import { Modal } from "./Modal"

const StartButton = styled.a`
  display: flex;
  text-transform: uppercase;
  text-decoration: none;
  padding: 18px 0;
  border-radius: 2px;
  background: black;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`
const Header = styled.div`
  font-size: 36px;
  color: black;
`
const LargeHeader = styled(Header)`
  font-size: 64px;
`

const isDeployed = true // TODO: change with env
const redirectToTink = () => {
  const el = document.createElement("a")
  el.href = isDeployed ? TINK_LINK_DEPLOYED : TINK_LINK_LOCAL
  el.click()
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  height: 100%;
  width: 100%;
`
export const Home = () => {
  const [isExiting, setIsExiting] = React.useState(false)
  const accessToken = getAccessToken()
  if (accessToken) return <Redirect to="/purchases" />
  return (
    <Modal isExiting={isExiting}>
      <Container>
        <div>
          <Header>Your transactions.</Header>
          <LargeHeader>In one place.</LargeHeader>
        </div>
        <StartButton
          onClick={() => {
            setIsExiting(true)
            setTimeout(redirectToTink, 500) // accounts for animation
          }}
        >
          EXPLORE
        </StartButton>
      </Container>
    </Modal>
  )
}
