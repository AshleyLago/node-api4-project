const express = require('express')
const cors = require('cors')
const server = express()

require('dotenv').config()

server.use(express.json())
server.use(cors())

const usersData = process.env.USERS || []

// Returns an array users.  
server.get('/api/users', (req, res, next) => {
    try {
        res.status(200).json(usersData)
    } catch (error) {
        next(error)
    }
})

// Creates a user from { username, password } in the `request body`, responds with newly created user.
server.post('/api/register', (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) {
        next({ status:400, message: "Both username and password are required" })
    }
    const dupeUser = usersData.find(user => user.username === username)
    if (dupeUser) {
        next({ status:409, message: "That username already exists" })
    }
    const newUser = {
        id: (usersData.length + 1 ),
        username,
        password
    }
    usersData.push(newUser)
    res.status(201).json(newUser)
})

//Checks { username, password } in the `request body`, responds with a welcome message.
server.post('/api/login', (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) {
        next({ status:400, message: "Both username and password are required" })
    }
    const user = usersData.find(user => user.username === username && user.password === password)
    if (!user) {
        next({ status:401, message: "Invalid username and/or password" })
    }
    res.status(200).json({message: `Login successful. Welcome ${username}!`})
})

server.use((error, req, res, next) => {
    res.status(error.status || 500).json({ message: error.message })
})


const port = (process.env.PORT || 4000)

server.listen(port, () => {
    console.log(`listening on port ${port}`)
})