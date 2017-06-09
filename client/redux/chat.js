import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'
// import { createSelector } from 'reselect'
// import { includes, toLower } from 'lodash'

const defaultState = {
  auth: false,
  showChatWindow: false,
  selectedChat: null,
  chats: []
  // chatsFilterQuery: ''
}

export const login = createAction('chat/LOGIN', async password => {
  const { data } = await axios.post('/api/mongo/chat/login', {
    password
  })
  return data
})

export const getChatList = createAction('chat/GET_CHAT_LIST', async () => {
  const { data } = await axios('/api/mongo/chat/list')
  return data.chats
})

export const getMessageList = createAction('chat/GET_MESSAGE_LIST', async chatId => {
  const { data } = await axios(`/api/mongo/chat/${chatId}/message`)
  return {
    chatId,
    messages: data.messages
  }
})

export const startChat = (radarId, user) => async dispatch => {
  const { data } = await axios.post(`/api/mongo/chat/dialog`, {
    userId: radarId
  })

  if (data.type === 'error' && data.errCode === 1300) {
    return dispatch({
      type: 'chat/START_CHAT_WITH_NO_FRIEND',
      payload: {
        user,
        radarId
      }
    })
  }

  if (data.type === 'success') {
    return dispatch({
      type: 'chat/START_CHAT_WITH_FRIEND',
      payload: data.chatId
    })
  }
}

const startChatWithFriend = createAction('chat/START_CHAT_WITH_FRIEND')

const startChatWithNoFriend = createAction('chat/START_CHAT_WITH_NO_FRIEND')

export const sendMessage = createAction('chat/SEND_MESSAGE', async (chatId, text) => {
  const { data } = await axios.post(`/api/mongo/chat/${chatId}/message`, {
    text
  })

  return data
})

export const sendWelcomeMessage = createAction('chat/SEND_WELCOME_MESSAGE', async (chatId, text) => {
  const { data } = await axios.post(`/api/mongo/chat/${chatId}/friend`, {
    text
  })

  return {
    ...data,
    chatId,
    text
  }
})

export const acceptFriend = createAction('chat/ACCEPT_FRIEND', async userId => {
  const { data } = await axios.post(`/api/mongo/chat/${userId}/friend`)
  console.log(data)
})

export const openChatWindow = createAction('chat/OPEN_CHAT_WINDOW')

export const closeChatWindow = createAction('chat/CLOSE_CHAT_WINDOW')

export const toggleChatWindow = createAction('chat/TOGGLE_CHAT_WINDOW')

export const selectChat = createAction('chat/SELECT')

export const setChatsFilterQuery = createAction('chat/SET_CHATS_FILTER_QUERY')

const receiveData = createAction('chat/RECEIVE_DATA')

export const listen = () => async dispatch => {
  try {
    const { data } = await axios.get('/api/mongo/chat/access_token')
    const token = data

    const socket = new WebSocket(`ws://bmchat.maximumsoft.ru/notify/?accessToken=${token}`)

    socket.onopen = () => {
      dispatch({
        type: 'chat/START_LISTEN'
      })
    }

    socket.onmessage = ({ data }) => {
      dispatch(receiveData(data))
    }

    socket.onclose = e => {
      const action = {
        type: 'chat/FINISH_LISTEN'
      }

      if (e.code !== 1000) {
        action.error = true
        action.paylaod = {
          code: e.code,
          reason: e.reason
        }
      }

      dispatch(action)
    }
  } catch (e) {
    console.error(e)
  }
}

// фильтр списка чатов через reselect
// const chatListSelector = state => state.chat.chats || []
// const chatsFilterQuerySelector = state => state.chat.chatsFilterQuery || ''
// export const getFilteredChatList = createSelector(
//   chatListSelector,
//   chatsFilterQuerySelector,
//   (chats, query) => chats.filter(chat => includes(toLower(chat.chatName), toLower(query)))
// )

export default handleActions({
  [login]: (state, action) => ({
    ...state,
    auth: true
  }),
  [getChatList]: (state, action) => ({
    ...state,
    chats: action.payload
  }),
  [getMessageList]: (state, action) => ({
    ...state,
    chats: state.chats.map(chat => {
      if (chat.chatId === action.payload.chatId) {
        return { ...chat, messages: action.payload.messages }
      }
      return chat
    })
  }),
  [receiveData]: (state, action) => {
    const event = JSON.parse(action.payload)
    if (event.type === 'chatMessage') {
      return {
        ...state,
        chats: state.chats.map(chat => {
          if (chat.chatId === event.chatId) {
            return { ...chat, messages: [...chat.messages, event.message] }
          }
          return chat
        })
      }
    }
    return state
  },
  [openChatWindow]: state => ({ ...state, showChatWindow: true }),
  [closeChatWindow]: state => ({ ...state, showChatWindow: false }),
  [toggleChatWindow]: state => ({ ...state, showChatWindow: !state.showChatWindow }),
  [selectChat]: (state, { payload }) => ({ ...state, selectedChat: payload }),
  [startChatWithNoFriend]: (state, { payload }) => ({
    ...state,
    chats: [{
      chatId: payload.radarId,
      chatName: `${payload.user.first_name} ${payload.user.last_name}`,
      avatar: `${payload.user.picture_small}`,
      isGroup: false,
      userId: payload.radarId,
      isNoFriend: true,
      messages: []
    }, ...state.chats],
    showChatWindow: true,
    selectedChat: payload.radarId
  }),
  [startChatWithFriend]: (state, { payload }) => ({
    ...state,
    showChatWindow: true,
    selectedChat: payload
  }),
  [setChatsFilterQuery]: (state, { payload }) => ({
    ...state,
    chatsFilterQuery: payload
  }),
  [sendWelcomeMessage]: (state, { payload }) => ({
    ...state,
    chats: state.chats.map(chat => {
      if (chat.chatId === payload.chatId) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            {
              text: payload.text
            }
          ]
        }
      } else {
        return chat
      }
    })
  })
}, defaultState)
