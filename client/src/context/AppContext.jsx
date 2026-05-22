import axios from "axios";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || "$";
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useUser();
    const { getToken } = useAuth();

    const [isOwner, setIsOwner] = useState(() => {
        return localStorage.getItem("isOwner") === "true";
    });
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [searchedCities, setSearchedCities] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [userLoading, setUserLoading] = useState(true);

    // ✅ FIX: Track karo kya ye pehli baar login hai (fresh login) ya sirf page reload
    const isFirstLogin = useRef(false);

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

    const fetchUser = async (shouldRedirect = false) => {
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

                // ✅ FIX: Sirf tab redirect karo jab shouldRedirect = true ho
                // (yaani fresh login hua ho, na ki sirf page reload)
                if (shouldRedirect) {
                    if (owner) {
                        // Owner hai → Owner Dashboard pe bhejo
                        navigate("/owner");
                    }
                    // Normal user ke liye koi redirect nahi — woh jahan hai wahan raho
                    // (Home page pe already hoga fresh login ke baad)
                }
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
            // ✅ FIX: Pehle check karo kya pehle se logged in tha (localStorage mein user tha)
            // Agar nahi tha → fresh login → redirect karo
            const wasLoggedIn = localStorage.getItem("clerkUserId") === user.id;

            if (!wasLoggedIn) {
                // Fresh login! User ID save karo aur redirect ke saath fetchUser karo
                localStorage.setItem("clerkUserId", user.id);
                isFirstLogin.current = true;
                fetchUser(true); // shouldRedirect = true
            } else {
                // Page reload ya tab switch — sirf data fetch karo, redirect mat karo
                fetchUser(false); // shouldRedirect = false
            }
        } else {
            // Logout ho gaya
            localStorage.removeItem("clerkUserId");
            setIsOwner(false);
            localStorage.setItem("isOwner", "false");
            setShowHotelReg(false);
            setUserLoading(false);
            isFirstLogin.current = false;
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
