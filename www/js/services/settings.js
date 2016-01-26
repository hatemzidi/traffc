'use strict';

angular.module('traffc')
        .service('$settings', ['localStorageService', function ($storage) {

        return {
            data: {},
            set: function (datum) {
                this.data = datum;
                $storage.set('_traffc_settings', datum);
            },

            get: function () {
                this.data = $storage.get('_traffc_settings');
                return this.data;
            },
            //todo extract to $utils provider
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
