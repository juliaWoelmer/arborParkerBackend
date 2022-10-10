const express = require('express');
const app = express();
const mysql = require('mysql');

const port = process.env.PORT || 3000;

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME
});

connection.connect()

app.get('/', function(req, res) {
    res.send('Hello world')
})

app.get('/spots', function(req, res) {
    connection.query('SELECT * FROM Spot', (error, rows) => {
        if (error) throw error;
        
        const rowJson = rows.map(spot => {
            return {id: spot.SpotId, isOpen: !!spot.Open}
        });
        res.json(rowJson);
        console.log(rows);
    });
})

app.listen(port);
console.log(`Server is listening on port: ${port}`)

