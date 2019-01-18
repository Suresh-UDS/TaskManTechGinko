'use strict';

angular.module('timeSheetApp')
    .controller('InventoryController', function ($rootScope, $scope, $state, $timeout, ProjectComponent, SiteComponent,$http,$stateParams,$location,
    		ManufacturerComponent, InventoryComponent, $filter, $interval, PaginationComponent) {


    	$rootScope.loginView = false;
    	$scope.inventory = {};
    	$scope.editInventory = {};
    	$scope.client = {};
    	$scope.projectSite = {};
    	$scope.selectedManufacturer = {};
    	$scope.selectedClient = {};
    	$scope.selectedSite = {};
    	$scope.selectedUOM;
    	$scope.selectedUnit = {};
    	$scope.selectedItemGroup = {};
    	$scope.materialItemGroup = {};
    	$scope.searchSite ={};
        $scope.searchProject ={};
        $scope.searchItemCode = null;
        $scope.searchItemName = null;
        $scope.searchItemGroup = null;
        $scope.searchCreatedDate = "";
        $scope.searchCreatedDateSer = null;
        $scope.transactionCriteria = {};
    	$scope.pages = { currPage : 1};
    	$scope.pageSort = 10;
    	
    	$rootScope.exportStatusObj  ={};

    	$scope.refreshPage = function() {
    		 $scope.pages = {
    	                currPage: 1,
    	                totalPages: 0
    	            }
    		 $scope.clearFilter();
    	}


        $scope.clearFilter = function() {
            $scope.selectedManufacturer = {};
            $scope.searchItemCode = null;
            $scope.searchCriteria = {};
            $scope.selectedSite = null;
            $scope.selectedStatus = null;
            $scope.searchItemName = null;
            $scope.searchItemGroup = null;
            $scope.searchCreatedDate = null
            $scope.searchAssetType ={};
            $scope.searchSite ={};
            $scope.searchProject ={};
            $scope.selectedItemGroup ={};

            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            $scope.search();
        };

        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();
        }

        $scope.initCalender();

    	$scope.showNotifications= function(position,alignment,color,msg){

            /*if(nottifShow == true){*/
               $rootScope.overlayShow();
               demo.showNotification(position,alignment,color,msg);

            /*}else if(nottifShow == false){*/
                $timeout(function() {
                  $rootScope.overlayHide() ;
                }, 5000);

            /*}*/

        }

    	$scope.loadProjects = function () {
            ProjectComponent.findAll().then(function (data) {
                console.log("Loading all projects")
                $scope.projects = data;
            });
        }

    	$scope.loadAllSites = function () {
    		if($scope.client) {
    			ProjectComponent.findSites($scope.client.id).then(function (data) {
                    $scope.searchSite = null;
                    $scope.sites = data;
                });
    		}
        }

    	$scope.loadSites = function () {
            SiteComponent.findAll().then(function (data) {
                $scope.selectedSite = null;
                $scope.sites = data;
                $scope.loadingStop();
            });
        }

    	$scope.loadManufacturer = function () {
            ManufacturerComponent.findAll().then(function (data) {
                //console.log("Loading all Manufacturer -- " , data);
                $scope.manufacturers = data;
                $scope.loadingStop();
            });
        }

    	$scope.loadSearchSites = function() {
    		if($scope.searchProject) {
    			ProjectComponent.findSites($scope.searchProject.id).then(function (data) {
                    $scope.searchSite = null;
                    $scope.sites = data;
                });
    		}
    	}

    	$scope.loadUOM = function() {
    		InventoryComponent.getMaterialUOM().then(function(data){
    			console.log(data);
    			$scope.materialUOMs = data;
    		});
    	}

    	$scope.cancelInventory = function(){
            $location.path('/inventory-list');
    	}

    	 $('input#searchCreatedDate').on('dp.change', function(e){
             $scope.searchCreatedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
             $scope.searchCreatedDateSer = e.date._d;
    	 });



    	/* Add item group */

        $scope.addMaterialItemGroup = function () {
            console.log($scope.materialItemGroup);
             $scope.loadingStart();
            if($scope.materialItemGroup){
                console.log("MaterialItmGroup Group entered");
                InventoryComponent.createItemGroup($scope.materialItemGroup).then(function (response) {
                    console.log(response);
                    if(response.data.status && response.data.status === "400"){
                    	 $scope.materialItemGroup = "";
                         $scope.showNotifications('top','center','danger','Item group already exists!');
                         $scope.loadMaterialItmGroup();
                    }else{
	                	 $scope.materialItemGroup = "";
	                     $scope.showNotifications('top','center','success','Item group has been added Successfully!');
	                     $scope.loadMaterialItmGroup();
                    }
                   
                }).catch(function(){
                $scope.loadingStop();
                $scope.showNotifications('top','center','danger','Unable to add Item group. Please try again later..');
                $scope.error = 'ERROR';
            });
            }else{
                console.log("Item Group not entered");
            }
        }

        $scope.loadMaterialItmGroup = function () {
        	InventoryComponent.loadItemGroup().then(function (data) {
                $scope.materialItmGroups = data;
                $scope.loadingStop();
            });
        }

        $scope.loadMaterials = function() {
        	$scope.refreshPage();
        	$scope.search();
        	$location.path('/inventory-list');
        }

        /* Save material */
    	$scope.saveInventory = function() {
    		if($scope.client){
    			$scope.inventory.projectId = $scope.client.id;
    		}

    		if($scope.projectSite){
    			$scope.inventory.siteId = $scope.projectSite.id;
    		}

    		if($scope.selectedManufacturer) {
    			$scope.inventory.manufacturerId = $scope.selectedManufacturer.id;
    		}

    		if($scope.selectedItemGroup) {
    			$scope.inventory.itemGroup = $scope.selectedItemGroup.itemGroup;
    			$scope.inventory.itemGroupId = $scope.selectedItemGroup.id;
    		}

    		if($scope.selectedUOM){
    			$scope.inventory.uom = $scope.selectedUOM;
    		}

    		console.log(JSON.stringify($scope.inventory));

    		InventoryComponent.create($scope.inventory).then(function(data) {
    			console.log(data);
                $scope.loadingStop();
                $scope.inventory = "";
                $scope.showNotifications('top','center','success','Material has been added Successfully!!');
                $scope.loadMaterials();
    		}).catch(function (response) {
                $scope.loadingStop();
                $scope.btnDisabled= false;
                $scope.success = null;
                console.log('Error - '+ response.data);
                console.log('status - '+ response.status + ' , message - ' + response.data.message);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                        $scope.errorAssetsExists = 'ERROR';
                    $scope.showNotifications('top','center','danger','Material Already Exists');
                } else {
                    $scope.showNotifications('top','center','danger','Unable to creating Inventory. Please try again later..');
                    $scope.error = 'ERROR';
                }
            });


    	}

    	$scope.viewInventory = function() {
            $rootScope.loadingStart();
            $rootScope.loadPageTop();
            InventoryComponent.findById($stateParams.id).then(function(data) {
                $rootScope.loadingStop();
    			console.log(data);
    			$scope.inventoryViews = data;
    		});
    	}

    	/* view material transactions */
        $scope.loadMaterialTrans = function() {
            $rootScope.loadingStart();
            $rootScope.loadPageTop();
            var redCurrPageVal = ($scope.pages ? $scope.pages.currPage : 1);
                    if(!$scope.transactionCriteria) {
                        var redSearchCriteria = {
                                currPage : redCurrPageVal
                        };
                        $scope.transactionCriteria = redSearchCriteria;
                    }

                $scope.transactionCriteria.currPage = redCurrPageVal;
                $scope.transactionCriteria.module = "Transactions";
                $scope.searchModule = "Transactions";
                $scope.transactionCriteria.materialId = $stateParams.id;
                $scope.transactionCriteria.sort = $scope.pageSort;
            $scope.materialTransactions = "";
        	console.log('materialTransaction search criteria',$scope.transactionCriteria);
        	InventoryComponent.findByMaterialTrans($scope.transactionCriteria).then(function(data){
                $rootScope.loadingStop();
        		console.log('View Transactions - ' +JSON.stringify(data));
        			$scope.materialTransactions = data.transactions;
                 /*
                ** Call pagination  main function **
                */

                $scope.pager = {};
                $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);

                $scope.totalCountPages = data.totalCount;

                console.log("Pagination", $scope.pager);
                console.log("MaterialTransactions List - ", data);

        	});
        }
        /* end material transactions */

        /* delete material */
        $scope.deleteConfirm = function (id){
        	$scope.inventoryId = id;
        }

        $scope.deleteMaterial = function () {
        	InventoryComponent.remove($scope.inventoryId).then(function(){
            	$scope.success = 'OK';
                $scope.showNotifications('top','center','success','Material has been deleted successfully!!');
            	$scope.loadMaterials();
        	});
        }
        /* end delete material */

    	$scope.editInventory = function() {
            $rootScope.loadingStart();
            $rootScope.loadPageTop();
    		InventoryComponent.findById($stateParams.id).then(function(data) {
    		    $rootScope.loadingStop();
    			console.log(data);
    			$scope.editInventory = data;
    			$scope.editInventory.id = data.id;
    			$scope.editInventory.name = data.name;
    			$scope.editInventory.itemCode = data.itemCode;
    			$scope.selectedSite = {id: data.siteId, name: data.siteName};
    			$scope.client = {id: data.projectId, name: data.projectName};
    			$scope.selectedItemGroup = {id: data.itemGroupId, itemGroup: data.itemGroup};
    			$scope.selectedManufacturer = {id: data.manufacturerId, name: data.manufacturerName};
    			$scope.editInventory.minimumStock = data.minimumStock;
    			$scope.editInventory.maximumStock = data.maximumStock;
    			$scope.editInventory.storeStock = data.storeStock;
//    			$scope.selectedUnit = {materialUOM: data.uom };
    			if(data.uom){
    				for(var i in $scope.materialUOMs){
    					var unit = data.uom;
    					if($scope.materialUOMs[i] === unit.toUpperCase()){
    						$scope.selectedUnit = $scope.materialUOMs[i];
    					}
    				}
    			}
    		});
    	}

    	/* Update Material */
    	$scope.updateInventory = function () {
            $scope.error = null;
            $scope.success =null;
            $scope.loadingStart();
        	if($scope.client){
    			$scope.editInventory.projectId = $scope.client.id;
    		}

    		if($scope.selectedSite){
    			$scope.editInventory.siteId = $scope.selectedSite.id;
    		}

    		if($scope.selectedManufacturer) {
    			$scope.editInventory.manufacturerId = $scope.selectedManufacturer.id;
    		}

    		if($scope.selectedItemGroup) {
    			$scope.editInventory.itemGroup = $scope.selectedItemGroup.itemGroup;
    			$scope.editInventory.itemGroupId = $scope.selectedItemGroup.id;
    		}

    		if($scope.selectedUnit){
    			$scope.editInventory.uom = $scope.selectedUnit;
    		}

            console.log('Inventory details ='+ JSON.stringify($scope.editInventory));

             InventoryComponent.update($scope.editInventory).then(function (response) {
            	console.log(response);
                $scope.loadingStop();
                if(response.status === 400) { 
                	 $scope.showNotifications('top','center','danger','Unable to update Material');
                     $scope.error = 'ERROR';
                }else{
                	$scope.showNotifications('top','center','success','Material updated Successfully');
                    $location.path('/inventory-list');
                }
                
            }).catch(function (response) {
                $rootScope.loadingStop();
                $scope.success = null;
                console.log('Error - '+ response.data);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                    $scope.showNotifications('top','center','danger','Material already exist!!');
                    $scope.errorProjectExists = 'ERROR';
                } else {
                    $scope.showNotifications('top','center','danger','Unable to update Material');
                    $scope.error = 'ERROR';
                }
            });;

    	};

    	/* end update Material */

    	$scope.searchFilter = function () {
            $scope.setPage(1);
            $scope.search();
         }
    	
    	   $scope.isActiveAsc = 'id';
           $scope.isActiveDesc = '';

           $scope.columnAscOrder = function(field){
               $scope.selectedColumn = field;
               $scope.isActiveAsc = field;
               $scope.isActiveDesc = '';
               $scope.isAscOrder = true;
               //$scope.search();
               $scope.loadSites();
           }

           $scope.columnDescOrder = function(field){
               $scope.selectedColumn = field;
               $scope.isActiveDesc = field;
               $scope.isActiveAsc = '';
               $scope.isAscOrder = false;
               //$scope.search();
               $scope.loadSites();
           }


    	$scope.search = function () {										// search material
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
        	if($scope.pageSort){
                $scope.searchCriteria.sort = $scope.pageSort;
            }
        	if($scope.searchProject) {
        		$scope.searchCriteria.projectId = $scope.searchProject.id;
        	}
        	if($scope.searchSite) {
        		$scope.searchCriteria.siteId = $scope.searchSite.id;
        	}
        	if($scope.selectedManufacturer) {
        		$scope.searchCriteria.manufacturerId = $scope.selectedManufacturer.id;
        	}
        	if($scope.searchItemCode) {
        		$scope.searchCriteria.itemCode = $scope.searchItemCode;
        	}
        	if($scope.searchItemName) {
        		$scope.searchCriteria.materialName = $scope.searchItemName;
        	}
            if($scope.searchItemGroup) {
            	$scope.searchCriteria.itemGroup = $scope.searchItemGroup;
            }
            if($scope.searchCreatedDate != "") {
                if($scope.searchCreatedDate != undefined){
                $scope.searchCriteria.materialCreatedDate = $scope.searchCreatedDateSer;
                $scope.searchCriteria.findAll = false;
               }else{
                $scope.searchCriteria.materialCreatedDate = null;
                $scope.searchCriteria.findAll = true;
               }
	   	     }else{
	                $scope.searchCriteria.materialCreatedDate = null;
	   	     }
            $scope.inventorylists = '';
            $scope.inventorylistLoader = false;
            $scope.loadPageTop();
        	console.log($scope.searchCriteria);
        	InventoryComponent.search($scope.searchCriteria).then(function (data) {
        		console.log(data);
                $scope.inventorylists = data.transactions;
                $scope.loadingStop();
                $scope.inventorylistLoader = true;
                /*
                 ** Call pagination  main function **
             */
	             $scope.pager = {};
	             $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
	             $scope.totalCountPages = data.totalCount;

	             console.log("Pagination",$scope.pager);
	             console.log("Asset List - ", data);

	             $scope.pages.currPage = data.currPage;
	             $scope.pages.totalPages = data.totalPages;
	             $scope.loading = false;

	             if($scope.inventorylists && $scope.inventorylists.length > 0 ){
	                 $scope.showCurrPage = data.currPage;
	                 $scope.pageEntries = $scope.inventorylists.length;
	                 $scope.totalCountPages = data.totalCount;
	                 $scope.pageSort = 10;

	             $scope.noData = false;

	             }else{
	                  $scope.noData = true;
	             }

            });

        };

        $scope.setPage = function (page) {

            if (page < 1 || page > $scope.pager.totalPages) {
                return;
            }
            $scope.pages.currPage = page;
            if($scope.searchModule =='Transactions'){
                $scope.loadPPMJobs();
            }else{
            	$scope.search();
            }

        }

        $scope.loadSubModule = function(cb){
            $scope.pages = { currPage : 1};
            $scope.pager = {};
            return cb();
          }


			//init load
			$scope.initLoad = function(){
			     $scope.loadPageTop();
			     $scope.loadProjects();
			     $scope.loadManufacturer();
			     $scope.loadUOM();
			 }

			$scope.initList = function() {
				$scope.loadMaterials();
				$scope.setPage(1);
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
                
                $scope.exportAllData = function(type){
                    $rootScope.exportStatusObj.exportMsg = '';
                    $scope.downloader=true;
                    $scope.searchCriteria.exportType = type;
                    $scope.searchCriteria.report = true;

                    console.log('calling asset export api');
                    InventoryComponent.exportAllData($scope.searchCriteria).then(function(data){
                        var result = data.results[0];
                        console.log(result.file + ', ' + result.status + ',' + result.msg);
                        var exportAllStatus = {
                                fileName : result.file,
                                exportMsg : 'Exporting All...',
                                url: result.url
                        };
                        $scope.exportStatusMap[0] = exportAllStatus;
                        console.log('exportStatusMap size - ' + $scope.exportStatusMap.length);
                        $scope.start();
                      },function(err){
                          console.log('error message for export all ')
                          console.log(err);
                  });
               };
                
                
                $scope.exportStatusMap = [];
                $scope.exportStatus = function() {
                    //console.log('empId='+$scope.empId);
                    console.log('exportStatusMap length -'+$scope.exportStatusMap.length);
                    angular.forEach($scope.exportStatusMap, function(exportStatusObj, index){
                        if(!exportStatusObj.empId) {
                            exportStatusObj.empId = 0;
                        }
                        InventoryComponent.exportStatus(exportStatusObj.fileName).then(function(data) {
                            if(data) {
                                exportStatusObj.exportStatus = data.status;
                                console.log('exportStatus - '+ exportStatusObj);
                                exportStatusObj.exportMsg = data.msg;
                                $scope.downloader=false;
                                console.log('exportMsg - '+ exportStatusObj.exportMsg);
                                if(exportStatusObj.exportStatus == 'COMPLETED'){
                                    if(exportStatusObj.url) {
                                        exportStatusObj.exportFile = exportStatusObj.url;
                                    }else {
                                        exportStatusObj.exportFile = data.file;
                                    }
                                    console.log('exportFile - '+ exportStatusObj.exportFile);
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
                
             // store the interval promise in this variable
                var promise;

             // starts the interval
                $scope.start = function() {
                  // stops any running interval to avoid two intervals running at the same time
                  $scope.stop();

                  // store the interval promise
                  promise = $interval($scope.exportStatus, 5000);
                  console.log('promise -'+promise);
                };

                // stops the interval
                $scope.stop = function() {
                  $interval.cancel(promise);
                };


    });
