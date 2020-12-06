import { LOCAL_STORAGE_ACCESS_TOKEN } from "../constants"

export const getAccessToken = () =>
  localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
export const saveAccessToken = (accessToken: string) =>
  localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, accessToken)
export const removeAccessToken = () =>
  localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN)
