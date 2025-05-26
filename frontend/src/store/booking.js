import { csrfFetch } from './csrf'

// Action Types
const SET_BOOKINGS = 'bookings/SET_BOOKINGS'
const ADD_BOOKING = 'bookings/ADD_BOOKING'
const UPDATE_BOOKING = 'bookings/UPDATE_BOOKING'
const DELETE_BOOKING = 'bookings/DELETE_BOOKING'
const SET_LOADING = 'bookings/SET_LOADING'
const SET_ERROR = 'bookings/SET_ERROR'

// Action Creators
const setBookings = bookings => ({ type: SET_BOOKINGS, bookings })
const addBooking = booking => ({ type: ADD_BOOKING, booking })
const updateBooking = booking => ({ type: UPDATE_BOOKING, booking })
const deleteBooking = bookingId => ({ type: DELETE_BOOKING, bookingId })
const setLoading = loading => ({ type: SET_LOADING, loading })
const setError = error => ({ type: SET_ERROR, error })

// Thunks


export const fetchUserBookings = () => async dispatch => {
  dispatch(setLoading(true))
  dispatch(setError(null))
  try {
    const res = await csrfFetch('/api/bookings/current', {
  headers: { 'Cache-Control': 'no-cache' }
})
    const data = await res.json()
    dispatch(setBookings(data.Bookings))
  } catch (err) {
    dispatch(setError('Could not fetch your bookings'))
  } finally {
    dispatch(setLoading(false))
  }
}
// Create a booking for a spot
export const createBooking = (spotId, bookingData) => async dispatch => {
  dispatch(setLoading(true))
  dispatch(setError(null))
  try {
    const res = await csrfFetch(`/api/spots/${spotId}/bookings`, {
      method: 'POST',
      body: JSON.stringify(bookingData)
    })
    const data = await res.json()
    dispatch(addBooking(data))
    return data
  } catch (err) {
    dispatch(setError('Could not create booking'))
    throw err
  } finally {
    dispatch(setLoading(false))
  }
}

export const editBooking = (bookingId, bookingData) => async dispatch => {
  dispatch(setLoading(true))
  dispatch(setError(null))
  try {
    const res = await csrfFetch(`/api/bookings/${bookingId}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData)
    })
    const data = await res.json()
    dispatch(updateBooking(data))
    return data
  } catch (err) {
    dispatch(setError('Could not update booking'))
    throw err
  } finally {
    dispatch(setLoading(false))
  }
}

// Delete a booking (no spotId needed)
export const removeBooking = bookingId => async dispatch => {
  dispatch(setLoading(true))
  dispatch(setError(null))
  try {
    await csrfFetch(`/api/bookings/${bookingId}`, {
      method: 'DELETE'
    })
    dispatch(deleteBooking(bookingId))
  } catch (err) {
    dispatch(setError('Could not delete booking'))
    throw err
  } finally {
    dispatch(setLoading(false))
  }
}
// Initial State
const initialState = {
  bookings: [],
  loading: false,
  error: null
}

// Reducer
export default function bookingReducer(state = initialState, action) {
  switch (action.type) {
    case SET_BOOKINGS:
      return { ...state, bookings: action.bookings }
    case ADD_BOOKING:
      return { ...state, bookings: [...state.bookings, action.booking] }
    case UPDATE_BOOKING:
      return {
        ...state,
        bookings: state.bookings.map(b =>
          b.id === action.booking.id ? action.booking : b
        )
      }
    case DELETE_BOOKING:
      return {
        ...state,
        bookings: state.bookings.filter(b => b.id !== action.bookingId)
      }
    case SET_LOADING:
      return { ...state, loading: action.loading }
    case SET_ERROR:
      return { ...state, error: action.error }
    default:
      return state
  }
}