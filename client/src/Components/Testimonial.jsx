import React from "react";
import Title from "./Title";

const Testimonial = () => {
  const testimonials = [
    {
      name: "Emma Roberts",
      role: "Business Traveler",
      image:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200",
      review:
        "StayWithMe made my business trips seamless! The booking process is smooth, and the hotels are always top-notch.",
    },
    {
      name: "Liam Johnson",
      role: "Family Vacationer",
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200",
      review:
        "Our family loved using StayWithMe for our holiday. Amazing hotels, great deals, and excellent customer support!",
    },
    {
      name: "Sophia Williams",
      role: "Solo Traveler",
      image:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=200",
      review:
        "I travel a lot alone, and StayWithMe always has safe, comfortable, and well-located hotels. Highly recommend!",
    },
  ];

  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 pt-20 pb-32">
      <Title
        title={"What Our Guests Say"}
        subTitle={
          "Discover why travelers worldwide choose StayWithMe for the best hotels and unforgettable stays."
        }
      />

      {/* FIXED: 
          1. Added 'gap-y-24' to provide vertical space for wrapped cards.
          2. Added 'pt-24' to give the first row of cards room for the floating images.
      */}
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-24 pt-24">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="text-sm w-80 border border-gray-200 pb-8 rounded-xl bg-white shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)] relative"
          >
            <div className="flex flex-col items-center px-5 relative">
              {/* IMAGE FIX: 
                  - Added border-4 border-white to make it stand out.
                  - Added object-cover to prevent stretching.
              */}
              <img
                className="h-28 w-28 absolute -top-14 rounded-full border-4 border-white shadow-md object-cover"
                src={t.image}
                alt={t.name}
              />
              
              {/* TEXT FIX: 
                  - Increased padding-top (pt-16) so the name starts below the image.
              */}
              <div className="pt-16 pb-4 text-center">
                <h1 className="text-lg font-semibold text-gray-800">{t.name}</h1>
                <p className="text-gray-500 font-medium">{t.role}</p>
              </div>
            </div>

            <p className="text-gray-600 px-8 text-center leading-relaxed italic">
              "{t.review}"
            </p>

            <div className="flex justify-center pt-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, starIndex) => (
                  <svg
                    key={starIndex}
                    width="18"
                    height="18"
                    viewBox="0 0 22 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z"
                      fill="#FF532E"
                    />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;