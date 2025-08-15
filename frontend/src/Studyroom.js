import React, { useState, useEffect } from 'react';
import './Studyroom.css';

const Studyroom = ({ activeDay, setActiveDay, month, setMonth, year, setYear }) => {
	const days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const [capacity, setCapacity] = useState("1");

	// Handle capacity change
	const onOptionChange = (e) => {
		setCapacity(e.target.value);
	};

	const [imageKey, setImageKey] = useState(Date.now());
	// Use Effect to trigger Puppeteer request
	useEffect(() => {
		if (activeDay && capacity) {
			const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${activeDay.toString().padStart(2, '0')}`;

			const fetchData = async () => {
				try {
					const response = await fetch(`http://localhost:5000/scrape?date=${formattedDate}&capacity=${capacity}`);
					const data = await response.json();
					console.log("Scraped data:", data);
					setImageKey(Date.now());
				} catch (error) {
					console.error("Error fetching data:", error);
				}
			};

			fetchData();
		}
	}, [capacity, activeDay, month, year]);  // Trigger the effect when these values change

	const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${activeDay.toString().padStart(2, '0')}`;

	return (
		<div className="outer" >
			<div className="main">
				<div className="top-section">

					<div className="date-box">Rooms Available On {formattedDate}</div>

					<div className="room-size">
						<h2>Select Capacity</h2>
						<div className="radio-buttons">
							<input type="radio" name="capacity" value="1" id="1+" onChange={onOptionChange} />
							<label htmlFor="1">1+</label>

							<input type="radio" name="capacity" value="2" id="2+" onChange={onOptionChange} />
							<label htmlFor="2">2+</label>

							<input type="radio" name="capacity" value="4" id="4+" onChange={onOptionChange} />
							<label htmlFor="4">4+</label>

							<input type="radio" name="capacity" value="6" id="6+" onChange={onOptionChange} />
							<label htmlFor="6">6+</label>

							<input type="radio" name="capacity" value="8" id="8+" onChange={onOptionChange} />
							<label htmlFor="8">8+</label>

							<input type="radio" name="capacity" value="10" id="10+" onChange={onOptionChange} />
							<label htmlFor="10">10+</label>
						</div>
					</div>
				</div>
				<div className="image-container">
					<img
						key={imageKey}
						src={`http://localhost:5000/static/roomList.png?key=${imageKey}`}
						alt="Room List"
						className="room-list-image"
					/>

				</div>
				<button className = "scr-up" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}> Scroll to your Calendar</button>
			</div>
		</div >
	);
};

export default Studyroom;