'use strict';

angular.module('timeSheetApp')
    .controller('InventoryTransactionController', function ($rootScope, $scope, $state, $timeout, ProjectComponent, SiteComponent,$http,$stateParams,$location,
    			ManufacturerComponent, InventoryComponent, InventoryTransactionComponent, $filter, PaginationComponent) {

        
    	$rootScope.loginView = false;
    	$scope.inventory = {};
    	$scope.editInventoryTrans = {};
    	$scope.client = {};
    	$scope.projectSite = {};
    	$scope.selectedManufacturer = {};
    	$scope.selectedClient = {};
    	$scope.selectedSite = {};
    	$scope.selectedUOM;
    	$scope.selectedUnit = {};
    	$scope.selectedItemGroup = {};
    	$scope.materialItemGroup = {};
    	$scope.selectedMaterialItem = {};
    	$scope.searchSite ={};
        $scope.searchProject ={};
        $scope.searchItemCode = null;
        $scope.searchItemName = null;
        $scope.searchItemGroup = null;
        $scope.selectedTransactionType = null;
        $scope.searchCreatedDate = "";
        $scope.searchCreatedDateSer = null;
        $scope.transactionCriteria = {};
    	$scope.pages = { currPage : 1};
    	
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
    	
    	$scope.loadMaterialItmGroup = function () {
        	InventoryComponent.loadItemGroup().then(function (data) {
                $scope.materialItmGroups = data;
                $scope.loadingStop();
            });
        }
    	
    	$scope.loadItems = function() {
    		if($scope.selectedItemGroup) { 
    			InventoryTransactionComponent.findByMaterialItem($scope.selectedItemGroup.id).then(function(data) {
    				console.log(data);
    				$scope.materialItems = data;
    				$scope.loadingStop();
    			});
    		}
    	}
    	
    	$scope.loadTransactionType = function() { 
    		InventoryTransactionComponent.getTransactionType().then(function(data) { 
    			console.log(data);
    			$scope.transactionTypes = data;
    			$scope.loadingStop();
    		});
    	}
    	
    	$scope.loadStocks = function() { 
    		if($scope.selectedMaterialItem) { 
    			$scope.inventory.storeStock = $scope.selectedMaterialItem.storeStock;
    		}
    	}
    	
    	$scope.cancelInventoryTrans = function(){
            $location.path('/inventory-transaction-list');
    	}
    	
    	 $('input#searchCreatedDate').on('dp.change', function(e){
             $scope.searchCreatedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
             $scope.searchCreatedDateSer = e.date._d;
    	 });
    	
        
        $scope.loadMaterialTrans = function() { 
        	$scope.refreshPage();
        	$scope.search();
        	$location.path('/inventory-transaction-list');
        }
        
        
        $('#dateFilterTransactionDate').datetimepicker().on('dp.show', function (e) {
            return $(this).data('DateTimePicker').minDate(e.date);
        });

        $('input#dateFilterTransactionDate').on('dp.change', function(e){
        	alert(JSON.stringify(e));
            $scope.inventory.transactionDate = e.date._d;
            $scope.ppmFrom = $filter('date')(e.date._d, 'dd/MM/yyyy');
        });

        
        /* Save material Transaction */
    	$scope.saveInventoryTrans = function() {
    		if($scope.client){
    			$scope.inventory.projectId = $scope.client.id;
    		}
    		
    		if($scope.projectSite){
    			$scope.inventory.siteId = $scope.projectSite.id;
    		}
    		
    		if($scope.selectedItemGroup){
    			$scope.inventory.materialGroupId = $scope.selectedItemGroup.id;
    		}
    		
    		if($scope.selectedMaterialItem) { 
    			$scope.inventory.materialId = $scope.selectedMaterialItem.id;
    		}
    		
    		if($scope.selectedTransactionType) { 
    			$scope.inventory.transactionType = $scope.selectedTransactionType;
    		}
    		
    		
    		console.log(JSON.stringify($scope.inventory));
    		
//    		InventoryTransactionComponent.create($scope.inventory).then(function(data) { 
//    			console.log(data);
//                $scope.loadingStop();
//                $scope.inventory = "";
//                $scope.showNotifications('top','center','success','Material Transaction has been created!');
//                $scope.loadMaterialTrans();
//    		}).catch(function (response) {
//                $scope.loadingStop();
//                $scope.btnDisabled= false;
//                $scope.success = null;
//                console.log('Error - '+ response.data);
//                console.log('status - '+ response.status + ' , message - ' + response.data.message);
//                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
//                        $scope.errorAssetsExists = 'ERROR';
//                    $scope.showNotifications('top','center','danger','Material Transaction Already Exists');
//                } else {
//                    $scope.showNotifications('top','center','danger','Unable to creating Transaction. Please try again later..');
//                    $scope.error = 'ERROR';
//                }
//            });
    		
    		
    	}
    	
    	$scope.viewInventoryTrans = function() {
    		InventoryTransactionComponent.findById($stateParams.id).then(function(data) { 
    			console.log(data);
    			$scope.transactionViews = data;
    		});
    	}
        
        /* delete material */
        $scope.deleteConfirm = function (id){
        	$scope.inventoryId = id;
        }

        $scope.deleteMaterial = function () {
        	InventoryTransactionComponent.remove($scope.inventoryId).then(function(){
            	$scope.success = 'OK';
                $scope.showNotifications('top','center','success','Material Transaction has been deleted');
            	$scope.loadMaterialTrans();
        	});
        }
        /* end delete material */
        
    	$scope.editInventoryTrans = function() {
    		InventoryTransactionComponent.findById($stateParams.id).then(function(data) { 
    			console.log(data);
    			$scope.editInventoryTrans = data;
    			$scope.editInventoryTrans.id = data.id;
    			$scope.editInventoryTrans.name = data.name;
    			$scope.editInventoryTrans.itemCode = data.itemCode;
    			$scope.selectedSite = {id: data.siteId, name: data.siteName};
    			$scope.client = {id: data.projectId, name: data.projectName};
    			$scope.editInventoryTrans.storeStock = data.storeStock;
    		});
    	}
    	
    	/* Update Material transaction */
    	$scope.updateInventoryTrans = function () {
            $scope.error = null;
            $scope.success =null;
            $scope.loadingStart();
        	if($scope.client){
    			$scope.editInventoryTrans.projectId = $scope.client.id;
    		}
    		
    		if($scope.selectedSite){
    			$scope.editInventoryTrans.siteId = $scope.selectedSite.id;
    		}
    		
            console.log('Inventory details ='+ JSON.stringify($scope.editInventory));

             InventoryTransactionComponent.update($scope.editInventoryTrans).then(function () {
                $scope.loadingStop();
                $scope.showNotifications('top','center','success','Material Transaction updated Successfully');
                $location.path('/inventory-transaction-list');
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
                $scope.searchCriteria.transactionDate = $scope.searchCreatedDateSer;
                $scope.searchCriteria.findAll = false;
               }else{
                $scope.searchCriteria.transactionDate = null;
                $scope.searchCriteria.findAll = true;
               }
	   	     }else{
	                $scope.searchCriteria.transactionDate = null;
	   	     }
        	console.log($scope.searchCriteria);
        	InventoryTransactionComponent.search($scope.searchCriteria).then(function (data) {
        		console.log(data);
                $scope.inventoryTransactionlists = data.transactions;
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
	
	             if($scope.inventoryTransactionlists && $scope.inventoryTransactionlists.length > 0 ){
	                 $scope.showCurrPage = data.currPage;
	                 $scope.pageEntries = $scope.inventoryTransactionlists.length;
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
			
			$scope.initTransactionList = function() { 
				$scope.loadMaterialTrans();
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


    
      
});
