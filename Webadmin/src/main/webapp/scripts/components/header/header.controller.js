'use strict';

angular.module('timeSheetApp')
    .controller('HeaderController', function ($rootScope,$scope, $location, $state, 
        Auth, Principal, ENV, $timeout) {
        $rootScope.accountName;
        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.$state = $state;
        $scope.inProduction = ENV === 'prod';
        console.log('admin -'+$state.includes('admin'));
        $scope.logout = function () {

            Auth.logout();
            $state.go('login');
        };


         $timeout(function(){
            
             if($scope.isAuthenticated() == false){  

             Auth.logout();
             $state.go('login');
         
            }

        },5 * 60 * 1000);

        $scope.initscrollbar = function()
             {
               $('#sidebarWrapper').perfectScrollbar();

             }
              $scope.initscrollbar();

        $rootScope.inits = function()
        {
               Principal.identity().then(function(response)
            {
                   //alert(response.firstName + response.lastName)
                 console.log('current user' +JSON.stringify(response.login));
                 if(response.firstName != null){

                  $rootScope.accountName = response.firstName;
                    if(response.lastName != null){
                     $rootScope.accountName += " " + response.lastName;
                   }
                 }else{
                    $rootScope.accountName = response.login;
                 }

                 //alert($rootScope.accountName);
                 
             });
        };
             
             

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
