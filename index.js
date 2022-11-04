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

// Gets all spots and their availabilities, returns a list of spots in form {id: someId, isOpen, whether or not spot is open}
app.get('/spots', function(req, res) {
    pool.query('SELECT * FROM Spot', (error, rows) => {
        if (error) {
            res.json(error)
        } else {
            const rowJson = rows.map(spot => {
                return {id: spot.SpotId, isOpen: !!spot.Open}
            });
            res.json(rowJson)
            console.log(rows)
        } 
    });
})

// Sets a spot as open or not open, takes input in form {isOpen: true/false}, returns in form {id: id of changed spot, isOpen: new isOpen value}
app.put('/spots/:id/set-open-state', function(req, res) {
    const isOpenToNumber = req.body.isOpen === true ? 1: 0
    pool.query("UPDATE Spot SET Open = ? WHERE SpotId = ?", [isOpenToNumber, parseInt(req.params.id)], (error, rows) => {
        if (error) {
            res.json(error)
        } else {
            const updatedSpot = {id: req.id, isOpen: req.body.isOpen}
            res.json(updatedSpot)
            console.log(updatedSpot)
        }
    })
})

// Returns all users with given id
// returns in form 
// [{
//     id: someId, 
//     username: someUsername, 
//     password: somePassword, 
//     firstName: someFirstName, 
//     lastName: someLastName, 
//     email: someEmail, 
//     allowStairs: 0 or 1, 
//     colorTheme: someTheme
// }]
// or [] if there are not users with given id
app.get('/user/:id/', function(req, res) {
    pool.query("SELECT * FROM User WHERE UserId = ?", [parseInt(req.params.id)], (error, rows) => {
        if (error) {
            res.json(error)
        } else {
            const rowJson = rows.map(user => {
                return {
                    id: user.UserId, 
                    username: user.Username, 
                    password: user.Password,
                    firstName: user.FirstName,
                    lastName: user.LastName,
                    email: user.Email,
                    allowStairs: user.AllowStairs,
                    colorTheme: user.ColorTheme
                }
            });
            res.json(rowJson)
            console.log(rows)
        }
    });
})

// Returns all users with given username, 
// returns in form 
// [{
//     id: someId, 
//     username: someUsername, 
//     password: somePassword, 
//     firstName: someFirstName, 
//     lastName: someLastName, 
//     email: someEmail, 
//     allowStairs: 0 or 1, 
//     colorTheme: someTheme
// }]
// or [] if there are not users with given username
app.get('/user/by-username/:username', function(req, res) {
    pool.query("SELECT * FROM User WHERE Username = ?", [req.params.username.toString()], (error, rows) => {
        if (error) {
            res.json(error)
        } else {
            const rowJson = rows.map(user => {
                return {
                    id: user.UserId, 
                    username: user.Username, 
                    password: user.Password,
                    firstName: user.FirstName,
                    lastName: user.LastName,
                    email: user.Email,
                    allowStairs: user.AllowStairs,
                    colorTheme: user.ColorTheme
                }
            });
            res.json(rowJson)
            console.log(rows)
        }
    });
})

// Add a new user given input {username: someString, password: someString}, returns the id of the newly generated user in form {id: someId}
// If the user add fails due to a duplicate username detected than an error will be returned that looks like below:
// {
//     "code": "ER_DUP_ENTRY",
//     "errno": 1062,
//     "sqlMessage": "Duplicate entry someUsername for key 'Username'",
//     "sqlState": "23000",
//     "index": 0,
//     "sql": "INSERT INTO User (Username, Password) VALUES (someUsername, somePassword)"
// }
app.post('/user/add-new-user', function(req, res) {
    pool.query("INSERT INTO User (Username, Password) VALUES (?, ?)", [req.body.username, req.body.password], (error, rows) => {
        if (error) {
            res.json(error)
        } else {
            let insertedUser = {id: rows.insertId}
            res.json(insertedUser)
        }
    })
})

// Edits an existing user given input in form
// {
//     id: someId, 
//     username: someUsername, 
//     password: somePassword, 
//     firstName: someFirstName, 
//     lastName: someLastName, 
//     email: someEmail, 
//     allowStairs: 0 or 1, 
//     colorTheme: someTheme
// }
// returns number of affected rows in form {affectedRows: numAffectedRows}
app.put('/user/edit-user/:id', function(req, res) {
    pool.query("UPDATE User SET Username = ?, Password = ?, FirstName = ?, LastName = ?, Email = ?, AllowStairs = ?, ColorTheme = ? WHERE UserId = ?",
        [
            req.body.username, 
            req.body.password, 
            req.body.firstName, 
            req.body.lastName, 
            req.body.email, 
            parseInt(req.body.allowStairs), 
            req.body.colorTheme,
            parseInt(req.params.id)
        ], (error, rows) => {
        if (error) {
            res.json(error)
        } else {
            let affectedRows = {affectedRows: rows.affectedRows}
            res.json(affectedRows)
        }
    })
})

// Edits an existing user given input in form
// {
//     id: someId, 
//     firstName: someFirstName, 
//     lastName: someLastName, 
//     email: someEmail, 
// }
// returns number of affected rows in form {affectedRows: numAffectedRows}
app.put('/user/edit-user-profile/:id', function(req, res) {
    pool.query("UPDATE User SET FirstName = ?, LastName = ?, Email = ? WHERE UserId = ?",
        [ 
            req.body.firstName, 
            req.body.lastName, 
            req.body.email, 
            parseInt(req.params.id)
        ], (error, rows) => {
        if (error) {
            res.json(error)
        } else {
            let affectedRows = {affectedRows: rows.affectedRows}
            res.json(affectedRows)
        }
    })
})

app.listen(port);
console.log(`Server is listening on port: ${port}`)
