import React, { useState } from 'react';
import './Todo.css'; 



const Todo = ({ tasks, addTask, deleteEventAndTask }) => {

  const [taskInput, setTaskInput] = useState("");

  

  const addNewTask = () => {
    if (taskInput.trim()) {
      addTask(taskInput);
      setTaskInput("");
    }
  };


  return (
    <div className="outer">
      <div className="left">
        <h2>To-Do List</h2>
        <input 
          type="text" 
          value={taskInput} 
          onChange={(e) => setTaskInput(e.target.value)} 
          placeholder="Add a new task" 
        />
        <button onClick={addNewTask}>Add Task</button>
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              <span>{task}</span>
              <button onClick={() => deleteEventAndTask(null, index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="right">
        {/* Additional content can go here */}
      </div>
    </div>
  );

};

export default Todo;