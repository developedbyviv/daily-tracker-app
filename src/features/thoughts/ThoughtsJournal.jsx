import { useState, useMemo } from 'react';
import { Plus, Search, BookOpen, Calendar, Trash2 } from 'lucide-react';
import Card from '../../components/Card';
import StatCard from '../../components/StatCard';
import ThoughtForm from './ThoughtForm';
import useThoughts, { MOODS } from './useThoughts';
import { formatDate, formatTime } from '../../utils/helpers';
import './ThoughtForm.css';
import './ThoughtsJournal.css';

export default function ThoughtsJournal() {
    const { thoughts, addThought, deleteThought, searchThoughts, filterByMood } = useThoughts();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMood, setSelectedMood] = useState('');

    const filteredThoughts = useMemo(() => {
        let filtered = thoughts;

        if (searchQuery) {
            filtered = searchThoughts(searchQuery);
        }

        if (selectedMood) {
            filtered = filtered.filter(t => t.mood === selectedMood);
        }

        return filtered;
    }, [thoughts, searchQuery, selectedMood, searchThoughts]);

    const moodCounts = useMemo(() => {
        return thoughts.reduce((counts, thought) => {
            counts[thought.mood] = (counts[thought.mood] || 0) + 1;
            return counts;
        }, {});
    }, [thoughts]);

    const mostCommonMood = useMemo(() => {
        if (thoughts.length === 0) return null;
        return Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    }, [moodCounts, thoughts.length]);

    return (
        <div className="fade-in">
            <div className="page-header">
                <div>
                    <h2>Thoughts Journal</h2>
                    <p className="text-muted">Capture your thoughts, feelings, and reflections</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
                    <Plus size={20} />
                    New Entry
                </button>
            </div>

            <div className="grid grid-cols-3 mt-lg">
                <StatCard
                    title="Total Entries"
                    value={thoughts.length}
                    subtitle="thoughts recorded"
                    icon={BookOpen}
                    color="primary"
                />
                <StatCard
                    title="This Month"
                    value={thoughts.filter(t => {
                        const thoughtDate = new Date(t.createdAt);
                        const now = new Date();
                        return thoughtDate.getMonth() === now.getMonth() &&
                            thoughtDate.getFullYear() === now.getFullYear();
                    }).length}
                    subtitle="entries"
                    icon={Calendar}
                />
                <StatCard
                    title="Most Common Mood"
                    value={mostCommonMood ? MOODS.find(m => m.value === mostCommonMood)?.emoji : '😊'}
                    subtitle={mostCommonMood ? MOODS.find(m => m.value === mostCommonMood)?.label : 'N/A'}
                    icon={BookOpen}
                    color="secondary"
                />
            </div>

            {/* Search and Filter */}
            <div className="thoughts-controls mt-xl">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search your thoughts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="mood-filter">
                    <button
                        className={`btn btn-sm ${!selectedMood ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setSelectedMood('')}
                    >
                        All
                    </button>
                    {MOODS.map(mood => (
                        <button
                            key={mood.value}
                            className={`btn btn-sm ${selectedMood === mood.value ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setSelectedMood(mood.value)}
                            title={mood.label}
                        >
                            {mood.emoji}
                        </button>
                    ))}
                </div>
            </div>

            {/* Thoughts List */}
            <div className="thoughts-list mt-lg">
                {filteredThoughts.length === 0 ? (
                    <Card>
                        <div className="empty-state">
                            <BookOpen size={48} color="var(--color-text-muted)" />
                            <p className="text-muted mt-md">
                                {searchQuery || selectedMood ? 'No thoughts match your filters' : 'No thoughts recorded yet'}
                            </p>
                            <button className="btn btn-primary mt-md" onClick={() => setIsFormOpen(true)}>
                                Write your first thought
                            </button>
                        </div>
                    </Card>
                ) : (
                    filteredThoughts.map(thought => {
                        const mood = MOODS.find(m => m.value === thought.mood);
                        return (
                            <Card key={thought.id} className="thought-card">
                                <div className="thought-header">
                                    <div className="thought-mood-badge">
                                        <span className="thought-mood-emoji">{mood?.emoji}</span>
                                        <span className="thought-mood-label text-sm">{mood?.label}</span>
                                    </div>
                                    <div className="thought-actions">
                                        <span className="thought-date text-sm text-muted">
                                            {formatDate(thought.createdAt)} at {formatTime(thought.createdAt)}
                                        </span>
                                        <button
                                            className="btn-icon"
                                            onClick={() => deleteThought(thought.id)}
                                            title="Delete thought"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {thought.title && (
                                    <h4 className="thought-title mt-md">{thought.title}</h4>
                                )}

                                <p className="thought-content mt-sm">{thought.content}</p>
                            </Card>
                        );
                    })
                )}
            </div>

            <ThoughtForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={addThought}
            />
        </div>
    );
}
