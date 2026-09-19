"use client";

import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

export default function Message({ message }) {
    const scroll = useRef();
    const { authUser } = useSelector(store => store.user);

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message]);

    const isSender = String(message?.senderId?._id || message?.senderId) === String(authUser?._id);
    const sender = message?.senderId;
    const { selectedUser } = useSelector(store => store.user);

    const resolvedName = isSender 
        ? (authUser?.fullName || authUser?.username || "You")
        : (sender?.fullName || sender?.username || (!selectedUser?.isCommunity ? selectedUser?.fullName : null) || "User");

    const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(resolvedName)}`;
    
    const profilePhotoUrl = sender?.profilePhoto || avatarFallback;

    return (
        <div className="flex flex-col mb-4 px-2 font-sans-clean">
            {!isSender && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/40 mb-1 ml-10">
                    {resolvedName}
                </span>
            )}

            <div className={`flex gap-2 max-w-[85%] ${isSender ? 'flex-row-reverse ml-auto' : 'flex-row'}`}>
                {!isSender && (
                    <div className="flex-shrink-0 mt-auto">
                        <img 
                            className="w-8 h-8 rounded-xl border border-cream-dark/80 object-cover shadow-sm bg-white"
                            src={profilePhotoUrl} 
                            alt="avatar" 
                            onError={(e) => e.target.src = avatarFallback}
                        />
                    </div>
                )}

                <div className="flex flex-col">
                    <div className={`
                        px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-shadow duration-200
                        ${isSender 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-white text-charcoal border border-cream-dark/80 rounded-bl-none'
                        }
                    `}>
                        {message?.message}
                    </div>

                    <div className={`flex items-center gap-2 mt-1.5 px-1 ${isSender ? 'justify-end' : 'justify-start'}`}>
                        <time className="text-[9px] text-charcoal/40 font-semibold">
                             {new Date(message?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </time>
                        
                        {isSender && (
                            <span className="text-[9px] font-bold uppercase tracking-wider flex items-center">
                                {message.isOptimistic ? (
                                    <span className="text-charcoal/30 italic flex items-center animate-pulse">
                                         sending...
                                    </span>
                                ) : (
                                    <span className={message.isSeen ? 'text-indigo-600' : 'text-charcoal/30'}>
                                        {message.isSeen ? 'Read' : 'Sent'}
                                    </span>
                                )}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
