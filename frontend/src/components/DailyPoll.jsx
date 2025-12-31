import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { BarChart3, CheckCircle } from 'lucide-react';

const DailyPoll = () => {
    const { user, updateUserPoints } = useAuth();
    const [poll, setPoll] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPoll();
    }, []);

    const fetchPoll = async () => {
        try {
            const schoolId = user.role === 'school' ? user.id : user.schoolId;
            const response = await API.get(`/polls?schoolId=${schoolId}`);

            if (response.data.poll) {
                setPoll(response.data.poll);
                setHasVoted(response.data.poll.votedUsers?.includes(user.id));
            }
        } catch (error) {
            console.error('Error fetching poll:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (optionIndex) => {
        try {
            const response = await API.post(`/polls/vote/${poll._id}`, {
                userId: user.id,
                optionIndex
            });

            setPoll(response.data.poll);
            setHasVoted(true);
            updateUserPoints((user.points || 0) + 1);

            alert('Vote recorded! You earned 1 point! 🎉');
        } catch (error) {
            console.error('Error voting:', error);
            alert(error.response?.data?.message || 'Failed to vote');
        }
    };

    const getTotalVotes = () => {
        if (!poll) return 0;
        return poll.options.reduce((sum, opt) => sum + opt.votes, 0);
    };

    const getPercentage = (votes) => {
        const total = getTotalVotes();
        return total === 0 ? 0 : Math.round((votes / total) * 100);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!poll) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No active poll at the moment</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-primary-100">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-4">
                <div className="flex items-center space-x-2 text-white">
                    <BarChart3 className="h-5 w-5" />
                    <h3 className="font-bold">Daily Poll</h3>
                </div>
            </div>

            <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">{poll.question}</h4>

                {!hasVoted ? (
                    <div className="space-y-2">
                        {poll.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleVote(index)}
                                className="w-full text-left px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition font-medium text-gray-700"
                            >
                                {option.text}
                            </button>
                        ))}
                        <p className="text-xs text-gray-500 mt-4 flex items-center">
                            💡 Earn 1 point for voting!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {poll.options.map((option, index) => {
                            const percentage = getPercentage(option.votes);
                            return (
                                <div key={index} className="relative">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">{option.text}</span>
                                        <span className="text-sm font-bold text-primary-600">{percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${index === 0 ? 'bg-blue-500' :
                                                    index === 1 ? 'bg-green-500' :
                                                        index === 2 ? 'bg-amber-500' :
                                                            'bg-purple-500'
                                                }`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{option.votes} vote{option.votes !== 1 ? 's' : ''}</p>
                                </div>
                            );
                        })}

                        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center space-x-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">You've voted! Thanks for participating.</span>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                            Total votes: {getTotalVotes()}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyPoll;
