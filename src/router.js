import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Homepage from './pages/index'
import Chat from './pages/chat'

const routes = (
  <main style={{height: '100%'}}>
    <Switch>
      <Route exact path="/" component={Homepage}></Route>
      <Route path="/chat" component={Chat}></Route>
    </Switch>
  </main>
);

export default routes

