import React, { useEffect } from "react";
import SendMessage from "./SendMessage";
import Messages from "./Messages";
import { useDispatch, useSelector } from "react-redux";
import { ROOT_URL } from "../../../api/axios";

const MessageContainer = () => {
  const dispatch = useDispatch();
  const { selectedUser, authUser, onlineUsers } = useSelector((store) => store.user);
  const { socket } = useSelector((store) => store.socket);
  const [isTyping, setIsTyping] = React.useState(false); // Local typing state

  useEffect(() => {
    if (socket && selectedUser) {
        if (selectedUser.isCommunity) {
            socket.emit("joinCommunity", selectedUser._id);
        }

        socket.on("typingStatus", ({ senderId, isTyping }) => {
            if (senderId === selectedUser._id) {
                setIsTyping(isTyping);
            }
        });

        // Emit 'markAsSeen' when conversation opens (only for DMs)
        if (!selectedUser.isCommunity) {
            socket.emit("markAsSeen", { senderId: selectedUser._id, receiverId: authUser?._id });
        }

        return () => {
            if (selectedUser.isCommunity) {
                socket.emit("leaveCommunity", selectedUser._id);
            }
            socket.off("typingStatus");
        };
    }
  }, [dispatch, socket, selectedUser, authUser?._id]);

  const profilePhotoUrl = selectedUser?.profilePhoto?.startsWith("http")
    ? selectedUser.profilePhoto
    : selectedUser?.profilePhoto
    ? `${ROOT_URL}${selectedUser.profilePhoto}`
    : `https://ui-avatars.com/api/?name=${selectedUser?.fullName || "User"}`;

  if (!selectedUser) {
    return (
      <div className="flex flex-col h-full justify-center items-center text-charcoal/40 font-medium text-sm italic bg-cream-card min-h-[300px]">
        <i className="fa-solid fa-comments text-4xl mb-4 text-charcoal/20"></i>
        <p>Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-cream-card font-sans-clean">
      <header className="flex items-center gap-3 bg-white p-4 rounded-t-3xl border-b border-cream-dark/60 transition-all duration-300">
        <div className="relative">
          <img
            className="w-12 h-12 rounded-xl border border-cream-dark/85 object-cover"
            src={profilePhotoUrl}
            alt={`${selectedUser?.fullName || "User"}'s profile`}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${selectedUser?.fullName || "User"}`;
            }}
          />
        </div>
        <div>
          <p className="text-base font-semibold text-charcoal">
            {selectedUser?.fullName || "Unknown User"}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {isTyping ? (
                <span className="text-[10px] text-indigo-600 animate-pulse font-bold">typing...</span>
            ) : (
                <>
                    <div className={`w-1.5 h-1.5 rounded-full ${onlineUsers?.includes(selectedUser?._id) ? 'bg-green-500' : 'bg-charcoal/30'}`}></div>
                    <span className="text-[10px] text-charcoal/40 font-bold uppercase tracking-wider">
                        {onlineUsers?.includes(selectedUser?._id) ? 'Online' : 'Offline'}
                    </span>
                </>
            )}
          </div>
        </div>
      </header>
      <Messages />
      <SendMessage />
    </div>
  );
};

export default MessageContainer;
