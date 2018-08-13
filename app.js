var io = require('socket.io'),
    url = require('url'),
    http = require('http');

var express = require('express');
var app = express();
var path = require('path');

var fs = require('fs');
var https = require('https');

https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }, app)
  .listen(8888, function () {
    console.log('Example app listening on port 8888! Go to https://localhost:8888/');
})

var socket = io.listen(http.createServer(app));
var bodyParser = require('body-parser');
//var hbs = require('express-handlebars');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mydb', function(err) {
    if (err) {
        return console.log(err);
    }
    return console.log("Successfully connected to MongoDB!");
});

//var passport = require('passport');
//var localStrategy = require('passport-local');


//var expressValidator = require('express-validator');
var expressSession = require('express-session');
var db = mongoose.connection;


app.set("view engine","ejs");
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(expressValidator());

app.engine('.html', require('ejs').__express);
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({
    secret: 'max',
    saveUninitialized: true,
    resave: false
}));


//var MongoClient =require('mongodb').MongoClient,format = require('util').format;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";



app.get('/', function (req, res) {
    res.render('index');
});



//MongoDB login start
app.post('/login', function (req, res) {
    var myMail = req.body.e_mail;
    var myPass = req.body.password;
    

    console.log(myMail);
    console.log(myPass);//db baglantısı sorgu

    MongoClient.connect('mongodb://localhost:27017', function (err1, db) {
        if (err1) {
            throw err1;
        }
        else {
            var dbo = db.db("mydb");
            dbo.collection("users").find({ e_mail: myMail, password: myPass }).toArray(function (err, result) {     // *{}, bu kısmı kaldırınca düzeldi
                if (result[0] != undefined) {
                    if (result[0].password == myPass && result[0].e_mail == myMail)        // array in hangi değeri olduğunu belirtmeyince obje olarak alıyor
                    {
                        var myFirstName ={name:result[0].firstname} ;
                        //console.log(result);
                        req.session.e_mail = myMail;
                        console.log(myFirstName);
                        console.log("TRUEEE");
                        res.send(myFirstName);
                       
                    }
                } else {
                    //console.log(result);
                    console.log("fALSEEEEE");
                    res.send("yanlış");
                }
            });
        }
        db.close();
    });
});
//MongoDB login end

//MongoDB register end
app.post('/signup', function (req, res) {

    var myFirstName = req.body.firstname;
    var myLastName = req.body.lastname;
    var myMail = req.body.e_mail;
    var myPass = req.body.password;

    console.log(myFirstName);
    console.log(myLastName);//db baglantısı sorg
    console.log(myMail);
    console.log(myPass);//db baglantısı sorg


    MongoClient.connect(url, function (err, db) {
        if (err) {
            throw err;
        }
        var dbo = db.db("mydb");
        var myobj = [
            { firstname: myFirstName, lastname: myLastName, e_mail: myMail, password: myPass },
        ];
        dbo.collection("users").insertMany(myobj, function (err, result) {
            if (err) {
                throw err;
            }
            console.log("Number of documents inserted: " + result.insertedCount);
            db.close();
        });
    });

    res.render('index');
});
//MongoDB register end

console.log('server running ' + 'now ' + Date.now());
/*
const PromiseForLogin = new Promise(function(resolve, reject){
    if (herseyYolunda) {
      resolve('İşlem tamam!');
    } else {
      reject('ERROR');
    }
  })
  
  PromiseForLogin.then(function(resp){
    console.log(resp) 
  }).catch(function(hata){
    console.log("ERROR") 
  })*/