'use strict';

angular.module('traffc')
    .service('$markers', [function () {

        var $markers = {
            list: [],
            set: function (datum) {

                var placeMarker = {
                    id: null,
                    isFavorite: false,
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
            }
        };


        return $markers;
    }]);
