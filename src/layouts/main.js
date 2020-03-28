import React, { useReducer } from 'react'
import { ThemeProvider } from 'emotion-theming'
import styled from '@emotion/styled'
import Footer from '../components/footer'
import { ContextStore, initState, actions } from '../stores/index'

const { messageInitState, friendsListInitState, selectFriendInitState } = initState
const { messageReducer, friendsListReducer, selectFriendReducer } = actions

const Main = (props) => {
  const [messageState, messageDispatch] = useReducer(messageReducer, messageInitState);
  const [friendsListState, friendsListDispatch] = useReducer(friendsListReducer, friendsListInitState);
  const [selectFriendState, selectFriendDispatch] = useReducer(selectFriendReducer, selectFriendInitState);

  const { children } = props

  return (
    <ContextStore.Provider
      value={{
        messages: messageState.messages,
        friendsList: friendsListState.friendsList,
        selectFriend: selectFriendState.selectFriend,
        messageDispatch,
        friendsListDispatch,
        selectFriendDispatch
      }}>
      <ThemeProvider theme={theme['basic']}>
        <MainFrame>
          <Body>
            {children}
          </Body>
          <Footer />
        </MainFrame>
      </ThemeProvider>
    </ContextStore.Provider>
  )
}

export default Main

const theme = {
  basic: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
};

const MainFrame = styled.div`
  height: 100vh;
`

const Body = styled.div`
  height: calc(100% - 25px)`