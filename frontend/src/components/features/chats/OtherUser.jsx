import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from '../../../redux/userSlice';
import { ROOT_URL } from "../../../api/axios";

const OtherUser = ({ user }) => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store => store.user);
    
    const selectedUserHandeler = (user) => {
        dispatch(setSelectedUser(user));
    }
    
    const avatarFallback = `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}`;
    const profilePhotoUrl = user?.profilePhoto?.startsWith("http")
        ? user.profilePhoto
        : user?.profilePhoto
            ? `${ROOT_URL}${user.profilePhoto}`
            : avatarFallback;

    return (
        <div 
            onClick={() => selectedUserHandeler(user)} 
            className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-200 border cursor-pointer font-sans-clean ${
                selectedUser?._id === user?._id 
                    ? 'bg-cream/70 border-cream-dark/80 shadow-inner'
                    : 'border-transparent hover:bg-cream/45'
            }`}
        >
            {/* Avatar with Online Indicator */}
            <div className="relative">
                <img
                    className="w-10 h-10 rounded-xl border border-cream-dark/80 object-cover shadow-sm bg-white"
                    src={profilePhotoUrl}
                    alt="profile"
                    onError={(e) => (e.target.src = avatarFallback)}
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white rounded-full flex items-center justify-center">
                    <span className="absolute w-full h-full bg-green-400 opacity-75 rounded-full animate-ping"></span>
                </span>
            </div>

            {/* Username */}
            <div className="flex-1 overflow-hidden">
                <p className="text-charcoal font-semibold text-sm truncate">{user?.fullName || "Unknown User"}</p>
                <p className="text-[11px] text-charcoal/40 font-medium truncate">Tap to open conversation</p>
            </div>
        </div>
    );
};

export default OtherUser;
