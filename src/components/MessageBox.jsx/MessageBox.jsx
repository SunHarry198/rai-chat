import { getDatabase, ref, update } from 'firebase/database'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { ObjectToArray } from 'src/utils/helper'
import './messageBox.style.scss'

import { saveAs } from 'file-saver'

function MessageBox({ friendChat, userId, messageId }) {
  const chatContainer = useRef(null)

  const message = useSelector(state => state.message?.message)
  const [dataMessage, setDataMessage] = useState(null)
  const [dataMessageId, setDataMessageId] = useState('')

  const location = useLocation()
  const pathName = location.search.split('?id=')[1]

  const scrollToMyRef = () => {
    if (chatContainer?.current) {
      const scroll =
        chatContainer.current.scrollHeight - chatContainer.current.clientHeight
      chatContainer.current.scrollTo(0, scroll)
    }
  }

  useEffect(() => {
    if (message) {
      if ([...message]?.findIndex(item => item.id === messageId) !== -1) {
        let index = [...message]?.findIndex(item => item.id === messageId)

        setDataMessageId(message[index]?.id)
        setDataMessage(ObjectToArray(message[index]?.chat))
      } else if (messageId) {
        setDataMessageId(messageId)
        setDataMessage(null)
      }
    }
  }, [message, messageId])

  useEffect(() => {
    if (dataMessage) {
      scrollToMyRef()
      if (dataMessage?.at(-1).chat?.chatUserId === pathName) {
        let sendMessageId = [...dataMessage].filter(
          item => item.chat.status === 'send'
        )
        sendMessageId.forEach(mes => {
          if (mes.chat.status === 'send' && dataMessageId === messageId) {
            update(
              ref(
                getDatabase(),
                'message/' + dataMessageId + '/chat/' + mes.id
              ),
              {
                status: 'see'
              }
            )
          }
        })
      }
      const timer = setTimeout(() => {
        scrollToMyRef()
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [dataMessage, pathName, messageId, dataMessageId])

  const downloadImage = () => {
    saveAs('image_url', 'image.jpg') // Put your image url here.
  }

  const openInNewTab = url => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  return pathName ? (
    <>
      <div ref={chatContainer} className="chat">
        <ul className="chat-thread">
          {dataMessage?.map(
            (item, index) =>
              item.chat.status &&
              (item.chat.chatUserId === userId ? (
                <li key={index}>
                  {item.chat.image ? (
                    item.chat.text ? (
                      <div className="chat-text-and-image">
                        <div>{item.chat.text}</div>
                        <section className="chat-file-image">
                          <button onClick={() => openInNewTab(item.chat.image)}>
                            <img src={item.chat.image} alt="no_load_image" />
                          </button>
                          <article>
                            <button onClick={() => downloadImage()}>
                              <svg x="0px" y="0px" viewBox="0 0 490 490">
                                <g>
                                  <g>
                                    <g>
                                      <path
                                        d="M245,0c-9.5,0-17.2,7.7-17.2,17.2v331.2L169,289.6c-6.7-6.7-17.6-6.7-24.3,0s-6.7,17.6,0,24.3l88.1,88.1
				c3.3,3.3,7.7,5,12.1,5c4.4,0,8.8-1.7,12.1-5l88.1-88.1c6.7-6.7,6.7-17.6,0-24.3c-6.7-6.7-17.6-6.7-24.3,0L262,348.4V17.1
				C262.1,7.6,254.5,0,245,0z"
                                      />
                                      <path
                                        d="M462.1,472.9v-99.7c0-9.5-7.7-17.2-17.2-17.2s-17.2,7.7-17.2,17.2v82.6H62.2v-82.6c0-9.5-7.7-17.2-17.1-17.2
				s-17.2,7.7-17.2,17.2v99.7c0,9.5,7.7,17.1,17.2,17.1h399.8C454.4,490,462.1,482.4,462.1,472.9z"
                                      />
                                    </g>
                                  </g>
                                </g>
                              </svg>
                            </button>
                          </article>
                        </section>
                      </div>
                    ) : (
                      <section className="chat-file-image">
                        <button onClick={() => openInNewTab(item.chat.image)}>
                          <img src={item.chat.image} alt="no_load_image" />
                        </button>
                        <article>
                          <button onClick={() => downloadImage()}>
                            <svg x="0px" y="0px" viewBox="0 0 490 490">
                              <g>
                                <g>
                                  <g>
                                    <path
                                      d="M245,0c-9.5,0-17.2,7.7-17.2,17.2v331.2L169,289.6c-6.7-6.7-17.6-6.7-24.3,0s-6.7,17.6,0,24.3l88.1,88.1
    c3.3,3.3,7.7,5,12.1,5c4.4,0,8.8-1.7,12.1-5l88.1-88.1c6.7-6.7,6.7-17.6,0-24.3c-6.7-6.7-17.6-6.7-24.3,0L262,348.4V17.1
    C262.1,7.6,254.5,0,245,0z"
                                    />
                                    <path
                                      d="M462.1,472.9v-99.7c0-9.5-7.7-17.2-17.2-17.2s-17.2,7.7-17.2,17.2v82.6H62.2v-82.6c0-9.5-7.7-17.2-17.1-17.2
    s-17.2,7.7-17.2,17.2v99.7c0,9.5,7.7,17.1,17.2,17.1h399.8C454.4,490,462.1,482.4,462.1,472.9z"
                                    />
                                  </g>
                                </g>
                              </g>
                            </svg>
                          </button>
                        </article>
                      </section>
                    )
                  ) : (
                    <div>
                      {item.chat.text}
                      {/* <div className="icon">😍</div> */}
                    </div>
                  )}
                </li>
              ) : (
                <li key={index} className="chat-thread__friend">
                  <img
                    src={friendChat && friendChat.image}
                    className="chat-image-profile"
                    alt="friend"
                  />
                  {item.chat.image ? (
                    item.chat.text ? (
                      <div className="chat-text-and-image">
                        <div>{item.chat.text}</div>
                        <section className="chat-file-image">
                          <button onClick={() => openInNewTab(item.chat.image)}>
                            <img src={item.chat.image} alt="no_load_image" />
                          </button>
                          <article>
                            <button onClick={() => downloadImage()}>
                              <svg x="0px" y="0px" viewBox="0 0 490 490">
                                <g>
                                  <g>
                                    <g>
                                      <path
                                        d="M245,0c-9.5,0-17.2,7.7-17.2,17.2v331.2L169,289.6c-6.7-6.7-17.6-6.7-24.3,0s-6.7,17.6,0,24.3l88.1,88.1
				c3.3,3.3,7.7,5,12.1,5c4.4,0,8.8-1.7,12.1-5l88.1-88.1c6.7-6.7,6.7-17.6,0-24.3c-6.7-6.7-17.6-6.7-24.3,0L262,348.4V17.1
				C262.1,7.6,254.5,0,245,0z"
                                      />
                                      <path
                                        d="M462.1,472.9v-99.7c0-9.5-7.7-17.2-17.2-17.2s-17.2,7.7-17.2,17.2v82.6H62.2v-82.6c0-9.5-7.7-17.2-17.1-17.2
				s-17.2,7.7-17.2,17.2v99.7c0,9.5,7.7,17.1,17.2,17.1h399.8C454.4,490,462.1,482.4,462.1,472.9z"
                                      />
                                    </g>
                                  </g>
                                </g>
                              </svg>
                            </button>
                          </article>
                        </section>
                      </div>
                    ) : (
                      <section className="chat-file-image">
                        <button onClick={() => openInNewTab(item.chat.image)}>
                          <img src={item.chat.image} alt="no_load_image" />
                        </button>
                        <article className="left-btn">
                          <button onClick={() => downloadImage()}>
                            <svg x="0px" y="0px" viewBox="0 0 490 490">
                              <g>
                                <g>
                                  <g>
                                    <path
                                      d="M245,0c-9.5,0-17.2,7.7-17.2,17.2v331.2L169,289.6c-6.7-6.7-17.6-6.7-24.3,0s-6.7,17.6,0,24.3l88.1,88.1
    c3.3,3.3,7.7,5,12.1,5c4.4,0,8.8-1.7,12.1-5l88.1-88.1c6.7-6.7,6.7-17.6,0-24.3c-6.7-6.7-17.6-6.7-24.3,0L262,348.4V17.1
    C262.1,7.6,254.5,0,245,0z"
                                    />
                                    <path
                                      d="M462.1,472.9v-99.7c0-9.5-7.7-17.2-17.2-17.2s-17.2,7.7-17.2,17.2v82.6H62.2v-82.6c0-9.5-7.7-17.2-17.1-17.2
    s-17.2,7.7-17.2,17.2v99.7c0,9.5,7.7,17.1,17.2,17.1h399.8C454.4,490,462.1,482.4,462.1,472.9z"
                                    />
                                  </g>
                                </g>
                              </g>
                            </svg>
                          </button>
                        </article>
                      </section>
                    )
                  ) : (
                    <div>
                      {item.chat.text}
                      {/* <div className="icon">😍</div> */}
                    </div>
                  )}
                </li>
              ))
          )}
        </ul>
      </div>
    </>
  ) : (
    <div className="no-chat-message main-container">
      <div className="no-chat-message_title">Welcom To RaiChat</div>
      <div className="no-chat-message_content">Choose friend and chat</div>
    </div>
  )
}

export default MessageBox
