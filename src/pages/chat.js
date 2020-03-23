import React from 'react'
const { useState, useEffect, useContext, useCallback } = React
import { withRouter, Link } from "react-router-dom";
import styled from '@emotion/styled';
import moment from 'moment'
import { ThemeProvider } from 'emotion-theming'
import { Avatar, Button, Input } from '@material-ui/core';
import { getData_byFB, pushData_byFB, updateData_byFB } from '../actions/basicActions'
import { ContextStore } from '../stores/index'

const Chat = (props) => {
  const name = localStorage.getItem('name') || ''
  const { messages, friendsList, messageDispatch, friendsListDispatch } = useContext(ContextStore)
  
  const { history } = props;
  const [message, setMessage] = useState("");
  const [selectFriend, setSelectFriend] = useState(null);

  useEffect(() => {
    //使用 WebSocket 的網址向 Server 開啟連結
    let ws = new WebSocket('wss://websocket-ted.herokuapp.com/')
    window.ws = ws
    //開啟後執行的動作，指定一個 function 會在連結 WebSocket 後執行
    ws.onopen = () => {
      console.log('open connection')
    }

    //關閉後執行的動作，指定一個 function 會在連結中斷後執行
    ws.onclose = () => {
      console.log('close connection')
    }

    //接收 Server 發送的訊息
    ws.onmessage = event => {
      const payload = JSON.parse(event.data)
      const msg = payload.msg
      const friends = {
        ...payload.friends,
        id: msg.from,
        name: msg.from
      }
      if(msg.to == name) {
        messageDispatch({payload: msg, type: 'ADD_MESSAGE'})
        updateData_byFB(`/friendsList/${name}/${msg.from}`, friends)
        friendsListDispatch({payload: friends, type: 'UPDATE_FRIENDS_LIST'})  
      }
    }   

    const fetchFriendsList = async () => {
      // 取得好友列表
      const friendListPayload = await getData_byFB(`/friendsList/${name}`)
      if(friendListPayload) {
        const payload = Object.keys(friendListPayload).map((index) => (friendListPayload[index]))
        friendsListDispatch({payload: payload, type: 'GET_FRIENDS_LIST'})
        handleSelectFriend(payload[0])
      }
    }
    fetchFriendsList()
  }, []);


  useEffect(()=> {
    if(selectFriend) fetchMessages()
  }, [selectFriend])

  useEffect(()=> {
    const msgArea = document.getElementById('msg-area')
    msgArea.scrollTop = msgArea.scrollHeight;
  }, [messages])


  const fetchMessages = () => {
    const friend = selectFriend.id
    const fetchData = async () => {      
      // 查好友與自己的對話資料
      const payload = await Promise.all([
        getData_byFB(`/messages/${name}`),
        getData_byFB(`/messages/${friend}`),
      ]);

      const myMsgs = payload[0] ? Object.keys(payload[0]).map((index) => (payload[0][index])) : []
      const toFriendMsgs = myMsgs.filter(msg=> msg.to == friend)

      const otherMsgs = payload[1] ? Object.keys(payload[1]).map((index) => (payload[1][index])) : []
      const friendMsgs = otherMsgs.filter(msg=> msg.from == friend && msg.to == name)

      
      const combinedPayload = toFriendMsgs.concat(friendMsgs)

      const sortPayload = combinedPayload.sort(function (a, b) {
        return a.timestamp - b.timestamp;
      });
      messageDispatch({payload: sortPayload, type: 'GET_MESSAGES'})
    };
    fetchData()
  };


  const handleSelectFriend = (payload) => {
    setSelectFriend(payload)
  };

  const handleChangeMessage = (e) => {
    const { value } = e.target;
    setMessage(value);
  };
  const handleKeyCode = (e) => {
    let keycode = (e.keyCode ? e.keyCode : e.which);
    if (!e.ctrlKey && (keycode == 13 || keycode == 10)) {
      handleSubmit(e)
    }
    else return;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const postData = {  
      content: message,
      timestamp: new Date().getTime(),
      to: selectFriend.id,
      from: name
    };
    const friendsListPostdata = {
      id: selectFriend.id,
      name: selectFriend.id,
      timestamp: new Date().getTime(),
      content: message
    };
    if(message.trim().length) {
      pushData_byFB(`/messages/${name}`, postData)
      messageDispatch({payload: postData, type: 'ADD_MESSAGE'})


      updateData_byFB(`/friendsList/${name}/${selectFriend.id}`, friendsListPostdata)
      friendsListDispatch({payload: friendsListPostdata, type: 'UPDATE_FRIENDS_LIST'})

      const wsJSON = {
        msg: postData,
        friends: friendsListPostdata
      }
      ws.send(JSON.stringify(wsJSON))
    }
    setMessage('')
    return;
  }

  return (
    <ChatContainer>
      <Container className="container">
        <FunctionBar></FunctionBar>
        <FriendsBar>
          <div className="search-bar"></div>
          <div className="friends-list">
            {friendsList && friendsList.map((friend, index) => (
              <div 
                className={`friend-block${(selectFriend && selectFriend.id == friend.id) ? ' selected': ''}`}
                key={index} 
                onClick={()=>{handleSelectFriend(friend)}}>
                <Avatar style={{width: '50px', height: '50px'}}>{friend.name && friend.name.substring(0, 1)}</Avatar>
                <div className="friend-info">
                  <div className="friend-name">{friend.name}</div>
                  <div className="friend-txt">{friend.content}</div>
                </div>
                <div className="latest-time">{moment(friend.timestamp).format('a LT')}</div>
              </div>
            ))}
          </div>
        </FriendsBar>
        <TxtFrame>
          <div className="friend-title">{selectFriend && selectFriend.name}</div>
          <MessageArea id="msg-area">
            {messages.map((message, index) => (
              <div key={index}>
                {message.from != name ?
                  <ThemeProvider theme={MsgTheme['friend']}>
                    <MsgBlock>
                      <Avatar className="friend-avatar">{selectFriend && selectFriend.name.substring(0,1)}</Avatar>
                      <div className="msg-display-block">{message.content}</div>
                      <div className="send-info-block">
                        <div>{moment(message.timestamp).format('a LT')}</div>
                      </div>
                    </MsgBlock>
                  </ThemeProvider> :
                  <ThemeProvider theme={MsgTheme['me']}>
                    <MsgBlock>
                      <div className="msg-display-block">{message.content}</div>
                      <div className="send-info-block">
                        <div>已讀</div>
                        <div>{moment(message.timestamp).format('a LT')}</div>
                      </div>
                    </MsgBlock>
                  </ThemeProvider>
                }      
              </div>
            ))}
          </MessageArea>
          <TypingArea onSubmit={handleSubmit}>
            <div className="function-block"></div>
            <textarea 
              value={message}
              className="txt-area" 
              onChange={handleChangeMessage}
              onKeyPress={handleKeyCode}>
            </textarea>
          </TypingArea>
        </TxtFrame>
        {/* <Button onClick={handleNewList}></Button> */}
      </Container>
    </ChatContainer>
  )
}

