import React, { createContext } from 'react'



const initState = {
  messageInitState: { messages: [] },
  friendsListInitState : { friendsList: [] },
  selectFriendInitState : { selectFriend: null }
}
const ContextStore = createContext({
  messages: [],
  friendsList: [],
  selectFriend: null
})

const actions = {
  // 建立 reducer
  messageReducer: (state, action) => {
    const { payload } = action

    switch(action.type) {
      case 'GET_MESSAGES':

        return Object.assign({}, state, {
          messages: payload
        })

      case 'ADD_MESSAGE':
        return Object.assign({}, state, {
          messages: state.messages.concat(payload)
        })
      default:
        return state
    }
  },
  friendsListReducer: (state, action) => {
    const { payload } = action

    switch(action.type) {
      case 'GET_FRIENDS_LIST':
        return Object.assign({}, state, {
          friendsList: payload.sort(function (a, b) {
            return b.timestamp - a.timestamp;
          })
        })
      case 'UPDATE_FRIENDS_LIST':
        const friendIndex = state.friendsList.findIndex(friend=> friend.id == payload.id);
        if(friendIndex > -1) state.friendsList[friendIndex] = payload
        else state.friendsList.push(payload)
        return Object.assign({}, state, {
          friendsList: state.friendsList.sort(function (a, b) {
            return b.timestamp - a.timestamp;
          })
        })
      case 'ADD_FRIEND':
        return Object.assign({}, state, {
          friendsList: state.friendsList.concat(payload)
        })
      default:
        return state
    }
  },
  selectFriendReducer: (state, action) => {
    const { payload } = action
    switch(action.type) {
      case 'UPDATE_SELECT_FRIEND':
        return Object.assign({}, state, {
          selectFriend: payload
        })
      default:
        return state
    }
  }
}

export {
  ContextStore,
  initState,
  actions
  // messageReducer: (state, action) => {
  //   switch(action.type) {
  //     case 'ADD_MESSAGE':
  //       return Object.assign({}, state, {
  //         todos: state.messages.concat('eat')
  //       })
  //     default:
  //       return state
  //   }
  // }
}