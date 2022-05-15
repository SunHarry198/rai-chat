import React from 'react'
import PropsTypes from 'prop-types'

export default function ErrorMessage({ errors, name, err }) {
  const error = errors && errors[name]
  return errors ? (
    <h6 className="error-input-form">{error && error.message}</h6>
  ) : (
    err && <h6 className="error-input-form">{err && err}</h6>
  )
}

ErrorMessage.propTypes = {
  errors: PropsTypes.object,
  err: PropsTypes.string,
  name: PropsTypes.string
}
