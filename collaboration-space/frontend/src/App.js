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
  
  const addTask = (task) => {
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  
  const addEvent = async (event) => {
    const updatedEvents = [...eventsArr, event];
    setEventsArr(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    addTask(event.EventName);
    // addTask(event.events[0].title);
    

    // try {
    //   // Send the event to the backend to store it in the database
    //   const response = await fetch('http://127.0.0.1:8000/api/add_event/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(event.eventName),
    //   });
  
    //   if (!response.ok) {
    //     throw new Error('Failed to save event to the database');
    //   }
  
    //   const savedEvent = await response.json();
  
    //   // Update the local state with the newly saved event
    //   const updatedEvents = [...eventsArr, savedEvent];
    //   setEventsArr(updatedEvents);
  
    //   // Add the task based on the event title
    //   addTask(savedEvent.title);
    //   console.log("saved event: ", savedEvent.title);
    //   localStorage.setItem("events", JSON.stringify(updatedEvents));
    // } catch (error) {
    //   console.error('Error adding event:', error);
    // }
  };


  // const deleteEventAndTask = (eventToDelete, taskIndex) => {
  //   if (eventToDelete) {
  //     //removing event from eventsArr
  //     setEventsArr((eventsArr) => eventsArr.filter((event) => event !== eventToDelete));

  //     // finding corresponding task in tasks and removing it
  //     const taskToDelete = eventToDelete.events[0].title;
  //     setTasks((tasks) => tasks.filter((task) => task !== taskToDelete));
  //   } else {
  //     // removing task from tasks
  //     const taskToDelete = tasks[taskIndex];
  //     setTasks((tasks) => tasks.filter((_, i) => i !== taskIndex));

  //     // removing corresponding event from eventsArr
  //     setEventsArr((eventsArr) => eventsArr.filter((event) => event.events[0].title !== taskToDelete));
  //   }
  // };

  const deleteEventAndTask = (eventToDelete, taskIndex) => {
    if (eventToDelete) {
      // Remove event from state
      setEventsArr((prevEvents) =>
        prevEvents.filter(
          (event) =>
            !(
              event.EventName === eventToDelete.EventName &&
              event.Day === eventToDelete.Day &&
              event.Month === eventToDelete.Month &&
              event.Year === eventToDelete.Year &&
              event.TimeFrom === eventToDelete.TimeFrom &&
              event.TimeTo === eventToDelete.TimeTo
            )
        )
      );
  
      // Remove matching task (by title)
      const taskToDelete = eventToDelete.EventName;
      setTasks((prevTasks) => prevTasks.filter((task) => task !== taskToDelete));
    } else {
      // Delete by index (task only)
      const taskToDelete = tasks[taskIndex];
      setTasks((prevTasks) => prevTasks.filter((_, i) => i !== taskIndex));
  
      // Remove the event that matches the task name
      setEventsArr((prevEvents) =>
        prevEvents.filter((event) => event.EventName !== taskToDelete)
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
	}
  
  const createRoom = async () => {
	  const code = generateRoomCode();
	  const url = `https://groupwork.live/${code}/`;
	  
	  const newRoom = {
	    RoomCode: code,
	    RoomURL: url,
	  };

	  const csrfToken = Cookies.get('csrftoken');
	  
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
