import './App.css';
import React from 'react';
import Calendar from './Calendar';
import Todo from './Todo';
import Studyroom from './Studyroom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
	  <main>
		<Calendar />
		<Todo />
		<Studyroom />
	  </main>	
    </div>
  );
}

export default App;
