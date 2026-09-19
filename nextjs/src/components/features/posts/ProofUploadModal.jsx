"use client";

import React, { useState } from 'react';
import axiosInstance from '@/api/axios';

const ProofUploadModal = ({ challengeText, onClose, onSuccess }) => {
    const [proofType, setProofType] = useState('image');
    const [file, setFile] = useState(null);
    const [proofUrl, setProofUrl] = useState('');
    const [timelineTaken, setTimelineTaken] = useState(1);
    const [loading, setLoading] = useState(false);
    const [visibility, setVisibility] = useState('public');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('challengeText', challengeText);
            formData.append('proofType', proofType);
            formData.append('timelineTaken', timelineTaken);
            formData.append('visibility', visibility);
            
            if (proofType === 'image' || proofType === 'video') {
                if (!file) {
                    setError('Please select a file to upload or switch to link mode.');
                    setLoading(false);
                    return;
                }
                formData.append('proofFile', file);
            } else {
                if (!proofUrl) {
                    setError('Please enter a valid URL.');
                    setLoading(false);
                    return;
                }
                formData.append('proofUrl', proofUrl);
            }

            const res = await axiosInstance.post('/posts/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (onSuccess) {
                onSuccess(res.data.post);
            }
        } catch (err) {
            console.error("Upload error", err);
            setError(err.response?.data?.message || 'Failed to upload proof');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans-clean">
            <div className="bg-cream-card border border-cream-dark/80 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative overflow-hidden text-charcoal">
                <h3 className="text-2xl font-serif-elegant font-bold text-charcoal mb-2 tracking-tight">Complete Challenge 🏆</h3>
                <p className="text-charcoal/60 font-medium italic text-xs mb-6">"{challengeText}"</p>
                
                {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-xl mb-6 text-xs font-semibold border border-rose-200">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-charcoal/70 font-semibold text-xs mb-1.5 block pl-1">Proof Type</label>
                        <select 
                            className="w-full bg-white border border-cream-dark/80 rounded-xl p-3 text-charcoal text-xs font-medium focus:outline-none focus:border-indigo-500 transition-all shadow-xs"
                            value={proofType}
                            onChange={(e) => setProofType(e.target.value)}
                        >
                            <option value="image">Image Upload</option>
                            <option value="video">Video Upload</option>
                            <option value="link">GitHub / Project Link</option>
                            <option value="blog">Blog / Article</option>
                        </select>
                    </div>

                    {(proofType === 'image' || proofType === 'video') ? (
                        <div>
                            <label className="text-charcoal/70 font-semibold text-xs mb-1.5 block pl-1">Upload File</label>
                            <input 
                                type="file" 
                                accept={proofType === 'image' ? 'image/*' : 'video/*'}
                                className="w-full bg-white border border-cream-dark/80 rounded-xl p-3 text-xs text-charcoal font-medium shadow-xs"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="text-charcoal/70 font-semibold text-xs mb-1.5 block pl-1">Paste Link</label>
                            <input 
                                type="url" 
                                placeholder="https://..."
                                className="w-full bg-white border border-cream-dark/80 rounded-xl p-3 text-charcoal text-xs font-medium focus:outline-none focus:border-indigo-500 transition-all shadow-xs"
                                value={proofUrl}
                                onChange={(e) => setProofUrl(e.target.value)}
                            />
                        </div>
                    )}

                    <div>
                        <label className="text-charcoal/70 font-semibold text-xs mb-1.5 block pl-1">Timeline Taken (Days)</label>
                        <input 
                            type="number" 
                            min="1"
                            className="w-full bg-white border border-cream-dark/80 rounded-xl p-3 text-charcoal text-xs font-bold focus:outline-none focus:border-indigo-500 transition-all shadow-xs"
                            value={timelineTaken}
                            onChange={(e) => setTimelineTaken(Number(e.target.value))}
                        />
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-cream-dark/80 shadow-xs">
                        <label className="text-charcoal font-bold text-xs mb-3 block pl-1 flex items-center gap-1.5">
                           Post Visibility <span>🔐</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setVisibility('public')}
                                className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all cursor-pointer ${visibility === 'public' ? 'border-charcoal bg-cream shadow-xs' : 'border-transparent bg-cream/40 text-charcoal/50'}`}
                            >
                                <span className="text-lg">🌐</span>
                                <div className="text-center">
                                    <span className="block text-[11px] font-bold">Public Feed</span>
                                    <span className="text-[9px] text-charcoal/40">Everyone can see</span>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setVisibility('private')}
                                className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all cursor-pointer ${visibility === 'private' ? 'border-charcoal bg-cream shadow-xs' : 'border-transparent bg-cream/40 text-charcoal/50'}`}
                            >
                                <span className="text-lg">🔒</span>
                                <div className="text-center">
                                    <span className="block text-[11px] font-bold">Only Me</span>
                                    <span className="text-[9px] text-charcoal/40">Private archive</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between gap-3 mt-4">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="bg-white hover:bg-cream text-charcoal/70 font-bold px-5 py-3 rounded-full border border-cream-dark text-xs transition-all flex-1 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-charcoal hover:bg-black text-white font-bold px-5 py-3 rounded-full transition-all shadow-md flex-1 flex justify-center items-center gap-2 text-xs cursor-pointer disabled:opacity-50"
                        >
                            {loading ? <span className="loading loading-spinner loading-xs"></span> : 'Submit Proof'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProofUploadModal;
