const mysql = require("promise-mysql");
const config = require("./../config")

var connection = mysql.createconnection({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database
});

const getConnection=() => {
	return connection;
};

module.exports = {
	getConnection
};