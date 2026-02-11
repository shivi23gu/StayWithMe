// LOGOS & ICONS
import logo from "./logo.svg";
import searchIcon from "./searchIcon.svg";
import userIcon from "./userIcon.svg";
import calenderIcon from "./calenderIcon.svg";
import locationIcon from "./locationIcon.svg";
import starIconFilled from "./starIconFilled.svg";
import arrowIcon from "./arrowIcon.svg";
import starIconOutlined from "./starIconOutlined.svg";
import instagramIcon from "./instagramIcon.svg";
import facebookIcon from "./facebookIcon.svg";
import twitterIcon from "./twitterIcon.svg";
import linkendinIcon from "./linkendinIcon.svg";
import freeWifiIcon from "./freeWifiIcon.svg";
import freeBreakfastIcon from "./freeBreakfastIcon.svg";
import roomServiceIcon from "./roomServiceIcon.svg";
import mountainIcon from "./mountainIcon.svg";
import poolIcon from "./poolIcon.svg";
import homeIcon from "./homeIcon.svg";
import closeIcon from "./closeIcon.svg";
import locationFilledIcon from "./locationFilledIcon.svg";
import heartIcon from "./heartIcon.svg";
import badgeIcon from "./badgeIcon.svg";
import menuIcon from "./menuIcon.svg";
import closeMenu from "./closeMenu.svg";
import guestsIcon from "./guestsIcon.svg";

// IMAGES
import roomImg1 from "./roomImg1.png";
import roomImg2 from "./roomImg2.png";
import roomImg3 from "./roomImg3.png";
import roomImg4 from "./roomImg4.png";
import regImage from "./regImage.png";
import exclusiveOfferCardImg1 from "./exclusiveOfferCardImg1.png";
import exclusiveOfferCardImg2 from "./exclusiveOfferCardImg2.png";
import exclusiveOfferCardImg3 from "./exclusiveOfferCardImg3.png";

// OWNER ICONS
import addIcon from "./addIcon.svg";
import dashboardIcon from "./dashboardIcon.svg";
import listIcon from "./listIcon.svg";
import uploadArea from "./uploadArea.svg";
import totalBookingIcon from "./totalBookingIcon.svg";
import totalRevenueIcon from "./totalRevenueIcon.svg";

/* ---------------- ASSETS ---------------- */
export const assets = {
  logo,
  searchIcon,
  userIcon,
  calenderIcon,
  locationIcon,
  starIconFilled,
  arrowIcon,
  starIconOutlined,
  instagramIcon,
  facebookIcon,
  twitterIcon,
  linkendinIcon,
  freeWifiIcon,
  freeBreakfastIcon,
  roomServiceIcon,
  mountainIcon,
  poolIcon,
  closeIcon,
  homeIcon,
  locationFilledIcon,
  heartIcon,
  badgeIcon,
  menuIcon,
  closeMenu,
  guestsIcon,
  regImage,
  addIcon,
  dashboardIcon,
  listIcon,
  uploadArea,
  totalBookingIcon,
  totalRevenueIcon,
};

/* ---------------- FACILITY ICONS ---------------- */
export const facilityIcons = {
  "Free WiFi": freeWifiIcon,
  "Free Breakfast": freeBreakfastIcon,
  "Room Service": roomServiceIcon,
  "Mountain View": mountainIcon,
  "Pool Access": poolIcon,
};

/* ---------------- CITIES ---------------- */
export const cities = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Jaipur",
  "Goa",
];

/* ---------------- EXCLUSIVE OFFERS ---------------- */
export const exclusiveOffers = [
  {
    _id: 1,
    title: "Summer Escape Package",
    description: "Enjoy a complimentary night and daily breakfast",
    priceOff: 25,
    expiryDate: "Aug 31",
    image: exclusiveOfferCardImg1,
  },
  {
    _id: 2,
    title: "Romantic Getaway",
    description: "Special couples package including spa treatment",
    priceOff: 20,
    expiryDate: "Sep 20",
    image: exclusiveOfferCardImg2,
  },
  {
    _id: 3,
    title: "Luxury Retreat",
    description: "Book early and save on your stay at premium hotels",
    priceOff: 30,
    expiryDate: "Sep 25",
    image: exclusiveOfferCardImg3,
  },
];

