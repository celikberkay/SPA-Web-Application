var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


var myFirstName = req.body.firstname;
var myLastName = req.body.lastname;
var myMail = req.body.e_mail; 
var myPass = req.body.password;

MongoClient.connect(url,function (err,db) {
    if (err) {
        throw err;
    }
    var dbo = db.db("mydb");
    var myobj = [
        { firstname: myFirstName , lastname: myLastName, e_mail: myMail, password: myPass},
    ];
    dbo.collection("users").insertMany(myobj, function(err, result) {
        if (err) {
            throw err;
        }
        console.log("Number of documents inserted: " + result.insertedCount);
        db.close();
    });
});
