import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { BarChart3, Clock, Plus, Timer, User, Users, CheckCircle, Trash2, Sparkles, Activity, Zap, X, ChevronRight, ShieldCheck } from 'lucide-react';

const Polls = () => {
    const { user } = useAuth();
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        question: '',
        options: ['', ''],
        duration: 24
    });

    useEffect(() => {
        if (user && (user.id || user.schoolId)) fetchPolls();
    }, [user]);

    if (!user) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFB]">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent"></div>
            <p className="text-gray-300 font-black uppercase text-[9px] tracking-[0.3em] mt-8 italic">Synchronizing Pulse...</p>
        </div>
    );

    const fetchPolls = async () => {
        try {
            const schoolId = user.role === 'school' ? user.id : user.schoolId;
            const response = await API.get(`/polls?schoolId=${schoolId}`);
            setPolls(response.data.polls || []);
        } catch (error) {
            console.error('Error fetching polls:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (pollId, optionIndex) => {
        try {
            await API.put(`/polls/vote/${pollId}`, {
                userId: user.id,
                optionIndex
            });
            fetchPolls();
        } catch (error) {
            console.error('Vote Error:', error);
        }
    };

    const handleEndPoll = async (pollId) => {
        if (!window.confirm('End this poll now?')) return;
        try {
            await API.put(`/polls/${pollId}/end`, { userId: user.id });
            fetchPolls();
        } catch (error) {
            console.error('End Poll Error:', error);
        }
    };

    const handleCreatePoll = async (e) => {
        e.preventDefault();
        try {
            const schoolId = user.role === 'school' ? user.id : user.schoolId;
            await API.post('/polls/create', {
                ...formData,
                createdBy: user.id,
                schoolId,
                durationHours: formData.duration
            });
            setShowModal(false);
            setFormData({ question: '', options: ['', ''], duration: 24 });
            fetchPolls();
        } catch (error) {
            console.error('Create Poll Error:', error);
        }
    };

    const getTimeRemaining = (expiryDate) => {
        const total = Date.parse(expiryDate) - Date.parse(new Date());
        if (total <= 0) return 'Expired';
        const hours = Math.floor((total / (1000 * 60 * 60)));
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return `${hours}h ${minutes}m`;
    };

    const isExpired = (expiryDate) => new Date() > new Date(expiryDate);

    return (
        <div className="min-h-screen bg-[#FAFAFB] pb-24">
            {/* Boutique Header */}
            <div className="bg-indigo-950 pt-16 pb-32 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-2/3 h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
                    <div className="inline-flex items-center space-x-3 bg-white/5 px-5 py-2.5 rounded-full mb-8 border border-white/5 backdrop-blur-xl">
                        <Activity size={14} className="text-primary-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-200 italic">Collective Intelligence</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 uppercase italic leading-none">
                        School <span className="text-primary-500">Pulse.</span>
                    </h1>
                    <p className="text-xl text-primary-100/30 max-w-2xl mx-auto font-medium italic leading-relaxed">
                        Quantifying the campus sentiment. <br />Safe, transparent, and democratic decision making.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 lg:px-10 -mt-20 pb-12 relative z-20">
                {/* Search & Actions Hub */}
                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-indigo-950/5 p-4 mb-12 border border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-6 px-8 py-4">
                        <div className="text-left">
                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic mb-1">Network Volume</p>
                            <p className="text-2xl font-black text-indigo-950 italic tracking-tighter leading-none">+{polls.length} ACTIVE</p>
                        </div>
                    </div>

                    {user.role === 'student' && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full sm:w-auto bg-indigo-950 hover:bg-primary-600 text-white px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest italic shadow-2xl transition-all duration-500 hover:-translate-y-2 flex items-center justify-center space-x-3 shadow-indigo-950/20"
                        >
                            <Plus size={14} />
                            <span>Create Ballot</span>
                        </button>
                    )}
                </div>

                {/* Poll Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent"></div>
                        <p className="text-gray-300 font-black uppercase text-[9px] tracking-[0.3em] mt-8 italic">Synchronizing Pulse...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {polls.length === 0 ? (
                            <div className="bg-white rounded-[4rem] p-32 text-center border border-gray-100 shadow-2xl shadow-indigo-950/5">
                                <div className="bg-gray-50 h-24 w-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-white shadow-inner">
                                    <BarChart3 className="h-10 w-10 text-gray-200" />
                                </div>
                                <h3 className="text-3xl font-black text-indigo-950 mb-4 tracking-tighter uppercase italic leading-none">Silent Pulse</h3>
                                <p className="text-gray-400 font-medium italic">The network is currently awaiting new democratic inputs.</p>
                            </div>
                        ) : (
                            polls.map((poll) => {
                                const expired = isExpired(poll.expiresAt);
                                const hasVoted = poll.votedUsers.includes(user.id);
                                const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);

                                return (
                                    <div key={poll._id} className={`group relative bg-white rounded-[3.5rem] shadow-2xl shadow-indigo-950/5 border border-transparent hover:border-primary-100 transition-all duration-700 overflow-hidden ${expired ? 'opacity-80' : ''}`}>
                                        <div className="p-10 lg:p-12">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm border border-indigo-100 shadow-inner italic">
                                                        {(poll.createdBy?.name || 'A').charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic mb-0.5">Originator Agent</p>
                                                        <p className="text-[10px] font-black text-indigo-950 uppercase italic tracking-tighter">{poll.createdBy?.name || 'Anonymous User'}</p>
                                                    </div>
                                                </div>
                                                <div className={`flex items-center space-x-3 px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-inner border italic ${expired ? 'bg-red-50 text-red-500 border-red-100' : 'bg-primary-50 text-primary-600 border-primary-100'}`}>
                                                    <Timer size={14} className={expired ? '' : 'animate-pulse'} />
                                                    <span>{expired ? 'Protocol Concluded' : getTimeRemaining(poll.expiresAt)}</span>
                                                </div>
                                            </div>

                                            <h2 className="text-2xl lg:text-3xl font-black text-indigo-950 mb-10 leading-[1.2] tracking-tighter italic uppercase">{poll.question}</h2>

                                            <div className="space-y-4 mb-10">
                                                {poll.options.map((option, idx) => {
                                                    const percentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);

                                                    if (hasVoted || expired) {
                                                        return (
                                                            <div key={idx} className="relative h-16 bg-gray-50/50 rounded-2xl overflow-hidden border border-gray-100 group/opt">
                                                                <div
                                                                    className="absolute h-full bg-indigo-950/5 transition-all duration-[1.5s] ease-out-expo"
                                                                    style={{ width: `${percentage}%` }}
                                                                ></div>
                                                                <div className="relative h-full flex items-center justify-between px-8">
                                                                    <div className="flex items-center space-x-4">
                                                                        <span className="text-xs font-black text-indigo-950 uppercase italic">{option.text}</span>
                                                                        {hasVoted && poll.votedUsers[idx] === user.id && <CheckCircle size={14} className="text-emerald-500" />}
                                                                    </div>
                                                                    <div className="flex items-center space-x-4">
                                                                        <span className="text-lg font-black text-primary-600 italic tracking-tighter">{percentage}%</span>
                                                                        <div className="bg-white px-2.5 py-1 rounded-lg text-[8px] font-black text-indigo-300 border border-gray-100 shadow-sm">{option.votes} NODES</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <button
                                                            key={idx}
                                                            onClick={() => handleVote(poll._id, idx)}
                                                            className="w-full text-left p-6 bg-white border border-gray-100 rounded-2xl hover:border-primary-500 hover:bg-primary-50/50 transition-all duration-300 font-black text-indigo-950 text-xs uppercase italic active:scale-[0.98] group/btn"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span>{option.text}</span>
                                                                <ChevronRight size={14} className="opacity-0 group-hover/btn:opacity-100 transition-all transform group-hover/btn:translate-x-1" />
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                                                <div className="flex items-center space-x-8">
                                                    <div className="flex items-center space-x-2 text-gray-300">
                                                        <Users size={14} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest italic">{totalVotes} Active Signals</span>
                                                    </div>
                                                    {poll.createdBy?._id === user.id && !expired && (
                                                        <button
                                                            onClick={() => handleEndPoll(poll._id)}
                                                            className="text-red-400 hover:text-red-600 font-black text-[9px] uppercase tracking-widest italic transition-colors"
                                                        >
                                                            Terminate Early
                                                        </button>
                                                    )}
                                                </div>
                                                {hasVoted && (
                                                    <div className="flex items-center space-x-2 text-emerald-500">
                                                        <ShieldCheck size={14} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest italic">Ballot Recorded</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* Premium Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-indigo-950/80 flex items-center justify-center z-[100] p-6 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white rounded-[4rem] shadow-2xl max-w-xl w-full overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20 relative">
                        <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 z-20 p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-indigo-950 transition-all hover:rotate-90">
                            <X size={24} />
                        </button>

                        <div className="bg-indigo-950 p-12 text-white relative">
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-500 opacity-10 skew-x-12"></div>
                            <div className="relative z-10">
                                <h2 className="text-5xl font-black tracking-tighter leading-none mb-4 uppercase italic">
                                    Initiate <br /><span className="text-primary-500">Ballot.</span>
                                </h2>
                                <p className="text-primary-100/40 font-medium italic">Configure consensus protocol for network broadcasting.</p>
                            </div>
                        </div>

                        <form onSubmit={handleCreatePoll} className="p-12 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic ml-2">Ballot Question</label>
                                <textarea
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-[2.5rem] py-8 px-10 text-lg font-black text-indigo-950 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner resize-none"
                                    placeholder="e.g. Protocol for spring assembly?"
                                    rows="2"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic ml-2">Response Vectors</label>
                                {formData.options.map((opt, i) => (
                                    <div key={i} className="relative group">
                                        <input
                                            type="text"
                                            required
                                            placeholder={`Option Alpha 0${i + 1}`}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] py-5 px-10 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner"
                                            value={opt}
                                            onChange={(e) => {
                                                const newOpts = [...formData.options];
                                                newOpts[i] = e.target.value;
                                                setFormData({ ...formData, options: newOpts });
                                            }}
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="px-8 py-3 bg-indigo-50 text-indigo-600 rounded-full font-black text-[9px] uppercase tracking-widest italic hover:bg-indigo-100 transition-colors flex items-center space-x-2"
                                    onClick={() => setFormData({ ...formData, options: [...formData.options, ''] })}
                                >
                                    <Plus size={12} />
                                    <span>Expand Vectors</span>
                                </button>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic ml-2">Cycle Lifespan (Hours)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] py-5 px-10 text-lg font-black text-indigo-950 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6">
                                <button type="submit" className="bg-indigo-950 hover:bg-primary-600 text-white py-6 rounded-[2.2rem] font-black shadow-2xl transition-all duration-500 hover:-translate-y-2 uppercase tracking-widest text-[10px] italic">Broadcast Ballot</button>
                                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-100 text-gray-400 py-6 rounded-[2.2rem] font-black hover:bg-gray-200 transition-all uppercase tracking-widest text-[10px] italic">Abort</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Polls;
