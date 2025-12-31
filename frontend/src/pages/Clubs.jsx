import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import {
    Users, Plus, ChevronRight, Star,
    Heart, Activity, Search, Filter,
    Sparkles, ArrowRight, Shield, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Clubs = () => {
    const { user } = useAuth();
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newClub, setNewClub] = useState({ name: '', description: '' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user && user.id) fetchClubs();
    }, [user]);

    if (!user) return null;

    const fetchClubs = async () => {
        try {
            const schoolId = user.schoolId || user.id;
            const response = await API.get(`/clubs?schoolId=${schoolId}`);
            setClubs(response.data.clubs || []);
        } catch (error) {
            console.error('Error fetching clubs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClub = async (e) => {
        e.preventDefault();
        try {
            const schoolId = user.schoolId || user.id;
            await API.post('/clubs', {
                ...newClub,
                createdBy: user.id,
                schoolId
            });
            setShowModal(false);
            setNewClub({ name: '', description: '' });
            fetchClubs();
        } catch (error) {
            console.error('Create Club Error:', error);
        }
    };

    const filteredClubs = clubs.filter(club =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FAFAFB] pb-24">
            {/* Boutique Hero */}
            <div className="bg-indigo-950 pt-16 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2/3 h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent"></div>
                <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-full mb-6 border border-white/5 backdrop-blur-xl">
                                <Users className="h-3 w-3 text-primary-400" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary-200 italic">Collective Intelligence</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 italic uppercase leading-none">
                                Student <br /><span className="text-primary-500">Circles.</span>
                            </h1>
                            <p className="text-primary-100/40 font-medium italic text-lg leading-relaxed">
                                Join elite student organizations or found your own collective. <br />Collaborate, compete, and conquer.
                            </p>
                        </div>

                        {user.role === 'student' && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-white hover:bg-primary-50 text-indigo-950 px-10 py-6 rounded-[2.2rem] font-black text-xs uppercase tracking-widest shadow-2xl transition-all duration-500 hover:-translate-y-2 active:scale-95 italic flex items-center justify-center whitespace-nowrap"
                            >
                                <Plus className="h-4 w-4 mr-3" />
                                <span>Found Collective</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-10 -mt-16 relative z-20">
                {/* Search & Stats Bar */}
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-950/5 p-4 mb-12 border border-gray-50 flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                        <input
                            type="text"
                            placeholder="Locate circle profile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-[2rem] py-5 pl-16 pr-8 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-primary-50 transition-all italic"
                        />
                    </div>
                    <div className="flex items-center space-x-4 px-6 py-4 md:border-l border-gray-100 min-w-[200px] justify-center">
                        <div className="bg-primary-500/10 h-10 w-10 rounded-xl flex items-center justify-center">
                            <Zap className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                            <p className="text-xl font-black text-indigo-950 leading-none italic">{clubs.length}</p>
                            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-1 italic">Active Nodes</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-32">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent"></div>
                    </div>
                ) : filteredClubs.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredClubs.map((club) => (
                            <Link
                                key={club._id}
                                to={`/clubs/${club._id}`}
                                className="group relative bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-indigo-950/5 border border-transparent hover:border-primary-100 transition-all duration-700 hover:-translate-y-3 overflow-hidden flex flex-col justify-between min-h-[400px]"
                            >
                                <div className="absolute -right-10 -top-10 h-40 w-40 bg-indigo-50 opacity-0 group-hover:opacity-100 rounded-full transition-all duration-1000 group-hover:scale-150"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="h-16 w-16 rounded-[1.8rem] bg-indigo-50 group-hover:bg-primary-500 flex items-center justify-center transition-all duration-500 shadow-inner group-hover:shadow-primary-500/20">
                                            <Users size={28} className="text-indigo-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex items-center space-x-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                                            <span className="text-[9px] font-black text-indigo-950 uppercase italic tracking-tighter">Verified</span>
                                        </div>
                                    </div>

                                    <h3 className="text-3xl font-black text-indigo-950 mb-4 tracking-tighter italic uppercase leading-none group-hover:text-primary-600 transition-colors">{club.name}</h3>
                                    <p className="text-gray-400 font-medium italic text-sm leading-relaxed line-clamp-3">{club.description}</p>
                                </div>

                                <div className="relative z-10 pt-10 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-10 w-10 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center font-black text-[9px] text-gray-400 italic">
                                                    {i}
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-indigo-950 leading-none italic">{club.members?.length || 0}</p>
                                            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-0.5 italic">Protocol Members</p>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 group-hover:-rotate-45">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40">
                        <div className="h-24 w-24 bg-gray-50 flex items-center justify-center rounded-[2.5rem] mx-auto mb-8 border border-gray-100 shadow-inner">
                            <Search className="h-10 w-10 text-gray-200" />
                        </div>
                        <h3 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase italic mb-2">Node Isolation</h3>
                        <p className="text-gray-400 font-medium italic">No collectives found matching your search parameters.</p>
                    </div>
                )}
            </div>

            {/* Premium Create Club Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-indigo-950/80 flex items-center justify-center z-[100] p-6 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white rounded-[4rem] shadow-2xl max-w-xl w-full overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20">
                        <div className="bg-indigo-950 p-12 text-white relative">
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-500 opacity-10 skew-x-12"></div>
                            <div className="relative z-10">
                                <h2 className="text-5xl font-black tracking-tighter leading-none mb-4 uppercase italic">Found <br /><span className="text-primary-500">Collective</span></h2>
                                <p className="text-primary-100/40 font-medium italic">Initiate a new community node in the network.</p>
                            </div>
                        </div>
                        <form onSubmit={handleCreateClub} className="p-12 space-y-8">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic ml-2">Node Nomenclature</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] py-6 px-10 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner"
                                    placeholder="e.g. Theoretical Physics Union"
                                    value={newClub.name}
                                    onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic ml-2">Protocol Manifesto</label>
                                <textarea
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-[2.5rem] py-6 px-10 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner h-40 resize-none"
                                    placeholder="Describe the mission and objectives..."
                                    value={newClub.description}
                                    onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 bg-indigo-950 hover:bg-primary-600 text-white py-6 rounded-[2.2rem] font-black shadow-2xl transition-all duration-500 hover:-translate-y-2 uppercase tracking-widest text-xs italic">Establish</button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-50 text-gray-400 py-6 rounded-[2.2rem] font-black hover:bg-gray-100 transition-all uppercase tracking-widest text-xs italic">Abort</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clubs;
