const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'garage-dashboard',
  password: '123123',
  port: 5432,
})

module.exports = {
    pool
}