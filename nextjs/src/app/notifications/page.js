"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FaHeart } from "react-icons/fa";
import axiosInstance from "@/api/axios";
import MainSlideBar from "@/components/layout/MainSlideBar";
import PageLoader from "@/components/common/loaders/pagesLoader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import NotificationItem from "@/components/features/notifications/NotificationItem";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSelector((store) => store.socket);
  const router = useRouter();

  useEffect(() => {
    let isCancelled = false;
    async function fetchNotifications() {
      try {
        const res = await axiosInstance.get("/notifications");
        if (!isCancelled) {
          setNotifications(res.data || []);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Error fetching notifications", error);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }
    fetchNotifications();

    if (socket) {
      const handleNewNotification = (notif) => {
        setNotifications((prev) => [notif, ...prev]);
      };
      socket.on("newNotification", handleNewNotification);
      return () => {
        isCancelled = true;
        socket.off("newNotification", handleNewNotification);
      };
    }
    return () => {
      isCancelled = true;
    };
  }, [socket]);

  const markAsRead = async () => {
    try {
      await axiosInstance.put("/notifications/read", {});
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking as read", error);
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
      <MainSlideBar />
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex items-center justify-between mb-8 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-serif-elegant font-normal text-charcoal tracking-tight">
            Notifications<span className="text-indigo-600">.</span>
          </h1>
          {notifications.length > 0 && (
            <Button variant="primary" size="sm" onClick={markAsRead}>
              Mark all as read
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <PageLoader message="Loading alerts..." />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={<FaHeart />}
            title="No alerts yet"
            description="Interactions, milestone celebrations, and connection requests will appear here!"
          />
        ) : (
          <div className="max-w-3xl space-y-3.5">
            {notifications.map((notif) => (
              <NotificationItem
                key={notif._id}
                notification={notif}
                onClick={handleNotifClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
