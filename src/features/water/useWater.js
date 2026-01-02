import { useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { format, startOfDay, isToday } from 'date-fns';

const DEFAULT_DAILY_GOAL = 2000; // ml

export default function useWater() {
    const [waterData, setWaterData] = useState({});
    const [dailyGoal, setDailyGoal] = useState(DEFAULT_DAILY_GOAL);

    // Load water data from localStorage
    useEffect(() => {
        const saved = storage.get(STORAGE_KEYS.WATER);
        if (saved) {
            setWaterData(saved.data || {});
            setDailyGoal(saved.dailyGoal || DEFAULT_DAILY_GOAL);
        }
    }, []);

    // Save water data to localStorage
    useEffect(() => {
        storage.set(STORAGE_KEYS.WATER, { data: waterData, dailyGoal });
    }, [waterData, dailyGoal]);

    // Get today's date key
    const getTodayKey = () => format(startOfDay(new Date()), 'yyyy-MM-dd');

    // Get today's intake
    const getTodayIntake = () => {
        const todayKey = getTodayKey();
        return waterData[todayKey]?.total || 0;
    };

    // Add water
    const addWater = (amount) => {
        const todayKey = getTodayKey();
        const currentData = waterData[todayKey] || { total: 0, entries: [] };

        const newEntry = {
            amount,
            timestamp: new Date().toISOString(),
        };

        setWaterData(prev => ({
            ...prev,
            [todayKey]: {
                total: currentData.total + amount,
                entries: [...currentData.entries, newEntry],
            },
        }));
    };

    // Update daily goal
    const updateDailyGoal = (newGoal) => {
        setDailyGoal(newGoal);
    };

    // Get progress percentage
    const getProgress = () => {
        const intake = getTodayIntake();
        return Math.min((intake / dailyGoal) * 100, 100);
    };

    // Get weekly data
    const getWeeklyData = () => {
        const weekData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = format(startOfDay(date), 'yyyy-MM-dd');
            weekData.push({
                date: dateKey,
                intake: waterData[dateKey]?.total || 0,
            });
        }
        return weekData;
    };

    return {
        todayIntake: getTodayIntake(),
        dailyGoal,
        progress: getProgress(),
        addWater,
        updateDailyGoal,
        getWeeklyData,
    };
}
