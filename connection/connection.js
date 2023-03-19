const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mindybear",
    database: "company_db"

});

module.exports = db;