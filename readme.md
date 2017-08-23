
# Node - M101JS: MongoDB for Node.js Developers

## Commands
- `show dbs`
- `db.movies.insertOne()`
- `_Id`, is automatically inserted
- `find()`,`find().pretty()`, will show records
- `var c = db.movies.find()` will save rows to c variable
- `c.next()` will get next row
- `c.hasNext()` will check if it has next records

## Week Two **Example from created_documents**
- insert with `insertMany` and `insertOne`
- insert many will insert till it gets error and then stop
- using `{"ordered":false}` as second argument to allow to skip the error and add rest of the rows
- `upserts`

### The _id Field
- `ObjectId` first 4 bytes are date, next 3 are mac address, next 3 are pid, next 3 are counter, so 12 bytes hex string


### Reading Documents
- find (where) clause in which we need to get object we will use . notation
```
"tomoto" : {
    "rating" : 100
}
```
- to find this we need to use . notation in quotes `find({"tomato.rating" : 100})` will return the value
- when find array value
    - match on the entire array
    - match based on any element
    - match based on specific element 
    - complex matches with operators

- Match on entire array, will match exact value and number of values, no less no more
    - `find({"writes": ["Joel Coen", "Ethan Coen"]})`
    - if we switch the order it will not work at all
    - value are in array brackets, so the system will match the exact values
    
- Match based on any element, will match rows with values in them
    - `find({"actors": "Jeff Bridges"})`
    - will get all movies with this actor in it
    
- Match based on specific element, or specific position
    - `find({"actors.0": "Jeff Bridges"})`
    - will get movies in with the actor is at the first position of the array

- When getting results mongodb shell will get results 101 or about 1 mb of data
- we can use `it` in shell to go to next batch
- in shell below code
````
var c = db.moviesDetails.find();
var doc = function() { return c.hasNext() ? c.next() : null }
doc() //  to get results of one batch
````
- `c.objsLeftInBatch()` to see the records in the current batch
- projection (select), which fields to show but `_id` will be showed by default
    - `find({rated: "PG"}, {title: 1})`, will be second param and `0` or `1` will allow to show or hide
    - `find({rated: "PG"}, {title: 1, _id:0})` will show ony title
    - `find({rated: "PG"}, {writers: 0,actors: 0,_id: 0})` will exclude writers, actors, and _id and rest will be shown


### Comparison operators
- `$get`, greater then
    - `find({runtime: {$gt : 90}})`, well get all movies who's runtime is greater then 90 minutes
- `$gete` and `$lte`
- `$ne`, not equal to, `find({rated: {$ne : "UNRATED"}})`
    - but will also get records which do not have `rated` field at all, we can use `$and`
- `$in`, in clause , `find({rated: {$in : ["UNRATED", "PG"]}})`, in array


### Element operators
- `$exists`, to check if the field exists
    - `find({"tomato.meter":{$exists: true}})` check if the tomato -> meter field exists or not
- `$type`, which type of field
    - `find()`, will get all `_id` which is string
    
    
### Logical Operators    
- `$and`, will take array and in array will be objects with different clause 
    - `find({ $and: [ {"tomato.meter":{$exists: true}}, {"_id":{type: "string"}} ] })`
    
    
### Regex Operator
- `$regex`, regex on string field
    - `find({ "awards.text" : {$regex : /^Won\s.*/ }})`
    
### Array Operator
- `$all`, all record which has all values in rows
    - `find({ genres: {$all : ["Comedy", "Crime"]} })`
- `$size`, on the size of the array
- `$elemMatch`, a field with array and each value is an object/document
    - `find({boxOffice: {$elemMatch{ country: "UK", revenue: {$gt: 15}}}})`


### Update command
- `updateOne` will take first find param and then set value as second
    - `updateOne({title: "The Martian"}, {$set: {poster: "http://www.google.com"}})`
    - `$inc`, will add values to existing value, mostly numeric
    - if we need to push value to array we need `$push` with `$each`
    ````
    db.tst.updateOne({tst:"one"}, { $push:{ "phone_no": { $each:
        [{ "mobile": "456132" }],
        $position:0
    }} })
    ````
- `updateMany` is same is update one but will effect many document
    - `updateMany({rated: null}, {$unset: {rated:"" }})`, we will use unset
- `replaceOne()`

db.movieDetails.find({$and : [{"genres.0":"Comedy"}, "genres":["Comedy"]]}, {title:1, genres:1, _id:0}).count()
db.tst.updateOne({tst:"one"}, { $push:{ "phone_no": { $each:[{ "mobile": "456132" }],$position:0 }} })

### Challenge
- add new values
-  db.movieDetails.updateOne({"title" : "Star Trek II: The Wrath of Khan"}, { $push: {"awards.oscars": {$each:[{"award": "bestAnimatedFeature", "result": "won"},{"award": "bestMusic", "result": "won"},{"award": "bestPicture", "result": "nominated"},{"award": "bestSoundEditing", "result": "nominated"},{"award": "bestScreenplay", "result": "nominated"}]} } })


-  db.movieDetails.updateOne({"title" : "Star Trek"}, { $push: {"awards.oscars": {$each:[{"award": "bestPicture", "result": "nominated"}]} } })


-  db.movieDetails.updateOne({"title" : "Star Wars: Episode I - The Phantom Menace"}, { $push: {"awards.oscars": {$each:[{"award": "bestPicture", "result": "won"}]} } })

-  db.movieDetails.updateOne({"title" : "Star Wars: Episode V - The Empire Strikes Back"}, { $push: {"awards.oscars": {$each:[{"award": "bestSoundEditing", "result": "nominated"}]} } })

-  db.movieDetails.updateOne({"title" : "West of Memphis"}, { $push: {"awards.oscars": {$each:[{"award": "bestScreenplay", "result": "nominated"}]} } })


-  db.movieDetails.updateOne({"title" : "Journey to the West"}, { $push: {"awards.oscars": {$each:[{"award": "bestPicture", "result": "nominated"}]} } })

- ANSWER
```
db.movieDetails.find({"awards.oscars.award":"bestPicture"}, {title:1, "awards.oscars":1, _id:0}).pretty()
```


### Challenge 2
- Deleting one record
    - db.users.deleteOne( { status: "D" } )
    - `db.users.remove( { status: "D" }, 1)`, will remove one record if 1 is giving in second param

- "imdb.votes", "year", "tomato.consensus"
- db.movieDetails.find({ $and: [{"imdb.votes": {$lt:10000}}, {year:{$gte:2010}}, {year:{$lte:2013}}, { "tomato.consensus": null }, {"tomato.consensus": {$exists:true}}] }, {"imdb.votes":1, year:1, "tomato.consensus":1, _id:false}).count()

- db.movieDetails.updateMany({ $and: [{"imdb.votes": {$lt:10000}}, {year:{$gte:2010}}, {year:{$lte:2013}}, { "tomato.consensus": null }, {"tomato.consensus": {$exists:true}}] }, {$unset: {"tomato.consensus": null }})