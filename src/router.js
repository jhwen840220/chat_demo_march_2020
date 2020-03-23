import React, { useEffect, useState } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import Homepage from './pages/index'
import Chat from './pages/chat'

const Routes = (props) => {
  const { history } = props
  const pathname = history.location.pathname
  useEffect(()=> {
    if(pathname != '/') {
      if(!localStorage.getItem('name')) {
        history.push('/')
      }
    }
  },[pathname])

  return (
    <main style={{height: '100%'}}>
      <Switch>
        <Route exact path="/" component={Homepage}></Route>
        <Route path="/chat" component={Chat}></Route>
      </Switch>
    </main>
  )
}

export default withRouter(Routes)

