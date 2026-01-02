import { useState } from 'react';
import { Dumbbell, Plus, Target, TrendingUp, Trash2, Award, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '../../components/Card';
import StatCard from '../../components/StatCard';
import useGym from './useGym';
import { formatDate } from '../../utils/helpers';
import './GymTracker.css';

const QUICK_DURATIONS = [30, 45, 60, 90]; // minutes

export default function GymTracker() {
    const {
        sessions,
        todaySessions,
        todayDuration,
        totalSessions,
        averageDuration,
        currentStreak,
        weeklySessions,
        addGymSession,
        deleteGymSession,
        getWeeklyData,
    } = useGym();

    const [customDuration, setCustomDuration] = useState('');
    const [notes, setNotes] = useState('');
    const [showForm, setShowForm] = useState(false);

    const weeklyData = getWeeklyData();

    const handleQuickAdd = (duration) => {
        addGymSession(duration);
    };

    const handleCustomAdd = () => {
        if (customDuration && Number(customDuration) > 0) {
            addGymSession(Number(customDuration), notes);
            setCustomDuration('');
            setNotes('');
            setShowForm(false);
        }
    };

    return (
        <div className="fade-in">
            <div className="page-header">
                <div>
                    <h2>Gym Tracker</h2>
                    <p className="text-muted">Track your fitness journey and build consistency</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 mt-lg">
                <StatCard
                    title="Current Streak"
                    value={`${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`}
                    subtitle={currentStreak > 0 ? "Keep it up! 🔥" : "Start today!"}
                    icon={Award}
                    color="warning"
                />
                <StatCard
                    title="Total Sessions"
                    value={totalSessions}
                    subtitle="all time"
                    icon={Dumbbell}
                    color="primary"
                />
                <StatCard
                    title="Avg Duration"
                    value={`${averageDuration.toFixed(0)} min`}
                    subtitle="per session"
                    icon={Target}
                    color="success"
                />
            </div>

            <div className="grid grid-cols-2 mt-lg">
                <StatCard
                    title="Today's Workouts"
                    value={todaySessions.length}
                    subtitle={`${todayDuration} minutes total`}
                    icon={Calendar}
                    color="secondary"
                />
                <StatCard
                    title="This Week"
                    value={weeklySessions}
                    subtitle="workout sessions"
                    icon={TrendingUp}
                />
            </div>

            <div className="gym-content mt-xl">
                {/* Quick Add and Form */}
                <Card className="gym-add-card">
                    <h3 className="mb-lg">Log Workout</h3>

                    <div className="gym-quick-add">
                        <h4 className="mb-md text-sm text-muted">Quick Add</h4>
                        <div className="gym-quick-buttons">
                            {QUICK_DURATIONS.map(duration => (
                                <button
                                    key={duration}
                                    className="btn btn-outline gym-quick-btn"
                                    onClick={() => handleQuickAdd(duration)}
                                >
                                    <Plus size={16} />
                                    {duration} min
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="gym-custom-add mt-lg">
                        {!showForm ? (
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowForm(true)}
                            >
                                <Plus size={18} />
                                Custom Duration
                            </button>
                        ) : (
                            <div className="gym-custom-form">
                                <div className="form-group">
                                    <label className="text-sm text-muted">Duration (minutes)</label>
                                    <input
                                        type="number"
                                        value={customDuration}
                                        onChange={(e) => setCustomDuration(e.target.value)}
                                        className="input"
                                        placeholder="Enter minutes..."
                                        min="1"
                                    />
                                </div>
                                <div className="form-group mt-md">
                                    <label className="text-sm text-muted">Notes (optional)</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="input"
                                        placeholder="e.g., Chest and triceps, Cardio, etc."
                                        rows="2"
                                    />
                                </div>
                                <div className="gym-form-actions mt-md">
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleCustomAdd}
                                        disabled={!customDuration || Number(customDuration) <= 0}
                                    >
                                        Add Session
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowForm(false);
                                            setCustomDuration('');
                                            setNotes('');
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Achievement Badges */}
                    {currentStreak >= 7 && (
                        <div className="gym-achievement mt-lg">
                            <div className="badge badge-success">
                                🏆 7-Day Streak Unlocked!
                            </div>
                        </div>
                    )}
                    {totalSessions >= 100 && (
                        <div className="gym-achievement mt-md">
                            <div className="badge badge-primary">
                                💯 Century Club - 100+ Sessions!
                            </div>
                        </div>
                    )}
                </Card>

                {/* Weekly Chart */}
                <Card className="gym-chart-card">
                    <h3 className="mb-lg">Weekly Overview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(date) => formatDate(date, 'EEE')}
                                stroke="var(--color-text-muted)"
                            />
                            <YAxis stroke="var(--color-text-muted)" />
                            <Tooltip
                                labelFormatter={(date) => formatDate(date, 'MMM dd')}
                                contentStyle={{
                                    background: 'var(--color-bg-secondary)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                }}
                            />
                            <Legend />
                            <Bar dataKey="duration" fill="url(#gymGradient)" radius={[8, 8, 0, 0]} name="Minutes" />
                            <defs>
                                <linearGradient id="gymGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#ea580c" stopOpacity={0.3} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Recent Sessions */}
            <Card className="gym-history-card mt-lg">
                <h3 className="mb-lg">Recent Sessions</h3>
                {sessions.length === 0 ? (
                    <div className="empty-state">
                        <Dumbbell size={48} className="text-muted" />
                        <p className="text-muted mt-md">No gym sessions yet. Start your fitness journey!</p>
                    </div>
                ) : (
                    <div className="gym-sessions-list">
                        {sessions.slice(0, 10).map((session) => (
                            <div key={session.id} className="gym-session-item">
                                <div className="gym-session-icon">
                                    <Dumbbell size={20} />
                                </div>
                                <div className="gym-session-details">
                                    <div className="gym-session-date">
                                        {formatDate(session.date, 'MMM dd, yyyy')}
                                    </div>
                                    <div className="gym-session-duration">
                                        {session.duration} minutes
                                    </div>
                                    {session.notes && (
                                        <div className="gym-session-notes text-sm text-muted">
                                            {session.notes}
                                        </div>
                                    )}
                                </div>
                                <button
                                    className="btn btn-icon gym-session-delete"
                                    onClick={() => deleteGymSession(session.id)}
                                    title="Delete session"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
