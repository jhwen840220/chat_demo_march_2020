import React from 'react'
import { ContextStore } from 'stores/index';

import styled from '@emotion/styled';
import { Avatar } from '@material-ui/core';
import moment from 'moment'

const FriendBlockContainer = (props) => {
  const { friend, onSelectedFriend, selectFriend } = props;

  const handleSelectFriend = (payload) => {
    onSelectedFriend(payload)
  };


  return (
    <FriendBlock 
      className={[(selectFriend && selectFriend.id == friend.id) ? 'selected': '']}
      onClick={()=>{handleSelectFriend(friend)}}
    >
      <Avatar style={{width: '50px', height: '50px'}}>{friend.name && friend.name.substring(0, 1)}</Avatar>
      <div className="friend-info">
        <div className="friend-name">{friend.name}</div>
        <div className="friend-txt">{friend.content}</div>
      </div>
      <div className="latest-time">{moment(friend.timestamp).format('a LT')}</div>
    </FriendBlock>
  )
}


export default FriendBlockContainer

const FriendBlock = styled.div`
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
`