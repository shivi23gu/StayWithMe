import React from 'react'
import Navbar from '../../Components/hotelOwner/Navbar'
import Sidebar from '../../Components/hotelOwner/Sidebar'
import { Outlet, Navigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
  const { isOwner, user, userLoading } = useAppContext();

  if (userLoading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
      Loading...
    </div>
  );

  if (!user || !isOwner) return <Navigate to="/" replace />;

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Navbar />
      <div className='flex flex-1'>
        <Sidebar />
        <main className='flex-1 p-4 pt-8 md:px-10 overflow-y-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout