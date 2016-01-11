/**
 * Created by tom on 25/11/2015.
 */



function isMobile() {
    try {
        document.createEvent("TouchEvent");
        return true;
    }
    catch (e) {
        return false;
    }
}

function showMsgBox(type, title, body) {

    bootbox.alert({
        title: title,
        className: type,
        message: body,
        buttons: {
            ok: {
                label: "close",
                className: "btn-default"
            }
        }
    });
}


function refreshSpiner() {
    // add animation to the refresh button
    $('#refresh-btn').addClass('spin').delay(1000)
        .queue(function () {
            $(this).removeClass('spin');
            $(this).dequeue();
        });
}


function resizeBootstrapMap() {
    var $map = $('#map');
    var mapParentWidth = $('#map_canvas').width();
    $map.width(mapParentWidth);
    $map.height($(window).height() - 52);
}

//todo refactor this
function checkQueryString() {
    if (/^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/.test($.url().fparam('geo'))) {
        params.geo = $.url().fparam('geo');
        console.debug('geo :' + params.geo);
    }

    if (/^(?:yes|no)$/.test($.url().fparam('locate'))) {
        params.locate = $.url().fparam('locate');
        console.debug('geolocate :' + params.locate);
    }

    if (/^(?:yes|no)$/.test($.url().fparam('refresh'))) {
        params.refresh = $.url().fparam('refresh');
        console.debug('refresh :' + params.refresh);
    }


    if (/^0[1-9]|1[0-2]$/.test($.url().fparam('zoom'))) {
        params.zoom = $.url().fparam('zoom');
        console.debug('zoom :' + params.zoom);
    }
}


function togFnClass(v) {
    return v ? 'addClass' : 'removeClass';
}


function isEvening() {
    var now = new Date();

    // night mode is available from 18:00 to 06:00
    return (6 >= now.getHours() || now.getHours() >= 18);
}

Array.prototype.removeValue = function (name, value) {
    var array = $.map(this, function (v, i) {
        return v[name] === value ? null : v;
    });
    this.length = 0; //clear original array
    this.push.apply(this, array); //push all elements except the one we want to delete
};

navigator.sayswho = (function () {
    var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) return 'Opera ' + tem[1];
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M[0];
})();

