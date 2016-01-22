'use strict';

angular.module('traffc')
    .controller('navCtrl', ['$scope', '$rootScope',
        function ($scope, $rootScope) {

            $scope.backToMyPosition = function () {
                // based on : http://stackoverflow.com/a/26383781
                $rootScope.$broadcast('map.center', {});
            };

            $scope.addPlace = function () {
                // based on : http://stackoverflow.com/a/26383781
                $rootScope.$broadcast('map.addPlace', {});
            };

        }]);