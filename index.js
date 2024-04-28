require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const customerRoutes = require('./routes/customerRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

app.use(cors())
const bodyParser = require('body-parser')

const helmet = require('helmet');
app.use(helmet());

const port = 3333
const db = require('./queries')
const { local_pool_config, global_pool_config } = require('./db_config')

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)




app.get('/', (request, response) => {
    response.json({ info: `Node.js, Express, and Postgres API`, tets: global_pool_config })
})

// app.get('/users', db.getUsers)
// app.get('/users/:id', db.getUserById)
// app.post('/users', db.createUser)
// app.put('/users/:id', db.updateUser)
// app.delete('/users/:id', db.deleteUser)



// Customer Routes
app.use('/api/customers', customerRoutes);

// Employee Routes
// app.use('/api/employees', employeeRoutes);


app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});
app.use((req, res, next) => {
    const error = new Error('Something went wrong');
    console.log(error);
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

