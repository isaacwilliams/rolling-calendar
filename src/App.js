import React, { useEffect, useState } from 'react';
import dateFormat from 'dateformat';

import parseCalData from './parseICalData';
import { buildCalenderData, datePlusDays } from './dateUtil';

import './App.css';

const formatEventTime = (time) => {
    if (dateFormat(time, 'h tt') === '12 am') return;

    const hasMinutes = dateFormat(time, 'MM') !== '00';

    return hasMinutes ?
        dateFormat(time, 'h:MM tt') :
        dateFormat(time, 'h tt');
};

const CalendarCell = ({ date, eventData = [] }) => {
    const dateEnd = datePlusDays(date, 1);

    const cellEvents = eventData.filter(({ start, end }) => (
        start >= date &&
        end <= dateEnd
    ));

    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    return (
        <div className={`CalenderCell ${isWeekend ? 'weekend' :'weekday'}`}>
            <div className="date">
                <div className="day">{dateFormat(date, 'dddd')}</div>
                <div className="dt">{dateFormat(date, 'dS mmmm')}</div>
            </div>
            {cellEvents.length > 0 && (
                <ul className="events">
                    {cellEvents.map(({ uid, start, summary, description }) => {
                        const eventTime = formatEventTime(start);

                        return (
                            <li key={uid}>
                                {eventTime}
                                {summary}
                                {description}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

const App = () => {
    const [calFile, setCalFile] = useState('');
    const [calData, setCalData] = useState();

    useEffect(() => {
    const fetchCalData = (fileName) => {
        const fileReader = new FileReader();

        fileReader.addEventListener('load', (event) => {
            setCalData(event.target.result);
            });

            fileReader.readAsText(fileName);
        };

        if (calFile) {
            fetchCalData(calFile);
        }
    }, [calFile]);

    const eventData = parseCalData(calData);

    const calendarCells = buildCalenderData();

    return (
        <div className="App">
            <input className="file-input"
                    type="file"
                    accept="text/calendar"
                    onChange={(event) => {
                    setCalFile(event.target.files[0]);
                }} />

            <div className="calender">
                {calendarCells.map(date => (
                    <CalendarCell key={date.toString()}
                        date={date}
                        eventData={eventData} />
                ))}
            </div>
        </div>
    );
}

export default App;
