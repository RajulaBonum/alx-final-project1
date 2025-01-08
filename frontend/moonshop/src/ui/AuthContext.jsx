import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import api from "../apis/api";

export const AuthContext = createContext();



export function AuthProvider({ children }) {
    //const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const token = localStorage.getItem("access");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const isTokenValid = decoded.exp * 1000 > Date.now(); // Check token expiry
                return isTokenValid;
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
        return false;
    });
    
    const [username, setUsername] = useState("");
    const token = localStorage.getItem("access");

    // Helper function to decode the token and check its validity
    const handleAuth = (token) => {
        if (!token) {
            setIsAuthenticated(false);
            return null;
        }
        try {
            const decoded = jwtDecode(token);
            const expiryDate = decoded.exp * 1000; // Convert to milliseconds
            const currentTime = Date.now();
            if (expiryDate > currentTime) {
                setIsAuthenticated(true);
                return expiryDate; // Return expiration time
            }
        } catch (error) {
            console.error("Error decoding token:", error);
        }
        setIsAuthenticated(false);
        return null;
    };
    

    // Fetch username for authenticated users
    const getUsername = () => {
        if (isAuthenticated) {
            api.get("get_username")
                .then((res) => setUsername(res.data.username))
                .catch((err) => {
                    if (err.response?.status === 401) {
                        console.error("Unauthorized. Logging out...");
                        onLogout();
                    } else {
                        console.error("Error fetching username:", err.message);
                    }
                });
        }
    };
    

    // Logout function
    const onLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh"); // If using refresh tokens
        setIsAuthenticated(false);
        //setUsername("");
        console.log("Logged out successfully!");
    };

    // Monitor token and logout on expiration
    useEffect(() => {
        const expirationTime = handleAuth(token);
        if (expirationTime > Date.now()) {
            setIsAuthenticated(true)
        }
        else {
            onLogout()
        }
    }, [token]);

    useEffect(() => {
        getUsername();
    }, [isAuthenticated]);

    const authValue = {
        isAuthenticated,
        username,
        setIsAuthenticated,
        getUsername,
        token,
        onLogout,
    };

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
}

