const commandLineArgs = require('command-line-args');
const mongodb = require('mongodb');
let mc = mongodb.MongoClient;

function regexComplex() {
    var options = commandLineOptionsRegex();

    mc.connect('mongodb://localhost:27017/crunchbase', function (err, db) {
        console.log("Connected to mongodb");

        var i = 0, numMatches = 0;
        // var query = {"category_code": "biotech"};
        var query = queryDocumentRegex(options);

        var cursor = db.collection('companies').find(query);
        var projection = {"name": 1, "category_code": 1, "_id": 0};

        // adding projection/select
        cursor.project(projection);

        cursor.forEach(function (doc) {
            console.log(doc)
            numMatches = numMatches + 1;
            // console.log((++i)+" "+doc.name+" is a "+doc.category_code);
        }, function (err) {
            // called with error or node

            if (err)
                console.log(err);

            console.log("Matching documents: " + numMatches);
            console.log("db closed");
            db.close();
        });

        // will not run has to be in callback
        // console.log("db closed");
        // db.close();
    });


    function queryDocumentRegex(options) {
        console.log(options);

        var query = {};

        if ("overview" in options) {
            query.overview = {"$regex": options.overview, "$options": "1"};
        }

        if ("milestones" in options) {
            query["milestones.source_description"] = {"$regex": options.milestones, "$options": "1"};
        }
        return query;
    }

    function commandLineOptionsRegex() {
        // node app.js -o "finance" -m ""
        // node app.js  -m "billion"
        var options = {};

        options = commandLineArgs([
            {name: "overview", alias: "o", type: String},
            {name: "milestones", alias: "m", type: String},
        ]);
        return options;
    }
}

// exporting modules
module.exports = regexComplex;