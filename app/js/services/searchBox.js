'use strict';

angular.module('traffc')
    .service('$searchBox', ['$rootScope', function ($rootScope) {

        var $search = {
            template: 'searchbox.tpl.html',
            position: 'top-right',
            parentdiv: 'container-location-search',
            options: {
                autocomplete: true,
                visible: true
            },
            events: {
                /*jshint camelcase: false */
                place_changed: function (autoComplete) {
                    var places = autoComplete.getPlace();

                    if (places.address_components) {
                        //reset found marker
                        $rootScope.$broadcast('map.dragend', {});

                        /*jshint camelcase: true */
                        var bounds = new google.maps.LatLngBounds();
                        bounds.extend(places.geometry.location);

                        //center map to the selected place
                        $rootScope.$broadcast('map.center', {
                            latitude: bounds.getNorthEast().lat(),
                            longitude: bounds.getNorthEast().lng()
                        });

                        //add a search marker
                        $rootScope.$broadcast('map.searchFound', {
                            id: 2,
                            isFavorite: false,
                            icon: 'img/marker_place_found.png',
                            coords: {
                                latitude: places.geometry.location.lat(),
                                longitude: places.geometry.location.lng()
                            },
                            /*jshint camelcase: false */
                            label: places.formatted_address,
                            /*jshint camelcase: true */
                            store: false
                        });

                        // reset autocomplete input field
                        $('input.clearable').removeClass('x onX').val('').change();

                    } else {
                        console.log('we have to do something else with the search string: ' + places.name);
                    }
                }
            }
        };


        return $search;
    }]);
