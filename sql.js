// connect with PostgresSQL
const pg = require('pg');

// Connect with mongo
const mongodb = require('mongodb');

mongodb.connect(process.env.Mongo_URL, function(err) {
  if (!err) {
    console.log('Mongo connected');
  } else {
    console.log('mongo failed to connect');
  }
});

// Database config
const config = {
  user: process.env.DB_user,
  database: process.env.DB,
  password: process.env.DB_password,
  host: process.env.DB_host,
  port: 5432,
  ssl: true,

  // extended attributes
  poolSize: 5,
  poolIdleTimeout: 30000,
  reapIntervalMillis: 10000,
};

const pool = new pg.Pool(config);

pool.connect(function(isErr, client, done) {
  if (isErr) {
    console.log(`Connect query:${isErr.message}`);
    return;
  }

  client.query('select now();', [], (err, rst) => {
    done();
    if (err) {
      console.log(`Query error:${isErr.message}`);
    } else {
      console.log(`Query success, data is: ${rst.rows[0].now}`);
    }
  });
});

const SQLQuery = function(sql, callback) {
  pool.query(sql, (err, res) => {
    callback(err, res);

    if (err) {
      console.error(err);
    }
  });
};

pool.on('error', err => console.log('error --> ', err));

pool.on('acquire', () => console.log('acquire Event'));

pool.on('connect', () => console.log('connect Event'));

module.exports = SQLQuery;
