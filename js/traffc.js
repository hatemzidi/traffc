/**
 * hatem zidi (hatem.zidi@gmail.com) on 29/01/2015.
 *
 * Main App file
 */

var map;
var marker = undefined;
var favmarker = undefined;
var geolocation;
var gpsStatus;
var storage = $.localStorage;


$(function () {

    resizeBootstrapMap(); // boostrap the map

    // init the map
    renderMap();

    // geolcate now !
    geolocateMe();

    // get favorite palces
    getFavoritePlaces();

    $(window).resize(resizeBootstrapMap); // force responsivness
    $('[data-toggle="tooltip"]').tooltip(); // init tooltips
    $('#refreshRate').selectpicker();


});

