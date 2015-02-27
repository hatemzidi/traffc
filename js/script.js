/**
 * Created by h.zidi on 29/01/2015.
 */

var map;

function resizeBootstrapMap() {
    var $map = $('#map');
    var mapParentWidth = $('#map_canvas').width();
    $map.width(mapParentWidth);
    $map.height($(window).height() - 115);
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

    google.maps.event.addListener(map, 'idle', function () {
        mapCenter = map.getCenter();
    });
}


$(function () {
    resizeBootstrapMap(); // first call
    initialize(); // init the map
    $(window).resize(resizeBootstrapMap);

    var citiesBloodhound = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        //prefetch: 'api.php',
        remote: 'api.php?q=%QUERY'
    });

    citiesBloodhound.initialize();

    $('#typeahead').typeahead({
        minLength: 3,
        hint: true,
        highlight: true
    }, {
        name: 'cities',
        displayKey: 'name',
        source: citiesBloodhound.ttAdapter(),
        templates: {
            empty: 'unable to find any City',
            suggestion: Handlebars.compile('{{asciiname}}')
        }
    });


    $('#typeahead').on('typeahead:selected', function (e, datum) {
        var newLatLng = new google.maps.LatLng(datum.latitude, datum.longitude);
        map.panTo(newLatLng);
    });
});

