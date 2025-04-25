import React, { useState, useEffect } from 'react';
import './Todo.css'; 

const Todo = ({ tasks, addTask, deleteEventAndTask }) => {

  // const [taskInput, setTaskInput] = useState("");

  // const addNewTask = () => {
  //   if (taskInput.trim()) {
  //     addTask(taskInput);
  //     setTaskInput("");
  //   }
  // };

  const [taskInput, setTaskInput] = useState("");
  const [canvasItems, setCanvasItems] = useState([]); // holds the items inside the canvas

  const addNewTask = () => {
    if (taskInput.trim()) {
      const newTask = {
        text: taskInput,
        x: 50,
        y: 50
      };
      addTask(newTask); 
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

  // Drag feature
  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(task));
  };

  // Drop feature
  const handleDrop = (e) => {
    e.preventDefault();
    console.log("dropped");

    const data = e.dataTransfer.getData("text/plain");
    const task = JSON.parse(data);
    const canvasRect = e.target.getBoundingClientRect();

    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    const droppedBox = {
      ...task,
      x,
      y
    };

    setCanvasItems((prev) => [...prev, droppedBox]);

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
              <span
                draggable
                onDragStart={(e)=> {
                  // handleDragStart(e, task)
                  e.dataTransfer.setData("text/plain", JSON.stringify(task));
                }}
              >
                {task.text}
              </span> 
              <button onClick={() => deleteEventAndTask(null, index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="right" id="board">
        <div id="canvas"
          onDragOver={(e) => e.preventDefault()}
          onDrop = {handleDrop}
          style={{ 
            width: "3000px", 
            height: "3000px", 
            position: "relative", 
            backgroundImage: "radial-gradiant(#333 1px, transparent 1px)",
            backgroundSize: "30px 30 px"
          }} 
        >
          {canvasItems.map((item, index) => (
            <div
              key={index}
              // onMouseDown={(e) => mouseDown(e, index)}
              style= {{
                position: "absolute",
                top: item.y,
                left: item.x,
                padding: "5px 10px",
                backgroundColor: "#ddd",
                borderRadius: "4px",
                cursor: "grab"
              }}
            >
              {item.text}
            </div>
          ))}
        </div>
        {/* Additional content can go here */}
        
      </div>
    </div>
  );

};

export default Todo;