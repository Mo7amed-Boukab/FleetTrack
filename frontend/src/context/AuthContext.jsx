import { createContext, useState, useEffect, useContext } from "react";
import axios from "../axios";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await axios.post("/auth/login", credentials);
      console.log("Réponse de connexion :", response.data);
      const { token: authToken, user: userData } = response.data;

      // Mettre à jour States
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);

      // Sauvegarde data dans localStorage
      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      console.error("Erreur lors de la connexion :", error.response?.data?.message || error.message );
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de connexion",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout }} >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
