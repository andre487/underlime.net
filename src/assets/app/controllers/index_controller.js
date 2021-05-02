//Контроллер индексной страницы
function IndexController($scope, $location, $routeParams) {
    'use strict';
    if (!$routeParams['urlLang']) {
        $location.path('/' + $scope.lang + '/index.html');
        return;
    }

    var NEXT_ICON_OVERFLOW = 11;
    var NEXT_ICON_WIDTH = 100;

    var pageTitle = $scope['messages']['titles']['home'];
    AppController.setPageTitle(pageTitle);
    AppController.setSelectedMenuElement(0);
    AppController.hideHeaderLogo();

    Effects.startEyeAnimation();

    $scope.projects_loaded = false;
    var url = '/data/index-' + $scope.lang + '.json';
    Ajax.getData(url, function (data) {
        $scope.data = data;

        var offset = Math.floor(Math.random() * NEXT_ICON_OVERFLOW) * NEXT_ICON_WIDTH;
        $scope.nextIconBgPos = -offset + 'px center';

        $scope.projects_loaded = true;
        AppController.refresh();

        AppController.documentStatus('ready');
    });

    $scope.$on('$destroy', function () {
        Effects.stopEyeAnimation();
        AppController.hideHeaderLogo(false);
    });
}

IndexController.$inject = ['$scope', '$location', '$routeParams'];
