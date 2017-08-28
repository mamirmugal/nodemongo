const commandLineArgs = require('command-line-args');
const mongodb = require('mongodb');
let mc = mongodb.MongoClient;

function mongoDelete() {
    mc.connect('mongodb://localhost:27017/crunchbase', function (err, db) {
        console.log("Connected to mongodb");
        var i = 0;

        var query = {"permalink": {"$exists": true, "$ne": null}};
        var projection = {"permalink":1, "updated_at": 1};

        var cursor = db.collection('companies').find(query);
        cursor.project(projection);
        cursor.sort({"permalink":1});
        // cursor.limit(100);

        cursor.forEach(function (doc) {

            // is sync call
            console.log((++i) + " " + doc.permalink + " is a " + doc.updated_at);

        }, function (err) {
            console.log(err);
            console.log("Db closed");
            db.close();
        });
    });
}

module.exports = mongoDelete;