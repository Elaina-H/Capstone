import React, { useState, useEffect } from 'react';
import './Calendar.css'; 
import axios from 'axios';
import Cookies from 'js-cookie';

/*
To fix with DB Update:
deleteEvent()
addEvent()
getWeekEvents()
getMonthEvents()
return ( 
	display events for selected day
)

Bugs:
- scroll goes to specified pixel instead of directly to the element
*/

// function getCsrfToken() {
//   const cookies = document.cookie.split(';');
//   for (let i = 0; i < cookies.length; i++) {
//     const cookie = cookies[i].trim();
//     if (cookie.startsWith('csrftoken=')) {
//       return cookie.substring('csrftoken='.length);
//     }
//   }
//   return null; // Return null if the token isn't found
// }


const Calendar = ({ eventsArr, addEvent, deleteEventAndTask }) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  
	
  const [activeDay, setActiveDay] = useState(new Date().getDate());
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [days, setDays] = useState([]);
  /* FIXME will need to change to database somehow */
  
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventTimeFrom, setEventTimeFrom] = useState("");
  const [eventTimeTo, setEventTimeTo] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  const [eventDate, setEventDate] = useState("");
  
  


  /* Update the time every second */
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    initCalendar();
  }, [month, year, eventsArr]);

  const initCalendar = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();
    const daysArr = [];

    /* Previous month's days (fill in) */
    for (let x = firstDay; x > 0; x--) {
      daysArr.push(
        <div key={`prev-${x}`} className="day prev-date">
          {prevLastDate - x + 1}
        </div>
      );
    }

    /* Current month's days */
    for (let day = 1; day <= lastDate; day++) {
      const isToday =
        day === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear();
      const eventForDay = eventsArr.some(
        (event) =>
          event.day === day && event.month === month + 1 && event.year === year
      );
      daysArr.push(
        <div
          key={`day-${day}`}
          className={`day ${isToday ? "today" : ""} ${eventForDay ? "event" : ""}`}
          onClick={() => setActiveDay(day)}
        >
          {day}
        </div>
      );
    }

    /* Fill next month's days */
    const nextDays = 7 - (daysArr.length % 7);
    for (let j = 1; j <= nextDays; j++) {
      daysArr.push(
        <div key={`next-${j}`} className="day next-date">
          {j}
        </div>
      );
    }
    setDays(daysArr);
  };

/* allows Calendar to display past month on button press */
  const prevMonth = () => {
    const newDate = new Date(year, month, 1);
    newDate.setMonth(newDate.getMonth() - 1);
    setMonth(newDate.getMonth());
    setYear(newDate.getFullYear());
    setActiveDay(newDate.getDate());
  };

/* allows Calendar to display next month on button press */
  const nextMonth = () => {
    const newDate = new Date(year, month, 1);
    newDate.setMonth(newDate.getMonth() + 1);
    setMonth(newDate.getMonth());
    setYear(newDate.getFullYear());
    setActiveDay(newDate.getDate());
  };

  /* update with adding dates to database*/

  const addNewEvent = async () => {
    console.log("Event Date: ", eventDate);
    const [year, month, day] = eventDate.split("-").map(Number);
    const csrfToken = Cookies.get('csrftoken');


    try {
      const response = await axios.post('http://127.0.0.1:8000/api/add_event/', { 
        Day: day,
        Month: month,
        Year: year,
        EventName: eventName,
        TimeFrom: eventTimeFrom,
        TimeTo: eventTimeTo,
      }, {
        headers: {
          'X-CSRFToken': csrfToken, // Add a method to retrieve the token
          'Content-Type': 'application/json',
        }
      });

      console.log("Full backend response:", response.data);
  
      const backendEvent = response.data.event;
      const eventID = backendEvent.id;
      console.log("Event ID:", eventID);

      
      const newEvent = {
        Day: day,
        Month: month,
        Year: year,
        EventName: eventName,
        TimeFrom: eventTimeFrom,
        TimeTo: eventTimeTo,
        event_id: eventID,
      };

      addEvent(newEvent);
      setEventName("");
      setEventTimeFrom("");
      setEventTimeTo("");        
      setEventDate("");
      setShowEventForm(false);

      console.log("Year:", year);  
      console.log("Month:", month); 
      console.log("Day:", day);
      console.log("Title:", eventName);
      console.log("Time:", eventTimeFrom, " ", eventTimeTo);
      console.log("New Event: ", newEvent);
    } catch (error) {
      console.error("Error adding event: ", error);
      alert("Error adding event.");
    }
  };
  
	/* update to display events from database*/
  const getWeekEvents = () => {
	  const today = new Date();
	  const firstDayOfWeek = today.getDate() - today.getDay(); // Start of week
	  const lastDayOfWeek = firstDayOfWeek + 6; // End of week

	  const firstDate = new Date(today.setDate(firstDayOfWeek));
	  const lastDate = new Date(today.setDate(lastDayOfWeek));

	  return eventsArr.filter(event => {
		const eventDate = new Date(event.Year, event.Month - 1, event.Day);
		return eventDate >= firstDate && eventDate <= lastDate;
	  });
	};

	/* update to display events from database*/
  const getMonthEvents = () => {
    return eventsArr.filter(
      (event) => event.Month === month + 1 && event.Year === year
    );
  };
  
