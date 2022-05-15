import {
  child,
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
  update
} from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { getFriendData } from 'src/pages/Friend/friend.slice'
import './notification.style.scss'

const Notification = ({ userId, friendKey, userKey, friendId }) => {
  const [userFriend, setUserFriend] = useState(null)
  const dispatch = useDispatch()
  useEffect(() => {
    onValue(ref(getDatabase(), '/users/' + userId), snapshot => {
      setUserFriend({
        image: snapshot.val().image,
        name: snapshot.val().name,
        friendId: snapshot.val().friendId,
        age: snapshot.val().age
      })
    })
  }, [userId])

  const handleCancelFriend = (friendKey, userKey) => {
    if (window.confirm('Bạn có muốn xóa hủy kết bạn?')) {
      remove(ref(getDatabase(), 'friends/' + friendId + '/friend/' + userKey))
        .then(() => {
          remove(
            ref(
              getDatabase(),
              'friends/' + userFriend?.friendId + '/friend/' + friendKey
            )
          )
            .then(() => {
              userFriend && getFriendData(dispatch, friendId)
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
          ref(
            getDatabase(),
            'friends/' + userFriend?.friendId + '/friend/' + friendKey
          ),
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
            userFriend && getFriendData(dispatch, friendId)
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

  return userFriend ? (
    <div className="notification--card">
      <div className="notification--card_image">
        <img src={userFriend?.image} alt="" />
      </div>
      <div className="notification--card_content">
        <div className="notification--card_title">{userFriend?.name}</div>
        <div className="notification--card_description">
          Send you a friend request
        </div>
        <div className="notification--card_button">
          <button
            className="add-button"
            onClick={() => handleConfirmedFriend(friendKey, userKey)}
          >
            Confirm
          </button>
          <button
            className="cancel-button"
            onClick={() => handleCancelFriend(friendKey, userKey)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div></div>
  )
}

export default Notification
