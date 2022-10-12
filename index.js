const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const port = process.env.PORT || 3000

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DATABASE_HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME
});

app.get('/', function(req, res) {
    res.send('Welcome to the Arbor Parker server')
})

app.get('/spots', function(req, res) {
    pool.query('SELECT * FROM Spot', (error, rows) => {
        if (error) throw error
        
        const rowJson = rows.map(spot => {
            return {id: spot.SpotId, isOpen: !!spot.Open}
        });
        res.json(rowJson)
        console.log(rows)
    });
})

app.put('/spots/:id/set-open-state', function(req, res) {
    const isOpenToNumber = req.body.isOpen === true ? 1: 0
    pool.query(`UPDATE Spot SET Open = ${isOpenToNumber} WHERE SpotId = ${parseInt(req.params.id)}`, (error, rows) => {
        if (error) throw error
        
        const updatedSpot = {id: req.id, isOpen: req.body.isOpen}
        res.json(updatedSpot)
        console.log(updatedSpot)
    })
})

app.listen(port);
console.log(`Server is listening on port: ${port}`)