/* ---------------- USER ---------------- */
export const userDummyData = {
  _id: "user123",
  username: "StayWithMe Owner",
  email: "owner@staywithme.com",
  image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
  role: "hotelOwner",
};

/* ---------------- HOTEL ---------------- */
export const hotelDummyData = {
  _id: "hotel123",
  name: "StayWithMe Residency",
  address: "MG Road, Near Metro Station",
  contact: "+91 9876543210",
  owner: userDummyData,
  city: "Delhi",
};

/* ---------------- ROOMS ---------------- */
export const roomsDummyData = [
  {
    _id: "room1",
    hotel: hotelDummyData,
    roomType: "Double Bed",
    pricePerNight: 2499,
    amenities: ["Room Service", "Mountain View", "Pool Access"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true,
  },
  {
    _id: "room2",
    hotel: hotelDummyData,
    roomType: "Single Bed",
    pricePerNight: 1499,
    amenities: ["Free WiFi", "Room Service"],
    images: [roomImg2, roomImg3, roomImg4, roomImg1],
    isAvailable: true,
  },
  {
    _id: "room3",
    hotel: hotelDummyData,
    roomType: "Family Suite",
    pricePerNight: 3999,
    amenities: ["Free WiFi", "Free Breakfast", "Pool Access"],
    images: [roomImg3, roomImg4, roomImg1, roomImg2],
    isAvailable: true,
  },
];

/* ---------------- ROOM COMMON DATA ---------------- */
export const roomCommonData = [
  {
    title: "Self check-in",
    description: "Check yourself in with the smartlock at your convenience.",
    icon: homeIcon,
  },
  {
    title: "StayWithMe Professional Hosting",
    description:
      "Every StayWithMe property is managed by verified professionals.",
    icon: badgeIcon,
  },
  {
    title: "Free cancellation",
    description: "Cancel for free up to 48 hours before your check-in date.",
    icon: calenderIcon,
  },
];

/* ---------------- USER BOOKINGS ---------------- */
export const userBookingsDummyData = [
  {
    _id: "booking1",
    hotel: roomsDummyData[0].hotel,
    room: roomsDummyData[0],
    guests: 2,
    checkInDate: "2026-02-20",
    checkOutDate: "2026-02-22",
    totalPrice: roomsDummyData[0].pricePerNight * 2,
    isPaid: true,
  },
  {
    _id: "booking2",
    hotel: roomsDummyData[1].hotel,
    room: roomsDummyData[1],
    guests: 1,
    checkInDate: "2026-03-05",
    checkOutDate: "2026-03-07",
    totalPrice: roomsDummyData[1].pricePerNight * 2,
    isPaid: false,
  },
  {
    _id: "booking3",
    hotel: roomsDummyData[2].hotel,
    room: roomsDummyData[2],
    guests: 4,
    checkInDate: "2026-03-10",
    checkOutDate: "2026-03-15",
    totalPrice: roomsDummyData[2].pricePerNight * 5,
    isPaid: true,
  },
];

/* ---------------- DASHBOARD DATA ---------------- */
export const dashboardDummyData = [
  {
    _id: "room1",
    name: "StayWithMe Residency",
    totalBookings: 120,
    totalRevenue: 300000,
    occupancy: "85%",
  },
  {
    _id: "room2",
    name: "StayWithMe Deluxe",
    totalBookings: 90,
    totalRevenue: 180000,
    occupancy: "70%",
  },
  {
    _id: "room3",
    name: "StayWithMe Luxury",
    totalBookings: 150,
    totalRevenue: 450000,
    occupancy: "95%",
  },
];
