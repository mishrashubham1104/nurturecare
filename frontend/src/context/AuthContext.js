
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../constants";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("nurturecare_user");
    const token = localStorage.getItem("nurturecare_token");
    if (saved && token) {
      setUser(JSON.parse(saved));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });
    localStorage.setItem("nurturecare_user",  JSON.stringify(data.user));
    localStorage.setItem("nurturecare_token", data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, phone, role = "patient") => {
    const { data } = await axios.post(`${API_BASE}/auth/register`, { name, email, password, phone, role });
    localStorage.setItem("nurturecare_user",  JSON.stringify(data.user));
    localStorage.setItem("nurturecare_token", data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("nurturecare_user");
    localStorage.removeItem("nurturecare_token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
