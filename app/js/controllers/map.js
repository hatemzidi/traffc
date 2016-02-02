'use strict';

angular.module('traffc')
//todo extract this, preappend with 'views/'
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('searchbox.tpl.html', '<input type="text" class="form-control clearable" id="map-location-search" placeholder="Search for a city..." autocomplete="off">');
        $templateCache.put('getPlaces.tpl.html', '<div id="getFavoriteUI" ng-click="showPlacesModal()" ng-controller="navCtrl"><i class="fa fa-heart fa-2x"></i></div>');
        $templateCache.put('addPlace.tpl.html', '<div id="setFavoriteUI" ng-click="addPlace()" ng-controller="navCtrl"><i class="fa fa-plus-square fa-2x"></i></div>');
        $templateCache.put('goCenter.tpl.html', '<div id="goCenterUI" ng-click="backToMyPosition()" ng-controller="navCtrl"><i class="fa fa-crosshairs fa-2x"></i></div>');
    }])
    .controller('mapCtrl', ['$geolocation', '$scope', '$rootScope', '$map', '$markers', '$settings', 'localStorageService',
        function ($geolocation, $scope, $rootScope, $map, $markers, $settings, $storage) {

            // for the view
            $scope.map = $map;
            $scope.markers = $markers.list;
            $scope.isDeviceMobile = $settings.isMobile();

            /* -- set the searchbox ---*/
            $scope.searchbox = {
                template: 'searchbox.tpl.html',
                position: 'top-right',
                parentdiv: 'container-location-search',
                options: {
                    autocomplete: true,
                    types: ['(cities)'],
                    visible: true
                },
                events: {
                    /*jshint camelcase: false */
                    place_changed: function (autoComplete) {
                        var places = autoComplete.getPlace();

                        if (places.address_components) {
                            /*jshint camelcase: true */
                            var bounds = new google.maps.LatLngBounds();
                            bounds.extend(places.geometry.location);

                            //center map to the selected place
                            $scope.$emit('map.center', {
                                latitude: bounds.getNorthEast().lat(),
                                longitude: bounds.getNorthEast().lng()
                            });

                            // reset autocomplete input field
                            $('input.clearable').removeClass('x onX').val('').change();

                        } else {
                            console.log('we have to do something else with the search string: ' + places.name);
                        }
                    }
                }
            };

            /* ---------- user marker and current position --- */
            $scope.userMarker = {
                id: 0,
                options: {
                    draggable: false,
                    icon: {
                        scaledSize: new google.maps.Size(40, 40),
                        url: 'img/marker_user.png'
                    }

                }

            };


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


            /* ----- add new place marker ---*/
            // todo extract this into a $marker provider, and use extend
            $scope.newPlaceMarker = {
                id: 1,
                coords: {},
                options: {
                    visible: true,
                    animation: google.maps.Animation.DROP,
                    draggable: true,
                    icon: {
                        url: 'img/marker_new_place.png',
                        scaledSize: new google.maps.Size(40, 40)
                    }
                },
                infoWindow: {
                    options: {  // some graphical adjustments
                        maxWidth: 300,
                        pixelOffset: {
                            width: 0,
                            height: -40
                        }
                    },
                    show: false,
                    templateUrl: 'views/infoWindow.addPlace.tpl.html',
                    params: {
                        placeName: '',
                        save: function () {
                            $scope.$emit('map.saveNewPlace', {});
                            // reset marker
                            $scope.newPlaceMarker.reset();
                        },
                        abort: function (){
                            // reset marker
                            $scope.newPlaceMarker.reset();
                            // hide me
                            $scope.newPlaceMarker.options.visible = false;
                        }
                    },
                    closeClick: function () {
                        $scope.newPlaceMarker.infoWindow.show = false; // update the show flag
                    }
                },
                events: {
                    click: function () {
                        $scope.newPlaceMarker.infoWindow.show = !$scope.newPlaceMarker.infoWindow.show;
                    },
                    dragstart: function () {
                        console.debug('marker drag started');
                        $scope.newPlaceMarker.infoWindow.show = false; // force closing the infoWindow
                    },
                    dragend: function () {
                        console.debug('marker drag ended');
                        $scope.newPlaceMarker.infoWindow.show = true;  // force opening the infoWindow

                    }
                },
                reset: function () {
                    // hide this marker and its window
                    $scope.newPlaceMarker.options.visible = false;
                    $scope.newPlaceMarker.infoWindow.show = false;

                    // clean params
                    $scope.newPlaceMarker.infoWindow.params.placeName = '';
                }

            };

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
                var style = $settings.data.nightMode === true && $settings.isEvening() ? 'dark' : 'light';

                if (style === 'light') {
                    StatusBar.styleDefault();
                } else {
                    StatusBar.styleLightContent();
                }

                $map.setStyle(style);
            });


            // todo refactor/extract this
            $scope.$watch('markers', function (nv, ov) {
                //todo try to ignore infowindow.show
                if (!_.isEqual(nv, ov)) {
                    var places = _.map(nv, function (i) {
                        return {
                            id: i.id,
                            isFavorite: i.isFavorite,
                            coords: i.coords,
                            label: i.infoWindow.label
                        };
                    });

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

        }]);