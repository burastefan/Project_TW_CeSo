var http = require('http');
let fs = require("fs");
const path = require('path');

http.createServer(function (req, res) {
  fs.readFile(path.resolve(__dirname, './test.html'),(err, data) => {
    if(!err) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    }
  });
}).listen(process.env.PORT || 5000);