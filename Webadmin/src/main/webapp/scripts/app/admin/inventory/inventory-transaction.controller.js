'use strict';

angular.module('timeSheetApp')
    .controller('InventoryTransactionController', function ($rootScope, $scope, $state, $timeout, ProjectComponent, SiteComponent,$http,$stateParams,$location) {


       //init load
        $scope.initLoad = function(){ 
             $scope.loadPageTop(); 
             $scope.initPage(); 
          
         }

       //Loading Page go to top position
        $scope.loadPageTop = function(){
            //alert("test");
            //$("#loadPage").scrollTop();
            $("#loadPage").animate({scrollTop: 0}, 2000);
        }

        // Page Loader Function

                $scope.loadingStart = function(){ $('.pageCenter').show();}
                $scope.loadingAuto = function(){
                    $scope.loadingStart(); 
                    $scope.loadtimeOut = $timeout(function(){
                    
                    //console.log("Calling loader stop");
                    $('.pageCenter').hide();
                            
                }, 2000);
                   // alert('hi');
                }
                $scope.loadingStop = function(){
                    
                    console.log("Calling loader");
                    $('.pageCenter').hide();
                            
                }


    });
