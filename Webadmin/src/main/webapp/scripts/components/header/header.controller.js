'use strict';

angular.module('timeSheetApp')
    .controller('HeaderController', function ($scope, $location, $state, Auth, Principal, ENV) {
        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.$state = $state;
        $scope.inProduction = ENV === 'prod';
        console.log('admin -'+$state.includes('admin'));
        $scope.logout = function () {
            Auth.logout();
            $state.go('login');
        };

        $scope.initscrollbar = function()
             {
               $('#sidebarWrapper').perfectScrollbar();
             }

             $scope.initscrollbar();
             
             Principal.identity().then(function(response)
             {
                 console.log('current user' +JSON.stringify(response.login));
                 $scope.accountName = response.login;
             });

        $('#minimizeSidebar').click(function() {
            var $btn = $(this);

            if (md.misc.sidebar_mini_active == true) {
                $('body').removeClass('sidebar-mini');
                md.misc.sidebar_mini_active = false;
            } else {
                $('body').addClass('sidebar-mini');
                md.misc.sidebar_mini_active = true;
            }

            // we simulate the window Resize so the charts will get updated in realtime.
            var simulateWindowResize = setInterval(function() {
                window.dispatchEvent(new Event('resize'));
            }, 180);

            // we stop the simulation of Window Resize after the animations are completed
            setTimeout(function() {
                clearInterval(simulateWindowResize);
            }, 1000);
        });
   

    });
