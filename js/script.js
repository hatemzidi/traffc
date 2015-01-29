/**
 * Created by h.zidi on 29/01/2015.
 */

var map;

function resizeBootstrapMap() {
    var mapParentWidth = $('#map_canvas').width();
    $('#map')
        .width(mapParentWidth)
        .height($(window).height() - 300);
}

function initialize() {
    var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(44.832500, -0.593262),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
    google.maps.event.addDomListener(window, "resize", function () {
        resizeBootstrapMap();
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    google.maps.event.addListener(map, 'idle', function (event) {
        mapCenter = map.getCenter();
    });
}


$(function () {
    resizeBootstrapMap(); // first call
    initialize(); // init the map
    $(window).resize(resizeBootstrapMap);
});