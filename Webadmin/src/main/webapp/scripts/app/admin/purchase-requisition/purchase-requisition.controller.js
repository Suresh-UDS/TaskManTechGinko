'use strict';

angular.module('timeSheetApp')
    .controller('PurchaseRequisitionController', function ($rootScope, $scope, $state, $timeout, $filter,
    		ProjectComponent, SiteComponent,EmployeeComponent,InventoryComponent, PurchaseComponent, $http,$stateParams,$location, PaginationComponent, getLocalStorage,$interval) {

    	$scope.selectedProject = null;

    	$scope.selectedSite = null;

    	$rootScope.loginView = false;

    	$scope.pages = { currPage : 1};

    	$scope.pager = {};

    	$scope.pageSort = 10;

        $scope.searchRequestStatus = null;
        $scope.searchReferenceNumber = null;
        $scope.searchRequestedDate = null;
        $scope.searchApprovedDate = null;
        $scope.searchRequestedDateSer = null;
        $scope.searchApprovedDateSer = null;

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

        $scope.noData = false;

        $scope.isEdit = false;

        $scope.purchaseObject = {};

        $scope.purchaseReqObj = {};

        $rootScope.exportStatusObj  ={};

        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();
        }

        $scope.initCalender();

			//init load
			$scope.initLoad = function(){
			    $scope.loadPageTop();
			    $scope.setPage(1);
				$scope.loadProjects();
			    $scope.loadUOM();

			 }

            $scope.initList = function() {
                //$scope.loadPurchaseRequisition();
                $scope.loadPageTop();
                $scope.setPage(1);
            }

            $scope.loadPurchaseRequisition = function() {
                $scope.refreshPage();
                $scope.search();
                $location.path('/purchase-requisition-list');
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


        $scope.conform = function(text,val=null,type=null)
        {

            $rootScope.conformText = text;
            $scope.pId = val;
            $scope.type= type;
            $('#conformationModal').modal();

        }
        $rootScope.back = function (text) {

            if(text == 'cancel' || text == 'back'){
                /** @retain - retaining scope value.**/
                $rootScope.retain=1;
                 $scope.cancelPurchase();
            }else if(text == 'save'){
                /** @retain - retaining scope value.**/
                $rootScope.retain=1;
                $scope.savePurchase()
            }else if(text == 'APPROVED' && $scope.type){
                /** @retain - retaining scope value.**/
                $rootScope.retain=1;
                $scope.updatePurchaseReq('APPROVED');
            }else if(text == 'REJECTED' && $scope.type){
                /** @retain - retaining scope value.**/
                $rootScope.retain=1;
                $scope.updatePurchaseReq('REJECTED');
            }else if(text == 'update'){
                /** @retain - retaining scope value.**/
                $rootScope.retain=1;
                $scope.updatePurchaseReq();
            }else if(text == 'Approved'){
                /** @retain - retaining scope value.**/
                $rootScope.retain=1;
                submitPurchaseReq($scope.pId,'Approved');
            }else if(text == 'Rejected'){
                /** @retain - retaining scope value.**/
                $rootScope.retain=1;
                submitPurchaseReq($scope.pId,'Rejected');
            }
            $rootScope.conformText = "";
            $scope.pId = null;
            $scope.type= null;
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
                    $scope.selectedEmployee = null;
                    $scope.employees = [];
                    $scope.purchases  = [];
                    $scope.purchaseItems = [];
                    $scope.selectedItemCode = null;
                    $scope.selectedQuantity = "";
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
                    $scope.searchLoadPurchases = {};
                    $scope.selectedItemCode = '';
                    $scope.selectedItemName ='';
                    if($scope.selectedSite && $scope.selectedProject) {
                        $scope.searchLoadPurchases.projectId = $scope.selectedProject.id;
                        $scope.searchLoadPurchases.siteId = $scope.selectedSite.id;
                        InventoryComponent.search($scope.searchLoadPurchases).then(function(data) {
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
                    if($scope.selectedItemCode){
                        console.log($scope.selectedItemCode);
                        $scope.selectedItemName = $scope.selectedItemCode.name;
                        $scope.selectedStoreStock = $scope.selectedItemCode.storeStock;
                        $scope.selectedQuantity = "";
                    }
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
                    $scope.downloaded = false;
                    $scope.searchCriteria.isReport = true;
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


                $scope.isActiveAsc = 'purchaseRefNumber';
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

                $scope.searchFilter = function () {
                    $('.AdvancedFilterModal.in').modal('hide');
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


                    if(!$scope.searchReferenceNumber && !$scope.searchRequestedDate && !$scope.searchApprovedDate && !$scope.searchRequestStatus  && !$scope.searchProject && !$scope.searchSite ) {
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
                    if($scope.searchRequestStatus) {
                        $scope.searchCriteria.requestStatus = $scope.searchRequestStatus;
                    }else{
                        $scope.searchCriteria.requestStatus = null;
                    }
                    if($scope.searchReferenceNumber) {
                        $scope.searchCriteria.purchaseRefNumber = $scope.searchReferenceNumber;
                    }else{
                        $scope.searchCriteria.purchaseRefNumber = null;
                    }

                    if($scope.searchRequestedDateSer){
                        $scope.searchCriteria.requestedDate = $scope.searchRequestedDateSer;

                    }else{
                        $scope.searchCriteria.requestedDate = null;
                    }

                    if($scope.searchApprovedDateSer){
                        $scope.searchCriteria.approvedDate = $scope.searchApprovedDateSer;

                    }else{
                        $scope.searchCriteria.approvedDate = null;
                    }

                    if($scope.pageSort){
                        $scope.searchCriteria.sort = $scope.pageSort;
                    }

                    if($scope.selectedColumn){

                        $scope.searchCriteria.columnName = $scope.selectedColumn;
                        $scope.searchCriteria.sortByAsc = $scope.isAscOrder;

                    }else{
                        $scope.searchCriteria.columnName = 'purchaseRefNumber';
                        $scope.searchCriteria.sortByAsc = true;
                    }

                    $scope.purchaseReq = '';
                    $scope.purchaseReqLoader = false;
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
                            if($scope.localStorage.requestStatus){
                                $scope.searchRequestStatus = $scope.localStorage.requestStatus;
                            }else{
                                $scope.searchRequestStatus = null;
                            }

                            if($scope.localStorage.purchaseRefNumber){
                                $scope.searchReferenceNumber  = $scope.localStorage.purchaseRefNumber;
                            }else{
                                $scope.searchReferenceNumber  = null;
                            }
                            if($scope.localStorage.requestedDate){
                                $scope.searchRequestedDate = $filter('date')($scope.localStorage.requestedDate, 'dd/MM/yyyy');
                                $scope.searchRequestedDateSer = new Date($scope.localStorage.requestedDate);
                            }else{
                                $scope.searchRequestedDate = null;
                                $scope.searchRequestedDateSer = null;
                            }
                            if($scope.localStorage.approvedDate){
                                $scope.searchApprovedDate = $filter('date')($scope.localStorage.approvedDate, 'dd/MM/yyyy');
                                $scope.searchApprovedDateSer = new Date($scope.localStorage.approvedDate);
                            }else{
                                $scope.searchApprovedDate = null;
                                $scope.searchApprovedDateSer = null;
                            }



                        }

                        $rootScope.retain = 0;

                        $scope.searchCriteras  = $scope.localStorage;
                    }else{

                        $scope.searchCriteras  = $scope.searchCriteria;
                    }

                    /* Localstorage (Retain old values while edit page to list) end */

                    PurchaseComponent.search($scope.searchCriteras).then(function (data) {
                    $scope.purchaseReq = data.transactions;
                    $scope.purchaseReqLoader = true;


                     /** retaining list search value.**/
                    getLocalStorage.updateSearch($scope.searchCriteras);


                     /*
                        ** Call pagination  main function **
                    */
                     $scope.pager = {};
                     $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                     $scope.totalCountPages = data.totalCount;

                     console.log("Pagination",$scope.pager);
                     console.log($scope.purchaseReq);

                    $scope.pages.currPage = data.currPage;
                    $scope.pages.totalPages = data.totalPages == 0 ? 1:data.totalPages;

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
                    $scope.sites = [];
                    $scope.selectedSite = null;
                    $scope.selectedEmployee = null;
                    $scope.employees = [];
                    $scope.purchases  = [];
                    $scope.purchaseItems = [];
                    $scope.selectedItemCode = null;
                    $scope.selectedQuantity = "";
                	if($scope.selectedProject) {
                    	ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
                            $scope.sites = data;
                            $scope.siteSpin = false;
                        });
                	}else {
                         $scope.siteSpin = false;
                    	/*SiteComponent.findAll().then(function (data) {
                            $scope.sites = data;
                        });*/
                	}
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
                        if($scope.selectedProject) {
                            ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
                                $scope.sites = data;
                                $scope.siteSpin = false;
                            });
                        }else {
                            $scope.siteSpin = false;
                        }
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
                        $scope.loadPurchases();
                        $scope.selectedEmployee = {id: $scope.purchaseReqObj.requestedById }
                        $scope.purchaseItems = $scope.purchaseReqObj.items;
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

                    $scope.updateMaterial.materialId = $scope.selectedItemCode.id;
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
                console.log('purchase items',$scope.purchaseItems);
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
                     $scope.loadingStart();
                    if(status == 'APPROVED' && !$scope.isValid) {
                        $scope.showNotifications('top','center','danger','Invalid Approved Quantity');
                        $scope.loadingStop();
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
                    if($scope.purchaseItems) {
                        $scope.purchaseReqObj.items = $scope.purchaseItems;
                    }

                    if(status){
                        $scope.purchaseReqObj.requestStatus = status;
                    }else{

                        $scope.purchaseReqObj.requestStatus = $scope.purchaseReqObj.status;
                    }

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
                  $scope.selectedItemName = null;
                  $scope.selectedItemCode = null;
                  $scope.selectedQuantity = null;
                  $scope.selectedStoreStock = null;
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

            $scope.chkEmp = function(){
                if(!$scope.selectedSite){
                    alert('Please select site before select employee...!!!');
                    return false;
                }
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
                $scope.searchRequestedDateSer = null;
                $scope.searchApprovedDateSer = null;
                $scope.searchRequestStatus = null;
                $scope.searchReferenceNumber = null;
                $scope.localStorage = null;
                $rootScope.searchCriteriaSite = null;
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

            $scope.deleteConfirm = function (purchase){
                $scope.deletePurchaseId= purchase;
            }



            $scope.deletePurchase = function () {
                $('.delete-confirmation').modal('hide');
                    PurchaseComponent.remove($scope.deletePurchaseId).then(function(){
                        $scope.success = 'OK';
                        $scope.showNotifications('top','center','success','Purchase requisition has been deleted successfully!!');
                        $rootScope.retain=1;
                        $scope.searchFilter();
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

            $scope.downloaded = false;

            $scope.clsDownload = function(){
                $scope.downloaded = true;
                $rootScope.exportStatusObj = {};
                $scope.exportStatusMap = [];
            }


            $('input#dateFilterRequestedDate').on('dp.change', function(e){
                $scope.searchRequestedDateSer = e.date._d;
                $scope.searchRequestedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
            });


            $('input#dateFilterApprovedDate').on('dp.change', function(e){
                $scope.searchApprovedDateSer = e.date._d;
                $scope.searchApprovedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
            });


        //Search Filter Site Load Function

        $scope.projectFilterFunction = function (searchProject){
            if(searchProject){
                $scope.siteSpin = true;
                $scope.sitesList = "";
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
            }


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
