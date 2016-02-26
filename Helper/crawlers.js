var cheerio = require('cheerio');
var request = require('request');

function Zhihu() {

    this.host = 'www.zhihu.com';
    this.port = 443;
    this.path = '/search?type=question&q=';

    this.crawl = function (html) {
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
}

function StackOverflow() {

    this.host = 'stackoverflow.com';
    this.port = 443;
    this.path = '/search?q=';

    this.crawl = function (html) {
        var $ = cheerio.load(html);
        var count = 0;

        var items = [];

        $('div.question-summary.search-result').each(function (i, element) {

            if (count < 5) {
                var title = $(element).find('a').attr('title');
                var questionLink = $(element).find('a').attr('href');

                var questionItem = new StackOverflowItem(i, title, questionLink);
                questionItem.queryTopAnswer();
                count = count + 1;
            }
        });

        function StackOverflowItem(index, title, link) {

            var item = this;
            this.index = index;
            this.title = title;
            this.link = link;
            this.topAnswer = '';

            this.queryTopAnswer = function () {
                var url = 'http://stackoverflow.com' + link;
                console.log(url);
                request(url, function (error, response, body) {

                    if (!error && response.statusCode == 200) {
                        var $ = cheerio.load(body);
                        topAnswer = $('div.answer.accepted-answer').find('div.post-text').text();
                        console.log('-----------------------------------------');
                        items.push(item);
                        console.log(items.length);
                    } else {
                        console.log('Error!! ' + response.statusCode);
                    }

                });
            };
        }
    }
}




function isBlank(str) {
    return (str == undefined || str == null || str.trim() == '');
}

exports.Zhihu = Zhihu;
exports.StackOverflow = StackOverflow;

//stackoverflow.com/search?q=[php] node