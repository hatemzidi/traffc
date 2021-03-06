'use strict';

angular.module('traffc')
    .service('$map', ['$rootScope', '$mapStyle', '$settings', function ($rootScope, $config, $settings) {


        return {
            center: { // Bordeaux, France -- as Default :)
                latitude: 44.832500,
                longitude: -0.593262
            },
            zoom: parseInt($settings.data.defaultZoom),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            showTraffic: true,
            options: {
                zoomControl: false, //forced rather than $settings.isMobile(),
                zoomControlOptions: {
                    position: google.maps.ControlPosition.TOP_LEFT
                },
                rotateControl: false,
                scaleControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                panControl: false,
                maxZoom: 20,
                minZoom: 3,
                styles : []
            },
            events : {
                dragend : function() {
                    $rootScope.$broadcast('map.dragend', {});
                }
            },
            mapStyles: $config,
            setStyle : function(style) {
                angular.extend(this.options.styles, $config[style]);
            }
        };
    }]);
