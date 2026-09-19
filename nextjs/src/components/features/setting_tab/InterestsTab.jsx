"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/redux/userSlice";
import axiosInstance from "@/api/axios";

export default function InterestsTab() {
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await axiosInstance.get("/userdata/interests");
        setInterests(response.data.interests || []);
      } catch (error) {
        console.error("Fetch Interests Error:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          dispatch(logoutUser());
          router.push("/signin");
          return;
        }
        toast.error("Failed to load interests!");
      }
    };
    fetchInterests();
  }, [router, dispatch]);

  const handleAddInterest = async () => {
    const trimmedInterest = newInterest.trim();
    if (!trimmedInterest) {
      return toast.error("Interest cannot be empty!");
    }
    if (interests.includes(trimmedInterest)) {
      return toast.error("This interest already exists!");
    }
    try {
      const response = await axiosInstance.post("/userdata/interests", {
        interest: trimmedInterest,
        action: "add"
      });
      setInterests([...interests, trimmedInterest]);
      setNewInterest("");
      toast.success(response.data.message || "Interest added!");
    } catch (error) {
      console.error("Add Interest Error:", error);
      toast.error(error.response?.data?.error || "Failed to add interest!");
    }
  };

  const handleRemoveInterest = async (interest) => {
    try {
      const response = await axiosInstance.post("/userdata/interests", {
        interest,
        action: "remove"
      });
      setInterests(interests.filter((i) => i !== interest));
      toast.success(response.data.message || "Interest removed!");
    } catch (error) {
      console.error("Remove Interest Error:", error);
      toast.error(error.response?.data?.error || "Failed to remove interest!");
    }
  };

  return (
    <div className="font-sans-clean">
      <h2 className="text-xl font-serif-elegant font-normal text-charcoal mb-6">Interests</h2>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          placeholder="Add a new interest"
          className="flex-1 p-3.5 bg-white border border-cream-dark/85 rounded-xl text-charcoal placeholder-charcoal/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium"
        />
        <button
          onClick={handleAddInterest}
          className="px-6 py-2 bg-charcoal hover:bg-black text-white text-xs font-semibold rounded-full shadow-sm transition cursor-pointer border-none outline-none"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {interests.map((interest) => (
          <div
            key={interest}
            className="bg-white border border-cream-dark/80 text-charcoal text-xs px-3.5 py-1.5 rounded-full flex items-center shadow-sm"
          >
            {interest}
            <button
              onClick={() => handleRemoveInterest(interest)}
              className="ml-2 text-rose-500 hover:text-rose-700 text-sm cursor-pointer font-bold select-none bg-transparent border-none outline-none"
            >
              ×
            </button>
          </div>
        ))}
        {interests.length === 0 && (
          <p className="text-charcoal/40 text-xs italic font-medium">No interests selected yet.</p>
        )}
      </div>
    </div>
  );
}
