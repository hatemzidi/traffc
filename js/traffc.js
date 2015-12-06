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


$(function () {

    //storage.set('_traffc_default_location', 0);
    //storage.set('_traffc_favorite_places', []);

    $('body').addClass(browser);

    resizeBootstrapMap(); // boostrap the map

    // init the map
    renderMap();

    // geolcate now !
    geolocateMe();

    // get favorite places and set them on the map
    getFavoritePlaces();

    $(window).resize(resizeBootstrapMap); // force responsivness
    $('[data-toggle="tooltip"]').tooltip(); // init tooltips
    $('#refreshRate').selectpicker();


});

