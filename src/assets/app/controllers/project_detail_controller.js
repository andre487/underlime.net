//Контроллер списка проектов
// noinspection JSJQueryEfficiency

function ProjectDetailController($scope, $routeParams, $location) {
    AppController.setSelectedMenuElement(0);
    $scope.project_code = $routeParams['code'];

    var projectUrl = '/data/project-{0}-{1}.json?v={2}'
        .replace('{0}', $scope.project_code)
        .replace('{1}', $scope.lang)
        .replace('{2}', window['cache_ver']);

    AppController.enablePreloader();
    Ajax.getData(projectUrl, onProjectData, onProjectError);

    function onProjectData(data) {
        setProjectBreadCrumbs(data);
        setScopeData(data);
        AppController.disablePreloader();

        AppController.initShareWidgets();

        $('.ul-tabs-switch').on('click', 'a[href=#project-pictures]', onPicturesTabClick);
        AppController.documentStatus('ready');

        function onPicturesTabClick() {
            Galleria.run('#project-pictures-gallery', {
                'transition': 'slide',
                'width': '100%',
                'height': 600
            });

            $('.ul-tabs-switch').off('click', 'a[href=#project-pictures]', onPicturesTabClick);
        }
    }

    function setProjectBreadCrumbs(data) {
        var breadCrumbs = [
            {
                'name': $scope.messages['our_projects'],
                'path': '/'
            },
            {
                'name': data['name']
            }
        ];
        AppController.setBreadCrumbs(breadCrumbs);
    }

    function setScopeData(data) {
        for (var key in data) {
            if (data.hasOwnProperty(key))
                $scope[key] = data[key];
        }

        if (data['title'])
            AppController.setPageTitle(data['title']);

        if (data['description'])
            AppController.setMetaDescription(data['description']);
    }

    function onProjectError() {
        $location.path('#!/error404.html');
    }
}

ProjectDetailController.$inject = ['$scope', '$routeParams', '$location'];
