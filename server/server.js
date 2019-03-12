const express = require('express');
const bodyParser = require('body-parser');

const employee = require('./employee');

//localhost:4000/employee

var app = express();

// values sent using jquery ($.ajax())
app.use(bodyParser.json());

// values sent using html form (inputs)
// extended = true: parse the complex object
app.use(bodyParser.urlencoded({ extended: true }));

// to enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(employee);

app.listen(4000, 'localhost', function() {
    console.log('server started on port 4000');
});
