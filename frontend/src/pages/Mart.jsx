import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import {
    ShoppingBag, Plus, X, DollarSign,
    PackageSearch, Tag, MessageSquare,
    Sparkles, ArrowUpRight, ShieldCheck,
    Coins, Filter, Search, ChevronRight,
    Edit3, Trash2, Image as ImageIcon,
    AlignLeft, AlignCenter, AlignRight,
    Maximize, AlertCircle, ShoppingCart, Upload,
    CheckCircle2, Zap, LayoutGrid, Activity
} from 'lucide-react';

const Mart = () => {
    const { user, updateUserPoints } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [editingItemId, setEditingItemId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Electronics',
        condition: 'good',
        imageUrl: '',
        imageAlignment: 'center'
    });

    const categories = ['All', 'Electronics', 'Books', 'Stationery', 'Equipment', 'Uniforms', 'Other'];

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const schoolId = user.role === 'school' ? user.id : user.schoolId;
            const response = await API.get(`/items?schoolId=${schoolId}`);
            setItems(response.data.items);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOpenCreate = () => {
        setModalMode('create');
        setFormData({
            title: '',
            description: '',
            price: '',
            category: 'Electronics',
            condition: 'good',
            imageUrl: '',
            imageAlignment: 'center'
        });
        setShowModal(true);
    };

    const handleOpenEdit = (item) => {
        setModalMode('edit');
        setEditingItemId(item._id);
        setFormData({
            title: item.title,
            description: item.description,
            price: item.price,
            category: item.category,
            condition: item.condition,
            imageUrl: item.imageUrl || '',
            imageAlignment: item.imageAlignment || 'center'
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const schoolId = user.role === 'school' ? user.id : user.schoolId;

            if (modalMode === 'create') {
                const response = await API.post('/items', {
                    ...formData,
                    seller: user.id,
                    schoolId: schoolId
                });
                setItems([response.data.item, ...items]);
                if (user.role === 'student') {
                    updateUserPoints((user.points || 0) + 10);
                }
            } else {
                const response = await API.put(`/items/${editingItemId}`, {
                    ...formData,
                    sellerId: user.id
                });
                setItems(items.map(it => it._id === editingItemId ? response.data.item : it));
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error handling item submit:', error);
        }
    };

    const handleDelete = async (itemId) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await API.delete(`/items/${itemId}?sellerId=${user.id}`);
            setItems(items.filter(it => it._id !== itemId));
        } catch (error) {
            console.error('Delete Error:', error);
        }
    };

    const handleChatWithSeller = async (item) => {
        try {
            const response = await API.post('/chat/conversation', {
                participant1: user.id,
                participant2: item.seller?._id
            });
            const convId = response.data._id;
            window.location.href = `/inbox?id=${convId}&item=${encodeURIComponent(item.title)}&price=${item.price}`;
        } catch (err) {
            console.error('Chat Error:', err);
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-[#FAFAFB] pb-24">
            {/* Boutique Header */}
            <div className="bg-indigo-950 pt-16 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2/3 h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10 text-center">
                    <div className="inline-flex items-center space-x-3 bg-white/5 px-5 py-2.5 rounded-full mb-8 border border-white/5 backdrop-blur-xl">
                        <Sparkles className="h-4 w-4 text-primary-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary-200 italic">Peer-to-Peer Exchange</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 italic uppercase leading-none">
                        Student <span className="text-primary-500">Mart.</span>
                    </h1>
                    <p className="text-xl text-primary-100/30 max-w-2xl mx-auto font-medium italic leading-relaxed">
                        The boutique marketplace for pre-loved academic essentials. <br />Safe, verified, and community-driven.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-10 -mt-20 pb-12 relative z-20">
                {/* Search & Marketplace Hub */}
                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-indigo-950/5 p-4 mb-12 border border-gray-50 flex flex-col lg:flex-row items-center gap-6">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                        <input
                            type="text"
                            placeholder="Locate academic asset..."
                            className="w-full bg-gray-50 border-none rounded-[2.5rem] py-6 pl-16 pr-8 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-primary-50 transition-all italic"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center space-x-8 px-8 py-4 lg:border-l border-gray-100 min-w-[300px] justify-center lg:justify-end">
                        <div className="text-right">
                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic mb-1">Network Activity</p>
                            <p className="text-2xl font-black text-indigo-950 italic tracking-tighter leading-none">+{items.length} ACTIVE</p>
                        </div>
                        {user.role === 'student' && (
                            <button
                                onClick={handleOpenCreate}
                                className="bg-indigo-950 hover:bg-primary-600 text-white px-8 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest italic shadow-2xl transition-all duration-500 hover:-translate-y-2 flex items-center space-x-3"
                            >
                                <Plus size={14} />
                                <span>List Asset</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Matrix */}
                <div className="flex overflow-x-auto pb-8 space-x-3 no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-3.5 rounded-[1.8rem] text-[10px] font-black whitespace-nowrap transition-all duration-500 uppercase tracking-widest italic ${activeCategory === cat
                                ? 'bg-indigo-950 text-white shadow-2xl shadow-indigo-950/20 scale-105'
                                : 'bg-white text-gray-300 border border-gray-50 hover:border-primary-100 hover:text-indigo-950'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Mart Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent"></div>
                        <p className="text-gray-300 font-black uppercase text-[9px] tracking-[0.3em] mt-8 italic">Synchronizing Marketplace...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="bg-white rounded-[4rem] p-32 text-center border border-gray-100 shadow-2xl shadow-indigo-950/5">
                        <div className="bg-gray-50 h-24 w-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-white shadow-inner">
                            <PackageSearch className="h-10 w-10 text-gray-200" />
                        </div>
                        <h3 className="text-3xl font-black text-indigo-950 mb-4 tracking-tighter uppercase italic leading-none">Zero Inventory</h3>
                        <p className="text-gray-400 font-medium italic">The marketplace is currently awaiting new asset intake.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredItems.map((item) => {
                            const isSeller = item.seller?._id === user.id;

                            return (
                                <div key={item._id} className="group relative bg-white rounded-[3.5rem] shadow-2xl shadow-indigo-950/5 border border-transparent hover:border-primary-100 transition-all duration-700 hover:-translate-y-3 overflow-hidden flex flex-col min-h-[500px]">

                                    {isSeller && (
                                        <div className="absolute top-6 right-6 z-30 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                            <button onClick={() => handleOpenEdit(item)} className="p-3 bg-white shadow-xl rounded-2xl text-gray-400 hover:text-indigo-950 transition-all"><Edit3 size={14} /></button>
                                            <button onClick={() => handleDelete(item._id)} className="p-3 bg-white shadow-xl rounded-2xl text-gray-400 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                                        </div>
                                    )}

                                    {/* Product Visual */}
                                    <div className="relative h-64 overflow-hidden bg-gray-50">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${item.imageAlignment === 'left' ? 'object-left' : item.imageAlignment === 'right' ? 'object-right' : 'object-center'}`}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="h-16 w-16 text-gray-100 group-hover:scale-110 transition-all duration-700" />
                                            </div>
                                        )}
                                        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                                            <div className="bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-2xl border border-white/50 font-black text-indigo-950 text-xl italic tracking-tighter">
                                                {item.price} EP
                                            </div>
                                            <div className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest text-white shadow-lg italic ${item.condition === 'new' ? 'bg-emerald-500' : item.condition === 'like-new' ? 'bg-indigo-500' : 'bg-amber-500'}`}>
                                                Grade: {item.condition}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <Tag className="h-3 w-3 text-primary-400" />
                                            <span className="text-[9px] font-black text-primary-500 uppercase tracking-widest italic">{item.category}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-indigo-950 mb-3 tracking-tighter italic uppercase leading-none group-hover:text-primary-600 transition-colors truncate">{item.title}</h3>
                                        <p className="text-gray-400 text-[11px] font-medium italic mb-8 line-clamp-2 leading-relaxed">{item.description}</p>

                                        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm border border-indigo-100 shadow-inner italic">
                                                    {item.seller?.name?.charAt(0)}
                                                </div>
                                                <span className="text-[9px] font-black text-indigo-950 italic uppercase tracking-tighter truncate max-w-[80px]">{item.seller?.name}</span>
                                            </div>
                                            <div className="flex items-center text-emerald-500">
                                                <ShieldCheck className="h-3 w-3 mr-1" />
                                                <span className="text-[8px] font-black uppercase italic">Verified</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 pt-0">
                                        {user.id !== item.seller?._id && user.role === 'student' ? (
                                            <button
                                                onClick={() => handleChatWithSeller(item)}
                                                className="w-full bg-indigo-950 hover:bg-primary-600 text-white py-5 rounded-[2.2rem] font-black text-[10px] flex items-center justify-center space-x-3 transition-all duration-500 shadow-2xl shadow-indigo-950/20 uppercase tracking-widest italic group/btn"
                                            >
                                                <MessageSquare size={14} className="group-hover/btn:-translate-y-1 transition-transform" />
                                                <span>Initiate Negotiation</span>
                                            </button>
                                        ) : isSeller && (
                                            <div className="w-full bg-indigo-50 text-indigo-400 py-5 rounded-[2.2rem] font-black text-[9px] text-center uppercase tracking-[0.3em] border border-indigo-100 italic">
                                                Authorization Node
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Premium Intake Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-indigo-950/80 flex items-center justify-center z-[100] p-6 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white rounded-[4rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20 relative">
                        <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 z-20 p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-indigo-950 transition-all hover:rotate-90">
                            <X size={24} />
                        </button>

                        <div className="bg-indigo-950 p-12 text-white relative">
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-500 opacity-10 skew-x-12"></div>
                            <div className="relative z-10">
                                <h2 className="text-5xl font-black tracking-tighter leading-none mb-4 uppercase italic">
                                    {modalMode === 'create' ? 'Market' : 'Asset'} <br /><span className="text-primary-500">Intake.</span>
                                </h2>
                                <p className="text-primary-100/40 font-medium italic">Configure asset profile for network circulation.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-12 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic ml-2">Display Title</label>
                                    <input name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] py-6 px-10 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner" placeholder="e.g. Graphic Tablet" />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic ml-2">Network Valuation (EP)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] py-6 px-10 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner" placeholder="500" />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic ml-2">Market Cluster</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] py-6 px-10 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner">
                                        {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic ml-2">Asset Integrity</label>
                                    <select name="condition" value={formData.condition} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] py-6 px-10 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner">
                                        <option value="new">Pristine Protocol</option>
                                        <option value="like-new">A-Grade Pulse</option>
                                        <option value="good">Standard Sync</option>
                                        <option value="fair">Functional Data</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic ml-2">Asset Specifications</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" required className="w-full bg-gray-50 border border-gray-100 rounded-[2.5rem] py-6 px-10 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner resize-none" placeholder="Provide detailed operational history..."></textarea>
                            </div>

                            {/* Imaging Module */}
                            <div className="space-y-6 pt-6 border-t border-gray-100">
                                <label className="block text-[11px] font-black text-indigo-950 uppercase tracking-[0.3em] italic mb-2">Visual Decryption</label>
                                {!formData.imageUrl ? (
                                    <div className="relative group">
                                        <input type="file" accept="image/*" onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => setFormData({ ...formData, imageUrl: reader.result });
                                                reader.readAsDataURL(file);
                                            }
                                        }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                        <div className="w-full bg-gray-50 border-2 border-dashed border-gray-100 rounded-[3rem] py-16 flex flex-col items-center justify-center transition-all group-hover:bg-primary-50 group-hover:border-primary-200">
                                            <div className="h-16 w-16 bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-all"><Upload size={24} className="text-primary-500" /></div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Incorporate Visual Asset</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="relative h-64 rounded-[3.5rem] overflow-hidden border-4 border-white shadow-2xl group">
                                            <img src={formData.imageUrl} className={`w-full h-full object-cover ${formData.imageAlignment === 'left' ? 'object-left' : formData.imageAlignment === 'right' ? 'object-right' : 'object-center'}`} />
                                            <button type="button" onClick={() => setFormData({ ...formData, imageUrl: '' })} className="absolute top-6 right-6 p-4 bg-red-500 text-white rounded-2xl shadow-xl hover:bg-red-600 transition-all"><Trash2 size={20} /></button>
                                        </div>
                                        <div className="flex bg-gray-50 p-3 rounded-[2.5rem] w-fit shadow-inner">
                                            {[
                                                { id: 'left', icon: AlignLeft },
                                                { id: 'center', icon: AlignCenter },
                                                { id: 'right', icon: AlignRight },
                                                { id: 'full', icon: Maximize }
                                            ].map(opt => (
                                                <button key={opt.id} type="button" onClick={() => setFormData({ ...formData, imageAlignment: opt.id })} className={`p-4 rounded-[2rem] transition-all ${formData.imageAlignment === opt.id ? 'bg-white text-primary-500 shadow-xl scale-110' : 'text-gray-300'}`}>
                                                    <opt.icon size={20} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="w-full bg-indigo-950 hover:bg-primary-600 text-white py-6 rounded-[2.2rem] font-black shadow-2xl transition-all duration-500 hover:-translate-y-2 uppercase tracking-widest text-[10px] italic">
                                {modalMode === 'create' ? 'Broadcast Asset' : 'Sync Updates'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mart;
