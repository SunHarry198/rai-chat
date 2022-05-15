import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import FriendCard from 'src/components/FriendCard/FriendCard'
import { getFriendData } from './friend.slice'
import './friend.style.scss'
function Friend() {
  const user = useSelector(state => state.auth.user)
  const friend = useSelector(state => state.friend?.friend) || null
  const loaction = useLocation()
  const pathName = loaction.pathname.split('/title=')[1]
  const dispatch = useDispatch()

  useEffect(() => {
    user && getFriendData(dispatch, user?.friendId)
  }, [user, dispatch, pathName])

  return user ? (
    <div className="friend-container">
      <div className="friend-nav">
        <ul>
          <li>
            <Link to="/friend/title=friend">
              <article
                className={
                  pathName === 'friend' || pathName === undefined
                    ? 'active-friend-nav'
                    : ''
                }
              >
                Friends
              </article>
            </Link>
          </li>
          <li>
            <Link to="/friend/title=confirm">
              <article
                className={pathName === 'confirm' ? 'active-friend-nav' : ''}
              >
                Confirmed
              </article>
            </Link>
          </li>
          <li>
            <Link to="/friend/title=send">
              <article
                className={pathName === 'send' ? 'active-friend-nav' : ''}
              >
                Sent
              </article>
            </Link>
          </li>
        </ul>
      </div>
      <div className="friend">
        {friend?.list ? (
          friend?.list?.map((item, index) =>
            pathName === 'friend' || pathName === undefined
              ? item.value.confirm === 'friend' && (
                  <FriendCard
                    key={index}
                    userId={item.value.userId}
                    friendId={user?.friendId}
                    confirm={item.value.confirm}
                    userKey={item.id}
                    friendKey={item.value.friendKey}
                  />
                )
              : pathName === 'confirm'
              ? item.value.confirm === 'confirm' && (
                  <FriendCard
                    key={index}
                    userId={item.value.userId}
                    friendId={user?.friendId}
                    confirm={item.value.confirm}
                    userKey={item.id}
                    friendKey={item.value.friendKey}
                  />
                )
              : pathName === 'send' &&
                item.value.confirm === 'send' && (
                  <FriendCard
                    key={index}
                    userId={item.value.userId}
                    friendId={user?.friendId}
                    confirm={item.value.confirm}
                    userKey={item.id}
                    friendKey={item.value.friendKey}
                  />
                )
          )
        ) : (
          <div className="loading-friend">Loading...</div>
        )}
      </div>
    </div>
  ) : (
    <div className="no-page-user">
      <div className="no-page-user_title">Welcom to RaiChat</div>
      <div className="no-page-user_content">
        <Link to={'/login'}>Sign in and chat</Link>
      </div>
    </div>
  )
}

export default Friend
