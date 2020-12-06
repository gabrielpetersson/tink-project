import express from "express"
import { fileURLToPath } from "url"
import path from "path"
import axios from "axios"
import qs from "qs"
import dotenv from "dotenv"
import "regenerator-runtime/runtime"

dotenv.config()

const BASE_API_URL_TINK = "https://api.tink.com"
export enum TinkFetchTypes {
  GET_TRANSACTIONS = "/api/v1/transactions/suggest",
  GET_ACCOUNTS = "/api/v1/accounts/list",
  GET_ACCESS_TOKEN = "/api/v1/oauth/token",
  GET_USER = "/api/v1/identities"
}

const __dirname = path.dirname(fileURLToPath((import.meta as any).url))
const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, "../../client/build")))
app.listen(PORT)

app.post("/api/authenticate", async (req, res) => {
  const { code } = req.body
  // const body = `code=${code}&client_id=a48796157bc945a8b49a4c615b1a5055&client_secret=044f6a824dcd4066bd4d3734f5a9d2a8&grant_type=authorization_code`
  const body = qs.stringify({
    code,
    client_id: process.env.TINK_CLIENT_ID,
    client_secret: process.env.TINK_CLIENT_SECRET,
    grant_type: "authorization_code"
  })
  const resp = await axios
    .post(BASE_API_URL_TINK + TinkFetchTypes.GET_ACCESS_TOKEN, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        "X-Requested-With": "XMLHttpRequest"
      }
    })
    .then(r => r.data)
    .catch(e => console.log("authenticate failed:", e))
  return res.send(resp)
})

app.post("/api/transactions", async (req, res) => {
  const { token } = req.body
  const resp = await axios
    .get(BASE_API_URL_TINK + TinkFetchTypes.GET_TRANSACTIONS, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest"
      }
    })
    .then(r => r.data.clusters)
    .catch(e => console.log("transactions failed:", e))
  return res.send(resp)
})

app.post("/api/user", async (req, res) => {
  const { token } = req.body
  const resp = await axios
    .get(BASE_API_URL_TINK + TinkFetchTypes.GET_USER, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest"
      }
    })
    .then(r =>
      r.data.availableIdentityData.find((d: { name: string }) => d.name) ||
      r.data.availableIdentityData.length
        ? r.data.availableIdentityData[0]
        : {}
    ) // very arbitrary guess
    .catch(e => console.log("transactions failed:", e))
  return res.send(resp)
})

app.get("*", (_, res) =>
  res.sendFile(path.join(__dirname, "../../client/build", "index.html"))
)
