import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';

const Loader = () => {
  const { navigate } = useAppContext();
  const { nextUrl } = useParams();

  useEffect(() => {
    if (!nextUrl) return;

    // Decode the URL in case it has slashes or parameters encoded
    const targetPath = decodeURIComponent(nextUrl);

    const timer = setTimeout(() => {
      // Ensure we don't double up on preceding slashes
      navigate(targetPath.startsWith('/') ? targetPath : `/${targetPath}`);
    }, 8000);

    // CLEANUP: Destroys the timer if the component unmounts mid-wait
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