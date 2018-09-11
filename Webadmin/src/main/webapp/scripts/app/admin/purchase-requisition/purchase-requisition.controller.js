'use strict';

angular.module('timeSheetApp')
    .controller('PurchaseRequisitionController', function ($rootScope, $scope, $state, $timeout,
    		ProjectComponent, SiteComponent,EmployeeComponent,InventoryComponent, PurchaseComponent, $http,$stateParams,$location, PaginationComponent) {

    	$scope.selectedProject = {};

    	$scope.selectedSite = {};

    	$rootScope.loginView = false;

    	$scope.pages = { currPage : 1};

    	$scope.pager = {};

        $scope.noData = false;

        $scope.isEdit = false;

        $scope.selectedUop = 1;

        $scope.purchaseObject = {};

			//init load
			$scope.initLoad = function(){
			    $scope.loadPageTop();
				$scope.loadProjects();
			    $scope.loadUOM();

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

                };

                $scope.loadProjectsList = function () {
                    ProjectComponent.findAll().then(function (data) {
                        $scope.projectsList = data;
                         $scope.loadingStop();
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

                // Load Clients for selectbox //
                $scope.clienteDisable = true;
                $scope.uiClient = [];
                $scope.getClient = function (search) {
                    var newSupes = $scope.uiClient.slice();
                    if (search && newSupes.indexOf(search) === -1) {
                        newSupes.unshift(search);
                    }

                    return newSupes;
                }

                $scope.selectProject = function(project)
                {
                    $scope.searchProject = $scope.projectsList[$scope.uiClient.indexOf(project)]
                    console.log('Project dropdown list:',$scope.searchProject)
                }
                //

                // Load Sites for selectbox //
                $scope.siteDisable = true;
                $scope.uiSite = [];

                $scope.getSite = function (search) {
                    var newSupes = $scope.uiSite.slice();
                    if (search && newSupes.indexOf(search) === -1) {
                        newSupes.unshift(search);
                    }

                    return newSupes;
                }

                $scope.selectSite = function(site)
                {
                    $scope.searchSite = $scope.sitesList[$scope.uiSite.indexOf(site)]
                    $scope.hideSite = true;
                    console.log('Site dropdown list:',$scope.searchSite)
                }
                $scope.addProject = function (selectedProject) {
                    $scope.selectedProject = $scope.projectsList[$scope.uiClient.indexOf(selectedProject)]
                    $scope.edit = false;
                }

                //Filter
                $scope.filter = false;
                $scope.clientFilterDisable = true;
                $scope.siteFilterDisable = true;
                $scope.siteSpin = false;
                $scope.loadDepSites = function (searchProject) {
                    $scope.searchSite = null;
                    $scope.hideSite = false;
                    if($scope.localStorage)
                    {
                        $scope.localStorage.siteName = null;
                    }
                    $scope.searchCriteria.siteName = null;
                    $scope.siteSpin = true;
                    $scope.filter = false;
                    $scope.searchProject = $scope.projectsList[$scope.uiClient.indexOf(searchProject)]
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
                        $scope.siteFilterDisable = false;
                        $scope.siteSpin = false;
                    });
                };

                //


                $scope.loadEmployees = function () {
                    $scope.employees ='';
                    if($scope.selectedSite && $scope.selectedSite.id){
                       var empParam = {siteId: $scope.selectedSite.id, list: true};
                       EmployeeComponent.search(empParam).then(function (data) {
                           console.log(data);
                           $scope.employees = data.transactions;
                       });
                    }
                }

                $scope.loadPurchases = function() {
                    $scope.search = {};
                    $scope.selectedItemCode = '';
                    $scope.selectedItemName ='';
                    if($scope.selectedSite && $scope.selectedProject) {
                        $scope.search.projectId = $scope.selectedProject.id;
                        $scope.search.siteId = $scope.selectedSite.id;
                        InventoryComponent.search($scope.search).then(function(data) {
                            console.log(data);
                            $scope.purchases = data.transactions;
                        });
                    }
                }

                $scope.loadUOM = function() {
                    InventoryComponent.getMaterialUOM().then(function(data){
                        console.log('units',data);
                        $scope.materialUOMs = data;
                    });
                }

                $scope.change = function() {
                    console.log($scope.selectedItemCode);
                    $scope.selectedItemName = $scope.selectedItemCode.name;
                    $scope.selectedQuantity = "";
                }

                $scope.addPurchaseItem = function() {
                    $scope.purchase = {};
                    $scope.purchaseItems = $scope.purchaseItems ? $scope.purchaseItems : [];
                        if(checkDuplicateInObject($scope.selectedItemCode.id, $scope.purchaseItems)) {
                            $scope.showNotifications('top','center','danger','Already exists same item in the list');
                        }else{
                            $scope.purchase.materialName = $scope.selectedItemCode.name;
                            $scope.purchase.materialId = $scope.selectedItemCode.id;
                            $scope.purchase.materialItemCode = $scope.selectedItemCode.itemCode;
                            $scope.purchase.materialStoreStock = $scope.selectedItemCode.storeStock;
                            $scope.purchase.materialUom = $scope.selectedItemCode.uom;
                            $scope.purchase.materialItemGroupId = $scope.selectedItemCode.itemGroupId;
                            $scope.purchase.quantity = $scope.selectedQuantity;
                            $scope.purchase.unitPrice = $scope.selectedUop;
                            $scope.purchaseItems.push($scope.purchase);
                            $scope.selectedItemCode='';
                            $scope.selectedQuantity='';
                            $scope.selectedUop='';
                        }
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
                console.log('Selected  project -' , JSON.stringify($scope.searchProject) + '' +$scope.searchSite);


                if(!$scope.searchSite && !$scope.searchProject) {
                    if($rootScope.searchCriteriaSite) {
                        $scope.searchCriteria = $rootScope.searchCriteriaSite;
                    }else {
                        $scope.searchCriteria.findAll = true;
                    }
                }else if(($scope.searchSite) || ($scope.searchProject)) {
                    $scope.searchCriteria.findAll = false;
                    if($scope.searchSite) {
                        $scope.searchCriteria.siteId = $scope.searchSite.id;
                        $scope.searchCriteria.siteName = $scope.searchSite.name;
                        if(!$scope.searchCriteria.siteId) {
                            $scope.searchCriteria.siteName = $scope.searchSite.name;
                        }else {
                            $scope.searchCriteria.siteName = $scope.searchSite.name;
                        }
                        console.log('selected site id ='+ $scope.searchCriteria.siteId);
                    }else {
                        $scope.searchCriteria.siteId = null;
                    }

                    if($scope.searchProject) {
                        $scope.searchCriteria.projectId = $scope.searchProject.id;
                        $scope.searchCriteria.projectName = $scope.searchProject.name;
                        if(!$scope.searchCriteria.projectId) {
                            $scope.searchCriteria.projectName = $scope.searchProject.name;
                            console.log('selected project name ='+ $scope.searchProject + ', ' +$scope.searchCriteria.projectName);
                        }
                        console.log('selected project id ='+ $scope.searchCriteria.projectId);
                    }else {
                        $scope.searchCriteria.projectId = null;
                    }

                }
                console.log($scope.searchCriteria);

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

                console.log("search criteria",$scope.searchCriteria);
                    $scope.sites = '';
                    $scope.sitesLoader = false;
                    $scope.loadPageTop();

                     /* Localstorage (Retain old values while edit page to list) start */

                     if($rootScope.retain == 1){
                        $scope.localStorage = getLocalStorage.getSearch();
                        console.log('Local storage---',$scope.localStorage);

                        if($scope.localStorage){
                                $scope.filter = true;
                                $scope.pages.currPage = $scope.localStorage.currPage;
                                if($scope.localStorage.projectId){
                                   $scope.searchProject = {id:$scope.localStorage.projectId,name:$scope.localStorage.projectName};
                                }else{
                                   $scope.searchProject = null;
                                }
                                if($scope.localStorage.siteId){
                                  $scope.searchSite = {id:$scope.localStorage.siteId,name:$scope.localStorage.siteName};
                                }else{
                                   $scope.searchSite = null;
                                }

                        }

                        $rootScope.retain = 0;

                        var searchCriterias  = $scope.localStorage;
                     }else{

                        var searchCriterias  = $scope.searchCriteria;
                     }

                     /* Localstorage (Retain old values while edit page to list) end */

                    PurchaseComponent.search(searchCriterias).then(function (data) {
                    $scope.purchaseReq = data.transactions;
                    $scope.purchaseReqLoader = true;


                     /** retaining list search value.**/
                    getLocalStorage.updateSearch(searchCriterias);


                     /*
                        ** Call pagination  main function **
                    */
                     $scope.pager = {};
                     $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                     $scope.totalCountPages = data.totalCount;

                     console.log("Pagination",$scope.pager);
                     console.log($scope.purchaseReq);

                    $scope.pages.currPage = data.currPage;
                    $scope.pages.totalPages = data.totalPages;

                    if($scope.purchaseReq && $scope.purchaseReq.length > 0 ){
                        $scope.showCurrPage = data.currPage;
                        $scope.pageEntries = $scope.purchaseReq.length;
                        $scope.totalCountPages = data.totalCount;
                        $scope.pageSort = 10;
                        $scope.noData = false;

                    }else{
                         $scope.noData = true;
                    }
                });

                };


                $scope.loadProjects = function() {
                	ProjectComponent.findAll().then(function (data) {
                		console.log("Clients List >>> " , $scope.projects);
                		$scope.projects = data;
                		console.log(data);
                		$scope.loadingStop();
                	});

                };

                $scope.loadSites = function () {
                	console.log("selected project - " + JSON.stringify($scope.selectedProject));
                	$scope.sites = {};
                	if($scope.selectedProject) {
                    	ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
                            $scope.sites = data;

                        });
                	}/*else {
                    	SiteComponent.findAll().then(function (data) {
                            $scope.sites = data;
                        });
                	}*/
                };


                $scope.savePurchase = function() {
                    if($scope.selectedProject) {
                        $scope.purchaseObject.projectId = $scope.selectedProject.id;
                    }else{
                       $scope.purchaseObject.projectId = null;
                    }
                    if($scope.selectedSite) {
                        $scope.purchaseObject.siteId = $scope.selectedSite.id;
                    }else{
                        $scope.purchaseObject.siteId = null;
                    }
                    if($scope.selectedEmployee) {
                        $scope.purchaseObject.requestedById = $scope.selectedEmployee.id;
                    }else{
                        $scope.purchaseObject.requestedById = null;
                    }
                    if($scope.purchaseItems) {
                        $scope.purchaseObject.items = $scope.purchaseItems;
                    }else{
                        $scope.purchaseObject.items = null;
                    }
                    $scope.purchaseObject.purchaseRefNumber = $scope.selectedRefNumber;
                    $scope.purchaseObject.requestedDate = new Date();
                    console.log($scope.purchaseObject);
                    $scope.loadingStart();
                    PurchaseComponent.create($scope.purchaseObject).then(function(response) {
                        console.log(response);
                        $scope.loadingStop();
                            $scope.showNotifications('top','center','success','Purchase Requisition has been added successfully.');
                            $location.path('/purchase-requisition-list');

                    }).catch(function(response){
                        console.log(response);
                        $scope.success = null;
                        $scope.loadingStop();
                        $scope.showNotifications('top','center','danger','Unable to create Purchase Requisition. Please try again later..');
                    });

                }

            $scope.cancelPurchase = function () {
                        $location.path('/purchase-requisition-list');
                    };


            $scope.setPage = function (page) {

                if (page < 1 || page > $scope.pager.totalPages) {
                    return;
                }
                //alert(page);
                $scope.pages.currPage = page;
                $scope.search();
            };

            function checkDuplicateInObject(id, array) {
                var isDuplicate = false;
                if(array != null){
                    array.map(function(item){
                        if(item.purchaseId === id){
                            return isDuplicate = true;
                        }
                    });
                }
                return isDuplicate;
            }

            $scope.showNotifications= function(position,alignment,color,msg){
               $rootScope.overlayShow();
               demo.showNotification(position,alignment,color,msg);
                $timeout(function() {
                  $rootScope.overlayHide() ;
                }, 5000);
            }

    });
