/**
 * Created by tom on 26/11/2015.
 */

function showWhyThisModal() {
    bootbox.alert({
        title: "Why this?",
        message: '<p>It started when I became sick of visiting ugly, complicated and ad-heavy websites or having to use mobile apps for such a simple need : ' +
        'quickly checking the traffic condition in my area.</p>' +
        '<p>I wanted a minimalistic, flat and yet light view where I can check for traffic jams ' +
        'quickly even on my mobile without waiting for very long or being bothered clicking around here and there. </p>' +
        '<p>Here is <span class="brand normal">traffc</span>, my new road companion and maybe yours too. Enjoy ;)</p>',
        buttons: {
            ok: {
                label: "Close",
                className: "btn-default"
            }
        }
    });
}

function showAboutModal() {
    bootbox.alert({
        title: "About",
        message: '<p>Made [quickly] by Hatem Zidi (<a href="http://twitter.com/tom_z" target="_blank">@tom_z</a>)</p>' +
        '<p>Feel free to contribute on <a href="https://github.com/hatemzidi/traffc" target="_blank">Github</a>.</p>' +
        '<p>Visit <a href="http://whatis.traffc.info" target="_blank">http://whatis.traffc.info</a> for more info.</p>' +
        '<p>&copy; 2015 &hyphen; <span class="version">v 0.8.5 (__VERSION__)</span></p>',
        buttons: {
            ok: {
                label: "Close",
                className: "btn-default"
            }
        }
    });
}


function showFavoritePlacesModal() {
    //prepare data
    var fav = storage.isSet('_traffc_favorite_places') ? storage.get('_traffc_favorite_places') : [];
    var id = storage.isSet('_traffc_default_location') ? storage.get('_traffc_default_location') : 0;


    //prepare template
    var template = $('#fav_places').text();
    var content = '', text = '';

    $.each(fav, function (i, item) {
        text = template.replace(/{{name}}/g, item.name).replace(/{{index}}/g, item.id).replace(/^\s+|\s+$/g, '');
        if (id === item.id) {
            text = text.replace('-default', '-warning').replace('-empty', '');
        }
        content += text;
    });

    content = '<div class="places-grid">' + content + '</div>';

    //show modal
    bootbox.alert({
        title: "Places",
        message: content,
        buttons: {
            ok: {
                label: "Close",
                className: "btn-default"
            }
        }
    });

    $('.place-name').editable({
        mode : 'inline',
        escape : true,
        type: 'text',
        title: 'Enter name',
        success: function (response, newValue) {
            var self = this;
            var fav = storage.get('_traffc_favorite_places');

            var p = $.grep(fav, function (e) {
                return e.id == $(self).data('marker-index');
            })[0];
            fav.removeValue('id', $(self).data('marker-index'));

            p.name = newValue;
            fav.push(p);
            storage.set('_traffc_favorite_places', fav);

            //todo make this less complecated
            //refresh all markers
            removeMarkers();
            getFavoritePlaces();
        }
    });

}

function showSettingsModal() {
    //prepare data
    var settings = storage.isSet('_traffc_settings') ? storage.get('_traffc_settings') : {};


    //prepare template
    var template = $('#settings').text();
    var content = '<div class="settings-grid">' + template + '</div>';

    //show modal
    bootbox.alert({
        title: "Settings",
        message: content,
        buttons: {
            ok: {
                label: "Close",
                className: "btn-default"
            }
        }
    }).init(function () {
        $('#zoomRange').val(settings.defaultZoom);
        $('.zoom-label').html(settings.defaultZoom);
        $('#centermap').attr("checked", settings.centerMap === "location");
        $('#nightmode').attr("checked", settings.nightMode === "on");
    });

    $('#zoomRange').on('input change', function () {
        var range = parseInt($(this).val());
        settings.defaultZoom = range;
        $(".zoom-label").html(range);
        storage.set('_traffc_settings', settings);
    });

    $('#centermap').on('change', function () {
        settings.centerMap = $(this).is(':checked') ? "location" : "user";
        storage.set('_traffc_settings', settings);
    });

    $('#nightmode').on('change', function () {
        settings.nightMode = $(this).is(':checked') ? "on" : "off";
        storage.set('_traffc_settings', settings);
    });


}