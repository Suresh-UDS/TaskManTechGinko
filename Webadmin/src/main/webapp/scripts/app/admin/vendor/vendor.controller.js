'use strict';

angular.module('timeSheetApp')
		    .controller(
				'VendorController',
				function($scope, $rootScope, $state, $timeout, VendorComponent,AssetTypeComponent,
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
        $scope.selectedName = null;
        $scope.vendor = {};
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
        
        $scope.getVendorDetails = function(id, mode) {
        		$scope.isEdit = (mode == 'edit' ? true : false)
            VendorComponent.findById(id).then(function (data) {
                $scope.vendor = data;
            });
        };



        $scope.editVendor = function(){
        		VendorComponent.findById($stateParams.id).then(function(data){
	        		$scope.vendor=data;
	        		console.log($scope.vendor);
	        	})
        };
        
        $scope.loadVendors = function(){
                $scope.clearFilter();
        		$scope.search();
        };

        $scope.isActiveAsc = 'name';
        $scope.isActiveDesc = '';

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveAsc = field;
            $scope.isActiveDesc = '';
            $scope.isAscOrder = true;
            //$scope.search();
            $scope.loadVendors();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
            //$scope.search();
            $scope.loadVendors();
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

             if(!$scope.searchName) {
                $scope.searchCriteria.findAll = true;
            }

            if($scope.searchName) {
                    $scope.searchCriteria.vendorName = $scope.searchName;
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
                $scope.searchCriteria.columnName ="name";
                $scope.searchCriteria.sortByAsc = true;
            }
               
            console.log("search criteria",$scope.searchCriteria);
                     $scope.vendors = '';
                     $scope.vendorsLoader = false;
                     $scope.loadPageTop();
            VendorComponent.search($scope.searchCriteria).then(function (data) {
                console.log(data);
                $scope.vendors = data.transactions;
                $scope.vendorsLoader = true;
                $scope.loadingStop();


                 /*
                    ** Call pagination  main function **
                */
                 $scope.pager = {};
                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                 $scope.totalCountPages = data.totalCount;

                console.log("Pagination",$scope.pager);
                console.log('vendors search result list -' + JSON.stringify($scope.vendors));
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;

                if($scope.vendors && $scope.vendors.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.vendors.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10;
                }
              

            });

            
        };



        $scope.initPage=function (){

        		if($scope.isEdit){
        			console.log("edit vendor")
        			$scope.editVendor();
        		}else {
        		}
        }

        // init load
        $scope.initLoad = function(){ 
             $scope.loadPageTop(); 
             //$scope.initPage(); 
          
         }

         $scope.cancelVendor = function () {
                $location.path('/vendor-list');
        };



        /*$scope.saveVendor = function () {
	        	$scope.error = null;
	        	$scope.success =null;
	        	console.log('vendor details ='+ JSON.stringify($scope.vendor));
	        	var post = $scope.isEdit ? VendorComponent.update : VendorComponent.create
	        	post($scope.vendor).then(function () {
	                $scope.success = 'OK';
	                $scope.showNotifications('top','center','success','Vendor Saved Successfully');
	                $location.path('/vendor-list');
	            }).catch(function (response) {
	                $scope.success = null;
	                console.log('Error - '+ response.data);
	                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
	                    $scope.errorProjectExists = 'ERROR';
	                } else {
	                    $scope.error = 'ERROR';
	                }
	            });;

        };*/

         $scope.saveVendor = function () {
                $scope.error = null;
                $scope.success =null;

                console.log('vendor details ='+ JSON.stringify($scope.vendor));

                 VendorComponent.create($scope.vendor).then(function () {
                    $scope.success = 'OK';
                    $scope.showNotifications('top','center','success','vendor Saved Successfully');
                    $location.path('/vendor-list');
                }).catch(function (response) {
                    $scope.success = null;
                    console.log('Error - '+ response.data);
                    if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                        $scope.showNotifications('top','center','danger','vendor already exist!!');
                        $scope.errorProjectExists = 'ERROR';
                    } else {
                        $scope.showNotifications('top','center','danger','Unable to create vendor');
                        $scope.error = 'ERROR';
                    }
                });;

        };

        $scope.UpdateVendor = function () {
                $scope.error = null;
                $scope.success =null;

                console.log('vendor details ='+ JSON.stringify($scope.vendor));

                 VendorComponent.update($scope.vendor).then(function () {
                    $scope.success = 'OK';
                    $scope.showNotifications('top','center','success','vendor updated Successfully');
                    $location.path('/vendor-list');
                }).catch(function (response) {
                    $scope.success = null;
                    console.log('Error - '+ response.data);
                    if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                        $scope.showNotifications('top','center','danger','vendor already exist!!');
                        $scope.errorProjectExists = 'ERROR';
                    } else {
                        $scope.showNotifications('top','center','danger','Unable to update vendor');
                        $scope.error = 'ERROR';
                    }
                });;

        };


        $scope.refreshPage = function(){
            
             $scope.loadVendors();
        }

        $scope.deleteConfirm = function (vendor){
        		$scope.deleteVendorId= vendor;
        }

        $scope.deleteVendor = function () {
        		VendorComponent.remove($scope.deleteVendorId).then(function(){
	            	$scope.success = 'OK';
	            	$scope.loadVendors();
	        	});
        };

        

        $scope.clearFilter = function() {
            $scope.selectedProject = null;
            $scope.searchCriteria = {};
            $scope.selectedName = null;
            $scope.searchName = null;
            $scope.selectedSite = null;
            $scope.selectedStatus = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            //$scope.search();
        };

        // init load
        $scope.initLoad = function(){ 
             $scope.loadPageTop(); 
             $scope.initPage(); 
          
         }
        
         var nottifShow = true ;

        $scope.showNotifications= function(position,alignment,color,msg){
           
            if(nottifShow == true){
               nottifShow = false ;
               demo.showNotification(position,alignment,color,msg);
               
            }else if(nottifShow == false){
                $timeout(function() {
                  nottifShow = true ;
                }, 8000);

            }
            
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
