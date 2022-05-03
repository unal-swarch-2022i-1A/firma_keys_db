const { Router } = require('express');
const router = Router();
const _ = require('underscore');

const llaves = require('../ejemplo.json');

// routes - rutas
router.get('/key', (req,res) => {
	res.json(llaves);
	// res.send({"Titulo":"Hola mundo"});
});

router.post('/newkey', (req, res) => {
	// console.log(req.body);
	var { id, public, private } = req.body;
	console.log(typeof(id), " | ", typeof(public), " | ", typeof(private));

	if (id && public && private &&  (typeof(id)=="number" && typeof(public)=="number" && typeof(private)=="number")){
		const newkey = {...req.body};
		llaves.push(newkey);
		res.json(newkey);

	} else {
		res.status(500).json({error: "There was an error."});
	}
	// res.send('Wrong Request');
});

router.put('/update/:id', (req, res) => {
	var { id } = req.params;
	const { public, private } = req.body;
	console.log(typeof(id));
	console.log(public, " | ", private);
	if (id && public && private &&  (!isNaN(id) && typeof(public)=="number" && typeof(private)=="number")){
		id = parseInt(id);
		_.each(llaves, (llave, i) => {
			if (llave.id == id) {
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
		if(llave.id == id) {
			llaves.splice(i,1);
		}
	});
	res.send(llaves);

});

module.exports = router;