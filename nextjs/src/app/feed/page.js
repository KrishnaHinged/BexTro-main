"use client";

import React, { useEffect, useState } from 'react';
import SkeletonCard from '@/components/features/posts/SkeletonCard';
import axiosInstance from '@/api/axios';
import Masonry from 'react-masonry-css';
import PostCard from '@/components/features/posts/PostCard';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useSelector } from 'react-redux';
import MainSlideBar from "@/components/layout/MainSlideBar";
import PageLoader from "@/components/common/loaders/pagesLoader";
import { motion, AnimatePresence } from "framer-motion";
import UserSearchCard from '@/components/features/posts/UserSearchCard';
import { useDebounce } from '@/hooks/useDebouncedSearch';

export default function FeedPage() {
    const { authUser: user, isAuthenticated } = useSelector(store => store.user);
    const isRehydrated = useSelector((state) => state._persist?.rehydrated);
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('foryou');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const debouncedSearch = useDebounce(searchQuery, 400);

    const fetchFeed = async (tab) => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/posts/feed?tab=${tab}`);
            setPosts(res.data || []);
        } catch (error) {
            console.error("Error fetching feed", error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const { socket } = useSelector(store => store.socket);

    useEffect(() => {
        if (socket) {
            socket.on("newPost", (newPost) => {
                setPosts(prev => [newPost, ...prev]);
            });

            socket.on("postUpdate", ({ postId, likes, comments, type }) => {
                setPosts(prev => prev.map(post => {
                    if (post._id === postId) {
                        return {
                            ...post,
                            likes: type === "like" ? likes : post.likes,
                            comments: type === "comment" ? comments : post.comments
                        };
                    }
                    return post;
                }));
            });

            return () => {
                socket.off("newPost");
                socket.off("postUpdate");
            };
        }
    }, [socket]);

    useEffect(() => {
        const performSearch = async () => {
            if (!debouncedSearch.trim()) {
                setSearchResults([]);
                return;
            }
            setSearching(true);
            try {
                const res = await axiosInstance.get(`/user/search?query=${debouncedSearch}`);
                setSearchResults(res.data || []);
            } catch (error) {
                console.error("Search error", error);
            } finally {
                setSearching(false);
            }
        };
        performSearch();
    }, [debouncedSearch]);

    useEffect(() => {
        if (user?._id) {
            fetchFeed(activeTab);
        }
    }, [activeTab, user]);

    if (!isRehydrated) {
        return <PageLoader message="Loading feed..." />;
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center font-sans-clean px-4">
                <div className="bg-cream-card rounded-[2.5rem] border border-cream-dark/80 p-8 sm:p-10 shadow-xl text-center max-w-sm w-full">
                    <h2 className="text-2xl font-serif-elegant font-normal text-charcoal mb-4">Please Sign In</h2>
                    <p className="text-charcoal/60 text-sm mb-6">You need to be logged in to view the feed.</p>
                    <a href="/signin" className="bg-charcoal hover:bg-black text-white px-6 py-3 rounded-full font-bold shadow-md block text-sm transition-all text-center">
                        Sign In
                    </a>
                </div>
            </div>
        );
    }

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <ErrorBoundary>
            <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">

                {/* Sidebar */}
                <MainSlideBar />

                {/* Right Content Area */}
                <div className="flex-1 p-6 md:p-10 overflow-y-auto">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <h1 className="text-3xl md:text-5xl font-serif-elegant font-normal text-charcoal tracking-tight">
                            Community Feed<span className="text-indigo-600">.</span>
                        </h1>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-96 group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className={searching ? "text-indigo-600 animate-spin text-sm" : "text-charcoal/30 text-xs"}>
                                    {searching ? "..." : "🔍"}
                                </span>
                            </div>
                            <input 
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-cream-dark/85 hover:bg-white/70 focus:bg-white rounded-2xl py-3.5 pl-10 pr-4 text-charcoal placeholder-charcoal/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all duration-300 shadow-sm"
                            />

                            {/* Search Results Dropdown */}
                            <AnimatePresence>
                                {searchQuery && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                        className="absolute left-0 right-0 top-full mt-3 bg-cream-card border border-cream-dark/80 rounded-[2.2rem] shadow-2xl z-[100] max-h-[450px] overflow-y-auto p-4 flex flex-col gap-2"
                                    >
                                        <div className="flex justify-between items-center px-2 mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40">
                                                {searching ? "Searching..." : `Results (${searchResults.length})`}
                                            </span>
                                            {searchQuery && !searching && (
                                                <button 
                                                    onClick={() => setSearchQuery('')}
                                                    className="text-xs font-bold text-charcoal/40 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none outline-none"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>

                                        {searchResults.length > 0 ? (
                                            searchResults.map(user => (
                                                <UserSearchCard key={user._id} user={user} />
                                            ))
                                        ) : !searching && (
                                            <div className="py-8 text-center bg-white rounded-2xl border border-cream-dark/60">
                                                <p className="text-charcoal/50 text-sm italic font-medium">No builders found for "{searchQuery}"</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Tabs Pill Selector */}
                    <div className="flex justify-center mb-8">
                        <div className="flex bg-cream-card border border-cream-dark/80 p-1.5 rounded-full w-72 shadow-sm">
                            <button
                                className={`flex-1 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer border-none outline-none ${
                                    activeTab === 'foryou'
                                        ? 'bg-charcoal text-white shadow-sm font-bold'
                                        : 'text-charcoal/50 hover:text-charcoal bg-transparent'
                                }`}
                                onClick={() => setActiveTab('foryou')}
                            >
                                For You
                            </button>

                            <button
                                className={`flex-1 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer border-none outline-none ${
                                    activeTab === 'connections'
                                        ? 'bg-charcoal text-white shadow-sm font-bold'
                                        : 'text-charcoal/50 hover:text-charcoal bg-transparent'
                                }`}
                                onClick={() => setActiveTab('connections')}
                            >
                                Connections
                            </button>
                        </div>
                    </div>

                    {/* Feed Display Grid */}
                    {loading ? (
                        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : posts.length > 0 ? (
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="flex w-auto -ml-4"
                            columnClassName="pl-4 bg-clip-padding"
                        >
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} currentUser={user} />
                            ))}
                        </Masonry>
                    ) : (
                        <div className="py-20 text-center bg-cream-card border border-cream-dark/80 rounded-[2.5rem] max-w-md mx-auto">
                            <h3 className="text-xl font-serif-elegant font-normal text-charcoal mb-2">Feed is Quiet</h3>
                            <p className="text-sm text-charcoal/50 max-w-xs mx-auto">No actions have been verified in this track yet. Be the first to post proof!</p>
                        </div>
                    )}

                </div>
            </div>
        </ErrorBoundary>
    );
}
