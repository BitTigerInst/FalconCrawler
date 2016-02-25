var express = require('express');
var app = express();
//var mongoose = require('mongoose');
//var database = require('./config/database');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var Crawler = require("simplecrawler");
var cheerio = require("cheerio");
var https = require('https');

//mongoose.connect(database.remoteUrl, function (err) {
//    if (err) {
//        console.log('Failed to connect to the database.');
//        console.log(err);
//    } else {
//        console.log('Connected to the database.');
//    }
//});

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
// log every request to the console
app.use(morgan('dev'));
// pull information from html in POST
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());

//// ----- define model
//var Todo = mongoose.model('Todo', {
//    text: String
//});

// ----- define routes

// Crawel the zhihu.com by using simpleCrawler
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
        
        var resultBuffer;
        var html;
        var $;
        
        console.log(res.statusCode);
        res.on('data', function (d) {
            process.stdout.write(d);
            resultBuffer = resultBuffer + d;
        });
        
        res.on('end', function() {
            html = responseBuffer.toString();
            $ = cheerio.load(html);
        });
    });
    req.end();

    req.on('error', function (e) {
        console.error(e);
    });
});

// get the index.html
app.get('*', function (req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.listen(8080);