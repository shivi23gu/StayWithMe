import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const navigate = useNavigate();

  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  // ✅ default false
  const [isOwner, setIsOwner] = useState(false);

  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [userLoading, setUserLoading] = useState(true);

  const isFirstLogin = useRef(false);

  // ---------------- FETCH ROOMS ----------------
  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/rooms");

      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message || "Failed to fetch rooms");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- FETCH USER ----------------
  const fetchUser = async (shouldRedirect = false) => {
    try {
      setUserLoading(true);

      const token = await getToken();

      const { data } = await axios.get("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ DEBUG
      console.log("USER API DATA:", data);

      if (data?.success) {
        const owner = data.role === "hotelOwner";

        // ✅ set role from backend only
        setIsOwner(owner);

        if (owner) {
          setShowHotelReg(false);
        }

        setSearchedCities(data?.recentSearchedCities || []);

        // Fresh login redirect
        if (shouldRedirect) {
          if (owner) {
            navigate("/owner");
          } else {
            navigate("/dashboard");
          }
        }
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Error fetching user data";

      console.error("Error fetching user data:", msg);

      setIsOwner(false);
    } finally {
      setUserLoading(false);
    }
  };

  // ---------------- USER EFFECT ----------------
  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      const wasLoggedIn =
        localStorage.getItem("clerkUserId") === user.id;

      if (!wasLoggedIn) {
        localStorage.setItem("clerkUserId", user.id);

        isFirstLogin.current = true;

        fetchUser(true);
      } else {
        fetchUser(false);
      }
    } else {
      // Logout
      localStorage.removeItem("clerkUserId");

      setIsOwner(false);
      setShowHotelReg(false);
      setUserLoading(false);

      isFirstLogin.current = false;
    }
  }, [user, isLoaded]);

  // ---------------- FETCH ROOMS EFFECT ----------------
  useEffect(() => {
    fetchRooms();
  }, []);

  // ---------------- OWNER EFFECT ----------------
  useEffect(() => {
    if (isOwner) {
      setShowHotelReg(false);
    }
  }, [isOwner]);

  const value = {
    backendUrl,
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