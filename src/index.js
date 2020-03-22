import React, { useContext, useEffect, useState } from 'react'
import ReactDom from 'react-dom'
import { HashRouter, BrowserRouter } from 'react-router-dom';
import routes from './router'
import './style/custom.scss'
import Main from './layouts/main'
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
      <BrowserRouter>
        {routes}
      </BrowserRouter>
    </Main>
  )
}




ReactDom.render(<App></App>, document.getElementById('app'))