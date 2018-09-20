'use strict';

angular.module('timeSheetApp')
    .controller('InventoryTransactionController', function ($rootScope, $scope, $state, $timeout, ProjectComponent, SiteComponent,$http,$stateParams,$location,
    			ManufacturerComponent, InventoryComponent, InventoryTransactionComponent, IndentComponent, PurchaseComponent, $filter, PaginationComponent,$interval) {

        
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
    	$scope.selectedIndent = {};
    	$scope.searchSite ={};
        $scope.searchProject ={};
        $scope.searchItemCode = null;
        $scope.searchItemName = null;
        $scope.searchItemGroup = null;
        $scope.selectedTransactionType = null;
        $scope.searchCreatedDate = "";
        $scope.searchCreatedDateSer = null;
        $scope.transactionCriteria = {};
        $scope.searchCriteria = {};
        $scope.selectedItemCode = {};
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
            $scope.searchSite ={};
            $scope.searchProject ={};
            $scope.selectedItemGroup ={};
            $scope.selectedTransactionType = null;

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
                $scope.selectedIndent = null;
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
    		console.log($scope.selectedIndent);
    		$scope.materialItems = [];
    		$scope.selectedItems = [];
    		if($scope.selectedIndent) {
    			IndentComponent.findById($scope.selectedIndent.id).then(function(data) {
    				console.log(data);
    				$scope.materialItems = data.items;
    				if($scope.materialItems.length > 0) { 
    					$scope.materialItems.map(function(item) { 
    						if(item.pendingQuantity <= 0) {
    							$scope.materialItems.splice(item, 1);
    						}
    					});
    				}
    				$scope.loadingStop();
    			});
    		}
    		
    	}
    	
    	$scope.loadPurchaseItems = function() {
    		console.log($scope.selectedPurchaseReq);
    		$scope.materialItems = [];
    		$scope.selectedItems = [];
    		if($scope.selectedPurchaseReq) {
    			PurchaseComponent.findById($scope.selectedPurchaseReq.id).then(function(data) {
    				console.log(data);
    				$scope.materialItems = data.items;
    				$scope.loadingStop();
    			});
    		}
    	}
    	
    	$scope.loadPurchases = function() {
    		console.log($scope.selectedPurchaseReq);
    		if($scope.projectSite) {
    			console.log($scope.projectSite);
    			$scope.search = {};
    			$scope.search.siteId = $scope.projectSite.id;
    			$scope.search.requestStatus = "APPROVED";
    			PurchaseComponent.search($scope.search).then(function(data) { 
    				console.log(data);
    				$scope.purchaseItems = data.transactions;
    			});
    		}
    	}
    	
    	$scope.loadIndents = function() { 
    		if($scope.projectSite) {
    			console.log($scope.projectSite);
    			$scope.search = {};
    			$scope.search.siteId = $scope.projectSite.id;
    			$scope.search.indentStatus = "PENDING";
    			IndentComponent.search($scope.search).then(function(data) { 
    				console.log(data);
    				$scope.materialIndents = data.transactions;
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
        
        $scope.inventory.transactionDate = new Date();
        $scope.ppmFrom = $filter('date')(new Date(), 'dd/MM/yyyy');
        $scope.ppmTo = $filter('date')(new Date(), 'dd/MM/yyyy');
        
        $('#dateFilterIssuedDate').datetimepicker().on('dp.show', function (e) {
            return $(this).data('DateTimePicker');
        });

        $('input#dateFilterIssuedDate').on('dp.change', function(e){
            $scope.inventory.transactionDate = e.date._d;
            $scope.ppmFrom = $filter('date')(e.date._d, 'dd/MM/yyyy');
        });
        
        $('#dateFilterReceivedDate').datetimepicker().on('dp.show', function (e) {
            return $(this).data('DateTimePicker');
        });

        $('input#dateFilterReceivedDate').on('dp.change', function(e){
            $scope.inventory.transactionDate = e.date._d;
            $scope.ppmTo = $filter('date')(e.date._d, 'dd/MM/yyyy');
        });
        
    	$scope.change = function() {
			console.log($scope.selectedItemCode);
			if($scope.selectedItemCode){
				$scope.selectedItemName = $scope.selectedItemCode.materialName;
				if($scope.selectedItemCode.storeStock) {
					$scope.inventory.storeStock = $scope.selectedItemCode.storeStock;
				}else{
					$scope.inventory.storeStock= $scope.selectedItemCode.materialStoreStock;
				}
				$scope.inventory.quantity = $scope.selectedItemCode.issuedQuantity;
				$scope.inventory.uom = $scope.selectedItemCode.materialUom;
			}
			
		}
    	
//    	$scope.site = true;
//    	$scope.loadSiteItems = function() {
//    		if($scope.projectSite) {
//    			$scope.searchCriteria.siteId = $scope.projectSite.id;
//    			InventoryComponent.search($scope.searchCriteria).then(function(data) {
//    				console.log(data);
//    				$scope.materialItems = data.transactions;
//    				$scope.selectedItemName = "";
//    				$scope.inventory.storeStock= "";
//    				$scope.inventory.quantity = "";
//    				$scope.inventory.uom = "";
//    				$scope.inventory.transactionDate = "";
//    				document.getElementById('dateFilterTransactionDate').value = "";
//    			});
//    		}
//    	}
    	
    	$scope.selectedItems = [];
    	
    	$scope.checkSelected = function(material) {
    		$scope.selectedItems.push(material);
    	}
    	
    	$scope.allItemsSelected = false;
    	
        $scope.selectAll = function () {
        	
            $scope.selectedItems = [];

            // Loop through all the entities and set their isChecked property
            for (var i = 0; i < $scope.materialItems.length; i++) {
//            	$scope.materialItems[i].issuedQuantity = $scope.materialItems[i].pendingQuantity;
                $scope.selectedItems.push($scope.materialItems[i]);

                $scope.materialItems[i].isChecked = $scope.allItemsSelected;
            }

            if(!$scope.allItemsSelected){
                $scope.selectedItems = [];
            }
        };
        
        $scope.selectedOne = function (material) {

            if($scope.selectedItems.indexOf(material) <= -1){
//            	material.issuedQuantity = material.pendingQuantity;
            	$scope.selectedItems.push(material);

            }else if($scope.selectedItems.indexOf(material) > -1){

                var remId =$scope.selectedItems.indexOf(material);

               $scope.selectedItems.splice(remId, 1);
            }
            // If any entity is not checked, then uncheck the "allItemsSelected" checkbox

            for (var i = 0; i <= $scope.materialItems.length; i++) {
            	console.log($scope.materialItems[i]);
                if (!$scope.materialItems[i].isChecked) {
                    $scope.allItemsSelected = false;
                    return;
                }
            }

            //If not the check the "allItemsSelected" checkbox
            $scope.allItemsSelected = true;
        };
        
        $scope.validate = function(material, issuedQty) {   // 2
			console.log(material);
			console.log(issuedQty);
			if(material.pendingQuantity >= issuedQty){    //  2 >= 2
				console.log("save issued request");
				material.currentQuantity = issuedQty;
			}else{
				$scope.showNotifications('top','center','danger','Quantity cannot exceeds a required quantity');
			}
			
		}
        
        $scope.validateReq = function(material, approvedQty) {   // 2
			console.log(material);
			console.log(approvedQty);
			if(material.approvedQty >= approvedQty){    //  2 >= 2
				console.log("save received request");
				material.currentAprQty = approvedQty;
			}else{
				$scope.showNotifications('top','center','danger','Quantity cannot exceeds a approved quantity');
			}
			
		}
        
        $scope.changeType = function() { 
        	$scope.selectedIndent = null;
        	$scope.selectedPurchaseReq = null;
        	$scope.materialItems = [];
        	$scope.selectedItems = [];
        }
        
        
        /* Save material Transaction */
    	$scope.saveInventoryTrans = function() {
    		if($scope.client){
    			$scope.inventory.projectId = $scope.client.id;
    		}
    		
    		if($scope.projectSite){
    			$scope.inventory.siteId = $scope.projectSite.id;
    		}
    		
    		if($scope.selectedItemCode){
    			$scope.inventory.materialId = $scope.selectedItemCode.materialId
    			$scope.inventory.materialGroupId = $scope.selectedItemCode.materialItemGroupId;
    		}
    		
    		if($scope.selectedTransactionType === 'ISSUED') { 
    			$scope.inventory.transactionType = $scope.selectedTransactionType;
    			$scope.inventory.materialIndentId = $scope.selectedIndent.id;
    			$scope.inventory.items = $scope.selectedItems;
    			if($scope.selectedItems.length > 0) { 
    				$scope.selectedItems.map(function(item) {
    					if(item.currentQuantity >= 0) { 
    						item.issuedQuantity = item.currentQuantity;
    					}
    				});
    			}
    		}
    		
    		if($scope.selectedTransactionType === 'RECEIVED') {
    			$scope.inventory.transactionType = $scope.selectedTransactionType;
    			$scope.inventory.purchaseRequisitionId = $scope.selectedPurchaseReq.id;
    			$scope.inventory.prItems = $scope.selectedItems;
    			if($scope.selectedItems.length > 0) {
    				$scope.selectedItems.map(function(item) { 
    					if(item.currentAprQty >= 0) {
    						item.approvedQty = item.currentAprQty; 
    					}
    				});
    			}
    		}
    		
    		console.log($scope.selectedItems);
    		
    		console.log(JSON.stringify($scope.inventory));
    		
    		InventoryTransactionComponent.create($scope.inventory).then(function(response) { 
    			console.log(response);
                $scope.loadingStop();
                $scope.inventory = "";
                $scope.showNotifications('top','center','success','Material Transaction has been created!');
                $location.path('/inventory-transaction-list');
    		}).catch(function (response) {
                $scope.loadingStop();
                $scope.btnDisabled= false;
                $scope.success = null;
                console.log('Error - '+ response.data);
                console.log('status - '+ response.status + ' , message - ' + response.data.message);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                        $scope.errorAssetsExists = 'ERROR';
                    $scope.showNotifications('top','center','danger','Material Transaction Already Exists');
                } else {
                    $scope.showNotifications('top','center','danger','Unable to creating Transaction. Please try again later..');
                    $scope.error = 'ERROR';
                }
            });
    		
    		
    	}
    	
    	$scope.viewInventoryTrans = function() {
    		InventoryTransactionComponent.findById($stateParams.id).then(function(data) { 
    			console.log(data);
    			$scope.transactionViews = data;
    			$scope.loadingStop();
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
    	
    	$scope.typeCheck = function(ref) {
    		console.log('called...' +ref);
    		$scope.search = {};
    		$scope.search.indentRefNumber = ref;
    		IndentComponent.search($scope.search).then(function(data){ 
    			console.log(data.transactions);
    			$scope.lists = data.transactions;
    		});
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
            if($scope.selectedTransactionType){
            	$scope.searchCriteria.transactionType = $scope.selectedTransactionType;
            }
            if($scope.searchIndentNumber) {
            	$scope.searchCriteria.indentRefNumber = $scope.searchIndentNumber;
            }
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
        	$scope.inventoryTransactionlists = '';
        	$scope.inventoryTranslistLoader = false;
        	$scope.loadPageTop();
        	InventoryTransactionComponent.search($scope.searchCriteria).then(function (data) {
        		console.log(data);
                $scope.inventoryTransactionlists = data.transactions;
                $scope.loadingStop();
                $scope.inventoryTranslistLoader = true;
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

                $scope.exportAllData = function(type){
                    $rootScope.exportStatusObj.exportMsg = '';
                    $scope.downloader=true;
                    $scope.searchCriteria.exportType = type;
                    $scope.searchCriteria.report = true;

                    console.log('calling asset export api');
                    InventoryTransactionComponent.exportAllData($scope.searchCriteria).then(function(data){
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
                        InventoryTransactionComponent.exportStatus(exportStatusObj.fileName).then(function(data) {
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
