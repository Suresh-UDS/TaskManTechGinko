'use strict';

angular.module('timeSheetApp')
    .controller('HeaderController', function ($rootScope,$scope, $location, $state,
        Auth, Principal, ENV, $interval) {
        $rootScope.isAuthenticated = Principal.isAuthenticated;
        $scope.$state = $state;
        $scope.inProduction = ENV === 'prod';
        console.log('admin -'+$state.includes('admin'));
        $scope.logout = function () {

            Auth.logout();
            $state.go('login');
        };

      // Session timeout
       $interval(function(){

        if($rootScope.isAuthenticated() == false){

             $scope.loadingStop();
             var absUrl = $location.absUrl();
             var array = absUrl.split("/");
             if(array[4] != ""){
                $rootScope.stateValue = array[4];
             }
             $state.go('login');

            }

        },0);

        // $scope.initscrollbar = function()
        //      {
        //          console.log("---- Calling scrollbar ---- ");
        //
        //        $('.sidebar .sidebar-wrapper').perfectScrollbar();
        //
        //      }
        //       $scope.initscrollbar();

        $rootScope.inits = function()
        {
               Principal.identity().then(function(response)
            {
                   //alert(response.firstName + response.lastName)
                 //console.log('current user' +JSON.stringify(response.login));
                 if(response.firstName != null){

                  $rootScope.accountNames = response.firstName;
                    if(response.lastName != null){
                     $rootScope.accountNames += " " + response.lastName;
                   }
                 }
                 else{
                    $rootScope.accountNames = response.login;
                 }

                 //alert($rootScope.accountName);

             });
        };

        $rootScope.inits();



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

         $scope.loadingStop = function(){

            //console.log("Calling loader");
            $('.pageCenter').hide();$('.overlay').hide();

        };


    });
