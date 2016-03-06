'use strict';

angular.module('traffc')
    .controller('placesCtrl', function ($scope, $rootScope, $markers) {

        // for the view, minus the search marker, if any
        $scope.markers = _.filter($markers.list, function (m) {
            return m.id !== 2;
        });

        $scope.centerTo = function (coords) {
            $rootScope.$broadcast('map.center', coords);
        };

        $scope.setFavotirePlace = function (idx) {

            // get the previous favorite marker before resetting all.
            var oldFavIdx = _.findIndex($markers.list, {isFavorite : true});

            //reset other markers
            _.map($markers.list, function (el) {
                el.isFavorite = false;
                el.options.icon.url = 'img/marker_place.png';
                el.options.animation = null;
            });

            // if i'm the same place, unfavored it
            if ( oldFavIdx !== idx) {
                // make it favorite
                $markers.list[idx].isFavorite = true;
                $markers.list[idx].options.icon.url = 'img/marker_fav_place.png';
                $markers.list[idx].options.animation = google.maps.Animation.DROP;
            }

            $rootScope.$broadcast('map.setFavoritePlace', idx);
        };

        $scope.deletePlace = function (idx) {
            $markers.list.splice(idx, 1);
            $scope.markers.splice(idx, 1);  // force delete on view
            $rootScope.$broadcast('map.deletePlace', idx);
        };

        $scope.idx = -1;
        $scope.onShow = function (idx) {
            $scope.idx = idx;
        };

        $scope.onHide = function () {
            $scope.idx = -1;
        };

    });
