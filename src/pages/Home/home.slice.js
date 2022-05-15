import { createSlice } from '@reduxjs/toolkit'
import { getDatabase, onValue, ref } from 'firebase/database'

export const getMessageData = async dispatch => {
  onValue(ref(getDatabase(), '/message'), snapshot => {
    if (snapshot.val()) {
      let array = []
      Object.keys(snapshot.val()).forEach(key => {
        array = [...array, { id: key, chat: snapshot.val()[key].chat }]
      })

      // let sortArray = [...array].sort((a, b) => a.value.number - b.value.number)

      // console.log(array)
      dispatch(getMessage(array))
    } else {
      dispatch(getMessage(null))
    }
  })
}

export const messageSlice = createSlice({
  name: 'message',
  initialState: {
    message: null
  },
  reducers: {
    getMessage: (state, action) => {
      state.message = action.payload
    }
  }
})

export const { getMessage, removeBooking } = messageSlice.actions
// selectors
// export const selectUser = state => state.floor.floor

export default messageSlice.reducer
