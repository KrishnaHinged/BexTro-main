import React, { useState, useEffect } from "react";
import MainSlideBar from "../components/layout/MainSlideBar.jsx";
import Chat_SlideBar from "../components/features/chats/chat_SlideBar.jsx";
import PageLoader from "../components/common/loaders/pagesLoader.jsx";
import MessageContainer from "../components/features/chats/messageContainer.jsx";

const Chat = () => {
    const [step, setStep] = useState(1);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showChatList, setShowChatList] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setStep(2), 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setShowChatList(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleChatList = () => {
        setShowChatList(!showChatList);
    };

    return (
        <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">
            {step === 1 ? (
                <PageLoader message="Chats..." />
            ) : (
                <div className="flex w-full animate-fadeIn">
                    <MainSlideBar />
                    <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-3xl md:text-5xl font-serif-elegant font-normal text-charcoal tracking-tight">
                                Chats<span className="text-indigo-600">.</span>
                            </h1>
                            {isMobile && (
                                <button
                                    onClick={toggleChatList}
                                    className="md:hidden bg-charcoal hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                                >
                                    {showChatList ? 'Hide List' : 'Show List'}
                                </button>
                            )}
                        </div>
                        <div className="flex h-[calc(100vh-14rem)] rounded-3xl shadow-lg border border-cream-dark/80 bg-cream-card overflow-hidden">
                            {(showChatList || !isMobile) && (
                                <div className={`${isMobile ? 'w-full absolute z-10' : 'w-1/3'} border-r border-cream-dark/70 flex-shrink-0 bg-cream-card md:relative h-full`}>
                                    <Chat_SlideBar onSelectChat={isMobile ? () => setShowChatList(false) : null} />
                                </div>
                            )}
                            <div className={`${isMobile && showChatList ? 'hidden' : 'flex-1'} p-2 overflow-y-auto bg-cream-card`}>
                                <MessageContainer />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;