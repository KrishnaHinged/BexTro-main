import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../api/axios";
import { toast } from "react-hot-toast";
import { setAuthUser } from "../redux/userSlice";

import MainSlideBar from "../components/layout/MainSlideBar.jsx";
import PageLoader from "../components/common/loaders/pagesLoader.jsx";
import ErrorBoundary from "../components/common/ErrorBoundary";
import RewardPopup from "../components/features/posts/RewardPopup.jsx";

// Profile-specific components
import GamificationUI from "../components/features/profile/GamificationUI.jsx";
import ChallengesSection from "../components/features/profile/ChallengesSection.jsx";
import RequestsSection from "../components/features/profile/RequestsSection.jsx";
import ConnectionsSection from "../components/features/profile/ConnectionsSection.jsx";
import ProofModal from "../components/features/profile/ProofModal.jsx";
import Header from "../components/features/profile/Header.jsx";

const TABS = ["challenges", "requests", "connections"];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("challenges");
  const [connectionRequests, setConnectionRequests] = useState({ received: [], sent: [] });
  const [connections, setConnections] = useState([]);
  const [completedPosts, setCompletedPosts] = useState([]);
  const [rewardData, setRewardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const dispatch = useDispatch();
  const { authUser, isAuthenticated } = useSelector((state) => state.user);
  const isRehydrated = useSelector((state) => state._persist?.rehydrated);

  const acceptedChallenges = authUser?.acceptedChallenges || [];

  // ─── Data Fetching ────────────────────────────────────────────────────────────

  const fetchProfileData = async () => {
    if (!authUser?._id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [profileRes, requestsRes, connectionsRes, postsRes] = await Promise.all([
        axiosInstance.get("/user/profile"),
        axiosInstance.get("/user/connections/requests"),
        axiosInstance.get("/user/connections"),
        axiosInstance.get(`/posts/user/${authUser._id}`),
      ]);

      dispatch(setAuthUser(profileRes.data));
      setConnectionRequests(requestsRes.data);
      setConnections(connectionsRes.data);
      setCompletedPosts(postsRes.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && authUser) fetchProfileData();
  }, [authUser?._id, isAuthenticated]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleProofSuccess = (responseData) => {
    if (responseData.post) {
      setCompletedPosts((prev) => [responseData.post, ...prev]);
    }
    if (responseData.rewards) {
      setRewardData(responseData.rewards);
    }
    fetchProfileData();
    window.dispatchEvent(new Event("bextroFeedRefresh"));
  };

  const handleDropChallenge = async (challengeText) => {
    try {
      setActionLoading(true);
      await axiosInstance.post("/challenges/abandon", { challengeText });
      toast.success("Challenge dropped successfully");
      await fetchProfileData();
    } catch (error) {
      toast.error("Failed to abandon challenge");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      await axiosInstance.post(`/user/${userId}/accept`, {});
      toast.success("Connection request accepted!");
      await fetchProfileData();
    } catch (error) {
      toast.error("Failed to accept request!");
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      await axiosInstance.post(`/user/${userId}/reject`, {});
      toast.success("Connection request rejected!");
      await fetchProfileData();
    } catch (error) {
      toast.error("Failed to reject request!");
    }
  };

  const handleToggleVisibility = async (postId, currentVisibility) => {
    try {
      const newVisibility = currentVisibility === "public" ? "private" : "public";
      await axiosInstance.put(`/posts/${postId}/visibility`, { visibility: newVisibility });
      toast.success(`Post is now ${newVisibility === "private" ? "Private" : "Public"}`);
      setCompletedPosts((prev) =>
        prev.map((post) => (post._id === postId ? { ...post, visibility: newVisibility } : post))
      );
    } catch (error) {
      toast.error("Failed to update visibility");
    }
  };

  // ─── Guards ───────────────────────────────────────────────────────────────────

  if (!isRehydrated) return <PageLoader message="Loading profile..." />;

  if (!isAuthenticated || !authUser) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center font-sans-clean px-4">
        <div className="bg-cream-card rounded-[2.5rem] border border-cream-dark/80 p-8 sm:p-10 shadow-xl text-center max-w-sm w-full">
          <h2 className="text-2xl font-serif-elegant font-normal text-charcoal mb-4">Please Sign In</h2>
          <p className="text-charcoal/60 text-sm mb-6">You need to be logged in to view your profile.</p>
          <a href="/signin" className="bg-charcoal hover:bg-black text-white px-6 py-3 rounded-full font-bold shadow-md block text-sm transition-all">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (loading) return <PageLoader message="Preparing your profile..." />;

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">

        {/* SIDEBAR */}
        <MainSlideBar />

        <div className="flex-1 overflow-y-auto">

          {/* TOP BAR */}
          <div className="px-6 md:px-8 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Header user={authUser} connections={connections} />
            </div>
            <div className="lg:col-span-2">
              <GamificationUI user={authUser} score={authUser.score || 0} />
            </div>
          </div>

          {/* MAIN TABS */}
          <div className="px-6 md:px-8 mt-8 flex gap-3.5">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`px-5 py-2.5 rounded-full font-semibold capitalize transition text-xs tracking-wider cursor-pointer ${
                  activeTab === tab
                    ? "bg-charcoal text-white shadow-md font-bold"
                    : "bg-white border border-cream-dark/65 text-charcoal/60 hover:bg-white/80"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* CONTENT AREA */}
          <div className="px-6 md:px-8 mt-8 pb-16">

            {activeTab === "challenges" && (
              <div className="space-y-6">
                <ChallengesSection
                  acceptedChallenges={acceptedChallenges}
                  completedPosts={completedPosts}
                  actionLoading={actionLoading}
                  onRequestProof={setSelectedChallenge}
                  onDrop={handleDropChallenge}
                  onToggleVisibility={handleToggleVisibility}
                />
              </div>
            )}

            {activeTab === "requests" && (
              <div className="max-w-3xl">
                <RequestsSection
                  requests={connectionRequests}
                  onAccept={handleAcceptRequest}
                  onReject={handleRejectRequest}
                />
              </div>
            )}

            {activeTab === "connections" && (
              <div className="max-w-4xl">
                <ConnectionsSection connections={connections} />
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Proof Submission Modal */}
      {selectedChallenge && (
        <ProofModal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onSuccess={handleProofSuccess}
        />
      )}

      {/* Reward Popup */}
      {rewardData && (
        <RewardPopup
          rewards={rewardData}
          onClose={() => {
            setRewardData(null);
            fetchProfileData();
          }}
        />
      )}
    </ErrorBoundary>
  );
};

export default Profile;