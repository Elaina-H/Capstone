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
	    <section id = "CalendarSection">
		<Calendar />
		</section>
		<section id = "TodoSection">
		<Todo />
		</section>
		<Studyroom />
	  </main>	
    </div>
  );
}

export default App;
