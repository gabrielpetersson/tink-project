import React from "react"
import { Redirect, useHistory } from "react-router-dom"
import { Loader } from "./Loader"

import { Modal } from "./Modal"
import { useCompare } from "../hooks/useCompare"
import { useTinkAccessToken } from "../hooks/useTinkAccessToken"

export const Authentication = () => {
  const {
    fetchAccessTokenWithCode,
    isAccessTokenAvailable
  } = useTinkAccessToken()
  const [isExiting, setIsExiting] = React.useState(false)
  const [error, setError] = React.useState("")
  const [proceed, setProceed] = React.useState(false)
  const [connectionTimeoutId] = React.useState(
    setTimeout(
      () => setError("That took a bit longer than we expected. Try again!"),
      4000
    )
  )

  const history = useHistory()
  const code = new URLSearchParams(window.location.search).get("code")
  const errorMsg = new URLSearchParams(window.location.search).get("error")

  React.useEffect(() => {
    if (!errorMsg) return
    setError("Oops... unexpected error!")
  }, [errorMsg])

  // fake wait for some cool loading
  const codeChanged = useCompare(code)
  React.useEffect(() => {
    if (!code || !codeChanged) return
    fetchAccessTokenWithCode(code)
    clearTimeout(connectionTimeoutId)
  }, [code, codeChanged, connectionTimeoutId, fetchAccessTokenWithCode])

  // create short fake loading. because who does not like short loading times.
  const accessTokenChanged = useCompare(isAccessTokenAvailable)
  React.useEffect(() => {
    if (!isAccessTokenAvailable || !accessTokenChanged) return
    setTimeout(() => setIsExiting(true), 1750)
    setTimeout(() => setProceed(true), 2000)
  }, [isAccessTokenAvailable, accessTokenChanged])

  if (error) {
    setTimeout(() => history.push("/"), 5000)
    return (
      <Modal>
        <div>{`${error} Redirecting...`}</div>
      </Modal>
    )
  }
  return proceed ? (
    <Redirect to="/purchases/favorite-store" />
  ) : (
    <Loader text={"Securely logging in..."} isExiting={isExiting} />
  )
}
