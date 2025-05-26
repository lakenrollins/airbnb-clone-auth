import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import {thunk} from 'redux-thunk'
import sessionReducer from './session'
import spotReducer from './spot'
import spotDetailReducer from './spotDetail'
import review from './review'
import bookingReducer from './booking'

const rootReducer = combineReducers({ session: sessionReducer,     spots: spotReducer, spotDetail: spotDetailReducer, review: review, booking: bookingReducer })

let enhancer = applyMiddleware(thunk)
if (import.meta.env.MODE !== 'production') {
  const { default: logger }               = await import('redux-logger')
  const composeEnhancers                   = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  enhancer                                 = composeEnhancers(applyMiddleware(thunk, logger))
}

export default function configureStore(preloadedState) {
  return createStore(rootReducer, preloadedState, enhancer)
}