const { noType } = require('../Utils/headerTypes')

function handleAuthentication(req, res) {
    console.log('Handle Authentication')
    res.writeHead(201, noType)
    res.end()
}

module.exports = {
    handleAuthentication
}