"use client";

import React, { useState, useEffect, Suspense } from "react";
import AdminSlideBar from "@/components/features/admin/AdminSlideBar";
import Chat_SlideBar from "@/components/features/chats/chat_SlideBar";
import MessageContainer from "@/components/features/chats/messageContainer";

function AdminChatContent() {
    const [isMobile, setIsMobile] = useState(false);
    const [showChatList, setShowChatList] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setShowChatList(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleChatList = () => {
        setShowChatList(!showChatList);
    };

    return (
        <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">
            <AdminSlideBar />
            <div className="flex-1 p-6 md:p-10 flex flex-col h-screen">
                <div className="flex items-center justify-between mb-8 shrink-0">
                    <h1 className="text-3xl md:text-5xl font-serif-elegant font-normal text-charcoal tracking-tight">
                        Admin Chats<span className="text-indigo-600">.</span>
                    </h1>
                    {isMobile && (
                        <button 
                            onClick={toggleChatList}
                            className="bg-charcoal hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
                        >
                            {showChatList ? 'Hide List' : 'Show List'}
                        </button>
                    )}
                </div>
                
                <div className="flex flex-1 rounded-[2.5rem] bg-cream-card border border-cream-dark/80 overflow-hidden shadow-xl min-h-0 relative">
                    {/* Chat List Sidebar */}
                    {(showChatList || !isMobile) && (
                        <div className={`${isMobile ? 'w-full absolute z-10 h-full' : 'w-full md:w-1/3'} border-r border-cream-dark/65 flex-shrink-0 bg-cream-card md:relative h-full flex flex-col`}>
                            <Chat_SlideBar 
                                onSelectChat={isMobile ? () => setShowChatList(false) : null}
                            />
                        </div>
                    )}
                    
                    {/* Message Container */}
                    <div className={`${isMobile && showChatList ? 'hidden' : 'flex'} flex-1 flex-col h-full bg-cream-card min-w-0`}>
                        <MessageContainer />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminChat() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading chat...</div>}>
            <AdminChatContent />
        </Suspense>
    );
}
