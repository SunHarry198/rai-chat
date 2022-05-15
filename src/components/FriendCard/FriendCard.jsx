import {
  child,
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  update,
  set
} from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getFriendData } from 'src/pages/Friend/friend.slice'

const FriendCard = ({
  userId,
  my,
  friendId,
  uid,
  confirm,
  friendKey,
  userKey
}) => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    onValue(ref(getDatabase(), '/users/' + userId), snapshot => {
      setUser({
        image: snapshot.val().image,
        name: snapshot.val().name,
        idFr: snapshot.val().friendId,
        age: snapshot.val().age
      })
    })
  }, [userId])

  const handleAddfriend = async userId => {
    const myKey = push(
      child(ref(getDatabase()), 'friends/' + friendId + '/friend')
    ).key
    const friendKey = push(
      child(ref(getDatabase()), 'friends/' + user?.idFr + '/friend')
    ).key
    set(ref(getDatabase(), 'friends/' + friendId + '/friend/' + myKey), {
      userId,
      confirm: 'send',
      friendKey: friendKey
    })
      .then(() => {
        set(
          ref(getDatabase(), 'friends/' + user?.idFr + '/friend/' + friendKey),
          {
            userId: uid,
            confirm: 'confirm',
            friendKey: myKey,
            notification: true
          }
        ).then(() => {
          user && getFriendData(dispatch, friendId)
          toast.success('Đã gửi lời mời kết bạn!', {
            position: 'top-center',
            autoClose: 3000
          })
        })
      })
      .catch(err => {
        // setLoading(false)
        toast.error('Thêm bạn thất bại!', {
          position: 'top-center',
          autoClose: 3000
        })
      })
  }

  const handleCancelFriend = (friendKey, userKey) => {
    if (window.confirm('Bạn có muốn xóa hủy kết bạn?')) {
      remove(ref(getDatabase(), 'friends/' + friendId + '/friend/' + userKey))
        .then(() => {
          remove(
            ref(getDatabase(), 'friends/' + user?.idFr + '/friend/' + friendKey)
          )
            .then(() => {
              user && getFriendData(dispatch, friendId)
              toast.success('Hủy kết bạn thành công!', {
                position: 'top-center',
                autoClose: 3000
              })
            })
            .catch(err =>
              toast.error('Lỗi, Không thể hủy kết bạn!', {
                position: 'top-center',
                autoClose: 3000
              })
            )
        })
        .catch(err =>
          toast.error('Lỗi, Không thể hủy kết bạn!', {
            position: 'top-center',
            autoClose: 3000
          })
        )
    }
  }

  const handleConfirmedFriend = (friendKey, userKey) => {
    const messageKey = push(child(ref(getDatabase()), 'message')).key
    update(ref(getDatabase(), 'friends/' + friendId + '/friend/' + userKey), {
      confirm: 'friend',
      messageKey: messageKey
    })
      .then(() => {
        update(
          ref(getDatabase(), 'friends/' + user?.idFr + '/friend/' + friendKey),
          {
            confirm: 'friend',
            messageKey: messageKey
          }
        ).then(() => {
          const chatKey = push(
            child(ref(getDatabase()), 'message/' + messageKey + '/chat')
          ).key
          set(
            ref(getDatabase(), 'message/' + messageKey + '/chat/' + chatKey),
            {
              number: 0
            }
          ).then(() => {
            user && getFriendData(dispatch, friendId)
          })
        })
      })
      .catch(err => {
        toast.error('Cập nhật hồ sơ thất bại!', {
          position: 'top-center',
          autoClose: 3000
        })
      })
  }

  return (
    <div className="friend-box">
      <div className="friend-box--header">
        {user ? (
          <>
            <img src={user.image} alt="profile" />
            <div className="friend-box--header-content">
              <div className="friend-box--header-content__title">
                {user.name}
              </div>
              <div>Age: {user.age}</div>
              {my ? (
                <div className="friend-box--header-content__button">
                  <button
                    className="chat-button"
                    onClick={() => navigate('/profile')}
                  >
                    Profile
                  </button>
                </div>
              ) : (
                <>
                  {confirm === 'send' && (
                    <div className="friend-box--header-content__button">
                      <button
                        className="unfriend-button"
                        onClick={() => handleCancelFriend(friendKey, userKey)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {confirm === 'confirm' && (
                    <div className="friend-box--header-content__button">
                      <button
                        className="chat-button"
                        onClick={() =>
                          handleConfirmedFriend(friendKey, userKey)
                        }
                      >
                        Confirm
                      </button>
                      <button
                        className="unfriend-button"
                        onClick={() => handleCancelFriend(friendKey, userKey)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {confirm === 'friend' && (
                    <div className="friend-box--header-content__button">
                      <button
                        onClick={() => navigate(`/message?id=${userId}`)}
                        className="chat-button"
                      >
                        Chat
                      </button>
                      <button
                        className="unfriend-button"
                        onClick={() => handleCancelFriend(friendKey, userKey)}
                      >
                        Unfriend
                      </button>
                    </div>
                  )}
                  {confirm === 'add' && (
                    <div className="friend-box--header-content__button">
                      <button
                        onClick={() => handleAddfriend(userId)}
                        className="chat-button"
                      >
                        Add Friend
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  )
}

export default FriendCard
