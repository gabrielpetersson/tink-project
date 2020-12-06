import React from "react"
import { getAccessToken, saveAccessToken } from "../lib/accessToken"
import { apiGetAccessToken } from "../request/api"

export const useTinkAccessToken = () => {
  const [isAccessTokenAvailable, setIsAccessTokenAvailable] = React.useState(
    !!getAccessToken()
  )

  const fetchAccessTokenWithCode = React.useCallback((code: string) => {
    if (!code) return
    return apiGetAccessToken(code).then(response => {
      if (!response.access_token) return
      saveAccessToken(response.access_token)
      setIsAccessTokenAvailable(true)
    })
  }, [])

  return { fetchAccessTokenWithCode, isAccessTokenAvailable }
}
