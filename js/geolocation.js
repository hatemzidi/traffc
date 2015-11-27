/**
 * Created by tom on 25/11/2015.
 */



function renderMap() {

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
        styles: mapStyle.getStyle('light'),
        resize: function () {
            this.setCenter(geolocation);
        }
    });

    // traffic layer \o/
    map.addLayer('traffic');

    // add autocomplete
    var autocomplete = new google.maps.places.Autocomplete($("#map-location-search")[0]);
    autocomplete.bindTo('bounds', map);

    google.maps.event.addListener(autocomplete, "place_changed", function () {
        var places = autocomplete.getPlace();
        //todo why changing zoom ?
        places.geometry && (places.geometry.viewport ? map.fitBounds(places.geometry.viewport) : map.setCenter(places.geometry.location));

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
    GMaps.geolocate({
        success: function (position) {
            gpsStatus = true;

            geolocation = {lat: position.coords.latitude, lng: position.coords.longitude};

            map.setCenter(geolocation.lat, geolocation.lng);

            if (markers['user'] === undefined) {
                var marker = map.addMarker({
                    lat: geolocation.lat,
                    lng: geolocation.lng,
                    animation: google.maps.Animation.DROP,
                    details: {},
                    icon: {
                        url: "img/marker_user.png",
                        scaledSize: new google.maps.Size(40, 40)
                    }
                });
                markers['user'] = map.markers.indexOf(marker);

                //todo review this else, is it useful ?
            } else {
                map.markers[markers['user']].setPosition(new google.maps.LatLng(geolocation.lat, geolocation.lng));
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
                setInterval(followMe, 1000); // follow the user every 1 sec // todo add it to settings
                setInterval(reloadTiles, 10 * 1000); // force refresh on mobile every 30s // todo add it to settings

                // relocate-position control
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

                // add favorite location control
                map.addControl({
                    id: 'getFavoriteUI',
                    position: 'right_bottom',
                    content: '<i class="fa fa-heart fa-2x"></i>',
                    events: {
                        click: function () {
                            showMsgBox("", "Favorites", "list of favorite places"); // on click, pin to that place
                        }
                    }
                });

            }
        }
    });

}


function setFavotireMarker() {

    var template = $('#fav_marker_template').text();
    markers['fav'] = {id: undefined, lat: undefined, lng: undefined};

    var marker = map.addMarker({
        lat: geolocation.lat,
        lng: geolocation.lng,
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
            }
        },
        dragstart: function () {
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


function addFavotireMarker(d) {

    var marker = map.addMarker({
        lat: d.lat,
        lng: d.lng,
        animation: google.maps.Animation.DROP,
        icon: {
            url: "img/marker_fav.png",
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(9, 38)
        },
        details: {id: undefined},
        infoWindow: {
            content: '',
            maxWidth: 200
        },
        click: function () {
            map.panTo(new google.maps.LatLng(d.lat, d.lng));
        }
    });

    // get marker index and set it
    var template = $('#fav_marker').text();
    var index = d.id === undefined ? map.markers.indexOf(marker) : d.id;
    var content = template.replace(/{{name}}/g, d.name).replace(/{{index}}/g, index);
    marker.infoWindow.setContent(content);
    marker.details.id = index;
    return index;
}

function getFavoritePlaces() {

    var fav = storage.isSet('_traffc_favorite_places') ? storage.get('_traffc_favorite_places') : [];

    $.each(fav, function (i, item) {
        addFavotireMarker(item)
    });
}


function followMe() {
    GMaps.geolocate({
        success: function (position) {
            geolocation = {lat: position.coords.latitude, lng: position.coords.longitude};
            map.markers[markers['user']].setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        }
    });

}


function reloadTiles() {
    //debug console.debug('reloaded');
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