/**
 * hatem zidi (hatem.zidi@gmail.com) on 29/01/2015.
 *
 * Main App file
 */

var map;
var geolocation;
var marker = undefined;
var markerIcon = isMobile() ? "img/marker_mobile.png" : "img/marker_red.png";
var gpsStatus;


function geolocateMe() {
    GMaps.geolocate({
        success: function (position) {
            gpsStatus = true;
            geolocation = {lat: position.coords.latitude, lng: position.coords.longitude};

            map.setCenter(geolocation.lat, geolocation.lng);

            if (marker === undefined) {
                marker = map.addMarker({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    icon: markerIcon
                });
            } else {
                marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
            }
        },
        error: function (error) {
            showMsgBox('error', 'Oops', 'Geolocation failed');
            gpsStatus = false;
        },
        not_supported: function () {
            showMsgBox('error', 'Oops', 'Your browser does not support geolocation');
            gpsStatus = false;
        },
        always: function () {
            //Done!;
        }
    });

}


function followMe() {
    GMaps.geolocate({
        success: function (position) {
            geolocation = {lat: position.coords.latitude, lng: position.coords.longitude};
            map.setCenter(geolocation.lat, geolocation.lng);
            marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        }
    });

}

function initialize() {

    geolocation = {lat: 44.832500, lng: -0.593262}; // Bordeaux, France -- as Default :)

    map = new GMaps({
        div: '#map',
        lat: geolocation.lat,
        lng: geolocation.lng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
        rotateControl: false,
        scaleControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        resize: function () {
            this.setCenter(geolocation);
        }
    });

    // geolcate now !
    geolocateMe();

    // traffic layer \o/
    map.addLayer('traffic');

    // https://github.com/hpneo/gmaps/issues/358
    // Trigger resize event of the map when the window is resized — but only when
    // the actual resizing has stopped for 200 ms, so that we are not triggering the
    // event continuously while the browser is being resized.
    var resizingTimeOut;
    $(window).resize(function () {
        clearTimeout(resizingTimeOut);
        resizingTimeOut = setTimeout(function () {
            map.refresh();
        }, 200);
    });

}

function isMobile() {
    try {
        document.createEvent("TouchEvent");
        return true;
    }
    catch (e) {
        return false;
    }
}

function showMsgBox(type, title, body) {
    $('#msgBox').addClass(type);
    $('#msgBox').find('.modal-title').html(title);
    $('#msgBox').find('.modal-body').html(body);
    $('#msgBox').modal('show');
    $('#msgBox').on('hidden.bs.modal', function (e) {
        $('#msgBox').removeClass(type);
    })
}

function resizeBootstrapMap() {
    var $map = $('#map');
    var mapParentWidth = $('#map_canvas').width();
    $map.width(mapParentWidth);
    $map.height($(window).height() - 115);
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

    // add animation to the refresh button
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
    //if mobile then refresh position
    if (isMobile() && gpsStatus) {
        setInterval(followMe, 1000);
    }

    // TYPEAHEAD  ---------
    var citiesBloodhound = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: 'api.php?q=%QUERY'
    });

    citiesBloodhound.initialize();

    $('#typeahead')
        .typeahead({
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
        })
        .on('typeahead:selected', function (e, datum) {
            map.setCenter(datum.latitude, datum.longitude);
        });


    // EVENTS  ---------
    $('#backToPosition').on('click', function () {
        map.setCenter(geolocation.lat, geolocation.lng);
    });

    $('#refreshRate, #isRefreshable').on('change', function () {
        if ($('#isRefreshable').is(':checked')) {
            setInterval(reloadTiles, $('#refreshRate').val() * 1000);
        }
    });
});

