'use strict';

angular.module('traffc', [
    'ngCookies',
    'ngSanitize',
    'uiGmapgoogle-maps',
    'ngGeolocation',
    'ngBootbox',
    'xeditable',
    'angular-bootstrap-select',
    'LocalStorageModule'
]).config(['uiGmapGoogleMapApiProvider', 'localStorageServiceProvider', function (GoogleMapApi, $storage) {

    $storage.setPrefix('traffc');

    GoogleMapApi.configure({
        //key: 'your api key',
        //v: '3.21',
        //sensor : true,
        //libraries: 'places'
    });

}]).run(['localStorageService', '$markers','editableOptions', function ($storage, $markers, editableOptions) {

    editableOptions.theme = 'bs3';
    editableOptions.blur = 'cancel';

    //init settings if first usage
    if (!$storage.get('_traffc_settings')) {
        $storage.set('_traffc_settings', {
            defaultZoom: 12,
            nightMode: 'off',
            centerMap: 'user'
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