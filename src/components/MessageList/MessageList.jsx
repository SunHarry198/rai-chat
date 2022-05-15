import { getDatabase, onValue, ref } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
// import './messageList.style.scss'

function MessageList() {
  const user = useSelector(state => state.auth.user)
  const messageData = useSelector(state => state.message?.message)
  const friend = useSelector(state => state.friend?.friend)
  const [userFriend, setUserFriend] = useState([])
  const [message, setMessage] = useState([])
  useEffect(() => {
    let data = []
    onValue(ref(getDatabase(), '/users'), snapshot => {
      if (snapshot.val() && friend?.list) {
        snapshot.forEach(snap => {
          if (
            friend?.list?.findIndex(item => item.value.userId === snap.key) !==
              -1 &&
            snap.key !== user?.uid &&
            friend?.list?.findIndex(item => item.value.confirm === 'friend') !==
              -1
          ) {
            let index = friend?.list?.findIndex(
              item => item.value.userId === snap.key
            )
            let messageKey = friend?.list?.[index]?.value.messageKey
            if (friend?.list?.[index]?.value.confirm === 'friend') {
              data = [
                ...data,
                {
                  userId: snap.key,
                  messageKey: messageKey,
                  name: snap.val().name,
                  image: snap.val().image,
                  age: snap.val().age
                }
              ]
            }
          }
        })
      }
      setUserFriend([...data])
    })
    let dataMessage = []

    // KIỂM TRA PHẦN NÀY

    onValue(ref(getDatabase(), '/message'), snapshot => {
      if (snapshot.val()) {
        snapshot.forEach(snap => {
          if (data.findIndex(item => item.messageKey === snap.key) !== -1) {
            if (snap.val()) {
              let array = []
              Object.keys(snap.val().chat).forEach(key => {
                array = [...array, { id: key, value: snap.val().chat[key] }]
              })

              let data = [...array].sort(
                (a, b) => a.value.number - b.value.number
              )
              const lengtNewChat = [...data].filter(function (item) {
                return item.value.status === 'send'
              })

              dataMessage = [
                ...dataMessage,
                {
                  chat: data,
                  chatUser: data.at(-1).value?.chatUserId,
                  numberNewMessage: lengtNewChat.length,
                  lastMessage: data.at(-1).value?.text,
                  key: snap.key
                }
              ]
            }
          }
        })

        setMessage(dataMessage)
      }
    })
  }, [friend, user, messageData])

  return (
    <div className="left-side">
      <div className="side-wrapper">
        <div className="side-title">My Friends</div>
        <div className="side-menu">
          <ul>
            {userFriend &&
              userFriend?.map((item, index) => (
                <li key={index}>
                  <Link to={`/message?id=${item.userId}`}>
                    <img src={item?.image} alt="friend" />
                    <article>
                      <div className="side-menu_title">{item?.name}</div>
                      <span>
                        {message.findIndex(
                          mess => mess.key === item.messageKey
                        ) !== -1
                          ? message[
                              message.findIndex(
                                mess => mess.key === item.messageKey
                              )
                            ]?.lastMessage
                          : ''}
                      </span>
                    </article>

                    {message.findIndex(mess => mess.key === item.messageKey) !==
                    -1 ? (
                      message[
                        message.findIndex(mess => mess.key === item.messageKey)
                      ]?.chatUser !== user?.uid &&
                      message[
                        message.findIndex(mess => mess.key === item.messageKey)
                      ]?.numberNewMessage > 0 ? (
                        <span className="notification-number messagse-number">
                          {
                            message[
                              message.findIndex(
                                mess => mess.key === item.messageKey
                              )
                            ]?.numberNewMessage
                          }
                        </span>
                      ) : (
                        <span></span>
                      )
                    ) : (
                      <span></span>
                    )}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MessageList
