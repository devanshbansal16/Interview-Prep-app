import React  from 'react'
import ProfileInfoCard from '../Cards/ProfileInfoCard'
import { Link } from 'react-router-dom'


const Navbar = () => {
  return (
   <div className='bg-white shadow-lg border-b border-rose-100'>
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='flex justify-between items-center py-4'>
        <Link to="/dashboard" className='flex items-center space-x-3'>
          <div className='w-6 h-10 bg-gradient-to-b from-rose-500 via-rose-500 to-pink-100 rounded-lg shadow-md relative overflow-hidden'>
            <div className='absolute top-0 left-0 w-full h-6 bg-rose-500'></div>
            <div className='absolute bottom-0 left-0 w-full h-4 bg-pink-100'></div>
          </div>
          <h2 className='text-2xl font-bold text-gradient'>
            Interview Prep AI
          </h2>
        </Link>
        <ProfileInfoCard/>
      </div>
    </div>
   </div>
  )
}

export default Navbar