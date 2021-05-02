(function($) {
    var uiModule = angular.module('underlime_ui', [], undefined);
    uiModule.directive('ulTabs', ulTabs);

    function ulTabs() {
        return {
            'priority': 0,
            'restrict': 'A',
            'link': linkFunction
        };

        function linkFunction(scope, jqElem) {
            jqElem.addClass('no-select');

            var buttons = $('.ul-tabs-switch a', jqElem);
            var tabs = $('.ul-tab', jqElem);

            buttons.each(function() {
                var button = $(this);
                var className = 'ui-button-for-' + button.attr('href').replace('#', '');
                button.addClass(className);
            });

            jqElem.on('click', '.ul-tabs-switch a', function() {
                var selector = $(this).attr('href');
                selectTab(selector);
                return false;
            });

            function selectTab(selector) {
                jqElem.removeClass('no-select');
                tabs.removeClass('selected');
                $(selector).addClass('selected');

                var buttonSelector = '.ui-button-for-{0}'.replace('{0}', selector.replace('#', ''));
                buttons.removeClass('selected');
                $(buttonSelector, jqElem).addClass('selected');
            }
        }
    }
})(jQuery);
