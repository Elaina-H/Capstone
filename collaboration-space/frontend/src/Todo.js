import React, { useState, useEffect } from 'react';
import './Todo.css'; 



const Todo = ({ tasks, addTask, deleteEventAndTask }) => {

  const [taskInput, setTaskInput] = useState("");

  const addNewTask = () => {
    if (taskInput.trim()) {
      addTask(taskInput);
      setTaskInput("");
    }
  };

  // Create panning movement for visual todo 
  useEffect(() => {
    const canvas = document.getElementById('canvas');
    if (!canvas) {
      console.error('Canvas not found!');
      return;
    }

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    // On click
    const mouseDown = (e) => {
      isDragging = true;
      offsetX = e.clientX - canvas.offsetLeft;
      offsetY = e.clientY - canvas.offsetTop;
      canvas.style.cursor = 'grabbing';
    };

    // mouse movement
    const mouseMove = (e) => {
      if (isDragging) {
        canvas.style.left = `${e.clientX - offsetX}px`;
        canvas.style.top = `${e.clientY - offsetY}px`;
      }
    };

    // Release click
    const mouseUp = () => {
      isDragging = false;
      canvas.style.cursor = 'grab';
    };

    canvas.addEventListener('mousedown', mouseDown);
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);

    // Cleanup
    return () => {
      canvas.removeEventListener('mousedown', mouseDown);
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    };
  }, []);

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
      <div className="right" id="board">
        <div id="canvas"></div>
        {/* Additional content can go here */}
      </div>
    </div>
  );

};

export default Todo;