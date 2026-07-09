import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance, { ROOT_URL } from '../api/axios.js';
import MainSlideBar from '../components/layout/MainSlideBar.jsx';
import PostCard from '../components/features/posts/PostCard.jsx';
import ChallengeCard from '../components/features/challenge_tab/ChallengeCard.jsx';
import Masonry from 'react-masonry-css';
import { toast } from 'react-hot-toast';

const UserProfile = () => {
    const { userId } = useParams();
    const { authUser: currentUser } = useSelector(store => store.user);
    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('proofs');
    
    // UI state
    const [connectionStatus, setConnectionStatus] = useState("none");
    const [isFollowing, setIsFollowing] = useState(false);
    const [shouldHideContent, setShouldHideContent] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);

    const fetchUserData = async () => {
        try {
            const [postRes, profileRes] = await Promise.all([
                axiosInstance.get(`/posts/user/${userId}`),
                axiosInstance.get(`/user/profile/${userId}`)
            ]);
            
            setPosts(postRes.data);
            setProfileUser(profileRes.data.user);
            setConnectionStatus(profileRes.data.connectionStatus);
            setIsFollowing(profileRes.data.isFollowing);
            setShouldHideContent(profileRes.data.shouldHideContent);
            setFollowersCount(profileRes.data.followersCount);
            
        } catch (error) {
            console.error("Error fetching user profile", error);
            toast.error("Failed to load profile.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserData();
        }
    }, [userId, currentUser]);

    const handleFollow = async () => {
        try {
            const res = await axiosInstance.post(`/user/${userId}/follow`, {});
            setIsFollowing(res.data.isFollowing);
            setFollowersCount(prev => res.data.isFollowing ? prev + 1 : prev - 1);
            toast.success(res.data.message);
        } catch (error) {
            toast.error("Follow action failed.");
        }
    };

    const handleConnect = async () => {
        try {
            if (connectionStatus === "none") {
                await axiosInstance.post(`/user/${userId}/connect`, {});
                setConnectionStatus("pending");
                toast.success("Connection request sent!");
            } else if (connectionStatus === "received") {
                await axiosInstance.post(`/user/${userId}/accept`, {});
                setConnectionStatus("connected");
                toast.success("You are now connected!");
            }
        } catch (error) {
            toast.error("Connection action failed.");
        }
    };

    if (!currentUser) return <Navigate to="/signin" />;
    
    if (loading) return (
        <div className="min-h-screen bg-cream flex justify-center items-center">
            <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const profilePhotoUrl = profileUser?.profilePhoto?.startsWith("http")
        ? profileUser.profilePhoto
        : profileUser?.profilePhoto
        ? `${ROOT_URL}${profileUser.profilePhoto}`
        : `https://ui-avatars.com/api/?name=${profileUser?.username || "User"}`;

    const masonryBreakpoints = {
        default: 3,
        1100: 2,
        700: 1
    };

    return (
        <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">
            <MainSlideBar />

            <div className="flex-1 overflow-y-auto">
                <div className="pt-16 px-6 md:px-12 max-w-6xl mx-auto pb-20">
                    
                    {/* Pinterest Style Header */}
                    <div className="flex flex-col items-center mb-12">
                        <div className="relative mb-6">
                            <img 
                                src={profilePhotoUrl} 
                                onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${profileUser?.username || "User"}`}
                                alt="Profile" 
                                className="w-32 h-32 md:w-36 md:h-36 rounded-[2rem] border border-cream-dark/80 shadow-md object-cover hover:scale-105 transition-transform duration-500 bg-white"
                            />
                            {profileUser?.role === 'admin' && (
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-bold px-4 py-1.5 rounded-full shadow-md tracking-wider uppercase">Admin</div>
                            )}
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl font-serif-elegant font-normal text-charcoal mb-2 tracking-tight">
                            {profileUser?.fullName}
                        </h1>
                        <p className="text-charcoal/50 font-bold text-base mb-6">@{profileUser?.username}</p>
                        
                        <div className="flex gap-10 mb-8">
                            <div className="text-center group cursor-default">
                                <span className="block text-2xl font-bold text-charcoal">{posts.length}</span>
                                <span className="text-charcoal/40 text-[10px] font-bold uppercase tracking-wider mt-0.5 block">Proofs</span>
                            </div>
                            <div className="text-center group cursor-default">
                                <span className="block text-2xl font-bold text-charcoal">{followersCount}</span>
                                <span className="text-charcoal/40 text-[10px] font-bold uppercase tracking-wider mt-0.5 block">Followers</span>
                            </div>
                            <div className="text-center group cursor-default">
                                <span className="block text-2xl font-bold text-charcoal">{profileUser?.score || 0}</span>
                                <span className="text-charcoal/40 text-[10px] font-bold uppercase tracking-wider mt-0.5 block">XP Score</span>
                            </div>
                        </div>

                        {currentUser._id !== userId && (
                            <div className="flex gap-4">
                                <button 
                                    onClick={handleFollow}
                                    className={`px-8 py-3 rounded-full font-bold text-xs shadow-sm transition-all cursor-pointer border ${
                                        isFollowing 
                                            ? 'bg-cream border-cream-dark/80 text-charcoal/70 hover:bg-cream/40' 
                                            : 'bg-charcoal border-charcoal text-white hover:bg-black'
                                    }`}
                                >
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>
                                
                                <button 
                                    onClick={handleConnect}
                                    className={`px-8 py-3 rounded-full font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer border ${
                                        connectionStatus === 'connected' ? 'bg-indigo-600 border-indigo-600 text-white' : 
                                        connectionStatus === 'pending' ? 'bg-cream border-cream-dark/80 text-charcoal/40 cursor-not-allowed' : 
                                        connectionStatus === 'received' ? 'bg-amber-500 border-amber-500 text-white animate-bounce' :
                                        'bg-white text-charcoal border-cream-dark/80 hover:bg-cream/40'
                                    }`}
                                    disabled={connectionStatus === 'pending' || connectionStatus === 'connected'}
                                >
                                    {connectionStatus === 'connected' ? 'Connected ✓' : 
                                     connectionStatus === 'pending' ? 'Requested' : 
                                     connectionStatus === 'received' ? 'Accept Request' :
                                     'Message +'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Tabs Selector */}
                    <div className="flex justify-center mb-10 pb-4">
                        <div className="flex bg-cream-card border border-cream-dark/80 p-1.5 rounded-full w-72 shadow-sm">
                            <button 
                                className={`flex-1 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                                    activeTab === 'proofs'
                                        ? 'bg-charcoal text-white shadow-sm font-bold'
                                        : 'text-charcoal/50 hover:text-charcoal'
                                }`}
                                onClick={() => setActiveTab('proofs')}
                            >
                                History of Proofs
                            </button>
                            <button 
                                className={`flex-1 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                                    activeTab === 'ongoing'
                                        ? 'bg-charcoal text-white shadow-sm font-bold'
                                        : 'text-charcoal/50 hover:text-charcoal'
                                }`}
                                onClick={() => setActiveTab('ongoing')}
                            >
                                Active Targets
                            </button>
                        </div>
                    </div>

                    {shouldHideContent ? (
                      <div className="flex flex-col items-center justify-center py-20 bg-cream-card border border-cream-dark/80 rounded-[2.5rem] shadow-sm max-w-xl mx-auto">
                          <div className="w-16 h-16 bg-white border border-cream-dark/60 rounded-full flex items-center justify-center text-charcoal/20 mb-6 shadow-inner">
                            <i className="fa-solid fa-lock text-2xl"></i>
                          </div>
                          <h3 className="text-lg font-serif-elegant font-normal text-charcoal mb-2">This Account is Private</h3>
                          <p className="text-charcoal/50 text-xs sm:text-sm max-w-sm text-center font-medium leading-relaxed px-6">
                            Follow or connect with <span className="text-indigo-600 font-bold">@{profileUser?.username}</span> to see their challenge proofs and shared activity.
                          </p>
                      </div>
                    ) : (
                      <>
                        {activeTab === 'proofs' && (
                            <div>
                                {posts.length > 0 ? (
                                    <Masonry
                                        breakpointCols={masonryBreakpoints}
                                        className="flex w-auto -ml-4"
                                        columnClassName="pl-4 pb-4"
                                    >
                                        {posts.map(post => <PostCard key={post._id} post={post} currentUser={currentUser} />)}
                                    </Masonry>
                                ) : (
                                    <div className="text-center py-20 bg-cream-card rounded-[2.5rem] border border-cream-dark/80 shadow-sm max-w-xl mx-auto">
                                        <div className="w-12 h-12 bg-white border border-cream-dark/60 rounded-full flex items-center justify-center text-charcoal/20 mb-4 shadow-inner mx-auto">
                                            <i className="fa-solid fa-moon text-lg"></i>
                                        </div>
                                        <p className="text-charcoal/45 text-xs font-semibold uppercase tracking-wider">No proofs documented yet</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'ongoing' && (
                            <div>
                                {profileUser?.acceptedChallenges?.filter(c => c.status === 'active').length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {profileUser.acceptedChallenges.filter(c => c.status === 'active').map((challenge, idx) => (
                                            <div key={challenge._id || idx} className="opacity-95 transform hover:scale-[1.01] transition-transform">
                                                <ChallengeCard challenge={challenge} index={idx} onComplete={()=>{}} onAbandon={()=>{}} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-cream-card rounded-[2.5rem] border border-cream-dark/80 shadow-sm max-w-xl mx-auto">
                                        <div className="w-12 h-12 bg-white border border-cream-dark/60 rounded-full flex items-center justify-center text-charcoal/20 mb-4 shadow-inner mx-auto">
                                            <i className="fa-solid fa-cloud-sun text-lg"></i>
                                        </div>
                                        <p className="text-charcoal/45 text-xs font-semibold uppercase tracking-wider">No active challenges currently</p>
                                    </div>
                                )}
                            </div>
                        )}
                      </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
