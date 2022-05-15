import React, { useEffect, useRef, useState } from 'react'
import './header.style.scss'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from 'src/pages/auth/auth.slice'
import { auth } from 'src/firebase/config'
import { toast } from 'react-toastify'
import { path } from 'src/constants/path'
import Notification from '../Notification/Notification'

function Header() {
  const [search, setSearch] = useState('')
  const friend = useSelector(state => state.friend?.friend) || null
  const [friendConfirmed, setFriendConfirmed] = useState(null)
  const navigate = useNavigate()

  const user = useSelector(state => state.auth.user)

  const searchBooking = e => {
    e.preventDefault()
    navigate(`/search?=${search}`)
  }
  const menuNav = user
    ? [
        {
          display: 'Message',
          path: `/`
        },
        {
          display: 'Friends',
          path: `/friend`
        },
        {
          display: 'Profile',
          path: `/profile`
        }
      ]
    : [
        {
          display: 'Message',
          path: `/`
        },
        {
          display: 'Friends',
          path: `/friend`
        },
        {
          display: 'Sign In',
          path: `/login`
        }
      ]

  const { pathname } = useLocation()
  const active = menuNav.findIndex(e => e.path === `/${pathname.split('/')[1]}`)
  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(logout())
    auth.signOut()
    toast.success('Đăng xuất thành công!', {
      position: 'top-center',
      autoClose: 3000
    })
    navigate(path.home)
  }

  useEffect(() => {
    let array = []
    friend?.list?.forEach(item => {
      if (
        item.value.confirm === 'confirm' &&
        item.value.notification === true
      ) {
        array = [
          ...array,
          {
            userId: item.value.userId,
            friendKey: item.value.friendKey,
            userKey: item.id
          }
        ]
      }
    })
    setFriendConfirmed(array)
  }, [friend])

  const notificationRef = useRef(null)
  const popoverRef = useRef(null)
  const menuButtonRef = useRef(null)
  const menuRef = useRef(null)
  const closeMenuBgRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        !notificationRef.current.contains(event.target) &&
        !popoverRef.current.contains(event.target)
      ) {
        popoverRef.current.classList.remove('active-notification')
        notificationRef.current.classList.remove('active-notification')
      } else if (notificationRef.current) {
        popoverRef.current.classList.add('active-notification')
        notificationRef.current.classList.add('active-notification')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [notificationRef])

  useEffect(() => {
    const handleClickMobileButton = event => {
      if (
        menuButtonRef.current &&
        menuButtonRef.current.contains(event.target)
      ) {
        menuButtonRef.current.classList.toggle('active')
        menuRef.current.classList.toggle('active-moblie')
        closeMenuBgRef.current.classList.toggle('active')
      } else if (
        closeMenuBgRef.current &&
        closeMenuBgRef.current.contains(event.target)
      ) {
        menuButtonRef.current.classList.remove('active')
        menuRef.current.classList.remove('active-moblie')
        closeMenuBgRef.current.classList.remove('active')
      }
    }

    document.querySelectorAll('.menu-btn-link').forEach(btn => {
      btn.addEventListener('click', e => {
        menuButtonRef.current.classList.remove('active')
        menuRef.current.classList.remove('active-moblie')
        closeMenuBgRef.current.classList.remove('active')
      })
    })

    document.addEventListener('click', handleClickMobileButton)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('click', handleClickMobileButton)
    }
  }, [menuButtonRef, closeMenuBgRef])

  return (
    <>
      <div className="header">
        <div className="menu-circle" />
        <div ref={menuRef} className="header-menu">
          <div>
            {menuNav.map((item, index) => (
              <Link
                key={index}
                className={`menu-link ${index === active ? 'is-active' : ''}`}
                to={item.path}
              >
                <article className="menu-btn-link">{item.display}</article>
              </Link>
            ))}
          </div>
        </div>
        <div className="nav-bar-mobile">
          <div ref={menuButtonRef} className="nav-bar-mobile-btn">
            <svg viewBox="0 0 64 48">
              <path d="M19,15 L45,15 C70,15 58,-2 49.0177126,7 L19,37"></path>
              <path d="M19,24 L45,24 C61.2371586,24 57,49 41,33 L32,24"></path>
              <path d="M45,33 L19,33 C-8,33 6,-2 22,14 L45,37"></path>
            </svg>
          </div>
        </div>
        <div className="search-bar">
          <form noValidate onSubmit={e => searchBooking(e)}>
            <input
              type="text"
              placeholder="Search"
              name="search"
              onChange={e => setSearch(e.target.value)}
            />
          </form>
        </div>
        <div className="header-profile">
          <div ref={notificationRef} className="notification">
            {friendConfirmed?.length > 0 && (
              <span className="notification-number">
                {friendConfirmed?.length}
              </span>
            )}
            <svg
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-bell"
            >
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </div>
          {user && (
            <>
              <Link to="/profile">
                <img className="profile-img" src={user.image} alt="profile" />
              </Link>
              <button onClick={() => handleLogout()} className="logout-button">
                <svg x="0px" y="0px" viewBox="0 0 96.943 96.943">
                  <g>
                    <g>
                      <path
                        d="M61.168,83.92H11.364V13.025H61.17c1.104,0,2-0.896,2-2V3.66c0-1.104-0.896-2-2-2H2c-1.104,0-2,0.896-2,2v89.623
			c0,1.104,0.896,2,2,2h59.168c1.105,0,2-0.896,2-2V85.92C63.168,84.814,62.274,83.92,61.168,83.92z"
                      />
                      <path
                        d="M96.355,47.058l-26.922-26.92c-0.75-0.751-2.078-0.75-2.828,0l-6.387,6.388c-0.781,0.781-0.781,2.047,0,2.828
			l12.16,12.162H19.737c-1.104,0-2,0.896-2,2v9.912c0,1.104,0.896,2,2,2h52.644L60.221,67.59c-0.781,0.781-0.781,2.047,0,2.828
			l6.387,6.389c0.375,0.375,0.885,0.586,1.414,0.586c0.531,0,1.039-0.211,1.414-0.586l26.922-26.92
			c0.375-0.375,0.586-0.885,0.586-1.414C96.943,47.941,96.73,47.433,96.355,47.058z"
                      />
                    </g>
                  </g>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
      <div ref={popoverRef} className="notification_popover">
        <div className="notification_popover-title">Notifications</div>
        {friendConfirmed ? (
          friendConfirmed?.map((item, index) => (
            <Notification
              key={index}
              userId={item.userId}
              friendId={user?.friendId}
              friendKey={item.friendKey}
              userKey={item.userKey}
            />
          ))
        ) : (
          <div className="loading-friend">No notification...</div>
        )}
      </div>
      <div ref={closeMenuBgRef} className="close_menu-mobile_background"></div>
    </>
  )
}

export default Header
