import './App.css';
import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import Todo from './Todo';
import Studyroom from './Studyroom';
import Scheduler from './Scheduler';
import axios from 'axios';
import Cookies from 'js-cookie';


function App() {
  const [activeDay, setActiveDay] = useState(new Date().getDate());
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  // defining state variable "tasks" and using lazy initalization
  const [tasks, setTasks] = useState(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    return savedTasks || [];  
  });

  // defining state variable "eventsArr" and using lazy initalization
  const [eventsArr, setEventsArr] = useState(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events"));
    return savedEvents || [];
  });

  // use to update header with room code
  const [roomCode, setRoomCode] = useState("");
  const [roomURL, setRoomURL] = useState("");
  const [roomID, setRoomID] = useState(null);
  const [loggedin, setloggedin] = useState(false);

  const [findCode, setFindCode] = useState('');
  const [showFindInput, setShowFindInput] = useState(false);

  // saving task strings to local storage, updating when "tasks" changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // saving event objects to local storage, updating when "eventsArr" changes
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(eventsArr));
  }, [eventsArr]);

  // 4/22 - - TEST    
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userIDFromUrl = params.get('roomCode');
    if (userIDFromUrl) {
      setRoomCode(userIDFromUrl); 
    }
  }, []);
  
  // Once roomCode is set, fetch events
  useEffect(() => {
    if (roomCode) {
      fetchEventsForUser(roomCode);
    }
  }, [roomCode]);
  
    // Fetch events from backend based on userID
    const fetchEventsForUser = async (roomCode) => {
      try {
        // Get room object using roomCode
        
        // Query to get RoomID from the "room" table using RoomCode
        const roomDetails = await axios.get(`http://127.0.0.1:8000/api/rooms/${roomCode}/`);
        const fetchedRoomID = roomDetails.data.RoomID;
        setRoomID(fetchedRoomID);
      
        // Now fetch events for that roomID
        const response = await axios.get(`http://127.0.0.1:8000/api/fetch_events/${roomCode}`);
        const userEvents = response.data;
        setEventsArr(userEvents);
        localStorage.setItem("events", JSON.stringify(userEvents));
        console.log("Fetched Events:", userEvents);

      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    // 4/22 - - END TEST

  const addTask = (task) => {
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const addEvent = async (event) => {
    const updatedEvents = [...eventsArr, event];
    setEventsArr(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    // addTask(event.event_id);
    //addTask(event.EventName);
    // addTask(event.events[0].title);
    addTask({
      text: event.EventName,
      x: 50,
      y: 50
    });
    await fetchEventsForUser(roomCode);
  };

  // Deletes an event from the backend
  const deleteEventfromBackend = async (eventID) => {
    console.log("Calling backend delete for eventId:", eventID);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delete_event/${eventID}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('event_id not found');
      }
  
      const data = await response.json();
      console.log(data.message);
      return data;

    }catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  };

  const deleteEventAndTask = async (eventToDelete, taskIndex) => {
    console.log("eventToDelete:", eventToDelete);
    console.log("event_id:", eventToDelete?.event_id);
  
    // Determine if we have an event_id
    const eventId = eventToDelete?.event_id;
  
    // Delete from backend if event_id is available
    if (eventId) {
      // delete from backend
      await deleteEventfromBackend(eventToDelete.event_id);
    
      // Remove event from state
      setEventsArr((prevEvents) =>
        prevEvents.filter((event) => event.event_id !== eventToDelete.event_id)
      );
    
      // Remove matching task (by title)
      const taskToDelete = eventToDelete.EventName;
      setTasks((prevTasks) => prevTasks.filter((task) => task !== taskToDelete));
    }
    // if no event_id is available (a task)
    else {
      // Get the task title from index
      const taskToDelete = tasks[taskIndex];
      console.log("Task to delete (array position):", taskIndex, taskToDelete);
    
      // Try to find a matching event in eventsArr using EventName
      const matchingEvent = eventsArr.find(event => event.EventName === taskToDelete);
    
      if (matchingEvent?.event_id) {
        // Found a matching event with event_id — delete from backend and state
        await deleteEventfromBackend(matchingEvent.event_id);
    
        // Remove from calendar state
        setEventsArr(prevEvents =>
          prevEvents.filter(event => event.event_id !== matchingEvent.event_id)
        );
      } 
      else {
        console.warn("No matching event found with EventName:", taskToDelete);
    
        // Fallback: Just remove from calendar state by EventName
        setEventsArr(prevEvents =>
          prevEvents.filter(event => event.EventName !== taskToDelete)
        );
      }
    
      // Remove from tasks state
      setTasks(prevTasks =>
        prevTasks.filter((_, i) => i !== taskIndex)
      );
    }
  };
  
  // NEW - -
  const addRoom = (newRoom) => {
    setRoomCode(newRoom.RoomCode);
    setRoomURL(newRoom.RoomURL);
    window.location.replace(newRoom.RoomURL);
  };

  const generateRoomCode = () => {
		const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let code = "";
		for (let i = 0; i < 6; i++) {
			code += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return code;
	};
  
  const createRoom = async () => {
	  const code = generateRoomCode();
	  const url = `http://localhost:3000/?roomCode=${code}`; 
    /*const url = `https://groupwork.live/?roomCode=${code}`; */
	  
	  const newRoom = {
	    RoomCode: code,
	    RoomURL: url,
	  }

	  /* const csrfToken = Cookies.get('csrftoken'); */
	  
	  axios.post('http://127.0.0.1:8000/api/add_room/', newRoom, {
		headers: {
		"X-CSRFToken": Cookies.get("csrftoken"), 
		"Content-Type": "application/json",
		},
		
		withCredentials: true, 
	  })
      .then(response => {
        console.log("Room added: ", response.data);
        addRoom(newRoom);
      })
      .catch(error => {
        console.error("Error adding a room: ", error);
        alert("Error adding room.");
      });
    /*const updatedEvents = [...eventsArr, newEvent];
    setEventsArr(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));*/
    
  };
 // NEW - -
 const findRoom = async () => {
  if (!showFindInput) {
    setShowFindInput(true); // First click: show input field
    return;
  }
  // check following on second click
  const isValidCode = /^[a-zA-Z0-9]{6}$/.test(findCode);
  if (!isValidCode) {
    alert("Room code must be exactly 6 characters")
  }
  try {
    const roomDetails = await axios.get(`http://127.0.0.1:8000/api/rooms/${findCode}/`);
    const fetchedRoomID = roomDetails.data.RoomID;
    setRoomID(fetchedRoomID);
    setRoomCode(findCode);
    setRoomURL(`http://localhost:3000/?roomCode=${findCode}`);
    window.location.replace(`http://localhost:3000/?roomCode=${findCode}`);
  }catch(error) {
    alert("Must be valid room code");
  }
 };

 const logout = () => {
   window.location.replace("http://127.0.0.1:8000/logout");
 };

  return (
    
    <div className="App">
      <header className="App-header">
        <h1>Welcome to your Room & Board!</h1>
          {roomCode && (
          <div>
          <p><strong>Room Code:</strong> {roomCode}</p>
          <p><a href={roomURL} target="_blank" rel="noopener noreferrer">{roomURL}</a></p>
          </div>
          )}
        <div className="button-group">
          <button className="create-room" onClick={createRoom}>Create Room</button>
          <button className="find-room" onClick={findRoom}>Find Room</button>
          <button className="log-out" onClick={logout}>Sign Out</button>
      </div>

      {showFindInput && (
        <input
          type="text"
          value={findCode}
          onChange={(e) => setFindCode(e.target.value)}
          placeholder="Enter 6 character room code"
          className="find-input"
        />
      )}
	  </header>
{/* */}
	  <main style={{ display: roomCode ? 'block' : 'none'}}>
		<Calendar
      calActiveDay={activeDay} calSetActiveDay={setActiveDay}
      eventsArr={eventsArr.filter(event => Number(event?.RoomID) === Number(roomID))}
      tasksArr={tasks.filter(event => Number(event?.RoomID) === Number(roomID))}
      addEvent={addEvent}
      addTask={addTask}
      deleteEventAndTask={deleteEventAndTask}
    />
		<Todo tasks={tasks} addTask={addTask} deleteEventAndTask={deleteEventAndTask}/>
		<Studyroom activeDay={activeDay} setActiveDay={setActiveDay} month={month} setMonth={setMonth} year={year} setYear={setYear} />
    <Scheduler />
	  </main>	
    </div>
  );
  
}

export default App;
