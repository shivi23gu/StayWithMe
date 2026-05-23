import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useParams, useLocation } from 'react-router-dom';

const Loader = () => {
  const { navigate } = useAppContext();
  const { nextUrl } = useParams();
  const location = useLocation();

  useEffect(() => {
    if (!nextUrl) return;

    const targetPath = decodeURIComponent(nextUrl);
    
    // ✅ Query params bhi saath le jao
    const queryString = location.search;

    const timer = setTimeout(() => {
      const fullPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
      navigate(`${fullPath}${queryString}`);
    }, 8000);

    return () => clearTimeout(timer);
  }, [nextUrl, navigate]);

  return (
    <div className='flex flex-col gap-4 justify-center items-center h-screen bg-white'>
      <div className='animate-spin rounded-full h-20 w-20 border-4 border-gray-100 border-t-primary'></div>
      <p className='text-gray-400 text-sm tracking-wide font-medium animate-pulse'>
        Redirecting you securely...
      </p>
    </div>
  );
};

export default Loader;