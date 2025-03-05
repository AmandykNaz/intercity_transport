const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'intercity_transport',
  password: '939597',
  port: 5432,
});

module.exports = pool;
