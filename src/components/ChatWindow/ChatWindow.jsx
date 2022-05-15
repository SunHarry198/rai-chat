import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { getMessageData } from 'src/pages/Home/home.slice'
import { ObjectToArray } from 'src/utils/helper'
import { child, getDatabase, push, ref, set } from 'firebase/database'
import {
  getDownloadURL,
  ref as refStorage,
  uploadBytesResumable
} from 'firebase/storage'
import { storage } from 'src/firebase/config'
import { toast } from 'react-toastify'

function ChatWindow({ messageId, userId, friendChat }) {
  const [chat, setChat] = useState('')
  const [imgFile, setImgFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const location = useLocation()
  const pathName = location.search.split('?id=')[1]
  const message = useSelector(state => state?.message?.message)
  const [dataMessage, setDataMessage] = useState(null)
  const dispatch = useDispatch()

  const fileRef = useRef(null)

  const handleChange = e => {
    const val = e.target.value
    let text = val
    if (text.replace(/<3\s/g, '❤️')) {
      text = text.replace(/<3\s/g, '❤️')
    }
    if (text.replace(/:l\s/g, '😍')) {
      text = text.replace(/:l\s/g, '😍')
    }
    if (text.replace(/:z\s/g, '😴')) {
      text = text.replace(/:z\s/g, '😴')
    }
    if (text.replace(/:k\s/g, '😭')) {
      text = text.replace(/:k\s/g, '😭')
    }
    if (text.replace(/:h\s/g, '😂')) {
      text = text.replace(/:h\s/g, '😂')
    }
    if (text.replace(/-_-\s/g, '😑')) {
      text = text.replace(/-_-\s/g, '😑')
    }
    if (text.replace(/:3\s/g, '🥴')) {
      text = text.replace(/:3\s/g, '🥴')
    }
    if (text.replace(/:d\s/g, '😁')) {
      text = text.replace(/:d\s/g, '😁')
    }
    if (text.replace(/:e\s/g, '😃')) {
      text = text.replace(/:e\s/g, '😃')
    }
    if (text.replace(/><\s/g, '😡')) {
      text = text.replace(/><\s/g, '😡')
    }
    setChat(text)
  }

  const onImageChange = e => {
    const [file] = e.target.files
    setFile(e.target.files[0])
    setImgFile(URL.createObjectURL(file))
  }

  const remoteImageFile = () => {
    setFile(null)
    setImgFile(null)
    fileRef.current.value = ''
  }

  useEffect(() => {
    if (message) {
      if ([...message]?.findIndex(item => item.id === messageId) !== -1) {
        let index = [...message]?.findIndex(item => item.id === messageId)
        setDataMessage(ObjectToArray(message[index]?.chat))
      }
    }
  }, [message, messageId, file, imgFile])

  const sendMessage = async e => {
    e.preventDefault()
    if (file) {
      if (pathName) {
        const fileName = new Date().getTime() + file.name
        const storageRef = refStorage(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, file)
        setLoading(true)
        uploadTask.on(
          'state_changed',
          snapshot => {},
          error => {},
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
              const chatKey = push(
                child(ref(getDatabase()), 'message/' + messageId + '/chat')
              ).key
              let number = 0
              if (dataMessage) {
                number = dataMessage.at(-1).chat.number
                  ? dataMessage.at(-1).chat.number + 1
                  : 1
              }
              if (chat !== '') {
                set(
                  ref(
                    getDatabase(),
                    'message/' + messageId + '/chat/' + chatKey
                  ),
                  {
                    chatUserId: userId,
                    status: 'send',
                    text: chat,
                    image: downloadURL,
                    number: number,
                    time: '12-12'
                  }
                )
                  .then(() => {
                    getMessageData(dispatch, messageId, pathName)
                    setChat('')
                    setFile(null)
                    setImgFile(null)
                    setLoading(false)
                  })
                  .catch(err => {
                    setLoading(false)
                    toast.error('Gửi file thất bại!', {
                      position: 'top-center',
                      autoClose: 3000
                    })
                  })
              } else {
                set(
                  ref(
                    getDatabase(),
                    'message/' + messageId + '/chat/' + chatKey
                  ),
                  {
                    chatUserId: userId,
                    status: 'send',
                    image: downloadURL,
                    number: number,
                    time: '12-12'
                  }
                )
                  .then(() => {
                    getMessageData(dispatch, messageId, pathName)
                    setLoading(false)
                    setFile(null)
                    setImgFile(null)
                  })
                  .catch(err => {
                    setLoading(false)
                    toast.error('Gửi file thất bại!', {
                      position: 'top-center',
                      autoClose: 3000
                    })
                  })
              }
              // scrollToMyRef()
            })
          }
        )
      } else {
        toast.error('Chọn bạn chat!', {
          position: 'top-center',
          autoClose: 3000
        })
      }
    } else {
      if (chat !== '') {
        if (pathName) {
          const chatKey = push(
            child(ref(getDatabase()), 'message/' + messageId + '/chat')
          ).key
          let number = 0
          if (dataMessage) {
            number = dataMessage.at(-1).chat.number
              ? dataMessage.at(-1).chat.number + 1
              : 1
          }
          set(ref(getDatabase(), 'message/' + messageId + '/chat/' + chatKey), {
            chatUserId: userId,
            status: 'send',
            text: chat,
            number: number,
            time: '12-12'
          }).then(() => {
            getMessageData(dispatch, messageId, pathName)
            setChat('')
          })
        } else {
          toast.error('Chọn bạn chat!', {
            position: 'top-center',
            autoClose: 3000
          })
        }
        // scrollToMyRef()
      }
    }
  }
  return (
    <div className="chat-window" onSubmit={e => sendMessage(e)}>
      {imgFile && (
        <div className="chat-window__image-active">
          <div>
            <img src={imgFile} alt="file_image" />
            <button
              className="chat-window__image-active_remote"
              onClick={() => remoteImageFile()}
            >
              X
            </button>
          </div>
        </div>
      )}
      {pathName ? (
        <form noValidate>
          <div>
            <label htmlFor="file">
              <div className={`chat-window_file ${file ? 'active' : ''}`}>
                <input
                  ref={fileRef}
                  type="file"
                  name="file"
                  id="file"
                  accept="image/*"
                  onChange={onImageChange}
                />
                <svg x="0px" y="0px" viewBox="0 0 290.99 290.99">
                  <g>
                    <path
                      d="M280.112,30.82H10.878C4.868,30.82,0,35.694,0,41.699v207.593c0,6.005,4.868,10.878,10.878,10.878
h269.234c6.005,0,10.878-4.873,10.878-10.878V41.699C290.99,35.694,286.117,30.82,280.112,30.82z M266.52,219.828
c0,6.005-4.873,10.878-10.878,10.878H58.018c-6.01,0-10.878-4.873-10.878-10.878V71.162c0-6.005,4.868-10.878,10.878-10.878
h197.623c6.005,0,10.878,4.873,10.878,10.878V219.828z"
                    />
                    <path
                      d="M73.427,216.434h164.08c6.005,0,9.616-4.699,8.044-10.508l-26.069-96.837
c-1.566-5.803-4.15-9.388-5.776-8.012s-4.569,7.082-6.57,12.749l-21.299,60.183c-2.002,5.668-6.451,6.288-9.932,1.392
l-18.667-26.254c-3.486-4.895-9.23-4.971-12.842-0.169l-20.01,26.597c-3.612,4.803-10.155,5.434-14.62,1.414l-6.494-5.852
c-4.465-4.019-10.655-3.144-13.821,1.958l-21.163,34.098C65.122,212.295,67.417,216.434,73.427,216.434z"
                    />
                    <circle cx="114.215" cy="117.622" r="15.409" />
                  </g>
                </svg>
              </div>
            </label>
          </div>
          <label htmlFor="chat">
            <input
              onChange={e => handleChange(e)}
              type="text"
              name="chat"
              value={chat}
              id="chat"
            />
          </label>

          {loading ? (
            <button className="load_send-file" disabled>
              Load...
            </button>
          ) : (
            <button type="submit">Send</button>
          )}
        </form>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default ChatWindow
