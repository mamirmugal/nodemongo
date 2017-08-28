const commandLineArgs = require('command-line-args');
const mongodb = require('mongodb');
let mc = mongodb.MongoClient;

function mongoSearch() {
    mc.connect('mongodb://localhost:27017/crunchbase', function (err, db) {
        console.log("Connected to mongodb");
        var i = 0;
        var query = {"category_code": "biotech"};

        db.collection('companies').find(query).toArray(function (err, docs) {

            // checking error
            if (err) {
                console.log(err);
                db.close();
            }

            // is sync call
            docs.forEach(function (doc) {
                console.log((++i) + " " + doc.name + " is a " + doc.category_code);
            });

            // Find is async to we need close() method inside
            console.log("Db closed");
            db.close();
        });
    });
}

module.exports = mongoSearch;