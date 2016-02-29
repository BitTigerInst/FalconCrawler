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
        var items = [];
        var total = $('div.question-summary.search-result').length;
        var maxCount = total < 5 ? total : 5;
        var count = 0;

        $('div.question-summary.search-result').each(function (i, element) {

            if (count < maxCount) {
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
            this.author = '';
            this.authorLink = '';

            this.queryTopAnswer = function () {
                var url = 'http://stackoverflow.com' + link;
                console.log(url);
                request(url, function (error, response, body) {

                    if (!error && response.statusCode >= 200 && response.statusCode < 300) {

                        var answerBlock;
                        var answerBlock = parseForAcceptedAnswer(body);
                        if (!answerBlock) {
                            answerBlock = parseForTopAnswer(body);
                        }

                        this.topAnswer = answerBlock.answer;
                        this.author = answerBlock.author;
                        this.authorLink = answerBlock.authorLink;

                        console.log('\n*****************************');
                        console.log('topAnswer:')
                        console.log(this.topAnswer);
                        console.log('author: ' + this.author);
                        console.log('authorLink: ' + this.authorLink);

                        items.push(item);
                        if (items.length === maxCount) {
                            console.log("Done!");
                        }
                    } else {
                        console.log('Error!! ' + response.statusCode);
                    }

                });
            };
        }
    }

    function parseForAcceptedAnswer(data) {

        var $ = cheerio.load(data);
        var acceptedAnswerBlock = $('div.answer.accepted-answer');
        if (!acceptedAnswerBlock || acceptedAnswerBlock.length === 0) {
            return null;
        }

        var topAnswer = acceptedAnswerBlock.find('div.post-text').text().trim();
        var authorBlock = acceptedAnswerBlock.find('div.user-details a');
        var author = authorBlock.text();
        var authorLink = authorBlock.attr('href');
        
        return {
            'answer': topAnswer,
            'author': author,
            'authorLink': authorLink
        }
    }

    function parseForTopAnswer(data) {

        var $ = cheerio.load(data);
        topAnswerBlock = $('div#answers').find('div.answer').first();

        if (!topAnswerBlock || topAnswerBlock.length === 0) {
            return null;
        }

        var topAnswer = topAnswerBlock.find('div.post-text').text().trim();
        var authorBlock = topAnswerBlock.find('div.user-details a');
        var author = authorBlock.text();
        var authorLink = authorBlock.attr('href');

        return {
            'answer': topAnswer,
            'author': author,
            'authorLink': authorLink
        }
    }
}

function isBlank(str) {
    return (str == undefined || str == null || str.trim() == '');
}

exports.Zhihu = Zhihu;
exports.StackOverflow = StackOverflow;

//stackoverflow.com/search?q=[php] node