"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/api/axios";
import { motion } from "framer-motion";

export default function Startup() {
    const [news, setNews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axiosInstance.get("/news");
                if (response.data.articles) {
                    setNews(response.data.articles);
                }
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % news.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
    };

    if (loading) {
        return (
            <div className="p-8 bg-dark-green text-sand border border-emerald-800/15 rounded-[2.5rem] shadow-lg flex justify-center items-center h-64">
                <div className="animate-pulse flex space-x-4 w-full">
                    <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-emerald-800/20 rounded w-3/4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-emerald-800/20 rounded"></div>
                            <div className="h-4 bg-emerald-800/20 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-8 bg-dark-green text-sand border border-emerald-800/15 rounded-[2.5rem] shadow-xl font-sans-clean"
        >
            <h2 className="text-xl sm:text-2xl font-serif-elegant font-normal text-white mb-6 flex items-center">
                💡 Startup Spotlight
            </h2>
            
            {news.length > 0 ? (
                <div className="flex flex-col md:flex-row gap-8">
                    <motion.div 
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full md:w-1/2"
                    >
                        <img
                            src={news[currentIndex]?.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=60"}
                            alt="News"
                            className="w-full h-56 object-cover rounded-2xl shadow-md border border-emerald-800/20"
                        />
                    </motion.div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-base sm:text-lg font-serif-elegant font-normal text-white mb-2 leading-snug">
                                {news[currentIndex]?.title}
                            </h3>
                            <p className="text-sand/70 text-xs sm:text-sm leading-relaxed">
                                {news[currentIndex]?.description}
                            </p>
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <button
                                onClick={handlePrev}
                                className="px-4 py-2 border border-sand/20 hover:bg-sand/5 text-sand text-xs font-semibold rounded-full transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent"
                            >
                                Prev
                            </button>
                            <button
                                onClick={handleNext}
                                className="px-5 py-2 bg-sand hover:bg-sand/90 text-dark-green text-xs font-semibold rounded-full shadow-md transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-sand/60 text-sm">No news articles available</p>
            )}
        </motion.div>
    );
}
