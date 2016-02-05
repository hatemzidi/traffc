'use strict';

angular.module('traffc')
    .controller('navCtrl', ['$scope', '$rootScope',
        function ($scope, $rootScope) {

            $scope.backToMyPosition = function () {
                // to read : http://stackoverflow.com/a/26383781
                $rootScope.$broadcast('map.center', {});
            };

            $scope.addPlace = function () {
                $rootScope.$broadcast('map.addPlace', {});
            };

            $scope.showPlacesModal = function () {
                $rootScope.$broadcast('modals.showPlaces', {});
            };

        }]);