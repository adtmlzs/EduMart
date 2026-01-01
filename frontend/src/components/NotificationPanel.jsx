import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { Bell, BarChart3, ShoppingBag, Info, Check, Users } from 'lucide-react';

const NotificationPanel = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        if (!user || !user.id) return;
        try {
            const response = await API.get(`/notifications/${user.id}`);
            setNotifications(response.data);
            setUnreadCount(response.data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await API.put(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!user || unreadCount === 0) return;
        try {
            await API.put(`/notifications/mark-all-read/${user.id}`);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'poll': return <BarChart3 className="h-4 w-4 text-indigo-500" />;
            case 'market': return <ShoppingBag className="h-4 w-4 text-green-500" />;
            case 'club': return <Users className="h-4 w-4 text-purple-500" />;
            default: return <Info className="h-4 w-4 text-primary-500" />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative bg-white/10 p-2.5 rounded-2xl border border-white/10 hover:bg-white/20 transition group"
            >
                <Bell className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-primary-900 shadow-lg animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/5 lg:bg-transparent" onClick={() => setShowDropdown(false)}></div>
                    <div className="fixed md:absolute left-4 right-4 md:left-auto md:right-0 mt-4 md:w-96 bg-white rounded-[2rem] shadow-2xl z-50 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 origin-top-right">
                        <div className="bg-gray-50/50 px-6 md:px-8 py-5 md:py-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg md:text-xl font-black text-gray-900 tracking-tight italic uppercase">Intel.</h3>
                            <span className="text-[9px] font-black text-primary-600 uppercase tracking-widest">{unreadCount} Active</span>
                        </div>

                        <div className="max-h-[60vh] md:max-h-[450px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Bell className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-bold text-sm">All caught up!</p>
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n._id}
                                        onClick={() => markAsRead(n._id)}
                                        className={`p-6 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer flex items-start space-x-4 ${!n.isRead ? 'bg-primary-50/30' : ''}`}
                                    >
                                        <div className="mt-1 flex-shrink-0">
                                            {getTypeIcon(n.type)}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm tracking-tight ${!n.isRead ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">
                                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(n.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {!n.isRead && (
                                            <div className="h-2 w-2 bg-primary-600 rounded-full mt-2"></div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-6 bg-gray-50/50 text-center border-t border-gray-100">
                            <button
                                onClick={markAllAsRead}
                                className="text-xs font-black text-primary-600 uppercase tracking-widest hover:text-primary-700 transition"
                            >
                                Mark all as read
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationPanel;
