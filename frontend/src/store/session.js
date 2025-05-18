// frontend/src/store/session.js
import { csrfFetch } from './csrf'
const SET_USER    = 'session/setUser'
const REMOVE_USER = 'session/removeUser'
const setUser     = payload => ({ type: SET_USER,    payload })
const removeUser  = ()      => ({ type: REMOVE_USER })

export const login = ({ credential, password }) => async dispatch => {
  const res      = await csrfFetch('/api/session', { method: 'POST', body: JSON.stringify({ credential, password }) })
  const { user } = await res.json()
  dispatch(setUser(user))
  return res
}

export const restoreUser = () => async dispatch => {
  const res      = await csrfFetch('/api/session')
  const { user } = await res.json()
  if (user) dispatch(setUser(user))
  return res
}

export const signup = ({ username, firstName, lastName, email, password }) => async dispatch => {
  const res      = await csrfFetch('/api/users', { method: 'POST', body: JSON.stringify({ username, firstName, lastName, email, password }) })
  const { user } = await res.json()
  dispatch(setUser(user))
  return res
}

export const logout = () => async dispatch => {
  const res = await csrfFetch('/api/session', { method: 'DELETE' })
  dispatch(removeUser())
  return res
}

const initialState = { user: null }
export default function sessionReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_USER:    return { user: payload }
    case REMOVE_USER: return { user: null }
    default:          return state
  }
}