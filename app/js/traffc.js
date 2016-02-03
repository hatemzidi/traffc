'use strict';

angular.module('traffc', [
    'ngCookies',
    'ngSanitize',
    'uiGmapgoogle-maps',
    'ngGeolocation',
    'ngBootbox',
    'xeditable',
    'angular-bootstrap-select',
    'pascalprecht.translate',
    'LocalStorageModule'
]).config(['uiGmapGoogleMapApiProvider', 'localStorageServiceProvider', '$translateProvider', function (GoogleMapApi, $storage, $translateProvider) {

    $storage.setPrefix('traffc');

    GoogleMapApi.configure({
        //key: 'your api key',
        //v: '3.21',
        //sensor : true,
        //libraries: 'places'
    });

   // $translateProvider.useMissingTranslationHandlerLog();

    $translateProvider.useStaticFilesLoader({
        prefix: 'locales/locale-',
        suffix: '.json'
    });
    $translateProvider.determinePreferredLanguage();
   // $translateProvider.preferredLanguage('en_US');// is applied on first load

}]).run(['localStorageService', '$markers','editableOptions', function ($storage, $markers, editableOptions) {

    editableOptions.theme = 'bs3';
    editableOptions.blur = 'cancel';

    //init settings if first usage
    if (!$storage.get('_traffc_settings')) {
        $storage.set('_traffc_settings', {
            defaultZoom: 12,
            nightMode: false,
            centerMap: false
        });
    }

    //init list of places if first usage
    if (!$storage.get('_traffc_favorite_places')) {
        $storage.set('_traffc_favorite_places', []);
    }


    var places = $storage.get('_traffc_favorite_places');
    _.forEach(places, function (p) {

        $markers.set({
            id: p.id,
            isFavorite: p.isFavorite,
            coords: p.coords,
            label: p.label,
            icon: p.isFavorite ? 'img/marker_fav_place.3.png' : 'img/marker_place.png'
        });


    });

}]);