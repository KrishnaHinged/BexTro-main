"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { logoutUser } from "@/redux/userSlice";
import axiosInstance from "@/api/axios";
import MainSlideBar from "@/components/layout/MainSlideBar";
import PageLoader from "@/components/common/loaders/pagesLoader";
import ProfileTab from "@/components/features/setting_tab/ProfileTab";
import InterestsTab from "@/components/features/setting_tab/InterestsTab";
import BucketListTab from "@/components/features/setting_tab/BucketListTab";
import ChallengesTab from "@/components/features/setting_tab/ChallengesTab";
import { themes } from "@/utils/theme";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();

  const toggleTheme = () => {
    setCurrentThemeIndex((prev) => (prev + 1) % themes.length);
  };

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post("/user/logout");

      if (res.status === 200 || res.data?.success) {
        localStorage.clear();
        dispatch(logoutUser());
        toast.success(res.data?.message || "Logged out successfully!");
        router.push("/signin");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error(error.response?.data?.message || "An error occurred during logout!");
    }
  };

  const currentTheme = themes[currentThemeIndex];

  return (
    <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">
      <MainSlideBar />
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl md:text-5xl font-serif-elegant font-normal text-charcoal tracking-tight">
                Settings<span className="text-indigo-600">.</span>
              </h1>
              <button
                className="bg-white hover:bg-cream border border-cream-dark/80 p-2.5 rounded-full cursor-pointer flex items-center justify-center shadow-sm"
                onClick={toggleTheme}
                title="Toggle Theme"
              >
                {currentTheme.navbarIcon}
              </button>
            </div>

            {/* Tabs Pill Selector */}
            <div className="flex flex-wrap gap-2.5 mb-8 border-b border-cream-dark/60 pb-4">
              {["profile", "interests", "bucketlist", "challenges"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                    activeTab === tab
                      ? "bg-charcoal text-white shadow-sm font-bold"
                      : "text-charcoal/50 hover:text-charcoal hover:bg-cream/45"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "bucketlist" ? "Bucket List" : tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-cream-card border border-cream-dark/80 rounded-[2.5rem] p-6 sm:p-8 shadow-xl">
              {activeTab === "profile" && <ProfileTab onLogout={handleLogout} />}
              {activeTab === "interests" && <InterestsTab />}
              {activeTab === "bucketlist" && <BucketListTab />}
              {activeTab === "challenges" && <ChallengesTab />}
            </div>
          </div>
    </div>
  );
}
