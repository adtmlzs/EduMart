import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    GraduationCap, School, User, Mail,
    Lock, Key, ArrowRight, Sparkles,
    ShieldCheck, Globe, Zap, Heart,
    ChevronLeft, Activity
} from 'lucide-react';

const AuthLayout = ({ title, subtitle, children, onSubmit, onBack, error, loading }) => (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden font-outfit">
        {/* Simplified Left Pane */}
        <div className="hidden md:flex md:w-1/3 bg-indigo-950 relative items-center justify-center p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(79,70,229,0.1)_0%,_transparent_70%)]"></div>
            <div className="relative z-10 text-center">
                <div className="bg-white/5 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-white/10 backdrop-blur-xl">
                    <Sparkles className="h-8 w-8 text-primary-400" />
                </div>
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">EduMart.</h2>
                <p className="text-primary-100/30 text-xs font-medium italic tracking-widest uppercase">The Sovereign Academic Network</p>
            </div>
        </div>

        {/* Minimalistic Right Pane */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-24 relative bg-gray-50/30">
            <button
                onClick={onBack}
                className="absolute top-10 left-10 p-3 text-gray-400 hover:text-indigo-950 transition-all hover:-translate-x-1"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="max-w-md w-full mx-auto">
                <div className="mb-12">
                    <h3 className="text-5xl font-black text-indigo-950 tracking-tighter uppercase italic mb-2">{title}</h3>
                    <p className="text-gray-400 text-sm font-medium italic">{subtitle}</p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl mb-8 flex items-center space-x-3 animate-in fade-in slide-in-from-top-2">
                        <Zap className="h-4 w-4 text-rose-500" />
                        <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest italic">{error}</p>
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                    {children}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-950 hover:bg-primary-600 text-white py-6 rounded-2xl font-black shadow-2xl shadow-indigo-100 transition-all duration-500 hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-[10px] italic mt-8 flex items-center justify-center"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                            <><span>Establish Identity</span> <ArrowRight className="h-4 w-4 ml-3" /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    </div>
);

const Landing = () => {
    const [mode, setMode] = useState('landing');
    const { login, registerStudent, registerSchool } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        schoolCode: '',
        house: 'Red'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleAction = async (method, type) => {
        setLoading(true);
        const result = await method(type === 'login' ? formData.email : formData, type === 'login' ? formData.password : undefined, type === 'login' ? type : undefined);
        setLoading(false);
        if (result.success) navigate('/dashboard');
        else setError(result.message);
    };

    const resetForm = (newMode) => {
        setMode(newMode);
        setFormData({ name: '', email: '', password: '', schoolCode: '', house: 'Red' });
        setError('');
    };

    return (
        <div className="min-h-screen bg-[#FAFAFB] font-outfit">
            {mode === 'landing' && (
                <div className="relative overflow-hidden min-h-screen flex flex-col">
                    {/* Minimalist Hero */}
                    <div className="flex-1 bg-indigo-950 flex shadow-[inset_0_-100px_100px_-50px_rgba(0,0,0,0.5)] items-center justify-center px-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(79,70,229,0.15)_0%,_transparent_70%)]"></div>

                        <div className="max-w-4xl w-full relative z-10 text-center py-20">
                            <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full mb-12 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <Activity size={12} className="text-primary-400" />
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary-200">Boutique Student Network</span>
                            </div>

                            <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter mb-8 italic uppercase leading-[0.8] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                Edu<span className="text-primary-500">Mart.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-primary-100/30 max-w-xl mx-auto font-medium leading-relaxed italic mb-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                                The essential ecosystem for modern academic exchange. <br />Trade, connect, and elevate your campus journey.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5 items-center justify-center animate-in fade-in slide-in-from-bottom-16 duration-1000">
                                <button
                                    onClick={() => resetForm('student-login')}
                                    className="w-full sm:w-auto bg-white text-indigo-950 px-12 py-6 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl transition-all duration-500 hover:-translate-y-1 active:scale-95 italic flex items-center justify-center"
                                >
                                    Enter Network <ArrowRight className="h-4 w-4 ml-4" />
                                </button>
                                <button
                                    onClick={() => resetForm('school-login')}
                                    className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-12 py-6 rounded-2xl font-black text-[11px] uppercase tracking-widest backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 active:scale-95 italic"
                                >
                                    Institutional Node
                                </button>
                            </div>
                        </div>

                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20 text-[8px] font-black text-white uppercase tracking-[0.8em] italic">
                            Protocol // v2.0.4 - Secure Layer Active
                        </div>
                    </div>
                </div>
            )}

            {mode === 'student-login' && (
                <AuthLayout
                    title="Sign In."
                    subtitle="Access your academic digital identity."
                    onBack={() => resetForm('landing')}
                    error={error}
                    loading={loading}
                    onSubmit={(e) => { e.preventDefault(); handleAction(() => login(formData.email, formData.password, 'student'), 'login'); }}
                >
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Network Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-100 rounded-2xl py-5 px-8 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-sm"
                                placeholder="name@scholar.edu"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Access Key</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-100 rounded-2xl py-5 px-8 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <p className="text-[9px] font-black text-gray-300 uppercase italic text-center pt-2">
                            New Node? <button type="button" onClick={() => resetForm('student-register')} className="text-primary-500 hover:text-indigo-950 transition-colors">Register Identity</button>
                        </p>
                    </div>
                </AuthLayout>
            )}

            {mode === 'school-login' && (
                <AuthLayout
                    title="Faculty Node."
                    subtitle="Authorize institutional oversight protocol."
                    onBack={() => resetForm('landing')}
                    error={error}
                    loading={loading}
                    onSubmit={(e) => { e.preventDefault(); handleAction(() => login(formData.email, formData.password, 'school'), 'login'); }}
                >
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Admin Identifier</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-100 rounded-2xl py-5 px-8 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-sm"
                                placeholder="admin@academy.org"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Protocol Key</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-100 rounded-2xl py-5 px-8 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <p className="text-[9px] font-black text-gray-300 uppercase italic text-center pt-2">
                            Unregistered School? <button type="button" onClick={() => resetForm('school-register')} className="text-primary-500 hover:text-indigo-950 transition-colors">Initial Setup</button>
                        </p>
                    </div>
                </AuthLayout>
            )}

            {mode === 'student-register' && (
                <AuthLayout
                    title="Registration."
                    subtitle="Initialize your scholar footprint."
                    onBack={() => resetForm('student-login')}
                    error={error}
                    loading={loading}
                    onSubmit={(e) => { e.preventDefault(); handleAction(() => registerStudent(formData), 'register'); }}
                >
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-sm"
                                    placeholder="Jane Doe"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">House Unit</label>
                                <select
                                    name="house"
                                    value={formData.house}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-sm"
                                >
                                    <option value="Red">Red</option>
                                    <option value="Blue">Blue</option>
                                    <option value="Green">Green</option>
                                    <option value="Yellow">Yellow</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Academic Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-sm"
                                placeholder="name@scholar.edu"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Access Code</label>
                                <input
                                    type="text"
                                    name="schoolCode"
                                    value={formData.schoolCode}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-sm uppercase tracking-widest"
                                    placeholder="SCH-0X"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </AuthLayout>
            )}

            {mode === 'school-register' && (
                <AuthLayout
                    title="Setup Unit."
                    subtitle="Forge a new institutional node."
                    onBack={() => resetForm('school-login')}
                    error={error}
                    loading={loading}
                    onSubmit={(e) => { e.preventDefault(); handleAction(() => registerSchool(formData), 'register'); }}
                >
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Institution Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-100 rounded-2xl py-5 px-8 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-sm"
                                placeholder="Global Science Faculty"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Master Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-100 rounded-2xl py-5 px-8 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-sm"
                                placeholder="head@faculty.org"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Master Key</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-100 rounded-2xl py-5 px-8 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                </AuthLayout>
            )}
        </div>
    );
};

export default Landing;
