import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { MessageCircle, Send, Ghost, Sparkles, TrendingUp, History, Shield, Zap, Lock, ArrowBigUp, ArrowBigDown } from 'lucide-react';

const Confessions = () => {
    const { user } = useAuth();
    const [confessions, setConfessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newConfession, setNewConfession] = useState('');

    useEffect(() => {
        fetchConfessions();
    }, []);

    const fetchConfessions = async () => {
        try {
            const schoolId = user.role === 'school' ? user.id : user.schoolId;
            const response = await API.get(`/confessions?schoolId=${schoolId}`);
            setConfessions(response.data.confessions);
        } catch (error) {
            console.error('Error fetching confessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (confessionId, type) => {
        try {
            const response = await API.post(`/confessions/${confessionId}/vote`, { type });
            const { voteScore, upvotes, downvotes } = response.data;

            setConfessions(confessions.map(c =>
                c._id === confessionId ? { ...c, voteScore, upvotes, downvotes } : c
            ));
        } catch (error) {
            console.error('Vote Error:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newConfession.trim()) return;

        try {
            const schoolId = user.role === 'school' ? user.id : user.schoolId;
            await API.post('/confessions', {
                content: newConfession,
                schoolId
            });
            setNewConfession('');
            fetchConfessions();
        } catch (error) {
            console.error('Submit Confession Error:', error);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + date.toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-[#FAFAFB] pb-24">
            {/* Boutique Header */}
            <div className="bg-indigo-950 pt-16 pb-32 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
                    <div className="inline-flex items-center space-x-3 bg-white/5 px-5 py-2.5 rounded-full mb-8 border border-white/5 backdrop-blur-xl">
                        <Lock className="h-4 w-4 text-primary-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-200 italic">Total Anonymity Protocol</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 uppercase italic leading-none">
                        The <span className="text-primary-500">Whisper</span> Wall.
                    </h1>
                    <p className="text-xl text-primary-100/30 max-w-2xl mx-auto font-medium italic leading-relaxed">
                        "Your secrets are safe with the ghosts of EduMart." <br />Anonymous, ephemeral, and encrypted.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 lg:px-10 -mt-20 pb-12 relative z-20">
                {/* Whisper Input */}
                {user.role === 'student' && (
                    <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-indigo-950/5 p-8 lg:p-12 mb-12 border border-gray-50 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 h-32 w-32 bg-indigo-50/50 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000"></div>
                        <form onSubmit={handleSubmit} className="relative z-10">
                            <label className="block text-[10px] font-black text-indigo-950 uppercase tracking-[0.3em] mb-6 flex items-center italic">
                                <Sparkles className="h-3 w-3 mr-2 text-primary-500" /> Initiate New Whisper
                            </label>
                            <textarea
                                className="w-full h-40 p-10 bg-gray-50/50 rounded-[2.5rem] border border-transparent focus:border-primary-100 focus:bg-white outline-none transition-all duration-500 resize-none font-bold text-indigo-950 text-xl placeholder:text-gray-300 italic shadow-inner"
                                placeholder="What's happening in the halls? No names, just vibes..."
                                value={newConfession}
                                onChange={(e) => setNewConfession(e.target.value)}
                            />
                            <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-6">
                                <div className="flex items-center space-x-6 text-gray-300">
                                    <div className="flex items-center space-x-2">
                                        <Shield size={14} className="text-emerald-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest italic">Encrypted</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp size={14} className="text-indigo-400" />
                                        <span className="text-[9px] font-black uppercase tracking-widest italic">Trending Matrix</span>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full md:w-auto bg-indigo-950 hover:bg-primary-600 text-white px-12 py-5 rounded-[2rem] font-black text-[10px] shadow-2xl transition-all duration-500 hover:-translate-y-1 uppercase tracking-widest italic flex items-center justify-center space-x-3 group/btn"
                                >
                                    <span>Release Whisper</span>
                                    <Zap size={14} className="group-hover/btn:scale-125 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Whisper Feed */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent"></div>
                        <p className="text-gray-300 font-black uppercase text-[9px] tracking-[0.3em] mt-8 italic">Summoning Whispers...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {confessions.length === 0 ? (
                            <div className="bg-white rounded-[4rem] p-32 text-center border border-gray-100 shadow-2xl shadow-indigo-950/5">
                                <div className="bg-gray-50 h-24 w-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-white shadow-inner">
                                    <Ghost className="h-10 w-10 text-gray-200" />
                                </div>
                                <h3 className="text-3xl font-black text-indigo-950 mb-4 tracking-tighter uppercase italic leading-none">The wall is silent.</h3>
                                <p className="text-gray-400 font-medium italic">Be the first to break the silence.</p>
                            </div>
                        ) : (
                            confessions.map((c, i) => {
                                const isUpvoted = c.upvotes?.includes(user.id);
                                const isDownvoted = c.downvotes?.includes(user.id);

                                return (
                                    <div key={c._id} className="group relative bg-white rounded-[3.5rem] shadow-2xl shadow-indigo-950/5 border border-transparent hover:border-primary-100 transition-all duration-700 hover:-translate-y-2 overflow-hidden flex">
                                        {/* Voting Sidebar */}
                                        <div className="bg-gray-50/50 w-20 flex flex-col items-center py-10 space-y-4 border-r border-gray-100">
                                            <button
                                                onClick={() => handleVote(c._id, 'up')}
                                                className={`p-2 rounded-xl transition-all ${isUpvoted ? 'bg-orange-100 text-orange-500 shadow-lg scale-110' : 'text-gray-300 hover:text-orange-500 hover:bg-orange-50'}`}
                                            >
                                                <ArrowBigUp size={28} fill={isUpvoted ? "currentColor" : "none"} />
                                            </button>
                                            <span className={`text-sm font-black italic ${c.voteScore > 0 ? 'text-orange-500' : c.voteScore < 0 ? 'text-indigo-500' : 'text-gray-400'}`}>
                                                {c.voteScore || 0}
                                            </span>
                                            <button
                                                onClick={() => handleVote(c._id, 'down')}
                                                className={`p-2 rounded-xl transition-all ${isDownvoted ? 'bg-indigo-100 text-indigo-500 shadow-lg scale-110' : 'text-gray-300 hover:text-indigo-500 hover:bg-indigo-50'}`}
                                            >
                                                <ArrowBigDown size={28} fill={isDownvoted ? "currentColor" : "none"} />
                                            </button>
                                        </div>

                                        <div className="flex-1 p-10 lg:p-12">
                                            <div className="absolute top-0 right-0 p-12 transform group-hover:rotate-12 group-hover:scale-110 transition-transform duration-1000 select-none">
                                                <Ghost className="h-16 w-16 text-indigo-50 opacity-10" />
                                            </div>
                                            <div className="relative z-10">
                                                <div className="flex items-center space-x-4 mb-8">
                                                    <div className="h-10 w-10 rounded-[1.2rem] bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-[10px] border border-indigo-100 shadow-inner italic">
                                                        #{confessions.length - i}
                                                    </div>
                                                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest italic">Original Whisper</span>
                                                </div>
                                                <p className="text-indigo-950 text-2xl lg:text-3xl font-black leading-[1.3] mb-10 italic tracking-tighter">"{c.content}"</p>

                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-8 border-t border-gray-50 gap-4">
                                                    <div className="flex items-center space-x-3 text-indigo-300">
                                                        <History size={14} />
                                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">{formatTime(c.createdAt)}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-emerald-500/50">
                                                        <Shield size={12} />
                                                        <span className="text-[8px] font-black uppercase italic tracking-widest">Verified Anonymity</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Confessions;
