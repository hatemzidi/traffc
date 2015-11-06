/**
 * hatem zidi (hatem.zidi@gmail.com) on 29/01/2015.
 *
 * Main App file
 */

var map;
var marker = undefined;
var geolocation;
var gpsStatus;


function geolocateMe() {
    GMaps.geolocate({
        success: function (position) {
            gpsStatus = true;

            geolocation = {lat: position.coords.latitude, lng: position.coords.longitude};

            map.setCenter(geolocation.lat, geolocation.lng);

            if (marker === undefined) {
                marker = map.addMarker({
                    lat: geolocation.lat,
                    lng: geolocation.lng,
                    icon: "img/marker_mobile.png"
                });
            } else {
                marker.setPosition(new google.maps.LatLng(geolocation.lat, geolocation.lng));
            }
        },
        error: function (error) {
            gpsStatus = false;
            showMsgBox("error", "Oops", "Sorry, but I'm not able to geolocate you.");
        },
        not_supported: function () {
            gpsStatus = false;
            //showMsgBox("error", "Oops", "Your browser does not support geolocation.");
        },
        always: function () {
            //Done!

            // this is, so far, the best position to callback gpsStatus
            // if mobile then refresh position & the traffic condition
            if (isMobile() && gpsStatus) {
                setInterval(followMe, 1000);
                setInterval(reloadTiles, 10 * 1000); // force refresh on mobile every 30s
                                                     // todo : refactor this by adding canvas off menu

                // add relocate-position control
                map.addControl({
                    id: 'goCenterUI',
                    position: 'right_bottom',
                    content: '<i class="fa fa-crosshairs fa-2x"></i>',
                    events: {
                        click: function () {
                            map.setCenter(geolocation);
                        }
                    }
                });

            }
        }
    });

}

function followMe() {
    GMaps.geolocate({
        success: function (position) {
            geolocation = {lat: position.coords.latitude, lng: position.coords.longitude};
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
    $('#msgBox').find('.modal-title').html(title);  //todo : use Handlebars ?
    $('#msgBox').find('.modal-body').html(body); //todo : use Handlebars ?

    $('#msgBox')
        .modal('show')
        .on('hidden.bs.modal', function (e) {
            $('#msgBox').removeClass(type);
        })
}

function resizeBootstrapMap() {
    var $map = $('#map');
    var mapParentWidth = $('#map_canvas').width();
    $map.width(mapParentWidth);
    $map.height($(window).height() - 100);
}

function reloadTiles() {
    console.debug('reloaded');
    var tiles = $("#map_canvas").find("img");
    for (var i = 0; i < tiles.length; i++) {
        var src = $(tiles[i]).attr("src");
        if (/googleapis.com\/vt\?pb=/.test(src)) {
            var new_src = src.split("&ts")[0] + '&ts=' + (new Date()).getTime();
            $(tiles[i]).attr("src", new_src);
        }
    }

    refreshSpiner();
}

function refreshSpiner() {
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


    // TYPEAHEAD  ---------
    var citiesBloodhound = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        //remote: 'api.php?q=%QUERY'
        remote: {
            url: 'api.php?q=%QUERY',
            wildcard: '%QUERY'
        }

    });

    $('#typeahead')
        .typeahead({
            minLength: 3,
            hint: true,
            highlight: true
        }, {
            limit: isMobile() ? 3 : undefined,
            name: 'cities',
            display: 'asciiname',
            source: citiesBloodhound,
            templates: {
                empty: [
                    '<div class="empty-message">',
                    'unable to find your city :(',
                    '</div>'
                ].join('\n'),
                suggestion: function (data) {
                    return '<p><img src="img/blank.gif" class="flag flag-' + data.country + '" alt="' + data.country + '" /> ' + data.asciiname + '</p>';
                }
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

