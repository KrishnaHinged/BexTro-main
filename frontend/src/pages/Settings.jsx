import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { logoutUser } from "../redux/userSlice.js";
import axiosInstance from "../api/axios.js";
import MainSlideBar from "../components/layout/MainSlideBar.jsx";
import PageLoader from "../components/common/loaders/pagesLoader.jsx";
import ProfileTab from "../components/features/setting_tab/ProfileTab.jsx";
import InterestsTab from "../components/features/setting_tab/InterestsTab.jsx";
import BucketListTab from "../components/features/setting_tab/BucketListTab.jsx";
import ChallengesTab from "../components/features/setting_tab/ChallengesTab.jsx";

const Settings = ({ toggleTheme, currentTheme }) => {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("profile");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setStep(2), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post("/user/logout");

      if (res.status === 200 || res.data.success) {
        localStorage.clear();
        dispatch(logoutUser());
        toast.success(res.data.message || "Logged out successfully!");
        navigate("/signin");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error(error.response?.data?.message || "An error occurred during logout!");
    }
  };

  return (
    <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">
      {step === 1 && <PageLoader message="Settings..." />}
      {step === 2 && (
        <>
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
                {typeof currentTheme.navbarIcon === "string" ? (
                  <img
                    src={currentTheme.navbarIcon}
                    alt="Theme Toggle"
                    className="w-5 h-5"
                  />
                ) : (
                  <div className="w-5 h-5 flex items-center justify-center text-charcoal/70">
                    {currentTheme.navbarIcon}
                  </div>
                )}
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
        </>
      )}
    </div>
  );
};

export default Settings;