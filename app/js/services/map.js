'use strict';

angular.module('traffc')
    .service('$map', ['$mapStyle', '$settings', function ($config, $settings) {


        return {
            center: { // Bordeaux, France -- as Default :)
                latitude: 44.832500,
                longitude: -0.593262
            },
            zoom: 12, //parseInt($settings.data.defaultZoom),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            showTraffic: true,
            options: {
                zoomControl: $settings.isMobile(),
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
            mapStyles: $config,
            setStyle : function(style) {
                angular.extend(this.options.styles, $config[style]);
            }
        };
    }]);