export default withRouter(Chat)

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

const ChatContainer = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  display: flex;
  align-items: center;
  height: 100%;
`;


const Container = styled.div`
  height: 500px;
  border: 1px solid lightgray;
  border-radius: 10px;
  box-shadow: 1px 1px 5px lightgrey;
  background-color: white;
  display: flex;
  padding: 0;
  overflow: hidden;
`

const FunctionBar = styled.div`
  width: 50px;
  height: 100%;
  background-color: rgb(45, 54, 73);
`

const FriendsBar = styled.div`
  width: 250px;
  height: 100%;
  border-right: 1px solid lightgray;
  .search-bar {
    width: 100%;
    height: 40px;
    border-bottom: 1px solid lightgray;
  }
  .friends-list {
    width: 100%;
    height: calc(100% - 40px);
    overflow: auto;
    .friend-block {
      cursor: pointer;
      width: 100%;
      height: 70px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      &.selected {
        background-color: rgb(233, 234, 238);
      }
      &:hover {
        background-color: rgb(237, 239, 242);
      }
      .friend-info {
        width: 105px;
        margin-left: 10px;
        font-size: 14px;
        height: 100%;
        transform: translateY(10px);
        .friend-name {
          color: black;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .friend-txt {
          color: rgb(148, 152, 162);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .latest-time {
        text-align: right;
        color: lightgray;
        font-size: 14px;
        flex: 1;
        height: 100%;
        transform: translateY(10px);
        white-space: nowrap;
      }
    }
  }
`

const TxtFrame = styled.div`
  width: calc(100% - 300px);
  font-size: 14px;  
  .friend-title {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 5px 10px;
    background-color: rgb(239, 242, 245);
    color: black;
    border-bottom: 1px solid lightgray;
  }
`

const MessageArea = styled.div`
  height: calc(100% - 170px);
  border-bottom: 1px solid lightgray;
  padding: 0 10px;
  overflow: auto;
`
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

const TypingArea = styled.form`
  height: 130px;
  display: flex;
  flex-direction: column;
  .function-block {
    height: 30px;
    background-color: rgb(246, 246, 246);
    border-bottom: 1px solid lightgray;
  }
  .txt-area {
    flex: 1;
    outline: none;
    resize: none;
    border: 0;
    padding: 10px;
  }
`

const SubmitForm = styled.form`
  display: flex;
  flex-direction: column;
  .input-block {
    margin-bottom: 15px;
  }
`