import { useState } from 'react';
import Modal from '../../components/Modal';
import { EXPENSE_CATEGORIES } from './useExpenses';

export default function ExpenseForm({ isOpen, onClose, onSubmit, initialData = null }) {
    const [formData, setFormData] = useState({
        amount: initialData?.amount || '',
        category: initialData?.category || 'food',
        description: initialData?.description || '',
        date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            amount: parseFloat(formData.amount),
            date: new Date(formData.date).toISOString(),
        });
        onClose();
        // Reset form
        setFormData({
            amount: '',
            category: 'food',
            description: '',
            date: new Date().toISOString().split('T')[0],
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Expense' : 'Add Expense'}>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="label">Amount (₹)</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="input"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="label">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="input"
                        required
                    >
                        {EXPENSE_CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="label">Description</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="input"
                        placeholder="What did you spend on?"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="label">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="input"
                        required
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onClose} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        {initialData ? 'Update' : 'Add'} Expense
                    </button>
                </div>
            </form>
        </Modal>
    );
}
