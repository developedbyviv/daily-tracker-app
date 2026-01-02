import { useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { generateId } from '../../utils/helpers';

export const EXPENSE_CATEGORIES = [
    { value: 'food', label: 'Food & Dining', color: '#f59e0b' },
    { value: 'transport', label: 'Transport', color: '#3b82f6' },
    { value: 'shopping', label: 'Shopping', color: '#ec4899' },
    { value: 'health', label: 'Health & Fitness', color: '#10b981' },
    { value: 'entertainment', label: 'Entertainment', color: '#8b5cf6' },
    { value: 'bills', label: 'Bills & Utilities', color: '#ef4444' },
    { value: 'other', label: 'Other', color: '#6b7280' },
];

export default function useExpenses() {
    const [expenses, setExpenses] = useState([]);

    // Load expenses from localStorage on mount
    useEffect(() => {
        const saved = storage.get(STORAGE_KEYS.EXPENSES);
        if (saved && Array.isArray(saved)) {
            setExpenses(saved);
        }
    }, []);

    // Save expenses to localStorage whenever they change
    useEffect(() => {
        if (expenses.length >= 0) {
            storage.set(STORAGE_KEYS.EXPENSES, expenses);
        }
    }, [expenses]);

    // Add new expense
    const addExpense = (expenseData) => {
        const newExpense = {
            id: generateId(),
            ...expenseData,
            date: expenseData.date || new Date().toISOString(),
            createdAt: new Date().toISOString(),
        };
        setExpenses(prev => [newExpense, ...prev]);
        return newExpense;
    };

    // Update expense
    const updateExpense = (id, updates) => {
        setExpenses(prev =>
            prev.map(expense =>
                expense.id === id ? { ...expense, ...updates } : expense
            )
        );
    };

    // Delete expense
    const deleteExpense = (id) => {
        setExpenses(prev => prev.filter(expense => expense.id !== id));
    };

    // Get expenses by category
    const getExpensesByCategory = (category) => {
        return expenses.filter(expense => expense.category === category);
    };

    // Get total expenses
    const getTotalExpenses = (filterFn) => {
        const filteredExpenses = filterFn ? expenses.filter(filterFn) : expenses;
        return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
    };

    // Get expenses by date range
    const getExpensesByDateRange = (startDate, endDate) => {
        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startDate && expenseDate <= endDate;
        });
    };

    // Get category totals
    const getCategoryTotals = () => {
        return expenses.reduce((totals, expense) => {
            if (!totals[expense.category]) {
                totals[expense.category] = 0;
            }
            totals[expense.category] += expense.amount;
            return totals;
        }, {});
    };

    return {
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpensesByCategory,
        getTotalExpenses,
        getExpensesByDateRange,
        getCategoryTotals,
    };
}
