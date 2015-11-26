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


    // TYPEAHEAD  ---------
    var citiesBloodhound = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        //remote: 'api.php?q=%QUERY'
        remote: {
            url: 'api.php?q=%QUERY',
            wildcard: '%QUERY'
        }

    });

    $('#typeahead')
        .typeahead({
            minLength: 3,
            hint: true,
            highlight: true
        }, {
            limit: isMobile() ? 3 : undefined,
            name: 'cities',
            display: 'asciiname',
            source: citiesBloodhound,
            templates: {
                empty: [
                    '<div class="empty-message">',
                    'unable to find your city :(',
                    '</div>'
                ].join('\n'),
                suggestion: function (data) {
                    return '<p><img src="img/blank.gif" class="flag flag-' + data.country + '" alt="' + data.country + '" /> ' + data.asciiname + '</p>';
                }
            }
        })
        .on('typeahead:selected', function (e, datum) {
            map.setCenter(datum.latitude, datum.longitude);
        });


    // EVENTS  ---------
    $('#backToPosition').on('click', function () {
        map.setCenter(geolocation.lat, geolocation.lng);
    });

    $('#AddFavorite').on('click',addFavoriteMarker);
    $('#AllFavorites').on('click',function () {
        showMsgBox("", "Favorites", "list of favorite places"); // on click, pin to that place
    });




    $('#refreshRate, #isRefreshable').on('change', function () {
        if ($('#isRefreshable').is(':checked')) {
            setInterval(reloadTiles, $('#refreshRate').val() * 1000);
        }
    });
});

