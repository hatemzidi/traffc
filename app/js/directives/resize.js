'use strict';

angular.module('traffc').directive('heightResize', ['$window', function ($window) {
    return {
        link: function (scope, elem, attrs) {

            scope.onResize = function () {

                var headerHeight = $(attrs.hrHeaderElement).height();

                var minus = 0;
                if (headerHeight !== 0) {
                    minus = attrs.heightResize;
                }

                elem.windowHeight = $window.innerHeight - minus;
                $(elem).height(elem.windowHeight);
            };

            scope.onResize();

            angular.element($window).bind('resize', function () {
                console.debug('window resized');
                scope.onResize();
            });
        }
    };
}]);