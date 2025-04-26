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
  const [dragContext, setDragContext] = useState(null); // null, 'canvas', or task index
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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

  // Create panning or task movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragContext === null) return;

      // else if moving the tasks
      if (typeof dragContext === 'number') {
        const updatedItems = [...canvasItems];
        updatedItems[dragContext] = {
          ...updatedItems[dragContext],
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        };
        setCanvasItems(updatedItems);
      }
    };
    
    // release click
    const handleMouseUp = () => {
      setDragContext(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragContext, dragOffset, canvasItems]);

  // click on canvas
  const handleCanvasMouseDown = (e) => {
    if (e.target.id !== 'canvas') return;
    const canvas = e.target;
    setDragContext('canvas');
    setDragOffset({
      x: e.clientX - canvas.offsetLeft,
      y: e.clientY - canvas.offsetTop,
    });
  };

  // click on task
  const handleTaskMouseDown = (e, index) => {
    const task = canvasItems[index];
    setDragContext(index);
    setDragOffset({
      x: e.clientX - task.x,
      y: e.clientY - task.y,
    });
  };

  // Drop feature onto canvas
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
          onMouseDown={handleCanvasMouseDown}
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
              onMouseDown={(e) => handleTaskMouseDown(e, index)}
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