import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import ErrorMessage from 'src/components/Error-message/ErrorMessage'
import InputPassword from 'src/components/Input-password/InputPassword'
import { rules } from 'src/constants/rules'
import { CircularProgress } from '@material-ui/core'

import { getUser } from '../auth.slice'
import md5 from 'md5'
import '../Login/login.style.scss'
import { path } from 'src/constants/path'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

import { auth } from 'src/firebase/config'
import { child, getDatabase, push, ref, set } from 'firebase/database'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

function Register() {
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      name: '',
      age: '',
      confirmedPassword: ''
    }
  })

  const handleRegister = async data => {
    setLoading(true)
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(userAuth => {
        updateProfile(userAuth.user, {
          displayName: data.name,
          photoURL: `http://gravatar.com/avatar/${md5(
            userAuth.user.email
          )}?d=identicon`
        })
          .then(() => {
            const idFr = push(child(ref(getDatabase()), 'friends')).key
            set(ref(getDatabase(), 'friends/' + idFr), {
              userId: userAuth.user.uid
            }).then(() => {
              set(ref(getDatabase(), 'users/' + userAuth.user.uid), {
                name: userAuth.user.displayName,
                image: userAuth.user.photoURL,
                friendId: idFr,
                email: userAuth.user.email,
                age: data.age,
                isAdmin: false
              }).then(() => {
                getUser(userAuth, dispatch, 'register')
                setLoading(false)
                navigate(path.home)
              })
            })
          })
          .catch(error => {
            setLoading(false)
            toast.error('Đăng tài khoản thất bại', {
              position: 'top-center',
              autoClose: 3000
            })
          })
      })
      .catch(error => {
        setLoading(false)
        toast.error('Email đã tồn tại!', {
          position: 'top-center',
          autoClose: 3000
        })
      })
    setLoading(false)
  }
  return (
    <div className="singin">
      <form noValidate onSubmit={handleSubmit(handleRegister)}>
        <fieldset>
          <legend>Register</legend>
          <section>
            <label htmlFor="email" className="vhide">
              Email
            </label>
            <Controller
              name="email"
              control={control}
              rules={rules.email}
              render={({ field }) => (
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={field.onChange}
                  value={getValues('email')}
                />
              )}
            />
            <ErrorMessage errors={errors} name="email" />
          </section>
          <section>
            <label htmlFor="name" className="vhide">
              Name
            </label>
            <Controller
              name="name"
              control={control}
              rules={rules.name}
              render={({ field }) => (
                <input
                  type="name"
                  name="name"
                  placeholder="Name"
                  onChange={field.onChange}
                  value={getValues('name')}
                />
              )}
            />
            <ErrorMessage errors={errors} name="name" />
          </section>
          <section>
            <label htmlFor="age" className="vhide">
              Age
            </label>
            <Controller
              name="age"
              control={control}
              rules={rules.age}
              render={({ field }) => (
                <input
                  type="date"
                  name="age"
                  placeholder="Age"
                  onChange={field.onChange}
                  value={getValues('age')}
                />
              )}
            />
            <ErrorMessage errors={errors} name="age" />
          </section>

          <section>
            <label htmlFor="password" className="vhide">
              Password
            </label>
            <Controller
              name="password"
              control={control}
              rules={rules.password}
              render={({ field }) => (
                <InputPassword
                  placeholder="Password"
                  name="password"
                  onChange={field.onChange}
                  value={getValues('password')}
                />
              )}
            />
            <ErrorMessage errors={errors} name="password" />
          </section>
          <section>
            <label htmlFor="confirmedPassword" className="vhide">
              Password
            </label>
            <Controller
              name="confirmedPassword"
              control={control}
              rules={{
                ...rules.confirmedPassword,
                validate: {
                  samePassword: v =>
                    v === getValues('password') || 'Mật khẩu không khớp'
                }
              }}
              render={({ field }) => (
                <InputPassword
                  placeholder="Nhập lại mật khẩu"
                  name="confirmedPassword"
                  onChange={field.onChange}
                  value={getValues('confirmedPassword')}
                />
              )}
            />
            <ErrorMessage errors={errors} name="confirmedPassword" />
          </section>

          <article className="check-register">
            <label htmlFor="checked">
              <Controller
                name="checked"
                control={control}
                rules={rules.checked}
                render={({ field }) => (
                  <input
                    id="checked"
                    type="checkbox"
                    name="checked"
                    onChange={field.onChange}
                    value={getValues('checked')}
                  />
                )}
              />
              <span>Remember all the things</span>
              <ErrorMessage errors={errors} name="checked" />
            </label>
          </article>

          {loading ? (
            <button className="loadding-button signin" disabled>
              <CircularProgress
                color="inherit"
                style={{ width: 15, height: 15 }}
              />
            </button>
          ) : (
            <button className="signin" type="submit">
              Submit
            </button>
          )}
          <div className="support-signin">
            Do you already have an account? <Link to="/login">Login</Link>
          </div>
        </fieldset>
      </form>
    </div>
  )
}

export default Register
