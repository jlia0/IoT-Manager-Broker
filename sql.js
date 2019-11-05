// connect with PostgresSQL
var pg = require('pg');


// Database config
var config = {
    user: "lrbpvsxktxpmux",
    database: "d3gaue7gl1u0k7",
    password: "6ba81d6d22a932fd4db6c60eb0b6d24dee146236811f504c63f3c8a5fea03062",
    host: "ec2-174-129-253-169.compute-1.amazonaws.com",
    port: 5432,
    ssl: true,

    // extended attributes
    poolSize: 5,
    poolIdleTimeout: 30000,
    reapIntervalMillis: 10000
}

var pool = new pg.Pool(config);


pool.connect(function (isErr, client, done) {
    if (isErr) {
        console.log('Connect query:' + isErr.message);
        return;
    }
    client.query('select now();', [], function (isErr, rst) {
        done();
        if (isErr) {
            console.log('Query error:' + isErr.message);
        } else {
            console.log('Query success, data is: ' + rst.rows[0].now);
        }
    })
});

var SQLQuery = function (sql, callback) {
    pool.query(sql, (err, res) => {
        callback(err, res);

        if (err) {
            console.log('Query error:', err.message);
        } else {
            //console.log('Query return:', res.rows);
        }
    });
};


pool.on("error", function (err, client) {
    console.log("error --> ", err)
});

pool.on('acquire', function (client) {
    //console.log("acquire Event")
});

pool.on('connect', function () {
    //console.log("connect Event")
});


module.exports = SQLQuery;