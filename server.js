var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var Crawler = require('simplecrawler');
var cheerio = require('cheerio');
var https = require('https');
var fs = require('fs');

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

    var keywords = encodeURIComponent(req.body.text.trim());
    var options = {
        host: 'www.zhihu.com',
        port: 443,
        path: '/search?type=question&q=' + keywords,
        method: 'GET'
    };

    var req = https.request(options, function (res) {

        var resultBuffer;

        res.on('data', function (d) {
            resultBuffer = resultBuffer + d;
        });

        res.on('end', function () {
            var html = resultBuffer.toString();
            htmlParse(html);
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

function htmlParse(html) {
    var $ = cheerio.load(html);
    var count = 0;
    $('li.item.clearfix').each(function (i, element) {
        var title = $(element).find('div.title').text();
        var author = $(element).find('a.author').text();
        var answerLink = $(element).find('div.entry-content.js-collapse-body').attr('data-entry-url');
        var content = $(element).find('script.content').text();

        if (count < 5 && !isBlank(title) && !isBlank(author) && !isBlank(answerLink)) {
            console.log('\n' + 'Title: ' + title);
            console.log('Author: ' + author);
            console.log('Link: ' + answerLink);
            console.log('Content: ' + content);
            count = count + 1;
        }
    });
}

function isBlank(str) {

    return (str == undefined || 　str == null || str.trim() == '');
}
