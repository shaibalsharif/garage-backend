const Pool = require('pg').Pool
const basic = {
  user: "postgres",
  host: 'localhost',
  database: 'garage-dashboard',
  password: '123123',
  port: '5432'
}
const local_pool_config = {
  user: process.env.LOCAL_USER,
  host: process.env.LOCAL_HOST,
  database: process.env.LOCAL_DATABASE,
  password: process.env.LOCAL_PASSWORD,
  port: 5432,//process.env.LOCAL_PORT, 
  ssl: {
    rejectUnauthorized: false,
    // If you want to use a custom CA certificate, provide its path
    // ca: fs.readFileSync('/path/to/custom/ca_certificate.pem')
  }
}
const global_pool_config = {
  user: process.env.GLOBAL_USER,
  host: process.env.GLOBAL_HOST,
  database: process.env.GLOBAL_DATABASE ,
  password: process.env.GLOBAL_PASSWORD,
  port: process.env.GLOBAL_PORT,
  ssl: {
    rejectUnauthorized: false,
    // If you want to use a custom CA certificate, provide its path
    // ca: fs.readFileSync('/path/to/custom/ca_certificate.pem')
  }
};

const pool = new Pool(
  /* basic)*/
  /*local_pool_config)*/
  global_pool_config)

module.exports = {
  pool
  , local_pool_config,
  global_pool_config
}

