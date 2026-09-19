"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiActivity, FiLogOut } from "react-icons/fi";
import { FaUsers, FaCog, FaFlag, FaStream, FaComment, FaBullseye, FaTrophy } from "react-icons/fa";
import { motion } from "framer-motion";

const AdminSlideBar = ({ onLogout, setActiveSection, currentTheme }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [active, setActive] = useState("users");

  const menuItems = [
    { id: "users", label: "Users", icon: <FaUsers size={18} />, section: "users" },
    { id: "goals", label: "Goals & Trajectories", icon: <FaBullseye size={18} />, section: "goals" },
    { id: "challenges", label: "Challenges", icon: <FaTrophy size={18} />, section: "challenges" },
    { id: "posts", label: "Posts & Proofs", icon: <FaStream size={18} />, section: "posts" },
    { id: "reports", label: "Reports", icon: <FaFlag size={18} />, section: "reports" },
    { id: "analytics", label: "Analytics", icon: <FiActivity size={18} />, section: "analytics" },
    { id: "chat", label: "Chat", icon: <FaComment size={18} />, path: "/adminchats" },
    { id: "settings", label: "Settings", icon: <FaCog size={18} />, section: "settings" },
    { id: "logout", label: "Logout", icon: <FiLogOut size={18} />, section: null },
  ];

  useEffect(() => {
    const currentPath = pathname || "";
    const section = searchParams?.get("section");

    let activeItem;

    if (currentPath === "/admindashboard" && section) {
      activeItem = menuItems.find((item) => item.section === section);
    } else {
      activeItem = menuItems.find((item) => item.path === currentPath || `/admin/${item.section}` === currentPath);
    }

    if (activeItem) {
      setActive(activeItem.id);
      if (activeItem.section && setActiveSection) {
        setActiveSection(activeItem.section);
      }
    } else {
      setActive("users");
      if (setActiveSection) {
        setActiveSection("users");
      }
    }
  }, [pathname, searchParams, setActiveSection]);

  const handleClick = (id, section, path) => {
    setActive(id);
    if (id === "logout") {
      if (onLogout) onLogout();
    } else if (path) {
      router.push(path);
    } else {
      router.push(`/admindashboard?section=${section}`);
    }
  };

  return (
    <div className="bg-cream-card border-r border-cream-dark/65 h-screen w-20 sticky top-0 py-8 z-50 flex flex-col justify-between items-center font-sans-clean shadow-sm">
      <div className="flex flex-col gap-6 items-center w-full">
        {/* LOGO */}
        <div className="text-xl font-serif-elegant font-bold text-charcoal mb-2 cursor-pointer" onClick={() => router.push("/")}>
          A<span className="text-indigo-600">.</span>
        </div>

        {/* NAVIGATION ITEMS */}
        <div className="flex flex-col gap-3.5 items-center w-full px-2">
          {menuItems.map(({ id, label, icon, section, path }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(id, section, path)}
              className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 cursor-pointer border-none outline-none ${
                active === id
                  ? "bg-charcoal text-white shadow-md"
                  : "text-charcoal/40 hover:text-charcoal hover:bg-cream/50 bg-transparent"
              }`}
              title={label}
              aria-label={label}
            >
              {icon}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSlideBar;
