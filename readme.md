
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


####################################################################################################

## Week three

### Restore 
- `mongorestore dump`
- `mongorestore --host mongodb1.example.net --port 3017 --username user --password 'pass' /opt/backup/mongodump-2013-10-24` 
- `mongodump --collection myCollection --db test`

### Import
- `mongoimport -d crunchbase -c companies companies.json`

### multiple instances
- `mongod --dbpath /usr/local/var/mongodb2 --port 27018 &`
- this will run the service of mongodb with specific path and port

### Change port
- `mongod --port 27018 &`
- this will run instance 
- press enter and connect to mongodb with `mongo` command

### toArray and Cursor
- `db.collection('companies').find(query).toArray`
    - will actually get all the rows from db 
    - convert to array and return it back
    - we can use `forEach` async method to iterate throw it
    
    
### Regex 
- `$options` is used with `$regex`
- it provided options to regex functionality
- with the value `"$options":"i"` it will search case insensitive 


### Dot notation
- it is used to to objects and arrays `ipo.amount: {$gte:100}` where db is
```
{
    name: "Amir",
    ipo:{
        amount: 360
    } 
}
```

### Sort
- with value name and `1` for asc and `-1` for desc, in an object
```
cursor.sort({year:1});
```
- when using multiple sorts we are going to use array in array
- order of array elements is from left to right
- left is ordered first and then second, an so on
```
cursor.sort([ [year:1], [name: -1] ]);
```

**NOTE** 
- `skip, limit, sort` can be of any order
- mongodb will always, sort first, skip second and limit third

### Twitter [insertOneAndInsertMany folder]
- `.stream` it will stream data to us one by one


### Delete [deleteOneAndDeleteMany folder]
- sorting is not working because it is exhorting the memory 
- we need to index or apply limit
- `db.companies.createIndex({parmalink:1})`

### Problem
- When using find() in the Node.js driver, which of the following best describes when the driver will send a query to MongoDB?
    - When we call a cursor method passing a callback function to process query results
    - because all the sort, limit etc is done in the memory
    

####################################################################################################

## Week four


### Application driven schema
- Rich documents
- no joins (hard to scale) but pre joins within documents
- no constraints (no foreign key constraint)
- support atomic operations (no transactions)
- no declared schema (but application has schema)

**NOTE: single most important factor to design you application schema with mongo?**
**NOTE: is to match the data access patterns of your application**



### Goals of normalization (relational db)
- Frees the database from modification anomalies 
    - For MongoDB, it looks like embedding data would mostly cause this. And in fact, we should try to avoid embedding data in documents in MongoDB which possibly create these anomalies. Occasionally, we might need to duplicate data in the documents for performance reasons. However that's not the default approach. The default is to avoid it.
- Should minimize re-design when extending 
    - MongoDB is flexible enough because it allows addition of keys without re-designing all the documents
- Avoid bias toward any particular access pattern 
    - this is something, we're not going to worry about when describing schema in MongoDB. And one of the ideas behind the MongoDB is to tune up your database to the applications that we're trying to write and the problem we're trying to solve.



### Module of blog in mongodb
- atomic operations, happen which happens and or not happens at all.
- update, findAndModify, $addToSet, $push



### One to One Relationship
- frequency of access
    - if collections are frequently accessed then keep it separate collections
- size of the items, above 16mb cannot be embedded
    - if the size is very large then keep it different collections
- atomicity



### One to Many Relationship
- in embedded document
    - size, it can be large so separate document is needed
    - redundancy, data duplication
- true linking
    - linking foreign key, with id as unique name
    - it requires 2 collections
- `one to few`, embedded is best options



### Many to Many Relations
- we have a an key with array with ids in them
- embedded, only if the relations is limited 



### Multikeys
- multi key indexes, `db.students.ensureIndex({'teacher':1})`
- `db.students.find({'teacher':{$all:[0,1]}})`, getting students with teacher 0,1



### Benefits of Embedding
- performance benefits, read performance
- depends on access patterns



### Trees
- in relations db, table keep parent_id, but in multi level to access the top level parent, we need to query all tables and their parent
- in mongodb we can kee the list of the parent in one array, in asc order `parents: [2,5,8,9]`




### Demoralize
- in one to one relation, can be embedded
- in one to many relation, 
    - embedded will work from many to one
    - but in one to many then linking will work
- in many to many relation, then linking











