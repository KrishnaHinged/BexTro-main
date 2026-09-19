"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/api/axios";
import MainSlideBar from "@/components/layout/MainSlideBar";
import PageLoader from "@/components/common/loaders/pagesLoader";
import Chat_SlideBar from "@/components/features/chats/chat_SlideBar";
import MessageContainer from "@/components/features/chats/messageContainer";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { motion, AnimatePresence } from "framer-motion";

export default function Community() {
    const [communities, setCommunities] = useState([]);
    const [myCommunities, setMyCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("communities");
    const [isMobile, setIsMobile] = useState(false);
    const [showChatList, setShowChatList] = useState(true);

    const [showCreate, setShowCreate] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState("");

    const fetchCommunities = async () => {
        setLoading(true);
        try {
            const exploreRes = await axiosInstance.get("/communities/explore");
            const myRes = await axiosInstance.get("/communities/my-communities");
            
            setCommunities(exploreRes.data);
            setMyCommunities(myRes.data);
        } catch (error) {
            console.error("Error fetching communities", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommunities();
        
        if (typeof window !== "undefined") {
            setIsMobile(window.innerWidth < 768);
            const handleResize = () => {
                setIsMobile(window.innerWidth < 768);
                if (window.innerWidth >= 768) {
                    setShowChatList(true);
                }
            };
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            if (photoFile) formData.append("profilePhoto", photoFile);

            await axiosInstance.post(
                "/communities/create",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setShowCreate(false);
            setName("");
            setDescription("");
            setPhotoFile(null);
            setPhotoPreview("");
            fetchCommunities();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to create community");
        }
    };

    const handleJoin = async (id) => {
        try {
            await axiosInstance.post(`/communities/join/${id}`, {});
            fetchCommunities();
            alert("Joined successfully!");
        } catch (error) {
            console.error(error);
        }
    };

    const toggleChatList = () => {
        setShowChatList(!showChatList);
    };

    if (loading) return <PageLoader message="Loading Communities..." />;

    return (
        <ErrorBoundary>
            <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">
                <MainSlideBar />
                <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl md:text-5xl font-serif-elegant font-normal text-charcoal tracking-tight">
                            Community<span className="text-indigo-600">.</span>
                        </h1>
                        {activeTab === "communities" && (
                            <button 
                                onClick={() => setShowCreate(true)}
                                className="bg-charcoal hover:bg-black text-white font-semibold py-3 px-6 rounded-full shadow-sm text-sm transition cursor-pointer border-none outline-none"
                            >
                                + Create Community
                            </button>
                        )}
                        {activeTab === "chats" && isMobile && (
                            <button
                                onClick={toggleChatList}
                                className="md:hidden bg-charcoal hover:bg-black text-white text-xs px-3.5 py-2 rounded-xl"
                            >
                                {showChatList ? 'Hide List' : 'Show List'}
                            </button>
                        )}
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex justify-center mb-8">
                        <div className="flex bg-cream-card border border-cream-dark/80 p-1.5 rounded-full w-72 shadow-sm">
                            <button 
                                className={`flex-1 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer border-none outline-none ${activeTab === 'communities' ? 'bg-charcoal text-white shadow-sm font-bold' : 'text-charcoal/50 hover:text-charcoal bg-transparent'}`}
                                onClick={() => setActiveTab('communities')}
                            >
                                Communities
                            </button>
                            <button 
                                className={`flex-1 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer border-none outline-none ${activeTab === 'chats' ? 'bg-charcoal text-white shadow-sm font-bold' : 'text-charcoal/50 hover:text-charcoal bg-transparent'}`}
                                onClick={() => setActiveTab('chats')}
                            >
                                Chats
                            </button>
                        </div>
                    </div>

                    {activeTab === "communities" ? (
                        <CommunitiesSection 
                            communities={communities}
                            myCommunities={myCommunities}
                            onJoin={handleJoin}
                            onOpenChat={() => setActiveTab('chats')}
                        />
                    ) : (
                        <ChatsSection 
                            isMobile={isMobile}
                            showChatList={showChatList}
                        />
                    )}
                </div>

                {/* Create Modal */}
                {showCreate && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-cream-card border border-cream-dark/80 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative">
                            <h2 className="text-xl font-serif-elegant font-normal text-charcoal mb-6">Create Community</h2>
                            <form onSubmit={handleCreate} className="flex flex-col gap-5">
                                <div>
                                    <label className="text-charcoal/80 font-bold text-xs uppercase tracking-wider mb-2 block">
                                        Community Photo
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-2xl bg-white border border-cream-dark/80 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                            {photoPreview ? (
                                                <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                                            ) : (
                                                "📸"
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                id="communityPhoto"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setPhotoFile(file);
                                                        setPhotoPreview(URL.createObjectURL(file));
                                                    }
                                                }}
                                            />
                                            <label
                                                htmlFor="communityPhoto"
                                                className="cursor-pointer inline-block bg-white hover:bg-cream/40 text-charcoal font-semibold text-xs px-4 py-2.5 rounded-xl border border-cream-dark/85 shadow-sm transition"
                                            >
                                                {photoFile ? "Change Photo" : "Upload Photo"}
                                            </label>
                                            {photoFile && (
                                                <p className="text-[10px] text-charcoal/40 mt-1.5 truncate max-w-[180px] font-medium">{photoFile.name}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-charcoal/80 font-bold text-xs uppercase tracking-wider mb-2 block">Community Name</label>
                                    <input 
                                        required 
                                        value={name} 
                                        onChange={e=>setName(e.target.value)} 
                                        className="w-full bg-white border border-cream-dark/85 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-sm font-medium text-charcoal" 
                                        placeholder="E.g. Code Masters" 
                                    />
                                </div>
                                <div>
                                    <label className="text-charcoal/80 font-bold text-xs uppercase tracking-wider mb-2 block">Description</label>
                                    <textarea 
                                        required 
                                        value={description} 
                                        onChange={e=>setDescription(e.target.value)} 
                                        className="w-full bg-white border border-cream-dark/85 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-sm font-medium text-charcoal" 
                                        rows="3" 
                                        placeholder="What's this group about?" 
                                    />
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => { setShowCreate(false); setPhotoFile(null); setPhotoPreview(""); }} 
                                        className="flex-1 border border-charcoal/20 hover:bg-charcoal/5 text-charcoal font-semibold py-3.5 rounded-full text-xs transition cursor-pointer bg-transparent"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-1 bg-charcoal hover:bg-black text-white font-semibold py-3.5 rounded-full text-xs shadow-md transition cursor-pointer bg-transparent border-none outline-none"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}

function CommunitiesSection({ communities, myCommunities, onJoin, onOpenChat }) {
    const [activeSubTab, setActiveSubTab] = useState("explore");
    const displayList = activeSubTab === "explore" ? communities : myCommunities;

    return (
        <div className="bg-cream border-t border-cream-dark/60 pt-4">
            <div className="flex gap-6 border-b border-cream-dark/60 mb-8 pb-4">
                <button 
                    onClick={() => setActiveSubTab("explore")}
                    className={`pb-2 text-sm font-semibold px-1 transition cursor-pointer bg-transparent border-none outline-none ${activeSubTab === 'explore' ? 'text-charcoal border-b-2 border-charcoal font-bold font-serif-elegant' : 'text-charcoal/40 hover:text-charcoal'}`}
                >
                    Explore Public
                </button>
                <button 
                    onClick={() => setActiveSubTab("mine")}
                    className={`pb-2 text-sm font-semibold px-1 transition cursor-pointer bg-transparent border-none outline-none ${activeSubTab === 'mine' ? 'text-charcoal border-b-2 border-charcoal font-bold font-serif-elegant' : 'text-charcoal/40 hover:text-charcoal'}`}
                >
                    My Communities
                </button>
            </div>

            {displayList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayList.map(c => (
                        <div key={c._id} className="bg-cream-card rounded-3xl overflow-hidden shadow-md border border-cream-dark/80 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                            <div className="p-5">
                                <div className={`h-32 rounded-2xl mb-5 flex items-end p-5 shadow-inner overflow-hidden relative ${!c.profilePhoto ? `bg-gradient-to-br ${c.coverColor || 'from-indigo-900 to-teal-950'}` : ''}`}>
                                    {c.profilePhoto && (
                                        <img
                                            src={c.profilePhoto}
                                            alt={c.name}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/25"></div>
                                    <h3 className="text-xl font-serif-elegant font-normal text-white drop-shadow-md z-10">{c.name}</h3>
                                </div>
                                <p className="text-charcoal/70 text-sm mb-6 line-clamp-2 min-h-[3rem] leading-relaxed">{c.description}</p>
                                
                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-cream-dark/50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-charcoal/50 font-bold text-[10px] tracking-wide uppercase">
                                            {c.memberCount || 0} Members
                                        </span>
                                    </div>
                                    
                                    {activeSubTab === "explore" ? (
                                        <button 
                                            onClick={() => onJoin(c._id)}
                                            className="bg-charcoal hover:bg-black text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-sm transition cursor-pointer border-none outline-none"
                                        >
                                            Join
                                        </button>
                                    ) : (
                                        <div
                                            onClick={onOpenChat}
                                            className="cursor-pointer flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-bold text-xs bg-white hover:bg-cream border border-cream-dark/80 px-4 py-2.5 rounded-xl transition shadow-sm"
                                        >
                                            Open Chat →
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-cream-card rounded-3xl border border-cream-dark/80 shadow-inner">
                    <p className="text-charcoal/50 font-medium text-sm">
                        {activeSubTab === "explore" ? "No public communities found." : "You haven't joined any communities yet."}
                    </p>
                    {activeSubTab === "mine" && (
                        <button 
                            onClick={() => setActiveSubTab("explore")}
                            className="mt-3 text-indigo-600 hover:text-indigo-800 font-bold text-sm underline underline-offset-4 cursor-pointer bg-transparent border-none outline-none"
                        >
                            Explore Communities
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

function ChatsSection({ isMobile, showChatList }) {
    return (
        <div className="flex h-[calc(100vh-14rem)] rounded-3xl shadow-lg border border-cream-dark/80 bg-cream-card overflow-hidden">
            {(showChatList || !isMobile) && (
                <div className={`${isMobile ? 'w-full absolute z-10' : 'w-1/3'} border-r border-cream-dark/70 flex-shrink-0 bg-cream-card md:relative h-full`}>
                    <Chat_SlideBar />
                </div>
            )}
            <div className={`${isMobile && showChatList ? 'hidden' : 'flex-1'} p-2 overflow-y-auto bg-cream-card`}>
                <MessageContainer />
            </div>
        </div>
    );
}
