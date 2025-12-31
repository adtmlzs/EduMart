import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import {
    Send, User, Search, MessageSquare,
    Ghost, ArrowLeft, MoreVertical,
    Sparkles, ShieldCheck, ShoppingBag,
    ChevronRight, Clock, Plus, Zap
} from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Inbox = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (user && user.id) fetchConversations();
    }, [user]);

    const fetchConversations = async () => {
        try {
            const response = await API.get(`/chat/conversations/${user.id}`);
            setConversations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching conversations:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeChat && socket) {
            socket.emit('join_room', activeChat._id);
            fetchMessages(activeChat._id);

            const params = new URLSearchParams(window.location.search);
            const itemName = params.get('item');
            const itemPrice = params.get('price');
            if (itemName && itemPrice) {
                const autoMsg = `Hi, I am interested in buying ${itemName} listed for ₹${itemPrice}. Is it still available?`;
                socket.emit('send_message', {
                    conversationId: activeChat._id,
                    sender: user.id,
                    content: autoMsg
                });
                window.history.replaceState({}, document.title, "/inbox");
            }
        }
    }, [activeChat, socket]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const convId = params.get('id');
        if (convId && conversations.length > 0) {
            const found = conversations.find(c => c._id === convId);
            if (found) setActiveChat(found);
        }
    }, [conversations]);

    const fetchMessages = async (convId) => {
        try {
            const response = await API.get(`/chat/messages/${convId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        if (!socket) return;
        socket.on('receive_message', (message) => {
            if (activeChat && message.conversationId === activeChat._id) {
                setMessages((prev) => [...prev, message]);
            }
            setConversations((prev) =>
                prev.map(conv =>
                    conv._id === message.conversationId
                        ? { ...conv, lastMessage: message.content, updatedAt: new Date() }
                        : conv
                ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            );
        });
        return () => socket.off('receive_message');
    }, [socket, activeChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !activeChat) return;

        const messageData = {
            conversationId: activeChat._id,
            sender: user.id,
            content: newMessage
        };

        socket.emit('send_message', messageData);
        setNewMessage('');
    };

    const getOtherParticipant = (conv) => {
        if (!conv || !conv.participants) return null;
        return conv.participants.find(p => p._id !== user.id);
    };

    if (!user) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFB]">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent"></div>
            <p className="text-gray-300 font-black uppercase text-[9px] tracking-[0.3em] mt-8 italic">Synchronizing Pulse...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAFAFB] flex flex-col h-[calc(100vh-64px)] md:h-screen overflow-hidden">
            <div className="flex flex-1 overflow-hidden h-full">
                {/* Conversations Sidebar */}
                <div className={`w-full md:w-[450px] bg-white border-r border-gray-100 flex flex-col z-10 shadow-2xl shadow-indigo-950/5 relative ${activeChat ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-10 pb-8 bg-indigo-950 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <span className="text-[10px] font-black text-primary-400 uppercase tracking-[0.3em] mb-2 block italic">Proper Messenger</span>
                                    <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Inbox.</h1>
                                </div>
                                <div className="bg-white/10 p-3 rounded-2xl border border-white/5 backdrop-blur-xl">
                                    <MessageSquare size={20} className="text-primary-400" />
                                </div>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Filter signals..."
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold text-white placeholder:text-white/20 focus:ring-4 focus:ring-primary-500/20 transition-all italic shadow-inner outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-8 space-y-3 custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent mb-6"></div>
                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">Syncing Threads</span>
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 text-center px-10">
                                <div className="bg-gray-50 h-20 w-20 rounded-[2rem] flex items-center justify-center mb-8 border border-white shadow-inner">
                                    <Ghost className="h-8 w-8 text-gray-200" />
                                </div>
                                <h3 className="text-xl font-black text-indigo-950 uppercase italic mb-3 tracking-tighter">Dead Silence</h3>
                                <p className="text-gray-400 text-[11px] font-medium leading-relaxed italic">Your inbox is currently awaiting a conversation to spark.</p>
                            </div>
                        ) : (
                            conversations.map((conv) => {
                                const participant = getOtherParticipant(conv);
                                const isSelected = activeChat?._id === conv._id;
                                return (
                                    <button
                                        key={conv._id}
                                        onClick={() => setActiveChat(conv)}
                                        className={`w-full flex items-center p-6 rounded-[2.5rem] transition-all duration-500 relative group overflow-hidden border-2 ${isSelected
                                            ? 'bg-indigo-950 border-indigo-950 shadow-2xl shadow-indigo-950/20 -translate-y-1'
                                            : 'bg-white border-transparent hover:border-gray-100 hover:bg-gray-50/50 hover:-translate-y-0.5'}`}
                                    >
                                        <div className={`h-16 w-16 rounded-[1.8rem] flex items-center justify-center font-black text-xl flex-shrink-0 border-4 transition-all duration-500 shadow-xl ${isSelected
                                            ? 'bg-primary-600 text-white border-indigo-900 shadow-primary-500/20'
                                            : 'bg-indigo-50 text-indigo-600 border-white group-hover:scale-105'}`}>
                                            {participant?.name?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div className="ml-6 text-left flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1.5">
                                                <h4 className={`font-black tracking-tighter truncate uppercase italic text-sm ${isSelected ? 'text-white' : 'text-indigo-950'}`}>
                                                    {participant?.name || 'Academic Member'}
                                                </h4>
                                                <span className={`text-[8px] font-black uppercase tracking-[0.2em] ml-4 whitespace-nowrap ${isSelected ? 'text-primary-400' : 'text-gray-300'}`}>
                                                    {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className={`text-[11px] font-medium truncate italic ${isSelected ? 'text-indigo-200/60' : 'text-gray-400'}`}>
                                                {conv.lastMessage || 'Channel established...'}
                                            </p>
                                        </div>
                                        {isSelected && <div className="absolute top-1/2 -right-1 w-1 h-8 bg-primary-500 rounded-full -translate-y-1/2"></div>}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Primary Chat Window */}
                <div className={`flex-1 flex flex-col bg-white overflow-hidden relative shadow-2xl ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between bg-white z-20">
                                <div className="flex items-center">
                                    <button
                                        onClick={() => setActiveChat(null)}
                                        className="md:hidden mr-6 p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-indigo-950 transition"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div className="relative group cursor-pointer">
                                        <div className="bg-indigo-950 text-white h-16 w-16 rounded-[1.8rem] flex items-center justify-center font-black text-xl shadow-2xl shadow-indigo-950/20 group-hover:rotate-6 transition-transform border-4 border-white">
                                            {getOtherParticipant(activeChat)?.name?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <span className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-4 border-white shadow-xl"></span>
                                    </div>
                                    <div className="ml-6">
                                        <div className="flex items-center space-x-3">
                                            <p className="font-black text-2xl text-indigo-950 tracking-tighter uppercase italic leading-none">{getOtherParticipant(activeChat)?.name}</p>
                                            <ShieldCheck size={16} className="text-primary-500" />
                                        </div>
                                        <div className="flex items-center space-x-3 mt-2">
                                            <div className="flex items-center space-x-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <span className="text-[8px] text-emerald-600 font-black uppercase tracking-widest italic leading-none">Signal Active</span>
                                            </div>
                                            <span className="text-[8px] text-gray-300 font-black uppercase tracking-widest leading-none italic">Verified Identity</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button className="bg-gray-50 p-4 rounded-2xl text-gray-400 hover:text-primary-600 transition-all border border-transparent hover:border-primary-100">
                                        <ShoppingBag size={20} />
                                    </button>
                                    <button className="bg-white border border-gray-100 p-4 rounded-2xl text-gray-300 hover:text-indigo-950 hover:border-indigo-950 transition-all">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto px-10 py-12 space-y-8 bg-[#FDFDFD] custom-scrollbar relative">
                                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent pointer-events-none z-10 opacity-50"></div>

                                <div className="flex flex-col items-center mb-16 relative z-10">
                                    <div className="bg-white px-8 py-3 rounded-full shadow-2xl shadow-indigo-950/5 border border-gray-100 flex items-center space-x-3 mb-4">
                                        <Sparkles size={12} className="text-primary-400" />
                                        <span className="text-[9px] font-black uppercase text-indigo-950 tracking-[0.3em] italic">Privacy-Grade Protocol</span>
                                    </div>
                                    <p className="text-[9px] font-bold text-gray-300 uppercase italic tracking-widest">End-to-End Encrypted Tunnel Active</p>
                                </div>

                                {messages.map((msg, i) => {
                                    const isMe = msg.sender === user.id || msg.sender?._id === user.id;
                                    return (
                                        <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                                            <div className={`group relative max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                <div className={`px-8 py-5 transition-all duration-300 shadow-2xl ${isMe
                                                    ? 'bg-indigo-950 text-white rounded-[2.2rem] rounded-tr-[0.5rem] shadow-indigo-950/10'
                                                    : 'bg-white text-indigo-950 rounded-[2.2rem] rounded-tl-[0.5rem] border border-gray-100 shadow-indigo-950/5'
                                                    }`}>
                                                    <p className="font-bold leading-relaxed text-sm italic">{msg.content}</p>
                                                </div>
                                                <div className={`mt-3 flex items-center space-x-3 px-3 ${isMe ? 'flex-row-reverse space-x-reverse text-primary-500' : 'text-gray-300'}`}>
                                                    <span className="text-[8px] font-black uppercase tracking-widest italic opacity-60">
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {isMe && <Zap size={8} className="animate-pulse" />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Compose Area */}
                            <div className="p-10 bg-white border-t border-gray-100 z-20">
                                <form onSubmit={handleSendMessage} className="relative group">
                                    <input
                                        type="text"
                                        placeholder="Transmit signal to network..."
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-[2.5rem] py-6 pl-10 pr-24 text-sm font-bold text-indigo-950 focus:bg-white focus:border-primary-500/20 focus:ring-8 focus:ring-primary-50 shadow-inner transition-all duration-500 outline-none italic"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-950 text-white p-5 rounded-full shadow-2xl shadow-indigo-950/20 hover:bg-primary-600 hover:-translate-y-1 active:scale-95 transition-all duration-500 group/btn"
                                    >
                                        <Send size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-20 relative overflow-hidden bg-[#FAFAFB]">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/10 blur-[150px] rounded-full -mr-[250px] -mt-[250px]"></div>
                            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/10 blur-[150px] rounded-full -ml-[250px] -mb-[250px]"></div>

                            <div className="relative z-10 max-w-md">
                                <div className="relative h-48 w-48 mb-12 mx-auto">
                                    <div className="absolute inset-0 bg-white rounded-[4rem] shadow-2xl shadow-indigo-950/5 animate-pulse"></div>
                                    <div className="absolute inset-4 bg-indigo-50 rounded-[3rem] flex items-center justify-center">
                                        <MessageSquare size={48} className="text-primary-500 animate-bounce" />
                                    </div>
                                    <div className="absolute -top-4 -right-4 bg-indigo-950 text-white p-5 rounded-[2rem] shadow-2xl shadow-indigo-950/20">
                                        <Zap size={24} className="text-primary-400" />
                                    </div>
                                </div>
                                <h2 className="text-5xl font-black text-indigo-950 mb-6 tracking-tighter italic uppercase leading-[0.9]">Communication<br /><span className="text-primary-500">Node Central.</span></h2>
                                <p className="text-gray-400 text-[13px] font-medium leading-[1.8] italic mx-auto px-10">Select a peer or institutional entity to begin a secure, 256-bit encrypted signal transmission.</p>

                                <div className="mt-16 grid grid-cols-2 gap-6">
                                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-950/5 border border-transparent hover:border-primary-100 transition-all group cursor-pointer">
                                        <div className="h-14 w-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <ShoppingBag size={24} className="text-primary-600" />
                                        </div>
                                        <p className="text-[10px] font-black text-indigo-950 uppercase tracking-widest italic leading-none">Market Signal</p>
                                    </div>
                                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-950/5 border border-transparent hover:border-indigo-100 transition-all group cursor-pointer">
                                        <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <User size={24} className="text-indigo-600" />
                                        </div>
                                        <p className="text-[10px] font-black text-indigo-950 uppercase tracking-widest italic leading-none">Peer Network</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inbox;
