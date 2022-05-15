import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Login from './pages/auth/Login/Login'
import Profile from './pages/auth/Profile/Profile'
import Register from './pages/auth/Register/Register'
import Friend from './pages/Friend/Friend'
import Home from './pages/Home/Home'
import Search from './pages/Search/Search'

export default function RoutesComponent() {
  return (
    <Routes>
      <Route
        path="/"
        exact
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      ></Route>
      <Route
        path="/message"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      ></Route>
      <Route
        path="/login"
        element={
          <MainLayout>
            <Login />
          </MainLayout>
        }
      ></Route>
      <Route
        path="/register"
        element={
          <MainLayout>
            <Register />
          </MainLayout>
        }
      ></Route>
      <Route
        path="/friend"
        element={
          <MainLayout>
            <Friend />
          </MainLayout>
        }
      ></Route>
      <Route
        path="/friend/:title"
        element={
          <MainLayout>
            <Friend />
          </MainLayout>
        }
      ></Route>
      <Route
        path="/profile"
        exact
        element={
          <MainLayout>
            <Profile />
          </MainLayout>
        }
      ></Route>
      <Route
        path="/search"
        element={
          <MainLayout>
            <Search />
          </MainLayout>
        }
      ></Route>
    </Routes>
  )
}
