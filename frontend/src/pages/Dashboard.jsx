import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import {
    Trophy, Users, ShoppingBag,
    MessageSquare, TrendingUp, Star,
    ChevronRight, Sparkles, BookOpen,
    ArrowUpRight, Heart, Zap, Flame,
    Crown, Activity, Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        items: 0,
        clubs: 0,
        notes: 0,
        confessions: 0
    });
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            const schoolId = user.schoolId || user.id;
            const [statsRes, leaderboardRes] = await Promise.all([
                API.get(`/admin/stats?schoolId=${schoolId}`),
                API.get(`/stats/leaderboard?schoolId=${schoolId}`)
            ]);
            setStats(statsRes.data);
            setLeaderboard(leaderboardRes.data.leaderboard);
        } catch (error) {
            console.error('Dashboard Data Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        { name: 'Market', path: '/mart', icon: ShoppingBag, color: 'bg-primary-500', desc: 'Secure Trade' },
        { name: 'Commune', path: '/clubs', icon: Users, color: 'bg-indigo-500', desc: 'Elite Circles' },
        { name: 'Archive', path: '/notes', icon: BookOpen, color: 'bg-purple-600', desc: 'Academic Vault' },
        { name: 'Pulse', path: '/confessions', icon: MessageSquare, color: 'bg-pink-500', desc: 'Inner Stories' }
    ];

    const StatCard = ({ label, value, icon: Icon, color }) => (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-950/5 border border-gray-50 flex flex-col items-center justify-center group hover:border-primary-100 transition-all duration-500">
            <div className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                <Icon size={24} />
            </div>
            <span className="text-3xl font-black text-indigo-950 tracking-tighter mb-1">{value}</span>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{label}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAFAFB] pb-24">
            {/* Header / Premium Banner */}
            <div className="bg-indigo-950 pt-16 pb-40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="inline-flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-xl">
                                    <Activity className="h-3 w-3 text-green-400 animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-primary-200 italic">User Session Active</span>
                                </div>
                                <div className="inline-flex items-center space-x-2 bg-primary-500/10 px-4 py-2 rounded-full border border-primary-500/20 backdrop-blur-xl">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-primary-400 italic">Unique Code:</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white italic">{user.schoolCode || '---'}</span>
                                </div>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 italic uppercase leading-none">
                                Welcome, <span className="text-primary-500">{user.name.split(' ')[0]}</span>.
                            </h1>
                            <p className="text-primary-100/40 font-medium italic text-lg max-w-xl">
                                Your terminal to the most exclusive academic network. Everything you need, streamlined.
                            </p>
                        </div>

                        <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-4 border border-white/10 shadow-2xl">
                            <div className="bg-white/10 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center">
                                <span className="text-[9px] font-black text-primary-300 uppercase tracking-[0.3em] mb-1 italic">Balance</span>
                                <span className="text-3xl font-black text-white italic tracking-tighter">₹{user.points || 0}</span>
                            </div>
                            <div className="bg-gradient-to-br from-primary-500 to-indigo-600 p-6 rounded-[2rem] shadow-xl flex flex-col items-center min-w-[120px]">
                                <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em] mb-1 italic">Division</span>
                                <span className="text-xl font-black text-white uppercase italic tracking-tighter leading-none py-1">
                                    {user.house || 'Neutral'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Interface */}
            <div className="max-w-7xl mx-auto px-6 lg:px-10 -mt-24 relative z-20">
                <div className="grid lg:grid-cols-12 gap-10">

                    {/* Primary Operations (Left) */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* Summary Widgets */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <StatCard label="Mart Assets" value={stats.items} icon={ShoppingBag} color="bg-blue-600" />
                            <StatCard label="Collectives" value={stats.clubs} icon={Users} color="bg-indigo-600" />
                            <StatCard label="Archive Size" value={stats.notes} icon={BookOpen} color="bg-purple-600" />
                            <StatCard label="Network Pulse" value={stats.confessions} icon={Flame} color="bg-pink-600" />
                        </div>

                        {/* Navigation Matrix */}
                        <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-indigo-950/5 p-10 border border-gray-100">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase italic">Quick Access</h2>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1 italic">Primary Hub Protocols</p>
                                </div>
                                <Zap className="h-6 w-6 text-amber-400" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {quickActions.map((action) => (
                                    <Link
                                        key={action.name}
                                        to={action.path}
                                        className="group p-8 rounded-[2.5rem] bg-gray-50/50 hover:bg-white hover:shadow-2xl hover:shadow-primary-100 transition-all duration-500 border border-transparent hover:border-gray-100 flex items-center justify-between"
                                    >
                                        <div className="flex items-center space-x-6">
                                            <div className={`${action.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-transform`}>
                                                <action.icon size={26} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-indigo-950 tracking-tight italic uppercase">{action.name}</h3>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{action.desc}</p>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-300 group-hover:text-primary-600 group-hover:bg-primary-50 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
                                            <ArrowUpRight size={20} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Recent Protocol Updates */}
                        <div className="bg-indigo-950 rounded-[3.5rem] shadow-2xl p-12 text-white overflow-hidden relative group">
                            <Globe className="absolute -right-10 -bottom-10 h-64 w-64 text-white opacity-5 group-hover:scale-110 transition-transform duration-1000" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-12">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-10 w-10 bg-primary-500 rounded-2xl flex items-center justify-center">
                                            <Sparkles className="h-5 w-5 text-white" />
                                        </div>
                                        <h2 className="text-2xl font-black tracking-tighter uppercase italic">Live Network Feed</h2>
                                    </div>
                                    <Link to="/confessions" className="text-primary-400 text-xs font-black uppercase tracking-widest hover:text-white transition-colors flex items-center space-x-2 italic">
                                        <span>Full Pulse</span> <ChevronRight size={14} />
                                    </Link>
                                </div>
                                <div className="text-center py-10 opacity-40">
                                    <Activity className="h-16 w-16 mx-auto mb-6 text-primary-200" />
                                    <p className="text-sm font-black uppercase tracking-[0.2em] italic">Awaiting Next Transmission...</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Elite Rankings (Right) */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-indigo-950/5 border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-950 to-indigo-900 p-10 text-white relative">
                                <div className="absolute top-0 right-0 w-32 h-full bg-primary-500 opacity-10 skew-x-12"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <Crown className="h-6 w-6 text-amber-400" />
                                        <h2 className="text-xl font-black tracking-tighter uppercase italic">Global Board</h2>
                                    </div>
                                    <p className="text-primary-100/30 text-[9px] font-black uppercase tracking-[0.3em] leading-none italic">Elite Academic Rankings</p>
                                </div>
                            </div>

                            <div className="p-6 space-y-3">
                                {loading ? (
                                    <div className="py-20 flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
                                    </div>
                                ) : leaderboard.length > 0 ? (
                                    leaderboard.slice(0, 5).map((stud, idx) => (
                                        <div
                                            key={stud._id}
                                            className={`flex items-center justify-between p-5 rounded-[2rem] transition-all duration-300 ${idx === 0
                                                ? 'bg-amber-50 border border-amber-100 shadow-xl shadow-amber-900/5'
                                                : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black italic ${idx === 0 ? 'bg-amber-400 text-white shadow-lg' :
                                                    idx === 1 ? 'bg-gray-200 text-gray-600' :
                                                        idx === 2 ? 'bg-orange-100 text-orange-600' :
                                                            'bg-gray-50 text-gray-300 border border-gray-100'
                                                    }`}>
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <p className="font-black text-indigo-950 tracking-tight italic uppercase text-sm leading-none mb-1">{stud.name}</p>
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`h-1.5 w-1.5 rounded-full ${stud.house === 'Red' ? 'bg-red-500' :
                                                            stud.house === 'Blue' ? 'bg-blue-500' :
                                                                stud.house === 'Green' ? 'bg-green-500' :
                                                                    'bg-amber-500'
                                                            }`}></span>
                                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">{stud.house}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-indigo-950 italic tracking-tighter leading-none">{stud.points}</p>
                                                <p className="text-[8px] font-black text-gray-300 uppercase italic tracking-widest mt-1">XP</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center opacity-30 italic font-black text-[10px] uppercase">No Record Found</div>
                                )}
                            </div>
                        </div>

                        {/* Division Progress */}
                        <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-indigo-950/5 border border-gray-100 p-10">
                            <h3 className="text-xl font-black text-indigo-950 tracking-tighter uppercase italic mb-8">Power Balance</h3>
                            <div className="space-y-6">
                                {['Red', 'Blue', 'Green', 'Yellow'].map(house => (
                                    <div key={house} className="group">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">{house} Phase</span>
                                            <span className="text-xs font-black text-indigo-950 italic">65%</span>
                                        </div>
                                        <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                            <div
                                                className={`h-full transition-all duration-1000 group-hover:opacity-80 ${house === 'Red' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' :
                                                    house === 'Blue' ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]' :
                                                        house === 'Green' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' :
                                                            'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                                                    }`}
                                                style={{ width: '65%' }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
