var zhihuAnswer = angular.module('zhihuAnswer', []);

function mainController($scope, $http) {
    $scope.formData = {};
    $http.get('/api/todos')
        .success(function (data) {
            console.log('***** Inside get(/api/todos) succeed');
            $scope.todos = data;
            console.log(data);
        })
        .error(function (data) {
            console.log('***** Inside get(/api/todos) failed');
            console.log('Error: ' + data);
        });
    
    $scope.submitKeywords = function () {
        $http.post('/api/crawl', $scope.formData)
            .success(function (data) {
                $scope.formData = {};
                $scope.todos = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
    
    $scope.deleteTodo = function (id) {
        $http.delete('/api/todos/' + id)
            .success(function (data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
}