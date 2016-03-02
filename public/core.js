var zhihuAnswer = angular.module('zhihuAnswer', []);

function mainController($scope, $http, $sce) {
    $scope.formData = {};

    $scope.submitKeywords = function () {
        $http.post('/api/crawl', $scope.formData)
            .success(function (data) {
                //$scope.formData = {};
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
}