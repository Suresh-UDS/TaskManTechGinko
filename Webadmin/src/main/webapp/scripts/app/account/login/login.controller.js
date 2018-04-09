'use strict';

angular.module('timeSheetApp')
    .controller('LoginController', function ($rootScope, $scope, $state, $timeout, Auth) {
        $scope.user = {};
        $scope.errors = {};
        $scope.resLoader=false;
        $scope.rememberMe = true;
        $timeout(function (){angular.element('[ng-model="username"]').focus();});
        $scope.login = function (event) {
            event.preventDefault();
            Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberMe: $scope.rememberMe
            }).then(function () {
                $scope.authenticationError = false;
                if ($rootScope.previousStateName === 'register') {
                    $rootScope.isLoggedIn = true;
                    $state.go('dashboard');
                } else {
                    $rootScope.isLoggedIn = true;
                    $rootScope.back();
                }
                $scope.resLoader=true;
            }).catch(function () {
                $scope.authenticationError = true;
                $scope.resLoader=false;
            });
            $scope.resLoader=true;
        };

         //Loading Page go to top position
        $scope.loadPageTop = function(){
            //alert("test");
            //$("#loadPage").scrollTop();
            $("#loadPage").animate({scrollTop: 0}, 2000);
        }
    });
