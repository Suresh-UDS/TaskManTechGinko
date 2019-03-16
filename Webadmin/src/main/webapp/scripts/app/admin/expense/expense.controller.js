'use strict';

angular.module('timeSheetApp')
    .controller('ExpenseController', function ($rootScope, $scope, $state, $timeout,
    		ProjectComponent, SiteComponent, ExpenseComponent, $http,$stateParams,$location, PaginationComponent,$filter,getLocalStorage) {


        $scope.selectedCategory = {};

        $scope.previousData = {};

        $scope.description = "";

        $scope.billable = true;

        $scope.reimbursable = true;

        $scope.selectedPaymentType = '';

        $scope.transactionMode = "";

        $scope.selectedDate = $filter('date')(new Date(), 'dd/MM/yyyy');

        $scope.selectedAmount;

        $scope.selectedCurrency='INR';

        $scope.currencies =[];

        $scope.expenseCategories = [];

    	$scope.selectedProject = {};

    	$scope.selectedSite = {};

    	$scope.selectedSla = {};

    	$scope.expenseDetails = {};

    	$scope.uploadExpenseFile = {};

    	$scope.uploadExpensePhoto = {};

    	$rootScope.loginView = false;

    	$scope.pages = { currPage : 1};

    	$scope.pager = {};

        $scope.noData = false;

        $scope.pageSort = 10;

        $scope.searchTransactionType = null;
        $scope.searchExpenseCategories = null;

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
                $scope.expenseData();
            }else if(text == 'update'){
                /** @reatin - retaining scope value.**/
                $rootScope.retain=1;
                $scope.updateIndent()
            }
        };


        //init load
			$scope.initLoad = function(){
				$scope.loadProjects();
			    $scope.loadPageTop();
			    $scope.loadExpenseCategories();
			    // $scope.getCurrencies();
			    $scope.searchFilter();
			 };

			$scope.getLatestEntry = function(siteId){
			    console.log(siteId);
			    ExpenseComponent.getLatestRecordBySite(siteId.id).then(function (data) {
                    console.log(data);

                    $scope.previousData = data;
                })
            };

            $scope.refreshPage = function() {
                $scope.clearFilter();
                $scope.search();
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

                $scope.checkProject = function(){
                    if($scope.selectedProject && $scope.selectedProject.id == undefined){
                        $scope.showNotifications('top','center','danger','Select Client to get site list...');
                    }
                };

                $scope.showNotifications= function(position,alignment,color,msg){
                    demo.showNotification(position,alignment,color,msg);
                }

                $('input#selectedDate').on('dp.change', function(e){
                    $scope.selectedDate = e.date._d;
                    $scope.selectedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
                    console.log('Selected Date for expense transaction  - ' + $scope.selectedDate);
                });

                $('#selectedDate').datetimepicker({
                    format: 'DD/MM/YYYY',
                    	maxDate: new Date()
                });


                $scope.searchFilter = function () {
                    $('.AdvancedFilterModal.in').modal('hide');
                    $scope.setPage(1);
                    $scope.search();
                 }

                $scope.cancelExpense = function () {
                    $location.path('/expense-list');
                };

                $scope.setPage = function (page) {

                    if (page < 1 || page > $scope.pager.totalPages) {
                        return;
                    }
                    //alert(page);
                    $scope.pages.currPage = page;
                    $scope.search();
                };

                $scope.loadExpense = function () {

                    console.log($stateParams.id);
                    ExpenseComponent.findOne($stateParams.id).then(function (data) {
                        console.log("expense------------------",data);
                        $scope.expenseDetails = data;
                        $scope.selectedProject = {id: $scope.expenseDetails.projectId };
                        $scope.selectedSite = {id: $scope.expenseDetails.siteId };
                        $scope.transactionMode = $scope.expenseDetails.mode;
                        $scope.selectedDate = $scope.expenseDetails.expenseDate;
                        $scope.selectedCategory = {name: $scope.expenseDetails.expenseCategory};
                        $scope.selectedPaymentType = $scope.expenseDetails.paymentType;
                        $scope.selectedCurrency = $scope.expenseDetails.currency;
                        $scope.selectedAmount = $scope.expenseDetails.debitAmount;
                        $scope.receiptNumber = $scope.expenseDetails.receiptNumber;
                        $scope.billable = $scope.expenseDetails.billable;
                        $scope.reimbursable = $scope.expenseDetails.reimbursable;
                        $scope.description = $scope.expenseDetails;
                    })

                }

                $scope.loadExpenseImage = function(image) {
                    var eleId = 'photoStart';
                    var ele = document.getElementById(eleId);
                    ele.setAttribute('src',image);

                };

                $scope.expenseData = function(){
                    if($scope.selectedProject){
                        $scope.expenseDetails.projectId = $scope.selectedProject.id;
                    }

                    if($scope.selectedSite){
                        $scope.expenseDetails.siteId = $scope.selectedSite.id;
                    }

                    if($scope.transactionMode == 'debit'){
                        $scope.expenseDetails.mode = 'debit';
                    }else if($scope.transactionMode == 'credit'){
                        $scope.expenseDetails.mode = 'credit';
                    }

                    if($scope.selectedDate){

                        if($scope.transactionMode == 'debit'){
                            $scope.expenseDetails.expenseDate = new Date($scope.selectedDate);
                        }else{
                            $scope.expenseDetails.creditedDate = new Date($scope.selectedDate);
                        }
                    }

                    if($scope.selectedCategory && $scope.transactionMode == 'debit'){
                        console.log($scope.selectedCategory);
                        $scope.expenseDetails.expenseCategory = $scope.selectedCategory;
                    }

                    if($scope.selectedPaymentType ){
                        $scope.expenseDetails.paymentType = $scope.selectedPaymentType;
                    }

                    if($scope.selectedCurrency){
                        console.log($scope.selectedCurrency);
                        // $scope.expenseDetails.currency = $scope.selectedCurrency.code;
                        $scope.expenseDetails.currency = $scope.selectedCurrency;
                    }

                    if($scope.selectedAmount){
                        if($scope.transactionMode == 'debit'){
                            $scope.expenseDetails.debitAmount = $scope.selectedAmount;
                        }else if($scope.transactionMode == 'credit'){
                            $scope.expenseDetails.creditAmount = $scope.selectedAmount;
                        }
                    }

                    if($scope.billable){
                        $scope.expenseDetails.billable = $scope.billable;
                    }else{
                        $scope.expenseDetails.billable = false;
                    }

                    if($scope.reimbursable){
                        $scope.expenseDetails.reimbursable = $scope.reimbursable;
                    }else{
                        $scope.expenseDetails.reimbursable = false;
                    }

                    if($scope.description){
                        $scope.expenseDetails.description = $scope.description;
                    }


                    if($scope.selectedPhotoFile){
                        if($scope.uploadExpensePhoto.title){
                            if($scope.selectedFile){
                                if($scope.uploadExpenseFile.title){
                                    $scope.saveExpense($scope.expenseDetails);
                                }else{
                                    $scope.showNotifications('top','center','danger','Please Enter title for file to upload...');
                                }
                            }else{
                                $scope.saveExpense($scope.expenseDetails);
                            }

                        }else{
                            $scope.showNotifications('top','center','danger','Please Enter title for photo to upload...');
                        }
                    }else{

                        if($scope.selectedFile){
                            if($scope.uploadExpenseFile.title){
                                $scope.saveExpense($scope.expenseDetails);
                            }else{
                                $scope.showNotifications('top','center','danger','Please Enter title for file to upload...');
                            }
                        }else{
                            $scope.saveExpense($scope.expenseDetails);
                        }

                    }

                };

                $scope.saveExpense = function(expenseDetails){
                    console.log("EXPENSE DETAIL.",expenseDetails);
                    ExpenseComponent.createExpense($scope.expenseDetails).then(function (data) {
                        console.log(data);
                        $scope.expenseSuccessResponse = data;
                        $scope.showNotifications('top','center','success',"Expense Saved successfully..");
                        if($scope.selectedFile){
                            $scope.expenseFileUpload(data);
                        }

                        if($scope.selectedPhotoFile){
                            $scope.uploadExpensePhotoFile(data);
                        }
                        $scope.cancelExpense();
                    })
                };

                $scope.isActiveAsc = 'expenseDate';
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
                    	};
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

                    if(!$scope.searchProject && !$scope.searchSite ) {
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

                    if($scope.searchTransactionType) {
                        $scope.searchCriteria.transactionType = $scope.searchTransactionType;
                    }else{
                        $scope.searchCriteria.transactionType = null;
                    }
                    if($scope.searchExpenseCategories) {
                        $scope.searchCriteria.expenseCategories = $scope.searchExpenseCategories;
                    }else{
                        $scope.searchCriteria.expenseCategories = null;
                    }

                    if($scope.pageSort){
                        $scope.searchCriteria.sort = $scope.pageSort;
                    }

                    if($scope.selectedColumn){

                        $scope.searchCriteria.columnName = $scope.selectedColumn;
                        $scope.searchCriteria.sortByAsc = $scope.isAscOrder;

                    }else{
                        $scope.searchCriteria.columnName = 'expenseDate';
                        $scope.searchCriteria.sortByAsc = true;
                    }

                    $scope.expenses = '';
                    $scope.expensesLoader = false;
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
                            if($scope.localStorage.expenseCategories){
                                $scope.searchExpenseCategories = $scope.localStorage.expenseCategories;

                            }else{
                                $scope.searchExpenseCategories = null;
                                $scope.regionsListOne.selected = $scope.searchRegion;
                            }


                        }

                        $rootScope.retain = 0;

                        $scope.searchCriteras  = $scope.localStorage;
                    }else{

                        $scope.searchCriteras  = $scope.searchCriteria;
                    }

                    /* Localstorage (Retain old values while edit page to list) end */

                        ExpenseComponent.search($scope.searchCriteria).then(function (data) {
                            console.log('expense search>>',data);
                        $scope.expenses = data.transactions;
                        $scope.expensesLoader = true;

                        /** retaining list search value.**/
                        getLocalStorage.updateSearch($scope.searchCriteras);

                         /*
                            ** Call pagination  main function **
                        */
                         $scope.pager = {};
                         $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                         $scope.totalCountPages = data.totalCount;

                         console.log("Pagination",$scope.pager);
                         console.log(data);

                        $scope.pages.currPage = data.currPage;
                        $scope.pages.totalPages = data.totalPages == 0 ? 1:data.totalPages;

                        if($scope.expenses && $scope.expenses.length > 0 ){
                            $scope.showCurrPage = data.currPage;
                            $scope.pageEntries = $scope.expenses.length;
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

                //sites
                $scope.siteSpin = false;
                $scope.loadSites = function () {
                    $scope.siteSpin = true;
                	console.log("selected project - " + JSON.stringify($scope.selectedProject));
                	if($scope.selectedProject) {
                    	ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
                            $scope.sites = data;
                            $scope.siteSpin = false;

                        });
                	}else {
                    	SiteComponent.findAll().then(function (data) {
                            $scope.sites = data;
                        });
                	}
                };

        $scope.loadAllSites = function () {

                SiteComponent.findAll().then(function (data) {
                    $scope.sites = data;
                });

        };

                $scope.loadExpenseCategories = function(){
                    ExpenseComponent.searchExpenseCategories().then(function (data) {
                        console.log("Expense Cat ==================>",data);
                        $scope.expenseCategories = data;

                    })
                }

                // $scope.getCurrencies = function () {
                //     ExpenseComponent.getCurrencies().then(function (data) {
                //         console.log(data);
                //         $scope.currencies = data;
                //     })
                // }

                $scope.selectCategory = function (category) {
                    console.log(category)
                    $scope.selectedCategory = category.name;
                }


        $scope.imgNotValid=true;
        $scope.imgSizeHigh=true;


        $scope.uploadImage = function (files) {

            var ext = files[0].name.match(/\.(.+)$/)[1];


            if(angular.lowercase(ext) ==='jpg' || angular.lowercase(ext) ==='jpeg' || angular.lowercase(ext) ==='png'){
                $scope.imgNotValid=false;


                if(files[0].size < 15000000){

                    $scope.imgSizeHigh=false;

                }else{

                    $scope.imgSizeHigh=true;
                }

            }
            else{
                $scope.imgNotValid=true;

            }

        }

        $scope.fileNotValid=true;
        $scope.fileSizeHigh=true;

        $scope.uploadfileValidation = function (files) {

            var ext = files[0].name.match(/\.(.+)$/)[1];

            if(angular.lowercase(ext) ==='doc' || angular.lowercase(ext) ==='docx'
                || angular.lowercase(ext) ==='xls'|| angular.lowercase(ext) ==='xlsx' || angular.lowercase(ext) ==='txt'
                || angular.lowercase(ext) ==='csv' || angular.lowercase(ext) ==='pdf'){
                $scope.fileNotValid=false;

                if(files[0].size < 15000000){

                    $scope.fileSizeHigh=false;

                }else{

                    $scope.fileSizeHigh=true;
                }

            }
            else{
                $scope.fileNotValid=true;

            }

        }

        $scope.expenseFileUpload = function(expenseDetails) {
                console.log(expenseDetails);
                if($scope.selectedFile) {

                    console.log("file title - " + $scope.uploadExpenseFile.title + "file name -" + $scope.selectedFile);

                    $scope.uploadExpenseFile.expenseId = $scope.expenseSuccessResponse.id;

                    $scope.uploadExpenseFile.uploadFile = $scope.selectedFile;
                    //$scope.uploadExpenseFile.assetId = 1;
                    $scope.uploadExpenseFile.type = 'document';
                    console.log($scope.uploadExpenseFile);


                    // $rootScope.loadingStart();
                    ExpenseComponent.uploadExpenseFile($scope.uploadExpenseFile).then(function(data){
                        // $scope.loadingStop();
                        console.log("-- Upload file --",data);
                        if(data) {
                            $scope.uploadFiles =[];
                            $scope.uploadFiles.push(data);
                            $scope.getAllUploadedFiles();
                        }else{
                            console.log('No data found!');
                        }
                        $scope.uploadExpenseFile  ={};
                        $scope.selectedFile = "";

                    },function(err){
                        // $scope.loadingStop();
                        console.log('Import error');
                        console.log(err);
                    }).catch(function(response){
                        // $scope.loadingStop();
                        // $scope.showNotifications('top','center','danger','Unable to  upload file..');
                    });
                } else {
                    console.log('select a file');
                }
            }

        $scope.uploadExpensePhotoFile = function(expenseDetails) {


                console.log($scope.selectedPhotoFile);

                console.log($scope.uploadExpensePhoto.title);

                console.log("Expense details - -------------------------------");

                console.log(expenseDetails);
                console.log(expenseDetails.id);

                if($scope.selectedPhotoFile) {
                    console.log('selected asset file - ' + $scope.selectedPhotoFile);

                    $scope.uploadExpensePhoto.uploadFile = $scope.selectedPhotoFile;

                    $scope.uploadExpensePhoto.expenseId = expenseDetails.id;

                    $scope.uploadExpensePhoto.type = 'image';

                    console.log($scope.uploadExpensePhoto);
                    $scope.loadingStart();
                    ExpenseComponent.uploadExpensePhoto($scope.uploadExpensePhoto).then(function(data){
                        console.log(data);
                        $scope.loadingStop();
                        if(data) {
                            $scope.uploadExpensePhotos =[];
                            $scope.uploadExpensePhotos.push(data);
                            $scope.getAllUploadedPhotos();
                        }else{
                            console.log('No data found!');
                        }

                        $scope.uploadExpensePhoto  ={};
                        $scope.selectedPhotoFile = "";

                    },function(err){
                        $scope.loadingStop();
                        console.log('Import error');
                        console.log(err);
                    }).catch(function(response){
                        $scope.loadingStop();
                        // $scope.showNotifications('top','center','danger','Unable to  upload file..');
                    });
                } else {
                    console.log('select a file');
                }

        }

        $scope.clearFilter = function() {
            $scope.selectedSite = null;
            $scope.selectedProject = null;
            $scope.searchProject = null;
            $scope.searchSite = null;
            $scope.searchCriteria = {};
            $scope.localStorage = null;
            $rootScope.searchCriteriaSite = null;
            $scope.searchTransactionType = null;
            $scope.searchExpenseCategories = null;

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
            $scope.empListOne.selected = undefined;
            $scope.employeeFilterDisable = true;

        };

        $scope.clearRegion = function($event) {
            $event.stopPropagation();
            $scope.regionsListOne.selected = undefined;
            $scope.branchsListOne.selected = undefined;
            $scope.sitesListOne.selected = undefined;
            $scope.branchFilterDisable = true;
            $scope.siteFilterDisable = true;
            $scope.empListOne.selected = undefined;
            $scope.employeeFilterDisable = true;

        };

        $scope.clearBranch = function($event) {
            $event.stopPropagation();
            $scope.branchsListOne.selected = undefined;
            $scope.sitesListOne.selected = undefined;
            $scope.siteFilterDisable = true;
            $scope.empListOne.selected = undefined;
            $scope.employeeFilterDisable = true;

        };

        $scope.clearSite = function($event) {
            $event.stopPropagation();
            $scope.sitesListOne.selected = null;
            $scope.empListOne.selected = undefined;
            $scope.employeeFilterDisable = true;

        };



        /*
         * Ui select allow-clear modified function end
         *
         * */




    });
