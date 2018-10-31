'use strict';

angular.module('timeSheetApp')
    .controller('SettingsController', function ($rootScope, $scope, $state, $timeout, $http, $stateParams,
     $location, ProjectComponent, SettingsComponent,$filter) {
            $rootScope.loadingStop();
            $rootScope.loginView = false;
    		$scope.selectedProject =null;
        $scope.selectedDayWiseAttnEmailTime =  new Date();

    		$scope.selectedSite =null;
            $scope.pager = {};

    		$scope.settings = {
    			shiftWiseAttendanceEmailIds : [],
    			dayWiseAttendanceEmailIds : [],
    			overdueEmailIds : [],
    			eodJobEmailIds : [],
    			quotationEmailIds : [],
    			feedbackEmailIds : [],
    			feedbackReportEmailIds : [],
    			ticketEmailIds : [],
    			readingEmailIds : [],
    			assetEmailIds : [],
    			ppmEmailIds : [],
    			amcEmailIds : [],
    			warrantyEmailIds: [],
    			dayWiseReportEmailIds: [],
    			musterRollEmailIds : [],
    			purchaseReqEmailIds: []
    		};


    		$scope.init = function() {
    			$scope.loadProjects();
    			//$scope.loadSettings();
    		}

    		$scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();

        };

        $('input#dayWiseAttendanceAlertTime').on('dp.change', function(e){
            console.log(e.date);
            console.log(e.date._d);

            $.notifyClose();

            //$scope.selectedDayWiseAttnEmailTime= $filter('date')(e.date._d, 'yyyy-MM-dd HH:mm:ss');
            $scope.selectedDayWiseAttnEmailTime = e.date._d;
            $scope.settings.dayWiseAttendanceAlertTime = $scope.selectedDayWiseAttnEmailTime;

        });

        $('input#dayWiseReportAlertTime').on('dp.change', function(e){
            console.log(e.date);
            console.log(e.date._d);

            $.notifyClose();

            //$scope.selectedDayWiseAttnEmailTime= $filter('date')(e.date._d, 'yyyy-MM-dd HH:mm:ss');
            $scope.selectedDayWiseReportEmailTime = e.date._d;
            $scope.settings.dayWiseReportAlertTime = $scope.selectedDayWiseReportEmailTime;

        });

        $('input#feedbackReportTime').on('dp.change', function(e){
            console.log(e.date);
            console.log(e.date._d);

            $.notifyClose();

            //$scope.selectedDayWiseAttnEmailTime= $filter('date')(e.date._d, 'yyyy-MM-dd HH:mm:ss');
            $scope.selectedFeedbackReportTime = e.date._d;
            $scope.settings.feedbackReportTime = $scope.selectedFeedbackReportTime;

        });

        $scope.initCalender();

    		$scope.addTicketEmail = function() {
	        	var email = $scope.ticketEmail;
	        	if(!$scope.settings.ticketEmailIds) {
	        		$scope.settings.ticketEmailIds = [];
	        	}
	        	$scope.settings.ticketEmailIds.push(email);
	        	$scope.ticketEmail = '';
        }

        $scope.removeTicketEmail = function(ind) {
        		$scope.settings.ticketEmailIds.splice(ind,1);
        }

    		$scope.addQuotationEmail = function() {
	        	var email = $scope.quotationEmail;
	        	if(!$scope.settings.quotationEmailIds) {
	        		$scope.settings.quotationEmailIds = [];
	        	}
	        	$scope.settings.quotationEmailIds.push(email);
	        	$scope.quotationEmail = '';
        }

        $scope.removeQuotationEmail = function(ind) {
        		$scope.settings.quotationEmailIds.splice(ind,1);
        }

        $scope.addShiftWiseAttendanceEmail = function() {
	        	var email = $scope.shiftWiseAttendanceEmail;
	        	if(!$scope.settings.shiftWiseAttendanceEmailIds) {
	        		$scope.settings.shiftWiseAttendanceEmailIds = [];
	        	}
	        	$scope.settings.shiftWiseAttendanceEmailIds.push(email);
	        	$scope.shiftWiseAttendanceEmail = '';
        }

        $scope.removeShiftWiseAttendanceEmail = function(ind) {
        		$scope.settings.shiftWiseAttendanceEmailIds.splice(ind,1);
        }

        $scope.addDayWiseAttendanceEmail = function() {
	        	var email = $scope.dayWiseAttendanceEmail;
	        	if(!$scope.settings.dayWiseAttendanceEmailIds) {
	        		$scope.settings.dayWiseAttendanceEmailIds = [];
	        	}
	        	$scope.settings.dayWiseAttendanceEmailIds.push(email);
	        	$scope.dayWiseAttendanceEmail = '';
	    }

	    $scope.removeDayWiseAttendanceEmail = function(ind) {
	    		$scope.settings.dayWiseAttendanceEmailIds.splice(ind,1);
	    }

        $scope.addOverdueEmail = function() {
	        	var email = $scope.overdueEmail;
	        	if(!$scope.settings.overdueEmailIds) {
	        		$scope.settings.overdueEmailIds = [];
	        	}
	        	$scope.settings.overdueEmailIds.push(email);
	        	$scope.overdueEmail = '';
        }

        $scope.removeOverdueEmail = function(ind) {
        		$scope.settings.overdueEmailIds.splice(ind,1);
        }

        $scope.addEodJobEmail = function() {
	        	var email = $scope.eodJobEmail;
	        	if(!$scope.settings.eodJobEmailIds) {
	        		$scope.settings.eodJobEmailIds = [];
	        	}
	        	$scope.settings.eodJobEmailIds.push(email);
	        	$scope.eodJobEmail = '';
	    }

	    $scope.removeEodJobEmail = function(ind) {
	    		$scope.settings.eodJobEmailIds.splice(ind,1);
	    }

        $scope.addFeedbackEmail = function() {
	        	var email = $scope.feedbackEmail;
	        	if(!$scope.settings.feedbackEmailIds) {
	        		$scope.settings.feedbackEmailIds = [];
	        	}
	        	$scope.settings.feedbackEmailIds.push(email);
        		$scope.feedbackEmail = '';

	    }

	    $scope.removeFeedbackEmail = function(ind) {
	    		$scope.settings.feedbackEmailIds.splice(ind,1);
	    }

        $scope.addFeedbackReportEmail = function() {
	        	var email = $scope.feedbackReportEmail;
	        	if(!$scope.settings.feedbackReportEmailIds) {
	        		$scope.settings.feedbackReportEmailIds = [];
	        	}
	        	$scope.settings.feedbackReportEmailIds.push(email);
	    		$scope.feedbackReportEmail = '';

	    }

	    $scope.removeFeedbackReportEmail = function(ind) {
	    		$scope.settings.feedbackReportEmailIds.splice(ind,1);
	    }

	    $scope.addReadingEmail = function() {
        	var email = $scope.readingEmail;
        	if(!$scope.settings.readingEmailIds) {
        		$scope.settings.readingEmailIds = [];
        	}
        	$scope.settings.readingEmailIds.push(email);
        	$scope.readingEmail = '';
	    }

	    $scope.removeReadingEmail = function(index) {
    		$scope.settings.readingEmailIds.splice(index,1);
	    }

	    $scope.addAssetBreakdownEmail = function() {
        	var email = $scope.assetEmail;
        	if(!$scope.settings.assetEmailIds) {
        		$scope.settings.assetEmailIds = [];
        	}
        	$scope.settings.assetEmailIds.push(email);
        	$scope.assetEmail = '';
	    }

	    $scope.removeAssetEmail = function(index) {
    		$scope.settings.assetEmailIds.splice(index,1);
	    }

	    //PPM Job alert
	    $scope.addPPMEmail = function() {
        	var email = $scope.ppmEmail;
        	if(!$scope.settings.ppmEmailIds) {
        		$scope.settings.ppmEmailIds = [];
        	}
        	$scope.settings.ppmEmailIds.push(email);
        	$scope.ppmEmail = '';
	    }

	    $scope.removePPMEmail = function(index) {
    		$scope.settings.ppmEmailIds.splice(index,1);
	    }

	    //AMC Job alert
	    $scope.addAMCEmail = function() {
        	var email = $scope.amcEmail;
        	if(!$scope.settings.amcEmailIds) {
        		$scope.settings.amcEmailIds = [];
        	}
        	$scope.settings.amcEmailIds.push(email);
        	$scope.amcEmail = '';
	    }

	    $scope.removeAMCEmail = function(index) {
    		$scope.settings.amcEmailIds.splice(index,1);
	    }

	    //Warranty Expire alert
	    $scope.addWarrantyEmail = function() {
        	var email = $scope.warrantyEmail;
        	if(!$scope.settings.warrantyEmailIds) {
        		$scope.settings.warrantyEmailIds = [];
        	}
        	$scope.settings.warrantyEmailIds.push(email);
        	$scope.warrantyEmail = '';
	    }

	    $scope.removeWarrantyEmail = function(index) {
    		$scope.settings.warrantyEmailIds.splice(index,1);
	    }

	    $scope.addDayWiseReportEmail = function() {
        	var email = $scope.dayWiseReportEmail;
        	if(!$scope.settings.dayWiseReportEmailIds) {
        		$scope.settings.dayWiseReportEmailIds = [];
        	}
        	$scope.settings.dayWiseReportEmailIds.push(email);
        	$scope.dayWiseReportEmail = '';
	    }

	    $scope.removeDayWiseReportEmail = function(ind) {
    		$scope.settings.dayWiseReportEmailIds.splice(ind,1);
	    }

	    // Muster roll report alert
	    $scope.addMusterRollEmail = function() {
        	var email = $scope.musterRollEmail;
        	if(!$scope.settings.musterRollEmailIds) {
        		$scope.settings.musterRollEmailIds = [];
        	}
        	$scope.settings.musterRollEmailIds.push(email);
        	$scope.musterRollEmail = '';
	    }

	    $scope.removeMusterEmail = function(index) {
    		$scope.settings.musterRollEmailIds.splice(index,1);
	    }
	    //Purchase Requisition alert
	    $scope.addPREmail = function() {
        	var email = $scope.purchaseReqEmail;
        	if(!$scope.settings.purchaseReqEmailIds) {
        		$scope.settings.purchaseReqEmailIds = [];
        	}
        	$scope.settings.purchaseReqEmailIds.push(email);
        	$scope.purchaseReqEmail = '';
	    }

	    $scope.removePREmail = function(index) {
    		$scope.settings.purchaseReqEmailIds.splice(index,1);
	    }


        $scope.loadProjects = function () {
			console.log("Loading all projects")
        		ProjectComponent.findAll().then(function (data) {
        			console.log("Loading all projects")
                $scope.projects = data;
            });
        };

        $scope.loadSites = function () {
            $scope.showLoader();
        		console.log('selected project - ' + JSON.stringify($scope.selectedProject));
        		if($scope.selectedProject) {
        			ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
                    $scope.sites = data;
                    $scope.hideLoader();

                });
	        	}else {
	            	SiteComponent.findAll().then(function (data) {
	                    $scope.sites = data;
	                    $scope.hideLoader();

	                });
	        	}
        };

        $scope.showLoader = function(){
            console.log("Show Loader");
            $scope.loading = true;
            $scope.notLoading=false;
        };

        $scope.hideLoader = function(){
            console.log("Show Loader");
            $scope.loading = false;
            $scope.notLoading=true;
        };

        $scope.saveSettings = function() {
        		$scope.showLoader();
        		if($scope.selectedProject) {
            		$scope.settings.projectId = $scope.selectedProject.id;
            		$scope.settings.projectName = $scope.selectedProject.name;
        		}

        		if($scope.selectedSite) {
            		$scope.settings.siteId = $scope.selectedSite.id;
            		$scope.settings.siteName = $scope.selectedSite.name;
        		}
        		console.log('settings - ' + JSON.stringify($scope.settings));
        		SettingsComponent.saveSettings($scope.settings).then(function() {
        			$scope.hideLoader();
        			$scope.showNotifications('top','center','success','Settings updated successfully');
        			$location.path('/app_settings');
        		}).catch(function (response) {
        			$scope.showNotifications('top','center','danger','Settings updation failed. Invalid input');
        		});
                $scope.loadPageTop();

        }

        $scope.loadSettings = function() {
        		var projectId = 0;
        		var siteId = 0;
        		if($scope.selectedProject) {
        			projectId = $scope.selectedProject.id;
        		}
        		if($scope.selectedSite) {
        			siteId = $scope.selectedSite.id;
        		}
        		$scope.showLoader();
        		SettingsComponent.findAll(projectId, siteId).then(function(data) {
        			console.log('all settings response- '+ JSON.stringify(data));
        			if(data) {
            			$scope.settings = data;
        			}
                $scope.hideLoader();
        		})
        }

        $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
        }

        $scope.cancelEmployee = function() {

                //$location.path('/app_settings');

                $scope.selectedProject =null;

                $scope.selectedSite =null;

                $scope.settings = "";

                $scope.loadPageTop();
        }

         //init load
        $scope.initLoad = function(){
             $scope.loadPageTop();


         }

    });


