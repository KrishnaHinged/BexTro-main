"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { toast, Toaster } from "react-hot-toast";
import { setSocket, setOnlineUsers } from "@/redux/socketSlice";
import { setOnlineUser } from "@/redux/userSlice";
import { ROOT_URL } from "@/api/axios";

export default function SocketProvider({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated, authUser } = useSelector((state) => state.user);

  useEffect(() => {
    const userId = authUser?._id;
    if (isAuthenticated && userId) {
      // Create a single clean socket connection; do not reconnect in loop if backend is offline
      const socket = io(ROOT_URL, {
        withCredentials: true,
        query: { userId },
        transports: ["polling", "websocket"],
        reconnection: false,
        timeout: 1500,
        autoConnect: true,
      });

      dispatch(setSocket(socket));

      socket.on("connect", () => {
        // Connected successfully
      });

      socket.on("onlineUsers", (onlineUsers) => {
        dispatch(setOnlineUser(onlineUsers));
        dispatch(setOnlineUsers(onlineUsers));
      });

      socket.on("newNotification", (notification) => {
        const senderName = notification?.sender?.username || "Someone";
        const message =
          notification.type === "follow"
            ? `${senderName} followed you!`
            : notification.type === "like"
            ? `${senderName} liked your post!`
            : notification.type === "comment"
            ? `${senderName} commented on your post!`
            : notification.type === "message"
            ? `New message from ${senderName}!`
            : `New notification from ${senderName}!`;

        toast.success(message, {
          icon: "🔔",
          duration: 4000,
          position: "top-right",
        });
      });

      socket.on("connect_error", () => {
        // Backend socket port offline: close cleanly without logging or re-trying
        try {
          socket.close();
        } catch (_) {}
      });

      return () => {
        try {
          socket.disconnect();
        } catch (_) {}
        dispatch(setSocket(null));
      };
    }
  }, [isAuthenticated, authUser?._id, dispatch]);

  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
}
