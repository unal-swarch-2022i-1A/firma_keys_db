const { Router } = require('express');
const router = Router();
const { getConnection } = require("./../database/database");

const _ = require('underscore');

const llaves = require('../ejemplo.json');

const NodeRSA = require('node-rsa');

const valor = 2048;

// routes - rutas
router.get('/key', async (req,res) => {
	res.json(llaves);
});

router.get('/keys/:id/public', async (req, res) => {
	try {
		var { id } = parseInt(req.params);
        const connection = await getConnection();
        const result = await connection.query(`SELECT public FROM firma_keys WHERE id = ${id}`);
		console.log(result);
        // res.json(result);
        // res.send(result);
    } catch (error) {
        console.log(error.message);
        // res.status(500);
        // res.send(error.message);
    }

	// if (id && !isNaN(id)){
	// 	var ky = ""; 
	// 	_.each(llaves, (llave, i) => {
	// 		if (llave.id == parseInt(id)) {
	// 			ky = llave.public;
	// 		}
	// 	});
	// 	res.send(ky);
	// 	// res.json(ky);
	// }
	// else {
	// 	res.status(500).json({error: "there was an error"});
	// }
});

router.get('/keys/:id/private', async (req, res) => {
	try {
		var { id } = parseInt(req.params);
        const connection = await getConnection();
        const result = await connection.query(`SELECT private FROM firma_keys WHERE id = ${id}`);
		console.log(result);
        // res.json(result);
        // res.send(result);
    } catch (error) {
        console.log(error.message);
        // res.status(500);
        // res.send(error.message);
    }

	// if (id && !isNaN(id)){
	// 	var ky = ""; 
	// 	_.each(llaves, (llave, i) => {
	// 		if (llave.id == parseInt(id)) {
	// 			ky = llave.private;
	// 		}
	// 	});
	// 	res.send(ky);
	// 	// res.json(ky);
	// }
	// else {
	// 	res.status(500).json({error: "there was an error"});
	// }
});

router.post('/keys/:id', async (req, res) => {
	const key = new NodeRSA({b: valor});
	var { id } = req.params;
	var public = key.exportKey('public');
	var private = key.exportKey('private');

	try {
        if (id && !isNaN(id)){
        	const a = parseInt(id);
			const keys = { a, public, private };
			const connection = await getConnection();
			await connection.query("INSERT INTO firma_keys SET ?", keys);

        	// res.send(error.message);

			// res.json({ message: "Language added" });
        } else {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

    } catch (error) {
        console.log(error.message);
        // res.status(500);
        // res.send(error.message);
    }

	// if (id && !isNaN(id)){
	// 	const newkey = {"id": parseInt(id), "public": public, "private": private};
	// 	// console.log(newkey);
	// 	llaves.push(newkey);
	// 	res.send('Created');
	// 	// res.json(newkey);
	// } else {
	// 	res.status(500).json({error: "There was an error."});
	// }
});

router.put('/keys/:id', async (req, res) => {

	const key = new NodeRSA({b: valor});
	// var { id } = req.params;
	try {
        const { id } = parseInt(req.params);
        var public = key.exportKey('public');
		var private = key.exportKey('private');

        if (id === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }
        const keys = { a, public, private };
        const connection = await getConnection();
        const result = await connection.query("UPDATE firma_keys SET ? WHERE id = ?", [keys, id]);
        // res.json(result);
        console.log(result);
        // res.send();

    } catch (error) {
        console.log(error.message);
        // res.status(500);
        // res.send(error.message);
    }

	// if (id && !isNaN(id)){
	// 	_.each(llaves, (llave, i) => {
	// 		if (llave.id == parseInt(id)) {
	// 			llave.public = public;
	// 			llave.private = private;
	// 		}
	// 	});
	// 	// res.json();
	// 	res.send('Created');
	// }
	// else {
	// 	res.status(500).json({error: "there was an error"});
	// }
});

router.delete(`/keys/:id`, async (req, res) => {
	const { id } = req.params;

	try {
        const { id } = parseInt(req.params);
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM firma_keys WHERE id = ?", id);
        // res.json(result);
        console.log(result);
    } catch (error) {
        console.log(error.message);
        // res.status(500);
        // res.send(error.message);
    }

	// _.each(llaves, (llave, i) => {
	// 	if(llave.id == parseInt(id)) {
	// 		llaves.splice(i,1);
	// 	}
	// });
		
	// res.send('Created');
	// res.json(llaves);
});

module.exports = router;