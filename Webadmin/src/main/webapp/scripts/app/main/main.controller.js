'use strict';

angular.module('timeSheetApp')
    .controller('MainController', function ($scope, Principal) {
        Principal.identity().then(function(account) {
        	$scope.msg ="";
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
            if(account.login){
            	$scope.msg = "Manage all projects and employee information here.";
            }
            
        });
    });
