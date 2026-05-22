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

    const [isOwner, setIsOwner] = useState(() => {
        return localStorage.getItem("isOwner") === "true";
    });
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [searchedCities, setSearchedCities] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [userLoading, setUserLoading] = useState(true);

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
            setUserLoading(true);
            const token = await getToken();
            const { data } = await axios.get('/api/user', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data && data.success) {
                const owner = data.role === 'hotelOwner';
                setIsOwner(owner);
                localStorage.setItem("isOwner", owner);
                if (owner) setShowHotelReg(false);
                setSearchedCities(data?.recentSearchedCities || []);
            }
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || "Error fetching user data";
            console.error("Error fetching user data:", msg);
            setIsOwner(false);
            localStorage.setItem("isOwner", "false");
        } finally {
            setUserLoading(false);
        }
    };

    useEffect(() => {
    if (user === undefined) return; // Clerk abhi load ho raha hai, wait karo
    if (user) {
        fetchUser();
    } else {
        setIsOwner(false);
        localStorage.setItem("isOwner", "false");
        setShowHotelReg(false);
        setUserLoading(false);
    }
}, [user]);

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        if (isOwner) setShowHotelReg(false);
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
        setRooms,
        userLoading,
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