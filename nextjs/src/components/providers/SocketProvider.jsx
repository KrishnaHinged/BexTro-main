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
    if (isAuthenticated && authUser?._id) {
      const socket = io(ROOT_URL, {
        withCredentials: true,
        query: { userId: authUser._id },
        transports: ["websocket", "polling"],
      });

      dispatch(setSocket(socket));

      socket.on("connect", () => {
        console.log("Connected to Socket.IO server");
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

      socket.on("connect_error", (error) => {
        // Socket connection may fail silently if backend socket server is offline
        console.warn("Socket.IO connection notice:", error.message);
      });

      return () => {
        socket.disconnect();
        dispatch(setSocket(null));
      };
    }
  }, [isAuthenticated, authUser, dispatch]);

  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
}
