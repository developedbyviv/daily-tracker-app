import { useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { format, startOfDay, differenceInDays, parseISO } from 'date-fns';

export default function useGym() {
    const [sessions, setSessions] = useState([]);

    // Load gym data from localStorage
    useEffect(() => {
        const saved = storage.get(STORAGE_KEYS.GYM);
        if (saved) {
            setSessions(saved.sessions || []);
        }
    }, []);

    // Save gym data to localStorage
    useEffect(() => {
        storage.set(STORAGE_KEYS.GYM, { sessions });
    }, [sessions]);

    // Get today's date key
    const getTodayKey = () => format(startOfDay(new Date()), 'yyyy-MM-dd');

    // Add a gym session
    const addGymSession = (duration, notes = '') => {
        const newSession = {
            id: Date.now(),
            date: getTodayKey(),
            duration, // in minutes
            notes,
            timestamp: new Date().toISOString(),
        };

        setSessions(prev => [newSession, ...prev]);
    };

    // Delete a gym session
    const deleteGymSession = (id) => {
        setSessions(prev => prev.filter(session => session.id !== id));
    };

    // Get today's sessions
    const getTodaySessions = () => {
        const todayKey = getTodayKey();
        return sessions.filter(session => session.date === todayKey);
    };

    // Get total sessions
    const getTotalSessions = () => {
        return sessions.length;
    };

    // Get total duration today
    const getTodayDuration = () => {
        return getTodaySessions().reduce((total, session) => total + session.duration, 0);
    };

    // Get average duration
    const getAverageDuration = () => {
        if (sessions.length === 0) return 0;
        const totalDuration = sessions.reduce((total, session) => total + session.duration, 0);
        return totalDuration / sessions.length;
    };

    // Get current streak (consecutive days with gym sessions)
    const getCurrentStreak = () => {
        if (sessions.length === 0) return 0;

        // Get unique dates sorted in descending order
        const uniqueDates = [...new Set(sessions.map(s => s.date))].sort((a, b) => b.localeCompare(a));

        if (uniqueDates.length === 0) return 0;

        const today = startOfDay(new Date());
        const mostRecentDate = parseISO(uniqueDates[0]);

        // Check if the most recent session is today or yesterday
        const daysDiff = differenceInDays(today, mostRecentDate);
        if (daysDiff > 1) return 0; // Streak broken

        let streak = 1;
        for (let i = 1; i < uniqueDates.length; i++) {
            const currentDate = parseISO(uniqueDates[i]);
            const previousDate = parseISO(uniqueDates[i - 1]);
            const diff = differenceInDays(previousDate, currentDate);

            if (diff === 1) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    };

    // Get weekly data for chart
    const getWeeklyData = () => {
        const weekData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = format(startOfDay(date), 'yyyy-MM-dd');

            const daySessions = sessions.filter(s => s.date === dateKey);
            const totalDuration = daySessions.reduce((total, s) => total + s.duration, 0);

            weekData.push({
                date: dateKey,
                sessions: daySessions.length,
                duration: totalDuration,
            });
        }
        return weekData;
    };

    // Get this week's total sessions
    const getWeeklySessions = () => {
        return getWeeklyData().reduce((total, day) => total + day.sessions, 0);
    };

    return {
        sessions,
        todaySessions: getTodaySessions(),
        todayDuration: getTodayDuration(),
        totalSessions: getTotalSessions(),
        averageDuration: getAverageDuration(),
        currentStreak: getCurrentStreak(),
        weeklySessions: getWeeklySessions(),
        addGymSession,
        deleteGymSession,
        getWeeklyData,
    };
}
