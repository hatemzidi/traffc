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
            /* jshint ignore:start */
            setInterval(reloadTiles, 5 * 1000); // update on mobile every 5sec
            /* jshint ignore:end */

            /* jshint ignore:start */
            // handle the back button
            document.addEventListener('backbutton', onBackKeyDown, true);

            document.addEventListener("menubutton", onMenuKeyDown, true);
            /* jshint ignore:end */

            // force all link to go to default browser
            $(document).on('click', 'a', function (event) {
                event.preventDefault();
                window.open($(this).attr('href'), '_system');
                return false;
            });

        }

        /* jshint ignore:start */
        resizeBootstrapMap();
        /* jshint ignore:end */
    };

    this.bindEvents = function () {
        document.addEventListener('deviceready', onDeviceReady, false);
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
