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
            }
        };
    }]);
