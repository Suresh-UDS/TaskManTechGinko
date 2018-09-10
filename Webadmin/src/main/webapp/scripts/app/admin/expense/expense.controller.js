'use strict';

angular.module('timeSheetApp')
    .controller('ExpenseController', function ($rootScope, $scope, $state, $timeout,
    		ProjectComponent, SiteComponent, ExpenseComponent, $http,$stateParams,$location, PaginationComponent,$filter) {


        $scope.selectedCategory = {};

        $scope.description = "";

        $scope.billable = true;

        $scope.reimbursable = true;

        $scope.selectedPaymentType = 'CASH';

        $scope.transactionMode = "debit";

        $scope.selectedDate = $filter('date')(new Date(), 'dd/MM/yyyy');

        $scope.selectedAmount = 0;

        $scope.selectedCurrency={};

        $scope.currencies =[];

        $scope.expenseCategories = [];

    	$scope.selectedProject = {};

    	$scope.selectedSite = {};

    	$scope.selectedSla = {};

    	$scope.expenseDetails = {};

    	$rootScope.loginView = false;

    	$scope.pages = { currPage : 1};

    	$scope.pager = {};

        $scope.noData = false;

			//init load
			$scope.initLoad = function(){
				$scope.loadProjects();
			    $scope.loadPageTop();
			    $scope.loadExpenseCategories();
			    $scope.getCurrencies();
			    $scope.searchFilter();
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
                    format: 'DD/MM/YYYY'
                });


                $scope.searchFilter = function () {
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

                $scope.saveExpense = function(){
                    if($scope.selectedProject){
                        $scope.expenseDetails.projectId = $scope.selectedProject.id;
                    }

                    if($scope.selectedSite){
                        $scope.expenseDetails.siteId = $scope.selectedSite.id;
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
                        $scope.expenseDetails.currency = $scope.selectedCurrency.code;
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

                    console.log("Before saving expenses");
                    console.log($scope.expenseDetails);
                    ExpenseComponent.createExpense($scope.expenseDetails).then(function (data) {
                        console.log(data);
                    })
                };


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
                	console.log('Selected  site -' + JSON.stringify($scope.selectedSite));
                	console.log('search criteria - '+JSON.stringify($rootScope.searchCriteriaSite));

                	if(!$scope.selectedSite) {
                		if($rootScope.searchCriteriaSite) {
                    		$scope.searchCriteria = $rootScope.searchCriteriaSite;
                		}else {
                			$scope.searchCriteria.findAll = true;
                		}
                	}else if($scope.selectedSite) {
                		$scope.searchCriteria.findAll = false;
        	        	if($scope.selectedSite) {
        		        	$scope.searchCriteria.siteId = $scope.selectedSite.id;
        		        	if(!$scope.searchCriteria.siteId) {
        		        		$scope.searchCriteria.siteName = $scope.selectedSite.name;
        		        	}else {
        			        	$scope.searchCriteria.siteName = $scope.selectedSite.name;
        		        	}
        		        	console.log('selected site id ='+ $scope.searchCriteria.siteId);
        	        	}else {
        	        		$scope.searchCriteria.siteId = 0;
        	        	}
                	}

                    console.log("search criteria",$scope.searchCriteria);
                        $scope.slas = '';
                        $scope.sitesLoader = false;
                        $scope.loadPageTop();
                        ExpenseComponent.search($scope.searchCriteria).then(function (data) {
                        $scope.slas = data.transactions;
                        $scope.sitesLoader = true;

                         /*
                            ** Call pagination  main function **
                        */
                         $scope.pager = {};
                         $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                         $scope.totalCountPages = data.totalCount;

                         console.log("Pagination",$scope.pager);
                         console.log($scope.slas);

                        $scope.pages.currPage = data.currPage;
                        $scope.pages.totalPages = data.totalPages;

                        if($scope.slas && $scope.slas.length > 0 ){
                            $scope.showCurrPage = data.currPage;
                            $scope.pageEntries = $scope.slas.length;
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
                		console.log("SLA projects");
                		$scope.projects = data;
                		console.log(data);
                		$scope.loadingStop();
                	});

                };

                $scope.loadSites = function () {
                	console.log("selected project - " + JSON.stringify($scope.selectedProject));
                	if($scope.selectedProject) {
                    	ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
                            $scope.sites = data;

                        });
                	}else {
                    	SiteComponent.findAll().then(function (data) {
                            $scope.sites = data;
                        });
                	}
                };

                $scope.loadExpenseCategories = function(){
                    ExpenseComponent.searchExpenseCategories().then(function (data) {
                        console.log(data);
                        $scope.expenseCategories = data;

                    })
                }

                $scope.getCurrencies = function () {
                    ExpenseComponent.getCurrencies().then(function (data) {
                        console.log(data);
                        $scope.currencies = data;
                    })
                }

                $scope.selectCategory = function (category) {
                    console.log(category)
                    $scope.selectedCategory = category.name;
                }


    });
