var mongo = require('mongodb');
var dbUrl = "mongodb://localhost:27017/";
var client = mongo.MongoClient;

function initializeDatabase() {
    client.connect(dbUrl, function(err, db) {
        if (err) throw err;
        var database = db.db("secure_texasholdem");
        database.createCollection("users", function(err, res){
            if (err) throw err;
        });
        database.createCollection("tables", function (err, res) {
            if (err) throw err;
        });
        db.close();
    });
}

initializeDatabase();
