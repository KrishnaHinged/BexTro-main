import React from "react";

export default function PageLoader({ message }) {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/80 z-[999]">
      <div className="relative flex flex-col items-center text-4xl font-bold text-white animate-pulse">
        <h1 className="bg-gradient-to-r from-blue-500 to-pink-400 bg-clip-text text-transparent">
          {message}
        </h1>
      </div>
    </div>
  );
}

export const DashboardLoader = () => <PageLoader message="Loading Dashboard..." />;
export const NotificationsLoader = () => <PageLoader message="Fetching Notifications..." />;
export const ChatsLoader = () => <PageLoader message="Loading Chats..." />;
export const SelfChallengesLoader = () => <PageLoader message="Preparing Your Challenges..." />;
export const SettingsLoader = () => <PageLoader message="Applying Settings..." />;
