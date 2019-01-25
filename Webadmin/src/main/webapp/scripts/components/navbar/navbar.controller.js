'use strict';

angular.module('timeSheetApp')
    .controller('NavbarController', function ($scope, $location, $state, Auth, Principal, ENV) {
        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.$state = $state;
        $scope.inProduction = ENV === 'prod';
        console.log('admin -'+$state.includes('admin'));
        $scope.logout = function () {
            Auth.logout();
            $state.go('login');
        };

        // $scope.initscrollbar = function()
        //      {
        //        $('#sidebarWrapper').perfectScrollbar();
        //      }
        //
        //      $scope.initscrollbar();

             /*Principal.identity().then(function(response)
             {
                 console.log('current user' +JSON.stringify(response.login));
                 $scope.accountName = response.login;
             });*/

    });
