const { Router } = require('express');
const router = Router();


// routes - rutas
router.get('/test', (req,res) => {
	const data = {
		"name": "Julio",
		"website": "faztweb.com"
	};
	res.json(data);
	// res.send({"Titulo":"Hola mundo"});
});

module.exports = router;