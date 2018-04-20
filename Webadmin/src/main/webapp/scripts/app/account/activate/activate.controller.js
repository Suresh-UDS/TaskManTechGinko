'use strict';

angular.module('timeSheetApp')
    .controller('ActivationController', function ($scope, $stateParams, Auth) {
    	$rootScope.loginView = false;
        Auth.activateAccount({key: $stateParams.key}).then(function () {
            $scope.error = null;
            $scope.success = 'OK';
        }).catch(function () {
            $scope.success = null;
            $scope.error = 'ERROR';
        });
    });

