/**
 * Created by tom on 26/11/2015.
 */


//todo comments and stuff
$(function () {
    $('#backToPosition').on('click', function () {
        map.setCenter(geolocation.lat, geolocation.lng);
        $('#map-location-search').removeClass('x onX').val('').change();
    });

    $('.whyModal').on('click',showWhyThisModal);
    $('.aboutModal').on('click',showAboutModal);

    $('#AddFavorite').on('click', addFavoriteMarker);
    $('#addMarkerUI').on('click', function () {
        addFavoriteMarker();
        $('#bs-main-menu').collapse('hide'); // collapse the nav menu 'immediately'
    });

    $('#AllFavorites').on('click', function () {
        showMsgBox("", "Favorites", "list of favorite places"); // on click, pin to that place
    });

    $('#refreshRate, #isRefreshable').on('change', function () {
        if ($('#isRefreshable').is(':checked')) {
            setInterval(reloadTiles, $('#refreshRate').val() * 1000);
        }
    });

    $(document).on('input', '.clearable', function () {
        $(this)[togFnClass(this.value)]('x');
    }).on('mousemove', '.x', function (e) {
        $(this)[togFnClass(this.offsetWidth - 18 < e.clientX - this.getBoundingClientRect().left)]('onX');
    }).on('touchstart click', '.onX, .x', function (ev) {
        ev.preventDefault();
        $(this).removeClass('x onX').val('').change();
        $(this).blur();
    });
});