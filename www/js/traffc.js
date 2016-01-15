/**
 * hatem zidi (hatem.zidi@gmail.com) on 29/01/2015.
 *
 * Main App file
 */

var map;
var markers = [];
var geolocation;
var gpsStatus;
var storage = $.localStorage;
var browser = navigator.sayswho.toLowerCase();


document.addEventListener('deviceready', function () {

    //storage.set('_traffc_default_location', 0);
    //storage.set('_traffc_favorite_places', []);

    navigator.splashscreen.hide();

    //init settings if first usage
    if (!storage.isSet('_traffc_settings')) {
        storage.set('_traffc_settings', {"defaultZoom": 12, "nightMode": "off", "centerMap": "user"});
    }

    $('body').addClass(browser);

    resizeBootstrapMap(); // boostrap the map

    // init the map
    renderMap();

    geolocateMe();

    // get favorite places and set them on the map
    getFavoritePlaces();

    $(window).resize(resizeBootstrapMap); // force responsivness
    $('[data-toggle="tooltip"]').tooltip(); // init tooltips
    $('#refreshRate').selectpicker();

}, false);

