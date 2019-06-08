// imports
// import sqlite3 from 'sqlite3';
// import fs from 'fs';

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs'); 

let db;

const script_base_path = './db/queries/';

connect_db = function connect_db() {
  // Connect to database, or create if it does not exist
  db = new sqlite3.Database('./db/database.db');
  let query = '';
  // query = `CREATE TABLE test(name text)`
}
module.exports.connect_db = connect_db;

disconnect_db = function() {
  // close the database connection
  db.close();
}




module.exports.createTables = function() {
  runQuery('createTables.sql', function(){});
}

module.exports.dropTables = function() {
  runQuery('dropTables.sql', function(){});
}

module.exports.seedTables = function() {
  runQuery('seedTables.sql', function(){});
}


function runQuery(qry, callback) {
  //connect_db();


  // can add protection against SQL injection here. Sanatize input qry string.
  qry = qry.trim();
  if (qry.endsWith('.sql')) {
    qry = readFile(script_base_path + qry).trim();
  }

  var qry_arr = qry.split('---');
  var data = [];

  db.serialize(function() {
    qry_arr.forEach(qry => { 
      //console.log(qry);
      
      db.each(qry.trim(), function(err, row) {
        if (err) {
          return console.log("Error executing: " + qry + "\n" + err.message + '\n');
        }

        // collect rows as data
        data.push(row);

      }, function() {
        callback(data);
        //disconnect_db();
      });
      
    });
  });
}

module.exports.runQuery = runQuery;

// used to read query from .sql file
function readFile(file_path) {
  return fs.readFileSync(file_path, 'utf8', function(err, data) {  
    if (err) throw err;
    console.log(data);
  });
}




