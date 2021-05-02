//Контроллер верхнего уровня
// noinspection JSCheckFunctionSignatures
/* globals twttr, VK, FB  */

function AppController($scope, $rootElement, $window, $location) {
    'use strict';
    init();
    bindNavEvents();
    makeI18n();
    handleHtml();

    function init() {
        $scope.pageTitle = 'Underlime';
        $scope.activeMenuItem = null;
        $scope.messages = {};
        $scope.preloader = false;
        $scope.static_url = $window['static_url'];
        $scope.breadCrumbs = [];
        $scope.hideHeaderLogo = false;
        $scope.status = 'loading';

        initSocNets();
        setLanguage();
    }

    function initSocNets() {
        try {
            VK.init({ 'apiId': 3760889, 'onlyWidgets': true });
        } catch (e) {
            console.error(e);
        }

        try {
            FB.init({'status': false, 'xfbml': false});
        } catch (e) {
            console.error(e);
        }
    }

    function setLanguage() {
        var path = $location.path();
        var langMatches = path.match(/^\/(.+?)\//i);
        var langCode = null;
        if (langMatches && langMatches.length > 1)
            langCode = langMatches[1];

        if (langCode == 'ru' || langCode == 'en')
            $scope.lang = langMatches[1];
        else if (langCode !== null)
            $window.location = '/';
        else
            $scope.lang = $window['default_lang'];

        $scope.$watch('lang', function () {
            var rightPath = $location.path().replace(/^\/ru|en/, $scope.lang);
            $location.path(rightPath);
            $rootElement.attr('lang', $scope.lang);
        });
    }

    function bindNavEvents() {
        $scope.$on('$routeChangeStart', function () {
            $scope.pageUrlRu = $location.path().replace(/^\/ru|en/, '/ru');
            $scope.pageUrlEn = $location.path().replace(/^\/ru|en/, '/en');
            $scope.breadCrumbs = [];
            AppController.enablePreloader();
        });

        $scope.$on('$routeChangeSuccess', function () {
            AppController.disablePreloader();
        });
    }

    function makeI18n() {
        $scope['messages'] = Data['MESSAGES'][$scope.lang];
    }

    function handleHtml() {
        angular.element('.angular-block', $rootElement).show();
        // noinspection SpellCheckingInspection
        $rootElement.on('startdrag', '.button', false);

        $rootElement.on('click', '#lang-switch .switch-button', function (e) {
            e.preventDefault();
            $scope.lang = $(this).attr('data-lang');
            makeI18n();
            AppController.refresh();
        });

        $rootElement.on('click', '#top-anchor', function () {
            $window.scrollTo(0, 0);
            return false;
        });

        var contactNode = $('#contact-popup-wrapper');
        $('#contact-link').click(function() {
            contactNode.show();
            return false;
        });

        contactNode.click(function(e) {
            if (e.target === e.currentTarget)
                contactNode.hide();
        });
    }

    AppController.documentStatus = function(status) {
        if (status !== undefined) {
            $scope.status = status;
            AppController.refresh();
        }
        return $scope.status;
    };

    AppController.hideHeaderLogo = function(value) {
        var oldValue = $scope.hideHeaderLogo;

        if (value === undefined)
            value = true;
        $scope.hideHeaderLogo = value;

        return oldValue;
    };

    AppController.setPageTitle = function (title) {
        $scope.pageTitle = title + ' — Underlime';
    };

    AppController.setMetaDescription = function (description) {
        $('#meta-description').attr('content', description);
    };

    AppController.setSelectedMenuElement = function (index) {
        $scope.activeMenuItem = index;
    };

    AppController.enablePreloader = function () {
        $scope.preloader = true;
        AppController.refresh();
    };

    AppController.disablePreloader = function () {
        $scope.preloader = false;
        AppController.refresh();
    };

    AppController.setBreadCrumbs = function(breadCrumbs) {
        $scope.breadCrumbs = breadCrumbs;
        AppController.refresh();
    };

    AppController.refresh = function() {
        $scope.$$phase || $scope.$apply();
    };

    AppController.initShareWidgets = function() {
        try {
            // noinspection JSUnresolvedVariable
            FB.XFBML.parse(document.getElementById('fb-like-container'));
        } catch (e) {
            console.error(e);
        }

        try {
            // noinspection JSUnresolvedVariable
            VK.Widgets.Like('vk_like', { 'type': 'mini', 'height': 20 });
        } catch (e) {
            console.error(e);
        }

        var twitterText;
        if ($scope.lang == 'ru')
            twitterText = 'Сайт студии Underlime классный! Посмотрите:';
        else
            twitterText = "Underlime's site is AMAZING! Visit it:";

        try {
            twttr.widgets.createShareButton(
                $window.location,
                document.getElementById('twitter-share-container'),
                function () {
                },
                {'text': twitterText}
            );
        }
        catch (e) {
        }
    }
}

AppController.$inject = ['$scope', '$rootElement', '$window', '$location'];
