import axiosInstance from '../../../api/axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages, addMessage, replaceMessage } from '../../../redux/messageSlice';
import { toast } from 'react-hot-toast';

const SendMessage = () => {
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const { messages } = useSelector(store => store.message);
    const { selectedUser } = useSelector(store => store.user);
    const { socket } = useSelector(store => store.socket);
    const { authUser } = useSelector(store => store.user);

    const handleInputChange = (e) => {
        setMessage(e.target.value);
        if (socket && selectedUser && !selectedUser.isCommunity) {
            socket.emit("typing", { 
                senderId: authUser?._id, 
                receiverId: selectedUser?._id, 
                isTyping: true 
            });

            // Stop typing after a delay
            if (window.typingTimeout) clearTimeout(window.typingTimeout);
            window.typingTimeout = setTimeout(() => {
                socket.emit("typing", { 
                    senderId: authUser?._id, 
                    receiverId: selectedUser?._id, 
                    isTyping: false 
                });
            }, 2000);
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const tempId = Date.now().toString();
        const optimisticMessage = {
            _id: tempId,
            senderId: authUser?._id,
            receiverId: selectedUser?._id,
            message: message,
            isOptimistic: true,
            createdAt: new Date().toISOString()
        };

        // 1. Optimistic Update
        dispatch(addMessage(optimisticMessage));
        const messageToSend = message;
        setMessage("");

        try {
            const endpoint = selectedUser.isCommunity 
                ? `/message/community/send/${selectedUser?._id}`
                : `/message/send/${selectedUser?._id}`;

            const res = await axiosInstance.post(endpoint, { message: messageToSend });

            if (res.data?.newMessage) {
                // 2. Replace optimistic message with real message from server
                dispatch(replaceMessage({ tempId, newMessage: res.data.newMessage }));
            }
            
            // Stop typing immediately on send
            if (socket && selectedUser && !selectedUser.isCommunity) {
                socket.emit("typing", { senderId: authUser?._id, receiverId: selectedUser?._id, isTyping: false });
            }
        } catch (error) {
            console.log(error);
            // 3. Rollback on error
            if (Array.isArray(messages)) {
                const filteredMessages = messages.filter(m => m._id !== tempId);
                dispatch(setMessages(filteredMessages)); 
            }
            toast.error("Failed to send message");
        }
    };

    return (
        <div className="p-4 border-t border-cream-dark/60 bg-cream-card font-sans-clean">
            <form onSubmit={onSubmitHandler} className="flex gap-3">
                <input
                    value={message}
                    onChange={handleInputChange}
                    type="text"
                    className="flex-1 p-3.5 bg-white border border-cream-dark/85 rounded-xl text-charcoal placeholder-charcoal/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                    placeholder="Type a message..."
                />
                <button
                    type="submit"
                    className="px-5 py-2.5 bg-charcoal hover:bg-black text-white text-xs font-semibold rounded-xl shadow-sm transition cursor-pointer"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default SendMessage;
