/*Connect to the database*/
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());

const db  = mysql.createConnection({
  connectionLimit : 10,
  host: 'localhost',
  user: 'root',
  password: 'EduCapstone2025',
  database: 'eduboarddb',
  port: 3306
});

//test if there's an error connecting to mysql
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + db.threadId);
});

//display onto a webbrowser
app.listen(8081, ()=> {
    console.log("Listening");
})

//API endpoints
app.get('/data', (req, res) => {
    const sql = 'SELECT * FROM events';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    })
});