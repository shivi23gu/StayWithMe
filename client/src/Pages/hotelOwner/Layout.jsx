import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/hotelOwner/Navbar'
import Sidebar from '../../Components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {

  const { isOwner, navigate, user } = useAppContext();
  // ✅ FIX: Wait karo jab tak user load ho — warna isOwner false se false positive redirect hoga
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // user load ho gaya, ab check karo
    if (user !== undefined) {
      setChecked(true);
    }
  }, [user, isOwner]);

  useEffect(() => {
    // ✅ Sirf tab redirect karo jab user confirmed logged in hai lekin owner nahi
    if (checked && user && !isOwner) {
      navigate('/');
    }
    // Agar user logged out hai toh bhi home bhejo
    if (checked && !user) {
      navigate('/');
    }
  }, [checked, isOwner, user]);

  // ✅ Jab tak check nahi hua, kuch mat dikhao (flicker prevent)
  if (!checked || !isOwner) return null;

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
