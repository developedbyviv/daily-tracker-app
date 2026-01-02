import { useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { generateId, calculateSleepDuration } from '../../utils/helpers';

export default function useSleep() {
    const [sleepEntries, setSleepEntries] = useState([]);

    useEffect(() => {
        const saved = storage.get(STORAGE_KEYS.SLEEP);
        if (saved && Array.isArray(saved)) {
            setSleepEntries(saved);
        }
    }, []);

    useEffect(() => {
        if (sleepEntries.length >= 0) {
            storage.set(STORAGE_KEYS.SLEEP, sleepEntries);
        }
    }, [sleepEntries]);

    const addSleepEntry = (entryData) => {
        const duration = calculateSleepDuration(entryData.sleepTime, entryData.wakeTime);

        const newEntry = {
            id: generateId(),
            ...entryData,
            duration: duration.totalHours,
            createdAt: new Date().toISOString(),
        };

        setSleepEntries(prev => [newEntry, ...prev]);
        return newEntry;
    };

    const deleteSleepEntry = (id) => {
        setSleepEntries(prev => prev.filter(entry => entry.id !== id));
    };

    const getAverageSleep = () => {
        if (sleepEntries.length === 0) return 0;
        const total = sleepEntries.reduce((sum, entry) => sum + entry.duration, 0);
        return total / sleepEntries.length;
    };

    const getWeeklyData = () => {
        return sleepEntries.slice(0, 7).reverse();
    };

    return {
        sleepEntries,
        addSleepEntry,
        deleteSleepEntry,
        getAverageSleep,
        getWeeklyData,
    };
}
