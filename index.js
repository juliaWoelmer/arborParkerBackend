const express = require('express');
const app = express();
const mysql = require('mysql');

const port = process.env.port || 3000;

const connection = mysql.createConnection({
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'b6f903096096fe',
    password: '7a0c4b01',
    database: 'heroku_a69b82598923256'
});

app.get('/', function(req, res) {
    res.send('Hello world')
})

app.get('/spots', function(req, res) {
    connection.query('SELECT * FROM Spot', (error, rows) => {
        if (error) throw error;
        
        const rowJson = rows.map(spot => {
            return {id: spot.SpotId, isOpen: spot.Open}
        });
        res.json(rowJson);
        console.log(rows);
    });
})

app.listen(port);
console.log(`Server is listening on port: ${port}`)

