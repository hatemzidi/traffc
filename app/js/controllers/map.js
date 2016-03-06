'use strict';

angular.module('traffc')
    .controller('mapCtrl', ['$geolocation', '$scope', '$rootScope', '$location', '$map', '$markers', '$searchBox', '$settings', '$utils', 'localStorageService',
        function ($geolocation, $scope, $rootScope, $location, $map, $markers,$searchBox, $settings, $utils, $storage) {

            var searchObject = $location.search();

            // for the view
            $scope.map = $map;

            $scope.markers = $markers.get();
            $scope.newPlaceMarker = $markers.getNewMarker();
            $scope.isDeviceMobile = $utils.isMobile();

            /* -- set the searchbox ---*/
            $scope.searchbox = $searchBox;

            /* ---------- user marker and his current position --- */
            $scope.userMarker = $markers.getUserMarker();

            // geo locate only when no options
            if (typeof searchObject.geo === 'undefined') {
                // get the user's position
                $geolocation.getCurrentPosition({
                    timeout: 10001,
                    maximumAge: 3000,
                    enableHighAccuracy: true
                }).then(function (position) {
                    console.debug('Got the current geoposition.');

                    // point the user marker to the current position
                    $scope.userMarker.coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };

                    //center map to the new position
                    $scope.$emit('map.center', $scope.userMarker.coords);

                }).catch(function () {
                    console.error('oops, can not locate the user.');
                    $rootScope.$broadcast('modals.GPSError', {});
                });


                $geolocation.watchPosition({
                    timeout: 10001,
                    maximumAge: 3000,
                    enableHighAccuracy: true
                });

                $scope.$on('$geolocation.position.changed', function (e, v) {
                    // todo compare with current coords?

                    if (!_.isEqual($scope.userMarker.coords, v.coords)) {
                        console.debug('Geoposition changed.');
                        $scope.userMarker.coords = {
                            latitude: v.coords.latitude,
                            longitude: v.coords.longitude

                        };
                    }

                });
            } else {
                if ( /^(-?\d{1,2}\.\d{1,6}),(-?\d{1,2}\.\d{1,6})$/.test(searchObject.geo) ) {
                    console.debug('Got a position from URL : ' + searchObject.geo);

                    var geo = searchObject.geo.split(',').map(parseFloat);
                    $map.center = {
                        latitude: geo[0],
                        longitude: geo[1]
                    };
                }else {
                    console.error('Got malformed position : ' + searchObject.geo);
                }

            }

            if (typeof searchObject.zoom !== 'undefined') {
                $map.zoom = parseInt(searchObject.zoom);
            }

            /* ----- add new place marker ---*/
            $scope.addNewPlace = function () {
                $scope.newPlaceMarker.options.visible = true;
                $scope.newPlaceMarker.coords = {
                    latitude: $map.center.latitude,
                    longitude: $map.center.longitude
                };
            };

            $scope.saveNewPlace = function () {

                // set a new marker
                $markers.set({
                    id: Date.now(),
                    isFavorite: false,
                    coords: $scope.newPlaceMarker.coords,
                    label: $scope.newPlaceMarker.infoWindow.params.placeName
                });

            };


            /* ---- some watchers ---- */

            // update dynamically map style according to time
            // todo refactor/extract this
            $scope.$watch(function () {
                return Date();
            }, function () {
                var style = $settings.data.nightMode === true && $utils.isEvening() ? 'dark' : 'light';

                if (typeof StatusBar !== 'undefined') {
                    if (style === 'light') {
                        StatusBar.styleDefault();
                    } else {
                        StatusBar.styleLightContent();
                    }
                }

                $map.setStyle(style);
            });


            // todo refactor/extract this
            $scope.$watch('markers', function (nv, ov) {
                //todo try to ignore infowindow.show
                if (!_.isEqual(nv, ov)) {
                    var places = _.reduce(nv, function (r, i) {
                        if (i.store === true) {
                            r.push({
                                id: i.id,
                                isFavorite: i.isFavorite,
                                coords: i.coords,
                                label: i.infoWindow.label
                            });
                        }
                        return r;
                    }, []);

                    $storage.set('_traffc_favorite_places', places);
                }
            }, true);

            /* ---- some events --- */
            $scope.$on('map.center', function (e, coords) {
                console.debug('map.center triggered');

                if (_.isEmpty(coords)) {

                    if ($settings.data.centerMap === false) {  // false = user, true = favorite place
                        // center to user
                        if (!_.isEmpty($scope.userMarker.coords)) {
                            $map.center = {
                                latitude: $scope.userMarker.coords.latitude,
                                longitude: $scope.userMarker.coords.longitude
                            };
                        }

                    } else {
                        // center to favorite place
                        var c = _.filter($scope.markers, function (el) {
                            return el.isFavorite;
                        })[0];

                        if (!_.isEmpty(c)) {
                            $map.center = {
                                latitude: c.coords.latitude,
                                longitude: c.coords.longitude
                            };
                        }
                    }

                } else {
                    $map.center = {
                        latitude: coords.latitude,
                        longitude: coords.longitude
                    };
                }

                // clean the autocomplete
                $('#map-location-search').removeClass('x onX').val('').change();
            });

            $scope.$on('map.addPlace', function () {
                console.debug('map.addPlace triggered');
                $scope.addNewPlace();
            });


            $scope.$on('map.saveNewPlace', function () {
                console.debug('map.saveNewPlace triggered');
                $scope.saveNewPlace();
            });

            $scope.$on('map.setFavoritePlace', function () {
                console.debug('map.setFavoritePlace triggered');
            });

            $scope.$on('map.dragend', function () {
                console.debug('map.dragend triggered');
                $markers.delete(2);  // delete the search marker
            });


            $scope.$on('map.searchFound', function (e,datum) {
                console.debug('map.searchFound triggered');
                $markers.set(datum);
            });

        }]);