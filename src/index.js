var express = require('express');
var app = express();
var morgan = require('morgan');

// Direccion de puertos
var puerto_direccion = 8093;

// settings
app.set('port', process.env.PORT || puerto_direccion);
app.set('json spaces', 2);

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// routes
app.use(require('./routes/index'));
app.use(require('./routes/llaves'));


// Iniciando el servidor
app.listen(app.get('port'), () =>{
	console.log(`Server on port ${app.get('port')}`);
});