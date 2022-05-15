import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import authReducer from './pages/auth/auth.slice'
import friendReducer from './pages/Friend/friend.slice'
import messageReducer from './pages/Home/home.slice'
// import appReducer from './app.slice'

const rootReducer = {
  auth: authReducer,
  friend: friendReducer,
  message: messageReducer
}

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV === 'development',
  middleware: [...getDefaultMiddleware({ serializableCheck: false })]
})

export default store
