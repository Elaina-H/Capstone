import './App.css';
import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import Todo from './Todo';
import Studyroom from './Studyroom';
import axios from 'axios';
import Cookies from 'js-cookie';


function App() {

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
  

  // saving task strings to local storage, updating when "tasks" changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // saving event objects to local storage, updating when "eventsArr" changes
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(eventsArr));
  }, [eventsArr]);

    // TEST    
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const userIDFromUrl = params.get('RoomCode');
      if (userIDFromUrl) {
        setRoomCode(userIDFromUrl);
        fetchEventsForUser(userIDFromUrl); // Fetch events for the user if userID exists
      }
    }, []);
  
    // Fetch events from backend based on userID
    const fetchEventsForUser = async (RoomCode) => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/fetch_events/${RoomCode}/`);
        const userEvents = response.data; // Assuming this returns the user's events
        setEventsArr(userEvents);
        localStorage.setItem("events", JSON.stringify(userEvents));
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    // END TEST




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
    addTask(event.EventName);
    
    // addTask(event.events[0].title);
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
  
  const addRoom = (newRoom) => {
    setRoomCode(newRoom.RoomCode);
    setRoomURL(newRoom.RoomURL);
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
	  const url = `https://groupwork.live/?roomCode=${code}/`;
	  
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


  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome User!</h1>
          {roomCode && (
          <div>
          <p><strong>Room Code:</strong> {roomCode}</p>
          <p><a href={roomURL} target="_blank" rel="noopener noreferrer">{roomURL}</a></p>
          </div>
          )}
		<button className="create-room" onClick={createRoom}>Create Room</button>
	  </header>

	  <main>
		<Calendar eventsArr={eventsArr} addEvent={addEvent} deleteEventAndTask={deleteEventAndTask}/>
		<Todo tasks={tasks} addTask={addTask} deleteEventAndTask={deleteEventAndTask}/>
		<Studyroom />
	  </main>	
    </div>
  );
  
}

export default App;
