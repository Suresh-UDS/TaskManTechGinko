'use strict';

angular.module('timeSheetApp')
    .controller('LocationController', function ($rootScope, $scope, $state, $timeout, LocationComponent,ProjectComponent, SiteComponent, $http, $stateParams, $location) {

    		$scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorUserExists = null;
        $scope.validationError = null;
        $scope.validationErrorMsg = null;
        $scope.authorities = ["User", "Admin"];

        $timeout(function (){angular.element('[ng-model="name"]').focus();});

        $scope.pages = { currPage : 1};

        $scope.selectedProject;
        
        $scope.selectedSite;
        
        $scope.selectedBlock;
        
        $scope.selectedFloor;
        
        $scope.selectedZone;
        
        $scope.selectedLocation;
        
        $scope.location = {};
        
        $scope.projects;
        
        $scope.sites;
        
        $scope.blocks;
        
        $scope.floors;
        
        $scope.zones;
        
        $scope.locations;
        
        $scope.init = function(){
	        $scope.loading = true;
	        $scope.loadProjects();
	        $scope.loadLocations();
	        //$scope.search();
        };
        
        $scope.loadProjects = function () {
        		ProjectComponent.findAll().then(function (data) {
                $scope.projects = data;
            });
        };
        
        $scope.loadSites = function () {
        		ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
        			$scope.selectedSite = null;
                $scope.sites = data;
            });
        };
        
        $scope.loadLocations = function() {
        		LocationComponent.findAll().then(function(data) {
        			$scope.locations = data;
        		})
        }
        
        $scope.loadBlocks = function () {
	    		console.log('selected project -' + $scope.selectedProject.id + ', site -' + $scope.selectedSite.id)
	    		LocationComponent.findBlocks($scope.selectedProject.id,$scope.selectedSite.id).then(function (data) {
	    			$scope.selectedBlock = null;
	            $scope.blocks = data;
	        });
	    };
	    
	    $scope.loadFloors = function () {
	    		LocationComponent.findFloors($scope.selectedProject.id,$scope.selectedSite.id,$scope.selectedBlock).then(function (data) {
	    			$scope.selectedFloor = null;
	            $scope.floors = data;
	        });
	    };
	    
	    $scope.loadZones = function () {
	    		console.log('load zones - ' + $scope.selectedProject.id +',' +$scope.selectedSite.id +',' +$scope.selectedBlock +','+$scope.selectedFloor);
	    		LocationComponent.findZones($scope.selectedProject.id,$scope.selectedSite.id,$scope.selectedBlock, $scope.selectedFloor).then(function (data) {
	    			$scope.selectedZone = null;
	            $scope.zones = data;
	        });
	    };

        
        $scope.refreshPage = function() {
    			$scope.clearFilter();
    			$scope.loadLocations();
        }	
        
        $scope.loadLocations = function () {
	    		console.log('called loadLocations');
	    		$scope.search();
	    };        
        
        $scope.loadLocation = function(id) {
        		console.log('loadLocation -' + id);
        		LocationComponent.findOneLocation(id).then(function (data) {
        			$scope.location = data;
        			console.log('Location mapping retrieved - ' + JSON.stringify($scope.location));
                
            });

        };
        
        $scope.updateLocation = function () {
        		console.log('Location mapping details - ' + JSON.stringify($scope.location));
        		
        		LocationComponent.updateLocation($scope.location).then(function () {
	            	$scope.success = 'OK';
	            	$location.path('/locations');
	            }).catch(function (response) {
	                $scope.success = null;
	                console.log('Error - '+ response.data);
	                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
	                    $scope.errorChecklistExists = true;
	                } else if(response.status === 400 && response.data.message === 'error.validation'){
	                	$scope.validationError = true;
	                	$scope.validationErrorMsg = response.data.description;
	                } else {
	                    $scope.error = 'ERROR';
	                }
            });
        };
        
        $scope.saveLocation = function(){
        		$scope.location.projectName = $scope.selectedProject.name;
        		$scope.location.projectId = $scope.selectedProject.id;
        		$scope.location.siteId = $scope.selectedSite.id;
        		$scope.location.siteName = $scope.selectedSite.name;
        		$scope.location.block = $scope.selectedBlock;
        		$scope.location.floor = $scope.selectedFloor;
        		$scope.location.zone = $scope.selectedZone;
            console.log("Before pushing location to server");
            console.log(JSON.stringify($scope.location));
            LocationComponent.createLocation($scope.location).then(function(){
            		console.log("success");
  	        		$location.path('/locations');
  	        		//$scope.loadLocationItems();
  	        }).catch(function (response) {
  	            $scope.success = null;
  	            console.log(response.data);
  	            if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
  	                $scope.errorLocationExists = true;
  	            } else if(response.status === 400 && response.data.message === 'error.validation'){
  	            	$scope.validationError = true;
  	            	$scope.validationErrorMsg = response.data.description;
  	            } else {
  	                $scope.error = 'ERROR';
  	            }
  	        });              
        };
        
        $scope.search = function () {
            var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
            if(!$scope.searchCriteria) {
                var searchCriteria = {
                    currPage : currPageVal
                }
                $scope.searchCriteria = searchCriteria;
            }

            $scope.searchCriteria.currPage = currPageVal;
            console.log('Selected feedback' + $scope.selectedLocation);

            if(!$scope.selectedProject) {
                if($rootScope.searchCriteriaLocation) {
                    $scope.searchCriteria = $rootScope.searchCriteriaLocation;
                }else {
                    $scope.searchCriteria.findAll = true;
                }

            }else {
                if($scope.selectedProject) {
                    $scope.searchCriteria.findAll = false;
                    $scope.searchCriteria.projectId = $scope.selectedProject.id;
                    if($scope.selectedSite) {
                        $scope.searchCriteria.siteId = $scope.selectedSite.id;
                    }
                    if($scope.selectedBlock) {
                        $scope.searchCriteria.block = $scope.selectedBlock;
                    }
                    if($scope.selectedFloor) {
                        $scope.searchCriteria.floor = $scope.selectedFloor;
                    }
                    if($scope.selectedZone) {
                        $scope.searchCriteria.zone = $scope.selectedZone;
                    }
                }else {
                    $scope.searchCriteria.projectId = 0;
                }
            }
            console.log($scope.searchCriteria);
            LocationComponent.search($scope.searchCriteria).then(function (data) {
                $scope.locations = data.transactions;
                $scope.locationsLoader = true;
                console.log($scope.locations);
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                $scope.loading = false;
                if($scope.locations == null){
                    $scope.pages.startInd = 0;
                }else{
                    $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
                }

                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
                $scope.pages.totalCnt = data.totalCount;
                $scope.hide = true;
            });
            $rootScope.searchCriteriaLocation = $scope.searchCriteria;
            if($scope.pages.currPage == 1) {
                $scope.firstStyle();
            }
        };
        
        $scope.first = function() {
            if($scope.pages.currPage > 1) {
                $scope.pages.currPage = 1;
                $scope.firstStyle();
                $scope.search();
            }
        };

        $scope.firstStyle = function() {
            var first = document.getElementById('#first');
            var ele = angular.element(first);
            ele.addClass('disabledLink');
            var previous = document.getElementById('#previous');
            ele = angular.element(previous);
            ele.addClass('disabledLink');
            if($scope.pages.totalPages > 1) {
                var nextSitePage = document.getElementById('#next');
                var ele = angular.element(next);
                ele.removeClass('disabledLink');
                var lastSitePage = document.getElementById('#lastSitePage');
                ele = angular.element(lastSitePage);
                ele.removeClass('disabledLink');
            }

        }

        $scope.previous = function() {
            console.log("Calling previous")

            if($scope.pages.currPage > 1) {
                $scope.pages.currPage = $scope.pages.currPage - 1;
                if($scope.pages.currPage == 1) {
                    var first = document.getElementById('#first');
                    var ele = angular.element(first);
                    ele.addClass('disabled');
                    var previous = document.getElementById('#previous');
                    ele = angular.element(previous);
                    ele.addClass('disabled');
                }
                var next = document.getElementById('#next');
                var ele = angular.element(next);
                ele.removeClass('disabled');
                var lastSitePage = document.getElementById('#last');
                ele = angular.element(last);
                ele.removeClass('disabled');
                $scope.search();
            }

        };

        $scope.next = function() {
            console.log("Calling next")

            if($scope.pages.currPage < $scope.pages.totalPages) {
                $scope.pages.currPage = $scope.pages.currPage + 1;
                if($scope.pages.currPage == $scope.pages.totalPages) {
                    var next = document.getElementById('#next');
                    var ele = angular.element(next);
                    ele.addClass('disabled');
                    var last = document.getElementById('#last');
                    ele = angular.element(last);
                    ele.addClass('disabled');
                }
                var first = document.getElementById('#first')
                var ele = angular.element(first);
                ele.removeClass('disabled');
                var previous = document.getElementById('#previous')
                ele = angular.element(previous);
                ele.removeClass('disabled');
                $scope.search();
            }

        };

        $scope.last = function() {
            console.log("Calling last")
            if($scope.pages.currPage < $scope.pages.totalPages) {
                $scope.pages.currPage = $scope.pages.totalPages;
                if($scope.pages.currPage == $scope.pages.totalPages) {
                    var next = document.getElementById('#next');
                    var ele = angular.element(next);
                    ele.addClass('disabled');
                    var last = document.getElementById('#last');
                    ele = angular.element(last);
                    ele.addClass('disabled');
                }
                var first = document.getElementById('#first');
                var ele = angular.element(first);
                ele.removeClass('disabled');
                var previous = document.getElementById('#previous');
                ele = angular.element(previous);
                ele.removeClass('disabled');
                $scope.search();
            }

        };

        $scope.clearFilter = function() {
            $scope.selectedSite = null;
            $scope.selectedProject = null;
            $scope.selectedBlock = null;
            $scope.selectedFloor = null;
            $scope.selectedZone = null;
            $scope.searchCriteria = {};
            $rootScope.searchCriteriaSite = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            $scope.search();
        };
        
        $scope.cancelLocation = function () {
        		$location.path('/locations');
        };

      
      //init load
        $scope.initLoad = function(){ 
             $scope.loadPageTop(); 
             $scope.init(); 
         }

       //Loading Page go to top position
        $scope.loadPageTop = function(){
            //alert("test");
            //$("#loadPage").scrollTop();
            $("#loadPage").animate({scrollTop: 0}, 2000);

        }

        // Page Loader Function

        $scope.loadingStart = function(){ $('.pageCenter').show();}
        $scope.loadingStop = function(){
            
            console.log("Calling loader");
            $('.pageCenter').hide();
                    
        }

        $timeout(function() {
              $scope.loadingStop() ;
            }, 2000);

    });


