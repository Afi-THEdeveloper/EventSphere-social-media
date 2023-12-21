import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { ServerVariables } from '../utils/ServerVariables'

function IsloggedOutUser() {
  const {token} = useSelector(state => state.Auth)  
  return (
    token === null?<Outlet/>:<Navigate to={ServerVariables.UserHome}/>
  )
}

export default IsloggedOutUser