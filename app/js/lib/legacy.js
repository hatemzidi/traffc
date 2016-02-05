'use strict';

var pause = false;

function resizeBootstrapMap() {
    console.debug('window resized');
    var $map = $('#map');
    var mapParentWidth = $('#map_canvas').width();
    $map.width(mapParentWidth);

    var headerHeight = $('nav.header').height();

    var minus = 0;
    if (headerHeight !== 0) {
        minus = 52;
    }

    $map.height($(window).height() - minus);

}


function togFnClass(v) {
    return v ? 'addClass' : 'removeClass';
}

function reloadTiles() {

    if (!pause) {
        //debug
        console.debug('reload layer.');


        var tiles = $('#map_canvas').find('img');
        for (var i = 0; i < tiles.length; i++) {
            var src = $(tiles[i]).attr('src');
            if (/\/vt\?pb=/.test(src)) {
                var newSrc = src.split('&ts')[0] + '&ts=' + (new Date()).getTime();
                $(tiles[i]).attr('src', newSrc);
            }
        }

        refreshSpiner();
    }
}

function refreshSpiner() {
    // add animation to the refresh button
    $('#refresh-btn').addClass('spin').delay(1000)
        .queue(function () {
            $(this).removeClass('spin');
            $(this).dequeue();
        });
}

function onBackKeyDown(e) {
    // Handle the back button
    console.debug('backButton triggered');
    $('.offcanvas').offcanvas('hide');
    e.preventDefault();
}

function onMenuKeyDown(e) {
    // Handle the menu button
    console.debug('menuButton triggered');
    $('.offcanvas').offcanvas('show');
    e.preventDefault();
}


function onPause(e) {
    // Handle the back button
    console.debug('traffc is put on Background');
    pause = true;
    e.preventDefault();
}

function onResume(e) {
    // Handle the back button
    console.debug('traffc is resumed');
    pause = false;
    e.preventDefault();
}

//todo any bower equivalent here ?
navigator.sayswho = (function () {
    var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/);
        if (tem !== null) {
            return 'Opera ' + tem[1];
        }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) !== null) {
        M.splice(1, 1, tem[1]);
    }

    return M[0];
})();

//todo refactor into angular
$(function () {

    $(window).resize(resizeBootstrapMap); // force responsivness

    $('body').addClass(navigator.sayswho.toLowerCase());

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


    $('#refreshRate, #isRefreshable').on('change', function () {
        if ($('#isRefreshable').is(':checked')) {
            setInterval(reloadTiles, $('#refreshRate').val() * 1000);
        }
    });


});


