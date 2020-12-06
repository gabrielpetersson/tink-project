import React from "react"
import styled from "styled-components/macro"
import { Modal } from "./Modal"
import LoaderAnim from "../assets/icons/LoaderAnimation.svg"

const LoaderImg = styled.img`
  width: 100px;
  height: auto;
`
const Text = styled.div`
  font-size: 24px;
  color: black;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-self: center;
`
export const Loader = ({
  isExiting,
  text
}: {
  isExiting?: boolean // could be inferred with some tweaks
  text?: string
}) => (
  <Modal isExiting={isExiting}>
    <Container>
      <Text>{text}</Text>
      <LoaderImg src={LoaderAnim} />
    </Container>
  </Modal>
)
