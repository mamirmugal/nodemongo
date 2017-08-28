const http = require('http');

module.exports = function () {

    var server = http.createServer(function (req, res) {

        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end("hello world");

    }).listen(3000);

};