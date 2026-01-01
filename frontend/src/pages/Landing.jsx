import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    GraduationCap, School, User, Mail,
    Lock, Key, ArrowRight, Sparkles,
    ShieldCheck, Globe, Zap, Heart,
    ChevronLeft, Activity
} from 'lucide-react';

const AuthLayout = ({ title, subtitle, children, onSubmit, onBack, error, loading, ctaText = "Establish Identity" }) => (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row items-stretch overflow-hidden font-outfit">
        {/* Extreme Minimalist Left Pane - Hidden/Mobile Header on small screens */}
        <div className="lg:w-[40%] bg-indigo-950 relative flex flex-row lg:flex-col justify-between p-6 md:p-12 lg:p-20 overflow-hidden shrink-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,_rgba(79,70,229,0.15)_0%,_transparent_50%)]"></div>

            <div className="relative z-10">
                <div onClick={onBack} className="cursor-pointer group inline-flex items-center space-x-3 lg:space-x-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all duration-500">
                        <ChevronLeft className="h-4 w-4 lg:h-5 lg:w-5 text-white/50 group-hover:text-white" />
                    </div>
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] italic group-hover:text-white/70 transition-colors hidden sm:inline-block">Portal Return</span>
                </div>
            </div>

            <div className="relative z-10 mt-auto hidden lg:block">
                <div className="w-20 h-1 bg-primary-500 mb-10"></div>
                <h2 className="text-5xl xl:text-7xl font-black text-white italic uppercase tracking-tighter leading-none mb-6">
                    Identity <br /><span className="text-primary-500">Protocol.</span>
                </h2>
                <p className="text-primary-100/30 text-sm font-medium italic tracking-widest max-w-xs leading-relaxed">
                    Secure institutional access layer for the EduMart sovereign network.
                </p>
            </div>

            <div className="relative z-10 flex items-center space-x-6 lg:mt-0">
                <div className="lg:hidden">
                    <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">EduMart.</h2>
                </div>
                <div className="hidden lg:flex -space-x-3">
                    {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-950 bg-indigo-900/50 backdrop-blur-md"></div>)}
                </div>
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] italic leading-none hidden lg:block">Global Nodes Active</span>
            </div>
        </div>

        {/* Ultra-Clean Right Pane */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-20 lg:px-32 py-12 md:py-20 relative bg-[#FAFAFB] overflow-y-auto">
            <div className="max-w-xl w-full mx-auto">
                <div className="mb-10 lg:mb-16">
                    <h3 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-indigo-950 tracking-tighter uppercase italic leading-[0.85] mb-4 lg:mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {title}
                    </h3>
                    <p className="text-gray-400 text-base md:text-lg font-medium italic animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-100">{subtitle}</p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-100 p-5 lg:p-6 rounded-2xl lg:rounded-3xl mb-8 lg:mb-10 flex items-center space-x-4 animate-in zoom-in-95 duration-500">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl lg:rounded-2xl bg-rose-500 flex items-center justify-center shrink-0">
                            <Zap className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                        </div>
                        <p className="text-[10px] lg:text-[11px] font-black text-rose-600 uppercase tracking-widest italic leading-tight">{error}</p>
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    <div className="space-y-6 lg:space-y-8">
                        {children}
                    </div>

                    <div className="pt-4 lg:pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full bg-indigo-950 hover:bg-primary-600 text-white py-6 md:py-8 rounded-[1.8rem] md:rounded-[2.5rem] font-black shadow-2xl shadow-indigo-200 transition-all duration-700 hover:-translate-y-2 active:scale-[0.98] uppercase tracking-[0.2em] text-[10px] md:text-xs italic flex items-center justify-center overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-2 border-white border-t-transparent"></div>
                            ) : (
                                <div className="flex items-center">
                                    <span>{ctaText}</span>
                                    <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-3 md:ml-4 group-hover:translate-x-2 transition-transform duration-500" />
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="absolute bottom-6 md:bottom-10 right-10 opacity-5 md:opacity-10 pointer-events-none hidden sm:block">
                <span className="text-[9px] md:text-[10px] font-black text-indigo-950 uppercase tracking-[0.6em] md:tracking-[1em] italic">Encrypted Connection</span>
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
        uniqueCode: '',
        house: 'Red'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [schoolRegistrationSuccess, setSchoolRegistrationSuccess] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Auto-uppercase schoolCode/uniqueCode
        const finalValue = (name === 'schoolCode' || name === 'uniqueCode') ? value.toUpperCase() : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
        setError('');
    };

    const handleAction = async (method, type) => {
        setLoading(true);
        const result = await method(type === 'login' ? formData.email : formData, type === 'login' ? formData.password : undefined, type === 'login' ? type : undefined);
        setLoading(false);
        if (result.success) {
            if (mode === 'school-register') {
                // Find the school just registered from context if needed, 
                // but AuthContext doesn't pass the code back directly in the result object easily.
                // However, the backend DOES send it. 
                // Let's modify handleAction to handle the user object from result if possible.
                // Actually, let's just use the user object from useAuth() which is updated on success.
                setSchoolRegistrationSuccess(true);
            } else {
                navigate('/dashboard');
            }
        }
        else setError(result.message);
    };

    const resetForm = (newMode) => {
        setMode(newMode);
        setSchoolRegistrationSuccess(null);
        setFormData({ name: '', email: '', password: '', schoolCode: '', uniqueCode: '', house: 'Red' });
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

                            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white tracking-tighter mb-8 italic uppercase leading-[0.8] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                Edu<span className="text-primary-500">Mart.</span>
                            </h1>
                            <p className="text-base md:text-xl text-primary-100/30 max-w-xl mx-auto font-medium leading-relaxed italic mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                                The essential ecosystem for modern academic exchange. <br />Trade, connect, and elevate your campus journey.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 md:gap-5 items-center justify-center animate-in fade-in slide-in-from-bottom-16 duration-1000">
                                <button
                                    onClick={() => resetForm('student-login')}
                                    className="w-full sm:w-auto bg-white text-indigo-950 px-8 md:px-12 py-5 md:py-6 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-widest shadow-2xl transition-all duration-500 hover:-translate-y-1 active:scale-95 italic flex items-center justify-center"
                                >
                                    Enter Network <ArrowRight className="h-4 w-4 ml-3 md:ml-4" />
                                </button>
                                <button
                                    onClick={() => resetForm('school-login')}
                                    className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 md:px-12 py-5 md:py-6 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-widest backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 active:scale-95 italic text-center"
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
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 italic">Network Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-100 rounded-[2rem] py-6 px-10 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner"
                                placeholder="name@scholar.edu"
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 italic">Access Key</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-100 rounded-[2rem] py-6 px-10 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div className="pt-10 border-t border-gray-50 flex flex-col items-center space-y-4">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">New Node in the Network?</p>
                            <button
                                type="button"
                                onClick={() => resetForm('student-register')}
                                className="text-lg font-black text-primary-500 hover:text-indigo-950 transition-all duration-500 uppercase italic tracking-tighter"
                            >
                                Register Identity.
                            </button>
                        </div>
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
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 italic">Admin Identifier</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-100 rounded-[2rem] py-6 px-10 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner"
                                placeholder="admin@academy.org"
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 italic">Protocol Key</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-100 rounded-[2rem] py-6 px-10 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div className="pt-10 border-t border-gray-50 flex flex-col items-center space-y-4">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Unregistered Institution?</p>
                            <button
                                type="button"
                                onClick={() => resetForm('school-register')}
                                className="text-lg font-black text-primary-500 hover:text-indigo-950 transition-all duration-500 uppercase italic tracking-tighter"
                            >
                                Initial Setup.
                            </button>
                        </div>
                    </div>
                </AuthLayout>
            )}

            {mode === 'student-register' && (
                <AuthLayout
                    title="Registration."
                    subtitle="Initialize your scholar footprint."
                    ctaText="Establish Identity"
                    onBack={() => resetForm('student-login')}
                    error={error}
                    loading={loading}
                    onSubmit={(e) => { e.preventDefault(); handleAction(() => registerStudent(formData), 'register'); }}
                >
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 italic">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-100 rounded-[2rem] py-6 px-10 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner"
                                    placeholder="Jane Doe"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 italic">House Unit</label>
                                <select
                                    name="house"
                                    value={formData.house}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-100 rounded-[2rem] py-6 px-10 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner cursor-pointer"
                                >
                                    <option value="Red">Red</option>
                                    <option value="Blue">Blue</option>
                                    <option value="Green">Green</option>
                                    <option value="Yellow">Yellow</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 italic">Academic Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-100 rounded-[2rem] py-6 px-10 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner"
                                placeholder="name@scholar.edu"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 italic">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-100 rounded-[2rem] py-6 px-10 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 italic">Unique School Code</label>
                                <input
                                    type="text"
                                    name="schoolCode"
                                    value={formData.schoolCode}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-100 rounded-[2rem] py-6 px-10 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner uppercase tracking-[0.3em]"
                                    placeholder="DPS-2025"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </AuthLayout>
            )}

            {mode === 'school-register' && (
                <AuthLayout
                    title={schoolRegistrationSuccess ? "Node Forged." : "Setup Unit."}
                    subtitle={schoolRegistrationSuccess ? "Your institutional identity is active." : "Forge a new institutional node."}
                    onBack={() => resetForm('school-login')}
                    error={error}
                    loading={loading}
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (schoolRegistrationSuccess) navigate('/dashboard');
                        else handleAction(() => registerSchool(formData), 'register');
                    }}
                >
                    {schoolRegistrationSuccess ? (
                        <div className="space-y-10 py-4 animate-in fade-in zoom-in-95 duration-700">
                            <div className="bg-gradient-to-br from-indigo-950 to-indigo-900 p-10 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                                <div className="relative z-10 text-center">
                                    <span className="text-[10px] font-black text-primary-400 uppercase tracking-[0.4em] mb-4 block italic">Unique Institution Code</span>
                                    <h4 className="text-6xl font-black text-white italic tracking-tighter select-all">{user?.uniqueCode}</h4>
                                    <p className="mt-6 text-[11px] text-primary-100/30 font-bold uppercase tracking-widest leading-relaxed italic">
                                        Distribute this unique code to your <br />authorized student body.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl flex items-center space-x-4">
                                <div className="bg-emerald-500 p-2 rounded-lg">
                                    <ShieldCheck className="h-4 w-4 text-white" />
                                </div>
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">
                                    Security Layer established.
                                </p>
                            </div>
                        </div>
                    ) : (
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
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Create Unique Code</label>
                                <input
                                    type="text"
                                    name="uniqueCode"
                                    value={formData.uniqueCode}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-100 rounded-2xl py-5 px-8 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-sm uppercase tracking-widest"
                                    placeholder="DPS-2025"
                                    required
                                />
                            </div>
                        </div>
                    )}
                </AuthLayout>
            )}
        </div>
    );
};

export default Landing;
