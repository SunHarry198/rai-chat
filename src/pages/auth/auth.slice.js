import { createSlice } from '@reduxjs/toolkit'
import LocalStorage from 'src/constants/LocalStorage'
import { getDatabase, onValue, ref } from 'firebase/database'
import { toast } from 'react-toastify'

export const getUser = (userAuth, dispatch, name) => {
  const userId = userAuth.user.uid
  const message =
    name === 'login' ? 'Đăng nhập nhập thành công!' : 'Đăng ký thành công!'
  onValue(
    ref(getDatabase(), '/users/' + userId),
    snapshot => {
      const data = snapshot.val() || 'Anonymous'
      if (data.isAdmin) {
        dispatch(
          login({
            isAdmin: true,
            email: data.email,
            uid: userAuth.user.uid,
            name: data.name,
            friendId: data.friendId,
            image: data.image,
            age: data.age,
            accessToken: userAuth.user.accessToken
          })
        )
      } else {
        dispatch(
          login({
            email: data.email,
            uid: userAuth.user.uid,
            name: data.name,
            friendId: data.friendId,
            image: data.image,
            age: data.age,
            accessToken: userAuth.user.accessToken
          })
        )
      }

      toast.success(message, {
        position: 'top-center',
        autoClose: 3000
      })
    },
    {
      onlyOnce: true
    }
  )
}
export const getAuthUpdate = (user, dispatch) => {
  const userId = user.uid
  onValue(
    ref(getDatabase(), '/users/' + userId),
    snapshot => {
      const data = snapshot.val() || 'Anonymous'
      dispatch(
        updateProfile({
          email: data.email,
          uid: userId,
          name: data.name,
          image: data.image,
          friendId: user.friendId,
          age: data.age,
          accessToken: user.accessToken
        })
      )
      toast.success('Cập nhật hồ sơ thành công!', {
        position: 'top-center',
        autoClose: 3000
      })
    },
    {
      onlyOnce: true
    }
  )
}

const handleUnauth = state => {
  state.profile = {}
  localStorage.removeItem(LocalStorage.user)
  localStorage.setItem(LocalStorage.userStatus, false)
  localStorage.removeItem(LocalStorage.accessToken)
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: JSON.parse(localStorage.getItem(LocalStorage.user)) || null
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload
      localStorage.setItem(LocalStorage.user, JSON.stringify(state.user))
      localStorage.setItem(LocalStorage.userStatus, true)
      localStorage.setItem(
        LocalStorage.accessToken,
        JSON.stringify(state.user.accessToken)
      )
    },
    updateProfile: (state, action) => {
      state.user = action.payload
      localStorage.setItem(LocalStorage.user, JSON.stringify(state.user))
    },
    logout: state => {
      state.user = null
      handleUnauth(state)
    }
  }
})

export const { login, logout, updateProfile } = userSlice.actions

// selectors
export const selectUser = state => state.user.user

export default userSlice.reducer
