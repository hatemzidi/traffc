/**
 * Created by tom on 26/11/2015.
 */
var mapStyle = {
    light: [{
        "featureType": "landscape",
        "stylers": [{"hue": "#FFBB00"}, {"saturation": 43.400000000000006}, {"lightness": 37.599999999999994}, {"gamma": 1}]
    }, {
        "featureType": "road.highway",
        "stylers": [{"hue": "#FFC200"}, {"saturation": -61.8}, {"lightness": 45.599999999999994}, {"gamma": 1}]
    }, {
        "featureType": "road.arterial",
        "stylers": [{"hue": "#FF0300"}, {"saturation": -100}, {"lightness": 51.19999999999999}, {"gamma": 1}]
    }, {
        "featureType": "road.local",
        "stylers": [{"hue": "#FF0300"}, {"saturation": -100}, {"lightness": 52}, {"gamma": 1}]
    }, {
        "featureType": "water",
        "stylers": [{"hue": "#0078FF"}, {"saturation": -13.200000000000003}, {"lightness": 2.4000000000000057}, {"gamma": 1}]
    }, {
        "featureType": "poi",
        "stylers": [{"hue": "#00FF6A"}, {"saturation": -1.0989010989011234}, {"lightness": 11.200000000000017}, {"gamma": 1}]
    }],
    dark: [{
        "featureType": "water",
        "elementType": "all",
        "stylers": [{"hue": "#bbbbbb"}, {"saturation": -100}, {"lightness": -4}, {"visibility": "on"}]
    }, {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{"hue": "#999999"}, {"saturation": -100}, {"lightness": -33}, {"visibility": "on"}]
    }, {
        "featureType": "road",
        "elementType": "all",
        "stylers": [{"hue": "#999999"}, {"saturation": -100}, {"lightness": -6}, {"visibility": "on"}]
    }, {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [{"hue": "#aaaaaa"}, {"saturation": -100}, {"lightness": -15}, {"visibility": "on"}]
    }],
    alternative: [{
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#e7eaec"}]
    }, {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#e7eaeb"}]
    }, {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [{"visibility": "off"}]
    }, {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [{"visibility": "off"}]
    }, {
        "featureType": "poi.government",
        "elementType": "all",
        "stylers": [{"visibility": "off"}]
    }, {
        "featureType": "poi.medical",
        "elementType": "all",
        "stylers": [{"visibility": "off"}]
    }, {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [{"visibility": "off"}, {"color": "#c9d5ca"}]
    }, {
        "featureType": "poi.place_of_worship",
        "elementType": "all",
        "stylers": [{"visibility": "off"}]
    }, {
        "featureType": "poi.school",
        "elementType": "all",
        "stylers": [{"visibility": "off"}]
    }, {
        "featureType": "poi.sports_complex",
        "elementType": "all",
        "stylers": [{"visibility": "off"}]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#ddc6a2"}]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{"color": "#b59e74"}, {"visibility": "on"}]
    }, {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [{"visibility": "on"}, {"color": "#d7dbdc"}]
    }, {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [{"visibility": "on"}, {"color": "#d7dbdc"}]
    }, {
        "featureType": "transit.station",
        "elementType": "all",
        "stylers": [{"visibility": "off"}]
    }, {"featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#abb9c1"}]
    }
    ],
    getStyle: function () {
        var settings = storage.isSet('_traffc_settings') ? storage.get('_traffc_settings') : {};

        var s = settings.nightMode === "on" && isEvening() ? 'dark' : 'light';

        return this[s];
    }
};
