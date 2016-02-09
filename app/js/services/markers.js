'use strict';

angular.module('traffc')
    .service('$markers', ['$rootScope',function ($rootScope) {



        var newPlaceMarker = {
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
                        $rootScope.$broadcast('map.saveNewPlace', {});
                        // reset marker
                        newPlaceMarker.reset();
                    },
                    abort: function () {
                        // reset marker
                        newPlaceMarker.reset();
                        // hide me
                        newPlaceMarker.options.visible = false;
                    }
                },
                closeClick: function () {
                    newPlaceMarker.infoWindow.show = false; // update the show flag
                }
            },
            events: {
                click: function () {
                    newPlaceMarker.infoWindow.show = !newPlaceMarker.infoWindow.show;
                },
                dragstart: function () {
                    console.debug('marker drag started');
                    newPlaceMarker.infoWindow.show = false; // force closing the infoWindow
                },
                dragend: function () {
                    console.debug('marker drag ended');
                    newPlaceMarker.infoWindow.show = true;  // force opening the infoWindow

                }
            },
            reset: function () {
                // hide this marker and its window
                newPlaceMarker.options.visible = false;
                newPlaceMarker.infoWindow.show = false;

                // clean params
                newPlaceMarker.infoWindow.params.placeName = '';
            }

        };



        var $markers = {
            list: [],
            newPlaceMarker : newPlaceMarker,
            set: function (datum) {

                var placeMarker = {
                    id: null,
                    isFavorite: false,
                    store: true,
                    coords: {},
                    options: {
                        visible: true,
                        animation: google.maps.Animation.DROP,
                        draggable: false,
                        icon: {
                            url: 'img/marker_place.png',
                            scaledSize: new google.maps.Size(40, 40)
                        }
                    },
                    infoWindow: {
                        options: {
                            maxWidth: 300
                        },
                        label: '',
                        show: false,
                        closeClick: function () {
                            placeMarker.infoWindow.show = false; // update the show flag
                        }
                    },
                    events: {
                        click: function () {

                            // close the other infoWindows
                            // act only when the current is closed
                            if (!placeMarker.infoWindow.show) {
                                _.map($markers.list, function (el) {
                                    el.infoWindow.closeClick();
                                });
                            }

                            placeMarker.infoWindow.show = !placeMarker.infoWindow.show;
                        }
                    }

                };


                angular.extend(placeMarker, {
                    id: datum.id,
                    isFavorite: datum.isFavorite,
                    store: (typeof datum.store === 'undefined') ? true : datum.store,
                    coords: datum.coords
                });

                placeMarker.infoWindow.label = datum.label;
                if (!_.isEmpty(datum.icon)) {
                    placeMarker.options.icon.url = datum.icon;
                }

                this.list.push(placeMarker);

            },
            get: function () {
                return this.list;
            },
            getNewMarker : function(){
                return this.newPlaceMarker;
            },
            delete: function (id) {
                var idx = _.findIndex(this.list, {id: id});
                if (idx >= 0) {
                    this.list.splice(idx, 1);
                }
            },
            reset: function () {
                this.list = [];
            }
        };


        return $markers;
    }]);
