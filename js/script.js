/**
 * Created by h.zidi on 29/01/2015.
 */

var map;
var trafficLayer;
var currentPosition;

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
            currentPosition = geolocation; // store the location
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


function reloadTiles() {
    //console.debug('reloaded');
    var tiles = $("#map_canvas").find("img");
    for (var i = 0; i < tiles.length; i++) {
        var src = $(tiles[i]).attr("src");
        if (/googleapis.com\/vt\?pb=/.test(src)) {
            var new_src = src.split("&ts")[0] + '&ts=' + (new Date()).getTime();
            $(tiles[i]).attr("src", new_src);
        }
    }

    // add animation
    $('#refresh-btn').addClass('spin').delay(1000)
        .queue(function () {
            $(this).removeClass('spin');
            $(this).dequeue();
        });
}


$(function () {

    // INIT ---------
    resizeBootstrapMap(); // first call
    initialize(); // init the map
    $(window).resize(resizeBootstrapMap); // force responsivness
    $('[data-toggle="tooltip"]').tooltip(); // init tooltips
    $('#refreshRate').selectpicker();


    var citiesBloodhound = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        //prefetch: 'api.php',
        remote: 'api.php?q=%QUERY'
    });

    citiesBloodhound.initialize();

    // EVENTS  ---------
    $('#backToPosition').on('click', function () {
        map.setCenter(currentPosition);
    });

    $('#refreshRate, #isRefreshable').on('change', function () {
        if ($('#isRefreshable').is(':checked')) {
            setInterval(reloadTiles, $('#refreshRate').val() * 1000);
        }
    });

    $('#typeahead').typeahead({
        minLength: 3,
        hint: true,
        highlight: true
    }, {
        name: 'cities',
        display: 'asciiname',
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

