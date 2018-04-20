'use strict';

angular.module('timeSheetApp')
    .controller('InventoryController', function ($rootScope, $scope, $state, $timeout, ProjectComponent, SiteComponent,$http,$stateParams,$location) {

          
    	$rootScope.loginView = false;
    	$scope.search = function () {
        	var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
        	if(!$scope.searchCriteria) {
            	var searchCriteria = {
            			currPage : currPageVal
            	}
            	$scope.searchCriteria = searchCriteria;
        	}

        	$scope.searchCriteria.currPage = currPageVal;
        	console.log('Selected  module action -' + $scope.selectedInventorylist);

        	if(!$scope.selectedInventorylist) {
        		if($rootScope.searchCriteriaInventorylist) {
            		$scope.searchCriteria = $rootScope.searchCriteriaInventorylist;
        		}else {
        			$scope.searchCriteria.findAll = true;
        		}

        	}else {
	        	if($scope.selectedInventorylist) {
	        		$scope.searchCriteria.findAll = false;
		        	$scope.searchCriteria.inventorylistId = $scope.selectedInventorylist.id;
		        	$scope.searchCriteria.name = $scope.selectedInventorylist.name;
		        	$scope.searchCriteria.activeFlag = $scope.selectedInventorylist.activeFlag;
		        	console.log('selected inventory id ='+ $scope.searchCriteria.inventorylistId);
	        	}else {
	        		$scope.searchCriteria.inventorylistId = 0;
	        	}
        	}
        	console.log($scope.searchCriteria);
        	InventorylistComponent.search($scope.searchCriteria).then(function (data) {
                $scope.inventorylist = data.transactions;
                $scope.loadingStop();
                $scope.inventorylistLoader = true;
                console.log($scope.checklists);
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                if($scope.checklists == null){
                    $scope.pages.startInd = 0;
                }else{
                    $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
                }

                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
                $scope.pages.totalCnt = data.totalCount;
            	$scope.hide = true;
            });
        	$rootScope.searchCriteriaChecklist = $scope.searchCriteria;
        	if($scope.pages.currPage == 1) {
            	$scope.firstStyle();
        	}
        };


			//init load
			$scope.initLoad = function(){ 
			     $scope.loadPageTop(); 
			     $scope.loadInventory(); 
			     $scope.init(); 
			  
			 }

			//Loading Page go to top position
			$scope.loadPageTop = function(){
			    //alert("test");
			    //$("#loadPage").scrollTop();
			    $("#loadPage").animate({scrollTop: 0}, 2000);
			}

               // Page Loader Function

                $scope.loadingStart = function(){ $('.pageCenter').show();$('.overlay').show();}
                $scope.loadingAuto = function(){
                    $scope.loadingStart(); 
                    $scope.loadtimeOut = $timeout(function(){
                    
                    //console.log("Calling loader stop");
                    $('.pageCenter').hide();$('.overlay').hide();
                            
                }, 2000);
                   // alert('hi');
                }
                $scope.loadingStop = function(){
                    
                    console.log("Calling loader");
                    $('.pageCenter').hide();$('.overlay').hide();
                            
                }


    });
