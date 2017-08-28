const commandLineArgs = require('command-line-args');
const mongodb = require('mongodb');
let mc = mongodb.MongoClient;

/**
 * @example node app.js -f 2004 -l 2008 -e 50
 */
function regexSimple(sort) {

    var options = commandLineOptions();

    mc.connect('mongodb://localhost:27017/crunchbase', function (err, db) {
        console.log("Connected to mongodb");

        var i = 0, numMatches = 0;
        // var query = {"category_code": "biotech"};
        var query = queryDocument(options);

        var cursor = db.collection('companies').find(query);

        if(sort){
            var s = {};
            s[sort] = 1;
            // sorting the issue
            cursor.sort(s);
        }

        var projection = {
            "name": 1,
            "category_code": 1,
            "offices.country_code":1,
            "founded_year":1,
            "_id": 0
        };

        // adding projection/select
        cursor.project(projection);

        cursor.skip(options.skip);
        cursor.limit(options.limit);

        cursor.forEach(function (doc) {
            // console.log(doc)
            numMatches = numMatches + 1;
            console.log((++i)+" "+doc.name+" is a "+doc.category_code+" Founded :: " + doc.founded_year);
        }, function (err) {
            // called with error or node

            if (err)
                console.log(err);

            console.log("");
            console.log(query);
            console.log("");
            console.log("Matching documents: " + numMatches);
            console.log("db closed");
            db.close();
        });

        // will not run has to be in callback
        // console.log("db closed");
        // db.close();
    });


    function queryDocument(options) {

        console.log(options);
        var query = {};

        if("firstYear" in options && "lastYear" in options)
        {
            query = {
                "founded_year": {
                    "$gte": options.firstYear,
                    "$lte": options.lastYear
                }
            };
        }

        if ("employees" in options) {
            query.number_of_employees = {"$gte": options.employees};
        }

        if("ipo" in options){
            var ipo = options.ipo;
            if(ipo == "yes"){
                query['ipo.valuation_amount'] = {"$exists": true, "$ne": null};
            }
            if(ipo == "no"){
                query['ipo.valuation_amount'] = null;
            }
        }

        if("country" in options){
            query['offices.country_code'] = options.country;
        }


        return query;
    }

    function commandLineOptions() {
        // node app.js -f 2004 -l 2008 -e 50 -i yes
        // node app.js -c CHN
        var options = commandLineArgs([
            {name: "firstYear", alias: "f", type: Number},
            {name: "lastYear", alias: "l", type: Number},
            {name: "employees", alias: "e", type: Number},
            {name: "ipo", alias: "i", type: String},
            {name: "country", alias: "c", type: String},
            {name: "skip", alias: "s", type: Number, defaultValue: 0},
            {name: "limit", alias: "t", type: Number, defaultValue: 20000}
        ]);
        return options;
    }
}

// exporting modules
module.exports = regexSimple;