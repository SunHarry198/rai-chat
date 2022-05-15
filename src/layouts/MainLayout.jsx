import React from 'react'
import PropTypes from 'prop-types'
import Header from 'src/components/Header/Header'

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

MainLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ])
}
