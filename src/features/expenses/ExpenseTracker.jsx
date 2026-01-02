import { useState, useMemo } from 'react';
import { Plus, TrendingUp, Calendar, Trash2, Edit2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Card from '../../components/Card';
import StatCard from '../../components/StatCard';
import ExpenseForm from './ExpenseForm';
import useExpenses, { EXPENSE_CATEGORIES } from './useExpenses';
import { formatCurrency, formatDate, filterByDateRange } from '../../utils/helpers';
import './ExpenseForm.css';
import './ExpenseTracker.css';

export default function ExpenseTracker() {
    const { expenses, addExpense, deleteExpense, getTotalExpenses, getCategoryTotals } = useExpenses();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [dateFilter, setDateFilter] = useState('month');

    // Filter expenses by date range
    const filteredExpenses = useMemo(() => {
        return filterByDateRange(expenses, dateFilter);
    }, [expenses, dateFilter]);

    // Calculate totals
    const totalExpense = getTotalExpenses((expense) =>
        filteredExpenses.some(fe => fe.id === expense.id)
    );

    // Get category data for chart
    const categoryData = useMemo(() => {
        const totals = getCategoryTotals();
        return EXPENSE_CATEGORIES.map(cat => ({
            name: cat.label,
            value: totals[cat.value] || 0,
            color: cat.color,
        })).filter(item => item.value > 0);
    }, [expenses, getCategoryTotals]);

    return (
        <div className="fade-in">
            <div className="page-header">
                <div>
                    <h2>Expense Tracker</h2>
                    <p className="text-muted">Monitor your spending and stay on budget</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
                    <Plus size={20} />
                    Add Expense
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 mt-lg">
                <StatCard
                    title="Total Expenses"
                    value={formatCurrency(totalExpense)}
                    subtitle={`in the last ${dateFilter}`}
                    icon={TrendingUp}
                    color="primary"
                />
                <StatCard
                    title="Transactions"
                    value={filteredExpenses.length}
                    subtitle={`${dateFilter} transactions`}
                    icon={Calendar}
                />
                <StatCard
                    title="Average"
                    value={formatCurrency(filteredExpenses.length > 0 ? totalExpense / filteredExpenses.length : 0)}
                    subtitle="per transaction"
                    icon={TrendingUp}
                    color="secondary"
                />
            </div>

            {/* Filter */}
            <div className="filter-bar mt-xl">
                <div className="filter-buttons">
                    {['today', 'week', 'month'].map(filter => (
                        <button
                            key={filter}
                            className={`btn btn-sm ${dateFilter === filter ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setDateFilter(filter)}
                        >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="expense-content mt-xl">
                {/* Chart */}
                {categoryData.length > 0 && (
                    <Card className="expense-chart-card">
                        <h3 className="mb-lg">Spending by Category</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                )}

                {/* Expense List */}
                <Card className="expense-list-card">
                    <h3 className="mb-lg">Recent Transactions</h3>
                    {filteredExpenses.length === 0 ? (
                        <div className="empty-state">
                            <p className="text-muted">No expenses recorded yet</p>
                            <button className="btn btn-primary mt-md" onClick={() => setIsFormOpen(true)}>
                                Add your first expense
                            </button>
                        </div>
                    ) : (
                        <div className="expense-list">
                            {filteredExpenses.map(expense => {
                                const category = EXPENSE_CATEGORIES.find(cat => cat.value === expense.category);
                                return (
                                    <div key={expense.id} className="expense-item">
                                        <div className="expense-item-left">
                                            <div
                                                className="expense-category-dot"
                                                style={{ backgroundColor: category?.color }}
                                            />
                                            <div>
                                                <div className="expense-description">{expense.description}</div>
                                                <div className="expense-meta text-sm text-muted">
                                                    {category?.label} • {formatDate(expense.createdAt)} at {formatTime(expense.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="expense-item-right">
                                            <div className="expense-amount">{formatCurrency(expense.amount)}</div>
                                            <button
                                                className="btn-icon"
                                                onClick={() => deleteExpense(expense.id)}
                                                title="Delete expense"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>
            </div>

            <ExpenseForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={addExpense}
            />
        </div>
    );
}
