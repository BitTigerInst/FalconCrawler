var zhihuAnswer = angular.module('zhihuAnswer', []);

function mainController($scope, $http, $sce) {
    $scope.formData = {};

    $scope.submitKeywordsForZhihu = function () {
        $http.post('/api/crawlZhihu', $scope.formData)
            .success(function (data) {
                console.log(data);
                for (i = 0; i < data.length; i++) {
                    //                    var titleHtml = data[i].title;
                    var answerHtml = data[i].topAnswer;
                    //                    data[i].title = $sce.trustAsHtml('<strong>' + titleHtml + </strong>)
                    data[i].topAnswer = $sce.trustAsHtml('<br>' + answerHtml)
                }

                $scope.contents = data;
            })
            .error(function (data) {
                console.log('Error');
            });
    };

    $scope.submitKeywordsForStackOverflow = function () {
        $http.post('/api/crawlStackOverflow', $scope.formData)
            .success(function (data) {
                console.log(data);
                for (i = 0; i < data.length; i++) {
                    var answerHtml = data[i].topAnswer;
                    data[i].topAnswer = $sce.trustAsHtml('<br>' + answerHtml)
                }

                $scope.contents = data;
            })
            .error(function (data) {
                console.log('Error');
            });
    };

    $scope.getBackgroundColor = function (index) {

        if (index == 1) {
            return {
                'color': '#E0F7FA'
                , 'font-family': 'Microsoft Yahei'
                , 'font-size': '20px'
            };
        }
        if (index == 2) {
            return {
                'color': '#80DEEA'
                , 'font-family': 'Microsoft Yahei'
                , 'font-size': '20px'
            };
        }
        if (index == 3) {
            return {
                'color': '#26C6DA'
                , 'font-family': 'Microsoft Yahei'
                , 'font-size': '20px'
            };
        }
        if (index == 4) {
            return {
                'color': '#00ACC1'
                , 'font-family': 'Microsoft Yahei'
                , 'font-size': '20px'
            };
        }
        if (index == 5) {
            return {
                'color': '#00838F'
                , 'font-family': 'Microsoft Yahei'
                , 'font-size': '20px'
            };
        }
    };

    $scope.getBackgroundColorForMore = function (index) {
        if (index == 1) {
            return {
                'color': '#B2EBF2'
            };
        }
        if (index == 2) {
            return {
                'color': '#4DD0E1'
            };
        }
        if (index == 3) {
            return {
                'color': '#00BCD4'
            };
        }
        if (index == 4) {
            return {
                'color': '#0097A7'
            };
        }
        if (index == 5) {
            return {
                'color': '#006064'
            };
        }
    };
}