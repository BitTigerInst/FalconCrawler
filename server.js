var express = require('express');
var app = express();
var mongoose = require('mongoose');
var database = require('./config/database');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var Crawler = require("simplecrawler");
var cheerio = require("cheerio");
var https = require('https');


mongoose.connect(database.remoteUrl, function (err) {
    if (err) {
        console.log('Failed to connect to the database.');
        console.log(err);
    } else {
        console.log('Connected to the database.');
    }
});


// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
// log every request to the console
app.use(morgan('dev'));
// pull information from html in POST
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());

// ----- define model
var Todo = mongoose.model('Todo', {
    text: String
});

// ----- define routes

// get all todos
app.get('/api/todos', function (req, res) {
    // use mongoose to get all todos in the database
    Todo.find(function (err, todos) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            console.log(err);
            res.send(err);
        }
        console.log(todos);
        res.json(todos); // return all todos in JSON format
    });
});

// Crawel the zhihu.com 
app.post('/api/crawl', function (req, res) {

    var keywords = req.body.text;
    var crawlUrl = "http://www.zhihu.com/search?type=question&q=" + keywords;
    console.log("***** Crawling... " + crawlUrl);

    Crawler.crawl(crawlUrl)
        .on("fetchcomplete", function (queueItem, responseBuffer, response) {
            console.log("***** Completed fetching resource:", queueItem.url);
            console.log("***** Just received %s (%d bytes)", queueItem.url, responseBuffer.length);
            console.log("***** It was a resource of type %s", response.headers['content-type']);

            // Do something with the data in responseBuffer
            var html = responseBuffer.toString();
            var $ = cheerio.load(html);
            // parsing the html
        });
});


// Crawel the zhihu.com by getting http response
app.post('/api/crawl1', function (req, res) {

    var keywords = req.body.text;
    var options = {
        host: 'www.zhihu.com',
        port: 443,
        path: "/search?type=question&q=" + keywords,
        method: 'GET'
    };

    var req = https.request(options, function (res) {
        console.log(res.statusCode);
        res.on('data', function (d) {
            process.stdout.write(d);
        });
    });
    req.end();

    req.on('error', function (e) {
        console.error(e);
    });
});

// delete a todo
app.delete('/api/todos/:todo_id', function (req, res) {
    Todo.remove({
        _id: req.params.todo_id
    }, function (err, todo) {
        if (err)
            res.send(err);
        // get and return all the todos after you create another
        Todo.find(function (err, todos) {
            if (err) {
                res.send(err);
            }
            res.json(todos);
        });
    });
});

// get the index.html
app.get('*', function (req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.listen(8080);