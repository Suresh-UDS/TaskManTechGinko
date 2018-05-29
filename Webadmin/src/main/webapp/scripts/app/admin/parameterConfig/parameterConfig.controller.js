'use strict';

angular.module('timeSheetApp')
		    .controller(
				'ParameterConfigController',
				function($scope, $rootScope, $state, $timeout, ParameterConfigComponent,AssetTypeComponent,
						$http, $stateParams,
						$location) {
        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.pager = {};
        $scope.searchCriteria = {};
        $scope.pages = { currPage : 1};
        $scope.isEdit = !!$stateParams.id;

        console.log($stateParams)
                    var that =  $scope;

        $scope.calendar = {
            actualStart : false,
            actualEnd : false,
            plannedStart : false,
            plannedEnd : false,
        };

        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();


        };

        $scope.initCalender();

        demo.initFullCalendar();

        $scope.openCalendar = function(e,cmp) {
            e.preventDefault();
            e.stopPropagation();

            that.calendar[cmp] = true;
        };

        $scope.initMaterialWizard = function(){

            demo.initMaterialWizard();


        }


        $scope.initMaterialWizard();
        
        $scope.loadAllAssetTypes = function() {
        		AssetTypeComponent.findAll().then(function (data) {
                $scope.selectedAssetType = null;
                $scope.assetTypes = data;
                $scope.loadingStop();
            });
        }
        
        $scope.getParameterConfigDetails = function(id, mode) {
        		$scope.isEdit = (mode == 'edit' ? true : false)
            ParameterConfigComponent.findById(id).then(function (data) {
                $scope.parameterConfig = data;
            });
        };

        $scope.editParameterConfig = function(){
        		ParameterConfigComponent.findById($stateParams.id).then(function(data){
	        		$scope.parameterConfig=data;
	        		console.log($scope.parameterConfig);
	        	})
        };
        
        $scope.loadParameterConfigs = function(){
        		$scope.search();
        };

        $scope.search = function () {
            var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
            var searchCriteria = {
                currPage : currPageVal
            }
            $scope.searchCriteria = searchCriteria;
            // }

            $scope.searchCriteria.currPage = currPageVal;
            console.log('Selected  name -' + $scope.selectedName);
            console.log('Selected  asset type  -' + $scope.selectedAssetType);
            console.log('search criteria - '+JSON.stringify($rootScope.searchCriteriaParameterConfig));
            if(!$scope.selectedName && !$scope.selectedAssetType) {
            		$scope.searchCriteria.findAll = true;
            }
            console.log($scope.searchCriteria);
            ParameterConfigComponent.search($scope.searchCriteria).then(function (data) {
                console.log(data);
                $scope.parameterConfigs = data.transactions;
                $scope.parameterConfigsLoader = true;
                $scope.loadingStop();
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                if($scope.parameterConfigs == null){
                    $scope.pages.startInd = 0;
                }else{
                    $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
                }

                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
                $scope.pages.totalCnt = data.totalCount;

            });

            if($scope.pages.currPage == 1) {
                $scope.firstStyle();
            }
        };



        $scope.initPage=function (){

            $scope.loadAllAssetTypes();
        		if($scope.isEdit){
        			console.log("edit parameterConfig")
        			$scope.editParameterConfig();
        		}else {
        		}
        }



        $scope.saveParameterConfig = function () {
	        	$scope.error = null;
	        	$scope.success =null;
	        	if(!$scope.selectedAssetType){
	        	    $scope.parameterConfig.assetType = $scope.selectedAssetType.name;
	        }
	        	console.log('parameterConfig details ='+ JSON.stringify($scope.parameterConfig));
	        	var post = $scope.isEdit ? ParameterConfigComponent.update : ParameterConfigComponent.create
	        	post($scope.parameterConfig).then(function () {
	                $scope.success = 'OK';
	                $location.path('/parameterConfig-list');
	            }).catch(function (response) {
	                $scope.success = null;
	                console.log('Error - '+ response.data);
	                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
	                    $scope.errorProjectExists = 'ERROR';
	                } else {
	                    $scope.error = 'ERROR';
	                }
	            });;

        };


        $scope.refreshPage = function(){
            $scope.clearFilter();
            // $scope.loadParameterConfigs();
        }

        $scope.deleteConfirm = function (parameterConfig){
        		$scope.deleteParameterConfigId= parameterConfig.id;
        }

        $scope.deleteParameterConfig = function () {
        		ParameterConfigComponent.remove($scope.deleteParameterConfigId).then(function(){
	            	$scope.success = 'OK';
	            	$state.reload();
	        	});
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
            $scope.selectedProject = null;
            $scope.searchCriteria = {};
            $scope.selectedSite = null;
            $scope.selectedStatus = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            $scope.search();
        };

        // init load
        $scope.initLoad = function(){ 
             $scope.loadPageTop(); 
             $scope.initPage(); 
          
         }
    });
