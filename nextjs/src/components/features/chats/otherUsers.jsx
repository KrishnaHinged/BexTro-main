"use client";

import React from "react";
import OtherUser from "./OtherUser";
import useGetOtherUsers from "@/hooks/useGetOtherUsers";
import { useSelector } from "react-redux";

export default function OUsers() {
    useGetOtherUsers();
    const { OtherUsers } = useSelector(store => store.user);
    if (!OtherUsers) return null;
    return (
        <div className="space-y-2 overflow-y-auto">
            {
                OtherUsers?.map((user) => {
                    return (
                        <OtherUser key={user._id} user={user} />
                    )
                })
            }
        </div>
    );
}
