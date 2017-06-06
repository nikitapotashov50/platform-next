import axios from 'axios'
import { handleActions, createAction } from 'redux-actions'

const defaultState = {
  auth: false,
  showChatWindow: false,
  selectedChat: null,
  chats: []
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

export const sendMessage = createAction('chat/SEND_MESSAGE', async (chatId, text) => {
  const { data } = await axios.post(`/api/mongo/chat/${chatId}/message`, {
    text
  })

  return data
})

export const openChatWindow = createAction('chat/OPEN_CHAT_WINDOW')

export const closeChatWindow = createAction('chat/CLOSE_CHAT_WINDOW')

export const toggleChatWindow = createAction('chat/TOGGLE_CHAT_WINDOW')

export const selectChat = createAction('chat/SELECT')

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

    socket.onclose = () => {
      dispatch({
        type: 'chat/FINISH_LISTEN'
      })
    }
  } catch (e) {
    console.error(e)
  }
}

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
  [selectChat]: (state, payload) => ({ ...state, selectedChat: payload })
}, defaultState)
