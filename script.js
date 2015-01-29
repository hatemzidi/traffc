/**
 * Created by h.zidi on 29/01/2015.
 */


function resizeBootstrapMap() {
    var mapParentWidth = $('#map_canvas').width();
    $('#map')
        .width(mapParentWidth)
        .height(3 * mapParentWidth / 4);

    google.maps.event.trigger($('#map'), 'resize');
    //console.log($('#map').height());
}

function initialize() {
    var mapOptions = {
        zoom: 11,
        center: new google.maps.LatLng(44.832500, -0.593262),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false
    };
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
}

$(function () {
    initialize();
    $(window).resize(resizeBootstrapMap);
});