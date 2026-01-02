import { Plus, TrendingDown, Award, Calendar, Cigarette, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/Card';
import StatCard from '../../components/StatCard';
import useSmoking from './useSmoking';
import { formatDate, formatTime } from '../../utils/helpers';
import '../expenses/ExpenseTracker.css';

export default function SmokingTracker() {
    const { todayCount, addSmoke, getWeeklyData, streak, daysSinceQuit, getTodayEntries, removeSmoke } = useSmoking();

    const weeklyData = getWeeklyData();
    const weekTotal = weeklyData.reduce((sum, day) => sum + day.count, 0);
    const todayEntries = getTodayEntries();

    return (
        <div className="fade-in">
            <div className="page-header">
                <div>
                    <h2>Smoking Tracker</h2>
                    <p className="text-muted">Monitor your smoking habits and progress</p>
                </div>
                <button className="btn btn-primary" onClick={addSmoke}>
                    <Plus size={20} />
                    Log Cigarette
                </button>
            </div>

            <div className="grid grid-cols-4 mt-lg">
                <StatCard
                    title="Today"
                    value={todayCount}
                    subtitle="cigarettes"
                    icon={Plus}
                    color="warning"
                />
                <StatCard
                    title="This Week"
                    value={weekTotal}
                    subtitle="total cigarettes"
                    icon={TrendingDown}
                />
                <StatCard
                    title="Clean Streak"
                    value={streak}
                    subtitle="days without smoking"
                    icon={Award}
                    color="success"
                />
                <StatCard
                    title="Quit Progress"
                    value={daysSinceQuit || 0}
                    subtitle="days since quit date"
                    icon={Calendar}
                    color="primary"
                />
            </div>

            <div className="expense-content mt-xl">
                {/* Weekly Chart */}
                <Card className="expense-chart-card">
                    <h3 className="mb-lg">Weekly Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(date) => formatDate(date, 'EEE')}
                                stroke="var(--color-text-muted)"
                            />
                            <YAxis stroke="var(--color-text-muted)" />
                            <Tooltip
                                formatter={(value) => [`${value}`, 'Cigarettes']}
                                labelFormatter={(date) => formatDate(date, 'MMM dd')}
                                contentStyle={{
                                    background: 'var(--color-bg-secondary)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#f59e0b"
                                strokeWidth={3}
                                dot={{ fill: '#f59e0b', r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>

                    {todayCount === 0 && (
                        <div className="mt-lg text-center">
                            <div className="badge badge-success" style={{ fontSize: 'var(--font-size-base)', padding: 'var(--spacing-sm) var(--spacing-lg)' }}>
                                ✨ Great job! No cigarettes today
                            </div>
                        </div>
                    )}
                </Card>

                {/* Today's Cigarette Timeline */}
                <Card className="expense-list-card">
                    <h3 className="mb-lg">Today's Cigarettes</h3>
                    {todayEntries.length === 0 ? (
                        <div className="empty-state">
                            <p className="text-muted">No cigarettes logged today</p>
                            <p className="text-sm text-muted mt-sm">Keep up the good work! 🎉</p>
                        </div>
                    ) : (
                        <div className="expense-list">
                            {todayEntries.map((timestamp, index) => (
                                <div key={timestamp} className="expense-item">
                                    <div className="expense-item-left">
                                        <Cigarette size={20} color="#f59e0b" />
                                        <div>
                                            <div className="expense-description">Cigarette #{index + 1}</div>
                                            <div className="expense-meta text-sm text-muted">
                                                {formatTime(timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="expense-item-right">
                                        <button
                                            className="btn-icon"
                                            onClick={() => removeSmoke(timestamp)}
                                            title="Remove entry"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
