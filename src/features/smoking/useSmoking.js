import { useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { format, startOfDay, differenceInDays } from 'date-fns';
import { generateId } from '../../utils/helpers';

export default function useSmoking() {
    const [smokingData, setSmokingData] = useState({});
    const [quitDate, setQuitDate] = useState(null);

    useEffect(() => {
        const saved = storage.get(STORAGE_KEYS.SMOKING);
        if (saved) {
            setSmokingData(saved.data || {});
            setQuitDate(saved.quitDate || null);
        }
    }, []);

    useEffect(() => {
        storage.set(STORAGE_KEYS.SMOKING, { data: smokingData, quitDate });
    }, [smokingData, quitDate]);

    const getTodayKey = () => format(startOfDay(new Date()), 'yyyy-MM-dd');

    const addSmoke = () => {
        const todayKey = getTodayKey();
        const currentData = smokingData[todayKey] || { count: 0, timestamps: [] };

        setSmokingData(prev => ({
            ...prev,
            [todayKey]: {
                count: currentData.count + 1,
                timestamps: [...currentData.timestamps, new Date().toISOString()],
            },
        }));
    };

    const getTodayCount = () => {
        const todayKey = getTodayKey();
        return smokingData[todayKey]?.count || 0;
    };

    const getWeeklyData = () => {
        const weekData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = format(startOfDay(date), 'yyyy-MM-dd');
            weekData.push({
                date: dateKey,
                count: smokingData[dateKey]?.count || 0,
            });
        }
        return weekData;
    };

    const getStreak = () => {
        let streak = 0;
        const today = new Date();

        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateKey = format(startOfDay(date), 'yyyy-MM-dd');

            if (smokingData[dateKey]?.count > 0) {
                break;
            }
            streak++;
        }

        return streak;
    };

    const setQuitting = (date) => {
        setQuitDate(date);
    };

    const getDaysSinceQuit = () => {
        if (!quitDate) return 0;
        return differenceInDays(new Date(), new Date(quitDate));
    };

    const getTodayEntries = () => {
        const todayKey = getTodayKey();
        return smokingData[todayKey]?.timestamps || [];
    };

    const removeSmoke = (timestamp) => {
        const todayKey = getTodayKey();
        const currentData = smokingData[todayKey];

        if (!currentData) return;

        const updatedTimestamps = currentData.timestamps.filter(t => t !== timestamp);

        setSmokingData(prev => ({
            ...prev,
            [todayKey]: {
                count: updatedTimestamps.length,
                timestamps: updatedTimestamps,
            },
        }));
    };

    return {
        todayCount: getTodayCount(),
        addSmoke,
        getWeeklyData,
        streak: getStreak(),
        quitDate,
        setQuitting,
        daysSinceQuit: getDaysSinceQuit(),
        getTodayEntries,
        removeSmoke,
    };
}
