import React from "react"
import { Home } from "./components/Home"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import { Authentication } from "./components/Authentication"
import { Purchases } from "./components/Purchases"

export const AppRoutes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/callback" component={Authentication} />
      <Route path="/purchases" component={Purchases} />
      <Route path="/" component={Home} />
    </Switch>
  </BrowserRouter>
)
