(function () {
    var deps = ['underlime_ui'];
    var appModule = angular.module('site', deps, undefined);
    appModule.config(routesConfig);

    function routesConfig($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        var indexParams = {'templateUrl': window['static_url'] + 'partials/index.html', 'controller': IndexController};
        var params404 = {'templateUrl': window['static_url'] + 'partials/error.html', 'controller': Error404Controller};
        $routeProvider
            .when('/:urlLang/projects/:code.html', {'templateUrl': window['static_url'] + 'partials/project-detail.html', 'controller': ProjectDetailController})
            .when('/:urlLang/about-us.html', {'templateUrl': window['static_url'] + 'partials/about-us.html', 'controller': AboutUsController})
            .when('/:urlLang/index.html', indexParams)
            .when('/', indexParams)
            .when('/error404.html', params404)
            .otherwise(params404);
    }

    routesConfig.$inject = ['$locationProvider', '$routeProvider'];
})();
