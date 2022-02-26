
import ICalParser from 'ical-js-parser';

const parseCalDate = (dateStr) => {
    const d = new Date();

    const dateComp = dateStr.split('T')[0];
    const timeComp = dateStr.split('T')[1];

    if (dateComp) {
        const year = parseInt(dateComp.slice(0, 4));
        const month = parseInt(dateComp.slice(4, 6));
        const day = parseInt(dateComp.slice(6, 8));

        d.setUTCFullYear(year, month - 1, day);
    }

    if (timeComp) {
        const hour = parseInt(timeComp.slice(0, 2));
        const mins = parseInt(timeComp.slice(2, 4));

        d.setUTCHours(hour, mins, 0, 0);
    } else {
        d.setHours(0, 0, 0, 0);
    }

    return d;
};

const parseCalData = (calData) => {
    if (!calData) return;

    const resultJSON = ICalParser.toJSON(calData);

    const events = resultJSON.events.map((calEvent) => ({
        uid: calEvent.uid,
        summary: calEvent.summary,
        description: calEvent.description,
        start: parseCalDate(calEvent.dtstart.value),
        end: parseCalDate(calEvent.dtend.value),
    }));

    console.log(events);

    return events;
};

export default parseCalData;
