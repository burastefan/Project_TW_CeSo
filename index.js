var http = require('http');
let fs = require("fs");

http.createServer(function (req, res) {
  fs.readFile("test.html",(err, data) => {
    if(!err) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    }
  });
}).listen(5000);