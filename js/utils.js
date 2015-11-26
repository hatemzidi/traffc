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

    $('#msgBox').addClass(type);
    $('#msgBox').find('.modal-title').html(title);  //todo : use Handlebars ?
    $('#msgBox').find('.modal-body').html(body); //todo : use Handlebars ?

    $('#msgBox')
        .modal('show')
        .on('hidden.bs.modal', function (e) {
            $('#msgBox').removeClass(type);
        })
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
    $map.height($(window).height() - 100);
}

