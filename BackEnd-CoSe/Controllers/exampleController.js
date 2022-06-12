//EXAMPLE CONTROLLER (NOT USED IN OUR APP)

const Product = require('../models/exampleModel')

async function getProducts(req, res) {
    try {
        const products = await Product.findAll()
        console.log("Products: ", JSON.parse(products))

        res.writeHead(200, {'Content-Type' : 'application/json'})
        res.end(products)
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = {
    getProducts
}