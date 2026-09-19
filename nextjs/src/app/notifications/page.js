"use client";

import React, { useState, useEffect } from "react";
import MainSlideBar from "@/components/layout/MainSlideBar";
import PageLoader from "@/components/common/loaders/pagesLoader";
import axiosInstance, { ROOT_URL } from "@/api/axios";
import { useSelector } from "react-redux";
import { formatTimeAgo } from "@/utils/dateFormatter";
import { useRouter } from "next/navigation";
import { FaHeart, FaComment, FaUserPlus, FaEnvelope, FaUsers } from "react-icons/fa";

export default function NotificationsPage() {
    const [step, setStep] = useState(1);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { socket } = useSelector(store => store.socket);
    const router = useRouter();

    const fetchNotifications = async () => {
        try {
            const res = await axiosInstance.get("/notifications");
            setNotifications(res.data || []);
        } catch (error) {
            console.error("Error fetching notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => setStep(2), 1500);
        fetchNotifications();

        if (socket) {
            socket.on("newNotification", (notif) => {
                setNotifications(prev => [notif, ...prev]);
            });
            return () => socket.off("newNotification");
        }

        return () => clearTimeout(timer);
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
            case "like": return <FaHeart className="text-rose-500 text-sm" />;
            case "comment": return <FaComment className="text-blue-500 text-sm" />;
            case "follow": return <FaUserPlus className="text-emerald-500 text-sm" />;
            case "message": return <FaEnvelope className="text-purple-500 text-sm" />;
            case "communityMessage": return <FaUsers className="text-indigo-500 text-sm" />;
            default: return null;
        }
    };

    const getMessage = (notif) => {
        switch (notif.type) {
            case "like": return "liked your post";
            case "comment": return "commented on your post";
            case "follow": return "followed you";
            case "message": return "sent you a direct message";
            case "communityMessage": return "sent a message in community";
            default: return "interacted with you";
        }
    };

    const handleNotifClick = (notif) => {
        switch (notif.type) {
            case "follow":
                if (notif.sender?._id) router.push(`/user/${notif.sender._id}`);
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
        <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">
            {step === 1 && <PageLoader message="Notifications..." />}
            {step === 2 && (
                <>
                    <MainSlideBar />
                    <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-3xl md:text-5xl font-serif-elegant font-normal text-charcoal tracking-tight">
                                Notifications<span className="text-indigo-600">.</span>
                            </h1>
                            {notifications.length > 0 && (
                                <button 
                                    onClick={markAsRead}
                                    className="bg-charcoal hover:bg-black text-white px-5 py-2.5 rounded-full font-semibold text-xs transition cursor-pointer"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center bg-cream-card border border-cream-dark/80 rounded-3xl p-8 max-w-xl mx-auto shadow-sm">
                                <div className="w-16 h-16 bg-white border border-cream-dark/60 rounded-full flex items-center justify-center text-charcoal/20 mb-6 shadow-inner">
                                    <FaHeart size={28} />
                                </div>
                                <h3 className="text-lg font-serif-elegant font-normal text-charcoal mb-2">No alerts yet</h3>
                                <p className="text-charcoal/50 text-xs sm:text-sm font-medium">Interactions and notifications will appear here!</p>
                            </div>
                        ) : (
                            <div className="max-w-3xl space-y-4">
                                {notifications.map((notif) => {
                                    const senderPhoto = notif.sender?.profilePhoto?.startsWith("http")
                                        ? notif.sender.profilePhoto
                                        : notif.sender?.profilePhoto
                                        ? `${ROOT_URL}${notif.sender.profilePhoto}`
                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(notif.sender?.username || "User")}`;

                                    return (
                                        <div 
                                            key={notif._id} 
                                            onClick={() => handleNotifClick(notif)}
                                            className={`p-5 flex items-center justify-between bg-cream-card border rounded-3xl shadow-sm hover:shadow-md transition cursor-pointer relative ${
                                                !notif.isRead 
                                                    ? 'border-indigo-600/35 bg-indigo-50/10' 
                                                    : 'border-cream-dark/80'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="relative shrink-0">
                                                    <img 
                                                        src={senderPhoto} 
                                                        alt={notif.sender?.username || "User"} 
                                                        className="w-12 h-12 rounded-xl object-cover border border-cream-dark shadow-sm" 
                                                        onError={(e) => {
                                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(notif.sender?.username || "User")}`;
                                                        }}
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 bg-white border border-cream-dark p-1 rounded-full shadow-sm flex items-center justify-center">
                                                        {getIcon(notif.type)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-charcoal leading-snug">
                                                        <span className="font-bold">@{notif.sender?.username || "User"}</span>{" "}
                                                        {getMessage(notif)}
                                                    </p>
                                                    {notif.post && (
                                                        <p className="text-charcoal/50 italic text-xs mt-1 truncate max-w-md">
                                                            "{notif.post.challengeText}"
                                                        </p>
                                                    )}
                                                    <span className="text-[10px] text-charcoal/40 font-semibold mt-1.5 block">
                                                        {formatTimeAgo(notif.createdAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            {!notif.isRead && (
                                                <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full shrink-0 shadow-sm shadow-indigo-600/30"></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
