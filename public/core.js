var zhihuAnswer = angular.module('zhihuAnswer', []);

function mainController($scope, $http) {
    $scope.formData = {};

    $scope.submitKeywords = function () {
        $http.post('/api/crawl', $scope.formData)
            .success(function (data) {
                //$scope.formData = {};
                console.log(data);
                $scope.todos = data;
            })
            .error(function (data) {
                console.log('Error');
            });
    };
}