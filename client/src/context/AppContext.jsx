import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || "$";
    const navigate = useNavigate();

    const { user } = useUser();
    const { getToken } = useAuth();

    const [isOwner, setIsOwner] = useState(false);
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [searchedCities, setSearchedCities] = useState([]);
    const [rooms, setRooms] = useState([]);

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get('/api/rooms');
            if (data.success) {
                setRooms(data.rooms);
            } else {
                toast.error(data.message || "Failed to fetch rooms");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const fetchUser = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/user', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data && data.success) {
                const owner = data.role === 'hotelOwner';
                setIsOwner(owner);
                // ✅ FIX: Agar user owner hai toh registration form band karo
                if (owner) {
                    setShowHotelReg(false);
                }
                setSearchedCities(data?.recentSearchedCities || []);
            }
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || "Error fetching user data";
            console.error("Error fetching user data:", msg);
            setIsOwner(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUser();
        } else {
            setIsOwner(false);
            setShowHotelReg(false); // ✅ FIX: Logout hone par form band karo
        }
    }, [user]);

    useEffect(() => {
        fetchRooms();
    }, []);

    // ✅ FIX: isOwner true ho jaaye kisi bhi wajah se → form band
    useEffect(() => {
        if (isOwner) {
            setShowHotelReg(false);
        }
    }, [isOwner]);

    const value = {
        currency,
        navigate,
        user,
        getToken,
        isOwner,
        setIsOwner,
        axios,
        showHotelReg,
        setShowHotelReg,
        searchedCities,
        setSearchedCities,
        fetchUser,
        rooms,
        setRooms
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
