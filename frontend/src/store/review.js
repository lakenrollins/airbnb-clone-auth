import { csrfFetch } from './csrf'

// Action Types
const SET_REVIEWS = 'reviews/SET_REVIEWS'
const ADD_REVIEW = 'reviews/ADD_REVIEW'
const DELETE_REVIEW = 'reviews/DELETE_REVIEW'
const SET_LOADING = 'reviews/SET_LOADING'

// Action Creators
const setReviews = reviews => ({ type: SET_REVIEWS, reviews })
const addReview = review => ({ type: ADD_REVIEW, review })
const deleteReview = reviewId => ({ type: DELETE_REVIEW, reviewId })
const setLoading = loading => ({ type: SET_LOADING, loading })

// Thunks
export const fetchReviews = spotId => async dispatch => {
  dispatch(setLoading(true))
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
  const data = await res.json()
  dispatch(setReviews(data.Reviews))
  dispatch(setLoading(false))
}

export const createReview = (spotId, reviewData) => async dispatch => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(reviewData)
  })
  const data = await res.json()
  dispatch(addReview(data))
  return data
}

export const removeReview = (spotId, reviewId) => async dispatch => {
  await csrfFetch(`/api/reviews/${reviewId}`, { method: 'DELETE' })
  dispatch(deleteReview(reviewId))
}

// Initial State
const initialState = {
  reviews: [],
  loading: false
}

// Reducer
export default function reviewReducer(state = initialState, action) {
  switch (action.type) {
    case SET_REVIEWS:
      return { ...state, reviews: action.reviews }
    case ADD_REVIEW:
      return { ...state, reviews: [action.review, ...state.reviews] }
    case DELETE_REVIEW:
      return { ...state, reviews: state.reviews.filter(r => r.id !== action.reviewId) }
    case SET_LOADING:
      return { ...state, loading: action.loading }
    default:
      return state
  }
}