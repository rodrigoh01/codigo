const express = require('express');
const router = express.Router();

const db = require('../database')


router.get('/', async (req, res) => {
    const list_Bici = await db.query("SELECT *FROM productos where id_categoria = 2");
    res.render('bicicletas/bicicletas_pag',{list_Bici});
});






module.exports = router;