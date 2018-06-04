'use strict';

angular.module('timeSheetApp')
		    .controller(
				'AssetController',
				function($scope, $rootScope, $state, $timeout, AssetComponent,
						ProjectComponent,LocationComponent,SiteComponent,EmployeeComponent, $http, $stateParams,

						$location,PaginationComponent,AssetTypeComponent,ParameterConfigComponent,ParameterComponent,
                        ParameterUOMComponent,VendorComponent,ManufacturerComponent) {
                     


        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.pager = {};
        $scope.searchCriteria = {};
        $scope.pages = { currPage : 1};
        $scope.isEdit = !!$stateParams.id;
        $scope.selectedAsset = null;
        $scope.selectedProject = {};
        $scope.selectedSite = {};
        $scope.selectedBlock = {};
        $scope.selectedFloor = {};
        $scope.selectedZone = {};
        $scope.pageSort = 10;
        $scope.pager = {};
        $scope.assetGen ={};
        $scope.selectedConfig = null;
        $scope.selectedAssetType = {};
        $scope.selectedAssetGroup = {};
        $scope.selectedAssetStatus = {};
        $scope.selectedManufacturer = {};
        $scope.selectedServiceProvider = {};
         $scope.selectedServiceWarranty = {};
         $scope.selectedVendor = {};
        $scope.selectedConfigParam = null;
        $scope.selectedConfigUnit = null;

        $scope.asset = {};
       
        $scope.parameterConfig = {};

        $scope.assetType = {};

        $scope.assetGroup = {};

        $scope.parameter = {};

        $scope.consumptionMonitoringRequired = false;
        
        $scope.selectedClientFile;
        $scope.selectedPhotoFile;
        
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

        $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
        }



          $scope.loadProjects = function () {
            ProjectComponent.findAll().then(function (data) {
                console.log("Loading all projects")
                $scope.projects = data;
            });
        };

        $scope.loadManufacturer = function () {
            ManufacturerComponent.findAll().then(function (data) {
                console.log("Loading all Manufacturer -- " , data)
                $scope.manufacturers = data;
            });
        };

         $scope.loadVendor = function () {
            VendorComponent.findAll().then(function (data) {
                console.log("Loading all Vendor -- " , data)
                $scope.vendors = data;
            });
        };


           $scope.createAssetType = function () {
               AssetTypeComponent.create().then(function (data) {
                console.log("Loading all AssetType -- " , data)
                $scope.assetTypes = data;
            });
        };



         $scope.loadAssetType = function () {
            AssetTypeComponent.findAll().then(function (data) {
                console.log("Loading all AssetType -- " , data)
                $scope.assetTypes = data;
            });
        };

        $scope.loadAssetGroup = function () {
            AssetComponent.loadAssetGroup().then(function (data) {
                console.log("Loading all Asset Group -- " , data)
                $scope.assetGroups = data;
            });
        };

        $scope.loadSelectedProject = function(projectId) {
            ProjectComponent.findOne(projectId).then(function (data) {
                $scope.selectedProject = data;

            });
        };

        $scope.loadBlocks = function () {
                console.log('selected project -' + ($scope.selectedProject ? $scope.selectedProject.id : 0) + ', site -' + ($scope.selectedSite ? $scope.selectedSite.id : 0))
                var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
                LocationComponent.findBlocks(projectId,$scope.selectedSite.id).then(function (data) {
                    $scope.selectedBlock = null;
                $scope.blocks = data;
                 console.log("Loading all blocks -- " ,  $scope.blocks);
            });
        };


        $scope.loadFloors = function () {
                var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
                LocationComponent.findFloors(projectId,$scope.selectedSite.id,$scope.selectedBlock).then(function (data) {
                    $scope.selectedFloor = null;
                $scope.floors = data;
                console.log("Loading all floors -- " ,  $scope.floors);
            });
        };

        $scope.loadZones = function () {
                console.log('load zones - ' + $scope.selectedSite.id +',' +$scope.selectedBlock +','+$scope.selectedFloor);
                var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
                LocationComponent.findZones(projectId,$scope.selectedSite.id,$scope.selectedBlock, $scope.selectedFloor).then(function (data) {
                    $scope.selectedZone = null;
                    $scope.zones = data;
                    console.log('zones list',$scope.zones);
            });
        };


        $scope.loadAllSites = function () {
            SiteComponent.findAll().then(function (data) {
                $scope.selectedSite = null;
                $scope.sites = data;
                $scope.loadingStop();
            });
        };

        $scope.loadDepSites = function () {
            ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
                $scope.selectedSite = null;
                $scope.sitesList = data;
            });
        };

        $scope.initMaterialWizard();

        $scope.editAsset = function(){
        	$scope.loadAssetType();
        	AssetComponent.findById($stateParams.id).then(function(data){
        		$scope.asset=data;
        		console.log($scope.asset);
        		if($scope.asset.assetType) {
        			$scope.assetConfig = {};
        			$scope.assetConfig.assetTypeName = $scope.asset.assetType;
        			$scope.assetConfig.assetId = $stateParams.id;
         			AssetComponent.findByAssetConfig($scope.assetConfig).then(function(data){
                		console.log(data);
                		$scope.assetParameters = data;
                	});

        		}
        		/*$scope.asset.selectedSite = {id : data.siteId,name : data.siteName}
        		console.log($scope.selectedSite)*/
        	})
        }
        $scope.loadAssets = function(){
            $scope.clearFilter();
        	$scope.search();
        };

        $scope.isActiveAsc = 'code';
        $scope.isActiveDesc = '';

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveAsc = field;
            $scope.isActiveDesc = '';
            $scope.isAscOrder = true;
            //$scope.search();
            $scope.loadAssets();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
            //$scope.search();
            $scope.loadAssets();
        }

        $scope.searchFilter = function () {
            $scope.setPage(1);
            $scope.search();
         }

        $scope.search = function () {

            var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
          if(!$scope.searchCriteria) {

            var searchCriteria = {
                currPage : currPageVal
            }

            $scope.searchCriteria = searchCriteria;

           }

            $scope.searchCriteria.currPage = currPageVal;
            console.log('Selected Assets' + $scope.selectedLocation);

            if(!$scope.selectedAsset) {
                if($rootScope.searchCriteriaAssets) {
                    $scope.searchCriteria = $rootScope.searchCriteriaAssets;
                }else {
                    $scope.searchCriteria.findAll = true;
                }

            }else {
                if($scope.selectedAsset) {
                    $scope.searchCriteria.findAll = false;
                    $scope.searchCriteria.id = $scope.selectedAsset.id;

            }
            }
            console.log($scope.searchCriteria);
            //----
            if($scope.pageSort){
                $scope.searchCriteria.sort = $scope.pageSort;
            }

            if($scope.selectedColumn){

                $scope.searchCriteria.columnName = $scope.selectedColumn;
                $scope.searchCriteria.sortByAsc = $scope.isAscOrder;

            }else{
                $scope.searchCriteria.columnName ="id";
                $scope.searchCriteria.sortByAsc = true;
            }

             console.log("search criteria",$scope.searchCriteria);
                $scope.assets = '';
                $scope.assetsLoader = false;
                $scope.loadPageTop();

            AssetComponent.search().then(function (data) {
                $scope.assets = data;
                $scope.assetsLoader = true;
                /*
                    ** Call pagination  main function **
                */
                $scope.pager = {};
                $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                $scope.totalCountPages = data.totalCount;

                console.log("Pagination",$scope.pager);
                console.log("Asset List - ", data);

                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                $scope.loading = false;

                if($scope.assets && $scope.assets.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.assets.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10;

                }

            });
        };


         $scope.viewAsset = function(){

            var assetId = $stateParams.id;

            AssetComponent.findById(assetId).then(function(data){
                console.log("Asset details List==" + JSON.stringify(data));
                $scope.assetDetail= data;
            });
        };

        $scope.saveAsset = function () {
                $scope.error = null;
                $scope.success = null;
                $scope.errorSitesExists = null;
                $scope.errorProject = null;
                if(!$scope.selectedProject.id){
                    $scope.errorProject = "true";
                }else{
                    if($scope.selectedAssetType.id){
                       $scope.assetGen.assetType = $scope.selectedAssetType.id;
                    }

                     if($scope.selectedAssetGroup.id){
                        $scope.assetGen.assetGroup = $scope.selectedAssetGroup.id;
                     }

                     if($scope.selectedAssetStatus.id){
                        $scope.assetGen.assetStatus = $scope.selectedAssetStatus.id;
                     }
            
                     if($scope.selectedManufacturer.id){
                        $scope.assetGen.manufacturerId = $scope.selectedManufacturer.id;
                     }
                     if($scope.selectedServiceProvider.id){
                         $scope.assetGen.serviceProvider = $scope.selectedServiceProvider.id;
                     }
                     if($scope.selectedServiceWarranty.id){
                        $scope.assetGen.serviceWarranty = $scope.selectedServiceWarranty.id;
                     }
                     if($scope.selectedVendor.id){
                        $scope.assetGen.VendorId = $scope.selectedVendor.id;
                     }
                     if($scope.selectedSite.id){
                         $scope.assetGen.siteId = $scope.selectedSite.id;
                     }
                      if($scope.selectedProject.id){
                          $scope.assetGen.projectId = $scope.selectedProject.id;
                     }
                      if($scope.selectedBlock){
                          $scope.assetGen.block = $scope.selectedBlock;
                     }
                      if($scope.selectedFloor){
                          $scope.assetGen.floor = $scope.selectedFloor;
                     }
                      if($scope.selectedZone){
                         $scope.assetGen.zone = $scope.selectedZone;
                     }

                    console.log("Asset Create List -- ",$scope.assetGen);
                    AssetComponent.create($scope.assetGen).then(function() {
                        $scope.success = 'OK';
                        $scope.showNotifications('top','center','success','Asset Added');
                        $scope.selectedSite = null;
                        $scope.loadAssets();
                        $location.path('/assets');
                    }).catch(function (response) {
                        $scope.success = null;
                        console.log('Error - '+ response.data);
                        console.log('status - '+ response.status + ' , message - ' + response.data.message);
                        if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                                $scope.errorAssetsExists = 'ERROR';
                            $scope.showNotifications('top','center','danger','Asset Already Exists');

                            console.log($scope.errorAssetsExists);
                        } else {
                            $scope.showNotifications('top','center','danger','Error in creating Asset. Please try again later..');
                            $scope.error = 'ERROR';
                        }
                    });
                }

        };



        $scope.initPage=function (){
        	$scope.loadAllParameters();
        	$scope.loadAllParameterUOMs();
            $scope.loadAllSites();
        	if($scope.isEdit){
        	    console.log("edit asset")
        		$scope.editAsset();
        	}else {
        	}
        }



        /*$scope.saveAsset = function () {
        	$scope.error = null;
        	$scope.success =null;
        	if($scope.asset.selectedSite!=null){
        	    $scope.asset.siteId = $scope.asset.selectedSite.id;
        	    delete $scope.asset.selectedSite;
            }
        	console.log('asset details ='+ JSON.stringify($scope.asset));
        	//$scope.asset.assetStatus = $scope.selectedStatus.name;
        	var post = $scope.isEdit ? AssetComponent.update : AssetComponent.create
        	post($scope.asset).then(function () {
                $scope.success = 'OK';
            	$location.path('/assets');
            }).catch(function (response) {
                $scope.success = null;
                console.log('Error - '+ response.data);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                    $scope.errorProjectExists = 'ERROR';
                } else {
                    $scope.error = 'ERROR';
                }
            });;

        };*/


        $scope.refreshPage = function(){
               $scope.loadAssets();
        }

        $scope.deleteConfirm = function (asset){
        	$scope.deleteAssetId= asset.id;
        }

        $scope.deleteAsset = function () {
        	AssetComponent.remove($scope.deleteAssetId).then(function(){

            	$scope.success = 'OK';
            	$state.reload();
        	});
        };

        $scope.loadQRCode = function(assetId, qrCodeImage) {
            console.log("calling asset")
            if(assetId) {
                console.log("QR Code image - "+ qrCodeImage);
                var uri = '/api/asset/' + assetId +'/qrcode';
                var eleId = 'qrCodeImage';
                console.log('image element id -' + eleId);
                $http.get(uri).then(function (response) {
                    var ele = document.getElementById(eleId);
                    console.log('qrcode response - ' + response.data);
                    //ele.setAttribute('src',response.data);
                    $('.modal-body img').attr('src',response.data);
                }, function(response) {
                    var ele = document.getElementById('qrCodeImage');
                    ele.setAttribute('src',"//placehold.it/250x250");
                });
            }else {
                var ele = document.getElementById('qrCodeImage');
                ele.setAttribute('src',"//placehold.it/250x250");
            }
        };



        $scope.clearFilter = function() {
            $scope.selectedAsset = null;
            $scope.selectedProject = null;
            $scope.searchCriteria = {};
            $scope.selectedSite = null;
            $scope.selectedStatus = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            //$scope.search();
        };

        //init load
        $scope.initLoad = function(){

             $scope.loadPageTop();
             $scope.initPage();
             $scope.loadAssets();
             $scope.setPage(1);

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





        $scope.addAssetType = function () {
            console.log($scope.assetType);
            if($scope.assetType){
                console.log("Asset Type entered");
                AssetTypeComponent.create($scope.assetType).then(function (response) {
                    console.log(response);
                    $scope.assetType = {};
                    $scope.showNotifications('top','center','success','Asset Type Added Successfully');
                    $scope.loadAssetType();
                    

                })
            }else{
                console.log("Asset Type not entered");
            }


        };

        $scope.addAssetGroup = function () {

            console.log($scope.assetGroup);
            if($scope.assetGroup){
                console.log("Asset Group entered");
                AssetComponent.createAssetGroup($scope.assetGroup).then(function (response) {
                    console.log(response);
                    $scope.assetGroup = {};
                    $scope.showNotifications('top','center','success','Asset Group Added Successfully');
                    $scope.loadAssetGroup();

                })
            }else{
                console.log("Asset Group not entered");
            }


        };


        $scope.loadAssetConfig = function(type) {
        	ParameterConfigComponent.findByAssertType(type).then(function(data){
        		console.log(data);
        		$scope.assetConfigs = data;
        	});
        }

        $scope.deleteAssetConfig = function(id) {
        	AssetComponent.deleteConfigById(id).then(function(data){
        		console.log(data);
        	});
        }

        $scope.loadAllParameters = function() {
    		ParameterComponent.findAll().then(function (data) {
	            $scope.selectedParameter = null;
	            $scope.parameters = data;
    		});
        }

	    $scope.addParameter = function () {
	        console.log($scope.parameter.name);
	        if($scope.parameter){
	            console.log("Parameter entered");
	            ParameterComponent.create($scope.parameter).then(function (response) {
	                console.log(response);
	                $scope.parameter = null;
	                $scope.showNotifications('top','center','success','Parameter Added Successfully');
	                $scope.loadAllParameters();

	            })
	        }else{
	            console.log("Parameter not entered");
	        }
	    };

	    $scope.loadAllParameterUOMs = function() {
	    		ParameterUOMComponent.findAll().then(function (data) {
	            $scope.selectedParameterUOM = null;
	            $scope.parameterUOMs = data;
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
	                $scope.loadAllParameterUOMs();

	            })
	        }else{
	            console.log("Parameter UOM not entered");
	        }
	    };

	    $scope.saveAssetParamConfig = function () {
        	$scope.error = null;
        	$scope.success =null;
        	if($scope.asset.assetType){
        	    $scope.parameterConfig.assetType = $scope.asset.assetType;
        	    $scope.parameterConfig.assetId = $stateParams.id
        	}
        	if($scope.selectedParameter){
        	    $scope.parameterConfig.name = $scope.selectedParameter.name;
        	}
        	if($scope.selectedParameterUOM){
        	    $scope.parameterConfig.uom = $scope.selectedParameterUOM.uom;
        	}
        	$scope.parameterConfig.consumptionMonitoringRequired  = $scope.consumptionMonitoringRequired
        	console.log('parameterConfig details ='+ JSON.stringify($scope.parameterConfig));
        	AssetComponent.createAssetParamConfig($scope.parameterConfig).then(function () {
                $scope.success = 'OK';
                $scope.showNotifications('top','center','success','Asset Parameter Saved Successfully');
                $scope.editAsset();
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
	    
	    $scope.uploadAsset = { };
	    
	    $scope.uploadAssetFile = function() {  
	    	console.log($scope.selectedClientFile);
	    	console.log($scope.uploadAsset.title);
	     	if($scope.selectedClientFile) {
	        	console.log('selected asset file - ' + $scope.selectedClientFile);
	        	$scope.uploadAsset.uploadFile = $scope.selectedClientFile;
	        	$scope.uploadAsset.assetId = 1;
	        	console.log($scope.uploadAsset);
	        	AssetComponent.uploadAssetFile($scope.uploadAsset).then(function(data){
	        		console.log(data);
	        	},function(err){
	        		console.log('Import error');
	        		console.log(err);
	        	});
        	} else {
        		console.log('select a file');
        	}
	    	
	    }


    });
