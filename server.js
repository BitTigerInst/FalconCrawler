var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var https = require('https');
//var fs = require('fs');
var crawlers = require('./Helper/crawlers.js');

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
// log every request to the console
app.use(morgan('dev'));
// pull information from html in POST
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());

// ----- define routes

// Crawel the zhihu.com by getting http response
app.post('/api/crawl', function (req, res) {

    var crawlerModule = new crawlers.StackOverflow();
    var keywords = encodeURIComponent(req.body.text.trim());
    var options = {
        host: crawlerModule.host,
        port: crawlerModule.port,
        path: crawlerModule.path + keywords,
        method: 'GET'
    };

    var req = https.request(options, function (res) {

        var resultBuffer;
        res.on('data', function (d) {
            resultBuffer = resultBuffer + d;
        });

        res.on('end', function () {
            var html = resultBuffer.toString();
            crawlerModule.crawl(html);
        });
    });
    req.end();

    req.on('error', function (e) {
        console.error(e);
    });
});

// get the index.html
app.get('*', function (req, res) {
    res.sendfile('./public/index.html');
});

app.listen(8080);
