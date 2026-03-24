import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotificationMessage(state, action) {
      return action.payload
    },
    removeNotification(state, action) {
      return null
    },
  },
})

const { setNotificationMessage, removeNotification } = notificationSlice.actions

export const setNotification = (message, isSuccessful = true, seconds = 5) => {
  return async (dispatch) => {
    dispatch(setNotificationMessage({ message, isSuccessful }))

    setTimeout(() => {
      dispatch(removeNotification())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
