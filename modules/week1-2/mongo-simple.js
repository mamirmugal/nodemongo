const http = require('http');
const mongodb = require('mongodb');
let mc = mongodb.MongoClient;

module.exports = function () {

    mc.connect("mongodb://localhost:27017/test", function (err, db) {

        console.log("Successfully connected to server");

        db.collection("test.movies").find({}).toArray(function (err, rows) {

            rows.forEach(function (row) {
                console.log(row.name + " " + row.age)
            });

            db.close();
        })

    });

}