var Effects = {};
(function() {
    'use strict';
    var blinkingGlobalIntervalId;

    Effects.startEyeAnimation = function() {
        enableEyeMove();
        enableBlinking();

        function enableEyeMove() {
            var APPLE_R = 12;
            var EYE_R = 25;
            var maxDistance = EYE_R - APPLE_R;

            var appleNode = $('#index-eye-apple');
            var documentNode = $(document);

            var pageWidth = documentNode.width();
            var pageHeight = documentNode.height();
            var pageCenterX = pageWidth/2;
            var pageCenterY = pageHeight/2;
            var xRate = maxDistance/pageWidth;
            var yRate = maxDistance/pageHeight;

            $(window).resize(function() {
                pageWidth = documentNode.width();
                pageHeight = documentNode.height();
                pageCenterX = pageWidth/2;
                pageCenterY = pageHeight/2;
                xRate = maxDistance/pageWidth;
                yRate = maxDistance/pageHeight;
                appleNode.css('top', 0);
                appleNode.css('left', 0);
            });

            documentNode.mousemove(function(e) {
                var top = (e.clientY-pageCenterY)*yRate;
                var left = (e.clientX-pageCenterX)*xRate;
                appleNode.css('top', top);
                appleNode.css('left', left);
            });
        }

        function enableBlinking() {
            var BLINKING_TIMEOUT = 5000;
            var ANIMATION_INTERVAL = 50;
            var FRAME_HEIGHT = 150;

            var eyelidsNode = $('#index-eye-eyelids');
            blinkingGlobalIntervalId = setInterval(blinkAnimation, BLINKING_TIMEOUT);
            $('#index-eye').bind('click', blinkAnimation);

            function blinkAnimation() {
                eyelidsNode.show();
                var maxHeight = eyelidsNode.height()*3;
                var top = 0;
                var blinkAnimationIntervalId = setInterval(blinkFrame, ANIMATION_INTERVAL);

                function blinkFrame() {
                    top -= FRAME_HEIGHT;
                    if (-top > maxHeight) {
                        stopBlink();
                        return;
                    }

                    var bgPos = 'center ' + top.toString() + 'px';
                    eyelidsNode.css('background-position', bgPos);
                }

                function stopBlink() {
                    clearInterval(blinkAnimationIntervalId);
                    eyelidsNode.hide();
                }
            }
        }
    };

    Effects.stopEyeAnimation = function() {
        clearInterval(blinkingGlobalIntervalId);
        $('#index-eye').unbind('click');
    };

    Effects.setHeaderParallax = function(parallaxNode) {
        var mouseNode = $(window);
        var layersCollection = $('.layer', parallaxNode);

        var layersPosTable = {};
        var layersKTable = {};
        layersCollection.each(function(i) {
            var layer = $(this);
            layersPosTable[i] = parseInt(layer.css('left'));
            layersKTable[i] = parseFloat(layer.attr('data-k'));
        });

        var mouseWidth = mouseNode.width();
        var parallaxWidth = parallaxNode.width();
        var halfWidth = mouseWidth/2;
        var sizeK = parallaxWidth/mouseWidth;

        $(window).resize(function() {
            mouseWidth = mouseNode.width();
            parallaxWidth = parallaxNode.width();
            halfWidth = mouseWidth/2;
            sizeK = parallaxWidth/mouseWidth;
        });

        mouseNode.mousemove(function(e) {
            var dlt = (e['clientX'] - halfWidth)*sizeK;

            layersCollection.each(function(i) {
                var left = layersPosTable[i];
                var newLeft = left + dlt*layersKTable[i];
                $(this).css('left', newLeft);
            });
        });
    };
})();
