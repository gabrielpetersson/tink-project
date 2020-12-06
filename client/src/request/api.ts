import { ITransactionCluster } from "../@types/Transactions"
import { getAccessToken, removeAccessToken } from "../lib/accessToken"

// TODO: do generic type for every endpoint body
export enum ServerEndpoints {
  GET_TRANSACTIONS = "/api/transactions",
  GET_ACCOUNTS = "/api/v1/accounts/list",
  GET_ACCESS_TOKEN = "/api/authenticate",
  GET_USER = "/api/user"
}

const postServer = (
  endpoint: ServerEndpoints,
  data: Record<string, string> = {},
  noToken = false
) => {
  const dataWithCredentials = noToken
    ? data
    : { token: getAccessToken(), ...data }
  return fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dataWithCredentials)
  })
    .then(r => r.json())
    .catch(e => {
      console.log("error fetching api", e)
      removeAccessToken() // TODO: return actual error and take appropriate action
    })
}

export const apiGetTransactions = async () =>
  (await postServer(ServerEndpoints.GET_TRANSACTIONS)) as ITransactionCluster[]

export const apiGetUser = async () => postServer(ServerEndpoints.GET_USER)

export const apiGetAccessToken = async (code: string) =>
  (await postServer(ServerEndpoints.GET_ACCESS_TOKEN, { code }, true)) as {
    access_token: string
  }
