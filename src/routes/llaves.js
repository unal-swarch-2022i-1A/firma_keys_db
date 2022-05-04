const { Router } = require('express');
const router = Router();
const _ = require('underscore');

const llaves = require('../ejemplo.json');

const NodeRSA = require('node-rsa');


function armar(datos){
	var mat = datos[1];
	for(var i = 2; i < datos.length && i != datos.length-1; i++){
		mat = mat + datos[i];
	}
	return mat
}

// routes - rutas
router.get('/key', (req,res) => {
	res.json(llaves);
});

router.post('/newkey/:id', (req, res) => {
	const key = new NodeRSA({b: 128});
	var { id } = req.params;
	var public = armar(key.exportKey('public').split('\n'));
	var private = armar(key.exportKey('private').split('\n'));
	
	// var { id, public, private } = req.body;
	// console.log(typeof(id), " | ", typeof(public), " | ", typeof(private));
	// console.log(id, "\n", public, "\n", private);
	
	if (id && !isNaN(id)){
		const newkey = {"id": parseInt(id), "public": public, "private": private};
		// console.log(newkey);
		llaves.push(newkey);
		res.json(newkey);
	} else {
		res.status(500).json({error: "There was an error."});
	}
});

router.put('/update/:id', (req, res) => {

	const key = new NodeRSA({b: 128});
	var { id } = req.params;
	var public = armar(key.exportKey('public').split('\n'));
	var private = armar(key.exportKey('private').split('\n'));

	if (id && !isNaN(id)){
		_.each(llaves, (llave, i) => {
			if (llave.id == parseInt(id)) {
				llave.public = public;
				llave.private = private;
			}
		});
		res.json(llaves);
	}
	else {
		res.status(500).json({error: "there was an error"});
	}
});

router.delete(`/delete/:id`, (req, res) => {
	const { id } = req.params;
	_.each(llaves, (llave, i) => {
		if(llave.id == parseInt(id)) {
			llaves.splice(i,1);
		}
	});
	res.send(llaves);
});

module.exports = router;