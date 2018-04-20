'use strict';

angular.module('timeSheetApp')
    .controller('LogsController', function ($scope, LogsService) {
    	$rootScope.loginView = false;
        $scope.loggers = LogsService.findAll();

        $scope.changeLevel = function (name, level) {
            LogsService.changeLevel({name: name, level: level}, function () {
                $scope.loggers = LogsService.findAll();
            });
        };
    });
