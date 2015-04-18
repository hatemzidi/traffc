/**
 * Created by h.zidi on 29/01/2015.
 */

var map;
var trafficLayer;

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

    if (!!navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            //mapOptions.center = geolocation;
            map.panTo(geolocation);

            var marker = new google.maps.Marker({
                position: geolocation,
                icon: new google.maps.MarkerImage("img/marker_red.png"),
                map: map
            });
        });
    }

    map = new google.maps.Map(document.getElementById('map'), mapOptions);


    trafficLayer = new google.maps.TrafficLayer();
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
            empty: [
                '<div class="empty-message">',
                'unable to find your city :(',
                '</div>'
            ].join('\n'),
            suggestion: Handlebars.compile('<img src="img/blank.gif" class="flag flag-{{country}}" alt="{{country}}" /> {{asciiname}}')
        }
    });


    $('#typeahead').on('typeahead:selected', function (e, datum) {
        var newLatLng = new google.maps.LatLng(datum.latitude, datum.longitude);
        map.panTo(newLatLng);
    });
});

