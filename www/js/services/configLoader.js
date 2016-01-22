'use strict';

angular.module('traffc')
    .provider('configLoader', function () {
        var envConfig = {};

        this.$get = [function () {
            if (!envConfig) {
                throw new Error('Config options must be configured');
            }
            return envConfig;
        }];


        this.config = function (opt) {
            angular.extend(envConfig, opt);
        };
    });