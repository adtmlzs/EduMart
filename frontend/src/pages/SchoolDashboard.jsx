import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import {
    Users, Shield, Trash2, Ban, Search,
    LayoutDashboard, UserX, UserCheck,
    MessageSquare, Activity, ChevronDown,
    ChevronUp, RefreshCw, XCircle, ChevronRight,
    TrendingUp, Award, Clock, Sparkles, BarChart3
} from 'lucide-react';
import ManagePolls from './ManagePolls';

const SchoolDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({});
    const [students, setStudents] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedClub, setExpandedClub] = useState(null);

    useEffect(() => {
        if (user) fetchData();
    }, [activeTab, user]);

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const schoolId = user.id;
            if (activeTab === 'overview') {
                const response = await API.get(`/admin/stats?schoolId=${schoolId}`);
                setStats(response.data);
            } else if (activeTab === 'students') {
                const response = await API.get(`/admin/students?schoolId=${schoolId}`);
                setStudents(response.data);
            } else if (activeTab === 'clubs') {
                const response = await API.get(`/admin/clubs?schoolId=${schoolId}`);
                setClubs(response.data);
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBanUser = async (studentId) => {
        try {
            await API.put(`/admin/ban-user/${studentId}`);
            fetchData();
        } catch (error) {
            console.error('Ban Error:', error);
        }
    };

    const handleDeleteClub = async (clubId) => {
        if (!window.confirm('Terminate club protocol?')) return;
        try {
            await API.delete(`/admin/club/${clubId}`);
            fetchData();
        } catch (error) {
            console.error('Delete Error:', error);
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!user) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFB]">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent"></div>
            <p className="text-gray-300 font-black uppercase text-[9px] tracking-[0.3em] mt-8 italic">Synchronizing Pulse...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAFAFB] flex flex-col md:flex-row h-screen overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-80 bg-indigo-950 text-white flex flex-col z-30 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                <div className="p-10 relative z-10 flex-1 overflow-y-auto no-scrollbar">
                    <div className="flex items-center space-x-4 mb-16">
                        <div className="bg-primary-500 p-3 rounded-2xl shadow-2xl shadow-primary-500/20 group hover:rotate-6 transition-transform border border-primary-400">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Oversight.</h2>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-primary-400 uppercase tracking-[0.3em] mt-1.5 block italic opacity-60">Command Central</span>
                                <div className="mt-2 inline-flex items-center space-x-1.5 bg-white/5 border border-white/5 px-2 py-1 rounded-lg">
                                    <span className="text-[10px] font-black text-primary-300 uppercase tracking-widest italic">Unique Code:</span>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest italic select-all">{user.uniqueCode}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <nav className="space-y-3">
                        {[
                            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                            { id: 'students', label: 'Human Assets', icon: UserCheck },
                            { id: 'clubs', label: 'Collective Units', icon: Users },
                            { id: 'polls', label: 'Ballot Control', icon: BarChart3 }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-[1.5rem] font-black transition-all duration-500 uppercase text-[10px] tracking-widest border-2 ${activeTab === tab.id
                                    ? 'bg-white border-white text-indigo-950 shadow-2xl shadow-black/20 -translate-y-1 italic'
                                    : 'text-white/40 border-transparent hover:border-white/5 hover:text-white'
                                    }`}
                            >
                                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-primary-500' : ''}`} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-10 relative z-10">
                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl text-center">
                        <Sparkles className="h-5 w-5 text-primary-400 mx-auto mb-4 animate-pulse" />
                        <p className="text-[9px] font-black italic text-primary-100 uppercase tracking-widest leading-relaxed">Verified Institution Protocol Active</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative bg-[#FAFAFB]">
                <div className="max-w-[1600px] mx-auto p-8 md:p-16">
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16 animate-in fade-in slide-in-from-top-6 duration-700">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] italic leading-none">Global Management Protocol</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black text-indigo-950 tracking-tighter uppercase italic leading-none">
                                {activeTab === 'overview' ? 'Overview.' : activeTab === 'students' ? 'Students.' : activeTab === 'clubs' ? 'Clubs.' : 'Ballots.'}
                            </h1>
                        </div>
                        <button
                            onClick={fetchData}
                            className="bg-white w-20 h-20 rounded-[2rem] border border-gray-100 shadow-2xl shadow-indigo-950/5 flex items-center justify-center group hover:-translate-y-2 transition-all duration-500"
                        >
                            <RefreshCw className="h-6 w-6 text-gray-300 group-hover:rotate-180 group-hover:text-primary-500 transition-all duration-700 font-bold" />
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40">
                            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent"></div>
                            <p className="text-gray-300 font-black uppercase text-[9px] tracking-[0.3em] mt-8 italic">Synchronizing Feed...</p>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                            {activeTab === 'overview' && (
                                <div className="space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                                        {[
                                            { label: 'Active Signals', val: stats.totalStudents, icon: UserCheck, color: 'text-primary-500', bg: 'bg-primary-50', line: 'Student Base Volume' },
                                            { label: 'Community Units', val: stats.activeClubs, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', line: 'Established Alliances' },
                                            { label: 'Market Assets', val: stats.totalItems, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', line: 'Trading Flow Status' },
                                            { label: 'Daily Traces', val: stats.confessionsToday, icon: MessageSquare, color: 'text-rose-600', bg: 'bg-rose-50', line: 'Campus Sentiment Index' }
                                        ].map((s, i) => (
                                            <div key={i} className="bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-indigo-950/5 border border-transparent hover:border-gray-100 transition-all duration-500 group">
                                                <div className={`${s.bg} ${s.color} h-14 w-14 rounded-[1.8rem] flex items-center justify-center mb-8 border-4 border-white shadow-xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110`}>
                                                    <s.icon size={22} strokeWidth={2.5} />
                                                </div>
                                                <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 italic ml-1">{s.label}</h3>
                                                <p className="text-6xl font-black text-indigo-950 tracking-tighter mb-4 italic leading-none">{s.val}</p>
                                                <div className="w-8 h-1 bg-gray-100 rounded-full group-hover:w-full transition-all duration-700"></div>
                                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-6 italic ml-1">{s.line}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                        <div className="xl:col-span-2 bg-white rounded-[4rem] p-12 shadow-2xl shadow-indigo-950/5 border border-gray-50 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                                                <Activity size={200} />
                                            </div>
                                            <div className="relative z-10">
                                                <div className="flex items-center justify-between mb-16">
                                                    <div className="flex items-center space-x-5">
                                                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                                            <Activity size={20} />
                                                        </div>
                                                        <h2 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase italic">Institutional Trace Audit</h2>
                                                    </div>
                                                    <div className="flex items-center space-x-3 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic leading-none">Live Sync active</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <div key={i} className="flex items-center space-x-6 p-6 rounded-[2.5rem] hover:bg-gray-50/50 transition-all duration-300 border border-transparent hover:border-gray-100 group/item">
                                                            <div className="h-14 w-14 rounded-2xl bg-indigo-950 text-white flex items-center justify-center font-black text-[9px] uppercase tracking-widest italic border-4 border-white shadow-2xl shadow-indigo-950/10 group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-500">TRCE</div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-3 mb-1">
                                                                    <p className="font-black text-indigo-950 tracking-tight uppercase italic text-sm">Autonomous Node Activity</p>
                                                                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest italic">Signal-{i}82-A</span>
                                                                </div>
                                                                <p className="text-gray-400 font-medium text-xs leading-relaxed italic">System detected standard asset deployment by member UID-833{i}.</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-[10px] font-black text-indigo-950 tracking-tighter italic">{i * 2} minutes prior</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-indigo-950 rounded-[4rem] p-12 text-white shadow-2xl shadow-indigo-950/20 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[500px]">
                                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-primary-500 via-transparent to-transparent"></div>
                                            </div>
                                            <Shield className="absolute -top-10 -right-10 h-80 w-80 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                                            <div className="relative z-10 w-full">
                                                <div className="bg-white/10 h-24 w-24 rounded-[2.5rem] flex items-center justify-center mb-10 mx-auto border border-white/10 backdrop-blur-xl shadow-inner">
                                                    <Award size={40} className="text-primary-400 italic" />
                                                </div>
                                                <h3 className="text-5xl font-black mb-6 uppercase italic tracking-tighter leading-none">Institutional <br /><span className="text-primary-500">Volume.</span></h3>
                                                <p className="text-primary-100/40 font-medium text-sm leading-relaxed mb-12 max-w-[220px] mx-auto italic">
                                                    Macro-engagement levels exceed network baselines by 24.8% this cycle.
                                                </p>
                                                <button className="w-full bg-white text-indigo-950 py-6 rounded-[2.2rem] font-black text-[10px] uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all duration-500 shadow-2xl shadow-black/20 italic">
                                                    Access Analytics Console
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'students' && (
                                <div className="bg-white rounded-[4rem] shadow-2xl shadow-indigo-950/5 border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-700">
                                    <div className="p-12 border-b border-gray-50 flex flex-col lg:flex-row items-center justify-between gap-10 bg-gray-50/20">
                                        <div className="relative w-full lg:w-[500px] group">
                                            <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-indigo-950 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Filter human assets by UID, name, or signal identity..."
                                                className="w-full bg-white border-2 border-transparent rounded-[2.5rem] py-6 pl-16 pr-8 text-sm font-black text-indigo-950 focus:ring-8 focus:ring-indigo-50 focus:border-indigo-100 shadow-inner italic transition-all outline-none"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center space-x-6">
                                            <div className="bg-white px-8 py-4 rounded-[2rem] border border-gray-100 flex items-center space-x-3 shadow-sm italic">
                                                <Clock size={16} className="text-gray-300" />
                                                <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest">Active Cycle: Autumn 2024</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-white border-b border-gray-50">
                                                    <th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Signal Identity</th>
                                                    <th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-center">Protocol Alignment</th>
                                                    <th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-center">Score Matrix</th>
                                                    <th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-center">Active Status</th>
                                                    <th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-right">Oversight</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {filteredStudents.map(student => (
                                                    <tr key={student._id} className="hover:bg-gray-50/50 transition-all duration-300 group">
                                                        <td className="px-12 py-8">
                                                            <div className="flex items-center space-x-6">
                                                                <div className="h-16 w-16 rounded-[1.8rem] bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl border-4 border-white shadow-xl group-hover:rotate-6 group-hover:scale-110 transition duration-500 uppercase italic">
                                                                    {student.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-indigo-950 tracking-tighter text-lg italic uppercase leading-none mb-1.5">{student.name}</p>
                                                                    <p className="text-[10px] font-black text-gray-300 tracking-widest uppercase italic">{student.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-12 py-8 text-center">
                                                            <div className="inline-flex items-center space-x-3 px-6 py-2.5 rounded-full bg-white border border-gray-100 shadow-sm">
                                                                <div className={`h-2.5 w-2.5 rounded-full shadow-lg ${student.house === 'Red' ? 'bg-red-500 shadow-red-500/30' :
                                                                    student.house === 'Blue' ? 'bg-indigo-500 shadow-indigo-500/30' :
                                                                        student.house === 'Green' ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-amber-500 shadow-amber-500/30'}`}></div>
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-950 italic">Sector {student.house}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-12 py-8 text-center font-black text-3xl text-indigo-950 tracking-tighter italic">{student.points}</td>
                                                        <td className="px-12 py-8 text-center">
                                                            <span className={`inline-flex items-center space-x-2.5 px-5 py-2.5 rounded-full border-2 text-[10px] font-black uppercase tracking-widest italic ${student.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 'bg-rose-50 text-rose-600 border-rose-100/50'}`}>
                                                                <div className={`h-2 w-2 rounded-full ${student.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                                                <span>{student.isActive ? 'Authorized' : 'Suspended'}</span>
                                                            </span>
                                                        </td>
                                                        <td className="px-12 py-8 text-right">
                                                            <button
                                                                onClick={() => handleBanUser(student._id)}
                                                                className={`p-4 rounded-2xl shadow-xl transition-all duration-500 italic uppercase text-[9px] font-black tracking-widest flex items-center space-x-3 ml-auto active:scale-95 ${student.isActive ? 'bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white shadow-rose-950/5' : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-600 hover:text-white shadow-emerald-950/5'}`}
                                                            >
                                                                {student.isActive ? <Ban size={14} /> : <UserCheck size={14} />}
                                                                <span>{student.isActive ? 'Enact Suspension' : 'Restore Signal'}</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'clubs' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {clubs.map(club => (
                                        <div key={club._id} className="bg-white rounded-[4rem] shadow-2xl shadow-indigo-950/5 border border-gray-100 overflow-hidden group hover:shadow-2xl hover:shadow-indigo-950/10 transition-all duration-700 relative flex flex-col border-transparent hover:border-primary-100 hover:-translate-y-2">
                                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000 pointer-events-none">
                                                <Users size={160} />
                                            </div>

                                            <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/30 backdrop-blur-sm relative z-10">
                                                <div className="flex items-center space-x-6">
                                                    <div className="h-24 w-24 rounded-[2.5rem] bg-indigo-950 text-white flex items-center justify-center font-black text-3xl border-4 border-white shadow-2xl shadow-indigo-950/20 uppercase italic group-hover:rotate-12 transition duration-700">
                                                        {club.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase italic leading-none mb-2">{club.name}</h3>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Directorate: </span>
                                                            <span className="text-[10px] font-black text-indigo-600 uppercase italic">{club.createdBy?.name}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-10 flex-1 relative z-10">
                                                <div className="grid grid-cols-2 gap-8 mb-10">
                                                    <div className="bg-gray-50 p-7 rounded-[2.5rem] border border-gray-100 text-center relative overflow-hidden group/tile transition-all hover:bg-white hover:shadow-xl">
                                                        <p className="text-4xl font-black text-indigo-950 tracking-tighter italic leading-none mb-2">{club.members.length}</p>
                                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">Member Registry</p>
                                                    </div>
                                                    <div className="bg-gray-50 p-7 rounded-[2.5rem] border border-gray-100 text-center relative overflow-hidden group/tile transition-all hover:bg-white hover:shadow-xl">
                                                        <p className="text-4xl font-black text-indigo-950 tracking-tighter italic leading-none mb-2">12</p>
                                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">Recorded Flux</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between gap-6">
                                                    <button
                                                        onClick={() => setExpandedClub(expandedClub === club._id ? null : club._id)}
                                                        className={`flex-1 flex items-center justify-center space-x-4 py-6 rounded-[2.2rem] font-black text-[10px] uppercase tracking-widest transition-all duration-500 italic shadow-2xl ${expandedClub === club._id ? 'bg-indigo-950 text-white shadow-indigo-950/20' : 'bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white shadow-primary-500/10'}`}
                                                    >
                                                        <Activity size={16} />
                                                        <span>{expandedClub === club._id ? 'Close Audit' : 'Initiate Audit'}</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClub(club._id)}
                                                        className="p-6 bg-rose-50 rounded-[2.2rem] text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-xl shadow-rose-950/5 duration-500 active:scale-95"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </div>

                                            {expandedClub === club._id && (
                                                <div className="bg-indigo-950 p-12 border-t border-white/5 animate-in slide-in-from-top-12 duration-700 relative z-20">
                                                    <div className="flex items-center justify-between mb-8">
                                                        <h4 className="text-[10px] font-black text-primary-400 uppercase tracking-[0.4em] italic flex items-center">
                                                            <Shield size={12} className="mr-3" /> Secure Node Registry
                                                        </h4>
                                                        <span className="text-[9px] font-black text-white/20 uppercase italic">{club.members.length} Active Signals</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {club.members.map(m => (
                                                            <div key={m._id} className="bg-white/5 backdrop-blur-2xl p-5 rounded-[1.8rem] border border-white/5 flex items-center space-x-5 shadow-2xl group/node hover:bg-white hover:border-white transition-all duration-500">
                                                                <div className="h-10 w-10 rounded-2xl bg-white/10 text-white flex items-center justify-center font-black text-xs uppercase italic group-hover/node:bg-indigo-950 group-hover/node:shadow-xl transition-all duration-500">
                                                                    {m.name.charAt(0)}
                                                                </div>
                                                                <div className="flex flex-col min-w-0">
                                                                    <span className="text-[11px] font-black text-indigo-100 uppercase tracking-tight truncate group-hover/node:text-indigo-950 transition-colors">{m.name}</span>
                                                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest italic leading-none mt-0.5 group-hover/node:text-gray-400">Verified Node</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'polls' && (
                                <div className="animate-in zoom-in-95 duration-700">
                                    <ManagePolls />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SchoolDashboard;
