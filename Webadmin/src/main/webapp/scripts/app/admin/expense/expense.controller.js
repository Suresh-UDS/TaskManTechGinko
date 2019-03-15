'use strict';

angular.module('timeSheetApp')
    .controller('ExpenseController', function ($rootScope, $scope, $state, $timeout,
    		ProjectComponent, SiteComponent, ExpenseComponent, $http,$stateParams,$location, PaginationComponent,$filter) {


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

			$scope.refresh = function () {
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
                    format: 'DD/MM/YYYY',
                    	maxDate: new Date()
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
                	console.log('Selected  site -' + JSON.stringify($scope.selectedSite));
                	console.log('search criteria - '+JSON.stringify($rootScope.searchCriteriaSite));

                	if(!$scope.selectedSite) {
                			$scope.searchCriteria.findAll = true;
                	}else if($scope.selectedSite) {
                		$scope.searchCriteria.findAll = true;
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
                        $scope.expenses = '';
                        $scope.sitesLoader = false;
                        $scope.loadPageTop();
                        ExpenseComponent.search($scope.searchCriteria).then(function (data) {
                            console.log(data);
                        $scope.expenses = data;
                        $scope.sitesLoader = true;

                         /*
                            ** Call pagination  main function **
                        */
                         $scope.pager = {};
                         $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                         $scope.totalCountPages = data.totalCount;

                         console.log("Pagination",$scope.pager);
                         console.log(data);

                        $scope.pages.currPage = data.currPage;
                        $scope.pages.totalPages = data.totalPages;

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


                $scope.loadProjects = function() {
                	ProjectComponent.findAll().then(function (data) {
                		console.log("SLA projects");
                		$scope.projects = data;
                		console.log(data);
                		$scope.loadingStop();
                	});

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
                        $scope.showNotifications('top','center','danger','Unable to  upload file..');
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




    });
