import { format, startOfDay, endOfDay, isWithinInterval, subDays } from 'date-fns';

// Format currency in INR
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};

// Format date
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
    return format(new Date(date), formatStr);
};

// Format time
export const formatTime = (date) => {
    return format(new Date(date), 'hh:mm a');
};

// Get date range for filtering
export const getDateRange = (range) => {
    const now = new Date();
    const today = startOfDay(now);

    switch (range) {
        case 'today':
            return { start: today, end: endOfDay(now) };
        case 'week':
            return { start: subDays(today, 7), end: endOfDay(now) };
        case 'month':
            return { start: subDays(today, 30), end: endOfDay(now) };
        default:
            return { start: today, end: endOfDay(now) };
    }
};

// Filter data by date range
export const filterByDateRange = (data, range, dateField = 'date') => {
    const { start, end } = getDateRange(range);
    return data.filter(item => {
        const itemDate = new Date(item[dateField]);
        return isWithinInterval(itemDate, { start, end });
    });
};

// Calculate sleep duration
export const calculateSleepDuration = (sleepTime, wakeTime) => {
    const sleep = new Date(sleepTime);
    const wake = new Date(wakeTime);
    let diff = wake - sleep;

    // If wake time is before sleep time, assume it's the next day
    if (diff < 0) {
        diff += 24 * 60 * 60 * 1000;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes, totalHours: hours + minutes / 60 };
};

// Generate unique ID
export const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Group data by date
export const groupByDate = (data, dateField = 'date') => {
    return data.reduce((groups, item) => {
        const date = format(new Date(item[dateField]), 'yyyy-MM-dd');
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(item);
        return groups;
    }, {});
};
