export const isStoreOpen = (settings) => {
    if (!settings) return true;
    if (settings.isHolidayMode) return false;

    if (!settings.timings || !settings.timings.open || !settings.timings.close) {
        return true;
    }

    const parseTime = (timeStr) => {
        if (!timeStr) return 0;
        const normalized = timeStr.trim().toUpperCase();

        let hours, minutes, modifier;
        const match = normalized.match(/^(\d{1,2}):(\d{2})(?:\s*)?(AM|PM)?$/);
        if (match) {
            hours = parseInt(match[1], 10);
            minutes = parseInt(match[2], 10);
            modifier = match[3];
        } else {
            return 0;
        }

        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        return hours * 60 + minutes;
    };

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = parseTime(settings.timings.open);
    const closeMinutes = parseTime(settings.timings.close);

    if (closeMinutes < openMinutes) {
        return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
    }

    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
};
