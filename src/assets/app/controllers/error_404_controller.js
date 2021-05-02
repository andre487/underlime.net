//Контроллер ошибок
function Error404Controller($scope) {
    $scope.error_code = 404;

    $scope.error_message = $scope['messages']['error404'];
    $scope.$watch('lang', function () {
        $scope.error_message = $scope['messages']['error404'];
    });

    AppController.documentStatus('not_found');
}

Error404Controller.$inject = ['$scope'];
