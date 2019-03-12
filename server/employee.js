const express = require('express');

var fs = require('fs');
var router = express.Router();

router.get("/files/:filepath", function (request, response) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    var file = request.params.filepath;
    var directory = '/home/jayesh/';
    var filepath = directory + file;
    console.log(filepath);
    fs.readFile(filepath, 'utf8', (e, data) => {
        if (e) throw e;
        response.write(JSON.stringify(data));
        response.end();
    });
});

module.exports = router;
