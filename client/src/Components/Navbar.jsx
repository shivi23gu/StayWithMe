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
                setIsOwner(data.role === 'hotelOwner');  // ← YE FIX HAI
                setSearchedCities(data?.recentSearchedCities || []);
            }
            // ← retry wala setTimeout hataya — infinite loop band
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || "Error fetching user data";
            console.error("Error fetching user data:", msg);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUser();
        }
    }, [user]);

    useEffect(() => {
        fetchRooms();
    }, []);

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