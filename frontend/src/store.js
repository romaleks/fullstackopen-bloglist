import { configureStore } from '@reduxjs/toolkit'
import userSlice from './reducers/userReducer'
import notificationSlice from './reducers/notificationReducer'

const store = configureStore({
  reducer: {
    user: userSlice,
    notification: notificationSlice,
  },
})

export default store
