/**
 * Created by tom on 26/11/2015.
 */


//todo comments and stuff
$(function () {
    $('#backToPosition').on('click', function () {
        map.setCenter(geolocation.lat, geolocation.lng);
        $('#map-location-search').removeClass('x onX').val('').change();
    });

    $('.whyModal').on('click', showWhyThisModal);
    $('.aboutModal').on('click', showAboutModal);

    $('#AddFavorite').on('click', setFavotireMarker);
    $('#addMarkerUI').on('click', function () {
        setFavotireMarker();
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

    $(document).on('touchstart click', '.edit_marker', function () {

        var marker = {
            id: undefined,
            lat: markers['fav'].lat,
            lng: markers['fav'].lng,
            name: $(this).parents('.input-group').find('#name').val()
        };

        map.markers[markers['fav'].id].infoWindow.close();
        map.removeMarker(map.markers[markers['fav'].id]);
        marker.id = addFavotireMarker(marker);

        var fav = storage.isSet('_traffc_favorite_places') ? storage.get('_traffc_favorite_places') : [];
        fav.push(marker);
        storage.set('_traffc_favorite_places', fav);

    });

    $(document).on('touchstart click', '.trash-btn', function () {
        var self = this;

        bootbox.confirm({
            className: "error",  //or warning
            title: "Are you sure ?",
            message: "You are about to delete a favorite place.",
            buttons: {
                confirm: {
                    label: "Yes!",
                    className: "btn-danger"
                }
            },
            callback: function (result) {
                if (result !== null) {

                    //search for the marker since the markers array indexes change after delete
                    var marker = $.grep(map.markers, function (e) {
                        return e.details.id !== undefined ? e.details.id == $(self).data('marker-index') : false;
                    });
                    map.removeMarker(marker[0]);

                    var fav = storage.get('_traffc_favorite_places');
                    fav.removeValue('id', $(self).data('marker-index'));
                    storage.set('_traffc_favorite_places', fav);
                }
            }
        });

    });

});