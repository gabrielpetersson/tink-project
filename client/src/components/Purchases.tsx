import React from "react"
import styled from "styled-components/macro"
import { NavLink, Redirect, Route, Switch } from "react-router-dom"
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"

import { apiGetTransactions, apiGetUser } from "../request/api"
import { Loader } from "./Loader"
import { ITransactionCluster } from "../@types/Transactions"
import { IUser } from "../@types/User"
import { FadeInOnPageLoad, Modal } from "./Modal"
import { getAccessToken, removeAccessToken } from "../lib/accessToken"

const Text = styled.div`
  font-size: 18px;
`
const Name = styled.div`
  font-size: 36px;
`
const Spacer = styled.div<{ width?: string; height?: string }>`
  display: inline-block;
  width: ${p => (p.width ? p.width : 0)};
  height: ${p => (p.height ? p.height : 0)};
`

const getCompanyLogo = async (companyName: string) => {
  return fetch(
    `https://cors-anywhere.herokuapp.com/https://api.uplead.com/v2/company-name-to-domain?company_name=${companyName}`,
    {
      headers: {
        Authorization: "2c753082b1f605a53df9aa890e1835df"
      }
    }
  )
    .then(r => r.json())
    .then(d => d?.data?.logo as string | undefined)
}

const noLogoURL =
  "data:image/png;base64,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"

const PurchasesFooter = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: stretch;
  margin-bottom: auto;
  width: 100%;
`
const FooterItem = styled(NavLink)`
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #333;
  justify-content: center;
  height: 48px;
  & + & {
    border-left: solid 1px #aaa;
  }
  &:hover {
    background-color: #eee;
  }
  text-decoration: none;
  user-select: none;
  width: 100%;
  font-size: 13px;
`

const FavoriteCompanyContainer = styled.div`
  height: 100%;
  width: 100%;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const FavoriteCompanyLogo = styled.img`
  height: 128px;
  width: 128px;
  border-radius: 64px;
`
const FavoriteCompanyName = styled.div`
  font-size: 16px;
  font-family: "avant-garde-bold", sans-serif;
`
const FavoriteCompanyAmount = styled.div`
  font-size: 14px;
  font-family: "avant-garde-medium", sans-serif;
`
const FavoriteCompany = ({
  logo,
  name,
  amount
}: {
  logo: string
  name: string
  amount?: number
}) => (
  <FavoriteCompanyContainer>
    <FavoriteCompanyLogo src={logo || noLogoURL} />
    <Spacer height={"1rem"} />
    <FavoriteCompanyName>{name}</FavoriteCompanyName>
    {/* TODO: calculate and add checks for currency  */}
    {typeof amount === "number" && (
      <>
        <Spacer height={"0.25rem"} />
        <FavoriteCompanyAmount>{`Total spend: ${amount} kr`}</FavoriteCompanyAmount>{" "}
      </>
    )}
  </FavoriteCompanyContainer>
)

const TransactionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
  overflow-y: scroll;
  position: relative;
  padding: 20px 20px 20px 3px;
  max-height: 100%;
  height: 100%;
  min-height: 0;
  width: 100%;
  max-width: 100%;

  &::-webkit-scrollbar-thumb {
    background-color: black;
    border: 4px solid transparent;
    border-radius: 8px;
    background-clip: content-box;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #585858;
  }
  &::-webkit-scrollbar {
    width: 16px;
  }
`

const TransactionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 0px 0px 6px 1px #ccc;
  background: linear-gradient(45deg, #fff 0%, #f8f8f8 100%);
  & + & {
    margin-top: 20px;
  }
`
const TransactionCompanyName = styled.div`
  font-family: "avant-garde-bold";
  font-size: 13px;
  color: #333;
`
const TransactionAmount = styled.div`
  color: #333;
  font-size: 11px;
  font-family: "avant-garde-medium";
`
const TransactionInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: flex-start;
  justify-content: space-evenly;
  width: 100%;
