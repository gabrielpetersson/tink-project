import React from "react"
import styled from "styled-components"

const FullPageWrapper = styled.div`
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    45deg,
    rgba(248, 178, 114, 0.7245273109243697) 0%,
    rgba(248, 149, 114, 1) 100%
  );
`
const Root = styled.div`
  width: 500px;
  height: 600px;
  min-height: 0;
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`

interface FadeInOnPageLoadProps {
  isExiting?: boolean
  wait?: number
  duration?: number
  noMovementTransition?: boolean
}
export const FadeInOnPageLoad = ({
  children,
  isExiting,
  noMovementTransition,
  wait = 300,
  duration = 500
}: FadeInOnPageLoadProps & { children: React.ReactElement }) => {
  const [isNotMounted, setIsNotMounted] = React.useState(true)

  React.useEffect(() => {
    setTimeout(() => setIsNotMounted(false), wait)
  }, [wait])

  const isBeforeTransition = isExiting || isNotMounted
  return React.cloneElement(children, {
    style: {
      opacity: isBeforeTransition ? "0" : "1",
      ...(noMovementTransition
        ? {}
        : { transform: `translateY(${isBeforeTransition ? "-40px" : "0"}` }),
      transition: `${duration}ms ease-out`,
      transitionProperty: "opacity transform"
    }
  })
}

interface ModalProps extends FadeInOnPageLoadProps {
  children: React.ReactElement | React.ReactElement[]
}
export const Modal = (props: ModalProps) => {
  const { children, ...rest } = props
  return (
    <FullPageWrapper>
      <FadeInOnPageLoad {...rest}>
        <Root>{children}</Root>
      </FadeInOnPageLoad>
    </FullPageWrapper>
  )
}
