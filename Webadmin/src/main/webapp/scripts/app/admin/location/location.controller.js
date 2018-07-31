'use strict';

angular.module('timeSheetApp')
    .controller('LocationController', function ($rootScope, $scope, $state, $timeout,
        LocationComponent,ProjectComponent, SiteComponent, $http, $stateParams,
         $location,PaginationComponent ) {
        $rootScope.loadingStop();
        $rootScope.loginView = false;
    	$scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorUserExists = null;
        $scope.validationError = null;
        $scope.validationErrorMsg = null;
        $scope.authorities = ["User", "Admin"];
        $scope.searchCriteria = {};
        $scope.location ={};
        $scope.selectedProject = null;
        $scope.selectedSite = null;
        $scope.selectedBlock = null;
        $scope.selectedFloor = null;
        $scope.selectedZone = null;
        $scope.selectedLocation = null;
        $scope.pageSort = 10;
        $scope.pager = {};
        $scope.qrInfoBlock="";

        $timeout(function (){angular.element('[ng-model="name"]').focus();});

        $scope.loadProjectsList = function () {
        		ProjectComponent.findAll().then(function (data) {
                $scope.projectsList = data;
            });
        };

        $scope.loadSitesList = function () {
            SiteComponent.findAll().then(function (data) {
                $scope.sitesList = data;
            });
        };

         $scope.loadDepSites = function () {
            ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
                $scope.selectedSite = null;
                $scope.sitesList = data;
            });
        };

        $scope.loadLocationsList = function() {
        		LocationComponent.findAll().then(function(data) {
        			$scope.locationsList = data;
        		})
        }

        $scope.loadDepBlocks = function () {
	    		console.log('selected project -' + $scope.selectedProject.id + ', site -' + $scope.selectedSite.id)
	    		LocationComponent.findBlocks($scope.selectedProject.id,$scope.selectedSite.id).then(function (data) {
	    			$scope.selectedBlock = null;
	            $scope.blocksList = data;
	        });
	    };

	    $scope.loadDepFloors = function () {
	    		LocationComponent.findFloors($scope.selectedProject.id,$scope.selectedSite.id,$scope.selectedBlock).then(function (data) {
	    			$scope.selectedFloor = null;
	            $scope.floorsList = data;
	        });
	    };

	    $scope.loadDepZones = function () {
	    		console.log('load zones - ' + $scope.selectedProject.id +',' +$scope.selectedSite.id +',' +$scope.selectedBlock +','+$scope.selectedFloor);
	    		LocationComponent.findZones($scope.selectedProject.id,$scope.selectedSite.id,$scope.selectedBlock, $scope.selectedFloor).then(function (data) {
	    			$scope.selectedZone = null;
	            $scope.zonesList = data;
	        });
	    };


        $scope.refreshPage = function() {

    			$scope.loadLocations();
        };

        $scope.loadLocations = function () {
                $scope.clearFilter();
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

        $scope.isActiveAsc = 'id';
        $scope.isActiveDesc = '';

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveAsc = field;
            $scope.isActiveDesc = '';
            $scope.isAscOrder = true;
            //$scope.search();
            $scope.loadLocations();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
            //$scope.search();
            $scope.loadLocations();
        }

        $scope.searchFilter = function () {
            $scope.setPage(1);
            $scope.search();
         }

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
            //----
            if($scope.pageSort){
                $scope.searchCriteria.sort = $scope.pageSort;
            }

            if($scope.selectedColumn){

                $scope.searchCriteria.columnName = $scope.selectedColumn;
                $scope.searchCriteria.sortByAsc = $scope.isAscOrder;

            }else{
                $scope.searchCriteria.columnName ="id";
                $scope.searchCriteria.sortByAsc = true;
            }

             console.log("search criteria",$scope.searchCriteria);
                $scope.locations = '';
                $scope.locationsLoader = false;
                $scope.loadPageTop();

            LocationComponent.search($scope.searchCriteria).then(function (data) {
                $scope.locations = data.transactions;
                $scope.locationsLoader = true;

                // if($scope.locations){
                //     for(var i=0;i<$scope.locations.length;i++){
                //         var qr ={
                //             siteId:$scope.locations[i].siteId,
                //             locationId:$scope.locations[i].id
                //         };
                //         LocationComponent.createQr(qr).then(function(response){
                //
                //             console.log('response qr---',response);
                //
                //             var qrAry  = response.split('.');
                //             $scope.qr_img = qrAry[0];
                //             $scope.assetCode = qrAry[1];
                //             console.log('create qr---',qrAry);
                //
                //         });
                //         $scope.locations[i].qr_img = $scope.qr_img;
                //         console.log('qr')
                //         console.log($scope.locations[i]);
                //     }
                // }

                /*
                    ** Call pagination  main function **
                */
                $scope.pager = {};
                $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                $scope.totalCountPages = data.totalCount;

                console.log("Pagination",$scope.pager);
                console.log($scope.locations);

                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                $scope.loading = false;

                if($scope.locations && $scope.locations.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.locations.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10;

                }
            });

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
            //$scope.search();
        };

        $scope.cancelLocation = function () {
        		$location.path('/locations');
        };


      //init load

        $scope.initLoad = function(){
             $scope.loadPageTop();
             $scope.loading = true;
             $scope.loadLocations();
             $scope.setPage(1);
             if($stateParams.location){
                 $scope.qrcodePage($stateParams.location);
             }
         };



       /*
        ** Pagination init function **
        @Param:integer

       */

        $scope.setPage = function (page) {

            if (page < 1 || page > $scope.pager.totalPages) {
                return;
            }

            //alert(page);
            $scope.pages.currPage = page;
            $scope.search();
        };

            $scope.generateQR = function(qrDetails){
            // var qr = {
            //     siteId:siteId,
            //     locationId:locationId
            // };
            // console.log(qr.siteId);
            // console.log(qr.locationId);
            // LocationComponent.createQr(qr).then(function(response){
            LocationComponent.generateQR(qrDetails).then(function(response){

                console.log('response qr---',response);
                var qrAry  = response.split('.');
                $scope.qr_img = qrAry[0];
                $scope.assetCode = qrAry[1];
                var eleId = 'qrImage';
                var ele = document.getElementById(eleId);
                    ele.setAttribute('src',$scope.qr_img);
                // console.log('create qr---',$scope.qr_img);

            });
        }

        $scope.loadQRImage = function(image,qId) {
            var eleId = 'qrImage';
            var ele = document.getElementById(eleId);
            ele.setAttribute('src',image);
        };

        $scope.printDiv = function(printable) {
            var printContents = document.getElementById(printable).innerHTML;
            var originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
        }

        $scope.printPage = function () {
            window.print();
        }

        $scope.qrcodePage = function(){
            console.log($stateParams.location);
            LocationComponent.findOne($stateParams.location).then(function (response) {
                console.log(response);
                $scope.qrInfoDetails  = response;
                // $scope.generateQR(response.siteId,response.id);
                $scope.generateQR(response);
            })
        }



    });




