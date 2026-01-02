import { Wallet, Droplet, Cigarette, Moon, BookOpen, TrendingUp, Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from './Card';
import StatCard from './StatCard';
import useExpenses from '../features/expenses/useExpenses';
import useWater from '../features/water/useWater';
import useSmoking from '../features/smoking/useSmoking';
import useSleep from '../features/sleep/useSleep';
import useThoughts from '../features/thoughts/useThoughts';
import useGym from '../features/gym/useGym';
import { formatCurrency } from '../utils/helpers';
import './StatCard.css';
import './Dashboard.css';

export default function Dashboard() {
    const { getTotalExpenses } = useExpenses();
    const { todayIntake, dailyGoal, progress } = useWater();
    const { todayCount } = useSmoking();
    const { getAverageSleep, sleepEntries } = useSleep();
    const { thoughts } = useThoughts();
    const { totalSessions, currentStreak } = useGym();

    const totalExpenses = getTotalExpenses();
    const averageSleep = getAverageSleep();

    return (
        <div className="fade-in">
            <div className="dashboard-header">
                <h2>Dashboard</h2>
                <p className="text-muted">Welcome back! Here's your daily overview</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 mt-xl">
                <StatCard
                    title="Total Expenses"
                    value={formatCurrency(totalExpenses)}
                    subtitle="all time"
                    icon={Wallet}
                    color="primary"
                />
                <StatCard
                    title="Water Progress"
                    value={`${progress.toFixed(0)}%`}
                    subtitle={`${todayIntake}/${dailyGoal} ml today`}
                    icon={Droplet}
                    color="secondary"
                />
                <StatCard
                    title="Cigarettes Today"
                    value={todayCount}
                    subtitle={todayCount === 0 ? "Great job!" : "today"}
                    icon={Cigarette}
                    color="warning"
                />
            </div>

            <div className="grid grid-cols-3 mt-lg">
                <StatCard
                    title="Average Sleep"
                    value={`${averageSleep.toFixed(1)}h`}
                    subtitle={`from ${sleepEntries.length} entries`}
                    icon={Moon}
                />
                <StatCard
                    title="Gym Sessions"
                    value={totalSessions}
                    subtitle={currentStreak > 0 ? `${currentStreak} day streak 🔥` : "all time"}
                    icon={Dumbbell}
                    color="warning"
                />
                <StatCard
                    title="Journal Entries"
                    value={thoughts.length}
                    subtitle="total thoughts"
                    icon={BookOpen}
                    color="success"
                />
            </div>

            {/* Quick Actions */}
            <Card className="dashboard-actions mt-xl">
                <h3 className="mb-lg">Quick Actions</h3>
                <div className="action-grid">
                    <Link to="/expenses" className="action-card">
                        <Wallet size={24} />
                        <div>
                            <div className="action-title">Track Expense</div>
                            <div className="action-subtitle text-sm text-muted">Log your spending</div>
                        </div>
                    </Link>

                    <Link to="/water" className="action-card">
                        <Droplet size={24} />
                        <div>
                            <div className="action-title">Add Water</div>
                            <div className="action-subtitle text-sm text-muted">Stay hydrated</div>
                        </div>
                    </Link>

                    <Link to="/smoking" className="action-card">
                        <Cigarette size={24} />
                        <div>
                            <div className="action-title">Log Cigarette</div>
                            <div className="action-subtitle text-sm text-muted">Track smoking</div>
                        </div>
                    </Link>

                    <Link to="/sleep" className="action-card">
                        <Moon size={24} />
                        <div>
                            <div className="action-title">Log Sleep</div>
                            <div className="action-subtitle text-sm text-muted">Record rest</div>
                        </div>
                    </Link>

                    <Link to="/thoughts" className="action-card">
                        <BookOpen size={24} />
                        <div>
                            <div className="action-title">Write Thought</div>
                            <div className="action-subtitle text-sm text-muted">Journal entry</div>
                        </div>
                    </Link>

                    <Link to="/gym" className="action-card">
                        <Dumbbell size={24} />
                        <div>
                            <div className="action-title">Log Workout</div>
                            <div className="action-subtitle text-sm text-muted">Track gym session</div>
                        </div>
                    </Link>

                    <div className="action-card action-card-stats">
                        <TrendingUp size={24} />
                        <div>
                            <div className="action-title">View Analytics</div>
                            <div className="action-subtitle text-sm text-muted">Coming soon</div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Motivational Quote */}
            <Card className="dashboard-quote mt-lg">
                <div className="quote-content">
                    <div className="quote-icon">💡</div>
                    <div>
                        <p className="quote-text">
                            "The secret of getting ahead is getting started."
                        </p>
                        <p className="quote-author text-sm text-muted">— Mark Twain</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
