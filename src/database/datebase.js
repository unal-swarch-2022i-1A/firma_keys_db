const mysql = require("mysql");

var connection = mysql.createConnection({
	host: '127.0.0.1',
	port: '8093',
	user: 'root',
	password: 'swarch-2022i',
	database: 'fima_keys'
});

// connection.connect();