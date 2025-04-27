import React, { useState } from 'react';
import './Todo.css'; 



const Todo = ({ tasks, addTask, deleteEventAndTask, subitems, setSubitems }) => {

  const [taskInput, setTaskInput] = useState("");

  

  const addNewTask = () => {
    if (taskInput.trim()) {
      addTask(taskInput);
      setTaskInput("");
    }
  };

  const addSubitem = (taskName) => {
    const subitemInput = prompt("Enter subitem:");
    if (subitemInput && subitemInput.trim()) {
      setSubitems((prevSubitems) => {
        const updatedSubitems = { ...prevSubitems };

        if (!updatedSubitems[taskName]) {
          updatedSubitems[taskName] = [];
        }

        if (!updatedSubitems[taskName].includes(subitemInput.trim())) {
          console.log("Adding subitem:", subitemInput.trim(), "to task name:", taskName);
          updatedSubitems[taskName].push(subitemInput.trim());
        }
        
        return updatedSubitems;
      });
    }
  }

  const deleteSubitem = (taskName, subitemIndex) => {
    setSubitems((prevSubitems) => {
      const updatedSubitems = { ...prevSubitems };

      console.log("Deleting subitem at index:", subitemIndex, "from task name:", taskName);
      updatedSubitems[taskName] = updatedSubitems[taskName].filter(
        (_, index) => index !== subitemIndex
      );


      if (updatedSubitems[taskName].length === 0) {
        delete updatedSubitems[taskName];
      }
      return updatedSubitems;
    });
  }


  return (
    <div className="outer">
      <div className="left">
        <h2>Todo List</h2>
        <input 
          type="text" 
          value={taskInput} 
          onChange={(e) => setTaskInput(e.target.value)} 
          placeholder="Add a new task" 
        />
        <button onClick={addNewTask}>Add Task</button>
        <ul>
          {tasks.map((task, index) => {
            return (
              <li key={index} style={{ marginBottom: '15px' }}>
                <div className="task-grouping">
                  <span className="task-text">{task}</span>
                  
                  <button className="task-buttons" onClick={() => addSubitem(task)} id="Subitem-Button">Add Subitem</button>
                  
                  
                  <button className="task-buttons" onClick={() => deleteEventAndTask(null, index)}>Delete Task</button>
                  
                </div>
                {subitems[task] && (
                  <ul className="subitems">
                    {subitems[task].map((subitem, subitemIndex) => (
                      <li key={subitemIndex}>
                        <span>{subitem}</span>
                        <button onClick={() => deleteSubitem(task, subitemIndex)}>Delete Subitem</button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="right">
        {/* Additional content can go here */}
      </div>
    </div>
  );

};

export default Todo;