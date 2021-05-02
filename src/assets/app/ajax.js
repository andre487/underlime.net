var Ajax = {};
(function() {
    'use strict';
    Ajax.getData = function(url, onSuccess, onError) {
        if (onError === undefined)
            onError = stdOnError;

        var params = {
            'url': url,
            'type': 'GET',
            'success': onSuccess,
            'error': onError
        };
        $.ajax(params);
    };

    Ajax.postData = function(url, data, onSuccess, onError) {
        if (onError === undefined)
            onError = stdOnError;

        var params = {
            'url': url,
            'type': 'POST',
            'data': data,
            'success': onSuccess,
            'error': onError
        };
        $.ajax(params);
    };

    function stdOnError(jqXHR, textStatus, errorThrown) {
        var alertMessage = 'Error! ' + errorThrown;
        alert(alertMessage);
    }
})();
