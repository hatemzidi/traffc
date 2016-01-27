'use strict';

angular.module('traffc')
    .controller('modalCtrl', ['$scope', '$ngBootbox', '$settings',
        function ($scope, $ngBootbox, $settings) {

            // view
            $scope.settings = $settings.get();


            //todo optimize this, extend with buttons
            $scope.settingsModalOptions = {
                title: 'Settings',
                templateUrl: 'views/settings-modal.tpl.html',
                buttons: {
                    ok: {
                        label: 'Close',
                        className: 'btn-default'
                    }

                }
            };

            $scope.whyThisModalOptions = {
                title: 'Why this?',
                templateUrl: 'views/whyThis-modal.tpl.html',
                buttons: {
                    ok: {
                        label: 'Close',
                        className: 'btn-default'
                    }

                }
            };

            $scope.aboutModalOptions = {
                title: 'About',
                templateUrl: 'views/about-modal.tpl.html',
                buttons: {
                    ok: {
                        label: 'Close',
                        className: 'btn-default'
                    }

                }
            };

            $scope.placesModalOptions = {
                title: 'Places',
                templateUrl: 'views/favoritePlaces-modal.tpl.html',
                buttons: {
                    ok: {
                        label: 'Close',
                        className: 'btn-default'
                    }

                }
            };

            $scope.errorModalOptions = {
                title: 'Oops',
                className : 'error',
                templateUrl: 'views/gpsError-modal.tpl.html',
                buttons: {
                    ok: {
                        label: 'Close',
                        className: 'btn-default'
                    }

                }
            };

            $scope.$on('modals.GPSError', function(){
                $ngBootbox.customDialog($scope.errorModalOptions);
            });

            $scope.$on('modals.showPlaces', function(){
                $ngBootbox.customDialog($scope.placesModalOptions);
            });

            $scope.$watch('settings', function (nv, ov) {
                if (!_.isEqual(nv, ov)) {
                    $settings.set(nv);
                }
            }, true);

        }]);
