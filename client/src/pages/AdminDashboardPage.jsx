import React from 'react'
import { clearTokens } from '../redux/authSlice'
import { useDispatch } from 'react-redux'

const AdminDashboard = () => {
  const dispatch = useDispatch()
  return (
    <div>
        AdminDashboard
        <button onClick={()=> dispatch(clearTokens())}>
          Logout
        </button>
    </div>
  )
}

export default AdminDashboard