import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import LoaderScreen from "../../common/loaders/LoaderScreen.jsx";
import LoaderC from "../../common/loaders/LoaderC.jsx";
import ChallengeAcceptModal from "../challenges/ChallengeAcceptModal.jsx";

const Challenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customChallenge, setCustomChallenge] = useState("");
    const [showConfetti, setShowConfetti] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [showLoaderScreen, setShowLoaderScreen] = useState(false);
    const [selectedAcceptChallenge, setSelectedAcceptChallenge] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get("/challenges/generate-challenges");
                const validChallenges = (response.data.challenges || []).filter((challenge) => {
                    const text = challenge.text?.trim();
                    return text && text.length >= 5 && !/^[{\[\]}]$/.test(text);
                });
                setChallenges(validChallenges);
            } catch (error) {
                toast.error("Oops! Challenges couldn’t load.");
            } finally {
                setLoading(false);
            }
        };
        fetchChallenges();
    }, []);

    const handleAcceptClick = (challenge, index) => {
        setSelectedAcceptChallenge({ challenge, index });
    };

    const handleAcceptSuccess = (data) => {
        toast.success("Challenge accepted—go get it!");
        setChallenges((prev) => prev.filter((_, i) => i !== selectedAcceptChallenge.index));
        setSelectedAcceptChallenge(null);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
    };

    const handleSkip = async (index) => {
        try {
            await axiosInstance.post("/challenges/skip", {});
            toast.success("Skipped—next up!");
            setChallenges((prev) => prev.filter((_, i) => i !== index));
        } catch (error) {
            toast.error("Skip failed—try again!");
        }
    };

    const handleAddCustomChallenge = async () => {
        if (!customChallenge.trim()) {
            toast.error("Challenge can’t be empty!");
            return;
        }
        if (customChallenge.length < 5) {
            toast.error("Make it at least 5 characters!");
            return;
        }
        try {
            await axiosInstance.post("/challenges/custom", { challengeText: customChallenge });
            setChallenges((prev) => [
                ...prev,
                {
                    text: customChallenge,
                    objective: "Tackle your custom goal!",
                    motivation: "You’ve set the bar—reach it!",
                    benefits: ["Self-improvement", "Victory vibes"],
                },
            ]);
            setCustomChallenge("");
            toast.success("Challenge added—shine on!");
        } catch (error) {
            toast.error("Failed to add—retry!");
        }
    };

    const handleNextPage = () => {
        setShowLoader(true);
        setTimeout(() => {
            setShowLoader(false);
            setShowLoaderScreen(true);
            setTimeout(() => {
                setShowLoaderScreen(false);
                navigate("/dashboard");
            }, 4000);
        }, 3000);
    };

    return (
        <>
            {/* Loader Overlay */}
            {showLoader && (
                <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center">
                    <LoaderC isVisible={showLoader} />
                </div>
            )}

            {/* Loader Screen */}
            {showLoaderScreen && (
                <div className="fixed inset-0 z-[998] bg-gray-900">
                    <LoaderScreen />
                </div>
            )}

            {/* Accept Modal */}
            {selectedAcceptChallenge && (
                <ChallengeAcceptModal
                    challengeText={selectedAcceptChallenge.challenge.text}
                    onClose={() => setSelectedAcceptChallenge(null)}
                    onSuccess={handleAcceptSuccess}
                />
            )}

            {/* Main Content */}
            <div className="min-h-screen w-full bg-cream text-charcoal font-sans-clean p-6 md:p-10 relative overflow-hidden">
                {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header */}
                    <motion.header
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-serif-elegant font-normal text-charcoal mb-4 tracking-tight">
                            Dare Yourself<span className="text-indigo-600">.</span>
                        </h1>
                        <p className="text-sm sm:text-base text-charcoal/60 max-w-2xl mx-auto font-medium">
                            Step up, take on a challenge, and verify your progress.
                        </p>
                    </motion.header>

                    {/* Custom Challenge Input */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="w-full max-w-3xl mx-auto mb-12 bg-cream-card p-8 rounded-[2rem] shadow-xl border border-cream-dark/80"
                    >
                        <h2 className="text-lg font-serif-elegant font-normal text-charcoal mb-4">
                            Craft Your Own Challenge
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                value={customChallenge}
                                onChange={(e) => setCustomChallenge(e.target.value)}
                                placeholder="e.g., 'Run 5km this week'"
                                className="flex-1 px-4 py-3.5 bg-white border border-cream-dark/80 rounded-2xl text-charcoal placeholder-charcoal/30 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-sm font-medium"
                                onKeyPress={(e) => e.key === "Enter" && handleAddCustomChallenge()}
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddCustomChallenge}
                                className="px-6 py-3.5 bg-charcoal hover:bg-black text-white rounded-full shadow-md transition-all font-semibold text-sm cursor-pointer"
                            >
                                Add Challenge
                            </motion.button>
                        </div>
                        <p className="mt-2.5 text-xs text-charcoal/40 font-medium">Minimum 5 characters required.</p>
                    </motion.div>

                    {/* Challenges List */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-serif-elegant font-normal text-charcoal mb-8 text-center">Available Challenges</h2>
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="w-12 h-12 border-2 border-indigo-600 border-t-transparent rounded-full"
                                />
                            </div>
                        ) : challenges.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <AnimatePresence>
                                    {challenges.map((challenge, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.4, delay: index * 0.05 }}
                                            className="p-6 bg-cream-card rounded-3xl shadow-md border border-cream-dark/80 flex flex-col justify-between hover:shadow-lg transition-shadow"
                                        >
                                            <div>
                                                <div className="flex items-start gap-3 mb-4">
                                                    <span className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 flex items-center justify-center">
                                                        <i className="fa-solid fa-circle-check text-sm"></i>
                                                    </span>
                                                    <h3 className="text-base font-semibold text-charcoal mt-1">{challenge.text}</h3>
                                                </div>
                                                <div className="space-y-4 flex-1 mt-6">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Goal</p>
                                                        <p className="text-sm text-charcoal/70">{challenge.objective}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Why</p>
                                                        <p className="text-sm text-charcoal/70">{challenge.motivation}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Wins</p>
                                                        <ul className="list-disc list-inside text-sm text-charcoal/70 space-y-1">
                                                            {challenge.benefits.map((benefit, i) => (
                                                                <li key={i}>{benefit}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-3 pt-6 mt-6 border-t border-cream-dark/60">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleAcceptClick(challenge, index)}
                                                    className="flex-1 px-4 py-2 bg-charcoal hover:bg-black text-white rounded-xl shadow-sm transition-all font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                                                >
                                                    <i className="fa-solid fa-plus text-[10px]"></i>
                                                    Accept
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleSkip(index)}
                                                    className="flex-1 px-4 py-2 bg-white hover:bg-cream/40 border border-cream-dark/85 text-charcoal/70 rounded-xl shadow-sm transition-all font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                                                >
                                                    <i className="fa-solid fa-forward text-[10px]"></i>
                                                    Skip
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16 bg-cream-card rounded-3xl shadow-md border border-cream-dark/80"
                            >
                                <i className="fa-solid fa-triangle-exclamation text-indigo-600 text-4xl mb-4"></i>
                                <h3 className="text-lg font-serif-elegant font-normal text-charcoal mb-2">No Challenges Yet</h3>
                                <p className="text-sm text-charcoal/60 max-w-sm mx-auto">Create your own challenge above or wait for new ones!</p>
                            </motion.div>
                        )}
                    </section>

                    {/* Next Page Button */}
                    <div className="text-center">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleNextPage}
                            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all font-semibold flex items-center gap-2 mx-auto cursor-pointer text-sm"
                        >
                            To Dashboard
                            <i className="fa-solid fa-arrow-right text-xs"></i>
                        </motion.button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Challenges;