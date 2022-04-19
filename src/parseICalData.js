
import ICAL from 'ical.js';
import { isArray, isNumber, last } from 'lodash';

const getJsDayOfWeek = (day) => {
    switch (day) {
        case 'MO':
            return 1;
        case 'TU':
            return 2;
        case 'WE':
            return 3;
        case 'TH':
            return 4;
        case 'FR':
            return 5;
        case 'SA':
            return 6;
        case 'SU':
        default:
            return 0;
    }
};

const parseEventValue = ([name, _, type, value]) => {
    switch (type) {
        case 'date-time':
            return new Date(value);
        case 'recur':
            const wkst = value['wkst'];

            const dayOfWeek = isNumber(wkst) ?
                wkst :
                getJsDayOfWeek(value['byday']);

            return {
                ...value,
                dayOfWeek,
            };
        default:
            return value;
    }
};

const parseJCalEventValues = (jCalEvent) => {
    return (
        jCalEvent.reduce((acc, eventValue) => {
            if (!isArray(eventValue)) return acc;
            const [name] = eventValue;

            const value = parseEventValue(eventValue);
            acc[name] = value;

            return acc;
        }, {})
    );
}

const parseCalData = (calData) => {
    if (!calData) return;

    const jCal = ICAL.parse(calData);

    const jCalEvents = (last(jCal) || [])
        .filter(([type]) => type === 'vevent')
        .map(event => event[1])
        .map(parseJCalEventValues);

    const events = jCalEvents.map((calEvent) => ({
        uid: calEvent.uid,
        summary: calEvent.summary,
        description: calEvent.description,
        start: calEvent.dtstart,
        end: calEvent.dtend,
        repeat: calEvent.rrule,
    }));

    return events;
};

export default parseCalData;
