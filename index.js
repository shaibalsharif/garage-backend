const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()

app.use(cors())
const bodyParser = require('body-parser')

const helmet = require('helmet');
app.use(helmet());

const port = 3000
const db = require('./queries')
const { local_pool_config, global_pool_config } = require('./db_config')

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)



 
app.get('/', (request, response) => {
    response.json({ info: `Node.js, Express, and Postgres API` ,tets:global_pool_config})
})

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)


app.use((req, res, next) => {
    const error = new Error('Something went wrong');
    next(error);
});
// Error-handling Middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).send('Internal Server Error');
});


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

