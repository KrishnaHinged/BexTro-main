"use client";

import React, { useEffect } from "react";
import OtherUser_Admin from "./OtherUser_Admin";
import useGetAdminUsers from "@/hooks/useGetAdminUsers";

const OtherUsers_Admin = () => {
  const { users, loading, error, deleteUser, updateRole } = useGetAdminUsers();

  // Attach handlers to window for child access (OtherUser_Admin)
  useEffect(() => {
    window.onDeleteUser = deleteUser;
    window.onUpdateRole = updateRole;
    return () => {
      delete window.onDeleteUser;
      delete window.onUpdateRole;
    };
  }, [deleteUser, updateRole]);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-10 text-center border border-rose-200 rounded-3xl bg-rose-50/50">
        <p className="text-rose-600 font-bold">Error: {error}</p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="w-full p-10 text-center border border-cream-dark/80 rounded-3xl bg-white/50">
        <p className="text-charcoal/40 font-medium">No users found on the platform.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <OtherUser_Admin key={user._id} user={user} />
      ))}
    </div>
  );
};

export default OtherUsers_Admin;
