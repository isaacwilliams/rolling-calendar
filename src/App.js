import React, { useEffect, useState } from 'react';
import dateFormat from 'dateformat';
import { uniqBy } from 'lodash/fp';

import parseCalData from './parseICalData';
import { buildCalenderData, datePlusDays } from './dateUtil';

import './App.css';

const uniqById = uniqBy('uid');

const formatEventTime = (time) => {
    if (dateFormat(time, 'h tt') === '12 am') return;

    const hasMinutes = dateFormat(time, 'MM') !== '00';

    return hasMinutes ?
        dateFormat(time, 'h:MM tt') :
        dateFormat(time, 'h tt');
};

const getTimeOfDay = (date) => (
    date.getHours() * 60 + date.getMinutes()
);

const CalendarCell = ({ date, eventData = [] }) => {
    const dateEnd = datePlusDays(date, 1);

    const dateDayOfWeek = date.getDay();

    const cellEvents = eventData
        .filter(({ start, end, repeat }) => (
            (
                start >= date &&
                end <= dateEnd
            )
            ||
            (
                repeat && repeat.dayOfWeek === dateDayOfWeek &&
                start <= date
            )
        ))
        .sort(({ start: startA }, { start: startB }) => (
            getTimeOfDay(startA) - getTimeOfDay(startB)
        ));

    const uniqCellEvents = uniqById(cellEvents);

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
                    {uniqCellEvents.map((event) => {
                        const { uid, start, summary, description } = event;
                        const eventTime = formatEventTime(start);

                        return (
                            <li key={uid} className="event" onClick={() => console.log(event)}>
                                {eventTime && <span className="time">{eventTime}:</span>}
                                {' '}
                                <span className="summary">{summary}</span>
                                {' '}
                                <span className="description">{description}</span>
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
            <div className="file-input">
                <h1>Rolling calender</h1>
                <ol>
                    <li>Export .ics file from Google Calender</li>
                    <li>Upload here</li>
                    <li>Print, using the browser controls.</li>
                </ol>
                <p>
                    <em>This section won't print.</em>
                </p>
                <p>
                    <input
                            type="file"
                            accept="text/calendar"
                            onChange={(event) => {
                            setCalFile(event.target.files[0]);
                        }} />
                </p>
            </div>

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
