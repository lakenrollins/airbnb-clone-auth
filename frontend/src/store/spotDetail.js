import { csrfFetch } from './csrf'

// Action Types
const SET_SPOT_DETAIL = 'spotDetail/SET_SPOT_DETAIL'
const SET_REVIEWS = 'spotDetail/SET_REVIEWS'
const SET_LOADING = 'spotDetail/SET_LOADING'

// Action Creators
const setSpotDetail = spot => ({ type: SET_SPOT_DETAIL, spot })
const setReviews = reviews => ({ type: SET_REVIEWS, reviews })
const setLoading = loading => ({ type: SET_LOADING, loading })

// Thunk
export const fetchSpotDetail = id => async dispatch => {
  dispatch(setLoading(true))
  const [spotRes, revRes] = await Promise.all([
    csrfFetch(`/api/spots/${id}`),
    csrfFetch(`/api/spots/${id}/reviews`)
  ])
  const spotData = await spotRes.json()
  const revData = await revRes.json()
  dispatch(setSpotDetail(spotData))
  dispatch(setReviews(revData.Reviews))
  dispatch(setLoading(false))
}

const initialState = {
  spot: null,
  reviews: [],
  loading: false
}

export default function spotDetailReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SPOT_DETAIL:
      return { ...state, spot: action.spot }
    case SET_REVIEWS:
      return { ...state, reviews: action.reviews }
    case SET_LOADING:
      return { ...state, loading: action.loading }
    default:
      return state
  }
}