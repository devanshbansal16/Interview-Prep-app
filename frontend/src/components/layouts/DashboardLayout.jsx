import React, { useContext } from 'react'
import { UserContext } from '../../Context/userContext.js';
import Navbar from './Navbar';

const DashboardLayout = ({children}) => {
    const {user} = useContext(UserContext);
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <Navbar/>

      {user && <div className="min-h-screen">{children}</div>}
    </div>
  )
}

export default DashboardLayout