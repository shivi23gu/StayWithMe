import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { backendUrl, getToken } = useAppContext();

  useEffect(() => {
    const verifyPayment = async () => {
      const bookingId = searchParams.get("bookingId");
      const sessionId = searchParams.get("sessionId");

      if (!bookingId || !sessionId) {
        toast.error("Invalid payment verification link");
        navigate("/my-bookings");
        return;
      }

      try {
        const token = await getToken();
        const { data } = await axios.post(
          `${backendUrl}/api/bookings/verify-payment`,
          { bookingId, sessionId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          toast.success("Payment verified successfully!");
        } else {
          toast.error(data.message || "Payment verification failed");
        }
      } catch (error) {
        toast.error("Something went wrong during verification");
      }

      navigate("/my-bookings");
    };

    verifyPayment();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Verifying your payment...</p>
      </div>
    </div>
  );
};

export default VerifyPayment;
