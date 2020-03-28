import React from 'react'
const { useContext } = React;

import styled from '@emotion/styled';
import { Modal, Avatar, Button } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import moment from 'moment'
import { getData_byFB, pushData_byFB, updateData_byFB } from 'actions/basicActions'
import { ContextStore } from 'stores/index'

const SearchModal = (props) => {
  const name = localStorage.getItem('name') || ''
  const { visible, setVisible, friendInfo } = props;
  const { friendsListDispatch, selectFriendDispatch } = useContext(ContextStore)
  
  const handleClose = () => {
    setVisible(false)
  };

  const handleChat = async () => {
    const friends = {
      id: friendInfo.id,
      name: friendInfo.id
    }
    await updateData_byFB(`/friendsList/${name}/${friendInfo.id}`, friends)

    const friendListPayload = await getData_byFB(`/friendsList/${name}`)
    const payload = Object.keys(friendListPayload).map((index) => (friendListPayload[index]))

    // 放到 store 內
    friendsListDispatch({payload: payload, type: 'GET_FRIENDS_LIST'})
    // 預設選擇
    handleSelectFriend(friends)

    handleClose()
  }

  // 選擇好友帳戶
  const handleSelectFriend = (payload) => {
    selectFriendDispatch({payload, type: 'UPDATE_SELECT_FRIEND'})
  };



  return (
    <Modal
      open={visible} 
      onClose={handleClose}
    >
      <ModalFrame>
        {!friendInfo ?
          <ModalBody>
            <ErrorIcon fontSize="large" />
            <p>沒有任何搜尋結果。</p>
          </ModalBody> :
          (friendInfo == 'me' ?
            <ModalBody>
              <ErrorIcon fontSize="large" />
              <p>請勿輸入自己！</p>
            </ModalBody> :
            <ModalBody>
              <Avatar className="friend-avatar">{friendInfo && friendInfo.name.substring(0,1)}</Avatar>
              <p className="friend-name">{friendInfo.name}</p>
              <Button variant="contained" color="primary" onClick={handleChat}>
                跟他聊天吧！
              </Button>
            </ModalBody>
          )
        }
      </ModalFrame>
    </Modal>
  )
}


export default SearchModal

const ModalFrame = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  min-height: 300px;
  height: auto;
  padding: 20px;
  background-color: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgb(148,152,162);
  .friend-avatar {
    width: 75px;
    height: 75px;
    font-size: 50px;
  }
  .friend-name {
    color: black;
    font-size: 20px;
  }
`