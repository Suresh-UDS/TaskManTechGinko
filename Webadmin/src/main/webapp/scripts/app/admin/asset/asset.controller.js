'use strict';

angular.module('timeSheetApp')
		    .controller(
				'AssetController',
				function($scope, $rootScope, $state, $timeout, AssetComponent,
						ProjectComponent,LocationComponent,SiteComponent,EmployeeComponent, $http, $stateParams,
                     	$location,PaginationComponent,AssetTypeComponent,ParameterConfigComponent,ParameterComponent,
                        ParameterUOMComponent,VendorComponent,ManufacturerComponent,$sce,ChecklistComponent) {

        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.pager = {};
        $scope.searchCriteria = {};
        $scope.pages = { currPage : 1};
        $scope.isEdit = !!$stateParams.id;
        $scope.selectedAsset = {};
        $scope.selectedProject = {};
        $scope.selectedSite = {};
        $scope.selectedBlock = null;
        $scope.selectedFloor = null;
        $scope.selectedZone = null;
        $scope.pageSort = 10;
        $scope.assetGen ={};
        $scope.assetPPM ={};
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

        $scope.assetDetail = {};
       
        $scope.parameterConfig = {};

        $scope.assetType = {};

        $scope.assetGroup = {};

        $scope.parameter = {};

        $scope.manufacturer = {};
        $scope.vendor = {};

        $scope.consumptionMonitoringRequired = false;
        
        $scope.selectedClientFile;

        $scope.selectedPhotoFile;
        
        console.log("state params",$stateParams);
                    
        var that =  $scope;

        $scope.calendar = {
            actualStart : false,
            actualEnd : false,
            plannedStart : false,
            plannedEnd : false,
        }

        $scope.uploadAsset = {};
        
        $scope.uploadAssetPhoto = {};

        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();


        }

        $scope.initCalender();

        demo.initFullCalendar();

        $scope.openCalendar = function(e,cmp) {
            e.preventDefault();
            e.stopPropagation();

            that.calendar[cmp] = true;
        }

        $scope.initMaterialWizard = function(){

            demo.initMaterialWizard();


        }

        $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
        }

        $scope.savePPMSchedule = function (){
        	alert("save ppm schedule");
        	console.log(">> Title "+$scope.assetPPM.title);
        	console.log(">> checklist "+$scope.assetPPM.checklistId);
        	console.log(">> from date "+$scope.assetPPM.dateFilterFrom);
        	console.log(">> to date "+$scope.assetPPM.dateFilterTo);
        	console.log(">> frequency "+$scope.selectedFrequency);
        	console.log(">> time interval "+$scope.selectedTimeInterval);
        	console.log(">> freq occurrence "+$scope.selectedFrequnceyOccurrence);
        	$scope.assetPPM.startDate = $scope.assetPPM.dateFilterFrom;
        	$scope.assetPPM.endDate = $scope.assetPPM.dateFilterTo;
        	$scope.assetPPM.frequencyPrefix = $scope.selectedFrequency;
        	$scope.assetPPM.frequencyDuration = $scope.selectedTimeInterval;
        	$scope.assetPPM.frequency = $scope.selectedFrequnceyOccurrence;
        	console.log(">>> Asset id "+$scope.assetGen.id);
        	$scope.assetPPM.assetId = $scope.assetGen.id;
        	
        	AssetComponent.createPPM($scope.assetPPM).then(function(response) {
                console.log("Asset response",JSON.stringify(response));
                $scope.assetGen.id=response.data.id;
                $scope.success = 'OK';
                $scope.showNotifications('top','center','success','Asset Added');
                $scope.selectedSite = null;
                $scope.loadAssets();

                //$location.path('/assets');
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
        
        $scope.loadProjects = function () {
            ProjectComponent.findAll().then(function (data) {
                console.log("Loading all projects")
                $scope.projects = data;
            });
        }

        $scope.loadManufacturer = function () {
            ManufacturerComponent.findAll().then(function (data) {
                console.log("Loading all Manufacturer -- " , data);
                $scope.manufacturers = data;
            });
        }

        $scope.addManufacturer = function () {

            console.log("add manufacturer",$scope.manufacturer);
            if($scope.manufacturer){
                console.log("Manufacturer entered");
                ManufacturerComponent.create($scope.manufacturer).then(function (response) {
                    console.log(response);
                    $scope.manufacturer = {};
                    $scope.showNotifications('top','center','success','Manufacturer Added Successfully');
                    $scope.loadManufacturer();
                    

                })
            }else{
                console.log("Manufacturer not entered");
            }


        }

         $scope.loadVendor = function () {
            VendorComponent.findAll().then(function (data) {
                console.log("Loading all Vendor -- " , data)
                $scope.vendors = data;
            });
        }

        $scope.addVendor = function () {

            console.log("add vendor",$scope.vendor);
            if($scope.vendor){

                console.log("Asset Type entered");
                VendorComponent.create($scope.vendor).then(function (response) {
                    console.log(response);
                    $scope.vendor = {};
                    $scope.showNotifications('top','center','success','Vendor Added Successfully');
                    $scope.loadVendor();
                    

                })
            }else{
                console.log("Vendor not entered");
            }


        }


           $scope.createAssetType = function () {
               AssetTypeComponent.create().then(function (data) {
                console.log("Loading all AssetType -- " , data)
                $scope.assetTypes = data;
            });
        }



         $scope.loadAssetType = function () {
            AssetTypeComponent.findAll().then(function (data) {
                console.log("Loading all AssetType -- " , data)
                $scope.assetTypes = data;
            });
        }

        $scope.loadAssetGroup = function () {
            AssetComponent.loadAssetGroup().then(function (data) {
                console.log("Loading all Asset Group -- " , data)
                $scope.assetGroups = data;
            });
        }

        $scope.loadSelectedProject = function(projectId) {
            ProjectComponent.findOne(projectId).then(function (data) {
                $scope.selectedProject = data;

            });
        }

        $scope.loadBlocks = function () {
                console.log('selected project -' + ($scope.selectedProject ? $scope.selectedProject.id : 0) + ', site -' + ($scope.selectedSite ? $scope.selectedSite.id : 0))
                var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
                LocationComponent.findBlocks(projectId,$scope.selectedSite.id).then(function (data) {
                    $scope.selectedBlock = null;
                $scope.blocks = data;
                 console.log("Loading all blocks -- " ,  $scope.blocks);
            });
        }


        $scope.loadFloors = function () {
                var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
                LocationComponent.findFloors(projectId,$scope.selectedSite.id,$scope.selectedBlock).then(function (data) {
                    $scope.selectedFloor = null;
                $scope.floors = data;
                console.log("Loading all floors -- " ,  $scope.floors);
            });
        }

        $scope.loadZones = function () {
                console.log('load zones - ' + $scope.selectedSite.id +',' +$scope.selectedBlock +','+$scope.selectedFloor);
                var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
                LocationComponent.findZones(projectId,$scope.selectedSite.id,$scope.selectedBlock, $scope.selectedFloor).then(function (data) {
                    $scope.selectedZone = null;
                    $scope.zones = data;
                    console.log('zones list',$scope.zones);
            });
        }


        $scope.loadAllSites = function () {
            SiteComponent.findAll().then(function (data) {
                $scope.selectedSite = null;
                $scope.sites = data;
                $scope.loadingStop();
            });
        }

        $scope.loadDepSites = function () {
            ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
                $scope.selectedSite = null;
                $scope.sitesList = data;
            });
        }

        $scope.initMaterialWizard();

        $scope.editAsset = function(){
             //alert($stateParams.id);
            console.log($stateParams.id);
        	$scope.loadAssetType();
        	AssetComponent.findById($stateParams.id).then(function(data){

        		$scope.asset=data;

                console.log("Edit Asset--",$scope.asset);

                $scope.selectedAssetType ={name:$scope.asset.assetTypeName};
                $scope.selectedAssetGroup ={assetgroup:$scope.asset.assetGroupName};
                $scope.selectedSite ={name:$scope.asset.siteName};
                $scope.selectedBlock = $scope.asset.block;
                $scope.selectedFloor = $scope.asset.floor;
                $scope.selectedZone = $scope.asset.zone;
                $scope.selectedManufacturer = {name:$scope.asset.manufacturerName};
                $scope.selectedVendor = {id:$scope.asset.vendorId};
                if($scope.asset.siteId){   
                        LocationComponent.findBlocks(0,$scope.asset.siteId).then(function (data) {
                        $scope.selectedBlock = null;
                        $scope.blocks = data;
                         console.log("Loading all blocks -- " ,  $scope.blocks);
                    });
               
                       LocationComponent.findFloors(0,$scope.asset.siteId,$scope.asset.block).then(function (data) {
                        $scope.selectedFloor = null;
                        $scope.floors = data;
                        console.log("Loading all floors -- " ,  $scope.floors);
                    });

                       LocationComponent.findZones(0,$scope.asset.siteId,$scope.asset.block,$scope.asset.floor).then(function (data) {
                        $scope.selectedZone = null;
                        $scope.zones = data;
                        console.log('zones list',$scope.zones);
                   });
                }

                $scope.genQrCodes();
        		
        		/*if($scope.asset.assetType) {
        			$scope.assetConfig = {};
        			$scope.assetConfig.assetTypeName = $scope.asset.assetType;
        			$scope.assetConfig.assetId = $stateParams.id;
         			AssetComponent.findByAssetConfig($scope.assetConfig).then(function(data){
                		console.log(data);
                		$scope.assetParameters = data;
                	});

        		}*/
        		/*$scope.asset.selectedSite = {id : data.siteId,name : data.siteName}
        		console.log($scope.selectedSite)*/
        	})
        }

        
        
       

        /* Sorting functions*/

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

         $scope.loadAssets = function(){
            $scope.clearFilter();
            $scope.search();
        }

        $scope.searchFilter = function () {
            $scope.setPage(1);
            $scope.search();
         }

         /* Asset listing and searching function */

        $scope.search = function () {

           var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
            if(!$scope.searchCriteria) {
                var searchCriteria = {
                        currPage : currPageVal
                };
                $scope.searchCriteria = searchCriteria;
            }

            $scope.searchCriteria.currPage = currPageVal;
            $scope.searchCriteria.findAll = false;

            console.log('Selected Assets' + $scope.selectedLocation);

            if(!$scope.selectedAsset.id) {
            
                    $scope.searchCriteria.findAll = true;

            }else{

                if($scope.selectedAsset.id) {

                    $scope.searchCriteria.assetId = $scope.selectedAsset.id;

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

            AssetComponent.search($scope.searchCriteria).then(function (data) {
                $scope.assets = data.transactions;
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
        }

        /* View asset by id */

        $scope.viewAsset = function(){

            var assetId = $stateParams.id;
             $scope.assetDetail= {};

            AssetComponent.findById(assetId).then(function(data){
                console.log("Asset details List==" + JSON.stringify(data));
                $scope.assetDetail= data;
                $scope.assetConfig();

            });
        }

        $scope.assetConfig=function(){

             
            if($stateParams.id){ 
                alert($scope.assets.name);
               
                $scope.assetConfig.assetType = $scope.assetDetail.name;

                $scope.assetConfig.assetId = $stateParams.id;
            }
            else if($scope.assetGen.id){
               
                $scope.assetConfig.assetType = $scope.selectedAssetType.name;
                $scope.assetConfig.assetId = $scope.assetGen.id;
            }  
    
                    AssetComponent.findByAssetConfig($scope.assetConfig).then(function(data){
                        console.log(data);
                        $scope.assetParameters = data;
                    });

                
        }


        $('input#acquiredDate').on('dp.change', function(e){
                $scope.assetGen.acquiredDate = e.date._d;
        });

        $('input#dateFilterFrom').on('dp.change', function(e){
            $scope.assetPPM.dateFilterFrom = e.date._d;
        });
        
        $('input#dateFilterTo').on('dp.change', function(e){
            $scope.assetPPM.dateFilterTo = e.date._d;
        });
        
         /* Create and save asset */

        $scope.saveAsset = function () {
                $scope.error = null;
                $scope.success = null;
                $scope.errorSitesExists = null;
                $scope.errorProject = null;
                if(!$scope.selectedProject.id){
                    $scope.errorProject = "true";
                }else{
        
                    if($scope.selectedAssetType.id){ $scope.assetGen.assetType = $scope.selectedAssetType.id; }
                    if($scope.selectedAssetGroup.id){ $scope.assetGen.assetGroup = $scope.selectedAssetGroup.id;}
                    if($scope.selectedAssetStatus.id){ $scope.assetGen.assetStatus = $scope.selectedAssetStatus.id;}
                    if($scope.selectedManufacturer.id){$scope.assetGen.manufacturerId = $scope.selectedManufacturer.id;}
                    if($scope.selectedServiceProvider.id){$scope.assetGen.serviceProvider = $scope.selectedServiceProvider.id;}
                    if($scope.selectedServiceWarranty.id){$scope.assetGen.serviceWarranty = $scope.selectedServiceWarranty.id;}
                    if($scope.selectedVendor.id){$scope.assetGen.vendorId = $scope.selectedVendor.id;}
                    if($scope.selectedSite.id){$scope.assetGen.siteId = $scope.selectedSite.id;}
                    if($scope.selectedProject.id){$scope.assetGen.projectId = $scope.selectedProject.id;}
                    if($scope.selectedBlock){$scope.assetGen.block = $scope.selectedBlock;}
                    if($scope.selectedFloor){$scope.assetGen.floor = $scope.selectedFloor;}
                    if($scope.selectedZone){$scope.assetGen.zone = $scope.selectedZone;}

                    console.log("Asset Create List -- ",$scope.assetGen);
                    AssetComponent.create($scope.assetGen).then(function(response) {
                        console.log("Asset response",JSON.stringify(response));
                        $scope.assetGen.id=response.data.id;
                        $scope.success = 'OK';
                        $scope.showNotifications('top','center','success','Asset Added');
                        $scope.loadAssets();

                        //$location.path('/assets');

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

        }

        /* Create and save QR code */

       $scope.createQrCode= function(){  

        if(!$scope.assetGen.id){
            
          $scope.showNotifications('top','center','danger','Please create asset..');

          return false;
        }

        if($scope.assetGen.id){
            
            var qr = {id:$scope.assetGen.id,code:$scope.assetGen.assetcode}

            //alert("code:"  + qr.code + "id:" + qr.id);
            
            AssetComponent.createQr(qr).then(function(){

                $scope.success = 'OK';
                $scope.genQrCodes();
            });
        }

       }

       /* View QR code by asset id */

       $scope.genQrCodes= function(){ 

              if($scope.asset.id){
                var qr_id ={id:$scope.asset.id};
              }else if($scope.assetGen.assetId){
                var qr_id ={id:$scope.assetGen.id};
              }
              $rootScope.loadingStart();
              $scope.qr_img = "";

            AssetComponent.genQrCode(qr_id).then(function(response){
             $scope.qr_img = response;
             $rootScope.loadingStop();
                
            });
        
       }

       /* Update and save asset */

        $scope.updateAsset = function () {
        	$scope.error = null;
        	$scope.success =null;
        	if($scope.asset.selectedSite!=null){
        	    $scope.asset.siteId = $scope.asset.selectedSite.id;
        	    delete $scope.asset.selectedSite;
            }
        	console.log('Edit asset details ='+ JSON.stringify($scope.asset));

            return false;
        	//$scope.asset.assetStatus = $scope.selectedStatus.name;
        	//var post = $scope.isEdit ? AssetComponent.update : AssetComponent.create
        	AssetComponent.update($scope.asset).then(function () {

                $scope.success = 'OK';
                 $scope.showNotifications('top','center','success','Asset Added');
                 $scope.loadAssets();

            	$location.path('/assets');

            }).catch(function (response) {

                $scope.success = null;

                console.log('Error - '+ response.data);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                    $scope.errorProjectExists = 'ERROR';
                } else {
                    $scope.error = 'ERROR';
                }
            });

        };

         /* Asset init functions */

        $scope.initPage=function (){
            $scope.loadAllParameters();
            $scope.loadAllParameterUOMs();
            $scope.loadAllSites();
            $scope.getAllUploadedFiles();
            $scope.getAllUploadedPhotos();
            if($scope.isEdit){
                console.log("edit asset")
                $scope.editAsset();
            }else {
                console.log("add asset")
            }
        }


        $scope.refreshPage = function(){
               $scope.loadAssets();
        }

        $scope.deleteConfirm = function (asset){
        	$scope.deleteAssetId= asset;
        }

        $scope.deleteAsset = function () {
        	AssetComponent.remove($scope.deleteAssetId).then(function(){
                
            	$scope.success = 'OK';
            	$scope.loadAssets();
        	});
        };

        $scope.loadQRCode = function(assetId, qrCodeImage) {

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
            $scope.selectedAsset = {};
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


       
        /* Add asset type */ 

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


        }

         /* Add asset group */

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


        }

         /* Add asset parameter */

         $scope.addParameter = function () {

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
        }

        /* Add asset parameter UOM */

        $scope.addParameterUOM = function () {

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
        }


       /* $scope.loadAssetConfig = function(type) {
        	ParameterConfigComponent.findByAssetConfig(type).then(function(data){
        		console.log(data);
        		//$scope.assetConfigs = data;
                $scope.assetParameters = data;
        	});
        }*/

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

	   

	    $scope.loadAllParameterUOMs = function() {
	    		ParameterUOMComponent.findAll().then(function (data) {
	            $scope.selectedParameterUOM = null;
	            $scope.parameterUOMs = data;
	        });
	    }

	    

	    $scope.saveAssetParamConfig = function () {
        	$scope.error = null;
        	$scope.success =null;

            if($stateParams.id){
            	if($scope.asset.assetType){
            	    $scope.parameterConfig.assetType = $scope.asset.assetTypeName;
            	    $scope.parameterConfig.assetId = $stateParams.id;
            	}
            	if($scope.selectedParameter){
            	    $scope.parameterConfig.name = $scope.selectedParameter.name;
            	}
            	if($scope.selectedParameterUOM){
            	    $scope.parameterConfig.uom = $scope.selectedParameterUOM.uom;
            	}
            	$scope.parameterConfig.consumptionMonitoringRequired  = $scope.consumptionMonitoringRequired
            	console.log('Edit parameterConfig details ='+ JSON.stringify($scope.parameterConfig));
            }
            else if($scope.assetGen.id){

                $scope.parameterConfig.assetId = $scope.assetGen.id;

                if($scope.selectedAssetType.name){

                    $scope.parameterConfig.assetType = $scope.selectedAssetType.name;
       
                }
                if($scope.selectedParameter){

                    $scope.parameterConfig.name = $scope.selectedParameter.name;
                }
                if($scope.selectedParameterUOM){
                    $scope.parameterConfig.uom = $scope.selectedParameterUOM.uom;
                }
                $scope.parameterConfig.consumptionMonitoringRequired  = $scope.consumptionMonitoringRequired
                console.log('Add parameterConfig details ='+ JSON.stringify($scope.parameterConfig));
            }
        	AssetComponent.createAssetParamConfig($scope.parameterConfig).then(function () {
                $scope.success = 'OK';
                $scope.showNotifications('top','center','success','Asset Parameter Saved Successfully');
                $scope.assetConfig();
                //$scope.loadAllParameters();
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
	    

	    
	    $scope.getAllUploadedFiles = function() {
	    	var uploadObj = {};
	    	uploadObj.type = 'document';
	    	if($stateParams.id){ 
	    		uploadObj.assetId = $stateParams.id;
	    	}else{ 
	    		uploadObj.assetId = 1;
	    	}
	    	
	    	AssetComponent.getAllUploadedFiles(uploadObj).then(function(data){ 
	    		console.log(data);
	    		$scope.uploadFiles = data;
	    	});
	    }
	    
	    $scope.getAllUploadedPhotos = function() {

	    	var photoObj = {};
	    	photoObj.type = 'image';
	    	if($stateParams.id){ 
	    		photoObj.assetId = $stateParams.id;
	    	}else{ 
	    		photoObj.assetId = 1;
	    	}
	    	
	    	AssetComponent.getAllUploadedPhotos(photoObj).then(function(data){ 
	    		console.log(data);
	    		$scope.uploadAssetPhotos = data;
	    	});
	    }
	    
	    $scope.uploadAssetFile = function() { 
	     	if($scope.selectedClientFile) {
	        	console.log("file title - " + $scope.uploadAsset.title + "file name -" + $scope.selectedClientFile);
	        	$scope.uploadAsset.uploadFile = $scope.selectedClientFile;
	        	$scope.uploadAsset.assetId = 1;
	        	$scope.uploadAsset.type = 'document';
	        	console.log($scope.uploadAsset);
	        	AssetComponent.uploadAssetFile($scope.uploadAsset).then(function(data){
	        		console.log(data);
	        		if(data) { 
	        			$scope.uploadFiles.push(data);
		        		$scope.getAllUploadedFiles();
	        		}else{ 
	        			console.log('No data found!');
	        		}
	        		
	        	},function(err){
	        		console.log('Import error');
	        		console.log(err);
	        	});
        	} else {
        		console.log('select a file');
        	}
	    	
	    }
	    
	    $scope.uploadAssetPhoto = function() {  
	    	console.log($scope.selectedPhotoFile);
	    	console.log($scope.uploadAssetPhoto.title);
	     	if($scope.selectedPhotoFile) {
	        	console.log('selected asset file - ' + $scope.selectedPhotoFile);
	        	$scope.uploadAssetPhoto.uploadFile = $scope.selectedPhotoFile;
	        	$scope.uploadAssetPhoto.assetId = 1;
	        	$scope.uploadAssetPhoto.type = 'image';
	        	console.log($scope.uploadAssetPhoto);
	        	AssetComponent.uploadAssetPhoto($scope.uploadAssetPhoto).then(function(data){
	        		console.log(data);
	        		if(data) { 
	        			$scope.uploadAssetPhotos.push(data);
		        		$scope.getAllUploadedPhotos();
	        		}else{ 
	        			console.log('No data found!');
	        		}
	        		
	        	},function(err){
	        		console.log('Import error');
	        		console.log(err);
	        	});
        	} else {
        		console.log('select a file');
        	}
	    	
	    }
	    
        $scope.download = false;
	    
	    var mimes = {
		   "jpeg":"image/jpeg",
		   "jpg":"image/jpeg",
		   "pdf":"application/pdf",
		   "png":"image/png",
		   "csv":"text/csv",
		   "zip":"application/zip",
		   "xlsx": "application/x-msexcel",
		   "xls":"application/x-msexcel"
	    };
	    
	    $scope.showFile = function(docId, filename) { 
	    	console.log(docId);
	    	var document = {};
	    	document.id = docId;
	    	document.fileName = filename; 
	    	var fileExt = filename.split('.').pop();
	    	console.log(fileExt);
	    	AssetComponent.readFile(document).then(function(data){ 
	    		console.log(data);
	    		console.log(data.fileName);
	    		$scope.download = true;
	    		var mime;
	    		if( typeof(mimes[fileExt]) != "undefined" ) { 
	    			mime = mimes[fileExt];
					var file = new Blob([(data)], {type: mime});
					var fileURL = URL.createObjectURL(file);
					$scope.content = $sce.trustAsResourceUrl(fileURL);
	    		}else {
	    			mime = "text/html";
		    		var file = new Blob([(data)], {type: mime});
					var fileURL = URL.createObjectURL(file);
					$scope.content = $sce.trustAsResourceUrl(fileURL);
	    		}
	    				
	    		
	    	});
	    }
	    
	    $scope.amcSchedule = {};
	    $scope.selectedChecklist;
	    $scope.selectedFrequencyPrefix;
	    $scope.selectedFrequency;
	    $scope.selectedFreqDuration;
	    
	    $scope.frequencyPrefixies = ['Every', 'Monthly'];
	    
	    $scope.frequencyDurations= [1, 2, 3];
	    
	    $scope.frequencies = ['Hour', 'Day', 'Week', 'Fortnight', 'Month', 'Quarter', 'Half', 'Year'];
	    
	    $('input#dateFilterAmcFrom').on('dp.change', function(e){
            $scope.amcSchedule.startDate = e.date._d;
        });
        
        $('input#dateFilterAmcTo').on('dp.change', function(e){
            $scope.amcSchedule.endDate = e.date._d;
        });
	    
	    $scope.loadCheckList = function() { 
	    	ChecklistComponent.findAll().then(function(data){ 
	    		alert(data);
	    		$scope.checkLists = data;
	    	});
	    }
	    
	    
	    $scope.saveAmcSchedule = function() { 
	    	console.log($scope.selectedChecklist);
	    	if($scope.selectedChecklist){ 
	    		$scope.amcSchedule.checklistId = $scope.selectedChecklist.id;
	    	}
	    	if($scope.assetGen.id){ 
	    		$scope.amcSchedule.assetId = $scope.assetGen.id;
	    	}
	    	if($scope.selectedFrequencyPrefix) { 
	    		$scope.amcSchedule.frequencyPrefix = $scope.selectedFrequencyPrefix;
	    	}
	    	if($scope.selectedFrequency) { 
	    		$scope.amcSchedule.frequency = $scope.selectedFrequency;
	    	}
	    	if($scope.selectedFreqDuration) { 
	    		$scope.amcSchedule.frequencyDuration = $scope.selectedFreqDuration;
	    	}
	    	
	    	console.log($scope.amcSchedule);
	    	
	    	
	    }


    });
