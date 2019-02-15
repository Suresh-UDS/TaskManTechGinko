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
        $scope.selectedRule ="";

        $scope.consumptionMonitoringRequired = {value:false};
        $scope.alertRequired = {value: true};
        $scope.validationRequired = {value: true};

        $scope.selectedThreshold;
        $scope.btnDisabled = false;
        $scope.noData = false;


                    $scope.conform = function(text)
                    {
                      //console.log($scope.selectedProject)
                        $rootScope.conformText = text;
                        $('#conformationModal').modal();
                    }
                    $rootScope.back = function (text) {
                        if(text == 'cancel')
                        {
                            $scope.cancel();
                        }
                        else if(text == 'save')
                        {
                            $scope.saveParameterConfig();
                        }
                    };
      //console.log($stateParams)
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

        //demo.initFullCalendar();

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

              //console.log('Asset type list',$scope.assetTypes);

                $scope.loadingStop();
            });
        }

        $scope.addAssetType = function () {

          //console.log($scope.assetType);
            $scope.loadingStart();
            if($scope.assetType){
              //console.log("Asset Type entered");
                AssetTypeComponent.create($scope.assetType).then(function (response) {
                  //console.log(response);
                    $scope.assetType = {};
                    $scope.showNotifications('top','center','success','Asset Type Added Successfully');
                    $scope.loadAssetTypes();


                }).catch(function(){
                   $scope.loadingStop();
                });
            }else{
              //console.log("Asset Type not entered");
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
	      //console.log($scope.assetParam.name);
             $scope.loadingStart();
	        if($scope.assetParam){
	          //console.log("Parameter entered");
	            ParameterComponent.create($scope.assetParam).then(function (response) {
	              //console.log(response);
	                $scope.parameter = null;
	                $scope.showNotifications('top','center','success','Parameter Added Successfully');
	                $scope.loadAssetParams();

	            }).catch(function(){
                    $scope.loadingStop();
                });
	        }else{
	          //console.log("Parameter not entered");
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
	      //console.log($scope.parameterUOM.name);
             $scope.loadingStart();
	        if($scope.parameterUOM){
	          //console.log("ParameterUOM entered");
	            ParameterUOMComponent.create($scope.parameterUOM).then(function (response) {
	              //console.log(response);
	                $scope.parameterUOM = null;
	                $scope.showNotifications('top','center','success','Parameter UOM Added Successfully');
	                $scope.loadAssetParamUoms();

	            }).catch(function(){
                    $scope.loadingStop();
                });
	        }else{
	          //console.log("Parameter UOM not entered");
	        }
	    };

        $scope.getParameterConfigDetails = function(id, mode) {
                $rootScope.loadPageTop();
                $rootScope.loadingStart();
        		$scope.isEdit = (mode == 'edit' ? true : false)
            ParameterConfigComponent.findById(id).then(function (data) {
                $scope.parameterConfig = data;
              //console.log('Parameter by id',$scope.parameterConfig);
                $scope.selectedAssetType = {name:$scope.parameterConfig.assetType};
                $scope.selectedParameter = {name:$scope.parameterConfig.name};
                $scope.selectedParameterUOM = {uom:$scope.parameterConfig.uom};
                $scope.selectedRule = $scope.parameterConfig.rule;
                $scope.selectedThreshold = $scope.parameterConfig.threshold;
                $scope.validationRequired.value = $scope.parameterConfig.validationRequired;
                $scope.consumptionMonitoringRequired.value = $scope.parameterConfig.consumptionMonitoringRequired;
                $scope.alertRequired.value = $scope.parameterConfig.alertRequired;
                $rootScope.loadingStop();

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


          //console.log("search criteria",$scope.searchCriteria);
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

              //console.log("Pagination",$scope.pager);
              //console.log('Parameter Configs search result list -' + JSON.stringify($scope.parameterConfigs));
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;

                if($scope.parameterConfigs && $scope.parameterConfigs.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.parameterConfigs.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10;
                    $scope.noData = false;

                }else{
                     $scope.noData = true;
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
                $scope.saveLoad = true;
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
	        	var post = $scope.isEdit ? ParameterConfigComponent.update : ParameterConfigComponent.create
                post($scope.parameterConfig).then(function () {

	        	//ParameterConfigComponent.create($scope.parameterConfig).then(function () {
	                $scope.success = 'OK';
                    $scope.saveLoad = false;
                    if(!$scope.isEdit){

                    $scope.showNotifications('top','center','success','Parameter Configuration Saved Successfully');

                    }else{

                    $scope.showNotifications('top','center','success','Parameter Configuration Updated Successfully');

                    }

                    $scope.loadParameterConfigs();
                    $scope.parameterConfig = {};
                    $scope.selectedAssetType =null;
                    $scope.selectedParameter =null;
                    $scope.selectedParameterUOM =null;
                    $scope.selectedRule ="";
                    $scope.selectedThreshold =null;
                    $scope.validationRequired.value =false;
                    $scope.consumptionMonitoringRequired.value =false;
                    $scope.btnDisabled = false;

	                //$location.path('/parameter-config');
	            }).catch(function (response) {
                    $scope.saveLoad = false;
                    $scope.btnDisabled = false;
	                $scope.success = null;
	              //console.log('Error - '+ response.data);
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
                $scope.loadingStart();
        		ParameterConfigComponent.remove($scope.deleteParamConId).then(function(){
	            	$scope.success = 'OK';
	            	$scope.showNotifications('top','center','success','Parameter Configuration Deleted Successfully..!!');
                    $scope.initLoad();
	            	$scope.loadParameterConfigs();
                    $scope.loadingStop();
	        	}).catch(function(){
	        	    $scope.showNotifications('top','center','danger','Unable To Delete Parameter Configuration.');
	        	    $scope.loadingStop();
	        	});
        }


        $scope.loadAllRules = function() {
        	AssetComponent.getAllRules().then(function(data) {
        		console.log('Reading rules--',data);
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

         $scope.cancel = function() {
                $scope.selectedAssetType = "";
                $scope.selectedParameter = {};
                $scope.selectedParameterUOM = {};
                $scope.selectedRule = "";
                $scope.selectedThreshold =null;
                $scope.validationRequired.value = false;
                $scope.consumptionMonitoringRequired.value = false;
                $scope.alertRequired.value = false;
                $scope.isEdit = false;
        }

        // init load
        $scope.initLoad = function(){
             $scope.loadPageTop();
             $scope.initPage();

         }

       /* var nottifShow = true ;

        $scope.showNotifications= function(position,alignment,color,msg){

            if(nottifShow == true){
               nottifShow = false ;
               demo.showNotification(position,alignment,color,msg);

            }else if(nottifShow == false){
                $timeout(function() {
                  nottifShow = true ;
                }, 8000);

            }

        }*/

        $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
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
