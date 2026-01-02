// LocalStorage utility for data persistence

const STORAGE_KEYS = {
    EXPENSES: 'personalJournal_expenses',
    WATER: 'personalJournal_water',
    SMOKING: 'personalJournal_smoking',
    SLEEP: 'personalJournal_sleep',
    THOUGHTS: 'personalJournal_thoughts',
};

export const storage = {
    // Get data from localStorage
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from localStorage:`, error);
            return null;
        }
    },

    // Set data to localStorage
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage:`, error);
            return false;
        }
    },

    // Remove data from localStorage
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing from localStorage:`, error);
            return false;
        }
    },

    // Clear all app data
    clearAll() {
        try {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error(`Error clearing localStorage:`, error);
            return false;
        }
    },
};

export { STORAGE_KEYS };
