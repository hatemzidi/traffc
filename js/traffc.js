/**
 * hatem zidi (hatem.zidi@gmail.com) on 29/01/2015.
 *
 * Main App file
 */

var map;
var marker = undefined;
var geolocation;
var gpsStatus;


$(function () {

    resizeBootstrapMap(); // boostrap the map

    // init the map
    renderMap();

    // geolcate now !
    geolocateMe();

    $(window).resize(resizeBootstrapMap); // force responsivness
    $('[data-toggle="tooltip"]').tooltip(); // init tooltips
    $('#refreshRate').selectpicker();


});

