//Контроллер шапки проекта
function ProjectBannerController($scope, $http, $compile) {
    var projectCode = $scope.project_code;
    var baseUrl = window['static_url'] + 'project-headers/';

    var stylesUrl = baseUrl + projectCode + '.css';
    var templateUrl = baseUrl + projectCode + '.html';

    var stylesNode = $('#project-header-styles');
    if (stylesNode.length)
        stylesNode.remove();

    stylesNode = $(document.createElement('link'));
    stylesNode.attr('id', 'project-header-styles');
    stylesNode.attr('rel', 'stylesheet');
    stylesNode.attr('href', stylesUrl);
    $('head').append(stylesNode);

    $http.get(templateUrl).success(onTemplateLoaded);

    function onTemplateLoaded(data) {
        var template = $compile(data);
        var elem = template($scope);
        $('#project-top').html(elem);

        var parallaxTimeout = setTimeout(setParallax, 500);
        $(window).load(function() {
            clearTimeout(parallaxTimeout);
            setParallax();
        });

        function setParallax() {
            var parallaxNode = $('.project-parallax-header', '#project-top');
            Effects.setHeaderParallax(parallaxNode);
        }
    }
}

ProjectBannerController.$inject = ['$scope', '$http', '$compile'];
