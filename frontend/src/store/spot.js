import { csrfFetch } from './csrf'

// Action Types
const SET_SPOTS = 'spots/SET_SPOTS'
const SET_LOADING = 'spots/SET_LOADING'
const SET_ERROR = 'spots/SET_ERROR'

// Action Creators
const setSpots = spots => ({ type: SET_SPOTS, spots })
const setLoading = loading => ({ type: SET_LOADING, loading })
const setError = error => ({ type: SET_ERROR, error })

// Thunk
export const fetchSpots = () => async dispatch => {
  dispatch(setLoading(true))
  dispatch(setError(null))
  try {
    const res = await csrfFetch('/api/spots?page=1&size=20')
    if (!res.ok) throw new Error('Failed to fetch spots')
    const data = await res.json()
    // Enrich with avgRating
    const enriched = await Promise.all(
      data.spots.map(async spot => {
        const revRes = await csrfFetch(`/api/spots/${spot.id}/reviews`)
        let avg = 'New'
        if (revRes.ok) {
          const { Reviews } = await revRes.json()
          if (Reviews.length) {
            const total = Reviews.reduce((sum, r) => sum + r.stars, 0)
            avg = (total / Reviews.length).toFixed(1)
          }
        }
        return { ...spot, avgRating: avg }
      })
    )
    dispatch(setSpots(enriched))
  } catch (err) {
    dispatch(setError(err.message))
  } finally {
    dispatch(setLoading(false))
  }
}

// Initial State
const initialState = {
  spots: [],
  loading: false,
  error: null
}

// Reducer
export default function spotReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SPOTS:
      return { ...state, spots: action.spots }
    case SET_LOADING:
      return { ...state, loading: action.loading }
    case SET_ERROR:
      return { ...state, error: action.error }
    default:
      return state
  }
}