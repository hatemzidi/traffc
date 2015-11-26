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


    // EVENTS  ---------
    $('#backToPosition').on('click', function () {
        map.setCenter(geolocation.lat, geolocation.lng);
    });

    $('#AddFavorite').on('click',addFavoriteMarker);
    $('#addMarkerUI').on('click',function() {
        addFavoriteMarker();
        $('#bs-main-menu').collapse('hide'); // collapse the nav menu 'immediately'
    });
    $('#AllFavorites').on('click',function () {
        showMsgBox("", "Favorites", "list of favorite places"); // on click, pin to that place
    });

    $('#refreshRate, #isRefreshable').on('change', function () {
        if ($('#isRefreshable').is(':checked')) {
            setInterval(reloadTiles, $('#refreshRate').val() * 1000);
        }
    });
});

