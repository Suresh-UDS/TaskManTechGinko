'use strict';

angular.module('timeSheetApp')
    .controller('InventoryController', function ($rootScope, $scope, $state, $timeout, ProjectComponent, SiteComponent,$http,$stateParams,$location,
    		ManufacturerComponent, InventoryComponent, $filter, $interval, PaginationComponent,getLocalStorage,Idle) {
        Idle.watch();
    	$rootScope.loginView = false;
    	$scope.inventory = {};
    	$scope.editInventory = {};
    	$scope.client = {};
    	$scope.projectSite = {};
    	$scope.selectedManufacturer = null;
    	$scope.selectedClient = {};
    	$scope.selectedSite = {};
    	$scope.selectedUOM;
    	$scope.selectedUnit = {};
    	$scope.selectedItemGroup = {};
    	$scope.materialItemGroup = {};
    	$scope.searchSite =null;
        $scope.searchProject =null;
        $scope.searchItemCode = null;
        $scope.searchItemName = null;
        $scope.searchItemGroup = null;
        $scope.searchCreatedDate = null;
        $scope.searchCreatedDateSer = null;
        $scope.transactionCriteria = {};
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

        $scope.minError =false;
        $scope.maxError =false;

    	$rootScope.exportStatusObj  ={};

    	$scope.refreshPage = function() {
    		 $scope.clearFilter();
             $scope.search();
    	}


        $scope.clearFilter = function() {
            $('input#searchCreatedDate').data('DateTimePicker').clear();
            $scope.selectedManufacturer = null;
            $scope.searchItemCode = null;
            $scope.searchCriteria = {};
            $scope.selectedSite = null;
            $scope.selectedStatus = null;
            $scope.searchItemName = null;
            $scope.searchItemGroup = null;
            $scope.searchCreatedDate = null;
            $scope.searchCreatedDateSer = null;
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
    		if($scope.client) {
    			ProjectComponent.findSites($scope.client.id).then(function (data) {
                    $scope.searchSite = null;
                    $scope.sites = data;
                });
    		}
        }

    	$scope.loadSites = function () {
            $scope.sites = "";
            SiteComponent.findAll().then(function (data) {
                $scope.selectedSite = null;
                $scope.sites = data;
            });
        }

    	$scope.loadManufacturer = function () {
            $scope.manufacturers = "";
            ManufacturerComponent.findAll().then(function (data) {
                //console.log("Loading all Manufacturer -- " , data);
                $scope.manufacturers = data;
            });
        }

    	$scope.loadSearchSites = function() {
    		if($scope.searchProject) {
                $scope.sites = "";
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

    	$scope.cancelInventory = function(){
            $location.path('/inventory-list');
    	}

    	 $('input#searchCreatedDate').on('dp.change', function(e){
             $scope.searchCreatedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
             $scope.searchCreatedDateSer = e.date._d;
    	 });



    	/* Add item group */

        $scope.addMaterialItemGroup = function () {
            //console.log($scope.materialItemGroup);
            $("#addItemGroup").modal('hide');
            if($scope.materialItemGroup){
                $scope.loadingStart();
                //console.log("MaterialItmGroup Group entered");
                InventoryComponent.createItemGroup($scope.materialItemGroup).then(function (response) {
                    //console.log(response);
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
                //console.log("Item Group not entered");
            }
        }

        $scope.loadMaterialItmGroup = function () {
            $scope.materialItmGroups = "";
        	InventoryComponent.loadItemGroup().then(function (data) {
                $scope.materialItmGroups = data;
            });
        }

        $scope.loadMaterials = function() {
        	$scope.refreshPage();
        	$scope.search();
        	$location.path('/inventory-list');
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
                $scope.cancelInventory();
            }
            else if(text == 'save')
            {
                $scope.saveInventory();
            }
            else if(text == 'update')
            {
                /** @reatin - retaining scope value.**/
                $rootScope.retain=1;
                $scope.updateInventory();
            }
        };

        //

        /* Save material */
    	$scope.saveInventory = function() {
            $scope.saveLoad = true;
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

    		InventoryComponent.create($scope.inventory).then(function(response) {
    			console.log(response.data);
                $scope.loadingStop();
                $scope.inventory = "";
                if(response.data.errorStatus && response.data.status != null) {
                    $scope.showNotifications('top','center','danger', response.data.errorMessage);
                } else {
                    $scope.showNotifications('top','center','success','Material has been added Successfully!!');
                    $location.path('/inventory-list');
                }
                $scope.saveLoad = false;
    		}).catch(function (response) {
                $scope.loadingStop();
                $scope.btnDisabled= false;
                $scope.success = null;
                $scope.saveLoad = false;
                console.log('Error - '+ response.data);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                        $scope.errorAssetsExists = 'ERROR';
                    $scope.showNotifications('top','center','danger','Material Already Exists');
                } else {
                    $scope.showNotifications('top','center','danger','Unable to creating Material. Please try again later..');
                    $scope.error = 'ERROR';
                }
            });


    	}

    	$scope.viewInventory = function() {
            if(parseInt($stateParams.id) > 0) {
                $rootScope.loadingStart();
                $scope.inventoryViews = "";
                InventoryComponent.findById($stateParams.id).then(function (data) {
                    $rootScope.loadingStop();
                    console.log(data);
                    $scope.inventoryViews = data;
                    $scope.inventoryViews.title = data.name;
                }).catch(function () {
                    $scope.showNotifications('top','center','danger','Unable to load Material');
                    $location.path('/inventory-list');
                    $rootScope.loadingStop();
                })
            }else{
                $location.path('/inventory-list');
            }
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

        	}).catch(function () {
                $rootScope.loadingStop();
            })
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
                $rootScope.retain=1;
                $scope.search();
        	}).catch(function () {
                $scope.showNotifications('top','center','danger','Unable to delete material!!');
                $rootScope.retain=1;
                $scope.search();
            })
        }
        /* end delete material */

    	$scope.editInventoryFunc = function() {
            if(parseInt($stateParams.id) > 0){
                $rootScope.loadingStart();
                InventoryComponent.findById($stateParams.id).then(function(data) {
                        console.log('inventory details',data);
                        $scope.editInventory = data;
                        $scope.editInventory.id = data.id;
                        $scope.editInventory.name = data.name;
                        $scope.editInventory.title = data.name;
                        $scope.editInventory.itemCode = data.itemCode;
                        $scope.selectedSite = {id: data.siteId, name: data.siteName};
                        $scope.client = {id: data.projectId, name: data.projectName};
                        $scope.loadSelectedSite($scope.selectedSite.id);
                        $scope.selectedItemGroup = {id: data.itemGroupId, itemGroup: data.itemGroup};
                        $scope.selectedManufacturer = {id: data.manufacturerId, name: data.manufacturerName};
                        $scope.editInventory.minimumStock = data.minimumStock;
                        $scope.editInventory.maximumStock = data.maximumStock;
                        $scope.editInventory.storeStock = data.storeStock;
                        //$scope.selectedUnit = {materialUOM: data.uom };
                    if(data.uom){
                        for(var i in $scope.materialUOMs){
                            var unit = data.uom;
                            if($scope.materialUOMs[i] === unit.toUpperCase()){
                                $scope.selectedUnit = $scope.materialUOMs[i];
                            }
                        }
                        $rootScope.loadingStop();
                    }
                }).catch(function () {
                    $scope.showNotifications('top','center','danger','Unable to load material details');
                    $location.path('/inventory-list');
                    $rootScope.loadingStop();
                })
            }else{
                $location.path('/inventory-list');
            }

    	}

        $scope.loadSelectedSite = function(siteId) {
            SiteComponent.findOne(siteId).then(function (data) {
                $scope.selectedSite = data;
            });

        };

    	/* Update Material */
    	$scope.updateInventory = function () {
            $scope.saveLoad = true;
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
                 $scope.saveLoad = false;
                if(response.status === 400) {
                	 $scope.showNotifications('top','center','danger','Unable to update Material');
                     $scope.error = 'ERROR';
                }else{
                	$scope.showNotifications('top','center','success','Material updated Successfully');
                    $location.path('/inventory-list');
                }

            }).catch(function (response) {
                $rootScope.loadingStop();
                 $scope.saveLoad = false;
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
            $('.AdvancedFilterModal.in').modal('hide');
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
               $scope.search();

           }

           $scope.columnDescOrder = function(field){
               $scope.selectedColumn = field;
               $scope.isActiveDesc = field;
               $scope.isActiveAsc = '';
               $scope.isAscOrder = false;
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


            if(!$scope.selectedManufacturer && !$scope.searchItemCode && !$scope.searchItemName && !$scope.searchItemGroup && !$scope.searchCreatedDate && !$scope.searchProject && !$scope.searchSite ) {
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
        	if($scope.selectedManufacturer) {
        		$scope.searchCriteria.manufacturerId = $scope.selectedManufacturer.id;
        		$scope.searchCriteria.manufacturerName = $scope.selectedManufacturer.name;
        	}else{
                $scope.searchCriteria.manufacturerId = null;
                $scope.searchCriteria.manufacturerName = null;
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
            if($scope.searchItemGroup) {
            	$scope.searchCriteria.itemGroup = $scope.searchItemGroup;
            }else{
                $scope.searchCriteria.itemGroup = "";
            }

            if($scope.searchCreatedDate){
            $scope.searchCriteria.materialCreatedDate = $scope.searchCreatedDateSer;

           }else{
            $scope.searchCriteria.materialCreatedDate = null;
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

            $scope.inventorylists = '';
            $scope.inventorylistLoader = false;
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
                    if($scope.localStorage.manufacturerId){
                        $scope.selectedManufacturer = {id:$scope.localStorage.manufacturerId};
                    }else{
                        $scope.selectedManufacturer = null;
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

                    if($scope.localStorage.materialCreatedDate){
                        $scope.searchCreatedDate = $filter('date')($scope.localStorage.materialCreatedDate, 'dd/MM/yyyy');
                        $scope.searchCreatedDateSer = new Date($scope.localStorage.materialCreatedDate);
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

        	InventoryComponent.search($scope.searchCriteras).then(function (data) {
                $scope.inventorylists = data.transactions;
                $scope.loadingStop();
                $scope.inventorylistLoader = true;

                /** retaining list search value.**/
                getLocalStorage.updateSearch($scope.searchCriteras);

                /*
                 ** Call pagination  main function **
             */
	             $scope.pager = {};
	             $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
	             $scope.totalCountPages = data.totalCount;

	             console.log("Pagination",$scope.pager);
	             console.log("Inventory List - ", data);

	             $scope.pages.currPage = data.currPage;
	             $scope.pages.totalPages = data.totalPages == 0 ? 1:data.totalPages;
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

            }).catch(function(){
                $scope.noData = true;
                $scope.inventorylistLoader = true;
                $scope.showNotifications('top','center','danger','Unable to load inventory list..');
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

			$scope.initList = function() {
				//$scope.loadMaterials();
                $scope.loadPageTop();
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
                    $scope.downloaded = false;
                    $scope.searchCriteria.isReport = true;
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
                      }).catch(function(){
                        $scope.downloader=false;
                        $scope.stop();
                        $scope.showNotifications('top','center','danger','Unable to export file..');
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

                        }).catch(function(){
                            $scope.downloader=false;
                            $scope.stop();
                            $scope.showNotifications('top','center','danger','Unable to export file..');
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


        $scope.checkMinMax = function(){

            if($scope.inventory.minimumStock != null && $scope.inventory.maximumStock != null){

                if($scope.inventory.minimumStock >= $scope.inventory.maximumStock){

                    $scope.minError =true;
                    $scope.maxError =true;

                }else{
                    $scope.minError =false;
                    $scope.maxError =false;
                }

            }else{
                $scope.minError =false;
                $scope.maxError =false;
            }
        }

        $scope.checkMinMaxEdit = function(){

            if($scope.editInventory.minimumStock != null && $scope.editInventory.maximumStock != null){

                if($scope.editInventory.minimumStock >= $scope.editInventory.maximumStock){

                    $scope.minError =true;
                    $scope.maxError =true;

                }else{
                    $scope.minError =false;
                    $scope.maxError =false;
                }

            }else{
                $scope.minError =false;
                $scope.maxError =false;
            }
        }


    });
