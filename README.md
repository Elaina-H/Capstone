# Capstone
## Goal
Our group wanted to make an educational tool for students that combined the functions of existing productivity management concepts into a single streamlined interface. Students are tired of swapping back and forth on their personal calendar, schedular, to-do list, email, agile timeline, etc. The differences between platforms also make swapping back and forth a headache. We wanted to make a UI that was simple and consistent for all of these tools. We also had a development goal of making a site that was scalable and collaborative, so that more than one person could work on features and those features could be added or removed without breaking the rest of the components (excluding the calendar). 
## Functional Requirements
- Calendar
- To-Do List
- Visualization of To-Do List Dependancies
- List of Available Study Rooms in Edmon Low Library
## Non-Functional Requirements
- Password-Protected secure room
- Collaboration for up to 10 people
## Project Setup
- Terminal 1 in frontend>src must have installed: python, node.js, django. Then run "npm start" on command line
- Terminal 2 in backend: (1) npm install puppeteer (2) npm run server.js
- Terminal 3: run SQL server. Not required for all users as long as one is running.
## Future Goals
- Migrate SQL database to a secure private server to allow access at any time.
- Deploy code to an external domain to allow easier demonstration and use.
- Add additional functions to the site, including chat posts and a group scheduler.
- Improve state management through react to make it easier to add components and ensure proper display of events.
## Current Bugs to fix
- Tasks and Events sometimes un-sync and do not delete together.
- Database is difficult to manage due to access settings set by Azure. Possible migration to MySQL over msSQL. 
