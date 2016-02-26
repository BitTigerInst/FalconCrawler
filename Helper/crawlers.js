var cheerio = require('cheerio');

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


function isBlank(str) {
    return (str == undefined || 　str == null || str.trim() == '');
}

exports.Zhihu = Zhihu;