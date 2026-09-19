"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/api/axios";

export default function DailyQuotes() {
    const [quote, setQuote] = useState("Loading inspirational quote...");
    const [author, setAuthor] = useState("");

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const response = await axiosInstance.get("/quotes/random");
                const data = response.data;
                if (data) {
                    setQuote(data.text);
                    setAuthor(data.author);
                } else {
                    setQuote("Believe in yourself and all that you are.");
                    setAuthor("Christian D. Larson");
                }
            } catch (error) {
                console.error("Error fetching quote:", error);
                setQuote("The best way to predict the future is to create it.");
                setAuthor("Peter Drucker");
            }
        };

        fetchQuote();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="p-8 bg-cream-card border border-cream-dark/80 rounded-3xl text-center shadow-md font-sans-clean flex flex-col items-center justify-center"
        >
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-4 block">
                Daily Inspiration
            </span>
            <p className="text-lg sm:text-xl font-serif-elegant font-normal text-charcoal leading-relaxed italic max-w-xl">
                "{quote}"
            </p>
            <p className="text-xs text-charcoal/40 mt-3.5 font-bold">
                — {author}
            </p>
        </motion.div>
    );
}
