'use strict';

angular.module('traffc').directive('persona', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        scope: {
            announce: '@',
            status : '@', // up, stalker, crouch, hide
            isAlert : '@' // true/false
        },
        template: '<div class="navbar-brand" style="width : 100px ">' +
        '<a class="header-btn header-persona {{showStatus}}" ng-class="{\'persona-alert\': isAlert }" href="#">' +
        '<span class="tom-small-icon"></span>' +
        '<span class="header-btn-text">' +
        ' <span class="left-arrow"></span> ' +
        ' <span class="phrase">{{announce}}</span>' +
        '</span>' +
        '</a>' +
        '</div>',
        link: function ($scope, $elem, $attrs) {
            $scope.showStatus = 'persona-' + $attrs.status;


        }

    };
})
;