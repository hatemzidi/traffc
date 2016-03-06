'use strict';

angular.module('traffc')
        .service('$utils', [function () {

        return {
            isMobile: function () {
                return $.browser.mobile;
            },
            isEvening: function () {
                var now = new Date();

                // night mode is available from 18:00 to 06:00
                return (6 >= now.getHours() || now.getHours() >= 18);
            }
        };
    }]);
