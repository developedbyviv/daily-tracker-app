import { useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { generateId } from '../../utils/helpers';

export const MOODS = [
    { value: 'happy', label: 'Happy', emoji: '😊', color: '#10b981' },
    { value: 'sad', label: 'Sad', emoji: '😢', color: '#3b82f6' },
    { value: 'neutral', label: 'Neutral', emoji: '😐', color: '#6b7280' },
    { value: 'excited', label: 'Excited', emoji: '🤩', color: '#f59e0b' },
    { value: 'anxious', label: 'Anxious', emoji: '😰', color: '#ef4444' },
    { value: 'grateful', label: 'Grateful', emoji: '🙏', color: '#8b5cf6' },
];

export default function useThoughts() {
    const [thoughts, setThoughts] = useState([]);

    useEffect(() => {
        const saved = storage.get(STORAGE_KEYS.THOUGHTS);
        if (saved && Array.isArray(saved)) {
            setThoughts(saved);
        }
    }, []);

    useEffect(() => {
        if (thoughts.length >= 0) {
            storage.set(STORAGE_KEYS.THOUGHTS, thoughts);
        }
    }, [thoughts]);

    const addThought = (thoughtData) => {
        const newThought = {
            id: generateId(),
            ...thoughtData,
            createdAt: new Date().toISOString(),
        };
        setThoughts(prev => [newThought, ...prev]);
        return newThought;
    };

    const updateThought = (id, updates) => {
        setThoughts(prev =>
            prev.map(thought =>
                thought.id === id ? { ...thought, ...updates } : thought
            )
        );
    };

    const deleteThought = (id) => {
        setThoughts(prev => prev.filter(thought => thought.id !== id));
    };

    const searchThoughts = (query) => {
        if (!query) return thoughts;
        const lowerQuery = query.toLowerCase();
        return thoughts.filter(thought =>
            thought.content.toLowerCase().includes(lowerQuery) ||
            thought.title?.toLowerCase().includes(lowerQuery)
        );
    };

    const filterByMood = (mood) => {
        if (!mood) return thoughts;
        return thoughts.filter(thought => thought.mood === mood);
    };

    return {
        thoughts,
        addThought,
        updateThought,
        deleteThought,
        searchThoughts,
        filterByMood,
    };
}
