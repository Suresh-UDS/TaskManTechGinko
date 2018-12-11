'use strict';

angular.module('timeSheetApp')
		    .controller(
				'VendorController',
				function($scope, $rootScope, $state, $timeout, VendorComponent,AssetTypeComponent,
						$http, $stateParams,
						$location,PaginationComponent,$interval,getLocalStorage) {
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
        $scope.noData = false;
        $rootScope.exportStatusObj  ={};
        $scope.searchName = null;
        $scope.btnDisable = false;
        
        /** Ui-select scopes **/
        $scope.allVendors = {id:0 , name: '-- ALL VENDORS --'};
        $scope.vendorsListOne = {};
        $scope.vendorsLists = [];

      //console.log($stateParams)
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
          //console.log($scope.selectedProject)
            $rootScope.conformText = text;
            $('#conformationModal').modal();
         }
         $rootScope.back = function (text) {
             if(text == 'cancel' || text == 'back')
             {
                 /** @reatin - retaining scope value.**/
                 $rootScope.retain=1;
                 $scope.cancelVendor();
             }
             else if(text == 'save')
             {
                 $scope.saveVendor();
             }
             else if(text == 'update')
             {
                 /** @reatin - retaining scope value.**/
                 $rootScope.retain=1;
                 $scope.UpdateVendor();
             }
         };


         // Load Vendor for selectbox //
         $scope.vendorFilterDisable = true;
         $scope.uiVendor = [];
         $scope.getType = function (search) {
             var newSupes = $scope.uiVendor.slice();
             if (search && newSupes.indexOf(search) === -1) {
                  newSupes.unshift(search);
             }
             return newSupes;
         }


         $scope.loadSearchVendor = function (searchVendor) {
             $scope.filter = false;
             $scope.clearField = false;
             $scope.searchName = $scope.vendorsList[$scope.uiVendor.indexOf(searchVendor)];
         }

         //
         $scope.loadVendor = function () {
               VendorComponent.findAll().then(function (data) {
                    // console.log("Loading all Vendor -- " , data)
                    $scope.vendorsList = data;
                    
                    /** Ui-select scope **/
                    $scope.vendorsLists[0] = $scope.allVendors;
                   //Filter
                   for(var i=0;i<$scope.vendorsList.length;i++)
                   {
                       $scope.uiVendor[i] = $scope.vendorsList[i].name;
                       $scope.vendorsLists[i+1] = $scope.vendorsList[i];
                   }
                   $scope.vendorFilterDisable = false;
                   //
               });
         }

        $scope.getVendorDetails = function(id, mode) {
        		$scope.isEdit = (mode == 'edit' ? true : false)
            VendorComponent.findById(id).then(function (data) {
                $scope.vendor = data;
            });
        };



        $scope.editVendor = function(){
          if(parseInt($stateParams.id) > 0){
             var vendorId = parseInt($stateParams.id);
             VendorComponent.findById(vendorId).then(function(data){
                $scope.vendor=data;
                if(!$scope.vendor){
                  $location.path('/vendor-list');
                }
                $scope.title=$scope.vendor.name;
              //console.log($scope.vendor);
             })
          }else{
              $location.path('/vendor-list');
          }

        };

        $scope.loadVendors = function(){
            $scope.loadVendor();
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
        	$('.BasicFilterModal.in').modal('hide');
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

            $scope.searchCriteria.isReport = true;

            $scope.searchCriteria.currPage = currPageVal;
            
            if($scope.vendorsListOne.selected && $scope.vendorsListOne.selected.id !=0){
        		$scope.searchName = $scope.vendorsListOne.selected;
        	}else{
        	   $scope.searchName = null;
        	}
            
            $scope.searchCriteria.findAll = false;

             if(!$scope.searchName) {
                $scope.searchCriteria.findAll = true;
            }

            if($scope.searchName) {
                     $scope.searchCriteria.vendorName = $scope.searchName.name;
                     $scope.searchCriteria.vendorId = $scope.searchName.id;
                //$scope.searchCriteria.vendorName = $scope.localStorage? $scope.localStorage.vendorName == $scope.searchName?$scope.searchName:$scope.searchName.name:$scope.searchName.name;

                }

                //----
            if($scope.pageSort){
                $scope.searchCriteria.sort = $scope.pageSort;
            }

            if($scope.selectedColumn){
                $scope.searchCriteria.columnName = $scope.selectedColumn;
              //console.log('>>> $scope.searchCriteria.columnName <<< '+$scope.searchCriteria.columnName);
                $scope.searchCriteria.sortByAsc = $scope.isAscOrder;
              //console.log('>>> $scope.searchCriteria.sortByAsc <<< '+$scope.searchCriteria.sortByAsc);
            }else{
                $scope.searchCriteria.columnName ="name";
                $scope.searchCriteria.sortByAsc = true;
            }

          //console.log("search criteria",$scope.searchCriteria);
                     $scope.vendors = '';
                     $scope.vendorsLoader = false;
                     $scope.loadPageTop();

            /* Localstorage (Retain old values while edit page to list) start */

            if($rootScope.retain == 1){
                $scope.localStorage = getLocalStorage.getSearch();
              //console.log('Local storage---',$scope.localStorage);

                if($scope.localStorage){
                    $scope.filter = true;
                    $scope.pages.currPage = $scope.localStorage.currPage;
                     $scope.searchName = {id:$scope.localStorage.vendorId,name:$scope.localStorage.vendorName};
                     $scope.vendorsListOne.selected = $scope.searchName;
                }

                $rootScope.retain = 0;

                $scope.searchCriteras  = $scope.localStorage;
            }else{

            	$scope.searchCriteras  = $scope.searchCriteria;
            }

            /* Localstorage (Retain old values while edit page to list) end */



            VendorComponent.search($scope.searchCriteras).then(function (data) {
              //console.log(data);
                $scope.vendors = data.transactions;
                $scope.vendorsLoader = true;
                $scope.loadingStop();

                /** retaining list search value.**/
                getLocalStorage.updateSearch($scope.searchCriteras);




                /*
                   ** Call pagination  main function **
               */
                 $scope.pager = {};
                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                 $scope.totalCountPages = data.totalCount;

              //console.log("Pagination",$scope.pager);
              //console.log('vendors search result list -' + JSON.stringify($scope.vendors));
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;

                if($scope.vendors && $scope.vendors.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.vendors.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10;
                    $scope.noData = false;

                }else{
                     $scope.noData = true;
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
	              //console.log('Error - '+ response.data);
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
                $scope.saveLoad = true;
                $scope.btnDisable = true;
              //console.log('vendor details ='+ JSON.stringify($scope.vendor));

                 VendorComponent.create($scope.vendor).then(function () {
                    $scope.success = 'OK';
                     $scope.saveLoad = false;
                    $scope.showNotifications('top','center','success','vendor Saved Successfully');
                    $location.path('/vendor-list');
                }).catch(function (response) {
                     $scope.saveLoad = false;
                    $scope.success = null;
                    $scope.btnDisable = false;
                  //console.log('Error - '+ response.data);
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
            $scope.saveLoad = true;
                $scope.error = null;
                $scope.success =null;
                $scope.btnDisable = true;

              //console.log('vendor details ='+ JSON.stringify($scope.vendor));

                 VendorComponent.update($scope.vendor).then(function () {
                    $scope.success = 'OK';
                     $scope.saveLoad = false;
                    $scope.showNotifications('top','center','success','vendor updated Successfully');
                    $location.path('/vendor-list');
                }).catch(function (response) {
                    $scope.success = null;
                     $scope.saveLoad = false;
                     $scope.btnDisable = false;
                  //console.log('Error - '+ response.data);
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
            $scope.clearField = true;
            $scope.noData = false;
            $scope.selectedProject = null;
            $scope.searchCriteria = {};
            /** Ui-select scopes **/
        	$scope.vendorsListOne.selected = null;
            $scope.localStorage = null;
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

        $scope.exportAllData = function(type){
            $rootScope.exportStatusObj.exportMsg = '';
            $scope.downloader=true;
            $scope.searchCriteria.exportType = type;
            $scope.searchCriteria.report = true;
            $scope.searchCriteria.columnName = "createdDate";
            $scope.searchCriteria.sortByAsc = false;

          //console.log('calling asset export api');
            VendorComponent.exportAllData($scope.searchCriteria).then(function(data){
                var result = data.results[0];
              //console.log(result.file + ', ' + result.status + ',' + result.msg);
                var exportAllStatus = {
                        fileName : result.file,
                        exportMsg : 'Exporting All...',
                        url: result.url
                };
                $scope.exportStatusMap[0] = exportAllStatus;
              //console.log('exportStatusMap size - ' + $scope.exportStatusMap.length);
                $scope.start();
              },function(err){
                //console.log('error message for export all ')
                //console.log(err);
          });
    };

 // store the interval promise in this variable
    var promise;

 // starts the interval
    $scope.start = function() {
      // stops any running interval to avoid two intervals running at the same time
      $scope.stop();

      // store the interval promise
      promise = $interval($scope.exportStatus, 5000);
    //console.log('promise -'+promise);
    };

    // stops the interval
    $scope.stop = function() {
      $interval.cancel(promise);
    };

    $scope.exportStatusMap = [];


    $scope.exportStatus = function() {
        //console.log('empId='+$scope.empId);
      //console.log('exportStatusMap length -'+$scope.exportStatusMap.length);
        angular.forEach($scope.exportStatusMap, function(exportStatusObj, index){
            if(!exportStatusObj.empId) {
                exportStatusObj.empId = 0;
            }
            VendorComponent.exportStatus(exportStatusObj.fileName).then(function(data) {
                if(data) {
                    exportStatusObj.exportStatus = data.status;
                  //console.log('exportStatus - '+ exportStatusObj);
                  //console.log(data)
                    exportStatusObj.exportMsg = data.msg;
                    $scope.downloader=false;
                  //console.log('exportMsg - '+ exportStatusObj.exportMsg);
                    if(exportStatusObj.exportStatus == 'COMPLETED'){
                        if(exportStatusObj.url) {
                            exportStatusObj.exportFile = exportStatusObj.url;
                        }else {
                            exportStatusObj.exportFile = data.file;
                        }
                      //console.log('exportFile - '+ exportStatusObj.exportFile);
                        $scope.stop();
                    }else if(exportStatusObj.exportStatus == 'FAILED'){
                        $scope.stop();
                    }else if(!exportStatusObj.exportStatus){
                        $scope.stop();
                    }else {
                        exportStatuObj.exportFile = '#';
                    }
                }

            });
        });

    }

    $scope.exportFile = function(empId) {
        if(empId != 0) {
            var exportFile = '';
            angular.forEach($scope.exportStatusMap, function(exportStatusObj, index){
                if(empId == exportStatusObj.empId){
                    exportFile = exportStatusObj.exportFile;
                    return exportFile;
                }
            });
            return exportFile;
        }else {
            return ($scope.exportStatusMap[empId] ? $scope.exportStatusMap[empId].exportFile : '#');
        }
    }


    $scope.exportMsg = function(empId) {
            if(empId != 0) {
                var exportMsg = '';
                angular.forEach($scope.exportStatusMap, function(exportStatusObj, index){
                    if(empId == exportStatusObj.empId){
                        exportMsg = exportStatusObj.exportMsg;
                        return exportMsg;
                    }
                });
                return exportMsg;
            }else {
                return ($scope.exportStatusMap[empId] ? $scope.exportStatusMap[empId].exportMsg : '');
            }

    };


    });
