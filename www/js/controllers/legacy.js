'use strict';

//todo refactor into angular
$(function () {

    $(window).resize(resizeBootstrapMap); // force responsivness

    $('[data-toggle="tooltip"]').tooltip();

    $(document).on('input', '.clearable', function () {
        $(this)[togFnClass(this.value)]('x');
    }).on('mousemove', '.x', function (e) {
        $(this)[togFnClass(this.offsetWidth - 18 < e.clientX - this.getBoundingClientRect().left)]('onX');
    }).on('touchstart click', '.onX, .x', function (ev) {
        ev.preventDefault();
        $(this).removeClass('x onX').val('').change();
        $(this).blur();
    });


    resizeBootstrapMap();


    function resizeBootstrapMap() {
        var $map = $('#map');
        var mapParentWidth = $('#map_canvas').width();
        $map.width(mapParentWidth);
        $map.height($(window).height() - 52);

    }

    function togFnClass(v) {
        return v ? 'addClass' : 'removeClass';
    }


    $('#refreshRate, #isRefreshable').on('change', function () {
        if ($('#isRefreshable').is(':checked')) {
            setInterval(reloadTiles, $('#refreshRate').val() * 1000);
        }
    });

    function reloadTiles() {
        //debug
        console.debug('reload layer.');
        var tiles = $('#map_canvas').find('img');
        for (var i = 0; i < tiles.length; i++) {
            var src = $(tiles[i]).attr('src');
            if (/\/vt\?pb=/.test(src)) {
                var new_src = src.split('&ts')[0] + '&ts=' + (new Date()).getTime();
                $(tiles[i]).attr('src', new_src);
            }
        }

        refreshSpiner();
    }

    function refreshSpiner() {
        // add animation to the refresh button
        $('#refresh-btn').addClass('spin').delay(1000)
            .queue(function () {
                $(this).removeClass('spin');
                $(this).dequeue();
            });
    }


});