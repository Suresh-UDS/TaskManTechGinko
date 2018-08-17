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
        $scope.location = {};
        $scope.selectedProject = null;
        $scope.selectedSite = null;
        $scope.selectedBlock = null;
        $scope.selectedFloor = null;
        $scope.selectedZone = null;
        $scope.searchSite = null;
        $scope.searchProject = null;
        $scope.searchBlock = null;
        $scope.searchFloor = null;
        $scope.searchZone = null;
        $scope.selectedLocation = null;
        $scope.pages = {currPage: 1};
        $scope.pageSort = 10;
        $scope.pager = {};
        $scope.noData = false;
        $rootScope.conformText = null;
        $scope.sitesList = null;
        $scope.qrInfoBlock = "";
        $scope.siteSpin = false;

        $timeout(function () {
            angular.element('[ng-model="name"]').focus();
        });

        $scope.clientDisable = true;
        $scope.loadProjectsList = function () {
            ProjectComponent.findAll().then(function (data) {
                $scope.projectsList = data;
                for(var i=0;i<$scope.projectsList.length;i++)
                {
                    $scope.uiClient[i] = $scope.projectsList[i].name;
                }
                $scope.clientDisable = false;
                $scope.clientFilterDisable = false;
            });
        };

        $scope.loadSitesList = function () {
            SiteComponent.findAll().then(function (data) {
                $scope.sitesList = data;
            });
        };

        // Filter //

        $scope.siteSpin = false;

        //




        // Load Clients for selectbox //
        $scope.clienteDisable = true;
        $scope.clientFilterDisable = true;
        $scope.uiClient = [];
        $scope.getClient = function (search) {
            var newSupes = $scope.uiClient.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }

            return newSupes;
        }

        //

        $scope.loadBloack = function(selectedSite)
        {
            $scope.selectedSite = $scope.sitesList[$scope.uiSite.indexOf(selectedSite)]
            console.log("==========Selected sites ==========");
            console.log($scope.selectedProject);
            console.log($scope.selectedSite);
        }




        //Load sites for selectbox//

         $scope.loadDepSites = function (selectedProject) {
             $scope.selectedProject = $scope.projectsList[$scope.uiClient.indexOf(selectedProject)]
             $scope.searchProject = $scope.projectsList[$scope.uiClient.indexOf(selectedProject)]
             $scope.siteSpin = true;
             $scope.siteDisable = true;
             $scope.selectedSite = null;
             $scope.hideSite = false;
            if(jQuery.isEmptyObject($scope.selectedProject) == false) {
                   var depProj=$scope.selectedProject.id;
            }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                    var depProj=$scope.searchProject.id;
            }else{
                    var depProj=0;
            }

            ProjectComponent.findSites(depProj).then(function (data) {
                $scope.selectedSite = null;
                $scope.sitesList = data;
                for(var i=0;i<$scope.sitesList.length;i++)
                {
                    $scope.uiSite[i] = $scope.sitesList[i].name;
                }
                $scope.siteDisable = false;
                $scope.siteSpin = false;
                $scope.siteFilterDisable = false;
            });
        };


        $scope.siteFilterDisable = true;
        $scope.siteDisable = true;
        $scope.uiSite = [];
        $scope.getSites = function (search) {

            var newSupes = $scope.uiSite.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }
            return newSupes;
        }

        //



        $scope.loadLocationsList = function() {
        		LocationComponent.findAll().then(function(data) {
        			$scope.locationsList = data;
        		})
        }

        $scope.loadDepBlocks = function (site) {
            $scope.searchSite = $scope.sitesList[$scope.uiSite.indexOf(site)]
            $scope.hideSite = true;
            $scope.hideBlock = false;
            if(jQuery.isEmptyObject($scope.selectedProject) == false) {

                   var depProj=$scope.selectedProject.id;
            }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                    var depProj=$scope.searchProject.id;
            }else{
                    var depProj=0;
            }
            if(jQuery.isEmptyObject($scope.selectedSite) == false) {
                  console.log('selected project -' + $scope.selectedProject.id + ', site -' + $scope.selectedSite.id);
                   var depSite=$scope.selectedSite.id;
            }else if(jQuery.isEmptyObject($scope.searchSite) == false){
                    var depSite=$scope.searchSite.id;
            }else{
                    var depSite=0;
            }
	    		LocationComponent.findBlocks(depProj,depSite).then(function (data) {
	    			$scope.selectedBlock = null;
	            $scope.blocksList = data;

	            //
                    for(var i=0;i<$scope.blocksList.length;i++)
                    {
                        $scope.uiBlock[i] = $scope.blocksList[i];
                    }
                    console.log($scope.uiBlock)
                    $scope.blockDisable = false;
                    $scope.blockSpin = false;
                    $scope.blockFilterDisable = false;
	        });
	    };


        // Load Blocks for selectbox //
        $scope.blockFilterDisable = true;
        $scope.BlockDisable = true;
        $scope.uiBlock = [];
        $scope.getBlock = function (search) {
            var newSupes = $scope.uiBlock.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }

            return newSupes;
        }

        //


	    $scope.loadDepFloors = function (searchBlock) {

            $scope.hideBlock = true;
            $scope.hideFloor = false;
            $scope.searchBlock = searchBlock;
            if(jQuery.isEmptyObject($scope.selectedProject) == false) {
                   var depProj=$scope.selectedProject.id;
            }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                    var depProj=$scope.searchProject.id;
            }else{
                    var depProj=0;
            }
            if(jQuery.isEmptyObject($scope.selectedSite) == false) {
                   var depSite=$scope.selectedSite.id;
            }else if(jQuery.isEmptyObject($scope.searchSite) == false){
                    var depSite=$scope.searchSite.id;
            }else{
                    var depSite=0;
            }
             if($scope.selectedBlock !=null) {
                   var depBlock=$scope.selectedBlock;
            }else if($scope.searchBlock !=null){
                    var depBlock=$scope.searchBlock;
            }else{
                    var depBlock=null;
            }
	    		LocationComponent.findFloors(depProj,depSite,depBlock).then(function (data) {
	    		$scope.selectedFloor = null;
	            $scope.floorsList = data;
                //
                    console.log($scope.floorsList)
                    for(var i=0;i<$scope.floorsList.length;i++)
                    {
                        $scope.uiFloor[i] = $scope.floorsList[i];
                    }
                    console.log($scope.floorsList)
                    $scope.floorDisable = false;
                    $scope.floorSpin = false;
                    $scope.floorFilterDisable = false;
	        });
	    };


        // Load Floors for selectbox //
        $scope.floorFilterDisable = true;
        $scope.floorDisable = true;
        $scope.uiFloor = [];
        $scope.getFloor = function (search) {
            var newSupes = $scope.uiFloor.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }
            return newSupes;
        }
        //


	    $scope.loadDepZones = function (searchFloor) {
            $scope.hideFloor = true;
            $scope.hideZone = false;
            $scope.searchFloor = searchFloor;
            console.log($scope.searchFloor)
            if(jQuery.isEmptyObject($scope.selectedProject) == false) {
                   var depProj=$scope.selectedProject.id;
            }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                    var depProj=$scope.searchProject.id;
            }else{
                    var depProj=0;
            }
            if(jQuery.isEmptyObject($scope.selectedSite) == false) {
                   var depSite=$scope.selectedSite.id;
            }else if(jQuery.isEmptyObject($scope.searchSite) == false){
                    var depSite=$scope.searchSite.id;
            }else{
                    var depSite=0;
            }
             if($scope.selectedBlock !=null) {
                   var depBlock=$scope.selectedBlock;
            }else if($scope.searchBlock !=null){
                    var depBlock=$scope.searchBlock;
            }else{
                    var depBlock=null;
            }
            if($scope.selectedZone !=null) {
                   console.log('load zones - ' + $scope.selectedProject.id +',' +$scope.selectedSite.id +',' +$scope.selectedBlock +','+$scope.selectedFloor);
                   var depZone=$scope.selectedZone;
            }else if($scope.searchFloor !=null){
                    var depFloor=$scope.searchFloor;
            }else{
                    var depZone=null;
            }
	    		LocationComponent.findZones(depProj,depSite,depBlock,depFloor).then(function (data) {
	    		     $scope.selectedZone = null;
	                 $scope.zonesList = data;
                    //
                    console.log($scope.zonesList)
                    for(var i=0;i<$scope.zonesList.length;i++)
                    {
                        $scope.uiZone[i] = $scope.zonesList[i];
                    }
                    console.log($scope.zonesList)
                    $scope.zoneDisable = false;
                    $scope.zoneSpin = false;
                    $scope.zoneFilterDisable = false;
	        });
	    };


        // Load Zones for selectbox //
        $scope.zoneFilterDisable = true;
        $scope.zoneDisable = true;
        $scope.uiZone = [];
        $scope.getZone = function (search) {
            var newSupes = $scope.uiZone.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }
            return newSupes;
        }
        //
        //
        $scope.loadSearchZones = function (searchZone) {
            $scope.searchZone = searchZone;
            $scope.hideZone = true;
        }
        //


        $scope.conform = function(text)
        {
            console.log($scope.selectedProject)
            $rootScope.conformText = text;
            $('#conformationModal').modal();

        }
        $rootScope.back = function (text) {
            if(text == 'cancel')
            {
                $scope.cancelLocation();
            }
            else if(text == 'save')
            {
                $scope.saveLocation();
            }
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
            $scope.saveLoad = true;
            $rootScope.conformText = "";
            console.log("---------------------------------------------------")
            console.log($scope.selectedProject)
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
                $scope.saveLoad = false;
            		console.log("success");
  	        		$location.path('/locations');
  	        		//$scope.loadLocationItems();
  	        }).catch(function (response) {
                $scope.saveLoad = false;
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
         $scope.searchFilter1 = function () {
            $scope.searchBlock = null;
            $scope.searchFloor = null;
            $scope.searchZone = null;
            $scope.searchCriteria.block =null;
            $scope.searchCriteria.floor =null;
            $scope.searchCriteria.zone =null;
            $scope.setPage(1);
            $scope.search();
         }

        $scope.searchFilter = function () {
            $scope.setPage(1);
            $scope.search();
         }

        $scope.search = function () {
            $scope.noData = false;
            var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
            if(!$scope.searchCriteria) {
                var searchCriteria = {
                    currPage : currPageVal
                }
                $scope.searchCriteria = searchCriteria;
            }

            $scope.searchCriteria.currPage = currPageVal;
            console.log('Selected Location' + $scope.searchBlock + ',' + $scope.searchFloor +  ',' + $scope.searchZone);

            if(!$scope.searchProject) {
                if($rootScope.searchCriteriaLocation) {
                    $scope.searchCriteria = $rootScope.searchCriteriaLocation;
                }else {
                    $scope.searchCriteria.findAll = true;
                }

            }else {
                $scope.searchCriteria.findAll = false;
                    if($scope.searchProject) {
                    $scope.searchCriteria.projectId = $scope.searchProject.id;
                    $scope.searchCriteria.projectName = $scope.searchProject.name;
                    }else {
                    $scope.searchCriteria.projectId = null;
                    }
                    if($scope.searchSite) {
                        $scope.searchCriteria.siteId = $scope.searchSite.id;
                        $scope.searchCriteria.siteName = $scope.searchSite.name;
                    }else{
                        $scope.searchCriteria.siteId = null;
                    }
                    if($scope.searchBlock) {
                        $scope.searchCriteria.block = $scope.searchBlock;
                    }else{
                        $scope.searchCriteria.block = null;
                    }
                    if($scope.searchFloor) {
                        $scope.searchCriteria.floor = $scope.searchFloor;
                    }else{
                        $scope.searchCriteria.floor = null;
                    }
                    if($scope.searchZone) {
                        $scope.searchCriteria.zone = $scope.searchZone;
                    }else{
                        $scope.searchCriteria.zone = null;
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

             console.log('search criteria',$scope.searchCriteria);

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
                    $scope.noData = false;

                }else{
                     $scope.noData = true;
                }
            });

        };



        $scope.clearFilter = function() {
            $scope.selectedSite = null;
            $scope.selectedProject = null;
            $scope.selectedBlock = null;
            $scope.selectedFloor = null;
            $scope.selectedZone = null;
            $scope.searchSite = null;
            $scope.searchProject = null;
            $scope.searchBlock = null;
            $scope.searchFloor = null;
            $scope.searchZone = null;
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

                $scope.qr_img = response.url;

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




