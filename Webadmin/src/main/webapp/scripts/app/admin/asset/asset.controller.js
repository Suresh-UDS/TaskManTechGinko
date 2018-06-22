'use strict';

angular.module('timeSheetApp')
		    .controller(
				'AssetController',
				function($scope, $rootScope, $state, $timeout, AssetComponent,
						ProjectComponent,LocationComponent,SiteComponent,EmployeeComponent, $http, $stateParams,
                     	$location,PaginationComponent,AssetTypeComponent,ParameterConfigComponent,ParameterComponent,
                        ParameterUOMComponent,VendorComponent,ManufacturerComponent,$sce,ChecklistComponent,$filter,JobComponent) {

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
        $scope.selectedSites = {};
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
        $scope.assetEditDate = null;
        $scope.uploadFiles = [];
        $scope.uploadAssetPhotos = [];
        $scope.uploadObj = {};
        $scope.photoObj = {};
        $scope.uploadAsset = {}; 
        $scope.uploadAssetPhoto = {};
        $scope.amcScheduleList = {};
        $scope.ppmscheduleList ={};
        $scope.fileCount ='0';
        $scope.photoCount ='0';
        $scope.searchAssetName =null;
        $scope.searchAssetCode =null;
        $scope.searchAssetType ={};
        $scope.searchSite ={};
        $scope.searchProject ={};
        $scope.searchAssetGroup ={};
        $scope.searchAcquiredDateSer =null;
        $scope.ppmSearchCriteria = {};
        $scope.ppmFrom = null;
        $scope.ppmTo = null;
        $scope.amcFrom = null;
        $scope.amcTo = null;

        //scope.searchAcquiredDate = $filter('date')(new Date(), 'dd/MM/yyyy'); 
        $scope.searchAcquiredDate = "";


        $scope.asset = {};

        $scope.assetEdit = {};

        $scope.assetList = {};

        $scope.assetDetail = {};
       
        $scope.parameterConfig = {};

        $scope.assetType = {};

        $scope.assetGroup = {};

        $scope.assetConfigs ={};

        $scope.parameter = {};

        $scope.manufacturer = {};
        $scope.vendor = {};

        $scope.consumptionMonitoringRequired = false;
        
        $scope.selectedClientFile;

        $scope.selectedPhotoFile;
        
        console.log("state params",$stateParams);
                    
        var that =  $scope;
        $rootScope.exportStatusObj  ={};

        $scope.calendar = {
            actualStart : false,
            actualEnd : false,
            plannedStart : false,
            plannedEnd : false,
        }

       

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

        var nottifShow = true ;

        $scope.showNotifications= function(position,alignment,color,msg){
           
            if(nottifShow == true){
               nottifShow = false ;
               demo.showNotification(position,alignment,color,msg);
               
            }else if(nottifShow == false){
                $timeout(function() {
                  nottifShow = true ;
                }, 1000);

            }
            
        }



        $('input#dateFilterPpmFrom').on('dp.change', function(e){
            $scope.assetPPM.startDate = e.date._d;
            $scope.ppmFrom = $filter('date')(e.date._d, 'dd/MM/yyyy');
        });
        
        $('input#dateFilterPpmTo').on('dp.change', function(e){
            $scope.assetPPM.endDate = e.date._d;
            $scope.ppmTo = $filter('date')(e.date._d, 'dd/MM/yyyy');
        });

        $scope.savePPMSchedule = function (){
        	
        	console.log(" --- Create asset ppm ---" ,$scope.assetPPM.title);

            if(!$scope.assetGen.id && !$stateParams.id){
            
                  $scope.showNotifications('top','center','danger','Please create asset first..');

            }else{

                if($scope.assetGen.id){

                   $scope.assetPPM.assetId = $scope.assetGen.id;

                }else if($stateParams.id){

                     $scope.assetPPM.assetId = $stateParams.id;
                }
                if($scope.selectedEmployee){ 
                    $scope.assetPPM.empId = $scope.selectedEmployee.id;
                }
               
                if($scope.selectedChecklist){ 
                    $scope.assetPPM.checklistId = $scope.selectedChecklist.id;
                }
                
                if($scope.selectedFrequency) { 
                    $scope.assetPPM.frequencyPrefix = $scope.selectedFrequency;
                }
                if($scope.selectedFrequnceyOccurrence) { 
                    $scope.assetPPM.frequency = $scope.selectedFrequnceyOccurrence;
                }
                if($scope.selectedTimeInterval) { 
                    $scope.assetPPM.frequencyDuration = $scope.selectedTimeInterval;
                }
    	    	$scope.assetPPM.maintenanceType = 'PPM';
    	    	
                console.log("To be create PPM",$scope.assetPPM);

            	AssetComponent.createPPM($scope.assetPPM).then(function(response) {

                    //console.log("PPM schedule response",JSON.stringify(response));
              
                    $scope.success = 'OK';

                    $scope.showNotifications('top','center','success','PPM schedule Added');

                    $scope.assetPPM = {};
                    $scope.selectedChecklist = {};
                    $scope.selectedEmployee = {};
                    $scope.selectedFrequency = {};
                    $scope.selectedTimeInterval = {};
                    $scope.selectedFrequnceyOccurrence = {};
                    $scope.ppmFrom = "";
                    $scope.ppmTo = "";

                    $("#dateFilterPpmFrom").val("");
                    $("#dateFilterPpmTo").val("");
       
                    $scope.loadPPMSchedule();

                }).catch(function (response) {
                    $scope.success = null;
                    console.log('Error - '+ response.data);
                    console.log('status - '+ response.status + ' , message - ' + response.data.message);
                    if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                            $scope.errorAssetsExists = 'ERROR';
                        $scope.showNotifications('top','center','danger','PPM schedule Already Exists');

                        console.log($scope.errorAssetsExists);
                    } else {
                        $scope.showNotifications('top','center','danger','Error in creating PPM schedule. Please try again later..');
                        $scope.error = 'ERROR';
                    }
                });
            

            }
        }
            
        $scope.loadProjects = function () {
            ProjectComponent.findAll().then(function (data) {
                console.log("Loading all projects")
                $scope.projects = data;
            });
        }

        $scope.loadManufacturer = function () {
            ManufacturerComponent.findAll().then(function (data) {
                //console.log("Loading all Manufacturer -- " , data);
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
                //console.log("Loading all Vendor -- " , data)
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


         /*  $scope.createAssetType = function () {
               AssetTypeComponent.create().then(function (data) {
                console.log("Loading all AssetType -- " , data)
                $scope.assetTypes = data;
            });
        }*/



         $scope.loadAssetType = function () {
            AssetTypeComponent.findAll().then(function (data) {
                //console.log("Loading all AssetType -- " , data)
                 //$scope.selectedAssetType = null;
                $scope.assetTypes = data;
            });
        }

        $scope.loadAssetGroup = function () {
            AssetComponent.loadAssetGroup().then(function (data) {
                //console.log("Loading all Asset Group -- " , data)
                $scope.assetGroups = data;
            });
        }

        $scope.loadSelectedProject = function(projectId) {
            ProjectComponent.findOne(projectId).then(function (data) {
                $scope.selectedProject = data;

            });
        }

        $scope.loadBlocks = function () {
                console.log('selected project -' + ($scope.selectedProject ? $scope.selectedProject.id : 0) + ', site -' + ($scope.selectedSites ? $scope.selectedSites.id : 0))
                var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
                LocationComponent.findBlocks(0,$scope.selectedSites.id).then(function (data) {
                    $scope.selectedBlock = null;
                $scope.blocks = data;
                 console.log("Loading all blocks -- " ,  $scope.blocks);
            });
        }


        $scope.loadFloors = function () {
                var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
                LocationComponent.findFloors(0,$scope.selectedSites.id,$scope.selectedBlock).then(function (data) {
                    $scope.selectedFloor = null;
                $scope.floors = data;
                console.log("Loading all floors -- " ,  $scope.floors);
            });
        }

        $scope.loadZones = function () {
                console.log('load zones - ' + $scope.selectedSites.id +',' +$scope.selectedBlock +','+$scope.selectedFloor);
                var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
                LocationComponent.findZones(0,$scope.selectedSites.id,$scope.selectedBlock, $scope.selectedFloor).then(function (data) {
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
            if($scope.searchProject){
                ProjectComponent.findSites($scope.searchProject.id).then(function (data) {
                    $scope.searchSite = null;
                    $scope.sites = data;
                });
            }
        }

        $scope.initMaterialWizard();

        $scope.editAsset = function(){
             //alert($stateParams.id);
            console.log($stateParams.id);

        	AssetComponent.findById($stateParams.id).then(function(data){

        		$scope.assetList=data;

                console.log("--- Load asset ---",$scope.assetList);


                $scope.assetEdit.id = $scope.assetList.id;
                $scope.assetEdit.title = $scope.assetList.title;
                $scope.assetEdit.modelNumber = $scope.assetList.modelNumber;
                $scope.assetEdit.serialNumber =  $scope.assetList.serialNumber;
                $scope.assetEdit.acquiredDate = $scope.assetList.acquiredDate;
                $scope.assetEdit.acquiredDate1 = $scope.assetList.acquiredDate;
                $scope.assetEdit.purchasePrice = $scope.assetList.purchasePrice;
                $scope.assetEdit.currentPrice = $scope.assetList.currentPrice;
                $scope.assetEdit.estimatedDisposePrice = $scope.assetList.estimatedDisposePrice;
                $scope.assetEdit.vendorLocation = $scope.assetList.vendorLocation;
                $scope.selectedAssetType ={name:$scope.assetList.assetType};
                $scope.selectedAssetGroup ={assetgroup:$scope.assetList.assetGroup};
                $scope.selectedSites ={id:$scope.assetList.siteId,name:$scope.assetList.siteName};
                $scope.selectedBlock = $scope.assetList.block;
                $scope.selectedFloor = $scope.assetList.floor;
                $scope.selectedZone = $scope.assetList.zone;
                $scope.selectedManufacturer = {id:$scope.assetList.manufacturerId,name:$scope.assetList.manufacturerName};
                $scope.selectedVendor = {id:$scope.assetList.vendorId};
                if($scope.assetList.siteId){   
                        LocationComponent.findBlocks(0,$scope.assetList.siteId).then(function (data) {
                        //$scope.selectedBlock = null;
                        $scope.blocks = data;
                         console.log("Loading all blocks -- " ,  $scope.blocks);
                    });
               
                       LocationComponent.findFloors(0,$scope.assetList.siteId,$scope.assetList.block).then(function (data) {
                        //$scope.selectedFloor = null;
                        $scope.floors = data;
                        console.log("Loading all floors -- " ,  $scope.floors);
                    });

                       LocationComponent.findZones(0,$scope.assetList.siteId,$scope.assetList.block,$scope.assetList.floor).then(function (data) {
                        //$scope.selectedZone = null;
                        $scope.zones = data;
                        console.log('zones list',$scope.zones);
                   });
                }

                $scope.genQrCodes();

                $rootScope.loadingStop();

                $scope.assetConfig();

                $scope.loadEmployees();


        		
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

            console.log('Selected Asset' + $scope.searchAssetName);
            
            if(!$scope.searchAcquiredDate && jQuery.isEmptyObject($scope.searchProject) == true
             && jQuery.isEmptyObject($scope.searchSite) == true && 
                jQuery.isEmptyObject($scope.searchAssetGroup) == true &&
                 !$scope.searchAssetName && !$scope.searchAssetCode 
                &&  jQuery.isEmptyObject($scope.searchAssetType) == true) {
            
                    $scope.searchCriteria.findAll = true;

            }
            
                if($scope.searchAcquiredDate !="") {
                    if($scope.searchAcquiredDate != undefined){
                    $scope.searchCriteria.acquiredDate = $scope.searchAcquiredDateSer;
                    $scope.searchCriteria.findAll = false;
                   }else{
                    $scope.searchCriteria.acquiredDate = "";
                    $scope.searchCriteria.findAll = true;
                   }
                }else{
                    //$scope.searchCriteria.acquiredDate = new Date();
                    $scope.searchCriteria.acquiredDate = "";
                }


                if(jQuery.isEmptyObject($scope.searchProject) == false) {
                   if($scope.searchProject.id != undefined){
                    $scope.searchCriteria.projectId = $scope.searchProject.id;
                    $scope.searchCriteria.findAll = false;
                   }else{
                    $scope.searchCriteria.projectId = 0;
                    $scope.searchCriteria.findAll = true;
                   }
                   
                }else{
                     $scope.searchCriteria.projectId =0;
                }
                if(jQuery.isEmptyObject($scope.searchSite) == false) {
                   if($scope.searchSite.id != undefined){
                    $scope.searchCriteria.siteId = $scope.searchSite.id;
                    $scope.searchCriteria.findAll = false;
                    }else{
                    $scope.searchCriteria.siteId = 0;
                    $scope.searchCriteria.findAll = true;
                   }

                }else{
                     $scope.searchCriteria.siteId =0;
                }
                if(jQuery.isEmptyObject($scope.searchAssetType) == false) {

                    $scope.searchCriteria.assetTypeName = $scope.searchAssetType.name;
                    $scope.searchCriteria.findAll = false;

                }else{
                     $scope.searchCriteria.assetTypeName ="";
                }
                if(jQuery.isEmptyObject($scope.searchAssetGroup) == false) {
                 
                    $scope.searchCriteria.assetGroupName = $scope.searchAssetGroup.assetgroup;
                    $scope.searchCriteria.findAll = false;

                }else{
                     $scope.searchCriteria.assetGroupName ="";
                }

                if($scope.searchAssetName != null) {

                    $scope.searchCriteria.assetTitle = $scope.searchAssetName;
                    $scope.searchCriteria.findAll = false;

                }else{
                     $scope.searchCriteria.assetTitle ="";
                }
                if($scope.searchAssetCode != null) {

                    $scope.searchCriteria.assetCode = $scope.searchAssetCode;
                    $scope.searchCriteria.findAll = false;

                }else{
                     $scope.searchCriteria.assetCode ="";
                }
                
                


            

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

            AssetComponent.findById(assetId).then(function(data){
                console.log("Asset details List==" + JSON.stringify(data));
                $scope.assetDetail= data;
                $scope.assetConfig();
                $scope.genQrCodes();

            });
        }


        $scope.assetConfig=function(){
             
            if($stateParams.id){ 
               if($scope.assetDetail.assetType){
                 $scope.assetConfigs.assetType = $scope.assetDetail.assetType;  
               }
               else if($scope.assetList.assetType){
                $scope.assetConfigs.assetType = $scope.assetList.assetType;
               }
                

                $scope.assetConfigs.assetId = $stateParams.id;
            }
            else if($scope.assetGen.id){
               
                $scope.assetConfigs.assetType = $scope.selectedAssetType.name;
                $scope.assetConfigs.assetId = $scope.assetGen.id;
            }  
               console.log("Asset Config load" ,$scope.assetConfigs);
    
                    AssetComponent.findByAssetConfig($scope.assetConfigs).then(function(data){
                       
                        console.log(data);
                        $scope.assetParameters = data;
                        

                    });

                
        }


        $('input#acquiredDate').on('dp.change', function(e){
                $scope.assetGen.acquiredDate = e.date._d;
                $scope.assetEditDate = e.date._d;
        });

        $('input#searchAcquiredDate').on('dp.change', function(e){
                $scope.searchAcquiredDate = $filter('date')(e.date._d, 'dd/MM/yyyy'); 
                $scope.searchAcquiredDateSer = e.date._d;
        });

        
        
         /* Create and save asset */

        $scope.saveAsset = function () {
                $scope.error = null;
                $scope.success = null;
                $scope.errorSitesExists = null;
                $scope.errorSite = null;
                if(!$scope.selectedSites.id){
                    $scope.errorSite = "true";
                    $scope.showNotifications('top','center','danger','Please select site!!!');

                }else{
        
                    if($scope.selectedAssetType.id){ $scope.assetGen.assetType = $scope.selectedAssetType.name; }
                    if($scope.selectedAssetGroup.id){ $scope.assetGen.assetGroup = $scope.selectedAssetGroup.assetgroup;}
                    if($scope.selectedAssetStatus.id){ $scope.assetGen.assetStatus = $scope.selectedAssetStatus.id;}
                    if($scope.selectedManufacturer.id){$scope.assetGen.manufacturerId = $scope.selectedManufacturer.id;}
                    if($scope.selectedServiceProvider.id){$scope.assetGen.serviceProvider = $scope.selectedServiceProvider.id;}
                    if($scope.selectedServiceWarranty.id){$scope.assetGen.serviceWarranty = $scope.selectedServiceWarranty.id;}
                    if($scope.selectedVendor.id){$scope.assetGen.vendorId = $scope.selectedVendor.id;}
                    if($scope.selectedSites.id){$scope.assetGen.siteId = $scope.selectedSites.id;}
                    //if($scope.selectedProject.id){$scope.assetGen.projectId = $scope.selectedProject.id;}
                    if($scope.selectedBlock){$scope.assetGen.block = $scope.selectedBlock;}
                    if($scope.selectedFloor){$scope.assetGen.floor = $scope.selectedFloor;}
                    if($scope.selectedZone){$scope.assetGen.zone = $scope.selectedZone;}

                    console.log("Asset Create List -- ",$scope.assetGen);
                    AssetComponent.create($scope.assetGen).then(function(response) {
                        console.log("Asset response",JSON.stringify(response));
                        $scope.assetGen.id=response.id;
                        $scope.assetGen.siteId=response.siteId;
                        $scope.success = 'OK';
                        $scope.showNotifications('top','center','success','Asset Added');
                        $scope.loadEmployees();
                        //$scope.loadAssets();
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

           
        if(!$scope.assetGen.id && !$stateParams.id){
            
          $scope.showNotifications('top','center','danger','Please create asset first..');

        }else{

        if($scope.assetGen.id){
            
            var qr = {id:$scope.assetGen.id,code:$scope.assetGen.assetcode};

        }else if($stateParams.id){

            var qr = {id:$stateParams.id,code:$scope.assetQr.assetCode};
        }

            //alert("code:"  + qr.code + "id:" + qr.id);
            
            AssetComponent.createQr(qr).then(function(){

                $scope.success = 'OK';
  
                $scope.genQrCodes();
            });
        }
    }

       

       /* View QR code by asset id */

       $scope.genQrCodes= function(){ 

              if($stateParams.id){
    
                var qr_id ={id:$stateParams.id};

              }else if($scope.assetGen.id){
      
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

                 
                if($scope.selectedAssetType)
                {     $scope.assetEdit.assetType =$scope.selectedAssetType.name;
                }else{
                      $scope.assetEdit.assetType =$scope.assetList.assetType;
                }
                if($scope.selectedAssetGroup){
                    $scope.assetEdit.assetGroup = $scope.selectedAssetGroup.assetgroup;
                }else{
                    $scope.assetEdit.assetGroup = $scope.assetList.assetGroup;
                }
                if($scope.selectedSite){
                   $scope.assetEdit.siteId = $scope.selectedSite.id;
                }else{
                    $scope.assetEdit.siteId = $scope.assetList.siteId;
                }
                if($scope.selectedBlock){
                    $scope.assetEdit.block = $scope.selectedBlock;
                }else{
                    $scope.assetEdit.block =  $scope.assetList.block;
                }
                if($scope.selectedFloor){
                    $scope.assetEdit.floor = $scope.selectedFloor;
                }else{
                    $scope.assetEdit.floor = $scope.assetList.floor;
                }
                if($scope.selectedZone){
                    $scope.assetEdit.zone = $scope.selectedZone;
                }else{
                    $scope.assetEdit.zone = $scope.assetList.zone;
                }
                if($scope.selectedManufacturer){
                   $scope.assetEdit.manufacturerId = $scope.selectedManufacturer.id; 
               }else{
                  $scope.assetEdit.manufacturerId = $scope.assetList.manufacturerId; 
               }
                if($scope.selectedVendor){
                   $scope.assetEdit.vendorId = $scope.selectedVendor.id; 
                }
                else{
                    $scope.assetEdit.vendorId = $scope.assetList.vendorId; 
                }
                if($scope.assetEditDate){
                    $scope.assetEdit.acquiredDate = $scope.assetEditDate;
                    $scope.assetEdit.acquiredDate1 = $filter('date')($scope.assetEditDate, 'dd/MM/yyyy');

                }
                
            
        	console.log('--- Edit asset details ---', JSON.stringify($scope.assetEdit));

        	//$scope.asset.assetStatus = $scope.selectedStatus.name;
        	//var post = $scope.isEdit ? AssetComponent.update : AssetComponent.create
        	AssetComponent.update($scope.assetEdit).then(function () {

                $scope.success = 'OK';
                 $scope.showNotifications('top','center','success','Asset Updated!!');
                 $scope.loadAssets();

            	//$location.path('/assets');

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

        $scope.load52WeekSchedule = function() {
        		console.log('site selection - ' + JSON.stringify($scope.searchSite));
        		if($scope.searchSite && $scope.searchSite.id) {
            		$scope.searchCriteria.siteId = $scope.searchSite.id;
            		AssetComponent.exportAsset52WeekSchedule($scope.searchCriteria).then(function(data){
            			console.log("response for 52week schedule - "+ JSON.stringify(data));
            			if(data) {
            				if(data.results) {
            					$rootScope.scheduleWebLink = data.results[0].webLink;
            					$rootScope.scheduleWebContentLink = data.results[0].webContentLink;
            					$location.path('/schedule-list');            					
            				}else {
            					$scope.showNotifications('top','center','error','Unable to get 52 week schedule for the site');
            				}
            			}else {
            				$scope.showNotifications('top','center','error','Unable to get 52 week schedule for the site');
            			}
            		});
        		}else {
        			$scope.showNotifications('top','center','error','Please select a site to view 52 week schedule');
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
                $scope.showNotifications('top','center','success','Asset Deleted Successfully!!');
            	$scope.loadAssets();
        	});
        }

        $scope.deleteConfirmDoc = function (id){
            $scope.deleteDocId= id;
        }



        $scope.deleteDoc = function () {
            AssetComponent.deleteDoc($scope.deleteDocId).then(function(){

                $scope.showNotifications('top','center','success','Document Deleted Successfully!!');
                $scope.getAllUploadedFiles();
                $scope.getAllUploadedPhotos();
            });
        }

          

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
            $scope.searchAssetName =null;
            $scope.searchAssetCode =null;
           //$scope.searchAcquiredDate = $filter('date')(new Date(), 'dd/MM/yyyy');
            $scope.searchAcquiredDate = "";
            $scope.searchAssetType ={};
            $scope.searchSite ={};
            $scope.searchProject ={};
            $scope.searchAssetGroup ={};

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
        
        /*$scope.loadPPMSchedule = function(assetId){
        	
        	var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
            if(!$scope.searchCriteria) {
                var searchCriteria = {
                        currPage : currPageVal
                };
                $scope.searchCriteria = searchCriteria;
            }

            $scope.searchCriteria.currPage = currPageVal;
            $scope.searchCriteria.findAll = false;

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
                //$scope.assets = '';
                //$scope.assetsLoader = false;
                //$scope.loadPageTop();
                
        	console.log(">>> loading ppm! asset id is "+assetId);
        	$scope.searchCriteria.assetId = assetId;
        	AssetComponent.findPPMSchedule($scope.searchCriteria).then(function (data) {
                $scope.ppmschedule = data.transactions;
                //$scope.projectsLoader = true;

                /*
                    ** Call pagination  main function **
                */
               /*  $scope.pager = {};
                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                 $scope.totalCountPages = data.totalCount;

                 console.log("Pagination",$scope.pager);
                 console.log($scope.projects);

                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;


                if($scope.projects && $scope.projects.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.projects.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10;
                }

            });*/

       /* }*/


        $scope.loadPPMSchedule = function() { 

            var item_ar = [];

            if($scope.assetGen.id){

                    var assetId= $scope.assetGen.id;

                }else if($stateParams.id){

                     var assetId = $stateParams.id;
                }
             
            AssetComponent.findByAssetPPM(assetId).then(function(data) { 
                
                     
                $scope.ppmScheduleList = data;

                for(var i = 0;i < $scope.ppmScheduleList.length;i++){   


                    var ppmId = $scope.ppmScheduleList[i].checklistId;


                  

                    ChecklistComponent.findOne(ppmId).then(function(response){ 


                          
                       item_ar.push(response.items);
                        
                       

                        console.log("array", item_ar);


                        if (i == item_ar.length) {

                             for(var j= 0;j < $scope.ppmScheduleList.length;j++){  

                                // alert(j);
                          

                              $scope.ppmScheduleList[j].items = item_ar[j];

                            }
      
                       }

                   });


                }
                
                console.log("PPM List" , $scope.ppmScheduleList);
            });
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
          if(!$scope.assetGen.id && !$stateParams.id){
        
              $scope.showNotifications('top','center','danger','Please create asset first..');

            }else{
       
                if($stateParams.id){
                	if($scope.assetList.assetType){
                	    $scope.parameterConfig.assetType = $scope.assetList.assetType;
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

                }else if($scope.assetGen.id){

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
                    $scope.parameterConfig = {};
                    $scope.consumptionMonitoringRequired = "";
                    $scope.selectedParameterUOM = {};
                    $scope.selectedParameter = {};
                       
                    //$scope.loadAllParameters();
                }).catch(function (response) {
                    $scope.success = null;
                    console.log('Error - '+ response.data);
                    if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                        $scope.errorProjectExists = 'ERROR';
                    } else {
                        $scope.error = 'ERROR';
                    }
                });

             }

	    };
	    
   

	    $scope.getAllUploadedFiles = function() {


	    	$scope.uploadObj.type = 'document';
	    	

            if($scope.assetGen.id){
                
                $scope.uploadObj.assetId = $scope.assetGen.id;

            }else if($stateParams.id){

                 $scope.uploadObj.assetId = $stateParams.id;
            }

	    	
	    	AssetComponent.getAllUploadedFiles($scope.uploadObj).then(function(data){ 
                $scope.uploadFiles = [];
	    		$scope.uploadFiles=data;

                $scope.fileCount = ($scope.uploadFiles).length;
                
                console.log("-- Upload files --" , $scope.uploadFiles);
	    	});
	    }
	    
	    $scope.getAllUploadedPhotos = function() {

	    	$scope.photoObj.type = 'image';

            if($scope.assetGen.id){

                $scope.photoObj.assetId = $scope.assetGen.id;

            }else if($stateParams.id){

                 $scope.photoObj.assetId = $stateParams.id;
            }
	    	
	    	AssetComponent.getAllUploadedPhotos($scope.photoObj).then(function(data){ 
                $scope.uploadAssetPhotos = [];
                $scope.uploadAssetPhotos=data;
                $scope.photoCount = ($scope.uploadAssetPhotos).length;
	   
                console.log("-- Uploaded Photos --",$scope.uploadAssetPhotos);
	    	});
	    }
	    
	    $scope.uploadAssetFile = function() { 

                if(!$scope.assetGen.id && !$stateParams.id){
                
                      $scope.showNotifications('top','center','danger','Please create asset first..');

                    }else{

    	     	if($scope.selectedClientFile) {

    	        	console.log("file title - " + $scope.uploadAsset.title + "file name -" + $scope.selectedClientFile);

                    if($scope.assetGen.id){
                        $scope.uploadAsset.assetId = $scope.assetGen.id;

                    }else if($stateParams.id){

                         $scope.uploadAsset.assetId = $stateParams.id;
                    }


    	        	$scope.uploadAsset.uploadFile = $scope.selectedClientFile;
    	        	//$scope.uploadAsset.assetId = 1;
    	        	$scope.uploadAsset.type = 'document';
    	        	console.log($scope.uploadAsset);
    	        	AssetComponent.uploadAssetFile($scope.uploadAsset).then(function(data){
    	        		console.log("-- Upload file --",data);
    	        		if(data) { 
                            $scope.uploadFiles =[];
    	        			$scope.uploadFiles.push(data);
    		        		$scope.getAllUploadedFiles();
    	        		}else{ 
    	        			console.log('No data found!');
    	        		}
                        $scope.uploadAsset  ={};
                        $scope.selectedClientFile = "";
    	        		
    	        	},function(err){
    	        		console.log('Import error');
    	        		console.log(err);
    	        	});
            	} else {
            		console.log('select a file');
            	}
            }
	    	
	    }
	    
	    $scope.uploadAssetPhotoFile = function() { 

        if(!$scope.assetGen.id && !$stateParams.id){
                
            $scope.showNotifications('top','center','danger','Please create asset first..');

        }else{ 
	    	console.log($scope.selectedPhotoFile);

	    	console.log($scope.uploadAssetPhoto.title);

	     	if($scope.selectedPhotoFile) {
	        	console.log('selected asset file - ' + $scope.selectedPhotoFile);

	        	$scope.uploadAssetPhoto.uploadFile = $scope.selectedPhotoFile;

                if($scope.assetGen.id){
                        $scope.uploadAssetPhoto.assetId = $scope.assetGen.id;

                    }else if($stateParams.id){

                         $scope.uploadAssetPhoto.assetId = $stateParams.id;
                    }
	        	//$scope.uploadAssetPhoto.assetId = 1;
	        	$scope.uploadAssetPhoto.type = 'image';

	        	console.log($scope.uploadAssetPhoto);

	        	AssetComponent.uploadAssetPhoto($scope.uploadAssetPhoto).then(function(data){
	        		console.log(data);
	        		if(data) { 
                        $scope.uploadAssetPhotos =[];
	        			$scope.uploadAssetPhotos.push(data);
		        		$scope.getAllUploadedPhotos();
	        		}else{ 
	        			console.log('No data found!');
	        		}

                    $scope.uploadAssetPhoto  ={};
                    $scope.selectedPhotoFile = "";
	        		
	        	},function(err){
	        		console.log('Import error');
	        		console.log(err);
	        	});
        	} else {
        		console.log('select a file');
        	}
          }
	    	
	    }
	    
        $scope.download = '';
	    
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
	    		console.log("-- Download file --",data);
	    		console.log(data.fileName);
	    		$scope.download = docId;
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
	    
	    /* AMC schedule */	    
	    
	    $scope.amcSchedule = {};
	    $scope.selectedChecklist;
	    $scope.selectedFrequencyPrefix;
	    $scope.selectedFrequency;
	    $scope.selectedFreqDuration;
	    
	    $scope.loadFreq = function() { 
	    	AssetComponent.getAllFrequencies().then(function(data){ 
	    		$scope.frequencies = data;
	    	});
	    }
	    
	    $scope.loadFreqPrefix = function() {
	    	AssetComponent.getAllPrefix().then(function(data) { 
	    		$scope.frequencyPrefixies = data;
	    	});
	    }
	    
	    $scope.frequencyDurations= [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
       
	    
	    $('input#dateFilterAmcFrom').on('dp.change', function(e){
            $scope.amcSchedule.startDate = e.date._d;
            $scope.amcFrom = $filter('date')(e.date._d, 'dd/MM/yyyy');
        });
        
        $('input#dateFilterAmcTo').on('dp.change', function(e){
            $scope.amcSchedule.endDate = e.date._d;
            $scope.amcTo = $filter('date')(e.date._d, 'dd/MM/yyyy');
        });
	    
	    $scope.loadCheckList = function() { 
            ChecklistComponent.findAll().then(function(data){ 
                //alert(data);
                $scope.checkLists = data;
            });
        }

        /*$scope.loadChecklist = function(id) {

            console.log('loadChecklist -' + id);
            ChecklistComponent.findOne(id).then(function (data) {

                return data.name;
                //$scope.checklist = data;
               /* console.log("--Checklist Data--",$scope.checklist);
                for(var i in data.items) {
                    $scope.checklistItems.push(data.items[i]);  
                }*/
                
          /*  });
        }*/
	    
	    
	    
	    
	    $scope.saveAmcSchedule = function() { 

            if(!$scope.assetGen.id && !$stateParams.id){
            
                  $scope.showNotifications('top','center','danger','Please create asset first..');

                }else{

                if($scope.assetGen.id){

                    $scope.amcSchedule.assetId= $scope.assetGen.id;

                }else if($stateParams.id){

                     $scope.amcSchedule.assetId = $stateParams.id;
                }

    	    	console.log($scope.selectedChecklist);
        

                 if($scope.selectedEmployee){ 
                    $scope.amcSchedule.empId = $scope.selectedEmployee.id;
                }
               
    	    	if($scope.selectedChecklist){ 
    	    		$scope.amcSchedule.checklistId = $scope.selectedChecklist.id;
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
    	    	
    	    	$scope.amcSchedule.maintenanceType = 'AMC';
    	    	
    	    	console.log("To be create AMC schedule",$scope.amcSchedule);
    	    	
    	    	AssetComponent.saveAmcSchedule($scope.amcSchedule).then(function(data){  
    	    		console.log(data);
    	    		if(data && data.checklistId) { 
    	    			console.log(data.checklistId);
    	    			//$scope.amcScheduleList.push(data);
                        $scope.loadAmcSchedule();
                        $scope.showNotifications('top','center','success','AMC Schedule Saved Successfully');
                        $scope.amcSchedule = {};

                        $scope.selectedChecklist = {};
                        $scope.selectedEmployee = {};
                        $scope.selectedFrequencyPrefix = {};
                        $scope.selectedFreqDuration = {};
                        $scope.selectedFrequency = {};

                        $scope.amcFrom = "";
                        $scope.amcTo = "";

                        $("#dateFilterAmcFrom").val("");
                        $("#dateFilterAmcTo").val("");


    	    			
    	    		}
    	    	}).catch(function (response) {
                
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                    $scope.errorProjectExists = 'ERROR';
                    $scope.showNotifications('top','center','danger','AMC Schedule Already Exists');
                } else {
                    $scope.error = 'ERROR';
                     $scope.showNotifications('top','center','danger','Error in creating AMC Schedule. Please try again later..');
                }

               
            });

            }
	    	
	    }
	    
	    $scope.loadAmcSchedule = function() { 

            var item_ar = [];

            if($scope.assetGen.id){

                    var assetId= $scope.assetGen.id;

                }else if($stateParams.id){

                     var assetId = $stateParams.id;
                }
	    	 
	    	AssetComponent.findByAssetAMC(assetId).then(function(data) { 

	    		//console.log(data);
   
                $scope.amcScheduleList = data;

                for(var i = 0;i < $scope.amcScheduleList.length;i++){   

                    var amcId = $scope.amcScheduleList[i].checklistId;


                    ChecklistComponent.findOne(amcId).then(function(data){ 

                          item_ar.push(data.items);
                            
                        
                            console.log("array", item_ar);


                            if (i == item_ar.length) {

                                 for(var j= 0;j < $scope.amcScheduleList.length;j++){  

                                    // alert(j);
                              
                                  $scope.amcScheduleList[j].items = item_ar[j];

                                }
          
                           }

                   });
                        

                }
	    		
                console.log("AMC List" , $scope.amcScheduleList);
	    	});
	    }
	    
	    /*End AMC*/	      


        $scope.uView=function(val){

            if(val == "on"){

                $scope.upView = "";

            }else if(val == "off"){

                $scope.upView = "1";
            }

        } 

        $scope.printDiv = function(printable) {
            var printContents = document.getElementById(printable).innerHTML;
            var originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
        }
        
		/**
		 * View Readings*/
        
        $scope.noReading = false;
        
        $scope.loadAssetReadings = function() {
        	var id = $stateParams.id;
        	AssetComponent.findByAssetReadings(id).then(function(data){ 
        		console.log('View Readings - ' +JSON.stringify(data));
        		if(data.length > 0) { 
        			$scope.assetReadings = data;
            		$scope.viewAssetReading(data[0].id);
        		}else{ 
        			console.log('No readings');
        			$scope.noReading = true;
        			$scope.assetReadings = [];
        		}
        		
        	});
        }
        
        $scope.viewAssetReading = function(id) {
            $scope.viewRead = id;
        	AssetComponent.findByReadingId(id).then(function(data){ 
        		console.log(data);
        		$scope.readingData = data;
        	});
        	
        }
        
        /**End view Readings*/   



        $scope.loadEmployees = function () {
            //var deferred = $q.defer(); 
            if($scope.assetList.siteId){
               var empParam = {siteId:$scope.assetList.siteId,list:true};
            } else if($scope.assetGen.siteId) {
                var empParam = {siteId:$scope.assetGen.siteId,list:true};
            }

            //alert(empParam.siteId);
                         
                EmployeeComponent.search(empParam).then(function (data) {
                    $scope.selectedEmployee = null;
                    $scope.employees = data.transactions;
                    //deferred.resolve($scope.employees);
            });
                //return deferred.promise;
                
        }
        
        $scope.loadAMCJobs = function() { 
        	$scope.searchCriteria.maintenanceType = "AMC";
        	$scope.searchCriteria.assetId = $stateParams.id;
        	console.log($scope.searchCriteria);
        	JobComponent.search($scope.searchCriteria).then(function(data){ 
        		console.log(data);
        		$scope.amcJobLists = data.transactions;
        	});
        }

        $scope.loadPPMJobs = function() { 
	        	$scope.ppmSearchCriteria.maintenanceType = "PPM";
	        	$scope.ppmSearchCriteria.assetId = $stateParams.id;
	        	console.log($scope.searchCriteria);
	        	JobComponent.search($scope.ppmSearchCriteria).then(function(data){ 
	        		console.log(data);
	        		$scope.ppmJobLists = data.transactions;
	        	});
        }
        
        
 

    });
