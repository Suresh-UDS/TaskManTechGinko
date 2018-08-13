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
        $scope.pageSort = 10;
        $scope.searchCriteria = {};
        $scope.pages = { currPage : 1};
        $scope.isEdit = !!$stateParams.id;
        $scope.selectedAssetType = {};
        $scope.searchAssetType = null;
        $scope.searchName = null;
        $scope.manufacturer = {};
        $scope.pager = {};
        $scope.noData = false;

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

        //demo.initFullCalendar();

        $scope.openCalendar = function(e,cmp) {
            e.preventDefault();
            e.stopPropagation();

            that.calendar[cmp] = true;
        };

        $scope.initMaterialWizard = function(){

            demo.initMaterialWizard();


        }


        $scope.initMaterialWizard();

        $scope.conform = function(text)
        {
            console.log($scope.selectedProject)
            $rootScope.conformText = text;
            $('#conformationModal').modal();
        }
        $rootScope.back = function (text) {
           if(text == 'cancel')
           {
               $scope.cancelManufacturer();
           }
           else if(text == 'save')
           {
               $scope.saveManufacturer();
           }
           else if(text == 'update')
           {
               $scope.UpdateManufacturer();
           }
        };



        $scope.loadAllAssetTypes = function() {
                //$scope.loadingStart();
        		AssetTypeComponent.findAll().then(function (data) {
                //$scope.selectedAssetType = null;
                $scope.assetTypes = data;
                console.log('Asset type',$scope.assetTypes);
                $scope.loadingStop();
            });
        }

        $scope.getManufacturerDetails = function(id, mode) {
                $rootScope.loadingStart();
        		$scope.isEdit = (mode == 'edit' ? true : false)
            ManufacturerComponent.findById(id).then(function (data) {
                $scope.manufacturer = data;
                 $rootScope.loadingStop();
            });
        };

        $scope.editManufacturer = function(){
            $rootScope.loadingStart();
        		ManufacturerComponent.findById($stateParams.id).then(function(data){
                    $scope.manufacturer=data;
	        		$scope.selectedAssetType = {name : $scope.manufacturer.assetType};
	        		console.log('Manufacturer details by id',$scope.manufacturer);
                    $rootScope.loadingStop();
	        	})
        };

        $scope.loadManufacturers = function(){
                $scope.clearFilter();
        		$scope.search();
        };
        $scope.cancelManufacturer = function () {
                $location.path('/manufacturer-list');
        };

         $scope.isActiveAsc = 'assetType';
        $scope.isActiveDesc = '';

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveAsc = field;
            $scope.isActiveDesc = '';
            $scope.isAscOrder = true;
            //$scope.search();
            $scope.loadManufacturers();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
            //$scope.search();
            $scope.loadManufacturers();
        }

        $scope.searchFilter = function () {
            $scope.setPage(1);
            $scope.search();
         }

        $scope.search = function () {

            $scope.loadingStop();

            var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
            var searchCriteria = {
                currPage : currPageVal
            }
            $scope.searchCriteria = searchCriteria;
            // }


            $scope.searchCriteria.currPage = currPageVal;
            $scope.searchCriteria.findAll = false;

             if(!$scope.searchName && !$scope.searchAssetType) {
                $scope.searchCriteria.findAll = true;
            }

            if($scope.searchName) {
                    $scope.searchCriteria.manufacturerName = $scope.searchName;
                }
                if($scope.searchAssetType) {
                    $scope.searchCriteria.assetTypeName = $scope.searchAssetType.name;
                }


            //----
            if($scope.pageSort){
                $scope.searchCriteria.sort = $scope.pageSort;
            }

            if($scope.selectedColumn){

                $scope.searchCriteria.columnName = $scope.selectedColumn;
                console.log('>>> $scope.searchCriteria.columnName <<< '+$scope.searchCriteria.columnName);
                $scope.searchCriteria.sortByAsc = $scope.isAscOrder;
                console.log('>>> $scope.searchCriteria.sortByAsc <<< '+$scope.searchCriteria.sortByAsc);
            }else{
                $scope.searchCriteria.columnName ="assetType";
                $scope.searchCriteria.sortByAsc = true;
            }


            console.log("search criteria",$scope.searchCriteria);
                     $scope.manufacturers = '';
                     $scope.manufacturersLoader = false;
                     $scope.loadPageTop();
            ManufacturerComponent.search($scope.searchCriteria).then(function (data) {

                console.log(data);
                $scope.manufacturers = data.transactions;
                $scope.manufacturersLoader = true;


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
                    $scope.noData = false;

                }else{
                     $scope.noData = true;
                }

            });


        };

            /* Add asset type */

            $scope.addAssetType = function () {
                console.log($scope.assetType);
                $scope.loadingStart();
                if($scope.assetType){
                    console.log("Asset Type entered");
                    AssetTypeComponent.create($scope.assetType).then(function (response) {
                        console.log(response);
                        $scope.assetType = "";
                        $scope.showNotifications('top','center','success','Asset type has been added Successfully!!');
                        $scope.loadAllAssetTypes();


                    }).catch(function(){
                        $scope.loadingStop();
                        $scope.showNotifications('top','center','danger','Unable to Asset type. Please try again later..');
                        $scope.error = 'ERROR';
                    });
                }else{
                    console.log("Asset Type not entered");
                }


            }



        /*$scope.initPage=function (){

            $scope.loadAllAssetTypes();
        		if($scope.isEdit){
        			console.log("edit manufacturer")
        			$scope.editManufacturer();
        		}else {
        		}
        }
*/


        $scope.saveManufacturer = function () {
            $scope.saveLoad = true;
	        	$scope.error = null;
	        	$scope.success =null;
                $scope.loadingStart();

	        	if($scope.selectedAssetType.name !=""){
	        	    $scope.manufacturer.assetType = $scope.selectedAssetType.name;

	            }


	        	console.log('manufacturer details ='+ JSON.stringify($scope.manufacturer));
	        	//var post = $scope.isEdit ? ManufacturerComponent.update : ManufacturerComponent.create
                //post($scope.manufacturer).then(function () {
	        	 ManufacturerComponent.create($scope.manufacturer).then(function () {
	                $scope.success = 'OK';
                     $scope.saveLoad = false;
                    $scope.loadingStop();
	                $scope.showNotifications('top','center','success','Manufacturer Saved Successfully');
	                $location.path('/manufacturer-list');
	            }).catch(function (response) {
                     $scope.saveLoad = false;
                    $scope.loadingStop();
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
                $scope.loadingStart();

                if($scope.selectedAssetType){
                    $scope.manufacturer.assetType = $scope.selectedAssetType.name;


                }
                console.log('manufacturer details ='+ JSON.stringify($scope.manufacturer));
                //var post = $scope.isEdit ? ManufacturerComponent.update : ManufacturerComponent.create
                //post($scope.manufacturer).then(function () {
                 ManufacturerComponent.update($scope.manufacturer).then(function () {
                    $scope.loadingStop();
                    $scope.success = 'OK';
                    $scope.showNotifications('top','center','success','Manufacturer updated Successfully');
                    $location.path('/manufacturer-list');
                }).catch(function (response) {
                    $rootScope.loadingStop();
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
        		$scope.deleteManufacturerId= manufacturer;
        }

        $scope.deleteManufacturer = function () {
        		ManufacturerComponent.remove($scope.deleteManufacturerId).then(function(){
	            	$scope.success = 'OK';
	            	$scope.loadManufacturers();
	        	});
        };





        $scope.clearFilter = function() {
            $scope.noData = false;
            $scope.selectedProject = null;
            $scope.selectedAssetType = null;
            $scope.selectedName = null;
            $scope.searchAssetType = null;
            $scope.searchName = null;
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
             //$scope.initPage();

         }

         var nottifShow = true ;

        $scope.showNotifications= function(position,alignment,color,msg){

            /*if(nottifShow == true){
               nottifShow = false ;*/
               demo.showNotification(position,alignment,color,msg);

           /* }else if(nottifShow == false){
                $timeout(function() {
                  nottifShow = true ;
                }, 8000);

            }*/

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