`
const Transaction = ({
  companyName,
  amount
}: {
  companyName: string
  amount: number
}) => (
  <TransactionContainer>
    <ShoppingCartIcon htmlColor={"black"} />
    <Spacer width={"1rem"} />
    <TransactionInfoContainer>
      <TransactionCompanyName>{companyName}</TransactionCompanyName>
      <Spacer height={"0.25rem"} />
      <TransactionAmount>{`${amount} kr`}</TransactionAmount>
    </TransactionInfoContainer>
  </TransactionContainer>
)
const Transactions = ({ clusters }: { clusters: ITransactionCluster[] }) => (
  <TransactionsContainer>
    {clusters
      .map(c =>
        c.transactions.map((t, i) => (
          <Transaction
            key={i}
            amount={Math.abs(t.amount)}
            companyName={t.description}
          />
        ))
      )
      .flat(Infinity)}
  </TransactionsContainer>
)

const PurchaseContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
`
const Wrapper = styled.div`
  background: #fff;
  border-radius: 35px;
  box-shadow: 0px 0px 10px 1px #aaa;
  width: 275px;
  height: 275px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const FadeWrap = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
`
export const Purchases = () => {
  const [favoriteCompany, setFavoriteCompany] = React.useState<{
    name: string
    logo: string
    amount?: number
  } | null>(null)
  const [clusters, setClusters] = React.useState<ITransactionCluster[] | null>(
    null
  )
  const [user, setUser] = React.useState<IUser | null>(null)
  const accessToken = getAccessToken()

  React.useEffect(() => {
    apiGetTransactions().then(async clusters => {
      console.log(clusters)
      const companyCounter: Record<string, number> = {}
      clusters.forEach(cluster =>
        cluster.transactions.forEach(transaction => {
          if (!transaction.description || !transaction.amount) return
          const prevAmount = companyCounter[transaction.description]
          const curAmount = transaction.amount * -1 // expenses are negative
          companyCounter[transaction.description] = prevAmount
            ? prevAmount + curAmount
            : curAmount
        })
      )
      if (!Object.keys(companyCounter)) {
        setFavoriteCompany({
          name: "Seem like you have no favorite company :(",
          logo: noLogoURL
        })
      }
      const [favoriteCompanyName, amount] = Object.entries(
        companyCounter
      ).reduce((acc, cur) => {
        if (!acc) return cur
        if (acc[1] < cur[1]) return cur
        return acc
      })
      const logo = await getCompanyLogo(favoriteCompanyName)
      setFavoriteCompany({ name: favoriteCompanyName, logo, amount })
      setClusters(clusters)
    })

    apiGetUser().then(setUser)
  }, [])

  if (!accessToken) return <Redirect to="/" /> // TODO: remove quickfix for expiring session
  if (clusters === null || user === null)
    return <Loader text={"Crunching latest numbers..."} />
  return (
    <Modal wait={300}>
      <div>
        <Name>{`Welcome, ${user.name || "stranger"}.`}</Name>
        <Text>{"Let's have a look at your transations."}</Text>
      </div>
      <Spacer height={"2rem"} />
      <PurchaseContent>
        <Switch>
          <Route
            path="/purchases/favorite-store"
            render={() => (
              <FadeInOnPageLoad wait={0} duration={400} key={"1"}>
                <Wrapper>
                  <FavoriteCompany
                    name={favoriteCompany.name}
                    logo={favoriteCompany.logo}
                    amount={favoriteCompany.amount}
                  />
                </Wrapper>
              </FadeInOnPageLoad>
            )}
          />
          <Route
            path="/purchases/transactions"
            render={() => (
              <FadeInOnPageLoad wait={0} duration={400} key={"2"}>
                <FadeWrap>
                  <Transactions clusters={clusters} />
                </FadeWrap>
              </FadeInOnPageLoad>
            )}
          />
          <Redirect to="/purchases/favorite-store" />
        </Switch>
      </PurchaseContent>
      {/* footer must be absolute, spacer is filling space */}
      <Spacer height={"3rem"} />
      <PurchasesFooter>
        <FooterItem
          activeStyle={{ backgroundColor: "#000", color: "white" }}
          to="/purchases/favorite-store"
        >
          FAVORITE STORE
        </FooterItem>
        <FooterItem
          activeStyle={{ backgroundColor: "#000", color: "white" }}
          to="/purchases/transactions"
        >
          TRANSACTIONS
        </FooterItem>
        <FooterItem
          onClick={removeAccessToken}
          activeStyle={{ backgroundColor: "#000", color: "white" }}
          to="/"
          exact
        >
          LOG OUT
        </FooterItem>
      </PurchasesFooter>
    </Modal>
  )
}
