import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'

const RoomDetails = () => {
  const { id } = useParams();
  const { rooms, axios, getToken, user, navigate } = useAppContext();
  const [roomData, setRoomData] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // BUG FIX 1: isAvailable state add kiya - Check Availability result store karne ke liye
  const [isAvailable, setIsAvailable] = useState(null);

  useEffect(() => {
    if (!rooms || rooms.length === 0) return;
    const room = rooms.find((item) => String(item._id) === String(id));
    if (room) {
      setRoomData(room);
      setMainImage(room.images[0]);
    }
    window.scrollTo(0, 0);
  }, [id, rooms]);

  // BUG FIX 2: Check Availability function add kiya
  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await axios.post('/api/bookings/check-availability', {
        room: id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
      });

      if (data.success) {
        setIsAvailable(data.isAvailable);
        if (data.isAvailable) {
          toast.success('Room is available!');
        } else {
          toast.error('Room is not available for selected dates');
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to book a room');
      return;
    }
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    try {
      setIsLoading(true);
      const token = await getToken();

      const { data } = await axios.post('/api/bookings',
        {
          room: id,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          guests: Number(guests),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success('Booking created successfully');
        navigate('/my-bookings');
        window.scrollTo(0, 0);
      } else {
        toast.error(data.message || 'Booking failed');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Booking failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!roomData) {
    return (
      <div className='pt-40 text-center font-playfair'>
        <p className='text-xl text-gray-500'>Finding your stay...</p>
        <p className='text-sm text-gray-400 mt-2'>Room ID: {id}</p>
      </div>
    );
  }

  return (
    <div className='pt-28 md:pt-36 px-4 md:px-16 lg:px-24 xl:px-32'>

      {/* HEADER */}
      <div className='flex flex-col gap-2 mb-8'>
        <div className='flex items-center gap-3 flex-wrap'>
          <h1 className='text-3xl md:text-4xl font-playfair font-semibold text-gray-900'>
            {roomData.hotel?.name} <span className='text-lg font-light text-gray-500'>({roomData.roomType})</span>
          </h1>
          <span className='bg-orange-500 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase'>Special Offer</span>
        </div>
        <div className='flex items-center gap-6 text-sm'>
          <div className='flex items-center gap-1.5 text-orange-400'>
            <img src={assets.starIconFilled} className='w-3.5' alt="" />
            <p className='text-gray-800 font-medium'>4.9 <span className='text-gray-400 font-normal'>(500+ verified reviews)</span></p>
          </div>
          <p className='text-gray-500 flex items-center gap-1.5'>
            <img src={assets.locationIcon} className='w-3.5' alt="" />
            {roomData.hotel?.address || roomData.hotel?.city || 'India'}
          </p>
        </div>
      </div>

      {/* GALLERY */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 h-[350px] md:h-[500px] mb-12'>
        <div className='md:col-span-2 h-full'>
          <img src={mainImage} className='w-full h-full object-cover rounded-3xl shadow-md' alt="Room" />
        </div>
        <div className='hidden md:grid grid-cols-2 col-span-2 gap-4 h-full'>
          {roomData.images.slice(0, 4).map((img, index) => (
            <img key={index} onClick={() => setMainImage(img)} src={img}
              className={`w-full h-full object-cover rounded-2xl cursor-pointer hover:opacity-90 transition-all ${mainImage === img ? 'ring-2 ring-blue-500' : ''}`}
              alt="Room View" />
          ))}
        </div>
      </div>

      <div className='flex flex-col lg:flex-row justify-between gap-16 mb-20'>
        <div className='lg:w-2/3'>
          <h2 className='text-2xl font-playfair font-medium text-gray-800 mb-6'>Experience Luxury Like Never Before</h2>

          {/* Amenities */}
          <div className='flex flex-wrap gap-4 mb-10'>
            {roomData.amenities?.map((item) => (
              <div key={item} className='flex items-center gap-3 bg-gray-50 px-5 py-2.5 rounded-xl border border-gray-100'>
                <img src={facilityIcons[item]} className='w-5' alt={item} />
                <span className='text-sm text-gray-700 font-medium'>{item}</span>
              </div>
            ))}
          </div>

          <hr className='border-gray-100 mb-10' />

          {/* BOOKING FORM - Desktop */}
          <div className='hidden md:block bg-white border border-gray-100 shadow-xl shadow-gray-100/50 p-6 rounded-2xl mb-12'>
            <div className='flex items-end gap-6'>
              <div className='flex flex-col'>
                <label className='font-medium text-sm text-gray-700 mb-1.5'>Check-In</label>
                <input type="date" value={checkIn}
                  onChange={(e) => { setCheckIn(e.target.value); setIsAvailable(null); }}
                  min={new Date().toISOString().split('T')[0]}
                  className='rounded border border-gray-300 px-3 py-2 text-sm outline-none bg-transparent' />
              </div>
              <div className='flex flex-col'>
                <label className='font-medium text-sm text-gray-700 mb-1.5'>Check-Out</label>
                <input type="date" value={checkOut}
                  onChange={(e) => { setCheckOut(e.target.value); setIsAvailable(null); }}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  className='rounded border border-gray-300 px-3 py-2 text-sm outline-none bg-transparent' />
              </div>
              <div className='flex flex-col'>
                <label className='font-medium text-sm text-gray-700 mb-1.5'>Guests</label>
                <input type="number" value={guests} min={1} max={10}
                  onChange={(e) => setGuests(e.target.value)}
                  className='max-w-20 rounded border border-gray-300 px-3 py-2 text-sm outline-none bg-transparent' />
              </div>

              {/* BUG FIX 3: Check Availability dikhao pehle, Book Now tab aaye jab available ho */}
              {!isAvailable ? (
                <button onClick={handleCheckAvailability} disabled={isLoading}
                  className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 active:scale-95 transition-all text-white rounded-md px-8 py-2 text-sm font-medium cursor-pointer'>
                  {isLoading ? 'Checking...' : 'Check Availability'}
                </button>
              ) : (
                <button onClick={handleBookNow} disabled={isLoading}
                  className='bg-green-600 hover:bg-green-700 disabled:bg-green-400 active:scale-95 transition-all text-white rounded-md px-8 py-2 text-sm font-medium cursor-pointer'>
                  {isLoading ? 'Booking...' : 'Book Now'}
                </button>
              )}
            </div>
          </div>

          {/* BOOKING FORM - Mobile */}
          <div className='flex md:hidden flex-col gap-4 bg-white border border-gray-100 shadow-xl p-5 rounded-2xl mb-12'>
            <div className='flex flex-col'>
              <label className='font-medium text-sm text-gray-700 mb-1.5'>Check-In</label>
              <input type="date" value={checkIn}
                onChange={(e) => { setCheckIn(e.target.value); setIsAvailable(null); }}
                min={new Date().toISOString().split('T')[0]}
                className='rounded border border-gray-300 px-3 py-2 text-sm outline-none' />
            </div>
            <div className='flex flex-col'>
              <label className='font-medium text-sm text-gray-700 mb-1.5'>Check-Out</label>
              <input type="date" value={checkOut}
                onChange={(e) => { setCheckOut(e.target.value); setIsAvailable(null); }}
                min={checkIn || new Date().toISOString().split('T')[0]}
                className='rounded border border-gray-300 px-3 py-2 text-sm outline-none' />
            </div>
            <div className='flex flex-col'>
              <label className='font-medium text-sm text-gray-700 mb-1.5'>Guests</label>
              <input type="number" value={guests} min={1} max={10}
                onChange={(e) => setGuests(e.target.value)}
                className='rounded border border-gray-300 px-3 py-2 text-sm outline-none' />
            </div>
            {!isAvailable ? (
              <button onClick={handleCheckAvailability} disabled={isLoading}
                className='bg-blue-600 disabled:bg-blue-400 text-white rounded-md px-6 py-3 text-base font-medium'>
                {isLoading ? 'Checking...' : 'Check Availability'}
              </button>
            ) : (
              <button onClick={handleBookNow} disabled={isLoading}
                className='bg-green-600 disabled:bg-green-400 text-white rounded-md px-6 py-3 text-base font-medium'>
                {isLoading ? 'Booking...' : 'Book Now'}
              </button>
            )}
          </div>

          {/* Highlights */}
          <div className='flex flex-col gap-10 mb-12'>
            {roomCommonData.map((item, index) => (
              <div key={index} className='flex items-start gap-5'>
                <img src={item.icon} className='w-6 mt-1' alt="" />
                <div>
                  <h4 className='font-semibold text-gray-900 text-lg'>{item.title}</h4>
                  <p className='text-gray-500 leading-relaxed'>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <p className='text-gray-500 leading-relaxed mb-10'>
            Experience the finest hospitality with world-class amenities and exceptional service. Our rooms are designed to provide maximum comfort and luxury for both business and leisure travelers.
          </p>

          <hr className='border-gray-100 mb-10' />

          {/* Host Info */}
          <div className='flex flex-col gap-6 mb-20'>
            <div className='flex items-center gap-4'>
              <img src={assets.logo} className='w-14 h-14 rounded-full border p-2 object-contain' alt="" />
              <div>
                <h3 className='text-xl font-semibold'>Hosted by {roomData.hotel?.name}</h3>
                <div className='flex items-center gap-1 text-orange-400 text-sm'>
                  {[...Array(5)].map((_, i) => <img key={i} src={assets.starIconFilled} className='w-3' alt="" />)}
                  <span className='text-gray-400 ml-2'>Official StayWithMe Partner</span>
                </div>
              </div>
            </div>
            <button className='w-fit bg-blue-600 text-white px-10 py-3 rounded-xl font-semibold hover:bg-blue-700'>
              Contact Host
            </button>
          </div>
        </div>

        {/* Sidebar Price */}
        <div className='hidden lg:block lg:w-1/3'>
          <div className='sticky top-40 text-right'>
            <p className='text-3xl font-bold text-gray-900'>
              ₹{(roomData.pricePerNight ).toLocaleString('en-IN')}
              <span className='text-lg font-normal text-gray-400'> / night</span>
            </p>
            <p className='text-xs text-gray-400 mt-2'>Inclusive of all taxes</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDetails
