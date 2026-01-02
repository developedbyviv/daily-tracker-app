import { useState } from 'react';
import { Droplet, Plus, Target, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/Card';
import StatCard from '../../components/StatCard';
import useWater from './useWater';
import { formatDate } from '../../utils/helpers';
import './WaterTracker.css';

const QUICK_AMOUNTS = [250, 500, 750, 1000];

export default function WaterTracker() {
    const { todayIntake, dailyGoal, progress, addWater, updateDailyGoal, getWeeklyData } = useWater();
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [newGoal, setNewGoal] = useState(dailyGoal);

    const weeklyData = getWeeklyData();

    const handleAddWater = (amount) => {
        addWater(amount);
    };

    const handleUpdateGoal = () => {
        updateDailyGoal(Number(newGoal));
        setIsEditingGoal(false);
    };

    return (
        <div className="fade-in">
            <div className="page-header">
                <div>
                    <h2>Water Intake Tracker</h2>
                    <p className="text-muted">Stay hydrated and reach your daily goal</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 mt-lg">
                <StatCard
                    title="Today's Intake"
                    value={`${todayIntake} ml`}
                    subtitle={`${progress.toFixed(0)}% of goal`}
                    icon={Droplet}
                    color="secondary"
                />
                <StatCard
                    title="Daily Goal"
                    value={`${dailyGoal} ml`}
                    subtitle="Click to edit"
                    icon={Target}
                />
                <StatCard
                    title="Remaining"
                    value={`${Math.max(0, dailyGoal - todayIntake)} ml`}
                    subtitle="to reach goal"
                    icon={TrendingUp}
                    color="success"
                />
            </div>

            <div className="water-content mt-xl">
                {/* Progress Circle */}
                <Card className="water-progress-card">
                    <h3 className="mb-lg">Today's Progress</h3>

                    <div className="water-progress-circle">
                        <svg width="200" height="200">
                            <circle
                                cx="100"
                                cy="100"
                                r="80"
                                fill="none"
                                stroke="var(--color-bg-tertiary)"
                                strokeWidth="12"
                            />
                            <circle
                                cx="100"
                                cy="100"
                                r="80"
                                fill="none"
                                stroke="url(#waterGradient)"
                                strokeWidth="12"
                                strokeDasharray={`${2 * Math.PI * 80}`}
                                strokeDashoffset={`${2 * Math.PI * 80 * (1 - progress / 100)}`}
                                transform="rotate(-90 100 100)"
                                strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#06b6d4" />
                                    <stop offset="100%" stopColor="#3b82f6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="water-progress-text">
                            <div className="water-progress-percentage">{progress.toFixed(0)}%</div>
                            <div className="water-progress-label text-muted text-sm">Complete</div>
                        </div>
                    </div>

                    <div className="water-quick-add mt-xl">
                        <h4 className="mb-md text-sm text-muted">Quick Add</h4>
                        <div className="water-quick-buttons">
                            {QUICK_AMOUNTS.map(amount => (
                                <button
                                    key={amount}
                                    className="btn btn-outline water-quick-btn"
                                    onClick={() => handleAddWater(amount)}
                                >
                                    <Plus size={16} />
                                    {amount} ml
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Goal Editor */}
                    <div className="water-goal-editor mt-lg">
                        {isEditingGoal ? (
                            <div className="water-goal-form">
                                <input
                                    type="number"
                                    value={newGoal}
                                    onChange={(e) => setNewGoal(e.target.value)}
                                    className="input"
                                    min="0"
                                    step="100"
                                />
                                <button className="btn btn-primary btn-sm" onClick={handleUpdateGoal}>
                                    Save
                                </button>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => {
                                        setIsEditingGoal(false);
                                        setNewGoal(dailyGoal);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => {
                                    setIsEditingGoal(true);
                                    setNewGoal(dailyGoal);
                                }}
                            >
                                <Target size={16} />
                                Change Goal
                            </button>
                        )}
                    </div>
                </Card>

                {/* Weekly Chart */}
                <Card className="water-chart-card">
                    <h3 className="mb-lg">Weekly History</h3>
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
                                formatter={(value) => [`${value} ml`, 'Intake']}
                                labelFormatter={(date) => formatDate(date, 'MMM dd')}
                                contentStyle={{
                                    background: 'var(--color-bg-secondary)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                }}
                            />
                            <Bar dataKey="intake" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>

                    {progress >= 100 && (
                        <div className="water-achievement mt-lg">
                            <div className="badge badge-success">
                                🎉 Goal Achieved Today!
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
