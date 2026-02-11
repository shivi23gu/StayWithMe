import React from 'react'
import Title from './Title'
import { assets, exclusiveOffers } from '../assets/assets'

const ExclusiveOffers = () => {
  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-32">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full">
        <Title
          align="left"
          title="Exclusive Offers"
          subTitle="Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories."
        />

        <button className="group flex items-center gap-2 px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-all">
          View All Offers
          <img
            src={assets.arrowIcon}
            alt="arrow-icon"
            className="group-hover:translate-x-1 transition-all"
          />
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 w-full">
        {exclusiveOffers.map((item) => (
          <div
            key={item._id}
            className="group relative flex flex-col justify-end gap-4 p-6 rounded-xl text-white bg-no-repeat bg-cover bg-center h-80 sm:h-72 md:h-80 lg:h-80"
            style={{ backgroundImage: `url(${item.image})` }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors rounded-xl"></div>

            {/* Discount Badge */}
            <span className="absolute top-4 left-4 bg-white text-black text-xs font-semibold px-2 py-1 rounded z-20">
              {item.priceOff}% OFF
            </span>

            {/* Text Content */}
            <div className="relative z-20">
              <p className="text-xl font-semibold">{item.title}</p>
              <p className="text-sm mt-1">{item.description}</p>
              <p className="text-xs text-gray-300 mt-1">Expires {item.expiryDate}</p>

              <button className="flex items-center gap-2 font-medium cursor-pointer mt-4">
                View Offers
                <img
                  className="invert group-hover:translate-x-1 transition-all"
                  src={assets.arrowIcon}
                  alt="arrow-icon"
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExclusiveOffers
