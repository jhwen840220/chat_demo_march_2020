import React, { useContext, useEffect, useState } from 'react'
import ReactDom from 'react-dom'
import { HashRouter, BrowserRouter } from 'react-router-dom';
import Routes from './router'
import 'style/custom.scss'
import Main from 'layouts/main'
import moment from 'moment';
import 'moment/locale/zh-tw';
import { ContextStore } from './stores/index'

moment.updateLocale('zh-tw', {
  meridiem : function (hour, minute, isLowercase) {
      if (hour < 12) {
          return "上午";
      } else {
          return "下午";
      }
  }
});
const App = () => {
  return (
    <Main>
      <HashRouter>
        <Routes></Routes>
      </HashRouter>
    </Main>
  )
}




ReactDom.render(<App></App>, document.getElementById('app'))