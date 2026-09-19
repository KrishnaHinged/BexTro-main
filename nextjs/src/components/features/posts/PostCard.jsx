"use client";

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/api/axios';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaEllipsisV, FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function PostCard({ post, currentUser }) {
    const router = useRouter();

    const [likes, setLikes] = useState(post.likes || []);
    const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUser?._id) || false);
    const [showMenu, setShowMenu] = useState(false);
    const [followStatus, setFollowStatus] = useState(post.authorConnectionStatus || "none");

    useEffect(() => {
        setFollowStatus(post.authorConnectionStatus || "none");
    }, [post.authorConnectionStatus]);

    const profilePhotoUrl = post.user?.profilePhoto || `https://ui-avatars.com/api/?name=${post.user?.username || "User"}`;

    const handleLike = async () => {
        const previousLikes = [...likes];
        const previouslyLiked = isLiked;

        const newLikes = previouslyLiked
            ? likes.filter(id => id !== currentUser?._id)
            : [...likes, currentUser?._id];
        
        setLikes(newLikes);
        setIsLiked(!previouslyLiked);

        try {
            const res = await axiosInstance.post(`/posts/${post._id}/like`);
            setLikes(res.data.likes);
            setIsLiked(res.data.likes.includes(currentUser?._id));
        } catch (error) {
            console.error("Error toggling like", error);
            setLikes(previousLikes);
            setIsLiked(previouslyLiked);
            toast.error("Failed to like post");
        }
    };

    const handleFollow = async () => {
        if (post.isChallengeDiscovery) return;
        const previousStatus = followStatus;
        const nextStatus = previousStatus === "following" ? "none" : "following";
        setFollowStatus(nextStatus);

        try {
            const res = await axiosInstance.post(`/user/${post.user?._id}/follow`);
            toast.success(res.data.message);
            setFollowStatus(res.data.isFollowing ? "following" : "none");
        } catch (error) {
            console.error("Error toggling follow", error);
            setFollowStatus(previousStatus);
            toast.error("Failed to update follow status");
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-cream-card rounded-3xl overflow-hidden border border-cream-dark/80 hover:shadow-lg transition-all duration-300 mb-4 cursor-pointer break-inside-avoid font-sans-clean"
        >

            {/* IMAGE / CONTENT */}
            <div className="relative">

                {/* IMAGE */}
                {post.proofType === "image" && post.proofUrl && (
                    <img
                        src={post.proofUrl}
                        alt="post"
                        className="w-full object-cover max-h-[350px]"
                    />
                )}

                {/* VIDEO */}
                {post.proofType === "video" && post.proofUrl && (
                    <video
                        src={post.proofUrl}
                        controls
                        className="w-full max-h-[350px]"
                    />
                )}

                {/* AI CHALLENGE DISCOVERY CARD */}
                {post.isChallengeDiscovery ? (
                    <div className="p-5 bg-gradient-to-br from-indigo-50/60 to-purple-50/30 border-b border-cream-dark/40">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                                Suggested Goal Challenge
                            </span>
                        </div>
                        <h3 className="text-sm font-semibold text-charcoal leading-snug">
                            {post.challengeText}
                        </h3>
                    </div>
                ) : (post.proofType === "link" || post.proofType === "blog") && post.proofUrl ? (
                    /* REGULAR PROOF LINK */
                    (() => {
                        const isSafeProtocol = /^https?:\/\//i.test(post.proofUrl?.trim());
                        return isSafeProtocol ? (
                            <a
                                href={post.proofUrl.trim()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-5 bg-white hover:bg-cream/40 transition-colors border-b border-cream-dark/50"
                            >
                                <p className="text-sm font-semibold text-charcoal line-clamp-2">
                                    {post.challengeText || "Proof of Work Link"}
                                </p>
                                <span className="text-[10px] text-indigo-600 font-bold tracking-wider uppercase mt-2 inline-flex items-center gap-1">
                                    View Proof Link <FaExternalLinkAlt size={8} />
                                </span>
                            </a>
                        ) : (
                            <div className="p-5 bg-white border-b border-cream-dark/50">
                                <p className="text-sm font-semibold text-charcoal line-clamp-2">
                                    {post.challengeText || "Proof of Work"}
                                </p>
                            </div>
                        );
                    })()
                ) : null}

                {/* HOVER OVERLAY */}
                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    {post.isChallengeDiscovery ? (
                        <button 
                            onClick={(e) => { e.stopPropagation(); router.push('/set_challenges'); }}
                            className="bg-charcoal text-white text-xs px-5 py-2.5 rounded-full font-bold shadow-lg hover:bg-black transition cursor-pointer flex items-center gap-1.5"
                        >
                            <span>Take Challenge</span>
                            <FaArrowRight size={10} />
                        </button>
                    ) : (
                        <button 
                            onClick={(e) => { e.stopPropagation(); router.push(`/user/${post.user?._id}`); }}
                            className="bg-indigo-600 text-white text-xs px-4 py-2.5 rounded-full font-semibold shadow cursor-pointer"
                        >
                            Inspect
                        </button>
                    )}
                </div>

                {/* TOP RIGHT ACTIONS */}
                {!post.isChallengeDiscovery && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition flex gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleLike(); }}
                            className="bg-white/90 hover:bg-white text-charcoal p-2.5 rounded-full shadow-md cursor-pointer transition-colors"
                        >
                            {isLiked ? <FaHeart className="text-red-500 text-xs" /> : <FaRegHeart className="text-xs" />}
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                            className="bg-white/90 hover:bg-white text-charcoal p-2.5 rounded-full shadow-md cursor-pointer transition-colors"
                        >
                            <FaEllipsisV className="text-[10px]" />
                        </button>
                    </div>
                )}

                {/* VISIBILITY BADGE */}
                {post.visibility === 'private' && (
                    <div className="absolute top-3 left-3 bg-charcoal/80 border border-cream-dark/20 text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                        <span className="text-[9px]">🔒</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider">Only Me</span>
                    </div>
                )}

            </div>

            {/* USER INFO */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-cream-dark/30">
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                        if (!post.isChallengeDiscovery) router.push(`/user/${post.user?._id}`);
                    }}
                >
                    <img
                        src={profilePhotoUrl}
                        onError={(e) => (e.target.src = "https://ui-avatars.com/api/?name=User")}
                        className="w-7 h-7 rounded-lg object-cover border border-cream-dark shadow-sm"
                    />

                    <span className="text-xs font-semibold text-charcoal/80">
                        {post.user?.username}
                    </span>
                </div>

                {post.isChallengeDiscovery ? (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        Discovery
                    </span>
                ) : currentUser?._id !== post.user?._id && (
                    <button
                        onClick={(e) => { e.stopPropagation(); handleFollow(); }}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition cursor-pointer border ${
                            ["following", "mutual"].includes(followStatus)
                                ? "bg-cream border-cream-dark/80 text-charcoal/70 hover:bg-cream/40"
                                : "bg-charcoal border-charcoal text-white hover:bg-black"
                        }`}
                    >
                        {["following", "mutual"].includes(followStatus) ? "Following" : "Follow"}
                    </button>
                )}
            </div>

            {/* BODY TEXT / CAPTION (NO DUPLICATION) */}
            {post.isChallengeDiscovery ? (
                post.description && (
                    <p className="px-4 pt-3 pb-4 text-xs text-charcoal/70 font-normal leading-relaxed">
                        {post.description}
                    </p>
                )
            ) : post.description ? (
                <p className="px-4 pt-3 pb-4 text-xs sm:text-sm text-charcoal/80 font-medium leading-relaxed">
                    {post.description}
                </p>
            ) : post.challengeText && post.proofType !== "link" && post.proofType !== "blog" ? (
                <p className="px-4 pt-3 pb-4 text-xs sm:text-sm text-charcoal/80 font-medium leading-relaxed">
                    {post.challengeText}
                </p>
            ) : null}

        </motion.div>
    );
}
