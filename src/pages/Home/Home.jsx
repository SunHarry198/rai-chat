import { getDatabase, onValue, ref } from 'firebase/database'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import ChatWindow from 'src/components/ChatWindow/ChatWindow'
import MessageBox from 'src/components/MessageBox.jsx/MessageBox'
import MessageList from 'src/components/MessageList/MessageList'
import { getMessageData } from './home.slice'
import './home.style.scss'
function Home() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)

  const location = useLocation()
  const pathName = location.search.split('?id=')[1]
  const [friendChat, setFriendChat] = useState(null)
  // const friend = useSelector(state => state.friend?.friend)
  const [messageId, setMessageId] = useState(null)

  const load = useCallback(() => {
    onValue(ref(getDatabase(), '/users/' + pathName), snapshot => {
      if (snapshot.val()) {
        setFriendChat({
          name: snapshot.val().name,
          image: snapshot.val().image,
          friendId: snapshot.val().friendId
        })
        onValue(
          ref(getDatabase(), 'friends/' + snapshot.val().friendId),

          friendSnap => {
            let array = {}
            if (friendSnap.val().friend) {
              Object.keys(friendSnap.val().friend).forEach(key => {
                if (friendSnap.val().friend[key].userId === user?.uid) {
                  array = { value: friendSnap.val().friend[key] }
                }
              })
            }
            // console.log(friendSnap.val().friend)
            setMessageId(
              array?.value?.messageKey ? array?.value?.messageKey : ''
            )
          }
        )
      }
    })
    getMessageData(dispatch)
  }, [pathName, dispatch, user])

  useEffect(() => {
    load()
  }, [load])

  const mobileRef = useRef(null)
  const buttonMobileRef = useRef(null)
  useEffect(() => {
    function handleClickOutside(event) {
      if (!buttonMobileRef.current.contains(event.target)) {
        mobileRef.current.classList.remove('active-list')
      } else if (buttonMobileRef.current) {
        mobileRef.current.classList.toggle('active-list')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [buttonMobileRef])

  return user ? (
    <div ref={mobileRef} className="wrapper">
      <MessageList />
      <div className="main-container">
        <div className={`friend_header ${friendChat ? '' : 'hidden'}`}>
          <div ref={buttonMobileRef} className="btn-message-list-mobile">
            <svg x="0px" y="0px" viewBox="0 0 49.656 49.656">
              <path
                d="M14.535,0l-4.242,4.242l20.585,20.586L10.293,45.414l4.242,4.242l24.829-24.828L14.535,0z M13.121,45.414l20.585-20.586
	L13.121,4.242l1.414-1.414l22,22l-22,22L13.121,45.414z"
              />
            </svg>
            <div>Menu chat</div>
          </div>
          <div className="friend_header--title">
            <div className="friend_header--title_image">
              {friendChat && (
                <img src={friendChat && friendChat.image} alt="friend" />
              )}
            </div>
            <div className="friend_header--title_name">
              {friendChat && friendChat.name}
            </div>
          </div>
        </div>
        <MessageBox
          userId={user?.uid}
          friendChat={friendChat}
          messageId={messageId}
        />
        <ChatWindow
          messageId={messageId}
          userId={user?.uid}
          friendChat={friendChat}
        />
      </div>
    </div>
  ) : (
    <div className="no-page-user">
      <div className="no-page-user_title">Welcome to RaiChat</div>
      <div className="no-page-user_content">
        <Link to={'/login'}>Sign in and chat</Link>
      </div>
    </div>
  )
}

export default Home
