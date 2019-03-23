var express = require('express');
var app = express();
var dirpath = __dirname + '/public';
console.log('serving dir : ' + dirpath);
app.use(express.static(dirpath)); //Serves resources from public folder
app.get('/*.html', function (req, res) {
    res.sendFile(dirpath + '/index.html');
});
var server = app.listen(5000);
