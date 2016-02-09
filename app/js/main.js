'use strict';

var CordovaInit = function () {

    var onDeviceReady = function () {
        receivedEvent('auto');
    };

    var receivedEvent = function (mode) {
        console.debug('Start event received ..');
        console.debug('Mode is ' + mode);

        console.debug('... bootstrapping application setup.');
        angular.bootstrap($('body'), ['traffc']);

        if (mode === 'auto') {
            $('body').addClass(device.platform.toLowerCase());

            // todo make this more angular compliant
            /* jshint ignore:start */
            setInterval(reloadTiles, 5 * 1000); // update on mobile every 5sec
            /* jshint ignore:end */

            // force all link to go to default browser
            $(document).on('click', 'a.external', function (event) {
                event.preventDefault();
                cordova.InAppBrowser.open($(this).attr('href'), '_blank', 'location=no, hardwareback=yes, toolbar=yes');
                return false;
            });

        } else {
            // force all link to go to default browser in manual/desktop mode
            $(document).on('click', 'a.external', function (event) {
                event.preventDefault();
                window.open($(this).attr('href'), '_blank');
                return false;
            });
        }

    };

    this.bindEvents = function () {
        document.addEventListener('deviceready', onDeviceReady, false);
        /* jshint ignore:start */
        // handle the back button
        document.addEventListener('backbutton', onBackKeyDown, true);

        // handle the menu button
        document.addEventListener('menubutton', onMenuKeyDown, true);

        //what to do on active
        document.addEventListener('resume', onResume, false);

        // what to do on pause
        document.addEventListener('pause', onPause, false);
        /* jshint ignore:end */
    };

    //If cordova is present, wait for it to initialize, otherwise just try to
    //bootstrap the application.
    if (window.cordova !== undefined) {
        console.debug('Cordova found, wating for device.');
        this.bindEvents();
    } else {
        console.debug('Cordova not found, booting application');
        receivedEvent('manual');
    }
};

angular.element(document).ready(function () {
    console.debug('Bootstrapping!');
    new CordovaInit();
});
