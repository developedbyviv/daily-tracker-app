import { useState } from 'react';
import { Plus, Moon, Clock, TrendingUp, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/Card';
import StatCard from '../../components/StatCard';
import SleepForm from './SleepForm';
import useSleep from './useSleep';
import { formatDate, formatTime } from '../../utils/helpers';
import '../expenses/ExpenseForm.css';

export default function SleepTracker() {
    const { sleepEntries, addSleepEntry, deleteSleepEntry, getAverageSleep, getWeeklyData } = useSleep();
    const [isFormOpen, setIsFormOpen] = useState(false);

    const averageSleep = getAverageSleep();
    const weeklyData = getWeeklyData();
    const lastNight = sleepEntries[0];

    return (
        <div className="fade-in">
            <div className="page-header">
                <div>
                    <h2>Sleep Tracker</h2>
                    <p className="text-muted">Track your sleep patterns and improve rest quality</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
                    <Plus size={20} />
                    Log Sleep
                </button>
            </div>

            <div className="grid grid-cols-3 mt-lg">
                <StatCard
                    title="Last Night"
                    value={lastNight ? `${lastNight.duration.toFixed(1)}h` : 'N/A'}
                    subtitle={lastNight ? formatDate(lastNight.date) : 'No data'}
                    icon={Moon}
                    color="primary"
                />
                <StatCard
                    title="Average Sleep"
                    value={`${averageSleep.toFixed(1)}h`}
                    subtitle="over all entries"
                    icon={TrendingUp}
                    color="secondary"
                />
                <StatCard
                    title="Entries"
                    value={sleepEntries.length}
                    subtitle="total logged"
                    icon={Clock}
                />
            </div>

            <div className="expense-content mt-xl">
                <Card className="expense-chart-card">
                    <h3 className="mb-lg">Sleep Duration (Last 7 Days)</h3>
                    {weeklyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(date) => formatDate(date, 'MMM dd')}
                                    stroke="var(--color-text-muted)"
                                />
                                <YAxis stroke="var(--color-text-muted)" />
                                <Tooltip
                                    formatter={(value) => [`${value.toFixed(1)}h`, 'Sleep Duration']}
                                    contentStyle={{
                                        background: 'var(--color-bg-secondary)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                    }}
                                />
                                <Bar dataKey="duration" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="empty-state">
                            <p className="text-muted">No sleep data yet</p>
                        </div>
                    )}
                </Card>

                <Card className="expense-list-card">
                    <h3 className="mb-lg">Sleep History</h3>
                    {sleepEntries.length === 0 ? (
                        <div className="empty-state">
                            <p className="text-muted">No sleep entries recorded yet</p>
                            <button className="btn btn-primary mt-md" onClick={() => setIsFormOpen(true)}>
                                Add your first entry
                            </button>
                        </div>
                    ) : (
                        <div className="expense-list">
                            {sleepEntries.map(entry => (
                                <div key={entry.id} className="expense-item">
                                    <div className="expense-item-left">
                                        <Moon size={20} color="#8b5cf6" />
                                        <div>
                                            <div className="expense-description">
                                                {formatDate(entry.date)} • {entry.duration.toFixed(1)}h
                                            </div>
                                            <div className="expense-meta text-sm text-muted">
                                                {formatTime(entry.sleepTime)} → {formatTime(entry.wakeTime)}
                                                {entry.notes && ` • ${entry.notes}`}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="expense-item-right">
                                        <div className="badge">
                                            {'⭐'.repeat(entry.quality)}
                                        </div>
                                        <button
                                            className="btn-icon"
                                            onClick={() => deleteSleepEntry(entry.id)}
                                            title="Delete entry"
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

            <SleepForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={addSleepEntry}
            />
        </div>
    );
}
