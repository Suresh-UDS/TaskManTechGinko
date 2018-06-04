'use strict';

angular.module('timeSheetApp')
		    .controller(
				'ManufacturerController',
				function($scope, $rootScope, $state, $timeout, ManufacturerComponent,AssetTypeComponent,
						$http, $stateParams,
						$location,PaginationComponent) {
        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.pager = {};
        $scope.searchCriteria = {};
        $scope.pages = { currPage : 1};
        $scope.isEdit = !!$stateParams.id;
        $scope.selectedAssetType = null;
        $scope.manufacturer = {};
        $scope.pager = {};

        console.log($stateParams)
                    var that =  $scope;

        $scope.calendar = {
            actualStart : false,
            actualEnd : false,
            plannedStart : false,
            plannedEnd : false,
        };

        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();


        };

        $scope.initCalender();

        demo.initFullCalendar();

        $scope.openCalendar = function(e,cmp) {
            e.preventDefault();
            e.stopPropagation();

            that.calendar[cmp] = true;
        };

        $scope.initMaterialWizard = function(){

            demo.initMaterialWizard();


        }


        $scope.initMaterialWizard();
        
        $scope.loadAllAssetTypes = function() {
        		AssetTypeComponent.findAll().then(function (data) {
                $scope.selectedAssetType = null;
                $scope.assetTypes = data;
                $scope.loadingStop();
            });
        }
        
        $scope.getManufacturerDetails = function(id, mode) {
        		$scope.isEdit = (mode == 'edit' ? true : false)
            ManufacturerComponent.findById(id).then(function (data) {
                $scope.manufacturer = data;
            });
        };

        $scope.editManufacturer = function(){
        		ManufacturerComponent.findById($stateParams.id).then(function(data){
	        		$scope.manufacturer=data;
	        		console.log($scope.manufacturer);
	        	})
        };
        
        $scope.loadManufacturers = function(){
                $scope.clearFilter();
        		$scope.search();
        };
        $scope.cancelManufacturer = function () {
                $location.path('/manufacturer-list');
        };

         $scope.isActiveAsc = 'id';
        $scope.isActiveDesc = '';

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveAsc = field;
            $scope.isActiveDesc = '';
            $scope.isAscOrder = true;
            $scope.search();
            //$scope.loadTickets();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
            $scope.search();
            //$scope.loadTickets();
        }

        $scope.searchFilter = function () {
            $scope.setPage(1);
            $scope.search();
         }

        $scope.search = function () {
            var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
            var searchCriteria = {
                currPage : currPageVal
            }
            $scope.searchCriteria = searchCriteria;
            // }


            $scope.searchCriteria.currPage = currPageVal;
            $scope.searchCriteria.findAll = false;

             if(!$scope.selectedName && !$scope.selectedAssetType) {
                $scope.searchCriteria.findAll = true;
            }

            if($scope.selectedName) {
                    $scope.searchCriteria.name = $scope.selectedName;
                }
                if($scope.selectedAssetType) {
                    $scope.searchCriteria.id = $scope.selectedAssetType.id;
                }

           
            console.log("search criteria",$scope.searchCriteria);
                     $scope.manufacturers = '';
                     $scope.manufacturersLoader = false;
                     $scope.loadPageTop();
            ManufacturerComponent.search($scope.searchCriteria).then(function (data) {
                console.log(data);
                $scope.manufacturers = data.transactions;
                $scope.manufacturersLoader = true;
                $scope.loadingStop();

                /*
                    ** Call pagination  main function **
                */
                 $scope.pager = {};
                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                 $scope.totalCountPages = data.totalCount;

                console.log("Pagination",$scope.pager);
                console.log('Manufacturers search result list -' + JSON.stringify($scope.manufacturers));
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;

                if($scope.manufacturers && $scope.manufacturers.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.manufacturers.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10;
                }

            });

            
        };



        $scope.initPage=function (){

            $scope.loadAllAssetTypes();
        		if($scope.isEdit){
        			console.log("edit manufacturer")
        			$scope.editManufacturer();
        		}else {
        		}
        }



        $scope.saveManufacturer = function () {
	        	$scope.error = null;
	        	$scope.success =null;

	        	if($scope.selectedAssetType.name !=""){
	        	    $scope.manufacturer.assetType = $scope.selectedAssetType.name;
                          
	            }

            
	        	console.log('manufacturer details ='+ JSON.stringify($scope.manufacturer));
	        	//var post = $scope.isEdit ? ManufacturerComponent.update : ManufacturerComponent.create
                //post($scope.manufacturer).then(function () {
	        	 ManufacturerComponent.create($scope.manufacturer).then(function () {
	                $scope.success = 'OK';
	                $scope.showNotifications('top','center','success','Manufacturer Saved Successfully');
	                $location.path('/manufacturer-list');
	            }).catch(function (response) {
	                $scope.success = null;
	                console.log('Error - '+ response.data);
	                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                        $scope.showNotifications('top','center','danger','Manufacturer already exist!!');
	                    $scope.errorProjectExists = 'ERROR';
	                } else {
                        $scope.showNotifications('top','center','danger','Unable to create Manufacturer');
	                    $scope.error = 'ERROR';
	                }
	            });;

        };

        $scope.UpdateManufacturer = function () {
                $scope.error = null;
                $scope.success =null;

                if($scope.selectedAssetType){
                    $scope.manufacturer.assetType = $scope.selectedAssetType.name;
                   
                
                }
                console.log('manufacturer details ='+ JSON.stringify($scope.manufacturer));
                //var post = $scope.isEdit ? ManufacturerComponent.update : ManufacturerComponent.create
                //post($scope.manufacturer).then(function () {
                 ManufacturerComponent.update($scope.manufacturer).then(function () {
                    $scope.success = 'OK';
                    $scope.showNotifications('top','center','success','Manufacturer updated Successfully');
                    $location.path('/manufacturer-list');
                }).catch(function (response) {
                    $scope.success = null;
                    console.log('Error - '+ response.data);
                    if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                        $scope.showNotifications('top','center','danger','Manufacturer already exist!!');
                        $scope.errorProjectExists = 'ERROR';
                    } else {
                        $scope.showNotifications('top','center','danger','Unable to update Manufacturer');
                        $scope.error = 'ERROR';
                    }
                });;

        };


        $scope.refreshPage = function(){
            //$scope.clearFilter();
             $scope.loadManufacturers();
        }

        $scope.deleteConfirm = function (manufacturer){
        		$scope.deleteManufacturerId= manufacturer.id;
        }

        $scope.deleteManufacturer = function () {
        		ManufacturerComponent.remove($scope.deleteManufacturerId).then(function(){
	            	$scope.success = 'OK';
	            	$state.reload();
	        	});
        };

       

	  

        $scope.clearFilter = function() {
            $scope.selectedProject = null;
            $scope.selectedAssetType = null;
            $scope.selectedName = null;
            $scope.searchCriteria = {};
            $scope.selectedSite = null;
            $scope.selectedStatus = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
           // $scope.search();
        };

        // init load
        $scope.initLoad = function(){ 
             $scope.loadPageTop(); 
             $scope.initPage(); 
          
         }
        
        $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
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
        
    });
