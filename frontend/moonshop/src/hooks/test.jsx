import { jwtDecode } from "jwt-decode"; // Correct import
import { createContext, useEffect, useState } from "react";
import api from "../apis/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const token = localStorage.getItem("access");

    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            const expiryDate = decoded.exp * 1000;
            return expiryDate > Date.now() ? decoded : null;
        } catch {
            return null;
        }
    };

    const onLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setIsAuthenticated(false);
    };

    const getUsername = async () => {
        if (isAuthenticated) {
            try {
                const res = await api.get("get_username");
                setUsername(res.data.username);
            } catch (err) {
                console.error(err.message);
                if (err.response?.status === 401) onLogout();
            }
        }
    };

    useEffect(() => {
        const decoded = decodeToken(token);
        if (decoded) setIsAuthenticated(true);
        else onLogout();
    }, [token]);

    useEffect(() => {
        getUsername();
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, onLogout }}>
            {children}
        </AuthContext.Provider>
    );
}