import './App.css';
import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import Todo from './Todo';
import Studyroom from './Studyroom';

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


  const addEvent = (event) => {
    const updatedEvents = [...eventsArr, event];
    setEventsArr(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    addTask(event.events[0].title);
  };


  const deleteEventAndTask = (eventToDelete, taskIndex) => {
    if (eventToDelete) {
      //removing event from eventsArr
      setEventsArr((eventsArr) => eventsArr.filter((event) => event !== eventToDelete));

      // finding corresponding task in tasks and removing it
      const taskToDelete = eventToDelete.events[0].title;
      setTasks((tasks) => tasks.filter((task) => task !== taskToDelete));
    } else {
      // removing task from tasks
      const taskToDelete = tasks[taskIndex];
      setTasks((tasks) => tasks.filter((_, i) => i !== taskIndex));

      // removing corresponding event from eventsArr
      setEventsArr((eventsArr) => eventsArr.filter((event) => event.events[0].title !== taskToDelete));
    }
  };

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <main>
        <Calendar eventsArr={eventsArr} addEvent={addEvent} deleteEventAndTask={deleteEventAndTask} activeDay={activeDay} setActiveDay={setActiveDay} month={month} setMonth={setMonth}
          year={year} setYear={setYear} />
        <Todo tasks={tasks} addTask={addTask} deleteEventAndTask={deleteEventAndTask} />
        <Studyroom activeDay={activeDay} setActiveDay={setActiveDay} month={month} setMonth={setMonth} year={year} setYear={setYear} />
      </main>
    </div>
  );
}

export default App;
