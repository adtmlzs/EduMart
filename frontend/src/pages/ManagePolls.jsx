const ManagePolls = () => {
    const { user } = useAuth();
    const [polls, setPolls] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        question: '',
        options: ['', '']
    });

    useEffect(() => {
        if (user && user.role === 'school') {
            fetchPolls();
        }
    }, [user]);

    const fetchPolls = async () => {
        try {
            const allPolls = await API.get(`/polls/all?schoolId=${user.id}`);
            setPolls(allPolls.data.polls || []);
        } catch (error) {
            console.error('Error fetching polls:', error);
        }
    };

    const handleAddOption = () => {
        setFormData({ ...formData, options: [...formData.options, ''] });
    };

    const handleRemoveOption = (index) => {
        if (formData.options.length > 2) {
            const newOptions = formData.options.filter((_, i) => i !== index);
            setFormData({ ...formData, options: newOptions });
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const validOptions = formData.options.filter(opt => opt.trim());
            if (validOptions.length < 2) return;

            await API.post('/polls/create', {
                question: formData.question,
                options: validOptions,
                schoolId: user.id
            });

            setFormData({ question: '', options: ['', ''] });
            setShowModal(false);
            fetchPolls();
        } catch (error) {
            console.error('Error creating poll:', error);
        }
    };

    const togglePollStatus = async (pollId, currentStatus) => {
        try {
            await API.put(`/polls/${pollId}/toggle`, {
                isActive: !currentStatus
            });
            fetchPolls();
        } catch (error) {
            console.error('Error toggling poll:', error);
        }
    };

    if (user?.role !== 'school') {
        return (
            <div className="min-h-screen bg-[#FAFAFB] flex items-center justify-center p-10">
                <div className="text-center max-w-md">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-indigo-950/5 border border-gray-100 mb-8">
                        <XCircle className="h-16 w-16 text-rose-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase italic mb-4">Access Denied.</h2>
                        <p className="text-gray-400 text-sm font-medium italic">Only school administrators are authorized for ballot governance and network signaling.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700">
            {/* Header Section - Refined for tab view */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                <div>
                    <div className="flex items-center space-x-3 mb-3">
                        <Sparkles size={14} className="text-primary-500 animate-pulse" />
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] italic leading-none">Democratic Protocol Management</span>
                    </div>
                    <p className="text-gray-400 text-sm font-medium italic max-w-md leading-relaxed">Orchestrate campus-wide collective intelligence through verified institutional signaling.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-950 h-20 px-10 rounded-[2rem] flex items-center space-x-4 shadow-2xl shadow-indigo-950/20 hover:bg-primary-600 hover:-translate-y-2 transition-all duration-500 group"
                >
                    <div className="bg-white/10 p-2.5 rounded-xl group-hover:rotate-90 transition-transform">
                        <Plus size={18} className="text-white" />
                    </div>
                    <span className="text-white font-black text-[11px] uppercase tracking-widest italic">Initiate Ballot</span>
                </button>
            </div>

            {/* Polls Feed */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {polls.length === 0 ? (
                    <div className="xl:col-span-2 bg-white rounded-[3.5rem] shadow-2xl shadow-indigo-950/5 p-20 text-center border border-gray-100 flex flex-col items-center">
                        <div className="bg-gray-50 h-24 w-24 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white shadow-inner group">
                            <BarChart3 size={40} className="text-gray-200 group-hover:scale-110 transition-transform" />
                        </div>
                        <h3 className="text-3xl font-black text-indigo-950 uppercase italic mb-3 tracking-tighter">Zero Signals Detected</h3>
                        <p className="text-gray-400 text-xs font-medium italic mb-10 max-w-sm">The network is currently silent. Deploy your first ballot to begin collective synchronization.</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-primary-50 text-primary-600 px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all duration-500 italic"
                        >
                            Deploy Initial Ballot
                        </button>
                    </div>
                ) : (
                    polls.map((poll) => (
                        <div key={poll._id} className={`bg-white rounded-[3.5rem] shadow-2xl shadow-indigo-950/5 p-8 border-2 transition-all duration-700 hover:-translate-y-2 flex flex-col ${poll.isActive ? 'border-primary-100' : 'border-transparent'}`}>
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex-1 pr-6">
                                    <div className="flex flex-wrap items-center gap-4 mb-4">
                                        <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                            <Clock size={10} className="text-gray-300" />
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic">{new Date(poll.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <span className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border-2 text-[8px] font-black uppercase tracking-widest italic ${poll.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 'bg-gray-50 text-gray-400 border-gray-100 opacity-60'}`}>
                                            <div className={`h-1.5 w-1.5 rounded-full ${poll.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                            <span>{poll.isActive ? 'Signal Active' : 'Offline'}</span>
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black text-indigo-950 tracking-tighter uppercase italic leading-tight mb-2">{poll.question}</h3>
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] italic ml-1">{poll.votedUsers?.length || 0} SECURE VOTES</p>
                                </div>
                                <button
                                    onClick={() => togglePollStatus(poll._id, poll.isActive)}
                                    className={`h-16 w-16 flex items-center justify-center rounded-2xl shadow-xl transition-all duration-500 group active:scale-95 ${poll.isActive
                                        ? 'bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white'
                                        : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-600 hover:text-white'
                                        }`}
                                >
                                    <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                                </button>
                            </div>

                            <div className="space-y-3 mt-auto">
                                {poll.options.map((option, idx) => {
                                    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                                    const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

                                    return (
                                        <div key={idx} className="bg-gray-50/50 rounded-[1.8rem] p-5 border border-gray-100 group/opt hover:bg-white hover:shadow-xl transition-all duration-500">
                                            <div className="flex items-end justify-between mb-3">
                                                <div>
                                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-1 italic ml-0.5">Vector {idx + 1}</span>
                                                    <span className="font-black text-indigo-950 uppercase italic text-xs">{option.text}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-lg font-black text-indigo-950 tracking-tighter italic">{percentage}%</span>
                                                    <p className="text-[8px] font-black text-primary-500 uppercase tracking-widest italic">{option.votes} SGNLS</p>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner p-0.5">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg ${poll.isActive ? 'bg-primary-500' : 'bg-gray-300'}`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-indigo-950/80 backdrop-blur-3xl flex items-center justify-center z-[100] p-6 sm:p-10 animate-in fade-in duration-500">
                    <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-12 duration-700 scale-95 md:scale-100">
                        {/* Modal Header */}
                        <div className="bg-indigo-950 p-12 text-white flex items-center justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-center space-x-3 mb-3">
                                    <Sparkles size={16} className="text-primary-400" />
                                    <span className="text-[10px] font-black text-primary-400 uppercase tracking-[0.3em] italic">Network Broadcast</span>
                                </div>
                                <h2 className="text-5xl font-black tracking-tighter italic uppercase leading-none">Initiate <br />Ballot.</h2>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-white/10 h-16 w-16 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all group active:scale-95"
                            >
                                <X size={24} className="group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-12 space-y-8 overflow-y-auto custom-scrollbar no-scrollbar">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic flex items-center">
                                    Primary Question <span className="text-primary-500 ml-1 opacity-50">*</span>
                                </label>
                                <textarea
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-transparent rounded-[2.5rem] p-8 text-indigo-950 font-black italic focus:bg-white focus:border-primary-100 focus:ring-8 focus:ring-primary-50 shadow-inner transition-all outline-none resize-none min-h-[140px]"
                                    placeholder="e.g., Select appropriate cycle for standard project submissions?"
                                    required
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic flex items-center">
                                    Response Vectors <span className="text-primary-500 ml-1 opacity-50">*</span>
                                </label>
                                <div className="space-y-4">
                                    {formData.options.map((option, index) => (
                                        <div key={index} className="flex items-center space-x-4 animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                                            <div className="flex-1 relative group">
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                                    className="w-full bg-gray-50 border-2 border-transparent rounded-[2.2rem] py-6 px-10 text-indigo-950 font-black italic focus:bg-white focus:border-indigo-100 focus:ring-8 focus:ring-indigo-50 shadow-inner transition-all outline-none"
                                                    placeholder={`Vector Ident ${index + 1}`}
                                                    required
                                                />
                                            </div>
                                            {formData.options.length > 2 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveOption(index)}
                                                    className="h-16 w-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-xl shadow-rose-950/5 active:scale-95"
                                                >
                                                    <X size={20} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddOption}
                                    className="flex items-center space-x-3 text-primary-500 hover:text-indigo-950 font-black text-[10px] uppercase tracking-widest px-6 py-4 rounded-2xl bg-primary-50/50 hover:bg-primary-50 transition-all italic w-fit ml-auto shadow-sm"
                                >
                                    <Plus size={14} className="animate-bounce" />
                                    <span>Append Response Vector</span>
                                </button>
                            </div>

                            <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 flex items-start space-x-5">
                                <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-950/5 flex-shrink-0">
                                    <Zap size={18} className="text-primary-500" />
                                </div>
                                <p className="text-[11px] text-indigo-900 font-bold italic leading-relaxed">
                                    Protocol Notice: This ballot will be broadcasted to all authorized network nodes. Engaging peers will earn 1 reputation unit for verified participation.
                                </p>
                            </div>

                            <div className="flex items-center gap-6 pt-6">
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-950 text-white h-24 rounded-[2.5rem] font-black uppercase tracking-widest italic shadow-2xl shadow-indigo-950/20 hover:bg-primary-600 hover:-translate-y-2 transition-all duration-500 active:scale-95"
                                >
                                    Broadcast Ballot
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-10 h-24 bg-white border-2 border-gray-100 text-indigo-950 rounded-[2.5rem] font-black uppercase tracking-widest italic hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95"
                                >
                                    Abort
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePolls;
