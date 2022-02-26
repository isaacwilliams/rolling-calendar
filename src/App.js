import React, { useEffect, useState } from 'react';
import dateFormat from 'dateformat';

import parseCalData from './parseICalData';
import { buildCalenderData, datePlusDays } from './dateUtil';

import './App.css';

const CalendarCell = ({ date, eventData = [] }) => {
    const dateEnd = datePlusDays(date, 1);

    const cellEvents = eventData.filter(({ start, end }) => (
        start >= date &&
        end <= dateEnd
    ));

    return (
        <div className="CalenderCell">
            <div className="date">
                {dateFormat(date, 'dddd, dS mmmm')}
                {cellEvents.map(({ uid, summary }) => (
                    <li key={uid}>
                        {summary}
                    </li>
                ))}
            </div>
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
            <input type="file"
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
