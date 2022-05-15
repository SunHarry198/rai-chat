import { createSlice } from '@reduxjs/toolkit'
import { getDatabase, onValue, ref } from 'firebase/database'

export const getFriendData = async (dispatch, fid) => {
  onValue(ref(getDatabase(), '/friends/' + fid), snapshot => {
    if (snapshot.val()) {
      let array = []
      let data = null
      if (snapshot.val().friend) {
        Object.keys(snapshot.val().friend).forEach(key => {
          array = [...array, { id: key, value: snapshot.val().friend[key] }]
        })
        data = {
          list: [...array],
          userId: snapshot.val().userId
        }
      } else {
        data = {
          list: null,
          userId: snapshot.val().userId
        }
      }

      dispatch(getFriend(data))
    } else {
      dispatch(getFriend(null))
    }
  })
}

export const friendSlice = createSlice({
  name: 'friend',
  initialState: {
    friend: null
  },
  reducers: {
    getFriend: (state, action) => {
      state.friend = action.payload
    },
    removeBooking: state => {
      state.friend = null
    }
  }
})

export const { getFriend, removeBooking } = friendSlice.actions
// selectors
// export const selectUser = state => state.floor.floor

export default friendSlice.reducer
