import React, { useEffect, useRef } from 'react'
import 'normalize.css'
import 'src/assets/styles/global.scss'
import Routes from './Routes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'
import { getFriendData } from './pages/Friend/friend.slice'

export default function App() {
  const appRef = useRef(null)
  const handleDarkLight = () => {
    appRef.current.classList.toggle('light-mode')
  }

  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()

  useEffect(() => {
    user && getFriendData(dispatch, user?.friendId)
  }, [user, dispatch])

  return (
    <div ref={appRef} className="App ">
      <Routes />
      <ToastContainer />
      <div className="dark-light" onClick={() => handleDarkLight()}>
        <svg
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      </div>
    </div>
  )
}
