const mongodb = require('mongodb');
let mc = mongodb.MongoClient;

function rootCall(req, res, next) {
    res.render("index", {'name': 'amir'});
}

function nameCall(req, res, next) {

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

}


function radioValue(req, res, next) {

    let fruit = req.body.radio;
    if (typeof fruit == 'undefined') {
        return next(Error('failed to find fruit, please go back and submit it again'));
    }
    else {
        res.send("fruit " + fruit)
    }

}

module.exports.radioValue  = radioValue;
module.exports.nameCall  = nameCall;
module.exports.rootCall  = rootCall;
