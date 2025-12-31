import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import {
    BookOpen, Download, Lock, Upload,
    Award, GraduationCap, Search, Filter,
    Check, Sparkles, ChevronRight, FileText,
    Brain, Star, Microscope, History, Languages,
    Maximize, Edit3, Trash2, X, AlertCircle,
    Zap, Activity, LayoutGrid, ListFilter, CheckCircle2
} from 'lucide-react';

const NotesVault = () => {
    const { user, updateUserPoints } = useAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('upload'); // 'upload' or 'edit'
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSubject, setActiveSubject] = useState('All');
    const [formData, setFormData] = useState({
        title: '',
        subject: 'Mathematics',
        pdfUrl: '',
        price: 0
    });

    const subjects = ['All', 'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Economics', 'Other'];

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const schoolId = user.role === 'school' ? user.id : user.schoolId;
            const response = await API.get(`/notes?schoolId=${schoolId}`);
            setNotes(response.data.notes);
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOpenUpload = () => {
        setModalMode('upload');
        setFormData({ title: '', subject: 'Mathematics', pdfUrl: '', price: 0 });
        setShowModal(true);
    };

    const handleOpenEdit = (note) => {
        setModalMode('edit');
        setEditingNoteId(note._id);
        setFormData({
            title: note.title,
            subject: note.subject,
            pdfUrl: note.pdfUrl,
            price: note.price
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const schoolId = user.role === 'school' ? user.id : user.schoolId;
            if (modalMode === 'upload') {
                const response = await API.post('/notes/upload', {
                    ...formData,
                    authorId: user.id,
                    schoolId
                });
                setNotes([response.data.note, ...notes]);
            } else {
                const response = await API.put(`/notes/${editingNoteId}`, {
                    ...formData,
                    authorId: user.id
                });
                setNotes(notes.map(n => n._id === editingNoteId ? response.data.note : n));
            }
            setShowModal(false);
        } catch (error) {
            console.error('Submit Note Error:', error);
        }
    };

    const handleDelete = async (noteId) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await API.delete(`/notes/${noteId}?authorId=${user.id}`);
            setNotes(notes.filter(n => n._id !== noteId));
        } catch (error) {
            console.error('Delete Error:', error);
        }
    };

    const handleUnlock = async (noteId, price) => {
        if (!window.confirm(`Unlock for ${price} points?`)) return;
        try {
            const response = await API.post(`/notes/buy/${noteId}`, { buyerId: user.id });
            updateUserPoints(response.data.remainingPoints);
            fetchNotes();
        } catch (error) {
            console.error('Unlock Error:', error);
        }
    };

    const isNoteUnlocked = (note) => {
        return note.author._id === user.id || user.unlockedNotes?.includes(note._id);
    };

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = activeSubject === 'All' || note.subject === activeSubject;
        return matchesSearch && matchesSubject;
    });

    const getSubjectIcon = (subject) => {
        const s = subject.toLowerCase();
        if (s.includes('math')) return <ChevronRight className="h-5 w-5" />;
        if (s.includes('sci')) return <Microscope className="h-5 w-5" />;
        if (s.includes('phys')) return <Brain className="h-5 w-5" />;
        if (s.includes('hist')) return <History className="h-5 w-5" />;
        if (s.includes('eng')) return <Languages className="h-5 w-5" />;
        return <FileText className="h-5 w-5" />;
    };

    return (
        <div className="min-h-screen bg-[#FAFAFB] pb-24">
            {/* Boutique Header */}
            <div className="bg-indigo-950 pt-16 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2/3 h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10 text-center">
                    <div className="inline-flex items-center space-x-3 bg-white/5 px-5 py-2.5 rounded-full mb-8 border border-white/5 backdrop-blur-xl">
                        <Sparkles className="h-4 w-4 text-primary-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary-200 italic">Academic Repository</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 italic uppercase leading-none">
                        The <span className="text-primary-500">Vault.</span>
                    </h1>
                    <p className="text-xl text-primary-100/30 max-w-2xl mx-auto font-medium italic leading-relaxed">
                        Secure study guides, peer-verified protocols, and student wisdom. <br />Trade intelligence, gain leverage.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-10 -mt-20 pb-12 relative z-20">
                {/* Search & Intelligence Hub */}
                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-indigo-950/5 p-4 mb-12 border border-gray-50 flex flex-col lg:flex-row items-center gap-6">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                        <input
                            type="text"
                            placeholder="Locate intelligence profile..."
                            className="w-full bg-gray-50 border-none rounded-[2.5rem] py-6 pl-16 pr-8 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-primary-50 transition-all italic"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center space-x-8 px-8 py-4 lg:border-l border-gray-100 min-w-[300px] justify-center lg:justify-end">
                        <div className="text-right">
                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic mb-1">Asset Balance</p>
                            <p className="text-2xl font-black text-indigo-950 italic tracking-tighter leading-none">₹{user.points || 0}</p>
                        </div>
                        {user.role === 'student' && (
                            <button
                                onClick={handleOpenUpload}
                                className="bg-indigo-950 hover:bg-primary-600 text-white px-8 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest italic shadow-2xl transition-all duration-500 hover:-translate-y-2 flex items-center space-x-3"
                            >
                                <Upload size={14} />
                                <span>Commit Asset</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Subject Matrix */}
                <div className="flex overflow-x-auto pb-8 space-x-3 no-scrollbar">
                    {subjects.map(subject => (
                        <button
                            key={subject}
                            onClick={() => setActiveSubject(subject)}
                            className={`px-8 py-3.5 rounded-[1.8rem] text-[10px] font-black whitespace-nowrap transition-all duration-500 uppercase tracking-widest italic ${activeSubject === subject
                                ? 'bg-indigo-950 text-white shadow-2xl shadow-indigo-950/20 scale-105'
                                : 'bg-white text-gray-300 border border-gray-50 hover:border-primary-100 hover:text-indigo-950'
                                }`}
                        >
                            {subject}
                        </button>
                    ))}
                </div>

                {/* Vault Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent"></div>
                        <p className="text-gray-300 font-black uppercase text-[9px] tracking-[0.3em] mt-8 italic">Synchronizing Vault...</p>
                    </div>
                ) : filteredNotes.length === 0 ? (
                    <div className="bg-white rounded-[4rem] p-32 text-center border border-gray-100 shadow-2xl shadow-indigo-950/5">
                        <div className="bg-gray-50 h-24 w-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-white shadow-inner">
                            <BookOpen className="h-10 w-10 text-gray-200" />
                        </div>
                        <h3 className="text-3xl font-black text-indigo-950 mb-4 tracking-tighter uppercase italic leading-none">Zero Intel</h3>
                        <p className="text-gray-400 font-medium italic">No assets found matching your encryption profile.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredNotes.map((note) => {
                            const unlocked = isNoteUnlocked(note);
                            const isAuthor = note.author._id === user.id;

                            return (
                                <div key={note._id} className="group relative bg-white rounded-[3.5rem] shadow-2xl shadow-indigo-950/5 border border-transparent hover:border-primary-100 transition-all duration-700 hover:-translate-y-3 overflow-hidden flex flex-col justify-between min-h-[450px]">
                                    <div className="absolute -right-10 -top-10 h-40 w-40 bg-indigo-50 opacity-0 group-hover:opacity-100 rounded-full transition-all duration-1000 group-hover:scale-150"></div>

                                    {isAuthor && (
                                        <div className="absolute top-8 right-8 z-30 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                            <button onClick={() => handleOpenEdit(note)} className="p-3 bg-white shadow-xl rounded-2xl text-gray-400 hover:text-indigo-950 transition-all"><Edit3 size={14} /></button>
                                            <button onClick={() => handleDelete(note._id)} className="p-3 bg-white shadow-xl rounded-2xl text-gray-400 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                                        </div>
                                    )}

                                    <div className="p-10 relative z-10 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-10">
                                            <div className="h-16 w-16 rounded-[1.8rem] bg-indigo-50 group-hover:bg-primary-500 flex items-center justify-center transition-all duration-500 shadow-inner group-hover:shadow-primary-500/20">
                                                {React.cloneElement(getSubjectIcon(note.subject), { className: 'text-indigo-600 group-hover:text-white transition-colors' })}
                                            </div>
                                            {!unlocked ? (
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic mb-1">Asset Value</p>
                                                    <p className="text-3xl font-black text-indigo-950 italic tracking-tighter leading-none">₹{note.price}</p>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                                                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                    <span className="text-[9px] font-black text-emerald-600 uppercase italic tracking-widest">Unlocked</span>
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-3xl font-black text-indigo-950 mb-6 tracking-tighter italic uppercase leading-none group-hover:text-primary-600 transition-colors">{note.title}</h3>

                                        <div className="flex items-center space-x-4 mt-auto">
                                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm border border-indigo-100 shadow-inner group-hover:bg-primary-500 group-hover:text-white transition-all duration-500 italic">
                                                {note.author?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-indigo-950 italic uppercase tracking-tighter leading-none mb-1">{note.author?.name}</p>
                                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic leading-none">Primary Author</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-10 pt-0 relative z-10">
                                        {unlocked ? (
                                            <a
                                                href={note.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-6 rounded-[2.2rem] font-black text-[10px] flex items-center justify-center space-x-3 transition-all duration-500 shadow-2xl shadow-emerald-950/20 uppercase tracking-widest italic"
                                            >
                                                <Maximize size={16} />
                                                <span>Access Protocol</span>
                                            </a>
                                        ) : (
                                            <button
                                                onClick={() => handleUnlock(note._id, note.price)}
                                                className="w-full bg-indigo-950 hover:bg-primary-600 text-white py-6 rounded-[2.2rem] font-black text-[10px] flex items-center justify-center space-x-3 transition-all duration-500 shadow-2xl shadow-indigo-950/20 uppercase tracking-widest italic"
                                            >
                                                <Lock size={16} />
                                                <span>Decrypt Asset</span>
                                            </button>
                                        )}
                                    </div>

                                    <div className="h-2 w-full bg-gray-50">
                                        <div className={`h-full bg-primary-500 transition-all duration-1000 ${unlocked ? 'w-full' : 'w-0 group-hover:w-1/3'}`}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Premium Modals */}
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
                                    {modalMode === 'upload' ? 'Commit' : 'Update'} <br /><span className="text-primary-500">Asset</span>
                                </h2>
                                <p className="text-primary-100/40 font-medium italic">Configure academic intellectual property for transfer.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-12 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic ml-2">Protocol Title</label>
                                    <input name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] py-6 px-10 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner" placeholder="e.g. Quantum Fluctuations" />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic ml-2">Valuation (₹)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" required className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] py-6 px-10 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner" placeholder="50" />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic ml-2">Filing Subject</label>
                                    <select name="subject" value={formData.subject} onChange={handleInputChange} required className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] py-6 px-10 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner">
                                        {subjects.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic ml-2">Source Link</label>
                                    <input type="url" name="pdfUrl" value={formData.pdfUrl} onChange={handleInputChange} required className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] py-6 px-10 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-primary-50 transition-all italic shadow-inner" placeholder="https://..." />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-indigo-950 hover:bg-primary-600 text-white py-6 rounded-[2.2rem] font-black shadow-2xl transition-all duration-500 hover:-translate-y-2 uppercase tracking-widest text-[10px] italic">
                                {modalMode === 'upload' ? 'Sync to Vault' : 'Execute Update'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotesVault;
