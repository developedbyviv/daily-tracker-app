import { useState } from 'react';
import Modal from '../../components/Modal';

const QUALITY_LEVELS = [
    { value: 1, label: '⭐ Poor', color: '#ef4444' },
    { value: 2, label: '⭐⭐ Fair', color: '#f59e0b' },
    { value: 3, label: '⭐⭐⭐ Good', color: '#eab308' },
    { value: 4, label: '⭐⭐⭐⭐ Very Good', color: '#84cc16' },
    { value: 5, label: '⭐⭐⭐⭐⭐ Excellent', color: '#10b981' },
];

export default function SleepForm({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        sleepTime: '',
        wakeTime: '',
        quality: 3,
        notes: '',
        date: new Date().toISOString().split('T')[0],
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Combine date with times
        const sleepDateTime = new Date(`${formData.date}T${formData.sleepTime}`);
        let wakeDateTime = new Date(`${formData.date}T${formData.wakeTime}`);

        // If wake time is before sleep time, assume it's the next day
        if (wakeDateTime < sleepDateTime) {
            wakeDateTime.setDate(wakeDateTime.getDate() + 1);
        }

        onSubmit({
            sleepTime: sleepDateTime.toISOString(),
            wakeTime: wakeDateTime.toISOString(),
            quality: formData.quality,
            notes: formData.notes,
            date: formData.date,
        });

        onClose();
        setFormData({
            sleepTime: '',
            wakeTime: '',
            quality: 3,
            notes: '',
            date: new Date().toISOString().split('T')[0],
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Sleep Entry">
            <form onSubmit={handleSubmit}>
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

                <div className="form-group">
                    <label className="label">Sleep Time</label>
                    <input
                        type="time"
                        name="sleepTime"
                        value={formData.sleepTime}
                        onChange={handleChange}
                        className="input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="label">Wake Time</label>
                    <input
                        type="time"
                        name="wakeTime"
                        value={formData.wakeTime}
                        onChange={handleChange}
                        className="input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="label">Sleep Quality</label>
                    <select
                        name="quality"
                        value={formData.quality}
                        onChange={handleChange}
                        className="input"
                        required
                    >
                        {QUALITY_LEVELS.map(level => (
                            <option key={level.value} value={level.value}>
                                {level.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="label">Notes (Optional)</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="input"
                        placeholder="Any notes about your sleep..."
                        rows="3"
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onClose} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Add Entry
                    </button>
                </div>
            </form>
        </Modal>
    );
}
