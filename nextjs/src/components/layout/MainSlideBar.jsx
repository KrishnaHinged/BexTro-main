"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaHome, FaCog, FaGlobe, FaUsers, FaBell, FaBullseye, FaBrain } from "react-icons/fa";
import NotificationTray from "../features/notifications/NotificationTray";

export default function MainSlideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { authUser } = useSelector(store => store.user);
  const { socket } = useSelector(store => store.socket);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (socket) {
        socket.on("newNotification", () => {
            setUnreadCount(prev => prev + 1);
        });
        return () => socket.off("newNotification");
    }
  }, [socket]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome size={20} />, path: "/dashboard" },
    { id: "goals", label: "Goals & Trajectory", icon: <FaBullseye size={20} />, path: "/goals" },
    { id: "growth-twin", label: "Digital Twin", icon: <FaBrain size={20} />, path: "/growth-twin" },
    { id: "feed", label: "Feed", icon: <FaGlobe size={20} />, path: "/feed" },
    { id: "communities", label: "Communities", icon: <FaUsers size={20} />, path: "/communities" },
  ];

  const currentPath = pathname || "";
  const activeItem = menuItems.find((item) => item.path === currentPath || (item.path !== "/dashboard" && currentPath.startsWith(item.path)));
  const active = activeItem 
    ? activeItem.id 
    : currentPath.startsWith("/user/") 
      ? "feed" 
      : currentPath === "/profile" 
        ? "profile" 
        : currentPath === "/settings" 
          ? "settings" 
          : "dashboard";


  const profilePhotoUrl = authUser?.profilePhoto || `https://ui-avatars.com/api/?name=${authUser?.username || "User"}`;

  return (
    <div className="bg-cream-card border-r border-cream-dark/65 h-screen w-20 sticky top-0 py-10 z-50 flex flex-col justify-between items-center font-sans-clean">
      
      {/* TOP MENU */}
      <div className="flex flex-col gap-8 items-center w-full">
        {/* LOGO */}
        <div className="text-xl font-serif-elegant font-bold text-charcoal mb-4 cursor-pointer" onClick={() => router.push("/")}>
          B<span className="text-indigo-600">.</span>
        </div>

        {/* NAVIGATION ITEMS */}
        <div className="flex flex-col gap-5 items-center w-full px-2">
          {menuItems.map(({ id, label, icon, path }) => (
            <button
              key={id}
              onClick={() => {
                setShowNotifications(false);
                router.push(path);
              }}
              className={`transition-all duration-300 rounded-2xl p-3.5 flex items-center justify-center cursor-pointer border-none outline-none ${
                active === id
                  ? "bg-charcoal text-white shadow-md scale-105"
                  : "text-charcoal/40 hover:text-charcoal hover:bg-cream/50 bg-transparent"
              }`}
              title={label}
            >
              {icon}
            </button>
          ))}

          {/* NOTIFICATION BELL */}
          <div className="relative w-full flex justify-center">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setUnreadCount(0);
              }}
              className={`transition-all duration-300 rounded-2xl p-3.5 flex items-center justify-center cursor-pointer border-none outline-none ${
                showNotifications
                  ? "bg-indigo-600 text-white shadow-md scale-105"
                  : "text-charcoal/40 hover:text-charcoal hover:bg-cream/50 bg-transparent"
              }`}
              title="Notifications"
            >
              <FaBell size={22} />
            </button>
            {unreadCount > 0 && (
              <div className="absolute top-0.5 right-2 bg-indigo-600 text-white text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full border border-white font-bold">
                {unreadCount}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NOTIFICATION TRAY POSITIONING */}
      {showNotifications && (
        <div className="absolute left-24 top-20 z-50">
          <NotificationTray onClose={() => setShowNotifications(false)} />
        </div>
      )}

      {/* BOTTOM USER PROFILE + SETTINGS (PILL STYLE) */}
      <div className="flex flex-col items-center w-full px-3">
        <div className="bg-cream border border-cream-dark/60 rounded-[2.2rem] py-3.5 px-2 flex flex-col items-center gap-4 w-full shadow-sm">
          
          {/* STREAK */}
          {authUser?.currentStreak > 0 && (
            <div className="flex flex-col items-center cursor-default" title={`🔥 ${authUser.currentStreak} Day Streak`}>
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-lg"
              >
                🔥
              </motion.div>
              <span className="text-[10px] font-bold text-charcoal -mt-1 tracking-tighter">
                {authUser.currentStreak}
              </span>
            </div>
          )}

          {/* PROFILE PHOTO */}
          <div
            onClick={() => {
              router.push("/profile");
            }}
            className="relative cursor-pointer group"
          >
            <img
              src={profilePhotoUrl}
              alt="User"
              onError={(e) =>
                (e.target.src = `https://ui-avatars.com/api/?name=${authUser?.username || "User"}`)
              }
              className={`w-10 h-10 rounded-2xl object-cover border transition ${
                active === "profile"
                  ? "border-charcoal scale-105"
                  : "border-cream-dark/80 group-hover:border-charcoal"
              }`}
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full"></div>
          </div>

          {/* SETTINGS */}
          <button
            onClick={() => {
              router.push("/settings");
            }}
            className={`transition-all duration-200 rounded-xl p-2 cursor-pointer border-none outline-none ${
              active === "settings"
                ? "bg-charcoal text-white shadow-sm scale-105"
                : "text-charcoal/40 hover:text-charcoal bg-transparent"
            }`}
            title="Settings"
          >
            <FaCog size={16} />
          </button>

        </div>
      </div>

    </div>
  );
}
