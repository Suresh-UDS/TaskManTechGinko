'use strict';

angular.module('timeSheetApp')
    .controller('PurchaseRequisitionController', function ($rootScope, $scope, $state, $timeout, $filter,
    		ProjectComponent, SiteComponent,EmployeeComponent,InventoryComponent, PurchaseComponent, $http,$stateParams,$location, PaginationComponent, getLocalStorage,$interval) {

    	$scope.selectedProject = {};

    	$scope.selectedSite = {};

    	$rootScope.loginView = false;

    	$scope.pages = { currPage : 1};

    	$scope.pager = {};

    	$scope.pageSort = 10;

        $scope.noData = false;

        $scope.isEdit = false;

        $scope.purchaseObject = {};

        $scope.purchaseReqObj = {};

        $rootScope.exportStatusObj  ={};

			//init load
			$scope.initLoad = function(){
			    $scope.loadPageTop();
			    $scope.setPage(1);
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


        $scope.conform = function(text)
        {
            $rootScope.conformText = text;
            $('#conformationModal').modal();

        }
        $rootScope.back = function (text) {
            if(text == 'cancel' || text == 'back'){
                /** @reatin - retaining scope value.**/
                $rootScope.retain=1;
                // $scope.cancelEmployee();
            }else if(text == 'save'){
                $scope.savePurchase()
            }else if(text == 'update'){
                /** @reatin - retaining scope value.**/
                $rootScope.retain=1;
                $scope.updatePurchaseReq();
            }
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

                //Employees
                $scope.empSpin = false;
                $scope.loadEmployees = function () {
                    $scope.employees ='';

                    if($scope.selectedSite && $scope.selectedSite.id){
                        $scope.empSpin = true;
                       var empParam = {siteId: $scope.selectedSite.id, list: true};
                       EmployeeComponent.search(empParam).then(function (data) {
                           console.log(data);
                           $scope.empSpin = false;
                           $scope.employees = data.transactions;
                           $scope.employees = $scope.employees === null ? [] : $scope.employees;
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
                            console.log('Item details >>> ' , data);
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

                $scope.loadStatus = function() {
                	PurchaseComponent.getAllStatus().then(function(data) {
                		console.log(data);
                		$scope.requestStatuses = data;
                	});
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
                            $scope.purchase.unitPrice = $scope.selectedItemCode.unitPrice;
                            $scope.purchaseItems.push($scope.purchase);
                            $scope.selectedQuantity = null;
                            $scope.selectedItemCode = {};
                        }
                }

                $scope.exportAllData = function(type){
                    $rootScope.exportStatusObj.exportMsg = '';
                    $scope.downloader=true;
                    $scope.searchCriteria.exportType = type;
                    $scope.searchCriteria.report = true;

                    console.log('calling asset export api');
                    PurchaseComponent.exportAllData($scope.searchCriteria).then(function(data){
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

                if($scope.selectedRequestStatus) {
                	$scope.searchCriteria.requestStatus = $scope.selectedRequestStatus;
                }

                if($scope.selectedReferenceNumber) {
                	$scope.searchCriteria.purchaseRefNumber = $scope.selectedReferenceNumber;
                }

                if($scope.searchRequestedDate) {
                	$scope.searchCriteria.requestedDate = $scope.searchRequestedDate;
                }

                if($scope.searchApprovedDate) {
                	$scope.searchCriteria.approvedDate = $scope.searchApprovedDate;
                }

                if($scope.selectedColumn){

                    $scope.searchCriteria.columnName = $scope.selectedColumn;
                    $scope.searchCriteria.sortByAsc = $scope.isAscOrder;

                }else{
                    $scope.searchCriteria.columnName ="id";
                    $scope.searchCriteria.sortByAsc = true;
                }

                console.log("search criteria",$scope.searchCriteria);
                    $scope.purchaseReq = '';
                    $scope.purchaseReqLoader = false;
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

                $scope.loadAllEmployee = function() {
                	EmployeeComponent.findAll().then(function (data) {
                        $scope.employees = data;
                    });
                }
                //sites
                $scope.siteSpin = false;
                $scope.loadSites = function () {
                    $scope.siteSpin = true;
                	console.log("selected project - " + JSON.stringify($scope.selectedProject));
                	$scope.sites = {};
                	if($scope.selectedProject) {
                    	ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
                            $scope.sites = data;
                            $scope.siteSpin = false;
                        });
                	}/*else {
                    	SiteComponent.findAll().then(function (data) {
                            $scope.sites = data;
                        });
                	}*/
                };

                $scope.viewPurchaseReq = function() {
                $scope.loadingStart();
                if(parseInt($stateParams.id) > 0){
                    PurchaseComponent.findById($stateParams.id).then(function(data) {
                        console.log(data);
                        $scope.loadingStop();
                        $scope.purchaseReqObj = data;
                        console.log('Purchase Requisition by id',$scope.purchaseReqObj);
                        if(!$scope.purchaseReqObj){
                           $location.path('/purchase-requisition-list');
                        }
                    });
                }else{
                    $location.path('/purchase-requisition-list');
                }

                }

                $scope.editPurchaseReq = function() {
                $scope.loadingStart();
                if(parseInt($stateParams.id) > 0){
                    PurchaseComponent.findById($stateParams.id).then(function(data) {
                        console.log(data);
                        $scope.purchaseReqObj = data;
                        if(!$scope.purchaseReqObj){
                           $location.path('/purchase-requisition-list');
                        }
                        $scope.selectedRefNumber = $scope.purchaseReqObj.indentRefNumber;
                        $scope.selectedProject = {id: $scope.purchaseReqObj.projectId };
                        $scope.selectedSite = {id: $scope.purchaseReqObj.siteId };
                        $scope.loadSites();
                        $scope.loadEmployees();
                        $scope.loadPurchases();
                        $scope.selectedEmployee = {id: $scope.purchaseReqObj.requestedById }
                        $scope.materialItems = $scope.purchaseReqObj.items;
                        $scope.loadingStop();

                    });
                    }else{
                        $location.path('/purchase-requisition-list');
                    }
                }

                $scope.validate = function(material, issuedQty) {
                console.log(material);
                console.log(issuedQty);
                if(material.quantity > issuedQty){
                    console.log("save issued indent");
                    material.issuedQuantity = issuedQty;
                    if($scope.materialIndentObj) {
                        if($scope.materialIndentObj.items.length > 0) {
                            for(var i in $scope.materialIndentObj.items){

                                if($scope.materialIndentObj.items[i].id === material.id) {
                                    $scope.materialIndentObj.items.splice(i, 1);
                                    $scope.materialIndentObj.items.push(material);
                                }
                            }
                            console.log($scope.materialIndentObj);
                        }
                    }
                }else{
                    $scope.showNotifications('top','center','danger','Quantity cannot exceeds a required quantity');
                }

            }

            $scope.saveIndentTrans = function() {
                console.log("save indent transaction called");
                console.log($scope.materialIndentObj);
                IndentComponent.createTransaction($scope.materialIndentObj).then(function(data) {
                    console.log(data);
                    $scope.showNotifications('top','center','success','Material Transaction has been added successfully.');
                    $location.path('/inventory-transaction-list');
                }).catch(function(data){
                    $scope.success = null;
                    $scope.loadingStop();
                    $scope.showNotifications('top','center','danger','Unable to view Material Transaction.');
                });

            }

            $scope.showUpdateBtn = false;

            $scope.editMaterial = function(index, item) {
                console.log(item);
                console.log(index);
                $scope.updateMaterial = item;
                $scope.indexOf = index;
                $scope.isEdit = true;
                // $scope.selectedItemCode = $scope.updateMaterial.materialName;
                $scope.selectedItemCode = {id: $scope.updateMaterial.materialId,name:$scope.updateMaterial.materialName};
                $scope.selectedQuantity = $scope.updateMaterial.quantity;
                $scope.selectedItemCode.uom = $scope.updateMaterial.materialUom;
            }

            $scope.updatePurchaseItems = function(){

                    $scope.updateMaterial.materialId = $scope.selectedItemCode.materialId;
                    $scope.updateMaterial.materialName = $scope.selectedItemCode.name;
                    $scope.updateMaterial.materialUom = $scope.selectedItemCode.uom;
                    $scope.updateMaterial.quantity = $scope.selectedQuantity;
                    // $scope.updateMaterial.approvedQty = $scope.items.approvedQty;
                    console.log($scope.indexOf);
                    console.log($scope.updateMaterial);
                    updateItems($scope.indexOf, $scope.updateMaterial);

            }

            $scope.selectedRow = null;

            function updateItems(index, object) {
                $scope.isEdit = false;
                $scope.purchaseItems[index] = object;
                $scope.selectedRow = index;
                $scope.selectedQuantity = null;
                $scope.selectedItemCode = {};
                $timeout(function(){
                    $scope.selectedRow = null;
                },1000);

            }
            $scope.isValid = false;
            $scope.validateNumber = function(item, currentAprQty) {
//            	alert('validate');
            	var apprQty = item.approvedQty ? item.approvedQty : 0; 
            	if(currentAprQty > 0 && (item.quantity > currentAprQty || (item.quantity - apprQty) >= currentAprQty)) {
            		console.log(currentAprQty);
            		$scope.isValid = true;
            	}else{
            		$scope.showNotifications('top','center','danger','Invalid Approved Quantity');
            	}
            }

                $scope.updatePurchaseReq = function(status) {
                		if(status == 'APPROVED' && !$scope.isValid) {
                			$scope.showNotifications('top','center','danger','Invalid Approved Quantity');
                			return;
                		}
                    $scope.saveLoad = true;
                		console.log(status);
                    if($scope.selectedProject) {
                        $scope.purchaseReqObj.projectId = $scope.selectedProject.id;
                    }
                    if($scope.selectedSite) {
                        $scope.purchaseReqObj.siteId = $scope.selectedSite.id;
                    }
                    if($scope.selectedEmployee) {
                        $scope.purchaseReqObj.requestedById = $scope.selectedEmployee.id;
                    }
                    if($scope.materialItems) {
                        $scope.purchaseReqObj.items = $scope.materialItems;
                    }

                    	$scope.purchaseReqObj.requestStatus = status;

                    console.log('update purchase by id >>>',$scope.purchaseReqObj);
                    PurchaseComponent.update($scope.purchaseReqObj).then(function(resp){
                        console.log(resp);
                        $scope.saveLoad = false;
                        $scope.loadingStop();
                        $scope.showNotifications('top','center','success','Purchase Requisition has been update successfully.');
                        $location.path('/purchase-requisition-list');
                    }).catch(function(resp){
                        console.log(resp);
                        $scope.saveLoad = false;
                        $scope.success = null;
                        $scope.loadingStop();
                        $scope.showNotifications('top','center','danger','Unable to update Purchase Requisition. Please try again later..');
                    });
                }


                $scope.savePurchase = function() {
                    $scope.saveLoad = true;
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
                        $scope.saveLoad = false;
                            $scope.showNotifications('top','center','success','Purchase Requisition has been added successfully.');
                            $location.path('/purchase-requisition-list');

                    }).catch(function(response){
                        console.log(response);
                        $scope.saveLoad = false;
                        $scope.success = null;
                        $scope.loadingStop();
                        $scope.showNotifications('top','center','danger','Unable to create Purchase Requisition. Please try again later..');
                    });

                }
                $scope.clearPurchaseItems =function(){
                  $scope.selectedItemName = '';
                  $scope.selectedItemCode = '';
                  $scope.selectedQuantity = '';
                   $scope.isEdit=false;
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
                        if(item.materialId === id){
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

            $scope.loadPurchaseReq = function () {
                    $scope.clearFilter();
                    $scope.search();
            };

            $scope.refreshPage = function(){
                   $scope.loadPurchaseReq();
            }
            $scope.clearFilter = function() {
                $scope.selectedSite = null;
                $scope.selectedProject = null;
                $scope.searchProject = null;
                $scope.searchSite = null;
                $scope.searchCriteria = {};
                $scope.searchRequestedDate = null;
                $scope.searchApprovedDate = null;
                $scope.selectedRequestStatus = null;
                $scope.localStorage = null;
                $rootScope.searchCriteriaSite = null;
                $scope.pages = {
                    currPage: 1,
                    totalPages: 0
                }
                //$scope.search();
            };

            $scope.deleteConfirm = function (purchase){
                $scope.deletePurchaseId= purchase;
            }



            $scope.deletePurchase = function () {
                    PurchaseComponent.remove($scope.deletePurchaseId).then(function(){
                        $scope.success = 'OK';
                        $scope.showNotifications('top','center','success','Purchase requisition has been deleted successfully!!');
                        $scope.loadPurchaseReq();
                    });
            }

            $scope.exportStatusMap = [];


            $scope.exportStatus = function() {
                //console.log('empId='+$scope.empId);
                console.log('exportStatusMap length -'+$scope.exportStatusMap.length);
                angular.forEach($scope.exportStatusMap, function(exportStatusObj, index){
                    if(!exportStatusObj.empId) {
                        exportStatusObj.empId = 0;
                    }
                    PurchaseComponent.exportStatus(exportStatusObj.fileName).then(function(data) {
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

            $('#dateFilterRequestedDate').datetimepicker().on('dp.show', function (e) {
                return $(this).data('DateTimePicker');
            });

            $('input#dateFilterRequestedDate').on('dp.change', function(e){
                $scope.searchRequestedDate = e.date._d;
                $scope.requestedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
            });

            $('#dateFilterApprovedDate').datetimepicker().on('dp.show', function (e) {
                return $(this).data('DateTimePicker');
            });

            $('input#dateFilterApprovedDate').on('dp.change', function(e){
                $scope.searchApprovedDate = e.date._d;
                $scope.approvedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
            });










    });
