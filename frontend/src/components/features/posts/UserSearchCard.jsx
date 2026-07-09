import { useNavigate } from 'react-router-dom';
import { ROOT_URL } from '../../../api/axios';

const UserSearchCard = ({ user }) => {
    const navigate = useNavigate();

    const profilePhotoUrl = user.profilePhoto?.startsWith("http")
        ? user.profilePhoto
        : user.profilePhoto
            ? `${ROOT_URL}${user.profilePhoto}`
            : `https://ui-avatars.com/api/?name=${user.username || "User"}`;

    return (
        <div 
            onClick={() => navigate(`/user/${user._id}`)}
            className="flex items-center gap-4 p-4 bg-white border border-cream-dark/60 hover:bg-cream/40 rounded-2xl cursor-pointer transition shadow-sm font-sans-clean"
        >
            <div className="relative">
                <img 
                    src={profilePhotoUrl} 
                    onError={(e) => (e.target.src = "https://ui-avatars.com/api/?name=User")}
                    alt={user.username} 
                    className="w-12 h-12 rounded-xl object-cover border border-cream-dark shadow-sm"
                />
                {user.isPrivate && (
                    <span className="absolute -bottom-1 -right-1 bg-white border border-cream-dark rounded-full p-0.5 shadow-sm flex items-center justify-center">
                        <span className="text-[8px]">🔒</span>
                    </span>
                )}
            </div>
            
            <div className="flex-1 overflow-hidden">
                <h4 className="font-bold text-charcoal text-sm truncate">{user.fullName}</h4>
                <p className="text-xs text-indigo-600 font-semibold truncate">@{user.username}</p>
            </div>

            <div className="flex items-center gap-2">
                {user.connectionStatus === 'connected' ? (
                    <button className="bg-cream border border-cream-dark/80 text-charcoal/50 font-bold px-3 py-1.5 rounded-full text-[10px] pointer-events-none">
                        Connected
                    </button>
                ) : (
                    <button className="bg-charcoal hover:bg-black text-white font-bold px-4 py-1.5 rounded-full text-[10px] shadow-sm transition">
                        View
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserSearchCard;
