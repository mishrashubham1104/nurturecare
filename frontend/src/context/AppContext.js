import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { API_BASE } from "../constants";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [services, setServices] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const fetchServices = useCallback(async () => {
    if (services.length) return;
    const { data } = await axios.get(`${API_BASE}/services`);
    setServices(data);
  }, [services.length]);

  const fetchCaregivers = useCallback(async () => {
    if (caregivers.length) return;
    const { data } = await axios.get(`${API_BASE}/caregivers`);
    setCaregivers(data);
  }, [caregivers.length]);

  const fetchTestimonials = useCallback(async () => {
    if (testimonials.length) return;
    const { data } = await axios.get(`${API_BASE}/testimonials`);
    /* backend returns { success: true, data: [...] } */
    const arr = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    setTestimonials(arr);
  }, [testimonials.length]);

  const fetchPricing = useCallback(async () => {
    if (pricing.length) return;
    const { data } = await axios.get(`${API_BASE}/pricing`);
    setPricing(data);
  }, [pricing.length]);

  const submitBooking = async (formData) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/bookings`, formData);
      setBookingSuccess(data);
      return data;
    } finally { setLoading(false); }
  };

  const submitContact = async (formData) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/contact`, formData);
      return data;
    } finally { setLoading(false); }
  };

  return (
    <AppContext.Provider value={{ services, caregivers, testimonials, pricing, loading, bookingSuccess, setBookingSuccess, fetchServices, fetchCaregivers, fetchTestimonials, fetchPricing, submitBooking, submitContact }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);