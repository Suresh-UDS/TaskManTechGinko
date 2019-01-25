'use strict';

angular.module('timeSheetApp')
    .controller('DeviceController', function ($rootScope, $scope, $state, $timeout, ProjectComponent, DeviceComponent,$http,$stateParams,$location) {
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorDeviceExists = null;

        //$timeout(function (){angular.element('[ng-model="name"]').focus();});

        $scope.selectedDevice;

        $scope.pages = { currPage : 1};

        $scope.saveDevice = function () {
        	//$scope.device.projectId = $scope.selectedProject.id;
        	DeviceComponent.createDevice($scope.device).then(function() {
            	$scope.success = 'OK';
            	$scope.loadDevices();
            	$location.path('/devices');
            }).catch(function (response) {
                $scope.success = null;
                console.log('Error - '+ response.data);
                console.log('status - '+ response.status + ' , message - ' + response.data.message);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                	$scope.$apply(function() {
                        $scope.errorDeviceExists = 'ERROR';
                	})
                    console.log($scope.errorDeviceExists);
                } else {
                    $scope.error = 'ERROR';
                }
            });;
        };

        $scope.cancelDevice = function () {
        	$location.path('/devices');
        };

        $scope.loadDevices = function () {
//        	DeviceComponent.findAll().then(function (data) {
//                $scope.devices = data;
//            });
        	$scope.search();

        };

        $scope.refreshPage = function() {
        	$scope.clearFilter();
        	$scope.loadDevices();
        }


        $scope.loadDevice = function() {
        	DeviceComponent.findOne($stateParams.id).then(function (data) {
                $scope.device = data;
            });

        };

        $scope.updateDevice = function () {
        	//$scope.device.projectId = $scope.selectedProject.id;
        	DeviceComponent.updateDevice($scope.device);
        	$scope.success = 'OK';
        	$location.path('/devices');
        };

        $scope.deleteConfirm = function (device){
        	console.log('...>>>delete confirm<<<');
        	$scope.confirmDevice = device;
        	console.log(device);

        }

        $scope.deleteDevice = function () {
        	/*$scope.device = device;*/
        	DeviceComponent.deleteDevice($scope.confirmDevice);
        	$scope.success = 'OK';
        	$state.reload();
        };

         $scope.search = function () {

        	var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
        	if(!$scope.searchCriteria) {
            	var searchCriteria = {
            			currPage : currPageVal
            	}
            	$scope.searchCriteria = searchCriteria;
        	}

        	$scope.searchCriteria.currPage = currPageVal;
        	console.log('Selected  Device -' + $scope.selectedDevice);
        	if(!$scope.selectedDevice) {
        		if($rootScope.searchCriteriaDevice) {
            		$scope.searchCriteria = $rootScope.searchCriteriaDevice;
        		}else {
        			$scope.searchCriteria.findAll = true;
        		}
        	}else if($scope.selectedDevice) {
        		$scope.searchCriteria.findAll = false;
	        	$scope.searchCriteria.deviceId = $scope.selectedDevice.id;
	        	$scope.searchCriteria.deviceUniqueId = $scope.selectedDevice.uniqueId;
	        	console.log('selected device id ='+ $scope.searchCriteria.deviceId);
	        	console.log($scope.searchCriteria);

        	}

        	DeviceComponent.search($scope.searchCriteria).then(function (data) {
                $scope.devices = data.transactions;
                console.log($scope.devices);
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                if($scope.devices == null){
                    $scope.pages.startInd = 0;
                }else{
                       $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
                }

                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
                $scope.pages.totalCnt = data.totalCount;
            	$scope.hide = true;
            });
        	$rootScope.searchCriteria = $scope.searchCriteria;
        	if($scope.pages.currPage == 1) {
            	$scope.firstStyle();
        	}
        };


        $scope.first = function() {
        	if($scope.pages.currPage > 1) {
            	$scope.pages.currPage = 1;
            	$scope.firstStyle();
            	$scope.search();
        	}
        };

        $scope.firstStyle = function() {
       	 var ele = angular.element('#first');
    	 ele.addClass('disabledLink');
    	 ele = angular.element('#previous');
    	 ele.addClass('disabledLink');
    	 if($scope.pages.totalPages > 1) {
 	       	 var ele = angular.element('#next');
	    	 ele.removeClass('disabledLink');
	    	 ele = angular.element('#last');
	    	 ele.removeClass('disabledLink');
    	 }

        }

        $scope.previous = function() {
        	if($scope.pages.currPage > 1) {
            	$scope.pages.currPage = $scope.pages.currPage - 1;
            	if($scope.pages.currPage == 1) {
	       	       	 var ele = angular.element('#first');
	    	    	 ele.addClass('disabled');
	    	    	 ele = angular.element('#previous');
	    	    	 ele.addClass('disabled');
            	}
     	       	 var ele = angular.element('#next');
    	    	 ele.removeClass('disabled');
    	    	 ele = angular.element('#last');
    	    	 ele.removeClass('disabled');
	    		$scope.search();
        	}

        };

        $scope.next = function() {
        	if($scope.pages.currPage < $scope.pages.totalPages) {
            	$scope.pages.currPage = $scope.pages.currPage + 1;
            	if($scope.pages.currPage == $scope.pages.totalPages) {
	       	       	 var ele = angular.element('#next');
	    	    	 ele.addClass('disabled');
	    	    	 ele = angular.element('#last');
	    	    	 ele.addClass('disabled');
            	}
     	       	 var ele = angular.element('#first');
    	    	 ele.removeClass('disabled');
    	    	 ele = angular.element('#previous');
    	    	 ele.removeClass('disabled');
	    		$scope.search();
        	}

        };

        $scope.last = function() {
        	if($scope.pages.currPage < $scope.pages.totalPages) {
            	$scope.pages.currPage = $scope.pages.totalPages;
            	if($scope.pages.currPage == $scope.pages.totalPages) {
	       	       	 var ele = angular.element('#next');
	    	    	 ele.addClass('disabled');
	    	    	 ele = angular.element('#last');
	    	    	 ele.addClass('disabled');
            	}
      	       	var ele = angular.element('#first');
    	    	ele.removeClass('disabled');
    	    	ele = angular.element('#previous');
    	    	ele.removeClass('disabled');
    	    	$scope.search();
        	}

        };

        $scope.clearFilter = function() {
        	$scope.selectedDevice = null;
        	$scope.searchCriteria = {};
        	$rootScope.searchCriteriaDevice = null;
        	$scope.pages = {
        		currPage: 1,
        		totalPages: 0
        	}
        	$scope.search();
        };

    });
