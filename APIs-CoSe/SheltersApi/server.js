const http = require('http');
const { getShelters, insertShelter, deleteShelter, updateShelter } = require('./Controllers/shelterController')
const { validateToken, getToken } = require('./Utils/jwtUtils')
const { noType } = require("./Utils/headerTypes");
const url = require("url");

const server = http.createServer((req, res) => {
    if (req.url === '/api/shelters' && req.method === 'GET') { // Get All Shelters
        //No token for get shelters
        getShelters(req, res);
    }
    else if (req.url === '/api/shelters' && req.method === 'POST') { // Insert Shelter
        // Verify token existence and validity
        const token = getToken(req, res);
        console.log("Token: ", token)
        if (token) {
            const valid = validateToken(token, res);
            console.log("Valid token: ", valid);
            if (valid != null) {
                let body = '';
                req.on('data', function (data) {
                    body += data;
                })
                req.on('end', function () {
                    const shelter = JSON.parse(body);
                    console.log("Shelter to be inserted: ", shelter);

                    insertShelter(shelter, req, res);
                })
            } else {
                res.writeHead(401, noType);
                res.end();
            }
        }
        else {
            res.writeHead(401, noType);
            res.end();
        }
    }
    else if (req.url.match(/\/api\/shelters\/([0-9]+)/) && req.method === 'DELETE') { // Delete Shelter
        //Verify token existence and validity
        const token = getToken(req, res);
        console.log("Token: ", token)
        if (token) {
            const valid = validateToken(token, res);
            console.log("Valid token: ", valid);
            if (valid != null) {
                const id = req.url.split('/')[3];

                deleteShelter(id, req, res);
            } else {
                res.writeHead(401, noType);
                res.end();
            }
        }
        else {
            res.writeHead(401, noType);
            res.end();
        }
    }
    else if (req.url.match(/\/api\/shelters\/([0-9]+)/) && req.method === 'PUT') { // Update Shelter
        //Verify token existence and validity
        const token = getToken(req, res);
        console.log("Token: ", token)
        if (token) {
            const valid = validateToken(token, res);
            console.log("Valid token: ", valid);
            if (valid != null) {
                const id = req.url.split('/')[3];

                let body = '';
                req.on('data', function (data) {
                    body += data;
                })
                req.on('end', function () {
                    const shelter = JSON.parse(body);
                    shelter.id = id;
                    console.log("Shelter to be inserted: ", shelter);

                    updateShelter(shelter, req, res);
                })
            } else {
                res.writeHead(401, noType);
                res.end();
            }
        }
        else {
            res.writeHead(401, noType);
            res.end();
        }
    }
    else if (req.method === 'OPTIONS') {
        //Browser checks if API is valid for POST/PUT/DELETE operations
        res.writeHead(200, noType);
        res.end();
    }
    else {
        //Unknown request
        res.writeHead(404, noType);
        res.end();
    }
});

const PORT = process.env.PORT || 5004;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));