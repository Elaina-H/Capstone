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

  const [dragContext, setDragContext] = useState(null); 
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [connectingFrom, setConnectingFrom] = useState(null);
  const [connections, setConnections] = useState([]);

  const [draggingFrom, setDraggingFrom] = useState(null);  
  const [draggingConnection, setDraggingConnection] = useState(null);

  useEffect(() => {
    console.log("Saving canvasItems to localStorage", Array.isArray(canvasItems), canvasItems);
    if (canvasItems.length > 0) {
      localStorage.setItem('canvasItems', JSON.stringify(canvasItems));
    }
    // localStorage.setItem('canvasItems', JSON.stringify(canvasItems));
  }, [canvasItems]);
  
  useEffect(() => {
    console.log("Saving connections to localStorage", connections);
    if (connections.length > 0) {
      localStorage.setItem('connections', JSON.stringify(connections));
    }
  }, [connections]);

  // save items in canvas to local storage.
  useEffect(() => {
    const savedItems = localStorage.getItem('canvasItems');
    const savedConnections = localStorage.getItem('connections');
    
    if (savedItems) setCanvasItems(JSON.parse(savedItems));
    if (savedConnections) setConnections(JSON.parse(savedConnections));
  }, []);
  

  const addNewTask = () => {
    if (taskInput.trim()) {
      const newTask = {
        text: taskInput,
        x: 50,
        y: 50
      };
      addTask(newTask); //add task to array for display
      setCanvasItems((prev) => {
        const updated = [...prev, newTask];
        localStorage.setItem('canvasItems', JSON.stringify(updated));
        return updated;
      });
      setTaskInput("");
    }
  };
  

  // Create panning or task movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragContext === null) return;
      
      // if moving the canvas - 
      if (dragContext === 'canvas') {
        const canvas = document.getElementById('canvas');

        if (canvas) {
          canvas.style.left = `${e.clientX - dragOffset.x}px`;
          canvas.style.top = `${e.clientY - dragOffset.y}px`;
        }
      }
      // else if moving the tasks -
      else if (typeof dragContext === 'number') {
        setCanvasItems((prev) => {
          const updated = [...prev];
          updated[dragContext] = {
            ...updated[dragContext],
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y,
          };
          console.log("CanvasItems after move:", updated);
          return updated;
        });
      }
    };
    
    // release click
    const handleMouseUp = (e) => {
      if (connectingFrom) {
        // Get mouse position relative to canvas
        const canvasRect = document.getElementById('canvas').getBoundingClientRect();
        const mouseX = e.clientX - canvasRect.left;
        const mouseY = e.clientY - canvasRect.top;
    
        // Add connection based on mouse position
        setConnections((prev) => [...prev, {
          from: connectingFrom,
          to: { x: mouseX, y: mouseY }
        }]);
      }
    
      // Reset dragging context
      setConnectingFrom(null);
      setDraggingConnection(null);
      setDragContext(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragContext, dragOffset, canvasItems, connectingFrom]);

  // handle when the mouse is clicked on the canvas
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

    setCanvasItems((prev) => {
      const updated = [...prev, droppedBox];
      // console.log("Updated canvasItems:", updated);
      return updated;
    });
  };

  // What happens when user clicks node
  const handleNodeMouseDown = (e, index, side) => {
    e.stopPropagation();
    
    const rect = e.target.getBoundingClientRect();
    setDraggingFrom({ index, side });
  
    setDraggingConnection({
      x1: rect.left + rect.width / 2,
      y1: rect.top + rect.height / 2,
      x2: rect.left + rect.width / 2,
      y2: rect.top + rect.height / 2
    });
  
    window.addEventListener("mousemove", handleMouseMoveWhileDragging);
    window.addEventListener("mouseup", handleMouseUpAfterDragging);
  };
  
  // 
  const handleMouseMoveWhileDragging = (e) => {
    if (!draggingConnection) return;
  
    setDraggingConnection((prev) => ({
      ...prev,
      x2: e.clientX,
      y2: e.clientY,
    }));
  };

  const handleMouseUpAfterDragging = (e) => {
    window.removeEventListener("mousemove", handleMouseMoveWhileDragging);
    window.removeEventListener("mouseup", handleMouseUpAfterDragging);
  
    if (!draggingFrom) {
      setDraggingConnection(null);
      return;
    }
  
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
  
    let targetNode = null;
    for (let el of elements) {
      if (el.classList.contains("node")) {
        targetNode = el;
        break;
      }
    }
  
    if (targetNode) {
      const toIndex = parseInt(targetNode.dataset.index, 10);
      const toSide = targetNode.dataset.side;
  
      setConnections((prev) => [
        ...prev,
        { 
          from: draggingFrom, 
          to: { index: toIndex, side: toSide } 
        }
      ]);
    }
  
    setDraggingFrom(null);
    setDraggingConnection(null);
  };
  
  // Clear canvas
  const clearCanvas = () => {
    // Remove canvasItems and connections from localStorage
    localStorage.removeItem('canvasItems');
    localStorage.removeItem('connections');
    
    // Reset the canvas state
    setCanvasItems([]);  // Clear canvas items
    setConnections([]);   // Clear connections
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
        {/* Clear Canvas Button */}
        <button 
            onClick={clearCanvas} 
            className="clear button"
            style={{
              position: "absolute", 
              top: "5px",   // 20px from the top
              right: "5px", // 20px from the right
              zIndex: 10,    
              padding: "10px 15px",
              backgroundColor: "transparent",
              color: "black",
              border: "none",
              borderRadius: "5px",
              fontSize: "30px",
              cursor: "pointer"
            }}
          >
            ⎚
          </button> 
        <div id="canvas"
          onMouseDown={handleCanvasMouseDown}
          onDragOver={(e) => e.preventDefault()}
          onDrop = {handleDrop}
          style={{ 
            width: "3000px", 
            height: "3000px", 
            position: "relative", 
            backgroundImage: "radial-gradient(#333 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }} 
        >
          {/* lines connecting nodes */}
          <svg 
            style={{ 
              position: "absolute", 
              top: 0, 
              left: 0, 
              width: "100%", 
              height: "100%", 
              pointerEvents: "none" 
            }}
          >
            {connections.map((conn, idx) => {
              const from = canvasItems[conn.from.index];
              let toX, toY;
              
              // Check if the destination is a node or free position
              if (conn.to.x !== undefined && conn.to.y !== undefined) {
                toX = conn.to.x; // Free placement
                toY = conn.to.y;
              } else {
                const to = canvasItems[conn.to.index];
                toX = to.x + (conn.to.side === 'left' ? 0 : 100);
                toY = to.y + 10;
              }

              const fromX = from.x + (conn.from.side === 'left' ? 0 : 100);
              const fromY = from.y + 10;

              return (
                <line
                  key={idx}
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="black"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}

          {draggingConnection && (
            <line
              x1={draggingConnection.x1}
              y1={draggingConnection.y1}
              x2={draggingConnection.x2}
              y2={draggingConnection.y2}
              stroke="black"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
          )}
          {/* Define arrowhead marker */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 7 3.5, 0 7" fill="black" />
            </marker>
          </defs>
        </svg>

          
          {/* canvas items - text boxes*/}
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
                cursor: "grab",
                alignItems: "center",
                display: "flex"
              }}
            >
              <div 
                className="node left-node"
                data-index={index}
                data-side="left"
                onMouseDown={(e) => handleNodeMouseDown(e, index, "left")}
              ></div>
              {/* {item.text} */}
              <span style={{ margin: "0 8px" }}>{item.text}</span>

              <div 
                className="node right-node"
                data-index={index}
                data-side="right"
                onMouseDown={(e) => handleNodeMouseDown(e, index, "right")}
              ></div>
            </div>
          ))}
        </div>
        {/* Additional content can go here */}
        
      </div>
    </div>
  );

};

export default Todo;