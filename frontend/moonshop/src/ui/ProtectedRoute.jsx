import React, { useEffect, useState } from 'react'
import api from '../apis/api'
import {jwtDecode} from 'jwt-decode'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const location = useLocation();

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) {
            setIsAuthorized(false);
            return;
        }

        try {
            const res = await api.post("/token/refresh/", { refresh: refreshToken });
            if (res.status === 200) {
                localStorage.setItem("access", res.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (err) {
            setIsAuthorized(false);
        }
    };

    const auth = async () => {
        const token = localStorage.getItem("access");
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const expiry_time = decoded.exp * 1000; // Convert to milliseconds
            const current_time = Date.now();

            if (expiry_time < current_time) {
                await refreshToken();
            } else {
                setIsAuthorized(true);
            }
        } catch (err) {
            console.error("Token validation error:", err);
            setIsAuthorized(false);
        }
    };

    if (isAuthorized === null) {
        return <div className="spinner">Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
