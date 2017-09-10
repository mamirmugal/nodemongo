const http = require('http');
const engines = require('consolidate');
const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
// const assert = require('assert');
const commandLineArgs = require('command-line-args');

let mc = mongodb.MongoClient;
let app = express();

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////


/*
let mongoSimple  = require("./modules/week1-2/mongo-simple");
mongoSimple();
*/


////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////


/*
// let server  = require("./modules/week1-2server");
server();
*/

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////


/*
app.engine("html", engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + "/template")

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
*/

// app.use(app.router);

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////


/*
// let mongoExpress  = require("./modules/week1-2mongo-express");

app.get("/", mongoExpress.rootCall);
app.get("/:name", mongoExpress.nameCall);
app.post("/radio_value", mongoExpress.radioValue);

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});
app.listen(3000);
*/


////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////// Week 3 //////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// var search = require("./modules/week4/mongo-search");
// search();

// var SimpleRegex = require("./modules/week4/mongo-regex");
// SimpleRegex();

// var complexRegex = require("./modules/week4/mongo-regex-comp");
// complexRegex();

// sorting
// var SimpleRegex = require("./modules/week4/mongo-regex");
// SimpleRegex("founded_year");

// Delete
// var mongoDelete = require("./modules/week4/mongo-delete");
// mongoDelete();

// Test three
// var testThree = require("./modules/week4/code/buildingQueryDocuments/buildingQueryDocuments");
// testThree();

// Test four
// var testFour = require("./modules/week4/code/overviewOrTags/overviewOrTags");
// testFour();

var test = require("./modules/mongo-promise");
test();


console.log("Server is on 3000");