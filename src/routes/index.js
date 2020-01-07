// ***********************************************PAGINA PRINCIPAL*********************************************

const express = require('express');
const router = express.Router();
const db = require('../database')
const Cart = require('../model/cart')


//listas
router.get('/', async (req, res) => {

    const lista_productos_peluches = await db.query("SELECT top 4 * FROM productos where id_categoria = 1"); //peluches
    const lista_productos_bicicletas = await db.query("SELECT top 4 * FROM productos where id_categoria = 2"); //bicicletas
    const lista_productos_rodados = await db.query("SELECT top 4 * FROM productos where id_categoria = 3"); //rodados

    res.render('../views/index', {lista_productos_rodados, lista_productos_bicicletas})
});


// detalle de bicicletas pagina principal
router.get('/detalle_bicicletas/:id', async (req, res) => {

    const { id } = req.params;
    console.log(req.params) 

    try {
        const idProducto = await db.query("SELECT id, nombre, descripcion, FORMAT(precio, '#,###') as precio, stock FROM productos WHERE id = '" + id + "'")
        const idDetalleProducto = await db.query("SELECT * FROM productos INNER JOIN descripcion_bicicletas ON productos.id = descripcion_bicicletas.id_producto WHERE productos.id = '" + id + "'")

        console.log(idProducto.recordset[0])
        console.log(idDetalleProducto.recordset[0])
        res.render('bicicletas/detalle_bicicletas', {idProducto: idProducto.recordset[0], idDetalleProducto: idDetalleProducto.recordset[0]});
    } catch (e) {
        console.log(e);
    }
});

// detalle de rodados pagina principal
router.get('/detalle_rodados/:id', async (req, res) => {
    const { id } = req.params;
    console.log(req.params) 
    
    try {
        const idProducto = await db.query("SELECT id, nombre, descripcion, FORMAT(precio, '#,###') as precio, stock FROM productos WHERE id = '" + id + "'")
        const idDetalleProducto = await db.query("SELECT * FROM productos INNER JOIN descripcion_rodados ON productos.id = descripcion_rodados.id_producto WHERE productos.id = '" + id + "'")
        // console.log(idProducto.recordset[0])
        // console.log(idDetalleProducto.recordset[0])
        res.render('rodados/detalle_rodados', {idProducto: idProducto.recordset[0], idDetalleProducto: idDetalleProducto.recordset[0]});
    } catch (e) {
        console.log(e);
    }
});


router.get('/detalle_bicicletas/:id', async (req, res) => {
    const { id } = req.params;
    // console.log(req.params) 
    
    try {
        const idProducto = await db.query("SELECT id, nombre, descripcion, FORMAT(precio, '#,###') as precio, stock FROM productos WHERE id = '" + id + "'")
        const idDetalleProducto = await db.query("SELECT * FROM productos INNER JOIN descripcion_bicicletas ON productos.id = descripcion_bicicletas.id_producto WHERE productos.id = '" + id + "'")
        res.render('bicicletas/detalle_bicicletas', {idProducto: idProducto.recordset[0], idDetalleProducto: idDetalleProducto.recordset[0]});
    } catch (e) {
        console.log(e);
    }
});


// ------------------------------carrito----------------------------------//
router.get('/add/:id', async (req, res) =>{
    const { id } = req.params;


    try {
        const Producto = await db.query("SELECT * FROM productos WHERE id = '"+ id +"' ");
        // const Productof = Producto.recordsets[0];
        // console.log(Productof)
        
        const cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
        const product = Producto.filter( (item) =>  {
            return item.id == id;
        });

        cart.add(product[0], id);
        req.session.cart = cart;
        res.redirect('/');
        inline();

    } catch (e) {
        console.log(e);
    }
});

router.get('/cart', function(req, res, next) {
    if (!req.session.cart) {
      return res.render('cart', {
        products: null
      });
    }
    var cart = new Cart(req.session.cart);
    res.render('cart', {
      title: 'NodeJS Shopping Cart',
      products: cart.getItems(),
      totalPrice: cart.totalPrice
    });
  });
  
  router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
  
    cart.remove(productId);
    req.session.cart = cart;
    res.redirect('/cart');
  });



module.exports = router;