/* below is actual Display */
  return (
    <div className="container">
      {/* Left Panel (Calendar) */}
      <div className="left">
        <div className="cascade-layer"></div>
        <div className="calendar">
          <div className="month">
            <button className="prev-month" onClick={prevMonth}></button>
            <div className="date">{months[month]} {year}</div>
            <button className="next-month" onClick={nextMonth}></button>
          </div>

          <div className="weekdays">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="days">
            {days}
          </div>
		  {/* FIX: should scroll to element instead of to pixel */}
		  <button className = "scr-todo" onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}> Scroll to your ToDo list</button>
		  <button className = "scr-library" onClick={() => window.scrollTo({ top: 1270, behavior: 'smooth' })}> Scroll to view Library rooms</button>
        </div>
      </div>
	  

      {/* Right Panel (Event Details) */}
      <div className="event-details">
        <div className="today-date">
          <div className="event-day">{new Date(year, month, activeDay).toLocaleString('en-us', { weekday: 'long' })}</div>
          <div className="event-date">{activeDay} {months[month]} {year}</div>

        </div>
        <div id="current-time">Current Time: <span>{currentTime}</span></div>
		{/* FIXME Display this week's events */}
        <div className="event-dropdowns">
          <div className="dropdown">
            <button className="dropbtn">Upcoming Events This Week</button>
            <div className="dropdown-content">
              if (getWeekEvents().length != 0)  {
				<div>events this week</div>
			} else {
				<div>No events this week</div>
			}
			
		   </div>
		  </div>
		  
		  {/* FIXME Display this month's events */}
          <div className="dropdown">
            <button className="dropbtn">Upcoming Events This Month</button>
            <div className="dropdown-content">
              {getMonthEvents().map((event, index) => (
                <div key={index}>{event.Day} {months[event.Month - 1]}: {event.EventName} ({event.TimeFrom} - {event.TimeTo})</div>
              ))}
            </div>
			
          </div>
        </div>
        

{/* Display events for selected day*/}
        
        <div className="events">
          {eventsArr.filter(event => event.Day === activeDay && event.Month === month + 1 && event.Year === year).map((event, index) => (
            <div key={index} className="event">
              <div className="title">
			  <i className="fas fa-circle"></i>
              <h3 className="event-title">{event.EventName}</h3>
              </div>
			  <div className="event-time">
				<span className="event-time">{event.TimeFrom} - {event.TimeTo}</span>
			  </div>
				<button className="delete-event-btn" onClick={() => deleteEventAndTask(event, index)}>Delete</button>
			  </div>
          ))}
        </div>

        {/* Add Event Form */}
        {showEventForm && (
          <div className="add-event-wrapper">
            <div className="add-event-header">
              <div className="title">Add Event</div>
              <i className="fas fa-times close" onClick={() => setShowEventForm(false)}></i>
            </div>
            <div className="add-event-body">
              <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
              <input type="time" placeholder="Event Time From" value={eventTimeFrom} onChange={(e) => setEventTimeFrom(e.target.value)} />
              <input type="time" placeholder="Event Time To" value={eventTimeTo} onChange={(e) => setEventTimeTo(e.target.value)} />
			  <input type="date" placeholder="Event Date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            </div>
            <div className="add-event-footer">
              <button className="add-event-btn" onClick={addNewEvent}>Add Event</button>
            </div>
          </div>
        )}


        {/* Add Event Button */}
        <button className="add-event" onClick={() => setShowEventForm(true)}>
          <i className="fas fa-plus">Create event</i>
        </button>
      </div>
    </div>
  );
};

export default Calendar;