"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { getProfilePhoto } from "@/utils/getProfilePhoto";

export default function ConnectionsSection({ connections }) {
  const router = useRouter();

  return (
    <div className="font-sans-clean">
      <h2 className="text-xl font-serif-elegant font-normal text-charcoal mb-6">
        Your Connections ({connections.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connections.map((user) => (
          <div
            key={user._id}
            onClick={() => router.push(`/user/${user._id}`)}
            className="bg-cream-card border border-cream-dark/80 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <img
              src={getProfilePhoto(user.profilePhoto, user.username)}
              alt="avatar"
              className="w-12 h-12 rounded-xl bg-charcoal/10 object-cover border border-cream-dark shadow-sm"
            />
            <div>
              <h4 className="text-charcoal font-semibold text-sm">{user.fullName}</h4>
              <span className="text-charcoal/50 text-xs font-medium">@{user.username}</span>
            </div>
          </div>
        ))}
        {connections.length === 0 && (
          <div className="col-span-full text-center text-charcoal/40 py-12 text-sm font-medium">
            No connections yet. Start connecting with others!
          </div>
        )}
      </div>
    </div>
  );
}
