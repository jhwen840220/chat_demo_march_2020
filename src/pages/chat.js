import React from 'react'
const { useState, useEffect, useContext, useCallback } = React
import { withRouter, Link } from "react-router-dom";
import styled from '@emotion/styled';
import { getData_byFB, pushData_byFB, updateData_byFB } from 'actions/basicActions'
import { ContextStore } from 'stores/index'

import { FriendBlock, MsgBlock, SearchBlock } from 'components'

const Chat = (props) => {
  const { history } = props;

  const { messages, friendsList, selectFriend, messageDispatch, friendsListDispatch, selectFriendDispatch } = useContext(ContextStore)
  const [message, setMessage] = useState("");

  const name = localStorage.getItem('name') || ''


  useEffect(() => {
    //使用 WebSocket 的網址向 Server 開啟連結
    // let ws = new WebSocket('ws://localhost:9070')
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
        content: payload.friends.content,
        timestamp: payload.friends.timestamp,
        id: msg.from,
        name: msg.from
      }
      if(msg.to == name) {
        pushData_byFB(`/friendsList/${name}/${msg.from}`, msg.from)
        updateData_byFB(`/friendsList/${name}/${msg.from}`, friends)
        friendsListDispatch({payload: friends, type: 'UPDATE_FRIENDS_LIST'})
        messageDispatch({payload: msg, type: 'ADD_MESSAGE'})
      
      }
    }   
  }, []);

  // 取得好友列表
  useEffect(() => {
    fetchFriendsList()
  }, []);

  
  // 有選擇朋友帳戶時，fetch Messages
  useEffect(() => {
    if(selectFriend && selectFriend.id) fetchMessages(selectFriend.id)
  }, [selectFriend])

  // 新訊息跳出時，滾到最底部
  useEffect(() => {
    const msgArea = document.getElementById('msg-area')
    if(msgArea) {
      msgArea.scrollTop = msgArea.scrollHeight;
    }
  }, [messages])


  const fetchFriendsList = async () => {
    const friendListPayload = await getData_byFB(`/friendsList/${name}`)
    if(friendListPayload) {
      const payload = Object.keys(friendListPayload).map((index) => (friendListPayload[index]))

      // 放到 store 內
      friendsListDispatch({payload: payload, type: 'GET_FRIENDS_LIST'})
      // 預設選擇第一筆
      handleSelectFriend(payload[0])
    }
    else {
      // 登入一筆新的id
      pushData_byFB(`users/${name}`, name)
      updateData_byFB(`/users/${name}`, {
        id: name,
        name
      })
    }
  }
  const fetchMessages = (friend) => {
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

  // 選擇好友帳戶
  const handleSelectFriend = (payload) => {
    selectFriendDispatch({payload, type: 'UPDATE_SELECT_FRIEND'})
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
    if(selectFriend && selectFriend.id) {
      const messagePostData = {  
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
        pushData_byFB(`/messages/${name}`, messagePostData)
        messageDispatch({payload: messagePostData, type: 'ADD_MESSAGE'})

        updateData_byFB(`/friendsList/${name}/${selectFriend.id}`, friendsListPostdata)
        friendsListDispatch({payload: friendsListPostdata, type: 'UPDATE_FRIENDS_LIST'})

        // 傳送data 給 websocket，轉成string
        const wsJSON = {
          msg: messagePostData,
          friends: friendsListPostdata
        }
        ws.send(JSON.stringify(wsJSON))
      }
    }

    // 清空message text-area
    setMessage('')
    return;
  }


  return (
    <ChatContainer>
      <Container className="container">
        <FunctionBar></FunctionBar>
        <FriendsBar>
          <SearchBlock />
          <div className="friends-list">
            {friendsList && friendsList.map((friend, index) => (
              <FriendBlock 
                key={friend.id} 
                friend={friend}
                onSelectedFriend={handleSelectFriend}
                selectFriend={selectFriend} /> 
            ))}     
          </div>
        </FriendsBar>
        <TxtFrame>
          <div className="friend-title">{selectFriend && selectFriend.name}</div>
          {friendsList.length && selectFriend && selectFriend.id ? 
            <MessageArea id="msg-area">
              {messages.map((message, index) => (
                <MsgBlock 
                  key={index}
                  msgType={message.from != name ? 'friend' : 'me'}
                  selectFriend={selectFriend}
                  message={message}
                />    
              ))}
            </MessageArea> :
            <MessageArea className="empty">快搜尋朋友一起聊天吧！</MessageArea>
          }
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
      </Container>
    </ChatContainer>
  )
}

export default withRouter(Chat)


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
`;

const FunctionBar = styled.div`
  width: 50px;
  height: 100%;
  background-color: rgb(45, 54, 73);
`;

const FriendsBar = styled.div`
  width: 250px;
  height: 100%;
  border-right: 1px solid lightgray;
  .friends-list {
    width: 100%;
    height: calc(100% - 40px);
    overflow: auto;
  }
`;

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
`;

const MessageArea = styled.div`
  height: calc(100% - 170px);
  border-bottom: 1px solid lightgray;
  padding: 0 10px;
  overflow: auto;
  &.empty {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

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
`;
