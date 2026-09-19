"use client";

import React, { useState, useEffect } from 'react';
import axiosInstance, { ROOT_URL } from '@/api/axios';
import { motion } from 'framer-motion';
import { FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const PostManagement = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await axiosInstance.get("/posts/feed");
            setPosts(res.data || []);
            setLoading(false);
        } catch (error) {
            console.error("Fetch posts error:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await axiosInstance.delete(`/admin/post/${postId}`);
            toast.success("Post deleted.");
            fetchPosts();
        } catch (error) {
            toast.error("Failed to delete post.");
        }
    };

    if (loading) return <div className="p-10 text-charcoal/50 text-center">Loading posts...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-serif-elegant font-normal text-charcoal">
                    Post Moderation
                </h2>
                <p className="text-xs text-charcoal/50 mt-0.5">
                    Review and moderate community proofs ({posts.length} proofs)
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => {
                    const proofImg = post.proofUrl?.startsWith("http")
                        ? post.proofUrl
                        : `${ROOT_URL}${post.proofUrl}`;

                    return (
                        <motion.div
                            key={post._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white border border-cream-dark/80 rounded-2xl overflow-hidden flex flex-col shadow-xs"
                        >
                            <div className="p-4 border-b border-cream-dark/60 flex items-center gap-3">
                                <img
                                    src={post.user?.profilePhoto || `https://ui-avatars.com/api/?name=${post.user?.username || "User"}`}
                                    className="w-8 h-8 rounded-lg object-cover border border-cream-dark"
                                    alt="avatar"
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${post.user?.username || "User"}`;
                                    }}
                                />
                                <div>
                                    <p className="text-charcoal font-bold text-xs">{post.user?.fullName}</p>
                                    <p className="text-charcoal/40 text-[10px]">@{post.user?.username}</p>
                                </div>
                            </div>
                            <div className="flex-1 p-4">
                                <p className="text-charcoal/80 text-xs italic mb-4">"{post.challengeText}"</p>
                                {post.proofType === 'image' && post.proofUrl && (
                                    <img src={proofImg} className="w-full h-32 object-cover rounded-xl border border-cream-dark" alt="Proof" />
                                )}
                                {post.proofType === 'video' && (
                                    <div className="w-full h-32 bg-charcoal/5 rounded-xl flex items-center justify-center text-charcoal/40 text-[10px]">Video Content</div>
                                )}
                            </div>
                            <div className="p-4 bg-cream/40 border-t border-cream-dark/60 flex justify-between gap-2">
                                 {post.proofUrl && (
                                     <a href={proofImg} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white border border-cream-dark/80 hover:bg-cream text-charcoal text-[10px] font-bold rounded-lg transition-all">
                                        <FaEye /> View Full
                                     </a>
                                 )}
                                 <button onClick={() => handleDelete(post._id)} className="flex items-center justify-center gap-2 py-2 px-4 bg-rose-50 text-rose-700 hover:bg-rose-100 text-[10px] font-bold rounded-lg transition-all cursor-pointer">
                                    <FaTrash /> Delete
                                 </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default PostManagement;
