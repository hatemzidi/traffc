/**
 * Created by tom on 25/11/2015.
 */



function renderMap() {

    geolocation = getDefaultLocation();
    var settings = storage.get('_traffc_settings');

    map = new GMaps({
        div: '#map',
        lat: geolocation.lat,
        lng: geolocation.lng,
        zoom: settings.defaultZoom ? settings.defaultZoom : 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: false,
        rotateControl: false,
        scaleControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        styles: mapStyle.getStyle(),
        resize: function () {
            this.setCenter(geolocation);
        }
    });

    // show zoom control if not mobile
    if (!isMobile()) {
        map.setOptions({
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            }
        });
    } else {
        // show controls only on mobile
        // relocate-position control
        map.addControl({
            id: 'goCenterUI',
            position: 'left_bottom',
            content: '<i class="fa fa-crosshairs fa-2x"></i>',
            events: {
                click: function () {
                    map.setCenter(geolocation);
                }
            }
        });

        // get favorite places modal
        map.addControl({
            id: 'getFavoriteUI',
            position: 'right_bottom',
            content: '<i class="fa fa-heart fa-2x"></i>',
            events: {
                click: function () {
                    showFavoritePlacesModal();
                }
            }
        });

        // add favorite location control
        map.addControl({
            id: 'setFavoriteUI',
            position: 'right_bottom',
            content: '<i class="fa fa-flag fa-2x"></i>',
            events: {
                click: function () {
                    setFavotireMarker();
                }
            }
        });


    }

    // traffic layer \o/
    map.addLayer('traffic');

    // add autocomplete
    var autocomplete = new google.maps.places.Autocomplete($("#map-location-search")[0]);
    autocomplete.bindTo('bounds', map);

    google.maps.event.addListener(autocomplete, "place_changed", function () {
        var places = autocomplete.getPlace();
        //todo why changing zoom ?
        places.geometry && (places.geometry.viewport ? map.fitBounds(places.geometry.viewport) : map.setCenter(places.geometry.location));
        // resest autocomplete input field
        $("input.clearable").removeClass('x onX').val('').change();
    });

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


function geolocateMe() {

    var settings = storage.get('_traffc_settings');

    GMaps.geolocate({
        success: function (position) {
            gpsStatus = true;

            var location = {lat: position.coords.latitude, lng: position.coords.longitude};

            if (settings.centerMap === "user") {
                map.setCenter(location.lat, location.lng);
                geolocation = location;
            }

            var marker = map.addMarker({
                lat: location.lat,
                lng: location.lng,
                animation: google.maps.Animation.DROP,
                details: {id: undefined},
                icon: {
                    url: "img/marker_user.png",
                    scaledSize: new google.maps.Size(40, 40)
                }
            });
            marker.details.id = 'user';
        },
        error: function (error) {
            gpsStatus = false;
            showMsgBox("error", "Oops", "Sorry, I'm not able to geolocate you.<br/><span class='help-block'>Hint : You may have to check your privacy settings.</span>");
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
                setInterval(followMe, 1000); // follow the user every 1 sec  // todo add settings to center map when following
                setInterval(reloadTiles, 20 * 1000); // force refresh on mobile every 20s // todo may be add it to settings
            }
        }
    });

}


function setFavotireMarker() {

    var template = $('#fav_marker_template').text();

    // reset old marker and allow one fav marker at a time
    // fixbug : https://github.com/hatemzidi/traffc/issues/2
    if (markers['fav'] !== undefined) {
        map.removeMarker(map.markers[markers['fav'].id]);
        markers['fav'] = undefined;
    }


    var center = map.getCenter();
    markers['fav'] = {id: undefined, lat: center.lat(), lng: center.lng()};


    var marker = map.addMarker({
        lat: center.lat(),
        lng: center.lng(),
        draggable: true,
        animation: google.maps.Animation.DROP,
        icon: {
            url: "img/marker_pin.png",
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(9, 38)

        },
        details: {},
        infoWindow: {
            content: template,
            maxWidth: 300,
            closeclick: function () {
                map.removeMarker(map.markers[markers['fav'].id]);
                markers['fav'] = undefined;
            }
        },
        dragstart: function (e) {
            this.infoWindow.close();
        },
        dragend: function (e) {
            markers['fav'].lat = e.latLng.lat();
            markers['fav'].lng = e.latLng.lng();
            this.infoWindow.open(this.map, this);
        }
    });


    markers['fav'].id = map.markers.indexOf(marker);

}


function addFavotireMarker(data, defaultId) {

    var marker = map.addMarker({
        lat: data.lat,
        lng: data.lng,
        draggable: true,
        //animation: google.maps.Animation.DROP,
        icon: {
            url: "img/marker_fav.png",
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 35)
        },
        details: {id: undefined},
        infoWindow: {
            content: '',
            maxWidth: 400
        },
        click: function () {
            map.panTo(new google.maps.LatLng(data.lat, data.lng));
        }
    });

    // get marker index and set it
    var template = $('#fav_marker').text();
    var id = data.id === undefined ? map.markers.indexOf(marker) : data.id;
    var content = template.replace(/{{name}}/g, data.name).replace(/{{index}}/g, id);
    if (id == defaultId) {
        marker.setIcon({
            url: "img/marker_default.png",
            scaledSize: new google.maps.Size(30, 30),
            anchor: new google.maps.Point(15, 28)
        });
    }

    marker.infoWindow.setContent(content);
    marker.details.id = id;
    return id;
}

function getMarker(itemId) {
    //search for the marker since the markers array indexes change after delete
    return $.grep(map.markers, function (e) {
        return e.details.id !== undefined ? e.details.id == itemId : false;
    })[0];

}

function removeMarker(itemId) {
    var marker = getMarker(itemId);
    map.removeMarker(marker);
}

function removeMarkers() {

    var fav = storage.isSet('_traffc_favorite_places') ? storage.get('_traffc_favorite_places') : [];

    $.each(fav, function (i, item) {
        removeMarker(item.id);
    });
}

function getFavoritePlaces() {

    var fav = storage.isSet('_traffc_favorite_places') ? storage.get('_traffc_favorite_places') : [];
    var id = storage.isSet('_traffc_default_location') ? storage.get('_traffc_default_location') : 0;

    $.each(fav, function (i, item) {
        addFavotireMarker(item, id);
    });
}

function getDefaultLocation() {
    var l = {lat: 44.832500, lng: -0.593262}; // Bordeaux, France -- as Default :)

    var fav = storage.isSet('_traffc_favorite_places') ? storage.get('_traffc_favorite_places') : [];
    var id = storage.isSet('_traffc_default_location') ? storage.get('_traffc_default_location') : 0;

    if (fav.length !== 0 && id !== 0) {
        var p = $.grep(fav, function (e) {
            return e.id == id;
        })[0];
    }

    return !p ? l : p;

}

function followMe() {
    GMaps.geolocate({
        success: function (position) {
            geolocation = {lat: position.coords.latitude, lng: position.coords.longitude};
            var marker = getMarker('user');
            marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        }
    });

}


function reloadTiles() {
    //debug
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