'use strict';

angular.module('timeSheetApp')
    .controller('InventoryTransactionController', function ($rootScope, $scope, $state, $timeout, ProjectComponent, SiteComponent,$http,$stateParams,$location,
    			ManufacturerComponent, InventoryComponent, InventoryTransactionComponent, IndentComponent, PurchaseComponent, $filter, PaginationComponent,$interval,getLocalStorage) {

    	$rootScope.loginView = false;
    	$scope.inventory = {};
    	$scope.editInventoryTrans = {};
    	$scope.project = null;
    	$scope.projectSite = null;
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
        $scope.searchIndentNumber = null;
        $scope.searchTransactionType = null;
        //$scope.selectedTransactionType = "RECEIVED";
        $scope.selectedTransactionType = null;
        $scope.searchCreatedDate = "";
        $scope.searchCreatedDateSer = null;
        $scope.transactionCriteria = {};
        $scope.searchCriteria = {};
        $scope.selectedItemCode = {};
    	$scope.pages = { currPage : 1};
    	$scope.pageSort = 10;
        $scope.pager = {};

        /** Ui-select scopes **/
        $scope.allClients = {id:0 , name: '-- ALL CLIENTS --'};
        $scope.client = {};
        $scope.clients = [];
        $scope.allSites = {id:0 , name: '-- ALL SITES --'};
        $scope.sitesListOne = {};
        $scope.sitesLists = [];
        $scope.sitesListOne.selected =  null;
        $scope.allRegions = {id:0 , name: '-- SELECT REGIONS --'};
        $scope.regionsListOne = {};
        $scope.regionsLists = [];
        $scope.regionsListOne.selected =  null;
        $scope.allBranchs = {id:0 , name: '-- SELECT BRANCHES --'};
        $scope.branchsListOne = {};
        $scope.branchsLists = [];
        $scope.branchsListOne.selected =  null;

        $scope.clientFilterDisable = true;
        $scope.siteFilterDisable = true;

    	$rootScope.exportStatusObj  ={};

        $scope.refreshPage = function() {
            $scope.clearFilter();
            $scope.search();
        }


        $scope.clearFilter = function() {
            $scope.selectedManufacturer = {};
            $scope.searchItemCode = null;
            $scope.searchCriteria = {};
            $scope.selectedSite = null;
            $scope.selectedStatus = null;
            $scope.searchItemName = null;
            $scope.searchItemGroup = null;
            $scope.searchIndentNumber = null;
            $scope.searchCreatedDate = null
            $scope.searchSite ={};
            $scope.searchProject ={};
            $scope.selectedItemGroup ={};
            $scope.searchTransactionType = null;
            $scope.downloader=false;
            $scope.downloaded = true;

            $scope.siteFilterDisable = true;
            $scope.regionFilterDisable = true;
            $scope.branchFilterDisable = true;
            $scope.downloader=false;
            $scope.downloaded = true;

            /** Ui-select scopes **/
            $scope.client.selected = null;
            $scope.sitesLists =  [];
            $scope.sitesListOne.selected =  null;
            $scope.regionsLists =  [];
            $scope.regionsListOne.selected =  null;
            $scope.branchsLists =  [];
            $scope.branchsListOne.selected =  null;

            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            //$scope.search();
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
                $scope.projects = data;
                /** Ui-select scope **/
                $scope.clients[0] = $scope.allClients;
                //
                for(var i=0;i<$scope.projects.length;i++)
                {
                    //$scope.uiClient[i] = $scope.projects[i].name;
                    $scope.clients[i+1] = $scope.projects[i];
                }

                $scope.clientDisable = false;
                $scope.clientFilterDisable = false;
            });
        };

        /** Ui-select function **/

        $scope.loadDepSitesList = function (searchProject) {
            if(searchProject){
                $scope.siteSpin = true;
                $scope.searchProject = searchProject;
                if(jQuery.isEmptyObject($scope.searchProject) == false && $scope.searchProject.id == 0){
                    SiteComponent.findAll().then(function (data) {
                        //$scope.selectedSite = null;
                        $scope.sitesList = data;
                        $scope.sitesLists = [];
                        $scope.sitesListOne.selected = null;
                        $scope.sitesLists[0] = $scope.allSitesVal;

                        for(var i=0;i<$scope.sitesList.length;i++)
                        {
                            $scope.sitesLists[i+1] = $scope.sitesList[i];
                        }
                        $scope.siteFilterDisable = false;
                        $scope.siteSpin = false;
                    });
                }else{
                    if(jQuery.isEmptyObject($scope.selectedProject) == false) {
                        var depProj=$scope.selectedProject.id;
                    }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                        var depProj=$scope.searchProject.id;
                    }else{
                        var depProj=0;
                    }

                    ProjectComponent.findSites(depProj).then(function (data) {
                        // $scope.selectedSite = null;
                        $scope.sitesList = data;
                        $scope.sitesLists = [];
                        $scope.sitesListOne.selected = null;
                        $scope.sitesLists[0] = $scope.allSitesVal;

                        for(var i=0;i<$scope.sitesList.length;i++)
                        {
                            $scope.sitesLists[i+1] = $scope.sitesList[i];
                        }
                        $scope.siteFilterDisable = false;
                        $scope.siteSpin = false;
                    });
                }
            }

        };

        $scope.regionFilterDisable = true;
        $scope.branchFilterDisable = true;

        /*** UI select (Region List) **/
        $scope.loadRegionsList = function (projectId, callback) {
            $scope.regionSpin = true;
            $scope.branchsLists = [];
            $scope.branchsListOne.selected = null;
            $scope.branchFilterDisable = true;
            SiteComponent.getRegionByProject(projectId).then(function (response) {
                // //console.log(response);
                $scope.regionList = response;
                $scope.regionsLists = [];
                $scope.regionsListOne.selected = null;
                $scope.regionsLists[0] = $scope.allRegions;


                for(var i=0;i<$scope.regionList.length;i++)
                {
                    $scope.regionsLists[i+1] = $scope.regionList[i];
                }

                // //console.log('region list : ' + JSON.stringify($scope.regionList));
                $scope.regionSpin = false;
                $scope.regionFilterDisable = false;
                //callback();
            })
        };

        /*** UI select (Branch List) **/
        $scope.loadBranchList = function (projectId, callback) {

            if(projectId){

                if($scope.regionsListOne.selected){
                    //console.log($scope.regionsListOne.selected);
                    $scope.branchSpin = true;
                    SiteComponent.getBranchByProject(projectId,$scope.regionsListOne.selected.id).then(function (response) {
                        //console.log(response);
                        $scope.branchList = response;
                        if($scope.branchList) {
                            $scope.branchsLists = [];
                            $scope.branchsListOne.selected = null;
                            $scope.branchsLists[0] = $scope.allBranchs;

                            for(var i=0;i<$scope.branchList.length;i++)
                            {
                                $scope.branchsLists[i+1] = $scope.branchList[i];
                            }
                            /* if($scope.branchList) {
                                            for(var i = 0; i < $scope.branchList.length; i++) {
                                                $scope.uiBranch.push($scope.branchList[i].name);
                                            }*/
                            $scope.branchSpin = false;
                            $scope.branchFilterDisable = false;
                        }
                        else{
                            //console.log('branch list : ' + JSON.stringify($scope.branchList));
                            $scope.getSitesBYRegionOrBranch(projectId,$scope.regionsListOne.selected.name,null);
                            $scope.branchSpin = false;
                            $scope.branchFilterDisable = false;
                            //callback();
                        }

                    })

                }else{
                    $scope.showNotifications('top','center','danger','Please Select Region to continue...');

                }

            }else{
                $scope.showNotifications('top','center','danger','Please select Project to continue...');

            }
        };

    	$scope.loadAllSites = function () {
            $scope.projectSite=null;
            $scope.sites = "";
            $scope.materialItems = [];
            $scope.selectedItems = [];
            $scope.materialIndents = [];
            $scope.selectedIndent = null;
            $scope.purchaseItems = [];
            $scope.selectedPurchaseReq = null;
            $scope.allItemsSelected = false;
    		if($scope.project) {
    			ProjectComponent.findSites($scope.project.id).then(function (data) {
                    $scope.searchSite = null;
                    $scope.sites = data;
                });
    		}
        }

    	$scope.loadSites = function () {
            SiteComponent.findAll().then(function (data) {
                $scope.selectedIndent = null;
                $scope.sites = data;
            });
        }

    	$scope.loadManufacturer = function () {
            ManufacturerComponent.findAll().then(function (data) {
                //console.log("Loading all Manufacturer -- " , data);
                $scope.manufacturers = data;
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
            $scope.materialUOMs = "";
    		InventoryComponent.getMaterialUOM().then(function(data){
    			console.log(data);
    			$scope.materialUOMs = data;
    		});
    	}

    	$scope.loadMaterialItmGroup = function () {
            $scope.materialItmGroups = "";
        	InventoryComponent.loadItemGroup().then(function (data) {
                $scope.materialItmGroups = data;

            });
        }


    	$scope.loadItems = function() {
            console.log($scope.selectedIndent);
            $scope.materialItems = [];
            $scope.selectedItems = [];
            $scope.allItemsSelected = false;
            if(!$scope.projectSite){
                alert('Please select site before select Indent Req.No...!!!');
                return false;
            }
    		if($scope.selectedIndent) {
                $scope.loadingStart();
                $scope.materialItems = [];
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
            $scope.allItemsSelected = false;
            if(!$scope.projectSite){
    	        alert('Please select site before select Purchase Req.No...!!!');
    	        return false;
            }
    		if($scope.selectedPurchaseReq) {
                $scope.materialItems = [];
    			PurchaseComponent.findById($scope.selectedPurchaseReq.id).then(function(data) {
    				console.log(data);
    				$scope.materialItems = data.items;
    			});
    		}
    	}
        $scope.purchaseItemsSpin = false;
    	$scope.loadPurchases = function() {
    		console.log($scope.selectedPurchaseReq);
            $scope.purchaseItems = [];
            $scope.selectedPurchaseReq = null;
            $scope.materialItems = [];
            $scope.selectedItems = [];
            $scope.allItemsSelected = false;
    		if($scope.projectSite) {
                $scope.purchaseItemsSpin = true;
    			console.log($scope.projectSite);
    			$scope.searchLoadPurchases = {};
    			$scope.searchLoadPurchases.siteId = $scope.projectSite.id;
    			$scope.searchLoadPurchases.requestStatus = "APPROVED";
    			PurchaseComponent.search($scope.searchLoadPurchases).then(function(data) {
    				console.log(data);
    				if(data.transactions){
                        $scope.purchaseItems = data.transactions;
                    }else{
                        $scope.purchaseItems = [];
                    }
                    $scope.purchaseItemsSpin = false;
    			});
    		}
    	}
        $scope.materialIndentsSpin = false;
    	$scope.loadIndents = function() {
            $scope.materialIndents = [];
            $scope.selectedIndent = null;
            $scope.materialItems = [];
            $scope.selectedItems = [];
            $scope.allItemsSelected = false;
    		if($scope.projectSite) {
                $scope.materialIndentsSpin = true;
    			console.log($scope.projectSite);
    			$scope.searchIndents = {};
    			$scope.searchIndents.siteId = $scope.projectSite.id;
    			$scope.searchIndents.indentStatus = "PENDING";
    			IndentComponent.search($scope.searchIndents).then(function(data) {
    				console.log('indent>>>',data);
    				if(data.transactions){
                        $scope.materialIndents = data.transactions;
                    }else{
                        $scope.materialIndents = [];
                    }
                    $scope.materialIndentsSpin = false;
    			});
    		}
    	}

    	$scope.loadTransactionType = function() {
            $scope.transactionTypes = "";
    		InventoryTransactionComponent.getTransactionType().then(function(data) {
    			console.log(data);
    			$scope.transactionTypes = data;
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
        $scope.selectIssueDate = $filter('date')(new Date(), 'dd/MM/yyyy');
        $scope.selectReceivedDate = $filter('date')(new Date(), 'dd/MM/yyyy');

        $('#dateFilterIssuedDate').datetimepicker().on('dp.show', function (e) {
            return $(this).data('DateTimePicker');
        });

        $('input#dateFilterIssuedDate').on('dp.change', function(e){
            $scope.inventory.transactionDate = e.date._d;
            $scope.selectIssueDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
        });

        $('#dateFilterReceivedDate').datetimepicker().on('dp.show', function (e) {
            return $(this).data('DateTimePicker');
        });

        $('input#dateFilterReceivedDate').on('dp.change', function(e){
            $scope.inventory.transactionDate = e.date._d;
            $scope.selectReceivedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
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
            if($scope.materialItems.length > 0){
                // Loop through all the entities and set their isChecked property
                for (var i = 0; i < $scope.materialItems.length; i++) {
//            	$scope.materialItems[i].issuedQuantity = $scope.materialItems[i].pendingQuantity;
                    $scope.selectedItems.push($scope.materialItems[i]);

                    $scope.materialItems[i].isChecked = $scope.allItemsSelected;
                }

                if(!$scope.allItemsSelected){
                    $scope.selectedItems = [];
                }
            }else{
                $scope.allItemsSelected= false;
            }

        };

        $scope.selectedOne = function (material) {
            if($scope.materialItems.length > 0){
                if($scope.selectedItems.indexOf(material) <= -1){
//            	material.issuedQuantity = material.pendingQuantity;
                    $scope.selectedItems.push(material);

                }else if($scope.selectedItems.indexOf(material) > -1){

                    var remId =$scope.selectedItems.indexOf(material);

                    $scope.selectedItems.splice(remId, 1);
                }
                // If any entity is not checked, then uncheck the "allItemsSelected" checkbox

                    for (var i = 0; i < $scope.materialItems.length; i++) {
                        console.log($scope.materialItems[i]);
                        if (!$scope.materialItems[i].isChecked) {
                            $scope.allItemsSelected = false;
                            return;
                        }
                    }

                    //If not the check the "allItemsSelected" checkbox
                    $scope.allItemsSelected = true;

            }


        };

        $scope.validate = function(material, issuedQty) {   // 2
			console.log(material);
			console.log(issuedQty);
			if(material.pendingQuantity >= issuedQty){    //  2 >= 2
				console.log("save issued request");
				material.currentQuantity = issuedQty;
			}else{
				$scope.showNotifications('top','center','danger','Invalid Issue Qty');
			}

		}

        $scope.validateReq = function(material, approvedQty) {   // 2
			console.log(material);
			console.log(approvedQty);
			if(material.approvedQty >= approvedQty){    //  2 >= 2
				console.log("save received request");
				material.currentAprQty = approvedQty;
			}else{
				$scope.showNotifications('top','center','danger','Invalid Approve Qty');
			}

		}

        $scope.changeType = function() {
        	$scope.selectedIndent = null;
        	$scope.selectedPurchaseReq = null;
        	$scope.selectedItems = [];
        	$scope.allItemsSelected = false;
        }


        //Conformation modal

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
                $scope.cancelInventoryTrans();
            }
            else if(text == 'save')
            {
                /** @reatin - retaining scope value.**/
                $rootScope.retain=1;
                $scope.saveInventoryTrans();
            }
            else if(text == 'update')
            {
                /** @reatin - retaining scope value.**/
                $rootScope.retain=1;
                $scope.updateInventoryTrans();
            }
        };

        //


        /* Save material Transaction */
    	$scope.saveInventoryTrans = function() {
            $scope.saveLoad = true;
    		if($scope.project){
    			$scope.inventory.projectId = $scope.project.id;
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
                $scope.saveLoad = false;
                $scope.loadingStop();
                $scope.inventory = "";
                $scope.showNotifications('top','center','success','Material Transaction has been created!');
                $location.path('/inventory-transaction-list');
    		}).catch(function (response) {
                $scope.loadingStop();
                $scope.saveLoad = false;
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

    	$scope.viewInventoryTrans = function(id) {
    	    if(id){
                $scope.loadingStart();
                $scope.saveLoad = false;
                $scope.transactionViews = "";
                InventoryTransactionComponent.findById(id).then(function(data) {
                    console.log(data);
                    $scope.transactionViews = data;
                    $scope.loadingStop();
                });
            }
    	}

        /* delete material */
        $scope.deleteConfirm = function (id){
        	$scope.inventoryId = id;
        }

        $scope.deleteMaterial = function () {
        	InventoryTransactionComponent.remove($scope.inventoryId).then(function(){
            	$scope.success = 'OK';
                $scope.showNotifications('top','center','success','Material Transaction has been deleted');
                $rootScope.retain=1;
                $scope.search();
        	});
        }
        /* end delete material */

    	$scope.editInventoryTrans = function() {
            if(parseInt($stateParams.id) > 0){
                $rootScope.loadingStart();
                InventoryTransactionComponent.findById($stateParams.id).then(function(data) {
                    $scope.editInventoryTrans = data;
                    $scope.editInventoryTrans.id = data.id;
                    $scope.editInventoryTrans.name = data.name;
                    $scope.editInventoryTrans.itemCode = data.itemCode;
                    $scope.selectedSite = {id: data.siteId, name: data.siteName};
                    $scope.project = {id: data.projectId, name: data.projectName};
                    $scope.editInventoryTrans.storeStock = data.storeStock;
                    $rootScope.loadingStop();
                }).catch(function () {
                    $scope.showNotifications('top','center','danger','Unable to load Material Transaction');
                    $location.path('/inventory-transaction-list');
                    $rootScope.loadingStop();
                })
            }else{
                $location.path('/inventory-transaction-list');
            }
    	}

    	/* Update Material transaction */
    	$scope.updateInventoryTrans = function () {
            $scope.saveLoad = true;
            $scope.error = null;
            $scope.success =null;
            $scope.loadingStart();
        	if($scope.project){
    			$scope.editInventoryTrans.projectId = $scope.project.id;
    		}

    		if($scope.selectedSite){
    			$scope.editInventoryTrans.siteId = $scope.selectedSite.id;
    		}

            console.log('Inventory details ='+ JSON.stringify($scope.editInventory));

             InventoryTransactionComponent.update($scope.editInventoryTrans).then(function () {
                 $scope.saveLoad = false;
                $scope.loadingStop();
                $scope.showNotifications('top','center','success','Material Transaction updated Successfully');
                $location.path('/inventory-transaction-list');
            }).catch(function (response) {
                 $scope.saveLoad = false;
                $rootScope.loadingStop();
                $scope.success = null;
                console.log('Error - '+ response.data);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                    $scope.showNotifications('top','center','danger','Material Transaction already exist!!');
                    $scope.errorProjectExists = 'ERROR';
                } else {
                    $scope.showNotifications('top','center','danger','Unable to update Material Transaction');
                    $scope.error = 'ERROR';
                }
            });;

    	};

    	/* end update Material */

    	$scope.searchFilter = function () {
            $('.AdvancedFilterModal.in').modal('hide');
            $scope.setPage(1);
            $scope.search();
         }

    	$scope.typeCheck = function(ref) {
    		console.log('called...' +ref);
    		$scope.searchTypeCheck = {};
    		$scope.searchTypeCheck.indentRefNumber = ref;
    		IndentComponent.search($scope.searchTypeCheck).then(function(data){
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
            $scope.search();

        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
            $scope.search();

        }

        // search material transactions
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
            $scope.searchCriteria.findAll = false;

            if($scope.client.selected && $scope.client.selected.id !=0){
                $scope.searchProject = $scope.client.selected;
            }else if($stateParams.project){
                $scope.searchProject = {id:$stateParams.project.id,name:$stateParams.project.name};
                $scope.client.selected =$scope.searchProject;
                $scope.projectFilterFunction($scope.searchProject);
            }else{
                $scope.searchProject = null;
            }
            if($scope.regionsListOne.selected && $scope.regionsListOne.selected.id !=0){
                $scope.searchRegion = $scope.regionsListOne.selected;
            }else{
                $scope.searchRegion = null;
            }
            if($scope.branchsListOne.selected && $scope.branchsListOne.selected.id !=0){
                $scope.searchBranch = $scope.branchsListOne.selected;
            }else{
                $scope.searchBranch = null;
            }
            if($scope.sitesListOne.selected && $scope.sitesListOne.selected.id !=0){
                $scope.searchSite = $scope.sitesListOne.selected;
            }else if($stateParams.site){
                $scope.searchSite = {id:$stateParams.site.id,name:$stateParams.site.name};
                $scope.sitesListOne.selected = $scope.searchSite;
            }else{
                $scope.searchSite = null;
            }

            $scope.searchCriteria.isReport = false;


            if(!$scope.searchTransactionType && !$scope.searchItemCode && !$scope.searchItemName && !$scope.searchIndentNumber && !$scope.searchCreatedDate && !$scope.searchProject && !$scope.searchSite ) {
                $scope.searchCriteria.findAll = true;
            }

            if($scope.searchProject) {
                $scope.searchCriteria.projectId = $scope.searchProject.id;
                $scope.searchCriteria.projectName = $scope.searchProject.name;
            }else{
                $scope.searchCriteria.projectId = null;
                $scope.searchCriteria.projectName = null;
            }
            if($scope.searchRegion) {
                $scope.searchCriteria.regionId = $scope.searchRegion.id;
                $scope.searchCriteria.region = $scope.searchRegion.name;

            }else {
                $scope.searchCriteria.regionId = null;
                $scope.searchCriteria.region = null;
            }

            if($scope.searchBranch) {
                $scope.searchCriteria.branchId = $scope.searchBranch.id;
                $scope.searchCriteria.branch = $scope.searchBranch.name;

            }else {
                $scope.searchCriteria.branchId = null;
                $scope.searchCriteria.branch = null;
            }

            if($scope.searchSite) {
                $scope.searchCriteria.siteId = $scope.searchSite.id;
                $scope.searchCriteria.siteName = $scope.searchSite.name;
            }else{
                $scope.searchCriteria.siteId = null;
                $scope.searchCriteria.siteName = null
            }
            if($scope.searchItemCode) {
                $scope.searchCriteria.itemCode = $scope.searchItemCode;
            }else{
                $scope.searchCriteria.itemCode = "";
            }
            if($scope.searchItemName) {
                $scope.searchCriteria.materialName = $scope.searchItemName;
            }else{
                $scope.searchCriteria.materialName = "";
            }
            if($scope.searchTransactionType) {
                $scope.searchCriteria.transactionType = $scope.searchTransactionType;
            }else{
                $scope.searchCriteria.transactionType = null;
            }
            if($scope.searchIndentNumber) {
                $scope.searchCriteria.indentRefNumber = $scope.searchIndentNumber;
            }else{
                $scope.searchCriteria.indentRefNumber = "";
            }

            if($scope.searchCreatedDate){
                $scope.searchCriteria.transactionDate = $scope.searchCreatedDateSer;

            }else{
                $scope.searchCriteria.transactionDate = null;
            }

            if($scope.pageSort){
                $scope.searchCriteria.sort = $scope.pageSort;
            }

            if($scope.selectedColumn){

                $scope.searchCriteria.columnName = $scope.selectedColumn;
                $scope.searchCriteria.sortByAsc = $scope.isAscOrder;

            }else{
                $scope.searchCriteria.columnName = 'id';
                $scope.searchCriteria.sortByAsc = true;
            }

        	$scope.inventoryTransactionlists = '';
        	$scope.inventoryTranslistLoader = false;
        	$scope.loadPageTop();

            /* Localstorage (Retain old values while edit page to list) start */

            if($rootScope.retain == 1){
                $scope.localStorage = getLocalStorage.getSearch();
                //console.log('Local storage---',$scope.localStorage);

                if($scope.localStorage){
                    $scope.filter = true;
                    $scope.pages.currPage = $scope.localStorage.currPage;
                    if($scope.localStorage.projectId){

                        $scope.searchProject = {id:$scope.localStorage.projectId,name:$scope.localStorage.projectName};
                        $scope.client.selected = $scope.searchProject;
                        //$scope.loadDepSitesList($scope.client.selected);
                        $scope.projectFilterFunction($scope.searchProject);
                    }else{
                        $scope.searchProject = null;
                        $scope.client.selected = $scope.searchProject;
                    }
                    if($scope.localStorage.regionId){
                        $scope.searchRegion = {id:$scope.localStorage.regionId,name:$scope.localStorage.region};
                        $scope.regionsListOne.selected = $scope.searchRegion;

                        $scope.regionFilterFunction($scope.searchProject);
                    }else{
                        $scope.searchRegion = null;
                        $scope.regionsListOne.selected = $scope.searchRegion;
                    }
                    if($scope.localStorage.branchId){
                        $scope.searchBranch = {id:$scope.localStorage.branchId,name:$scope.localStorage.branch};
                        $scope.branchsListOne.selected = $scope.searchBranch;
                        $scope.branchFilterFunction($scope.searchProject,$scope.searchRegion);

                    }else{
                        $scope.searchBranch = null;
                        $scope.branchsListOne.selected = $scope.searchBranch;
                    }
                    if($scope.localStorage.siteId){
                        $scope.searchSite = {id:$scope.localStorage.siteId,name:$scope.localStorage.siteName};
                        $scope.sitesListOne.selected = $scope.searchSite;
                        $scope.siteFilterDisable=false;
                    }else{
                        $scope.searchSite = null;
                        $scope.sitesListOne.selected = $scope.searchSite;
                    }
                    if($scope.localStorage.transactionType){
                        $scope.searchTransactionType = $scope.localStorage.transactionType;
                    }else{
                        $scope.searchTransactionType = null;
                    }

                    if($scope.localStorage.itemCode){
                        $scope.searchItemCode  = $scope.localStorage.itemCode;
                    }else{
                        $scope.searchItemCode  = null;
                    }
                    if($scope.localStorage.materialName){
                        $scope.searchItemName  = $scope.localStorage.materialName;
                    }else{
                        $scope.searchItemName  = null;
                    }
                    if($scope.localStorage.itemGroup){
                        $scope.searchItemGroup  = $scope.localStorage.itemGroup;
                    }else{
                        $scope.searchItemGroup  = null;
                    }
                    if($scope.localStorage.indentRefNumber){
                        $scope.searchIndentNumber  = $scope.localStorage.indentRefNumber;
                    }else{
                        $scope.searchIndentNumber  = null;
                    }
                    if($scope.localStorage.transactionDate){
                        $scope.searchCreatedDate = $filter('date')($scope.localStorage.transactionDate, 'dd/MM/yyyy');
                        $scope.searchCreatedDateSer = new Date($scope.localStorage.transactionDate);
                    }else{
                        $scope.searchCreatedDate = null;
                        $scope.searchCreatedDateSer = null;
                    }


                }

                $rootScope.retain = 0;

                $scope.searchCriteras  = $scope.localStorage;
            }else{

                $scope.searchCriteras  = $scope.searchCriteria;
            }

            /* Localstorage (Retain old values while edit page to list) end */

        	InventoryTransactionComponent.search($scope.searchCriteras).then(function (data) {
        		console.log(data);
                $scope.inventoryTransactionlists = data.transactions;
                $scope.loadingStop();
                $scope.inventoryTranslistLoader = true;

                /** retaining list search value.**/
                getLocalStorage.updateSearch($scope.searchCriteras);

                /*
                 ** Call pagination  main function **
             */
	             $scope.pager = {};
	             $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
	             $scope.totalCountPages = data.totalCount;

	             console.log("Pagination",$scope.pager);
	             console.log("Inventory Transaction List - ", data);

	             $scope.pages.currPage = data.currPage;
                 $scope.pages.totalPages = data.totalPages == 0 ? 1:data.totalPages;
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
            $scope.search();


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
				//$scope.loadMaterialTrans();
                 $scope.loadPageTop();
			     $scope.setPage(1);
			}

                $scope.exportAllData = function(type){
                    $rootScope.exportStatusObj.exportMsg = '';
                    $scope.downloader=true;
                    $scope.downloaded = false;
                    $scope.searchCriteria.isReport = true;
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

                $scope.downloaded = false;

                $scope.clsDownload = function(){
                    $scope.downloaded = true;
                    $rootScope.exportStatusObj = {};
                    $scope.exportStatusMap = [];
                }

        //Search Filter Site Load Function

        $scope.projectFilterFunction = function (searchProject){
            $scope.siteSpin = true;
            ProjectComponent.findSites(searchProject.id).then(function (data) {
                $scope.selectedSite = null;
                $scope.sitesList = data;
                $scope.sitesLists = [];
                $scope.sitesLists[0] = $scope.allSites;

                for(var i=0;i<$scope.sitesList.length;i++)
                {
                    $scope.sitesLists[i+1] = $scope.sitesList[i];
                }
                $scope.siteFilterDisable = false;
                $scope.siteSpin = false;
            });

        };

        //Search Filter Region Load Function

        $scope.regionFilterFunction = function (searchProject){
            $scope.regionSpin = true;
            SiteComponent.getRegionByProject(searchProject.id).then(function (response) {
                //console.log(response);
                $scope.regionList = response;
                $scope.regionsLists = [];
                //$scope.regionsListOne.selected = null;
                $scope.regionsLists[0] = $scope.allRegions;

                for(var i=0;i<$scope.regionList.length;i++)
                {
                    $scope.regionsLists[i+1] = $scope.regionList[i];
                }

                //console.log('region list : ' + JSON.stringify($scope.regionList));
                $scope.regionSpin = false;
                $scope.regionFilterDisable = false;
                //callback();
            });
        };

        //Search Filter Branch Load Function

        $scope.branchFilterFunction = function (searchProject,searchRegion){
            $scope.branchSpin = true;
            SiteComponent.getBranchByProject(searchProject.id,searchRegion.id).then(function (response) {
                // //console.log('branch',response);
                $scope.branchList = response;
                if($scope.branchList) {
                    $scope.branchsLists = [];
                    // $scope.branchsListOne.selected = null;
                    $scope.branchsLists[0] = $scope.allBranchs;

                    for(var i=0;i<$scope.branchList.length;i++)
                    {
                        $scope.branchsLists[i+1] = $scope.branchList[i];
                    }
                    /* if($scope.branchList) {
                             for(var i = 0; i < $scope.branchList.length; i++) {
                                 $scope.uiBranch.push($scope.branchList[i].name);
                             }*/
                    $scope.branchSpin = false;
                    $scope.branchFilterDisable = false;
                }
                else{
                    //console.log('branch list : ' + JSON.stringify($scope.branchList));
                    $scope.getSitesBYRegionOrBranch($scope.searchProject.id,$scope.searchRegion.name,null);
                    $scope.branchSpin = false;
                    $scope.branchFilterDisable = false;
                    //callback();
                }

            })
        };


        $scope.getSitesBYRegionOrBranch = function (projectId, region, branch) {
            if(branch){
                $scope.siteFilterDisable = true;
                $scope.siteSpin = true;
                SiteComponent.getSitesByBranch(projectId,region,branch).then(function (data) {
                    $scope.selectedSite = null;
                    $scope.sitesList = data;
                    $scope.sitesLists = [];
                    $scope.sitesListOne.selected = null;
                    $scope.sitesLists[0] = $scope.allSites;

                    for(var i=0;i<$scope.sitesList.length;i++)
                    {
                        $scope.sitesLists[i+1] = $scope.sitesList[i];
                    }
                    $scope.siteFilterDisable = false;
                    $scope.siteSpin = false;
                });

            }else if(region){
                $scope.siteFilterDisable = true;
                $scope.siteSpin = true;

                SiteComponent.getSitesByRegion(projectId,region).then(function (data) {
                    $scope.selectedSite = null;
                    $scope.sitesList = data;
                    $scope.sitesLists = [];
                    $scope.sitesListOne.selected = null;
                    $scope.sitesLists[0] = $scope.allSites;

                    for(var i=0;i<$scope.sitesList.length;i++)
                    {
                        $scope.sitesLists[i+1] = $scope.sitesList[i];
                    }
                    $scope.siteFilterDisable = false;
                    $scope.siteSpin = false;
                })

            }/*else if(projectId >0){
            $scope.siteFilterDisable = true;
            $scope.siteSpin = true;
            ProjectComponent.findSites(projectId).then(function (data) {
                $scope.selectedSite = null;
                $scope.sitesList = data;
                $scope.sitesLists = [];
                $scope.sitesListOne.selected = null;
                $scope.sitesLists[0] = $scope.allSites;

                for(var i=0;i<$scope.sitesList.length;i++)
                {
                    $scope.sitesLists[i+1] = $scope.sitesList[i];
                }
                $scope.siteFilterDisable = false;
                $scope.siteSpin = false;
            });
        }else{

        }*/
        };

        /*
         * Ui select allow-clear modified function start
         *
         * */


        $scope.clearProject = function($event) {
            $event.stopPropagation();
            $scope.client.selected = undefined;
            $scope.regionsListOne.selected = undefined;
            $scope.branchsListOne.selected = undefined;
            $scope.sitesListOne.selected = undefined;
            $scope.regionFilterDisable = true;
            $scope.branchFilterDisable = true;
            $scope.siteFilterDisable = true;


        };

        $scope.clearRegion = function($event) {
            $event.stopPropagation();
            $scope.regionsListOne.selected = undefined;
            $scope.branchsListOne.selected = undefined;
            $scope.sitesListOne.selected = undefined;
            $scope.branchFilterDisable = true;
            $scope.siteFilterDisable = true;


        };

        $scope.clearBranch = function($event) {
            $event.stopPropagation();
            $scope.branchsListOne.selected = undefined;
            $scope.sitesListOne.selected = undefined;
            $scope.siteFilterDisable = true;


        };

        $scope.clearSite = function($event) {
            $event.stopPropagation();
            $scope.sitesListOne.selected = null;

        };



        /*
         * Ui select allow-clear modified function end
         *
         * */




    });
