import React, { useState, useEffect } from 'react';
import api from '../apis/api';

// Custom hook for user data
const useUserData = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    address: "",
    city: "",
    phone: "",
  });

  useEffect(() => {
    api
      .get("get_user_profile")
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err.message);
      });
  }, []);

  return { userInfo, setUserInfo };
};

export default useUserData;
