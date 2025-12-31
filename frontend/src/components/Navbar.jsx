import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, ShoppingBag, Users,
    BookOpen, MessageCircle, BarChart3,
    LogOut, Menu, X, Inbox, Shield,
    Bell, Zap
} from 'lucide-react';
import NotificationPanel from './NotificationPanel';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Mart', path: '/mart', icon: ShoppingBag },
        { name: 'Clubs', path: '/clubs', icon: Users },
        { name: 'Vault', path: '/notes', icon: BookOpen },
        { name: 'Pulse', path: '/confessions', icon: MessageCircle },
        { name: 'Polls', path: '/polls', icon: BarChart3 },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-indigo-950 text-white sticky top-0 z-50 border-b border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl bg-indigo-950/90">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="flex items-center justify-between h-24">
                    <div className="flex items-center space-x-6">
                        <Link to="/dashboard" className="flex items-center space-x-4 group">
                            <div className="bg-gradient-to-tr from-primary-500 to-indigo-500 p-2.5 rounded-[1.2rem] shadow-2xl group-hover:rotate-12 transition-all duration-500">
                                <Zap className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black tracking-tighter uppercase italic leading-none">EduMart</span>
                                <span className="text-[8px] font-black text-primary-400 uppercase tracking-[0.4em] mt-1 italic">Network Node</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center space-x-2 bg-white/5 p-1.5 rounded-[1.8rem] border border-white/5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-5 py-3 rounded-[1.4rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center space-x-3 ${isActive(link.path)
                                        ? 'bg-white text-indigo-950 shadow-xl scale-105'
                                        : 'text-primary-100/60 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <link.icon className={`h-4 w-4 ${isActive(link.path) ? 'text-indigo-600' : ''}`} />
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            to="/inbox"
                            className={`p-4 rounded-[1.5rem] transition-all duration-500 group relative ${isActive('/inbox') ? 'bg-primary-600' : 'bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            <Inbox className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                            {/* Simple Badge Mockup */}
                            <span className="absolute top-3 right-3 h-2 w-2 bg-red-500 rounded-full border-2 border-indigo-950"></span>
                        </Link>

                        <div className="bg-white/5 p-1 rounded-[1.5rem]">
                            <NotificationPanel />
                        </div>

                        {user.role === 'school' && (
                            <Link
                                to="/admin"
                                className="bg-amber-500 text-amber-950 p-4 rounded-[1.5rem] hover:bg-amber-400 transition-all duration-500 shadow-2xl shadow-amber-900/20 flex items-center space-x-3 font-black text-[10px] uppercase tracking-widest italic"
                            >
                                <Shield className="h-5 w-5" />
                                <span>Control</span>
                            </Link>
                        )}

                        <div className="h-8 w-px bg-white/10 mx-2"></div>

                        <button
                            onClick={handleLogout}
                            className="bg-red-500/10 text-red-400 p-4 rounded-[1.5rem] hover:bg-red-500 hover:text-white transition-all duration-500 group shadow-lg"
                        >
                            <LogOut className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden flex items-center space-x-4">
                        <NotificationPanel />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-white/5 p-4 rounded-2xl text-primary-100 hover:text-white transition-all"
                        >
                            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="lg:hidden bg-indigo-900/95 backdrop-blur-3xl border-t border-white/5 animate-in slide-in-from-top-6 duration-500 overflow-hidden">
                    <div className="px-6 pt-6 pb-12 space-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center space-x-5 px-6 py-6 rounded-[2rem] transition-all duration-300 ${isActive(link.path)
                                        ? 'bg-white text-indigo-950 shadow-2xl'
                                        : 'text-primary-100 hover:bg-white/5'
                                    }`}
                            >
                                <link.icon className="h-6 w-6" />
                                <span className="text-lg font-black uppercase italic tracking-tighter">{link.name}</span>
                                {isActive(link.path) && <Zap className="h-4 w-4 ml-auto text-primary-500 animate-pulse" />}
                            </Link>
                        ))}
                        <div className="h-px bg-white/5 my-6"></div>
                        <Link
                            to="/inbox"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center space-x-5 px-6 py-6 rounded-[2rem] text-primary-100 bg-white/5 flex items-center"
                        >
                            <Inbox className="h-6 w-6" />
                            <span className="text-lg font-black uppercase italic tracking-tighter">Secure Comms</span>
                        </Link>
                        {user.role === 'school' && (
                            <Link
                                to="/admin"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center space-x-5 px-6 py-6 rounded-[2rem] bg-amber-500 text-amber-950 shadow-xl"
                            >
                                <Shield className="h-6 w-6" />
                                <span className="text-lg font-black uppercase italic tracking-tighter">Command Center</span>
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-5 px-6 py-6 rounded-[2rem] text-red-400 bg-red-500/10 mt-6"
                        >
                            <LogOut className="h-6 w-6" />
                            <span className="text-lg font-black uppercase italic tracking-tighter">Terminate Session</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
