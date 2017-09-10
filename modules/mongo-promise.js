const mongodb = require('mongodb');
const q = require('q');
let mc = mongodb.MongoClient;

function mongoTest() {

    // q.promise(function(resolve){
    //     resolve(["asdf", "q2er"])
    // }).then(function (one) {
    //     console.log(one.pop())
    //     console.log(one.pop())
    // });

    var dbGlobal = null;

    function getdb() {
        return q.promise(function (resolve, reject) {
            mc.connect('mongodb://localhost:27017/crunchbase', function (err, db) {
                if (err)
                    reject(err);

                dbGlobal = db;
                resolve(db);
            });
        })
    }

    /*getdb()
        .then(function (db) {
        console.log("Connected to mongodb");
        var query = {"category_code": "biotech"};

        // this return will not send resolve values to next then
        return q.promise(function (resolveDB, rejectDB) {
            db.collection('companies').find(query).toArray(function (err, docs) {

                if (err)
                    rejectDB(err);

                resolveDB([docs, db])
            });
        });

    })
        .then(function (array) {
            console.log("docs found");

            var db = array.pop();
            var docs = array.pop();

            // is sync call
            var i = 0;
            docs.forEach(function (doc) {
                console.log((++i) + " " + doc.name + " is a " + doc.category_code);
            });

            return db;
        })
        .then(function (db) {
            console.log("close mongodb");
            db.close();
        }).catch(function (err) {
        console.log(err)
    })*/


    getdb()
        .then(function (db) {
            console.log("Connected to mongodb");
            // getting collection
            var comp = db.collection('companies');

            // binding collection find to its comp
            return q.nbind(comp.find, comp);
            // return q.nfbind(comp.find.bind(comp));
        })
        .then(function (comp) {

            var query = {"category_code": "biotech"};
            // find query to get results
            return comp(query)

        }).then(function (cursor) {

        var i = 0;

        // iterating
        cursor.forEach(function (doc) {
            // console.log(doc)
            console.log((++i) + " " + doc.name + " is a " + doc.category_code);
        }, function (err) {
            // called with error or node
            if (err)
                q.promise.reject(err);

            console.log("db closed");
            dbGlobal.close();
        });

    }).catch(function (err) {
        console.log(err)
    })

}

module.exports = mongoTest;