
const getMostRecentMonday = (_date) => {
    const date = new Date(_date);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
};

export const datePlusDays = (date, daysToAdd) => {
    const result = new Date(date);
    result.setDate(result.getDate() + daysToAdd);
    return result;
};

export const buildCalenderData = (days = 28) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const mostRecentMonday = getMostRecentMonday(today);

    const dates = [];

    for (let i = 0; i < days; i++) {
        dates.push(datePlusDays(mostRecentMonday, i));
    }

    return dates;
};
