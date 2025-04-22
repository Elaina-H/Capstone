import React, { useState, useEffect } from 'react';
import './Studyroom.css'; 

const Studyroom = () => {
	const days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	
	return (
		<div className="outer">
		   <div className="main">
		   <button className = "scr-up" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}> Scroll to Top</button>
		   </div>
		</div>
   );
};

export default Studyroom;