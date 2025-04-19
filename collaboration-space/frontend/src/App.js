import './App.css';
import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import Todo from './Todo';
import Studyroom from './Studyroom';
import axios from 'axios';


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

    if (eventToDelete?.event_id) {
      // Refer to backend
      await deleteEventfromBackend(eventToDelete.event_id);
  
      // Remove event from state
      setEventsArr((prevEvents) =>
        prevEvents.filter((event) => event.event_id !== eventToDelete.event_id)
      );
  
      // Remove matching task (by title)
      const taskToDelete = eventToDelete.EventName;
      setTasks((prevTasks) => prevTasks.filter((task) => task !== taskToDelete));
    } else {
      // Delete task by index only (fallback)
      
      const taskToDelete = tasks[taskIndex];
      setTasks((prevTasks) => prevTasks.filter((_, i) => i !== taskIndex));
      
      // Remove event with matching title
      setEventsArr((prevEvents) =>
        prevEvents.filter((event) => event.EventName !== taskToDelete)
      );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
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
