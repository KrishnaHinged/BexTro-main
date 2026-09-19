"use client";

import { useEffect, useState } from 'react';
import axiosInstance from "@/api/axios";
import { useDispatch, useSelector } from 'react-redux';
import { setOtherUser } from "@/redux/userSlice"; 

export default function useGetOtherUsers() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
  
    const fetchOtherUsers = async () => {
      if (!isAuthenticated) return;
  
      setLoading(true);
      setError(null);
      try {
        const [userRes, commRes] = await Promise.all([
          axiosInstance.get("/user/users", { signal: controller.signal }),
          axiosInstance.get("/communities/my-communities", { signal: controller.signal })
        ]);

        const communityList = commRes.data.map(c => ({
            _id: c._id,
            fullName: c.name,
            username: `${c.memberCount} Members`,
            profilePhoto: c.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=6366f1&color=fff`,
            isCommunity: true
        }));

        dispatch(setOtherUser([...communityList, ...userRes.data]));
      } catch (error) {
        if (axiosInstance.isCancel && axiosInstance.isCancel(error)) {
          console.log('Request cancelled', error.message);
        } else {
          console.error('Error fetching other users:', error);
          setError(error.response?.data?.message || 'Failed to fetch other users');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchOtherUsers();
  
    return () => controller.abort();
  
  }, [dispatch, isAuthenticated]);
  
  return { loading, error };
}
