import { useEffect, useState } from "react";
import axiosInstance, { ROOT_URL } from "../../../api/axios";
import { motion } from "framer-motion";
import Score from "../challenge_tab/score";

const Profile = ({ refetchTrigger }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get("/user/profile");
                setUser(res.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUser();
    }, [refetchTrigger]);

    if (!user) {
        return (
            <div className="flex justify-center items-center h-64 bg-cream-card border border-cream-dark/80 rounded-[2.5rem] shadow-md max-w-sm mx-auto w-full">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-10 w-10 border-t-2 border-indigo-600 border-r-2 border-r-transparent"
                ></motion.div>
            </div>
        );
    }

    const profilePhotoUrl = user.profilePhoto?.startsWith("http")
        ? user.profilePhoto
        : user.profilePhoto
        ? `${ROOT_URL}${user.profilePhoto}`
        : `https://ui-avatars.com/api/?name=${user.fullName || "User"}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 bg-cream-card border border-cream-dark/80 rounded-[2.5rem] shadow-xl text-center max-w-sm mx-auto font-sans-clean flex flex-col items-center w-full"
        >
            <motion.div 
                whileHover={{ scale: 1.03 }}
                className="relative w-28 h-28 mb-5"
            >
                <img
                    src={profilePhotoUrl}
                    alt="Profile"
                    onError={(e) => (e.target.src = `https://ui-avatars.com/api/?name=${user.fullName || "User"}`)}
                    className="w-full h-full object-cover rounded-full border border-cream-dark/80 shadow-md"
                />
            </motion.div>
            
            <h2 className="text-2xl font-serif-elegant font-normal text-charcoal mb-1">
                {user.fullName || "User"}
            </h2>
            <p className="text-charcoal/50 text-xs mb-6 font-medium">@{user.username}</p>
            
            <div className="w-full">
                <Score score={user.score || 0} />
            </div>
        </motion.div>
    );
};

export default Profile;