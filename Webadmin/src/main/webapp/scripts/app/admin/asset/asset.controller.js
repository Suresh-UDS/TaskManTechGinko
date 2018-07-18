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
        //$scope.isEdit = !!$stateParams.id;
        $scope.isEdit = false;
        $scope.selectedAsset = {};
        $scope.selectedProject = {};
        $scope.selectedSite = {};
        $scope.selectedSites = {};
        $scope.selectedBlock = null;
        $scope.selectedFloor = null;
        $scope.selectedZone = null;
        $scope.pageSort = 10;
        $scope.assetGen ={};
        $scope.assetVal ={};
        $scope.assetPPM ={};
        $scope.selectedConfig = null;
        $scope.selectedAssetType = {};
        $scope.selectedAssetGroup = {};
        $scope.selectedAssetStatus = "COMMISSIONED";
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
        $scope.amcSearchCriteria = {};
        $scope.redSearchCriteria = {};
        $scope.ppmFrom = null;
        $scope.ppmTo = null;
        $scope.amcFrom = null;
        $scope.amcTo = null;
        $scope.btnDisabled = false;
        $scope.selectedAssetType = {};
        $scope.selectedParameter = {};
        $scope.selectedParameterUOM = {};
        $scope.selectedRule = "";
        $scope.selectedThreshold =null;
        $scope.validationRequired = false;
        $scope.consumptionMonitoringRequired = false;
        $scope.alertRequired = false;
        $scope.selectedMinValue = null;
        $scope.selectedMaxValue = null;
        $scope.deleteDocId = null;
        $scope.docType = null;
        $scope.ppmJobStartTime = null;
        $scope.amcJobStartTime = null;
        $scope.noData = false;
        $scope.assetQrList ={};
        $scope.selectedEmployee ={};

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

        $scope.PPMScheduleCalendar = {};

        $scope.consumptionMonitoringRequired = false;
        
        $scope.validationRequired = false;
        
        $scope.alertRequired = false;

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

        $scope.openCalendar = function(e,cmp) {
            e.preventDefault();
            e.stopPropagation();

            that.calendar[cmp] = true;
        }

        $scope.initMaterialWizard = function(){

            demo.initMaterialWizard();


        }

       /* var nottifShow = true ;*/

        $scope.showNotifications= function(position,alignment,color,msg){

            /*if(nottifShow == true){*/
               $rootScope.overlayShow();
               demo.showNotification(position,alignment,color,msg);

            /*}else if(nottifShow == false){*/
                $timeout(function() {
                  $rootScope.overlayHide() ;
                }, 5000);

            /*}*/

        }

        $scope.ppmFromMsg =false;

        $('input#dateFilterPpmFrom').on('dp.change', function(e){
            $scope.assetPPM.startDate = e.date._d;
            $scope.ppmFrom = $filter('date')(e.date._d, 'dd/MM/yyyy');

            if($scope.assetPPM.startDate > $scope.assetPPM.endDate) {

                    //scope.showNotifications('top','center','danger','From date cannot be greater than To date');
                    $scope.ppmFromMsg = true;
                    
                    
                    //return false;
            }else {
              
               $scope.ppmFromMsg =false;
               
           
            }

            if($scope.assetPPM.endDate < $scope.assetPPM.startDate) {
                    //$scope.showNotifications('top','center','danger','To date cannot be lesser than From date');
                    $scope.ppmToMsg =true;
                    
                   
                    //return false;
            }else {
               
                 $scope.ppmToMsg =false;
                 
               
            }
        });

        $scope.ppmToMsg =false;

        $('input#dateFilterPpmTo').on('dp.change', function(e){
            $scope.assetPPM.endDate = e.date._d;
            $scope.ppmTo = $filter('date')(e.date._d, 'dd/MM/yyyy');

            if($scope.assetPPM.endDate < $scope.assetPPM.startDate) {
                    //$scope.showNotifications('top','center','danger','To date cannot be lesser than From date');
                    $scope.ppmToMsg =true;
                    
                   
                    //return false;
            }else {
               
                 $scope.ppmToMsg =false;
                 
               
            }

            if($scope.assetPPM.startDate > $scope.assetPPM.endDate) {

                    //scope.showNotifications('top','center','danger','From date cannot be greater than To date');
                    $scope.ppmFromMsg = true;
                    
                    
                    //return false;
            }else {
              
               $scope.ppmFromMsg =false;
               
           
            }
        });
        
        $('input#ppmJobStartTime').on('dp.change', function(e){
            $scope.assetPPM.jobStartTime = e.date._d;
            $scope.ppmJobStartTime =$filter('date')(e.date._d, 'hh:mm a');
            $scope.ppmJobStartTimeTmp =$filter('date')(e.date._d, 'dd/MM/yyyy hh:mm a');
        });
        

        
        $scope.initPPMSchedule = function() {
        		$scope.loadSiteShifts();
        	}

        $scope.savePPMSchedule = function (){
            

        	console.log(" --- Create asset ppm ---" ,$scope.assetPPM.title);


            if(!$scope.assetVal.id && !$stateParams.id){

                  $scope.showNotifications('top','center','danger','Please create asset first..');

            }else{

                if($scope.assetVal.id){

                   $scope.assetPPM.assetId = $scope.assetVal.id;

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
    	    			
    	    			$scope.shiftTimings = [];
		    	    	if($scope.selectedShift) {
			    	    	$scope.shiftTimings.push($scope.selectedShift.startTime +'-' +$scope.selectedShift.endTime);
		    	    	}
		    	    	
		    	    	$scope.assetPPM.shiftTimings = $scope.shiftTimings;

                console.log("To be create PPM",$scope.assetPPM);

                $scope.loadingStart();

            	AssetComponent.createPPM($scope.assetPPM).then(function(response) {



                    //console.log("PPM schedule response",JSON.stringify(response));

                    $scope.success = 'OK';

                    $scope.showNotifications('top','center','success','PPM schedule has been added Successfully!!');

                    $scope.assetPPM = {};
                    $scope.selectedChecklist = {};
                    $scope.selectedEmployee = {};
                    $scope.selectedFrequency = {};
                    $scope.selectedTimeInterval = {};
                    $scope.selectedFrequnceyOccurrence = {};
                    $scope.ppmFrom = "";
                    $scope.ppmTo = "";
                    $scope.ppmJobStartTime = "";
        

                    $("#dateFilterPpmFrom").val("");
                    $("#dateFilterPpmTo").val("");

                    $scope.loadPPMSchedule();
                    $scope.loadSiteShifts();
                   

                }).catch(function (response) {
                    $scope.success = null;
                    $scope.loadingStop();
                    console.log('Error - '+ response.data);
                    console.log('status - '+ response.status + ' , message - ' + response.data.message);
                    if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                            $scope.errorAssetsExists = 'ERROR';
                        $scope.showNotifications('top','center','danger','PPM schedule Already Exists');

                        console.log($scope.errorAssetsExists);
                    } else {
                        $scope.showNotifications('top','center','danger','Unable to creating PPM schedule. Please try again later..');
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
                $scope.loadingStop();
            });
        }

        $scope.addManufacturer = function () {

            console.log("add manufacturer",$scope.manufacturer);
            $scope.loadingStart();
            if($scope.manufacturer){
                console.log("Manufacturer entered");
                ManufacturerComponent.create($scope.manufacturer).then(function (response) {
                    console.log(response);
                    $scope.manufacturer = "";
                    $scope.showNotifications('top','center','success','Manufacturer has been added Successfully!!');
                    $scope.loadManufacturer();


                }).catch(function(){
                $scope.loadingStop();
                $scope.showNotifications('top','center','danger','Unable to Manufacturer add. Please try again later..');
                $scope.error = 'ERROR';
            });
            }else{
                console.log("Manufacturer not entered");
            }


        }

         $scope.loadVendor = function () {

            VendorComponent.findAll().then(function (data) {
                //console.log("Loading all Vendor -- " , data)
                $scope.vendors = data;
                $scope.loadingStop();
            });
        }

        $scope.addVendor = function () {
            $scope.loadingStart();
            console.log("add vendor",$scope.vendor);
            if($scope.vendor){

                console.log("Asset Type entered");
                VendorComponent.create($scope.vendor).then(function (response) {
                    console.log(response);
                    $scope.vendor = "";
                    $scope.showNotifications('top','center','success','Vendor has been added Successfully!!');
                    $scope.loadVendor();


                }).catch(function(){
                $scope.loadingStop();
                $scope.showNotifications('top','center','danger','Unable to in Vendor add. Please try again later..');
                $scope.error = 'ERROR';
            });
            }else{
                console.log("Vendor not entered");
            }


        }

         $scope.loadWarranty = function () {
            AssetComponent.getWarList().then(function (data) {
                console.log("Loading all service warranties -- " , data)
                $scope.servicewarranties = data;
                 $scope.loadingStop();
            });
        }

        $scope.addWarranty = function () {
             $scope.loadingStart();
            console.log("add Warranty",$scope.Warranty);
            if($scope.Warranty){

                console.log("Asset Type entered");
                AssetComponent.createWar($scope.Warranty).then(function (response) {
                    console.log(response);
                    $scope.servicewarranties = "";
                    $scope.showNotifications('top','center','success','Service Warranty has been added Successfully!!');
                    $scope.loadWarranty();


                }).catch(function(){
                $scope.loadingStop();
                $scope.showNotifications('top','center','danger','Unable to Service Warranty add. Please try again later..');
                $scope.error = 'ERROR';
            });
            }else{
                console.log("Warranty not entered");
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
                $scope.loadingStop();
            });
        }

        $scope.loadAssetGroup = function () {
            AssetComponent.loadAssetGroup().then(function (data) {
                //console.log("Loading all Asset Group -- " , data)
                $scope.assetGroups = data;
                $scope.loadingStop();
            });
        }

        $scope.loadSelectedProject = function(projectId) {
            ProjectComponent.findOne(projectId).then(function (data) {
                $scope.selectedProject = data;

            });
        }

        $scope.loadBlocks = function () {
                console.log('selected project -' + ($scope.selectedProject ? $scope.selectedProject.id : 0) + ', site -' + ($scope.selectedSites ? $scope.selectedSites.id : 0))
                $rootScope.selectedSite = $scope.selectedSites;
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

        $scope.loadSiteShifts = function() {
        		console.log('selected site - ' + JSON.stringify($scope.selectedSites));
        		var now = new Date();
        		now = now.toISOString().split('T')[0] 
        		if($scope.selectedSites) {
            		SiteComponent.findShifts($scope.selectedSites.id,now).then(function(data){
            			$scope.shifts = data;
                        console.log('selected shifts - ' + JSON.stringify($scope.shifts));
                        //$scope.loadingStop();
            		}).catch(function(){
                        //$scope.loadingStop();
                    });
        		}
        }
        
        $scope.initMaterialWizard();

        $scope.editAsset = function(){
             //alert($stateParams.id);
            console.log($stateParams.id);
            $rootScope.loadingStart();

        	AssetComponent.findById($stateParams.id).then(function(data){

        		$scope.assetList=data;

                console.log("--- Load asset ---",$scope.assetList);


                $scope.assetEdit.id = $scope.assetList.id;
                $scope.assetEdit.title = $scope.assetList.title;
                $scope.assetEdit.modelNumber = $scope.assetList.modelNumber;
                $scope.assetEdit.serialNumber =  $scope.assetList.serialNumber;
                $scope.assetEdit.acquiredDate = $scope.assetList.acquiredDate;
                $scope.assetEdit.warrantyFromDate  = $scope.assetList.warrantyFromDate;
                $scope.assetEdit.warFromDate1  = $filter('date')($scope.assetList.warrantyFromDate, 'dd/MM/yyyy');;
                $scope.assetEdit.warrantyToDate  = $scope.assetList.warrantyToDate;
                $scope.assetEdit.warToDate1  = $filter('date')($scope.assetList.warrantyToDate, 'dd/MM/yyyy');
                $scope.assetEdit.acquiredDate1 = $filter('date')($scope.assetList.acquiredDate, 'dd/MM/yyyy');
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
                $scope.selectedServiceWarranty = {name:$scope.assetList.warrantyType};
                $scope.selectedAssetStatus = $scope.assetList.status;
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

                $scope.loadSiteShifts();

                //$scope.genQrCodes();

                $scope.loadingStop();

                //$scope.assetConfig();

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
        	}).catch(function(response){
                $rootScope.loadingStop();
               
            });
        }





        /* Sorting functions*/

        $scope.isActiveAsc = 'code';
        $scope.isActiveDesc = '';

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            console.log('>>> selected coloumn <<< '+$scope.selectedColumn);
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
            //$scope.genQrCodes();

        }

        $scope.searchFilter = function () {
            $scope.setPage(1);
            $scope.search();
         }

         /* Asset listing and searching function */

        $scope.search = function () {

            $scope.loadingStop();

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
                    $scope.searchCriteria.acquiredDate = null;
                    $scope.searchCriteria.findAll = true;
                   }
                }else{
                    //$scope.searchCriteria.acquiredDate = new Date();
                    $scope.searchCriteria.acquiredDate = null;
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
                     $scope.searchCriteria.assetTypeName =null;
                }
                if(jQuery.isEmptyObject($scope.searchAssetGroup) == false) {

                    $scope.searchCriteria.assetGroupName = $scope.searchAssetGroup.assetgroup;
                    $scope.searchCriteria.findAll = false;

                }else{
                     $scope.searchCriteria.assetGroupName =null;
                }

                if($scope.searchAssetName != null) {

                    $scope.searchCriteria.assetTitle = $scope.searchAssetName;
                    $scope.searchCriteria.findAll = false;

                }else{
                     $scope.searchCriteria.assetTitle =null;
                }
                if($scope.searchAssetCode != null) {

                    $scope.searchCriteria.assetCode = $scope.searchAssetCode;
                    $scope.searchCriteria.findAll = false;

                }else{
                     $scope.searchCriteria.assetCode =null;
                }






            //----
            if($scope.pageSort){
                $scope.searchCriteria.sort = $scope.pageSort;
            }

            if($scope.selectedColumn){

                $scope.searchCriteria.columnName = $scope.selectedColumn;
                console.log('>>> $scope.searchCriteria.columnName <<< '+$scope.searchCriteria.columnName);
                $scope.searchCriteria.sortByAsc = $scope.isAscOrder;
                console.log('>>> $scope.searchCriteria.sortByAsc <<< '+$scope.searchCriteria.sortByAsc);
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

                $scope.noData = false;

                }else{
                     $scope.noData = true;
                }

            }).catch(function(){
                //$scope.showNotifications('top','center','danger','Error load asset list. Please try again later..');
                $scope.error = 'ERROR';
            });
        }

        /* View asset by id */

        $scope.viewAsset = function(){

            var assetId = $stateParams.id;
             $rootScope.loadingStart();

            AssetComponent.findById(assetId).then(function(data){
                console.log("Asset details List==" + JSON.stringify(data));
                $scope.assetDetail= data;
                 $rootScope.loadingStop();
                //$scope.loadCalendar();

            }).catch(function(response){
               $rootScope.loadingStop();
            });
        }

         var date = new Date(), y = date.getFullYear(), m = date.getMonth();
         var firstDay = new Date(y, m, 1);
         var lastDay = new Date(y, m + 1, 0);

        $scope.loadCalendar = function (startDate = firstDay,endDate = lastDay) {

           // $scope.initFullCalendar([]);

            $rootScope.loadingStart();

            var scheduleObj = {assetId:$stateParams.id,checkInDateTimeFrom:startDate,checkInDateTimeTo:endDate};

            AssetComponent.getPPMScheduleCalendar(scheduleObj.assetId,scheduleObj).then(function(data){

                console.log("Asset Calendar details ==" + JSON.stringify(data));

                $scope.PPMScheduleCalendar = data;

                $scope.initFullCalendar($scope.PPMScheduleCalendar);

                $rootScope.loadingStop();

               
            });


        }

        //$scope.loadCalendar();


        $scope.assetConfig=function(){
            $scope.loadingStart();

            if($stateParams.id){
               if($scope.assetDetail.assetType){
                 $scope.assetConfigs.assetType = $scope.assetDetail.assetType;
               }
               else if($scope.assetList.assetType){
                $scope.assetConfigs.assetType = $scope.assetList.assetType;
               }


                $scope.assetConfigs.assetId = $stateParams.id;
            }
            else if($scope.assetVal.id){

                $scope.assetConfigs.assetType = $scope.selectedAssetType.name;
                $scope.assetConfigs.assetId = $scope.assetVal.id;
            }
               console.log("Asset Config load" ,$scope.assetConfigs);

                    AssetComponent.findByAssetConfig($scope.assetConfigs).then(function(data){
                        
                        console.log(data);
                        $scope.assetParameters = data;

                        $scope.loadingStop();

                    }).catch(function(){
                $scope.loadingStop();
                //$scope.showNotifications('top','center','danger','Unable to load asset config list. Please try again later..');
                $scope.error = 'ERROR';
            });


        }

        $scope.getParameterConfigDetails = function(id, mode) {
                $rootScope.loadPageTop();
                $scope.loadingStart();
                $scope.isEdit = (mode == 'edit' ? true : false)
            AssetComponent.getAssetParamConfig(id).then(function (data) {
                $scope.parameterConfig = data;
                console.log('Parameter by id',$scope.parameterConfig);
                //$scope.selectedAssetType = {name:$scope.parameterConfig.assetType};
                $scope.selectedParameter = {name:$scope.parameterConfig.name};
                $scope.selectedParameterUOM = {uom:$scope.parameterConfig.uom};
                $scope.selectedRule = $scope.parameterConfig.rule;
                $scope.selectedThreshold = $scope.parameterConfig.threshold;
                $scope.validationRequired = $scope.parameterConfig.validationRequired;
                $scope.consumptionMonitoringRequired = $scope.parameterConfig.consumptionMonitoringRequired;
                $scope.alertRequired = $scope.parameterConfig.alertRequired;
                $scope.selectedMinValue = $scope.parameterConfig.min;
                $scope.selectedMaxValue = $scope.parameterConfig.max;
                $rootScope.loadingStop();

            }).catch(function(response){
                 $scope.showNotifications('top','center','danger','Unable to load asset config. Please try again later..');
                $scope.loadingStop();
               
            });
        };
        
        $scope.warFromMsg =false;

        $('input#acquiredDate').on('dp.change', function(e){
        	
        		var aqDate = $filter('date')(e.date._d, 'yyyy-MM-dd');
//        		alert(aqDate);
                $scope.assetGen.acquiredDate = aqDate;

                $scope.assetEditDate = aqDate;

                //$scope.assetGen.acquiredDate = $filter('date')(e.date._d, 'EEE, dd MMM yyyy HH:mm:ss Z');
                //$scope.assetEditDate = $filter('date')(e.date._d, 'EEE, dd MMM yyyy HH:mm:ss Z');
        });
        

        $('input#warFromDate').on('dp.change', function(e){
            $scope.assetGen.warrantyFromDate =  e.date._d;

            $scope.warFromDate1 = $filter('date')(e.date._d, 'dd/MM/yyyy');
            $scope.warFromDate = e.date._d;

           

            if($scope.warFromDate > $scope.warToDate) {

                    //scope.showNotifications('top','center','danger','From date cannot be greater than To date');
                    $scope.warFromMsg = true;
                    
                    
                    //return false;
            }else {
              
               $scope.warFromMsg =false;
               
           
            }

            if($scope.warToDate < $scope.warFromDate) {
                    //$scope.showNotifications('top','center','danger','To date cannot be lesser than From date');
                    $scope.warToMsg =true;
                    
                   
                    //return false;
            }else {
               
                 $scope.warToMsg =false;
                 
               
            }
        });

         $scope.warToMsg =false;

        $('input#warToDate').on('dp.change', function(e){
            $scope.assetGen.warrantyToDate = e.date._d;
            $scope.warToDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
            $scope.warToDate = e.date._d;

            if($scope.warToDate < $scope.warFromDate) {
                    //$scope.showNotifications('top','center','danger','To date cannot be lesser than From date');
                    $scope.warToMsg =true;
                    
                   
                    //return false;
            }else {
               
                 $scope.warToMsg =false;
                 
               
            }

            if($scope.warFromDate > $scope.warToDate) {

                    //scope.showNotifications('top','center','danger','From date cannot be greater than To date');
                    $scope.warFromMsg = true;
                    
                    
                    //return false;
            }else {
              
               $scope.warFromMsg =false;
               
           
            }
        });

        $('input#searchAcquiredDate').on('dp.change', function(e){
                $scope.searchAcquiredDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
                $scope.searchAcquiredDateSer = e.date._d;
        });



         /* Create and save asset */

        $scope.saveAsset = function () {
                $scope.loadingStart();
                $scope.btnDisabled = true;
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
                    if($scope.selectedAssetStatus){ $scope.assetGen.status = $scope.selectedAssetStatus;}
                    if($scope.selectedManufacturer.id){$scope.assetGen.manufacturerId = $scope.selectedManufacturer.id;}
                    if($scope.selectedServiceProvider.id){$scope.assetGen.serviceProvider = $scope.selectedServiceProvider.id;}
                    if($scope.selectedServiceWarranty.id){$scope.assetGen.warrantyType = $scope.selectedServiceWarranty.name;}
                    if($scope.selectedVendor.id){$scope.assetGen.vendorId = $scope.selectedVendor.id;}
                    if($scope.selectedSites.id){$scope.assetGen.siteId = $scope.selectedSites.id;}
                    //if($scope.selectedProject.id){$scope.assetGen.projectId = $scope.selectedProject.id;}
                    if($scope.selectedBlock){$scope.assetGen.block = $scope.selectedBlock;}
                    if($scope.selectedFloor){$scope.assetGen.floor = $scope.selectedFloor;}
                    if($scope.selectedZone){$scope.assetGen.zone = $scope.selectedZone;}

                    console.log("Asset Create List -- ",$scope.assetGen);
                    AssetComponent.create($scope.assetGen).then(function(response) {
                        console.log("Asset response",JSON.stringify(response));
                        $scope.assetVal.id=response.id;
                        $scope.assetVal.siteId=response.siteId;
                        $scope.success = 'OK';
                        $scope.loadingStop();
                        $scope.showNotifications('top','center','success','Asset has been added Successfully!!');
                        $scope.loadEmployees();
                        $scope.btnDisabled= false;
                        //$scope.loadAssets();
                        //$location.path('/assets');

                    }).catch(function (response) {
                        $scope.loadingStop();
                        $scope.btnDisabled= false;
                        $scope.success = null;
                        console.log('Error - '+ response.data);
                        console.log('status - '+ response.status + ' , message - ' + response.data.message);
                        if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                                $scope.errorAssetsExists = 'ERROR';
                            $scope.showNotifications('top','center','danger','Asset Already Exists');

                            console.log($scope.errorAssetsExists);
                        } else {
                            $scope.showNotifications('top','center','danger','Unable to creating Asset. Please try again later..');
                            $scope.error = 'ERROR';
                        }
                    });

                }

        }

        /* Create and save QR code */

       $scope.createQrCode= function(){
        
        $scope.loadingStart();

        if(!$scope.assetVal.id && !$stateParams.id){

          $scope.showNotifications('top','center','danger','Please create asset first..');

        }else{

        if($scope.assetVal.id){

            var qr = {id:$scope.assetVal.id,code:$scope.assetGen.assetcode};

        }else if($stateParams.id){

            var qr = {id:$stateParams.id,code:$scope.assetQr.assetCode};
        }

            //alert("code:"  + qr.code + "id:" + qr.id);
            $scope.qr_img = "";
            $scope.assetCode = "";

            AssetComponent.createQr(qr).then(function(response){
                console.log('response qr---',response);
                $scope.qr_img = response.url;
                $scope.assetCode = response.code;
//             console.log('create qr---',qrAry);
             $scope.loadingStop();
                //$scope.genQrCodes();
            }).catch(function(){
                $scope.loadingStop();
                $scope.showNotifications('top','center','danger','Unable to create Qr . Please try again later..');
                $scope.error = 'ERROR';
            });
        }
    }



       /* View QR code by asset id */

       $scope.genQrCodes= function(){

        $scope.loadingStart();

              if($stateParams.id){

                var qr_id ={id:$stateParams.id};

              }else if($scope.assetVal.id){

                var qr_id ={id:$scope.assetVal.id};
              }
              

              $scope.qr_img = "";
              $scope.assetCode = "";


            AssetComponent.genQrCode(qr_id).then(function(response){
	             $scope.qr_img = response.url;
	             $scope.assetCode = response.code;
	             console.log('get qr---',response);
	
	             $scope.loadingStop();

            });
            /*.catch(function(){
                $scope.showNotifications('top','center','danger','Error to retrieve  qr code..');
                $scope.loadingStop();
            });*/

       }

       $scope.updateSite = function(selectedSite) {
    	   		$scope.selectedSites = selectedSite;
    	   
       }
       
       
       /* Update and save asset */

        $scope.updateAsset = function () {
            $scope.loadingStart();
        	$scope.error = null;
            $scope.success =null;
        	$scope.btnDisabled =true;


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
                if($scope.selectedSites){
                   $scope.assetEdit.siteId = $scope.selectedSites.id;
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
                if($scope.selectedServiceWarranty){
                   $scope.assetEdit.warrantyType = $scope.selectedServiceWarranty.name;
                }
                else{
                    $scope.assetEdit.warrantyType = $scope.assetList.warrantyType;
                }
                if($scope.selectedAssetStatus){
                    $scope.assetEdit.status = $scope.selectedAssetStatus;
                }else{
                    $scope.assetEdit.status = $scope.assetList.status;
                }
                if($scope.assetEditDate){
                    $scope.assetEdit.acquiredDate = $scope.assetEditDate;

                }
                if($scope.warFromDate){

                    $scope.assetEdit.warrantyFromDate = $scope.warFromDate;

                }
                if($scope.warToDate){
                    $scope.assetEdit.warrantyToDate = $scope.warToDate;
                    
                }


        	console.log('--- Edit asset details ---', JSON.stringify($scope.assetEdit));

        	//$scope.asset.assetStatus = $scope.selectedStatus.name;
        	//var post = $scope.isEdit ? AssetComponent.update : AssetComponent.create
        	AssetComponent.update($scope.assetEdit).then(function () {

                $scope.success = 'OK';
                $scope.loadingStop();
                $scope.btnDisabled =false;
                 $scope.showNotifications('top','center','success','Asset has been updated Successfully!!');
                 //$scope.loadAssets();

            	//$location.path('/assets');

            }).catch(function (response) {
                $rootScope.loadingStop();
                $scope.success = null;
                $scope.btnDisabled =false;

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
            //$scope.getAllUploadedFiles();
            //$scope.getAllUploadedPhotos();
            if($scope.isEdit){
                console.log("edit asset")
                $scope.editAsset();
            }else {
                console.log("add asset")
            }
        }

        $scope.load52WeekSchedule = function() {
        		console.log('site selection - ' + JSON.stringify($scope.searchSite));
        		if(jQuery.isEmptyObject($scope.searchSite) == false && $scope.searchCriteria.siteId != 0) {
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
	                $scope.showNotifications('top','center','success','Asset has been deleted successfully!!');
	            	$scope.loadAssets();
	        	});
        }

        $scope.deleteConfirmDoc = function (id,type){
            $scope.deleteDocId= id;
            $scope.docType= type;
        }



        $scope.deleteDoc = function () {
            $scope.loadingStart();
            var docId = $scope.deleteDocId;
            AssetComponent.deleteDoc(docId).then(function(data){

                console.log('Deleted data',data);

            $scope.showNotifications('top','center','success','Document has been deleted successfully!!');
              if($scope.docType == 'file'){
                  $scope.getAllUploadedFiles();  
              }else if($scope.docType == 'photo'){
                $scope.getAllUploadedPhotos();
              }
                
                
                //$scope.loadingStop();
            }).catch(function(){
                $scope.loadingStop();
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
            $scope.searchAcquiredDate = null;
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

        $scope.clear = function() {
                $scope.selectedAssetType = {};
                $scope.selectedParameter = {};
                $scope.selectedParameterUOM = {};
                $scope.selectedRule = "";
                $scope.selectedThreshold =null;
                $scope.validationRequired = false;
                $scope.consumptionMonitoringRequired = false;
                $scope.alertRequired = false;
                $scope.selectedMinValue = null;
                $scope.selectedMaxValue = null;
                $scope.isEdit = false;
        }

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
            
            $scope.loadingStart();

            var item_ar = [];

            if($scope.assetVal.id){

                    var assetId= $scope.assetVal.id;

                }else if($stateParams.id){

                     var assetId = $stateParams.id;
                }

            AssetComponent.findByAssetPPM(assetId).then(function(data) {

            
                $scope.ppmScheduleList = data;

                console.log('ppm schedule data--',$scope.ppmScheduleList);

               /* for(var i = 0;i < $scope.ppmScheduleList.length;i++){


                    var checklistId = $scope.ppmScheduleList[i].checklistId;



                    ChecklistComponent.findOne(checklistId).then(function(response){

                     

                        item_ar.push(response.items);

                     

                        console.log("array", item_ar);


                        //if (i == item_ar.length) {

                             for(var j= 0;j < $scope.ppmScheduleList.length;j++){

                                 alert(item_ar[j]);


                              $scope.ppmScheduleList[j].items = item_ar[j];

                            }

                       //}

                   });


                }

                console.log("PPM List" , $scope.ppmScheduleList);*/
                $scope.loadingStop();
            }).catch(function(){
                 $scope.loadingStop();
                 //$scope.showNotifications('top','center','danger','Error in PPM schedule list. Please try again later..');
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
            if($scope.ppmSearchCriteria.maintenanceType =='PPM'){

                $scope.loadPPMJobs();

            }else if($scope.amcSearchCriteria.maintenanceType =='AMC'){
                
                $scope.loadAMCJobs();

            }else if($scope.redSearchCriteria.module == "Readings"){
                $scope.loadAssetReadings();
            }else{
               $scope.search(); 
            }
            
        }



        /* Add asset type */

        $scope.addAssetType = function () {
            console.log($scope.assetType);
             $scope.loadingStart();
            if($scope.assetType){
                console.log("Asset Type entered");
                AssetTypeComponent.create($scope.assetType).then(function (response) {
                    console.log(response);
                    $scope.assetType = "";
                    $scope.showNotifications('top','center','success','Asset type has been added Successfully!!');
                    $scope.loadAssetType();


                }).catch(function(){
                 $scope.loadingStop();
                $scope.showNotifications('top','center','danger','Unable to Asset type. Please try again later..');
                $scope.error = 'ERROR';
            });
            }else{
                console.log("Asset Type not entered");
            }


        }

         /* Add asset group */

        $scope.addAssetGroup = function () {

            console.log($scope.assetGroup);
             $scope.loadingStart();
            if($scope.assetGroup){
                console.log("Asset Group entered");
                AssetComponent.createAssetGroup($scope.assetGroup).then(function (response) {
                    console.log(response);
                    $scope.assetGroup = "";
                    $scope.showNotifications('top','center','success','Asset group has been added Successfully!!');
                    $scope.loadAssetGroup();

                }).catch(function(){
                $scope.loadingStop();
                $scope.showNotifications('top','center','danger','Unable to Asset group. Please try again later..');
                $scope.error = 'ERROR';
            });
            }else{
                console.log("Asset Group not entered");
            }


        }

         /* Add asset parameter */

         $scope.addParameter = function () {
              $scope.loadingStart();   
            if($scope.parameter){
                console.log("Parameter entered");
                ParameterComponent.create($scope.parameter).then(function (response) {
                    console.log(response);
                    $scope.parameter = "";
                    $scope.showNotifications('top','center','success','Parameter has been added Successfully!!');
                    $scope.loadAllParameters();

                }).catch(function(){
                $scope.loadingStop();
                $scope.showNotifications('top','center','danger','Unable to Parameter add. Please try again later..');
                $scope.error = 'ERROR';
            });
            }else{
                console.log("Parameter not entered");
            }
        }

        /* Add asset parameter UOM */

        $scope.addParameterUOM = function () {
              $scope.loadingStart();
            if($scope.parameterUOM){
                console.log("ParameterUOM entered");
                ParameterUOMComponent.create($scope.parameterUOM).then(function (response) {
                    console.log(response);
                    $scope.parameterUOM = "";
                    $scope.showNotifications('top','center','success','Parameter UOM has been added Successfully!!');
                    $scope.loadAllParameterUOMs();

                }).catch(function(){
                $scope.loadingStop();
                $scope.showNotifications('top','center','danger','Unable to Parameter UOM add. Please try again later..');
                $scope.error = 'ERROR';
            });
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

        $scope.deleteConfigConfirm = function (id){

                $scope.deleteParamConId= id;

        }

        $scope.deleteAssetConfig = function(id) {
            $rootScope.loadingStart();
	        	AssetComponent.deleteConfigById($scope.deleteParamConId).then(function(data){
	        		console.log(data);
	        		$scope.assetParameters = data;
	                $scope.assetConfig();
	                $rootScope.loadingStop();
	        		
	        	});
        }
        
        $scope.siteChangeAssetConfig = function() {
        		$scope.loadBlocks();
        		$scope.loadEmployees();
        }

        $scope.loadAllParameters = function() {
            //$rootScope.loadingStart();
    		ParameterComponent.findAll().then(function (data) {
	            $scope.selectedParameter = null;
	            $scope.parameters = data;
                console.log('param list --',$scope.parameters);
                $rootScope.loadingStop();
    		});
        }



	    $scope.loadAllParameterUOMs = function() {
	    		ParameterUOMComponent.findAll().then(function (data) {
	            $scope.selectedParameterUOM = null;
	            $scope.parameterUOMs = data;
                 $scope.loadingStop();
	        });
	    }



	    $scope.saveAssetParamConfig = function () {
             $scope.loadingStart();
            $scope.btnDisabled = true;
        	$scope.error = null;
        	$scope.success =null;
          if(!$scope.assetVal.id && !$stateParams.id){

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
                	if($scope.selectedThreshold) { 
                		$scope.parameterConfig.threshold = $scope.selectedThreshold;
                	}
                	if($scope.selectedMinValue) { 
                		$scope.parameterConfig.min = $scope.selectedMinValue;
                	}
                	if($scope.selectedMaxValue) { 
                		$scope.parameterConfig.max = $scope.selectedMaxValue;
                	}
                	if($scope.selectedRule){
    	        		$scope.parameterConfig.rule = $scope.selectedRule;
    	        	}
                	$scope.parameterConfig.consumptionMonitoringRequired  = $scope.consumptionMonitoringRequired;
                	$scope.parameterConfig.validationRequired  = $scope.validationRequired;
                	$scope.parameterConfig.alertRequired  = $scope.alertRequired
                	
                	console.log('Edit parameterConfig details ='+ JSON.stringify($scope.parameterConfig));

                }else if($scope.assetVal.id){

                    $scope.parameterConfig.assetId = $scope.assetVal.id;

                    if($scope.selectedAssetType.name){

                        $scope.parameterConfig.assetType = $scope.selectedAssetType.name;

                    }
                    if($scope.selectedParameter){

                        $scope.parameterConfig.name = $scope.selectedParameter.name;
                    }
                    if($scope.selectedParameterUOM){
                        $scope.parameterConfig.uom = $scope.selectedParameterUOM.uom;
                    }
                    if($scope.selectedThreshold) { 
                		$scope.parameterConfig.threshold = $scope.selectedThreshold;
                	}
                	if($scope.selectedMinValue) { 
                		$scope.parameterConfig.min = $scope.selectedMinValue;
                	}
                	if($scope.selectedMaxValue) { 
                		$scope.parameterConfig.max = $scope.selectedMaxValue;
                	}
                	if($scope.selectedRule){
    	        		$scope.parameterConfig.rule = $scope.selectedRule;
    	        	}
                    $scope.parameterConfig.consumptionMonitoringRequired  = $scope.consumptionMonitoringRequired;
                    $scope.parameterConfig.validationRequired  = $scope.validationRequired;
                	$scope.parameterConfig.alertRequired  = $scope.alertRequired
                    console.log('Add parameterConfig details ='+ JSON.stringify($scope.parameterConfig));
                }

                var post = $scope.isEdit ? AssetComponent.updateAssetParamConfig : AssetComponent.createAssetParamConfig;
                post($scope.parameterConfig).then(function () {

            	//AssetComponent.createAssetParamConfig($scope.parameterConfig).then(function () {
                    $scope.success = 'OK';
                    if(!$scope.isEdit){

                    $scope.showNotifications('top','center','success','Asset Parameter has been added Successfully!!');

                    }else{

                     $scope.showNotifications('top','center','success','Asset Parameter has been updated Successfully!!');

                    }
                   
                    $scope.assetConfig();
                    $scope.parameterConfig = {};
                    $scope.consumptionMonitoringRequired = "";
                    $scope.selectedParameterUOM = {};
                    $scope.selectedParameter = {};
                    $scope.loadingStop();

                    //$scope.loadAllParameters();
                }).catch(function (response) {
                    $scope.loadingStop();
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
           
            $scope.loadingStart();

	    	$scope.uploadObj.type = 'document';


            if($scope.assetVal.id){

                $scope.uploadObj.assetId = $scope.assetVal.id;

            }else if($stateParams.id){

                 $scope.uploadObj.assetId = $stateParams.id;
            }


	    	AssetComponent.getAllUploadedFiles($scope.uploadObj).then(function(data){
                
                $scope.uploadFiles = [];
	    		$scope.uploadFiles=data;
	    		
                $scope.fileCount = ($scope.uploadFiles).length;

                console.log("-- Upload files --" , $scope.uploadFiles);
                $scope.loadingStop();
	    	}).catch(function(response){
                $scope.loadingStop();
            });
	    }

	    $scope.getAllUploadedPhotos = function() {

            $scope.loadingStart();

	    	$scope.photoObj.type = 'image';

            if($scope.assetVal.id){

                $scope.photoObj.assetId = $scope.assetVal.id;

            }else if($stateParams.id){

                 $scope.photoObj.assetId = $stateParams.id;
            }

	    	AssetComponent.getAllUploadedPhotos($scope.photoObj).then(function(data){
               
                $scope.uploadAssetPhotos = [];
                $scope.uploadAssetPhotos=data;
                $scope.photoCount = ($scope.uploadAssetPhotos).length;

                console.log("-- Uploaded Photos --",$scope.uploadAssetPhotos);
                $scope.loadingStop();
	    	}).catch(function(response){
                $scope.loadingStop();
            });
	    }

	    $scope.uploadAssetFile = function() {

                if(!$scope.assetVal.id && !$stateParams.id){

                      $scope.showNotifications('top','center','danger','Please create asset first..');

                    }else{

    	     	if($scope.selectedClientFile) {

    	        	console.log("file title - " + $scope.uploadAsset.title + "file name -" + $scope.selectedClientFile);

                    if($scope.assetVal.id){
                        $scope.uploadAsset.assetId = $scope.assetVal.id;

                    }else if($stateParams.id){

                         $scope.uploadAsset.assetId = $stateParams.id;
                    }


    	        	$scope.uploadAsset.uploadFile = $scope.selectedClientFile;
    	        	//$scope.uploadAsset.assetId = 1;
    	        	$scope.uploadAsset.type = 'document';
    	        	console.log($scope.uploadAsset);


                    $rootScope.loadingStart();
    	        	AssetComponent.uploadAssetFile($scope.uploadAsset).then(function(data){
                        $scope.loadingStop();
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
                        $scope.loadingStop();
    	        		console.log('Import error');
    	        		console.log(err);
    	        	}).catch(function(response){
                $scope.loadingStop();
                $scope.showNotifications('top','center','danger','Unable to  upload file..');
            });
            	} else {
            		console.log('select a file');
            	}
            }

	    }

	    $scope.uploadAssetPhotoFile = function() {

        if(!$scope.assetVal.id && !$stateParams.id){

            $scope.showNotifications('top','center','danger','Please create asset first..');

        }else{
	    	console.log($scope.selectedPhotoFile);

	    	console.log($scope.uploadAssetPhoto.title);

	     	if($scope.selectedPhotoFile) {
	        	console.log('selected asset file - ' + $scope.selectedPhotoFile);

	        	$scope.uploadAssetPhoto.uploadFile = $scope.selectedPhotoFile;

                if($scope.assetVal.id){
                        $scope.uploadAssetPhoto.assetId = $scope.assetVal.id;

                    }else if($stateParams.id){

                         $scope.uploadAssetPhoto.assetId = $stateParams.id;
                    }
	        	//$scope.uploadAssetPhoto.assetId = 1;
	        	$scope.uploadAssetPhoto.type = 'image';

	        	console.log($scope.uploadAssetPhoto);
                $scope.loadingStart();
	        	AssetComponent.uploadAssetPhoto($scope.uploadAssetPhoto).then(function(data){
	        		console.log(data);
                    $scope.loadingStop();
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
                    $scope.loadingStop();
	        		console.log('Import error');
	        		console.log(err);
	        	}).catch(function(response){
                $scope.loadingStop();
                $scope.showNotifications('top','center','danger','Unable to  upload file..');
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
        
        $scope.amcFromMsg =false;

	    $('input#dateFilterAmcFrom').on('dp.change', function(e){
            $scope.amcSchedule.startDate = e.date._d;
            $scope.amcFrom = $filter('date')(e.date._d, 'dd/MM/yyyy');

            if($scope.amcSchedule.startDate > $scope.amcSchedule.endDate) {

                    //scope.showNotifications('top','center','danger','From date cannot be greater than To date');
                    $scope.amcFromMsg = true;
                    
                    
                    //return false;
            }else {
              
               $scope.amcFromMsg =false;
               
           
            }
            if($scope.amcSchedule.endDate < $scope.amcSchedule.startDate) {
                    //$scope.showNotifications('top','center','danger','To date cannot be lesser than From date');
                    $scope.amcToMsg =true;
                    
                   
                    //return false;
            }else {
               
                 $scope.amcToMsg =false;
                 
               
            }
        });

         $scope.amcToMsg =false;

        $('input#dateFilterAmcTo').on('dp.change', function(e){
            $scope.amcSchedule.endDate = e.date._d;
            $scope.amcTo = $filter('date')(e.date._d, 'dd/MM/yyyy');

            if($scope.amcSchedule.endDate < $scope.amcSchedule.startDate) {
                    //$scope.showNotifications('top','center','danger','To date cannot be lesser than From date');
                    $scope.amcToMsg =true;
                    
                   
                    //return false;
            }else {
               
                 $scope.amcToMsg =false;
                 
               
            }
            if($scope.amcSchedule.startDate > $scope.amcSchedule.endDate) {

                    //scope.showNotifications('top','center','danger','From date cannot be greater than To date');
                    $scope.amcFromMsg = true;
                    
                    
                    //return false;
            }else {
              
               $scope.amcFromMsg =false;
               
           
            }
        });
        
        $('input#amcJobStartTime').on('dp.change', function(e){  
            $scope.amcSchedule.jobStartTime = e.date._d;
             $scope.amcJobStartTimeTmp = $filter('date')(e.date._d, 'dd/MM/yyyy hh:mm a');
             $scope.amcJobStartTime = $filter('date')(e.date._d, 'hh:mm a');
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

            if(!$scope.assetVal.id && !$stateParams.id){

                  $scope.showNotifications('top','center','danger','Please create asset first..');

            }else{

                if($scope.assetVal.id){

                    $scope.amcSchedule.assetId= $scope.assetVal.id;

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
		
		    	    	$scope.shiftTimings = [];
		    	    	if($scope.selectedShift) {
			    	    	$scope.shiftTimings.push($scope.selectedShift.startTime +'-' +$scope.selectedShift.endTime);
		    	    	}
		    	    	$scope.amcSchedule.shiftTimings = $scope.shiftTimings;
		    	    	//$scope.amcSchedule.maintenanceType = 'AMC';
		
		    	    	console.log("To be create AMC schedule",$scope.amcSchedule);
		
		                 $scope.loadingStart();
		
		    	    	AssetComponent.saveAmcSchedule($scope.amcSchedule).then(function(data){
		    	    		console.log(data);
		    	    		if(data) {
		    	    			console.log(data.checklistId);
		    	    			//$scope.amcScheduleList.push(data);
		                        $scope.loadAmcSchedule();
		                        $scope.showNotifications('top','center','success','AMC Schedule has been added Successfully!!');
		                        $scope.amcSchedule = {};
		
		                        $scope.selectedChecklist = {};
		                        $scope.selectedEmployee = {};
		                        $scope.selectedFrequencyPrefix = {};
		                        $scope.selectedFreqDuration = {};
		                        $scope.selectedFrequency = {};

		
		                        $scope.amcFrom = "";
		                        $scope.amcTo = "";
                                $scope.amcJobStartTime = "";
		
		                        $("#dateFilterAmcFrom").val("");
		                        $("#dateFilterAmcTo").val("");
		                       
		
		
		    	    		}
		    	    	}).catch(function (response) {
	
	                    $scope.loadingStop();
	
	                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
	                    $scope.errorProjectExists = 'ERROR';
	                    $scope.showNotifications('top','center','danger','AMC Schedule Already Exists');
	                } else {
	                    $scope.error = 'ERROR';
	                     $scope.showNotifications('top','center','danger','Unable to creating AMC Schedule. Please try again later..');
	                }
	
	
	            });
	
	       }

	    }

	    $scope.loadAmcSchedule = function() {

            $scope.loadingStart();

            var item_ar = [];

            if($scope.assetVal.id){

                    var assetId= $scope.assetVal.id;

                }else if($stateParams.id){

                     var assetId = $stateParams.id;
                }

	    	AssetComponent.findByAssetAMC(assetId).then(function(data) {

                $scope.loadingStop();

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

                   }).catch(function(){
                       $scope.loadingStop();
                       //$scope.showNotifications('top','center','danger','Error in  AMC schedule list. Please try again later..');
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

        /*$scope.printDiv = function(printable) {
            var printContents = document.getElementById(printable).innerHTML;
            var originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
        }*/

        $scope.printDiv = function(printable) {
              var printContents = document.getElementById(printable).innerHTML;
              var popupWin = window.open('', '_blank', 'width=1400,height=600');
              popupWin.document.open();
              popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="../assets/css/custom.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
              popupWin.document.close();
         } 

		/**
		 * View Readings*/

        $scope.noReading = false;

        $scope.loadAssetReadings = function() {
            $rootScope.loadingStart();
            var redCurrPageVal = ($scope.pages ? $scope.pages.currPage : 1);
                    if(!$scope.redSearchCriteria) {
                        var redSearchCriteria = {
                                currPage : redCurrPageVal
                        };
                        $scope.redSearchCriteria = redSearchCriteria;
                    }

                $scope.redSearchCriteria.currPage = redCurrPageVal;
                $scope.redSearchCriteria.module = "Readings";
                $scope.redSearchCriteria.assetId = $stateParams.id;
            $scope.assetReadings = "";
        	console.log('Readings search criteria',$scope.redSearchCriteria);
        	AssetComponent.findByAssetReadings($scope.redSearchCriteria).then(function(data){
                $rootScope.loadingStop();
        		console.log('View Readings - ' +JSON.stringify(data));
        		if(data.transactions != null) {
        			$scope.assetReadings = data.transactions;
            		$scope.viewAssetReading(data.transactions[0].id);


                 /*
                ** Call pagination  main function **
                */

                $scope.pager = {};
                $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                $scope.totalCountPages = data.totalCount;

                console.log("Pagination",$scope.pager);
                console.log("Readings List - ", data);


        		}else{
        			console.log('No readings');
        			$scope.noReading = true;
        			$scope.assetReadings = [];
        		}

        	});
        }

        $scope.viewAssetReading = function(id) {
            $rootScope.loadingStart();
            $scope.viewRead = id;
        	AssetComponent.findByReadingId(id).then(function(data){
                $rootScope.loadingStop();
        		console.log(data);
        		$scope.readingData = data;
        	});

        }

        /**End view Readings*/



        $scope.loadEmployees = function () {
            //var deferred = $q.defer();
            if($scope.assetList.siteId){
               var empParam = {siteId:$scope.assetList.siteId,list:true};
            } else if($scope.assetVal.siteId) {
                var empParam = {siteId:$scope.assetVal.siteId,list:true};
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
            $scope.loadingStart();
            var amcCurrPageVal = ($scope.pages ? $scope.pages.currPage : 1);
                    if(!$scope.amcSearchCriteria) {
                        var amcSearchCriteria = {
                                currPage : amcCurrPageVal
                        };
                        $scope.amcSearchCriteria = amcSearchCriteria;
                    }

                $scope.amcSearchCriteria.currPage = amcCurrPageVal;

        	$scope.amcSearchCriteria.maintenanceType = "AMC";
        	$scope.amcSearchCriteria.assetId = $stateParams.id;
            $scope.amcJobLists = "";
        	console.log('AMC search criteria',$scope.amcSearchCriteria);
        	JobComponent.search($scope.amcSearchCriteria).then(function(data){
                $scope.loadingStop();
        		console.log(data);
        		$scope.amcJobLists = data.transactions;

               /*
                ** Call pagination  main function **
                */

                $scope.pager = {};
                $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                $scope.totalCountPages = data.totalCount;
        	}).catch(function(){
                 $scope.loadingStop();
                 $scope.showNotifications('top','center','danger','Unable to loading AMC jobs. Please try again later..');
            });
        }

        $scope.loadPPMJobs = function() {
                $scope.loadingStart();
                 var ppmCurrPageVal = ($scope.pages ? $scope.pages.currPage : 1);
                    if(!$scope.ppmSearchCriteria) {
                        var ppmSearchCriteria = {
                                currPage : ppmCurrPageVal
                        };
                        $scope.ppmSearchCriteria = ppmSearchCriteria;
                    }

                $scope.ppmSearchCriteria.currPage = ppmCurrPageVal;
	        	$scope.ppmSearchCriteria.maintenanceType = "PPM";
	        	$scope.ppmSearchCriteria.assetId = $stateParams.id;

	        	console.log('PPM search criteria',$scope.ppmSearchCriteria);
                $scope.ppmJobLists = "";
	        	JobComponent.search($scope.ppmSearchCriteria).then(function(data){
                    $rootScope.loadingStop();
	        		console.log(data);
	        		$scope.ppmJobLists = data.transactions;

                    /*
                    ** Call pagination  main function **
                    */

                $scope.pager = {};
                $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                $scope.totalCountPages = data.totalCount;

                console.log("Pagination",$scope.pager);
                console.log("PPM Job List - ", data);

	        	}).catch(function(){
                    $scope.showNotifications('top','center','danger','Unable toLoading PPM Jobs. Please try again later..');
                    $scope.loadingStop();
                });

        }
        
        $scope.loadStatus = function() {
            AssetComponent.getStatus().then(function(data) {
                console.log('Asset status list-- ',data);
                $scope.statuses = data;
            });
        }


        $scope.loadAllRules = function() {
        	AssetComponent.getAllRules().then(function(data) {
        		console.log(data);
        		$scope.readingRules = data;
        	});
        }


        $scope.cancel = function(){

             $location.path('/assets');
                
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



    $scope.initFullCalendar = function(eventsData) {
        var calendar = $('#fullCalendar');

        var today = new Date();
        var y = today.getFullYear();
        var m = today.getMonth();
        var d = today.getDate();

        calendar.fullCalendar({
            viewRender: function(view, element) {
                // We make sure that we activate the perfect scrollbar when the view isn't on Month
                if (view.name != 'month') {
                    $(element).find('.fc-scroller').perfectScrollbar();
                }
            },
            header: {
                left: 'title',
                center: 'month,agendaWeek,agendaDay',
                //right: 'prev,next,today'
                right: 'today'
            },
            defaultDate: today,
            selectable: true,
            selectHelper: true,
            views: {
                month: { // name of view
                    titleFormat: 'MMMM YYYY'
                    // other view-specific options here
                },
                week: {
                    titleFormat: " MMMM D YYYY"
                },
                day: {
                    titleFormat: 'D MMM, YYYY'
                }
            },

            select: function(start, end) {

                // on select we show the Sweet Alert modal with an input
                swal({
                    title: 'Create an Schedule',
                    html: '<div class="form-group">' +
                        '<input type "text" class="form-control" placeholder="Schedule Title" id="input-title">' +
                        '</div>'+
                        '<div class="form-group">' +
                        '<input type "text" class="form-control" placeholder="Schedule Description" id="input-desc" >' +
                        '</div>'+
                        '<div class="form-group">' +
                        '<input type "text" class="form-control" placeholder="DD/MM/YYYY" id="input-fdate" >' +
                        '</div>'+
                        '<div class="form-group">' +
                        '<input type "text" class="form-control" placeholder="DD/MM/YYYY" id="input-tdate" >' +
                        '</div>'+
                        '<div class="form-group">' +
                        '<input type "text" class="form-control" placeholder="Weekly" id="input-frq" >' +
                        '</div>',
                    showCancelButton: true,
                    confirmButtonClass: 'btn btn-success',
                    cancelButtonClass: 'btn btn-danger',
                    buttonsStyling: false
                }).then(function(result) {

                    var eventData;
                    event_title = $('#input-title').val();
                    event_desc = $('#input-desc').val();
                    event_frq = $('#input-frq').val();

                    if (event_title) {
                        eventData = {
                            title: event_title,
                            start: start,
                            end: end
                        };
                        $calendar.fullCalendar('renderEvent', eventData, true); // stick? = true
                    }

                    $calendar.fullCalendar('unselect');

                });
            },
            editable: true,
            eventLimit: true, // allow "more" link when too many events


            // color classes: [ event-blue | event-azure | event-green | event-orange | event-red ]

            events:eventsData,

            /*events: [{
                    title: 'Vaccum Cleaner',
                    start: new Date(y, m, 1),
                    className: 'event-default'
                },
                {
                    id: 999,
                    title: 'Ac maintenance',
                    start: new Date(y, m, d - 4, 6, 0),
                    allDay: false,
                    className: 'event-rose'
                }
              
            ],*/

            eventClick: function(calEvent, jsEvent, view) {

            //alert('Event: ' + calEvent.title);
            if(calEvent.start !=''){
                var d = new Date(calEvent.start);
                var inputFdate=d.toLocaleString(); // 7/25/2016, 1:35:07 PM
            }else{
              var inputFdate= '';
            }
            if(calEvent.end !=null){
               var d = new Date(calEvent.end);
                var inputTdate=d.toLocaleString(); // 7/25/2016, 1:35:07 PM
            }else{
              var d = new Date(calEvent.start);
              var inputTdate=d.toLocaleString(); // 7/25/2016, 1:35:07 PM
            }

            swal({
                    title: 'View schedule',
                    html: '<div class="form-group">' +
                        '<input type "readonly" class="form-control" placeholder="Schedule Title" id="input-title" value="'+calEvent.title+'">' +
                        '</div>'+
                        '<div class="form-group">' +
                        '<input type "readonly" class="form-control" placeholder="Schedule Description" id="input-desc" >' +
                        '</div>'+
                        '<div class="form-group">' +
                        '<input type "readonly" class="form-control" placeholder="DD/MM/YYYY" id="input-fdate" value="'+inputFdate+'" >' +
                        '</div>'+
                        '<div class="form-group">' +
                        '<input type "readonly" class="form-control" placeholder="DD/MM/YYYY" id="input-tdate" value="'+inputTdate+'">' +
                        '</div>'+
                        '<div class="form-group">' +
                        '<input type "readonly" class="form-control" placeholder="Weekly" id="input-frq" value="">' +
                        '</div>',
                    showCancelButton: true,
                    confirmButtonClass: 'btn btn-success',
                    cancelButtonClass: 'btn btn-danger',
                    buttonsStyling: false
                });

            // change the border color just for fun
            $(this).css('border-color', 'red');

          }


        });
    }


     /* Multiple check box select(Multiple qr printing) Start */

                // This scope will be bound to checkbox in table header
               $scope.allItemsSelected = false;
               
            
    
            // This executes when entity in table is checked

            $scope.checkboxSel= [];

            

            $scope.selectEntity = function (id) {

                if($scope.checkboxSel.indexOf(id) <= -1){
                
                $scope.checkboxSel.push(id); 
               
                }else if($scope.checkboxSel.indexOf(id) > -1){

                    var remId =$scope.checkboxSel.indexOf(id);

                   $scope.checkboxSel.splice(remId, 1);   
                }

                


                // If any entity is not checked, then uncheck the "allItemsSelected" checkbox

                for (var i = 0; i <= $scope.assets.length; i++) {
                    
                    if (!$scope.assets[i].isChecked) {
                        $scope.allItemsSelected = false;
                        return;
                    }

                    
                }

    
                //If not the check the "allItemsSelected" checkbox
                $scope.allItemsSelected = true;
            };
    
            // This executes when checkbox in table header is checked
            $scope.selectAll = function () {

                $scope.checkboxSel=[]; 


                // Loop through all the entities and set their isChecked property
                for (var i = 0; i < $scope.assets.length; i++) {

                    $scope.checkboxSel.push($scope.assets[i].id); 

                    $scope.assets[i].isChecked = $scope.allItemsSelected;
                }

                if(!$scope.allItemsSelected){

                    $scope.checkboxSel=[]; 
                }
                 

                 //alert($scope.checkboxSel);

                
            };

             /* Multiple check box select(Multiple qr printing) End */

             $scope.qrListLoad= function(ids){
                $scope.loadingStart();
                $scope.qrStatus = false;
                if($stateParams.ids){
                        $scope.qrStatus = true;
                        $scope.assetQrList ={}
                        AssetComponent.multipleQr($stateParams.ids).then(function(data){
                        $scope.loadingStop();
                        $scope.assetQrList = data;
                        //$location.path('/qr-code-list');
                        console.log('Qr List',$scope.assetQrList);
                    });
                }else{
                   
                    $scope.loadingStop();
                }

            }



    });
