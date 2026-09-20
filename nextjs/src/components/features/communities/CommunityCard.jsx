"use client";

import React from "react";
import Button from "@/components/ui/Button";

export default function CommunityCard({
  community,
  isJoined,
  onJoin,
  onOpenChat
}) {
  return (
    <div className="bg-cream-card rounded-[2.5rem] overflow-hidden shadow-xs border border-cream-dark/80 hover:shadow-lg hover:border-charcoal/30 transition-all duration-300 flex flex-col justify-between group">
      <div className="p-6">
        <div
          className={`h-36 rounded-2xl mb-5 flex items-end p-5 shadow-inner overflow-hidden relative ${
            !community.profilePhoto
              ? `bg-gradient-to-br ${community.coverColor || "from-indigo-900 to-teal-950"}`
              : ""
          }`}
        >
          {community.profilePhoto && (
            <img
              src={community.profilePhoto}
              alt={community.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
          <h3 className="text-xl font-serif-elegant font-normal text-white drop-shadow-md z-10">
            {community.name}
          </h3>
        </div>

        <p className="text-charcoal/70 text-sm mb-6 line-clamp-2 min-h-[3rem] leading-relaxed">
          {community.description}
        </p>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-cream-dark/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-charcoal/50 font-bold text-[11px] tracking-wide uppercase font-mono">
              {community.memberCount || 0} Members
            </span>
          </div>

          {!isJoined ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onJoin(community._id)}
            >
              Join
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenChat}
            >
              Open Chat →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
