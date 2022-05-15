import { CircularProgress } from '@material-ui/core'
import { getDatabase, update, ref as databaseRef } from 'firebase/database'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { storage } from 'src/firebase/config'
import { getAuthUpdate } from '../auth.slice'
import './profile.style.scss'
function Profile() {
  const user = useSelector(state => state.auth?.user)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(user?.name)
  const [age, setAge] = useState(user?.age)
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('Select Avatar')
  const dispatch = useDispatch()
  const handleUpdateProfile = e => {
    e.preventDefault()
    if (name === '') {
      setName(user.name)
    }
    if (age === '') {
      setAge(user.age)
    }
    setLoading(true)
    if (file) {
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        'state_changed',
        snapshot => {},
        error => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
            update(databaseRef(getDatabase(), 'users/' + user.uid), {
              image: downloadURL,
              name: name,
              age: age
            })
              .then(() => {
                getAuthUpdate(user, dispatch)
                setFile(null)
                setFileName('Select Avatar')
                setLoading(false)
              })
              .catch(err => {
                setLoading(false)
                toast.error('Cập nhật hồ sơ thất bại!', {
                  position: 'top-center',
                  autoClose: 3000
                })
              })
          })
        }
      )
    } else if (name || age) {
      update(databaseRef(getDatabase(), 'users/' + user.uid), {
        name: name,
        age: age
      })
        .then(() => {
          setLoading(false)
          getAuthUpdate(user, dispatch)
        })
        .catch(err => {
          setLoading(false)
          toast.error('Cập nhật hồ sơ thất bại!', {
            position: 'top-center',
            autoClose: 3000
          })
        })
    }
  }
  const handerChange = event => {
    setFile(event.target.files[0])
    setFileName(event.target.files[0].name)
  }
  return user ? (
    <div className="profile">
      <div className="profile__header">
        <img src={user.image} alt="profile" />
        <div>
          <div className="profile__header--title">{user.name}</div>
          <div className="profile__header--age">Age: {user.age}</div>
          <div className="profile__header--email">Email: {user.email}</div>
          <div className="profile__header--friend">Friend: 0</div>
        </div>
      </div>
      <div className="profile__form">
        <div className="profile__form--update--title">Update Profile</div>
        <form>
          <article className="profile__form--file">
            <label htmlFor="file">
              <span className="file_title">{fileName}</span>
              <input
                onChange={handerChange}
                type="file"
                id="file"
                name="file"
              />
            </label>
          </article>
          <article>
            <label htmlFor="name">
              <span>UserName</span>
              <br />
              <input
                onChange={e => setName(e.target.value)}
                type="text"
                name="name"
                id="name"
                defaultValue={user.name}
                placeholder={user.name}
              />
            </label>
          </article>
          <article>
            <label htmlFor="age">
              <span>Age</span>
              <br />
              <input
                onChange={e => setAge(e.target.value)}
                type="date"
                name="age"
                id="age"
                defaultValue={user.age}
                placeholder={user.age}
              />
            </label>
          </article>
          {loading ? (
            <button className="loadding-button" disabled>
              <CircularProgress
                color="inherit"
                style={{ width: 15, height: 15 }}
              />
            </button>
          ) : (
            <button type="button" onClick={e => handleUpdateProfile(e)}>
              update
            </button>
          )}
        </form>
      </div>
    </div>
  ) : (
    <div>Loading</div>
  )
}

export default Profile
