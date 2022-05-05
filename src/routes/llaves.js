const { Router } = require('express');
const router = Router();
const _ = require('underscore');

const llaves = require('../ejemplo.json');

const NodeRSA = require('node-rsa');

const valor = 2048;

// routes - rutas
router.get('/key', (req,res) => {
	res.json(llaves);
});

router.get('/keys/:id/public', (req, res) => {
	var { id } = req.params;

	if (id && !isNaN(id)){
		var ky = ""; 
		_.each(llaves, (llave, i) => {
			if (llave.id == parseInt(id)) {
				ky = llave.public;
			}
		});
		//res.send(ky);
		res.json(ky);
	}
	else {
		res.status(500).json({error: "there was an error"});
	}
});

router.get('/keys/:id/private', (req, res) => {
	var { id } = req.params;

	if (id && !isNaN(id)){
		var ky = ""; 
		_.each(llaves, (llave, i) => {
			if (llave.id == parseInt(id)) {
				ky = llave.private;
			}
		});
		//res.send(ky);
		res.json(ky);
	}
	else {
		res.status(500).json({error: "there was an error"});
	}
});

router.post('/keys/:id', (req, res) => {
	const key = new NodeRSA({b: valor});
	var { id } = req.params;
	var public = key.exportKey('public');
	var private = key.exportKey('private');

	if (id && !isNaN(id)){
		const newkey = {"id": parseInt(id), "public": public, "private": private};
		// console.log(newkey);
		llaves.push(newkey);
		res.send();
		// res.json(newkey);
	} else {
		res.status(500).json({error: "There was an error."});
	}
});

router.put('/keys/:id', (req, res) => {

	const key = new NodeRSA({b: valor});
	var { id } = req.params;
	var public = key.exportKey('public');
	var private = key.exportKey('private');

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

router.delete(`/keys/:id`, (req, res) => {
	const { id } = req.params;
	_.each(llaves, (llave, i) => {
		if(llave.id == parseInt(id)) {
			llaves.splice(i,1);
		}
	});
	res.json(llaves);
});

module.exports = router;