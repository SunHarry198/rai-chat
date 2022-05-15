import { CircularProgress } from '@material-ui/core'
import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ErrorMessage from 'src/components/Error-message/ErrorMessage'
import InputPassword from 'src/components/Input-password/InputPassword'
import { path } from 'src/constants/path'
import { rules } from 'src/constants/rules'
import { auth } from 'src/firebase/config'
import { getUser } from '../auth.slice'
import './login.style.scss'
function Login() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const handleSignIn = async data => {
    setLoading(true)
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(userAuth => {
        getUser(userAuth, dispatch, 'login')
        navigate(path.home)
      })
      .catch(err => {
        setLoading(false)
        toast.error('Email hoặc mật khẩu không chính xác!', {
          position: 'top-center',
          autoClose: 3000
        })
      })
  }

  return (
    <div className="singin">
      <form noValidate onSubmit={handleSubmit(handleSignIn)}>
        <fieldset>
          <legend>Login</legend>
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
          <input
            type="checkbox"
            name="remember"
            id="remember"
            className="vhide"
          />
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
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </fieldset>
      </form>
    </div>
  )
}

export default Login
