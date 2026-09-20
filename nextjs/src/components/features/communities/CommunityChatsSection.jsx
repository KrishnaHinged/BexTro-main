"use client";

import React from "react";
import Chat_SlideBar from "@/components/features/chats/chat_SlideBar";
import MessageContainer from "@/components/features/chats/messageContainer";

export default function CommunityChatsSection({ isMobile, showChatList }) {
  return (
    <div className="flex h-[calc(100vh-14rem)] rounded-[2.5rem] shadow-lg border border-cream-dark/80 bg-cream-card overflow-hidden">
      {(showChatList || !isMobile) && (
        <div
          className={`${
            isMobile ? "w-full absolute z-10" : "w-1/3"
          } border-r border-cream-dark/70 shrink-0 bg-cream-card md:relative h-full`}
        >
          <Chat_SlideBar />
        </div>
      )}
      <div
        className={`${
          isMobile && showChatList ? "hidden" : "flex-1"
        } p-2 overflow-y-auto bg-cream-card`}
      >
        <MessageContainer />
      </div>
    </div>
  );
}
