"use client";

import React from "react";
import { formatTimeAgo } from "@/utils/dateFormatter";
import Avatar from "@/components/ui/Avatar";
import { 
  FaHeart, 
  FaComment, 
  FaUserPlus, 
  FaEnvelope, 
  FaUsers 
} from "react-icons/fa";

export default function NotificationItem({ notification, onClick }) {
  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <FaHeart className="text-rose-500 text-xs" />;
      case "comment":
        return <FaComment className="text-blue-500 text-xs" />;
      case "follow":
        return <FaUserPlus className="text-emerald-500 text-xs" />;
      case "message":
        return <FaEnvelope className="text-purple-500 text-xs" />;
      case "communityMessage":
        return <FaUsers className="text-indigo-500 text-xs" />;
      default:
        return null;
    }
  };

  const getMessage = (notif) => {
    switch (notif.type) {
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "follow":
        return "followed you";
      case "message":
        return "sent you a direct message";
      case "communityMessage":
        return "sent a message in community";
      default:
        return "interacted with you";
    }
  };

  const senderName = notification.sender?.username || "User";

  return (
    <div
      onClick={() => onClick(notification)}
      className={`p-5 flex items-center justify-between bg-cream-card border rounded-[2rem] shadow-xs hover:shadow-md transition-all cursor-pointer relative font-sans-clean ${
        !notification.isRead
          ? "border-indigo-600/35 bg-indigo-50/10"
          : "border-cream-dark/80"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <Avatar
            src={notification.sender?.profilePhoto}
            name={senderName}
            size="lg"
            className="rounded-2xl"
          />
          <div className="absolute -bottom-1 -right-1 bg-white border border-cream-dark p-1 rounded-full shadow-2xs flex items-center justify-center">
            {getIcon(notification.type)}
          </div>
        </div>

        <div>
          <p className="text-sm text-charcoal leading-snug">
            <span className="font-bold">@{senderName}</span>{" "}
            {getMessage(notification)}
          </p>
          {notification.post && (
            <p className="text-charcoal/50 italic text-xs mt-1 truncate max-w-md">
              &quot;{notification.post.challengeText}&quot;
            </p>
          )}
          <span className="text-[10px] text-charcoal/40 font-semibold mt-1.5 block">
            {formatTimeAgo(notification.createdAt)}
          </span>
        </div>
      </div>

      {!notification.isRead && (
        <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full shrink-0 shadow-xs shadow-indigo-600/30" />
      )}
    </div>
  );
}
