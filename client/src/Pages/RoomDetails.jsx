import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { roomsDummyData, assets, facilityIcons, roomCommonData } from '../assets/assets'
import Swal from 'sweetalert2' // Import SweetAlert2

const RoomDetails = () => {
  const { id } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const room = roomsDummyData.find((item) => item._id === id);
    if (room) {
      setRoomData(room);
      setMainImage(room.images[0]);
    }
    window.scrollTo(0, 0);
  }, [id]);

  // Handle availability check with popup
  const handleCheckAvailability = (e) => {
    e.preventDefault();
    
    Swal.fire({
      title: 'No Rooms Available!',
      text: 'Sorry, all rooms at this StayWithMe Noida location are fully booked for the selected dates.',
      icon: 'error',
      confirmButtonText: 'Try Other Dates',
      confirmButtonColor: '#2563eb', // Matches your blue-600 color
      customClass: {
        popup: 'rounded-3xl',
        title: 'font-playfair'
      }
    });
  };

  if (!roomData) return <div className='pt-40 text-center font-playfair'>Finding your stay in Noida...</div>;

  return (
    <div className='pt-28 md:pt-36 px-4 md:px-16 lg:px-24 xl:px-32'>
      
      {/* --- HEADER --- */}
      <div className='flex flex-col gap-2 mb-8'>
        <div className='flex items-center gap-3 flex-wrap'>
           <h1 className='text-3xl md:text-4xl font-playfair font-semibold text-gray-900'>
            {roomData.hotel.name} <span className='text-lg font-light text-gray-500'>({roomData.roomType})</span>
           </h1>
           <span className='bg-orange-500 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase'>Special Noida Offer</span>
        </div>
        <div className='flex items-center gap-6 text-sm'>
          <div className='flex items-center gap-1.5 text-orange-400'>
             <img src={assets.starIconFilled} className='w-3.5' alt="" />
             <p className='text-gray-800 font-medium'>4.9 <span className='text-gray-400 font-normal'>(500+ verified reviews)</span></p>
          </div>
          <p className='text-gray-500 flex items-center gap-1.5'>
            <img src={assets.locationIcon} className='w-3.5' alt="" />
            Sector 62, Noida, Uttar Pradesh, India
          </p>
        </div>
      </div>

      {/* --- GALLERY --- */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 h-[350px] md:h-[500px] mb-12'>
         <div className='md:col-span-2 h-full'>
            <img src={mainImage} className='w-full h-full object-cover rounded-3xl shadow-md' alt="StayWithMe Noida" />
         </div>
         <div className='hidden md:grid grid-cols-2 col-span-2 gap-4 h-full'>
            {roomData.images.slice(0, 4).map((img, index) => (
              <img key={index} onClick={() => setMainImage(img)} src={img} className={`w-full h-full object-cover rounded-2xl cursor-pointer hover:opacity-90 transition-all ${mainImage === img ? 'ring-2 ring-blue-500' : ''}`} alt="Room View" />
            ))}
         </div>
      </div>

      <div className='flex flex-col lg:flex-row justify-between gap-16 mb-20'>
        <div className='lg:w-2/3'>
          <h2 className='text-2xl font-playfair font-medium text-gray-800 mb-6'>Experience Premium Comfort at StayWithMe Noida</h2>
          
          <div className='flex flex-wrap gap-4 mb-10'>
            {roomData.amenities.map((item) => (
              <div key={item} className='flex items-center gap-3 bg-gray-50 px-5 py-2.5 rounded-xl border border-gray-100'>
                <img src={facilityIcons[item]} className='w-5' alt={item} />
                <span className='text-sm text-gray-700 font-medium'>{item}</span>
              </div>
            ))}
          </div>

          <hr className='border-gray-100 mb-10' />

          {/* --- CHECK AVAILABILITY BAR (Noida Location Styles) --- */}
          <form 
            onSubmit={handleCheckAvailability} 
            className='hidden md:flex items-center justify-between bg-white border border-gray-100 shadow-xl shadow-gray-100/50 p-6 rounded-2xl mb-12 gap-8'
          >
             <div className='flex items-center flex-1 gap-10'>
                <div className='flex flex-col'>
                  <label htmlFor="checkin" className='font-medium text-sm text-gray-700 mb-1.5'>Check-In</label>
                  <input type="date" id="checkin" required className='w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none bg-transparent' />
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="checkout" className='font-medium text-sm text-gray-700 mb-1.5'>Check-Out</label>
                  <input type="date" id="checkout" required className='w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none bg-transparent' />
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="guests" className='font-medium text-sm text-gray-700 mb-1.5'>Guests</label>
                  <input type="number" id="guests" placeholder='0' required className='max-w-20 rounded border border-gray-300 px-3 py-2 text-sm outline-none bg-transparent' />
                </div>
             </div>

             <button type='submit' className='bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white rounded-md px-10 py-4 text-base font-medium cursor-pointer shadow-lg shadow-blue-100'>
                Check Availability
             </button>
          </form>

          {/* Highlights Section */}
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
            Located in the heart of Noida’s vibrant business district, StayWithMe offers a refined retreat for both business and leisure travelers. Our rooms are designed with a contemporary Indian touch, ensuring a blend of luxury and cultural warmth. Guests can enjoy seamless access to local transit, major corporate hubs, and the finest dining Noida has to offer.
          </p>

          <hr className='border-gray-100 mb-10' />

          {/* Host Info - Updated for India */}
          <div className='flex flex-col gap-6 mb-20'>
            <div className='flex items-center gap-4'>
              <img src={assets.logo} className='w-14 h-14 rounded-full border p-2 object-contain' alt="" />
              <div>
                <h3 className='text-xl font-semibold'>Hosted by {roomData.hotel.name} Noida Team</h3>
                <div className='flex items-center gap-1 text-orange-400 text-sm'>
                   {[...Array(5)].map((_, i) => <img key={i} src={assets.starIconFilled} className='w-3' alt="" />)}
                   <span className='text-gray-400 ml-2'>Official StayWithMe Partner</span>
                </div>
              </div>
            </div>
            <button className='w-fit bg-blue-600 text-white px-10 py-3 rounded-xl font-semibold hover:bg-blue-700'>
                Contact Host in Noida
            </button>
          </div>
        </div>

        {/* --- SIDEBAR PRICE (In Rupees) --- */}
        <div className='hidden lg:block lg:w-1/3'>
          <div className='sticky top-40 text-right'>
             <p className='text-3xl font-bold text-gray-900'>
                ₹{roomData.pricePerNight * 80} <span className='text-lg font-normal text-gray-400'>/ night</span>
             </p>
             <p className='text-xs text-gray-400 mt-2'>Inclusive of all Indian taxes</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDetails 