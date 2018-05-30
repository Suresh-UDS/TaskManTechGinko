'use strict';

angular.module('timeSheetApp')
    .controller('DashboardController', function ($timeout,$scope,$rootScope,DashboardComponent,JobComponent, $state,$http,$stateParams,$location) {
        $rootScope.loginView = false;
        if($rootScope.loginView == false){
            $(".content").removeClass("remove-mr");
            $(".main-panel").removeClass("remove-hght");
        }



    });
