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
        showFavoritePlacesModal();
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

        return false;
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
                if (result === true) {

                    removeMarker($(self).data('marker-index'));

                    //remove the line from the grid
                    $(self).closest('.row').remove();

                    var fav = storage.get('_traffc_favorite_places');
                    fav.removeValue('id', $(self).data('marker-index'));
                    storage.set('_traffc_favorite_places', fav);
                }
            }
        });

        return false;
    });


    $(document).on('touchstart click', '.pin-btn', function () {
        var self = this;
        var fav = storage.get('_traffc_favorite_places');

        var p = $.grep(fav, function (e) {
            return e.id == $(self).data('marker-index');
        })[0];

        map.panTo(new google.maps.LatLng(p.lat, p.lng));
        return false;
    });

    $(document).on('touchstart click', '.fav-btn', function () {
        var self = this;
        var defaultPlace;


        //todo and what about toggle ?
        if ( $(self).hasClass('btn-default')) {
            var other = $(self).parents('.places_grid').find('.btn-warning');
            other.removeClass('btn-warning').addClass('btn-default');
            other.find('span').removeClass('glyphicon-star').addClass('glyphicon-star-empty');


            $(self).removeClass('btn-default').addClass('btn-warning');
            $(self).find('span').removeClass('glyphicon-star-empty').addClass('glyphicon-star');
            //todo set marker with a default icon
            defaultPlace = $(self).data('marker-index');
        } else {
            $(self).removeClass('btn-warning').addClass('btn-default');
            $(self).find('span').removeClass('glyphicon-star').addClass('glyphicon-star-empty');
            defaultPlace = 0;
        }

        storage.set('_traffc_default_location', defaultPlace);

        removeMarkers();
        getFavoritePlaces();
        return false;
    });





});