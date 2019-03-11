'use strict';

angular.module('timeSheetApp')
    .controller('SettingsController', function ($rootScope, $scope, $state, $timeout, $http, $stateParams,
		$location, ProjectComponent,SiteComponent,SettingsComponent,$filter) {
	$rootScope.loadingStop();
	$rootScope.loginView = false;
	$scope.selectedProject =null;
	$scope.selectedDayWiseAttnEmailTimeSer =  new Date();
	$scope.selectedDayWiseAttnEmailTime= $filter('date')(new Date(), 'MM/dd/yyyy HH:mm a');

	$scope.selectedDayWiseReportEmailTimeSer = new Date();
	$scope.selectedDayWiseReportEmailTime= $filter('date')(new Date(), 'MM/dd/yyyy HH:mm a');

	$scope.selectedFeedbackReportTimeSer = new Date();
	$scope.selectedFeedbackReportTime= $filter('date')(new Date(), 'MM/dd/yyyy HH:mm a');


	$scope.selectedSite =null;
	$scope.pager = {};
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
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
			musterRollEmailIds : []
	};


	$scope.init = function() {
		$scope.loadProjects();
		//$scope.loadSettings();
	};

	$scope.initCalender = function(){

		demo.initFormExtendedDatetimepickers();

	};

	$('input#dayWiseAttendanceAlertTime').on('dp.change', function(e){
		console.log(e.date);
		console.log(e.date._d);

		$.notifyClose();

		$scope.selectedDayWiseAttnEmailTime = $filter('date')(e.date._d, 'MM/dd/yyyy HH:mm a');
		$scope.selectedDayWiseAttnEmailTimeSer = new Date(e.date._d);
		$scope.settings.dayWiseAttendanceAlertTime = $scope.selectedDayWiseAttnEmailTimeSer;

	});

	$('input#dayWiseReportAlertTime').on('dp.change', function(e){
		console.log(e.date);
		console.log(e.date._d);

		$.notifyClose();

		$scope.selectedDayWiseReportEmailTime= $filter('date')(e.date._d, 'MM/dd/yyyy HH:mm a');
		$scope.selectedDayWiseReportEmailTimeSer = new Date(e.date._d);
		$scope.settings.dayWiseReportAlertTime = $scope.selectedDayWiseReportEmailTimeSer;

	});

	$('input#feedbackReportTime').on('dp.change', function(e){
		console.log(e.date);
		console.log(e.date._d);

		$.notifyClose();

		$scope.selectedFeedbackReportTime= $filter('date')(e.date._d, 'MM/dd/yyyy HH:mm a');
		$scope.selectedFeedbackReportTimeSer = new Date(e.date._d);
		$scope.settings.feedbackReportTime = $scope.selectedFeedbackReportTimeSer;

	});

	$scope.initCalender();

	$scope.addTicketEmail = function() {
		var email = $scope.ticketEmail;
        if(!email){
            alert("Please fill out the field..!!");
            return false;
        }else{
            if(!regex.test(email)){
                alert("Please enter valid email..!!");
                return false;
            }else{
                if(email.length > 50){
                    alert("Email cannot be longer than 50 characters.");
                    return false;
                }
            }
        }
        if($scope.settings.ticketEmailIds){
            if($scope.settings.ticketEmailIds.length > 0){
                for(var i=0; i < $scope.settings.ticketEmailIds.length;i++){
                    if($scope.settings.ticketEmailIds[i] == email){
                        alert("Email is already exist..!!");
                        return false;
                    }
                }
            }
        }
		if(!$scope.settings.ticketEmailIds) {
			$scope.settings.ticketEmailIds = [];
		}
		$scope.settings.ticketEmailIds.push(email);
		$scope.ticketEmail = '';
	};

	$scope.removeTicketEmail = function(ind) {
		$scope.settings.ticketEmailIds.splice(ind,1);
	};

	$scope.addQuotationEmail = function() {
		var email = $scope.quotationEmail;
        if(!email){
            alert("Please fill out the field..!!");
            return false;
        }else{
            if(!regex.test(email)){
                alert("Please enter valid email..!!");
                return false;
            }else{
               if(email.length > 50){
                   alert("Email cannot be longer than 50 characters.");
                   return false;
               }
            }
        }

        if($scope.settings.quotationEmailIds){
            if($scope.settings.quotationEmailIds.length > 0){
                for(var i=0; i < $scope.settings.quotationEmailIds.length;i++){
                    if($scope.settings.quotationEmailIds[i] == email){
                        alert("Email is already exist..!!");
                        return false;
                    }
                }
            }
        }



		if(!$scope.settings.quotationEmailIds) {
			$scope.settings.quotationEmailIds = [];
		}
		$scope.settings.quotationEmailIds.push(email);
		$scope.quotationEmail = '';
	};

	$scope.removeQuotationEmail = function(ind) {
		$scope.settings.quotationEmailIds.splice(ind,1);
	};

	$scope.addShiftWiseAttendanceEmail = function() {
		var email = $scope.shiftWiseAttendanceEmail;
        if(!email){
            alert("Please fill out the field..!!");
            return false;
        }else{
            if(!regex.test(email)){
                alert("Please enter valid email..!!");
                return false;
            }else{
                if(email.length > 50){
                    alert("Email cannot be longer than 50 characters.");
                    return false;
                }
            }
        }
        if($scope.settings.shiftWiseAttendanceEmailIds){
            if($scope.settings.shiftWiseAttendanceEmailIds.length > 0){
                for(var i=0; i < $scope.settings.shiftWiseAttendanceEmailIds.length;i++){
                    if($scope.settings.shiftWiseAttendanceEmailIds[i] == email){
                        alert("Email is already exist..!!");
                        return false;
                    }
                }
            }
        }

		if(!$scope.settings.shiftWiseAttendanceEmailIds) {
			$scope.settings.shiftWiseAttendanceEmailIds = [];
		}
		$scope.settings.shiftWiseAttendanceEmailIds.push(email);
		$scope.shiftWiseAttendanceEmail = '';
	};

	$scope.removeShiftWiseAttendanceEmail = function(ind) {
		$scope.settings.shiftWiseAttendanceEmailIds.splice(ind,1);
	};

	$scope.addDayWiseAttendanceEmail = function() {
		var email = $scope.dayWiseAttendanceEmail;
        if(!email){
            alert("Please fill out the field..!!");
            return false;
        }else{
            if(!regex.test(email)){
                alert("Please enter valid email..!!");
                return false;
            }else{
                if(email.length > 50){
                    alert("Email cannot be longer than 50 characters.");
                    return false;
                }
            }
        }
        if($scope.settings.dayWiseAttendanceEmailIds){
            if($scope.settings.dayWiseAttendanceEmailIds.length > 0){
                for(var i=0; i < $scope.settings.dayWiseAttendanceEmailIds.length;i++){
                    if($scope.settings.dayWiseAttendanceEmailIds[i] == email){
                        alert("Email is already exist..!!");
                        return false;
                    }
                }
            }

        }

		if(!$scope.settings.dayWiseAttendanceEmailIds) {
			$scope.settings.dayWiseAttendanceEmailIds = [];
		}
		$scope.settings.dayWiseAttendanceEmailIds.push(email);
		$scope.dayWiseAttendanceEmail = '';
	};

	$scope.removeDayWiseAttendanceEmail = function(ind) {
		$scope.settings.dayWiseAttendanceEmailIds.splice(ind,1);
	};

	$scope.addOverdueEmail = function() {
		var email = $scope.overdueEmail;
        if(!email){
            alert("Please fill out the field..!!");
            return false;
        }else{
            if(!regex.test(email)){
                alert("Please enter valid email..!!");
                return false;
            }else{
                if(email.length > 50){
                    alert("Email cannot be longer than 50 characters.");
                    return false;
                }
            }
        }
        if($scope.settings.overdueEmailIds){
            if($scope.settings.overdueEmailIds.length > 0){
                for(var i=0; i < $scope.settings.overdueEmailIds.length;i++){
                    if($scope.settings.overdueEmailIds[i] == email){
                        alert("Email is already exist..!!");
                        return false;
                    }
                }
            }
        }

		if(!$scope.settings.overdueEmailIds) {
			$scope.settings.overdueEmailIds = [];
		}
		$scope.settings.overdueEmailIds.push(email);
		$scope.overdueEmail = '';
	};

	$scope.removeOverdueEmail = function(ind) {
		$scope.settings.overdueEmailIds.splice(ind,1);
	};

	$scope.addEodJobEmail = function() {
		var email = $scope.eodJobEmail;
        if(!email){
            alert("Please fill out the field..!!");
            return false;
        }else{
            if(!regex.test(email)){
                alert("Please enter valid email..!!");
                return false;
            }else{
                if(email.length > 50){
                    alert("Email cannot be longer than 50 characters.");
                    return false;
                }
            }
        }
        if($scope.settings.eodJobEmailIds){
            if($scope.settings.eodJobEmailIds.length > 0){
                for(var i=0; i < $scope.settings.eodJobEmailIds.length;i++){
                    if($scope.settings.eodJobEmailIds[i] == email){
                        alert("Email is already exist..!!");
                        return false;
                    }
                }
            }
        }

		if(!$scope.settings.eodJobEmailIds) {
			$scope.settings.eodJobEmailIds = [];
		}
		$scope.settings.eodJobEmailIds.push(email);
		$scope.eodJobEmail = '';
	};

	$scope.removeEodJobEmail = function(ind) {
		$scope.settings.eodJobEmailIds.splice(ind,1);
	};

	$scope.addFeedbackEmail = function() {
		var email = $scope.feedbackEmail;
        if(!email){
            alert("Please fill out the field..!!");
            return false;
        }else{
            if(!regex.test(email)){
                alert("Please enter valid email..!!");
                return false;
            }else{
                if(email.length > 50){
                    alert("Email cannot be longer than 50 characters.");
                    return false;
                }
            }
        }
        if($scope.settings.feedbackEmailIds){
            if($scope.settings.feedbackEmailIds.length > 0){
                for(var i=0; i < $scope.settings.feedbackEmailIds.length;i++){
                    if($scope.settings.feedbackEmailIds[i] == email){
                        alert("Email is already exist..!!");
                        return false;
                    }
                }
            }
        }

		if(!$scope.settings.feedbackEmailIds) {
			$scope.settings.feedbackEmailIds = [];
		}
		$scope.settings.feedbackEmailIds.push(email);
		$scope.feedbackEmail = '';

	};

	$scope.removeFeedbackEmail = function(ind) {
		$scope.settings.feedbackEmailIds.splice(ind,1);
	};

	$scope.addFeedbackReportEmail = function() {
		var email = $scope.feedbackReportEmail;
        if(!email){
            alert("Please fill out the field..!!");
            return false;
        }else{
            if(!regex.test(email)){
                alert("Please enter valid email..!!");
                return false;
            }else{
                if(email.length > 50){
                    alert("Email cannot be longer than 50 characters.");
                    return false;
                }
            }
        }
        if($scope.settings.feedbackReportEmailIds){
            if($scope.settings.feedbackReportEmailIds.length > 0){
                for(var i=0; i < $scope.settings.feedbackReportEmailIds.length;i++){
                    if($scope.settings.feedbackReportEmailIds[i] == email){
                        alert("Email is already exist..!!");
                        return false;
                    }
                }
            }
        }

		if(!$scope.settings.feedbackReportEmailIds) {
			$scope.settings.feedbackReportEmailIds = [];
		}
		$scope.settings.feedbackReportEmailIds.push(email);
		$scope.feedbackReportEmail = '';

	};

	$scope.removeFeedbackReportEmail = function(ind) {
		$scope.settings.feedbackReportEmailIds.splice(ind,1);
	};

	$scope.addReadingEmail = function() {
		var email = $scope.readingEmail;
        if(!email){
            alert("Please fill out the field..!!");
            return false;
        }else{
            if(!regex.test(email)){
                alert("Please enter valid email..!!");
                return false;
            }else{
                if(email.length > 50){
                    alert("Email cannot be longer than 50 characters.");
                    return false;
                }
            }
        }
        if($scope.settings.readingEmailIds){
            if($scope.settings.readingEmailIds.length > 0){
                for(var i=0; i < $scope.settings.readingEmailIds.length;i++){
                    if($scope.settings.readingEmailIds[i] == email){
                        alert("Email is already exist..!!");
                        return false;
                    }
                }
            }
        }

		if(!$scope.settings.readingEmailIds) {
			$scope.settings.readingEmailIds = [];
		}
		$scope.settings.readingEmailIds.push(email);
		$scope.readingEmail = '';
	};

	$scope.removeReadingEmail = function(index) {
		$scope.settings.readingEmailIds.splice(index,1);
	};

	$scope.addAssetBreakdownEmail = function() {
		var email = $scope.assetEmail;
        if(!email){
            alert("Please fill out the field..!!");
            return false;
        }else{
            if(!regex.test(email)){
                alert("Please enter valid email..!!");
                return false;
            }else{
                if(email.length > 50){
                    alert("Email cannot be longer than 50 characters.");
                    return false;
                }
            }
        }
        if($scope.settings.assetEmailIds){
            if($scope.settings.assetEmailIds.length > 0){
                for(var i=0; i < $scope.settings.assetEmailIds.length;i++){
                    if($scope.settings.assetEmailIds[i] == email){
                        alert("Email is already exist..!!");
                        return false;
                    }
                }
            }
        }

		if(!$scope.settings.assetEmailIds) {
			$scope.settings.assetEmailIds = [];
		}
		$scope.settings.assetEmailIds.push(email);
		$scope.assetEmail = '';
	};

	$scope.removeAssetEmail = function(index) {
		$scope.settings.assetEmailIds.splice(index,1);
	};

	//PPM Job alert
	$scope.addPPMEmail = function() {
		var email = $scope.ppmEmail;
        if(!email){
            alert("Please fill out the field..!!");
            return false;
        }else{
            if(!regex.test(email)){
                alert("Please enter valid email..!!");
                return false;
            }else{
                if(email.length > 50){
                    alert("Email cannot be longer than 50 characters.");
                    return false;
                }
            }
        }
        if($scope.settings.ppmEmailIds){
            if($scope.settings.ppmEmailIds.length > 0){
                for(var i=0; i < $scope.settings.ppmEmailIds.length;i++){
                    if($scope.settings.ppmEmailIds[i] == email){
                        alert("Email is already exist..!!");
                        return false;
                    }
                }
            }
        }

		if(!$scope.settings.ppmEmailIds) {
			$scope.settings.ppmEmailIds = [];
		}
		$scope.settings.ppmEmailIds.push(email);
		$scope.ppmEmail = '';
	};

	$scope.removePPMEmail = function(index) {
		$scope.settings.ppmEmailIds.splice(index,1);
	};

	//AMC Job alert
	$scope.addAMCEmail = function() {
		var email = $scope.amcEmail;
        if(!email){
            alert("Please fill out the field..!!");
            return false;
        }else{
            if(!regex.test(email)){
                alert("Please enter valid email..!!");
                return false;
            }else{
                if(email.length > 50){
                    alert("Email cannot be longer than 50 characters.");
                    return false;
                }
            }
        }
        if($scope.settings.amcEmailIds){
            if($scope.settings.amcEmailIds.length > 0){
                for(var i=0; i < $scope.settings.amcEmailIds.length;i++){
                    if($scope.settings.amcEmailIds[i] == email){
                        alert("Email is already exist..!!");
                        return false;
                    }
                }
            }
        }

		if(!$scope.settings.amcEmailIds) {
			$scope.settings.amcEmailIds = [];
		}
		$scope.settings.amcEmailIds.push(email);
		$scope.amcEmail = '';
	};

	$scope.removeAMCEmail = function(index) {
		$scope.settings.amcEmailIds.splice(index,1);
	};

	//Warranty Expire alert
	$scope.addWarrantyEmail = function() {
		var email = $scope.warrantyEmail;
        if(!email){
            alert("Please fill out the field..!!");
            return false;
        }else{
            if(!regex.test(email)){
                alert("Please enter valid email..!!");
                return false;
            }else{
                if(email.length > 50){
                    alert("Email cannot be longer than 50 characters.");
                    return false;
                }
            }
        }
        if($scope.settings.warrantyEmailIds){
            if($scope.settings.warrantyEmailIds.length > 0){
                for(var i=0; i < $scope.settings.warrantyEmailIds.length;i++){
                    if($scope.settings.warrantyEmailIds[i] == email){
                        alert("Email is already exist..!!");
                        return false;
                    }
                }
            }
        }

		if(!$scope.settings.warrantyEmailIds) {
			$scope.settings.warrantyEmailIds = [];
		}
		$scope.settings.warrantyEmailIds.push(email);
		$scope.warrantyEmail = '';
	};

	$scope.removeWarrantyEmail = function(index) {
		$scope.settings.warrantyEmailIds.splice(index,1);
	};

	$scope.addDayWiseReportEmail = function() {
		var email = $scope.dayWiseReportEmail;
        if(!email){
            alert("Please fill out the field..!!");
            return false;
        }else{
            if(!regex.test(email)){
                alert("Please enter valid email..!!");
                return false;
            }else{
                if(email.length > 50){
                    alert("Email cannot be longer than 50 characters.");
                    return false;
                }
            }
        }
        if($scope.settings.dayWiseReportEmailIds){
            if($scope.settings.dayWiseReportEmailIds.length > 0){
                for(var i=0; i < $scope.settings.dayWiseReportEmailIds.length;i++){
                    if($scope.settings.dayWiseReportEmailIds[i] == email){
                        alert("Email is already exist..!!");
                        return false;
                    }
                }
            }
        }

		if(!$scope.settings.dayWiseReportEmailIds) {
			$scope.settings.dayWiseReportEmailIds = [];
		}
		$scope.settings.dayWiseReportEmailIds.push(email);
		$scope.dayWiseReportEmail = '';
	};

	$scope.removeDayWiseReportEmail = function(ind) {
		$scope.settings.dayWiseReportEmailIds.splice(ind,1);
	};

	// Muster roll report alert
	$scope.addMusterRollEmail = function() {
		var email = $scope.musterRollEmail;
        if(!email){
            alert("Please fill out the field..!!");
            return false;
        }else{
            if(!regex.test(email)){
                alert("Please enter valid email..!!");
                return false;
            }else{
                if(email.length > 50){
                    alert("Email cannot be longer than 50 characters.");
                    return false;
                }
            }
        }
        if($scope.settings.musterRollEmailIds){
            if($scope.settings.musterRollEmailIds.length > 0){
                for(var i=0; i < $scope.settings.musterRollEmailIds.length;i++){
                    if($scope.settings.musterRollEmailIds[i] == email){
                        alert("Email is already exist..!!");
                        return false;
                    }
                }
            }
        }

		if(!$scope.settings.musterRollEmailIds) {
			$scope.settings.musterRollEmailIds = [];
		}
		$scope.settings.musterRollEmailIds.push(email);
		$scope.musterRollEmail = '';
	};

	$scope.removeMusterEmail = function(index) {
		$scope.settings.musterRollEmailIds.splice(index,1);
	};

	$scope.loadProjects = function () {
		console.log("Loading all projects")
		ProjectComponent.findAll().then(function (data) {
			console.log("Loading all projects")
			$scope.projects = data;
		});
	};
    $scope.siteSpin = false;
	$scope.loadSites = function () {
		//$scope.showLoader();
        $scope.sites = "";
		console.log('selected project - ' + JSON.stringify($scope.selectedProject));
		if($scope.selectedProject) {
            $scope.siteSpin = true;
			ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
				$scope.sites = data;
				//$scope.hideLoader();
                $scope.siteSpin = false;
			});
		}

		/*else {
			SiteComponent.findAll().then(function (data) {
				$scope.sites = data;
				$scope.hideLoader();

			});
		}*/
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

	$scope.settingsLoader = false;
	$scope.loadSettings = function() {
	    $scope.settingsLoadingStart();
		var projectId;
		var siteId;
		if($scope.selectedProject) {
			projectId = $scope.selectedProject.id;
		}else{
            projectId = 0;
        }
		if($scope.selectedSite) {
			siteId = $scope.selectedSite.id;
		}else{
            siteId = 0;
        }
		//$scope.showLoader();
        $scope.settingsLoader = true;
        //console.log('pId',projectId);
        //console.log('sId',siteId);
		SettingsComponent.findAll(projectId, siteId).then(function(data) {
			console.log('all settings response- '+ JSON.stringify(data));
			if(data) {
				$scope.settings = data;
			}
            $scope.settingsLoader = false;
            $scope.settingsLoadingStop();
			//$scope.hideLoader();
		}).catch(function () {
            $scope.settingsLoadingStop();
        });
	}

	$scope.showNotifications= function(position,alignment,color,msg){
		demo.showNotification(position,alignment,color,msg);
	}

	$scope.cancelSettings = function() {

        $scope.loadPageTop();

		//$location.path('/app_settings');

		$scope.selectedProject =null;

		$scope.selectedSite =null;

		$scope.settings = "";


	}

	//init load
	$scope.initLoad = function(){
		$scope.loadPageTop();


	}

        $scope.settingsLoadingStart = function(){

            $('.pageCenter').addClass('pageTopCenter');
            $('.pageTopCenter').show();
            $('.overlay').show();
            $scope.noscroll = true;


        }

        $scope.settingsLoadingStop = function(){

            //console.log("Calling loader");
            $('.pageTopCenter').hide();
            $('.pageCenter').removeClass('pageTopCenter');
            $('.overlay').hide();
            $scope.noscroll = false;



        }

});


