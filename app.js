const http = require('http');
const engines = require('consolidate');
const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
// const assert = require('assert');

let mc = mongodb.MongoClient;
let app = express();

app.engine("html", engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + "/template")

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// app.use(app.router);



app.get("/", function (req, res, next) {
    res.render("index", {'name': 'amir'});
});

app.get("/:name", function (req, res, next) {

    let first = req.params.name;

    if (first == 'get') {
        mc.connect("mongodb://localhost:27017/test", function (err, db) {

            db.collection("test.movies").find({}).toArray(function (errs, rows) {

                res.render("index", {"name": "amir", "rows": rows});

                db.close();
            });
        });
    }

    if (first == 'radio') {
        res.render("radio", {"radio": ["apple", "orange", "mango", "banana"]});
    }

});


app.post("/radio_value", function (req, res, next) {

    let fruit = req.body.radio;
    if (typeof fruit == 'undefined') {
        return next(Error('failed to find fruit, please go back and submit it again'));
    }
    else {
        res.send("fruit " + fruit)
    }

});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});
app.listen(3000);


// mc.connect("mongodb://localhost:27017/test", function(err, db){
//
//     console.log("Successfully connected to server");
//
//     db.collection("test.movies").find({}).toArray(function(err, rows){
//
//         rows.forEach(function(row){
//             console.log(row.name + " " + row.age)
//         });
//
//         db.close();
//     })
//
// });

// var server = http.createServer(function(req,res){
//
//     res.writeHead(200, {"Content-Type": "text/plain"});
//     res.end("hello world");
//
// }).listen(3000);
//
console.log("Server is on 3000");