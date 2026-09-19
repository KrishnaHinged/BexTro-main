"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/api/axios";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaHeart, FaComment, FaUserPlus, FaTimes, FaEnvelope, FaUsers } from "react-icons/fa";
import { formatTimeAgo } from "@/utils/dateFormatter";
import { useRouter } from "next/navigation";

export default function NotificationTray({ onClose }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { socket } = useSelector(store => store.socket);
    const router = useRouter();

    const fetchNotifications = async () => {
        try {
            const res = await axiosInstance.get("/notifications");
            setNotifications(res.data);
        } catch (error) {
            console.error("Error fetching notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();

        if (socket) {
            socket.on("newNotification", (notif) => {
                setNotifications(prev => [notif, ...prev]);
            });
            return () => socket.off("newNotification");
        }
    }, [socket]);

    const markAsRead = async () => {
        try {
            await axiosInstance.put("/notifications/read", {});
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Error marking as read", error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "like": return <FaHeart className="text-red-500 text-xs" />;
            case "comment": return <FaComment className="text-blue-500 text-xs" />;
            case "follow": return <FaUserPlus className="text-green-500 text-xs" />;
            case "message": return <FaEnvelope className="text-purple-500 text-xs" />;
            case "communityMessage": return <FaUsers className="text-indigo-500 text-xs" />;
            default: return null;
        }
    };

    const getMessage = (notif) => {
        switch (notif.type) {
            case "like": return "liked your post";
            case "comment": return "commented on your post";
            case "follow": return "followed you";
            case "message": return "sent you a DM";
            case "communityMessage": return "messaged in community";
            default: return "interacted with you";
        }
    };

    const handleNotifClick = (notif) => {
        onClose();
        switch (notif.type) {
            case "follow":
                router.push(`/user/${notif.sender._id}`);
                break;
            case "message":
                router.push("/chats");
                break;
            case "communityMessage":
                router.push("/communities");
                break;
            case "like":
            case "comment":
                router.push("/feed");
                break;
            default:
                break;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            className="w-80 h-[480px] bg-cream-card border border-cream-dark/80 rounded-[2.2rem] shadow-2xl flex flex-col overflow-hidden z-[110] font-sans-clean"
        >
            <div className="p-4 border-b border-cream-dark/60 flex items-center justify-between bg-white">
                <h3 className="text-sm font-bold text-charcoal">Notifications</h3>
                <div className="flex gap-2">
                    <button 
                        onClick={markAsRead} 
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold uppercase tracking-wider cursor-pointer"
                    >
                        Mark read
                    </button>
                    <button 
                        onClick={onClose} 
                        className="text-charcoal/30 hover:text-charcoal cursor-pointer text-xs p-0.5"
                    >
                        <FaTimes />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 bg-cream-card">
                        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center gap-3 bg-cream-card">
                        <div className="w-12 h-12 bg-white border border-cream-dark/60 rounded-full flex items-center justify-center text-charcoal/20 shadow-inner">
                           <FaHeart size={20} />
                        </div>
                        <p className="text-xs text-charcoal/50 font-medium max-w-[180px] leading-relaxed">No notifications yet. Interactions will show here!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-cream-dark/50">
                        {notifications.map((notif) => (
                            <div 
                                key={notif._id} 
                                onClick={() => handleNotifClick(notif)}
                                className={`p-4 flex gap-3 hover:bg-cream/40 transition cursor-pointer relative ${!notif.isRead ? 'bg-indigo-50/10' : ''}`}
                            >
                                <div className="relative shrink-0">
                                    <img 
                                        src={notif.sender.profilePhoto || `https://ui-avatars.com/api/?name=${notif.sender.username || "User"}`} 
                                        alt={notif.sender.username} 
                                        className="w-10 h-10 rounded-xl object-cover border border-cream-dark shadow-sm" 
                                        onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${notif.sender.username || "User"}`}
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-white border border-cream-dark p-0.5 rounded-full shadow-sm">
                                        {getIcon(notif.type)}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-charcoal leading-snug">
                                        <span className="font-bold">@{notif.sender.username}</span>{" "}
                                        {getMessage(notif)}
                                        {notif.post && (
                                            <span className="text-charcoal/50 italic truncate block text-[10px] mt-0.5">
                                                "{notif.post.challengeText}"
                                            </span>
                                        )}
                                    </p>
                                    <span className="text-[9px] text-charcoal/45 font-semibold mt-1 block">
                                        {formatTimeAgo(notif.createdAt)}
                                    </span>
                                </div>
                                {!notif.isRead && (
                                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full shrink-0 mt-2.5"></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
