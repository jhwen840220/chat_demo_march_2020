import React, { createContext } from 'react'



const initState = {
  messageInitState: { messages: [] },
  friendsListInitState : { friendsList: []}
}
const ContextStore = createContext({
  messages: [],
  friendsList: []
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
          friendsList: payload
        })

      case 'ADD_FRIEND':
        return Object.assign({}, state, {
          friendsList: state.friendsList.concat(payload)
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