import React, { useEffect } from 'react'
import Navbar from '../../Components/hotelOwner/Navbar'
import Sidebar from '../../Components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {

const {isOwner, navigate} = useAppContext();

useEffect(()=>{
    if(!isOwner){
        navigate('/')
    }
},[isOwner])

  return (
    // min-h-screen ensures the background/layout always fills the window
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Navbar />
      
      {/* flex-1 here tells this container to take all space below the Navbar */}
      <div className='flex flex-1'>
        <Sidebar />
        
        {/* Added overflow-y-auto so your dashboard content is scrollable */}
        <main className='flex-1 p-4 pt-8 md:px-10 overflow-y-auto'>
           <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout