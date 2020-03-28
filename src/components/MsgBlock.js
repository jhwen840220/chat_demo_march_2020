import React from 'react'

import styled from '@emotion/styled';
import { Avatar } from '@material-ui/core';
import moment from 'moment'
import { ThemeProvider } from 'emotion-theming'

const MsgBlockContainer = (props) => {
  const { msgType, selectFriend, message } = props;


  return (
    <ThemeProvider theme={MsgTheme[msgType]}>
      <MsgBlock>
        {msgType == 'friend' && <Avatar className="friend-avatar">{selectFriend && selectFriend.name.substring(0,1)}</Avatar>}
        <div className="msg-display-block">{message.content}</div>
        <div className="send-info-block">
          {msgType == 'me' && <div>已讀</div>}
          <div>{moment(message.timestamp).format('a LT')}</div>
        </div>
      </MsgBlock>
    </ThemeProvider>
  )
}


export default MsgBlockContainer

const MsgTheme = {
  friend: {
    direction: 'ltr',
    msgMargin: '0 0 0 50px',
    msgBgColor: 'rgb(228, 232, 235)',
    beforeArrow: 'block',
    afterArrow: 'none',
    sendInfoMargin: '0 0 0 10px',
    sendInfoAlign: 'left'
  },
  me: {
    direction: 'rtl',
    msgMargin: '0 10px 0 0',
    msgBgColor: 'rgb(190, 241, 140)',
    beforeArrow: 'none',
    afterArrow: 'block',
    sendInfoMargin: '0 10px 0 0',
    sendInfoAlign: 'right'
  }
}

const MsgBlock = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  width: 100%;
  min-height: 40px;
  margin-bottom: 10px;
  direction: ${({theme})=> theme.direction};
  &:first-of-type {
    margin-top: 10px;
  }
  .friend-avatar {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .msg-display-block {
    direction: ltr;
    position: relative;
    display: flex;
    align-items: center;
    min-height: 30px;
    margin: ${({theme})=> theme.msgMargin};
    padding: 5px 10px;
    background-color: ${({theme})=> theme.msgBgColor};
    border-radius: 20px;
    word-break: break-word;
    &:before {
      content: '';
      display: ${({theme})=> theme.beforeArrow};
      position: absolute;
      left: -5px;
      border: 6px solid transparent;
      border-right-color: ${({theme})=> theme.msgBgColor};
      border-left-width: 0;
    }
    &:after {
      content: '';
      display: ${({theme})=> theme.afterArrow};
      position: absolute;
      right: -5px;
      border: 6px solid transparent;
      border-left-color: ${({theme})=> theme.msgBgColor};
      border-right-width: 0;
    }
  }
  .send-info-block {
    margin: ${({theme})=> theme.sendInfoMargin};
    flex: 1;
    color: rgb(190, 193, 198);
    white-space: nowrap;
    font-size: 12px;
    text-align: ${({theme})=> theme.sendInfoAlign};
  }
`