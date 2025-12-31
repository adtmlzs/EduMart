import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import {
    Users, UserPlus, Shield, MessageSquare,
    ArrowLeft, Calendar, MapPin, Sparkles,
    ChevronRight, Info, Zap, Globe, Lock,
    CheckCircle2, AlertCircle
} from 'lucide-react';

const ClubDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClubDetails();
    }, [id]);

    const fetchClubDetails = async () => {
        try {
            const response = await API.get(`/clubs/${id}`);
            setClub(response.data.club);
        } catch (error) {
            console.error('Error fetching club details:', error);
            navigate('/clubs');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        try {
            const response = await API.put(`/clubs/join/${id}`, {
                userId: user.id
            });
            setClub(response.data.club);
            updateUser({ clubsJoined: [...(user.clubsJoined || []), id] });
        } catch (error) {
            console.error('Join Error:', error);
        }
    };

    if (!user) return null;

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFB]">
            <div className="relative">
                <div className="h-16 w-16 border-4 border-indigo-100 rounded-full"></div>
                <div className="h-16 w-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="text-indigo-950 font-black uppercase text-[10px] tracking-widest mt-8 italic">Synchronizing Node...</p>
        </div>
    );

    const isMember = club.members.some(m => m._id === user.id);

    return (
        <div className="min-h-screen bg-[#FAFAFB] pb-24">
            {/* Boutique Header */}
            <div className="bg-indigo-950 pt-16 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2/3 h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
                    <button
                        onClick={() => navigate('/clubs')}
                        className="inline-flex items-center space-x-3 bg-white/5 px-5 py-2.5 rounded-full mb-10 border border-white/5 backdrop-blur-xl text-primary-200 hover:text-white hover:bg-white/10 transition-all duration-500 group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Directory</span>
                    </button>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center space-x-3 bg-primary-500/10 px-4 py-2 rounded-full mb-6 border border-primary-500/20">
                                <Zap className="h-3 w-3 text-primary-400" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary-200 italic">Established Protocol</span>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6 italic uppercase leading-none">
                                {club.name}
                            </h1>
                            <p className="text-xl text-primary-100/30 font-medium italic leading-relaxed max-w-2xl">
                                "{club.description}"
                            </p>
                        </div>

                        <div className="flex items-center space-x-10 p-10 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl">
                            <div className="text-center min-w-[80px]">
                                <p className="text-5xl font-black text-white italic tracking-tighter leading-none">{club.members.length}</p>
                                <p className="text-[9px] font-black text-primary-400 uppercase tracking-widest mt-2 italic">Nodes</p>
                            </div>
                            <div className="h-14 w-px bg-white/10"></div>
                            <div className="text-center min-w-[80px]">
                                <p className="text-5xl font-black text-white italic tracking-tighter leading-none">0</p>
                                <p className="text-[9px] font-black text-primary-400 uppercase tracking-widest mt-2 italic">Events</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-10 -mt-16 relative z-20">
                <div className="grid lg:grid-cols-12 gap-10">

                    {/* Collaborative Core (Left) */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Feed / Discussion Placeholder */}
                        <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-indigo-950/5 p-12 border border-gray-50 overflow-hidden relative group">
                            <div className="absolute -right-20 -bottom-20 h-80 w-80 bg-indigo-50/50 rounded-full blur-3xl group-hover:bg-primary-50/50 transition-colors duration-1000"></div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-12">
                                    <div>
                                        <h2 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase italic">Internal Protocol</h2>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1 italic">Authorized Personnel Only</p>
                                    </div>
                                    <MessageSquare size={24} className="text-indigo-200" />
                                </div>

                                {isMember ? (
                                    <div className="py-24 text-center">
                                        <div className="h-20 w-20 bg-indigo-50 flex items-center justify-center rounded-[2.5rem] mx-auto mb-8 border border-indigo-100 shadow-inner">
                                            <Globe className="h-8 w-8 text-indigo-300 animate-pulse" />
                                        </div>
                                        <h3 className="text-2xl font-black text-indigo-950 tracking-tighter uppercase italic mb-4">Establishing Sync...</h3>
                                        <p className="text-gray-400 font-medium italic max-w-sm mx-auto">The internal collective feed is preparing for transmission. Connect with your peers soon.</p>
                                    </div>
                                ) : (
                                    <div className="py-24 text-center bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                                        <Lock className="h-16 w-16 text-gray-200 mx-auto mb-8" />
                                        <h3 className="text-2xl font-black text-gray-300 tracking-tighter uppercase italic mb-4">Access Restricted</h3>
                                        <p className="text-gray-400/60 font-medium italic max-w-xs mx-auto text-sm">Join the collective to access internal communications and encrypted files.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Bulletins */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {[1, 2].map(i => (
                                <div key={i} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-indigo-950/5 hover:-translate-y-2 transition-all duration-500">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase italic border border-emerald-100">System News</div>
                                        <span className="text-[9px] text-gray-300 font-black uppercase italic tracking-widest">Protocol 0{i}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-indigo-950 mb-3 tracking-tighter italic uppercase leading-none">Node Synchronization</h3>
                                    <p className="text-sm text-gray-400 font-medium italic leading-relaxed mb-8 line-clamp-2">Regular sync-up scheduled at primary coordinates. Ensure all data is prepared for transmission.</p>
                                    <div className="flex items-center space-x-2 text-primary-500 group cursor-pointer">
                                        <span className="text-[10px] font-black uppercase italic tracking-widest group-hover:mr-2 transition-all">Details</span>
                                        <ChevronRight size={14} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Operational Intel (Right) */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* Status / Enrollment */}
                        {!isMember ? (
                            <div className="bg-primary-600 rounded-[3.5rem] p-12 text-white shadow-2xl shadow-primary-950/20 relative overflow-hidden group">
                                <div className="absolute -right-10 -bottom-10 h-64 w-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                                <div className="relative z-10">
                                    <h3 className="text-4xl font-black mb-6 italic uppercase tracking-tighter leading-none">Request <br />Enrollment</h3>
                                    <p className="text-primary-100 font-medium italic text-sm mb-10 leading-relaxed">
                                        Incorporate into this collective node and leverage the network's specialized intelligence.
                                    </p>
                                    <button
                                        onClick={handleJoin}
                                        className="w-full bg-white text-indigo-950 py-6 rounded-[2.2rem] font-black shadow-2xl hover:-translate-y-2 active:scale-95 transition-all duration-500 uppercase tracking-widest text-[10px] italic"
                                    >
                                        Initiate Handshake
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-indigo-950 rounded-[3.5rem] p-12 text-white shadow-2xl shadow-indigo-950/50 relative overflow-hidden">
                                <div className="absolute -right-10 -bottom-10 h-64 w-64 bg-primary-500/10 rounded-full blur-3xl"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 italic">Access Granted</span>
                                    </div>
                                    <h3 className="text-4xl font-black mb-2 italic uppercase tracking-tighter leading-none">Internal <br />Node</h3>
                                    <p className="text-primary-100/30 text-[9px] font-black uppercase tracking-[0.3em] leading-none italic">Verified Collective Identity</p>
                                </div>
                            </div>
                        )}

                        {/* Roster Intel */}
                        <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-indigo-950/5 border border-gray-100 overflow-hidden">
                            <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                                <div className="flex items-center space-x-4">
                                    <Users className="h-5 w-5 text-gray-300" />
                                    <h3 className="text-xl font-black text-indigo-950 tracking-tighter italic uppercase">Node Roster</h3>
                                </div>
                                <span className="text-[9px] font-black text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full uppercase tracking-widest italic border border-primary-100">{club.members.length} Ident</span>
                            </div>
                            <div className="p-8 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                                {club.members.map((member) => (
                                    <div key={member._id} className="flex items-center justify-between p-5 rounded-[2rem] hover:bg-gray-50 transition-all duration-500 group">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm border border-indigo-100 shadow-inner group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-400 transition-all duration-500 italic">
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-indigo-950 text-sm tracking-tighter italic uppercase group-hover:text-primary-600 transition-colors leading-none mb-1">{member.name}</p>
                                                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest italic">Node Member</p>
                                            </div>
                                        </div>
                                        {member._id === club.createdBy?._id && (
                                            <div className="p-2 bg-amber-50 rounded-xl text-amber-500 border border-amber-100 shadow-sm" title="Cluster Admin">
                                                <Shield className="h-3 w-3" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Peripheral Intel */}
                        <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-indigo-950/5">
                            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-10 flex items-center italic">
                                <Info className="h-3 w-3 mr-3 text-indigo-300" /> Essential Intel
                            </h4>
                            <div className="space-y-8">
                                <div className="flex items-start space-x-5">
                                    <div className="bg-indigo-50 p-3 rounded-[1.2rem] border border-indigo-100"><MapPin className="h-5 w-5 text-indigo-600" /></div>
                                    <div>
                                        <p className="text-sm font-black text-indigo-950 italic uppercase tracking-tighter">Cluster C-4</p>
                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic mt-0.5">Primary Coordinates</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-5">
                                    <div className="bg-primary-50 p-3 rounded-[1.2rem] border border-primary-100"><Calendar className="h-5 w-5 text-primary-600" /></div>
                                    <div>
                                        <p className="text-sm font-black text-indigo-950 italic uppercase tracking-tighter">Friday / 16:00 HRS</p>
                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic mt-0.5">Sync Schedule</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubDetail;
