'use strict';

angular.module('timeSheetApp')
		    .controller(
				'ParameterConfigController',
				function($scope, $rootScope, $state, $timeout, ParameterConfigComponent,ParameterComponent,
                 ParameterUOMComponent, AssetTypeComponent,AssetComponent,
						$http, $stateParams,
						$location,PaginationComponent) {
        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.pager = {};
        $scope.searchCriteria = {};
        $scope.pages = { currPage : 1};
        $scope.isEdit = !!$stateParams.id;
        
        $scope.parameterConfig = {};
        
        $scope.assetType = {};
        
        $scope.assetParam = {};

        $scope.parameterUOM = {};

        $scope.selectedAssetType = {};
        $scope.selectedParameter = {};
        $scope.selectedParameterUOM = {};
        
        $scope.consumptionMonitoringRequired = {value:false};
        $scope.alertRequired = {value: true};
        $scope.validationRequired = {value: true};
        
        $scope.selectedThreshold;
        $scope.btnDisabled = false;

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
        
        $scope.loadAssetTypes = function() {

        		AssetTypeComponent.findAll().then(function (data) {
                $scope.selectedAssetType = null;
                $scope.assetTypes = data;
                $scope.loadingStop();
            });
        }

        $scope.addAssetType = function () {
 
            console.log($scope.assetType);
            if($scope.assetType){
                console.log("Asset Type entered");
                AssetTypeComponent.create($scope.assetType).then(function (response) {
                    console.log(response);
                    $scope.assetType = {};
                    $scope.showNotifications('top','center','success','Asset Type Added Successfully');
                    $scope.loadAssetTypes();
                    

                })
            }else{
                console.log("Asset Type not entered");
            }


        }
        
      
        
        $scope.loadAssetParams = function() {
        		ParameterComponent.findAll().then(function (data) {
	            $scope.selectedParameter = null;
	            $scope.parameters = data;
	            $scope.loadingStop();
	        });
	    }
	    
	    $scope.addAssetParam = function () {
	        console.log($scope.assetParam.name);
	        if($scope.assetParam){
	            console.log("Parameter entered");
	            ParameterComponent.create($scope.assetParam).then(function (response) {
	                console.log(response);
	                $scope.parameter = null;
	                $scope.showNotifications('top','center','success','Parameter Added Successfully');
	                $scope.loadAssetParams();
	
	            })
	        }else{
	            console.log("Parameter not entered");
	        }
	    }
	    
        $scope.loadAssetParamUoms = function() {
	    		ParameterUOMComponent.findAll().then(function (data) {
	            $scope.selectedParameterUOM = null;
	            $scope.parameterUOMs = data;
	            $scope.loadingStop();
	        });
	    }
	    
	    $scope.addParameterUOM = function () {
	        console.log($scope.parameterUOM.name);
	        if($scope.parameterUOM){
	            console.log("ParameterUOM entered");
	            ParameterUOMComponent.create($scope.parameterUOM).then(function (response) {
	                console.log(response);
	                $scope.parameterUOM = null;
	                $scope.showNotifications('top','center','success','Parameter UOM Added Successfully');
	                $scope.loadAssetParamUoms();
	
	            })
	        }else{
	            console.log("Parameter UOM not entered");
	        }
	    };
        
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
            $scope.clearFilter();
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
            $scope.searchCriteria.findAll = true;

            
            console.log("search criteria",$scope.searchCriteria);
                     $scope.parameterConfigs = '';
                     $scope.parameterConfigsLoader = false;
                     $scope.loadPageTop();
            ParameterConfigComponent.search($scope.searchCriteria).then(function (data) {
                $scope.parameterConfigs = data.transactions;
                $scope.parameterConfigsLoader = true;
                $scope.loadingStop();

                /*
                    ** Call pagination  main function **
                */
                 $scope.pager = {};
                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                 $scope.totalCountPages = data.totalCount;

                console.log("Pagination",$scope.pager);
                console.log('Parameter Configs search result list -' + JSON.stringify($scope.parameterConfigs));
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;

                if($scope.parameterConfigs && $scope.parameterConfigs.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.parameterConfigs.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10;
                }
           

            });

       
        }



        $scope.initPage=function (){

            /*$scope.loadAllAssetTypes();
            $scope.loadAllParameters();
            $scope.loadAllParameterUOMs();*/
        		if($scope.isEdit){
        			console.log("edit parameterConfig")
        			$scope.editParameterConfig();
        		}else {
        		}
        }



        $scope.saveParameterConfig = function () {
                $scope.btnDisabled = true;
	        	$scope.error = null;
	        	$scope.success =null;
	        	if($scope.selectedAssetType){
	        	    $scope.parameterConfig.assetType = $scope.selectedAssetType.name;
	        	}
	        	if($scope.selectedParameter){
	        	    $scope.parameterConfig.name = $scope.selectedParameter.name;
	        	}
	        	if($scope.selectedParameterUOM){
	        	    $scope.parameterConfig.uom = $scope.selectedParameterUOM.uom;
	        	}
	        	if($scope.selectedThreshold){
	        		$scope.parameterConfig.threshold = $scope.selectedThreshold;
	        	}
	        	if($scope.selectedRule){
	        		$scope.parameterConfig.rule = $scope.selectedRule;
	        	}

	        	$scope.parameterConfig.consumptionMonitoringRequired  = $scope.consumptionMonitoringRequired.value;
	        	$scope.parameterConfig.validationRequired = $scope.validationRequired.value;
	        	$scope.parameterConfig.alertRequired = $scope.alertRequired.value;
	        	console.log('parameterConfig details ='+ JSON.stringify($scope.parameterConfig));
	        	//var post = $scope.isEdit ? ParameterConfigComponent.update : ParameterConfigComponent.create
                //post($scope.parameterConfig).then(function () {
            
	        	ParameterConfigComponent.create($scope.parameterConfig).then(function () {
	                $scope.success = 'OK';
	                $scope.showNotifications('top','center','success','Parameter Configuration Saved Successfully');
                    $scope.loadParameterConfigs();
                    $scope.parameterConfig = {};
                    $scope.selectedAssetType ={};
                    $scope.selectedParameter ={};
                    $scope.selectedParameterUOM ={};
                    $scope.selectedRule ={};
                    $scope.btnDisabled = false;
                    $scope.selectedThreshold =null;
                    $scope.validationRequired.value =false;
                    $scope.consumptionMonitoringRequired.value =false;

	                //$location.path('/parameter-config');
	            }).catch(function (response) {
                    $scope.btnDisabled = false;
	                $scope.success = null;
	                console.log('Error - '+ response.data);
	                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                        $scope.showNotifications('top','center','danger','Parameter already  exists');
	                    $scope.errorProjectExists = 'ERROR';
	                } else {
                        $scope.showNotifications('top','center','danger','Unable to create Parameter Configuration');
	                    $scope.error = 'ERROR';
	                }
	            });

        }


        $scope.refreshPage = function(){
             $scope.loadParameterConfigs();
        }

        $scope.deleteConfirm = function (id){
        		$scope.deleteParamConId= id;

        }

        $scope.deleteParameterConfig = function () {

        		ParameterConfigComponent.remove($scope.deleteParamConId).then(function(){
	            	$scope.success = 'OK';
                    $scope.initLoad();
	            	$scope.loadParameterConfigs();
	        	});
        }

      
        $scope.loadAllRules = function() {
        	AssetComponent.getAllRules().then(function(data) {
        		console.log(data);
        		$scope.readingRules = data;
        	});
        }
        

        $scope.clearFilter = function() {
            $scope.selectedProject = null;
            $scope.searchCriteria = {};
            $scope.selectedSite = null;
            $scope.selectedStatus = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            //$scope.search();
        }

        // init load
        $scope.initLoad = function(){ 
             $scope.loadPageTop(); 
             $scope.initPage(); 
          
         }
        
        var nottifShow = true ;

        $scope.showNotifications= function(position,alignment,color,msg){
           
            if(nottifShow == true){
               nottifShow = false ;
               demo.showNotification(position,alignment,color,msg);
               
            }else if(nottifShow == false){
                $timeout(function() {
                  nottifShow = true ;
                }, 8000);

            }
            
        }

         /*
        
        ** Pagination init function **
        @Param:integer

        */

        $scope.setPage = function (page) {

            if (page < 1 || page > $scope.pager.totalPages) {
                return;
            }
            //alert(page);
            $scope.pages.currPage = page;
            $scope.search();
        }

        
    });
