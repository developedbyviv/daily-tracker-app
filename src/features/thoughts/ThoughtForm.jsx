import { useState } from 'react';
import Modal from '../../components/Modal';
import { MOODS } from './useThoughts';

export default function ThoughtForm({ isOpen, onClose, onSubmit, initialData = null }) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        content: initialData?.content || '',
        mood: initialData?.mood || 'neutral',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
        setFormData({
            title: '',
            content: '',
            mood: 'neutral',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Thought' : 'New Thought'}>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="label">Title (Optional)</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="input"
                        placeholder="Give your thought a title..."
                    />
                </div>

                <div className="form-group">
                    <label className="label">Your Thoughts</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        className="input"
                        placeholder="Write what's on your mind..."
                        rows="8"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="label">Mood</label>
                    <div className="mood-selector">
                        {MOODS.map(mood => (
                            <label key={mood.value} className="mood-option">
                                <input
                                    type="radio"
                                    name="mood"
                                    value={mood.value}
                                    checked={formData.mood === mood.value}
                                    onChange={handleChange}
                                />
                                <div className="mood-card">
                                    <span className="mood-emoji">{mood.emoji}</span>
                                    <span className="mood-label text-sm">{mood.label}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onClose} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        {initialData ? 'Update' : 'Save'} Thought
                    </button>
                </div>
            </form>
        </Modal>
    );
}
