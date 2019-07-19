'use strict';

angular.module('timeSheetApp')
.controller(
		'AssetController',
		function($scope, $rootScope, $state, $timeout, AssetComponent,
				ProjectComponent,LocationComponent,SiteComponent,EmployeeComponent, $http, $stateParams,
				$location,PaginationComponent,AssetTypeComponent,ParameterConfigComponent,ParameterComponent,
				ParameterUOMComponent,VendorComponent,ManufacturerComponent,$sce,ChecklistComponent,$filter,
				JobComponent,InventoryTransactionComponent,$interval,getLocalStorage,Idle) {
            Idle.watch();
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
			$scope.selectedAssetType = null;
			$scope.selectedAssetGroup = null;
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
			$scope.searchAssetType =null;
			$scope.searchSite =null;
			$scope.searchProject =null;
			$scope.searchAssetGroup =null;
			$scope.searchAcquiredDateSer =null;
			$scope.searchCreatedDateSer =null;
			$scope.ppmSearchCriteria = {};
			$scope.amcSearchCriteria = {};
			$scope.dlpSearchCriteria = {};
			$scope.assetSparesSearchCriteria = {};
			$scope.redSearchCriteria = {};
			$scope.ppmFrom = null;
			$scope.ppmTo = null;
			$scope.amcFrom = null;
			$scope.amcTo = null;
			$scope.btnDisabled = false;
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
			$scope.assetQrList =null;
			$scope.selectedEmployee ={};
			$scope.siteHistorySearchCriteria ={};
			$scope.statusHistorySearchCriteria ={};
			$scope.ticketSearchCriteria ={};
			$scope.minError =false;
			$scope.maxError =false;
			$rootScope.exportStatusObj  ={};
			$scope.searchModule ="";
			$scope.assetQrSite =null;
            $scope.isReleationShipEnabled = false;
            $scope.criticalStatusList = [];
            $scope.displayImage = "";
            $scope.statuses = [];
            $scope.mttr =0;
            $('#dPlayNone').hide();

			//scope.searchAcquiredDate = $filter('date')(new Date(), 'dd/MM/yyyy');
			$scope.searchAcquiredDate = "";
			$scope.searchCreatedDate = "";

			$scope.ticketConfigStatuses = [];
			$scope.asset = {};

			$scope.assetEdit = {};

			$scope.assetEdit.warFromDate1  =null;
			$scope.assetEdit.warToDate1  =null;
			$scope.warFromDate1  =null;
			$scope.warToDate1  =null;
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

			/** Ui-select scopes **/
			$scope.allClients = {id:0 , name: '-- ALL CLIENTS --'};
			$scope.client = {};
			$scope.clients = [];
			$scope.allSites = {id:0 , name: '-- ALL SITES --'};
			$scope.sitesListOne = {};
			$scope.sitesLists = [];
			$scope.sitesListOne.selected =  null;
			$scope.allRegions = {id:0 , name: '-- SELECT REGIONS --'};
			$scope.regionsListOne = {};
			$scope.regionsLists = [];
			$scope.regionsListOne.selected =  null;
			$scope.allBranchs = {id:0 , name: '-- SELECT BRANCHES --'};
			$scope.branchsListOne = {};
			$scope.branchsLists = [];
			$scope.branchsListOne.selected =  null;
			$scope.allAssetType = {name: '-- ALL ASSET TYPE --'};
			$scope.assetTypesListOne = {};
			$scope.assetTypesLists = [];
			$scope.allAssetGroup = {assetgroup: '-- ALL ASSET GROUP --'};
			$scope.assetGroupsListOne = {};
			$scope.assetGroupsLists = [];

			$scope.selectedParentGroup = {};

			$scope.choosenAssetParent = {};

			//console.log("state params",$stateParams);

			var that =  $scope;
			$rootScope.exportStatusObj  ={};

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

			$scope.openCalendar = function(e,cmp) {
				e.preventDefault();
				e.stopPropagation();

				that.calendar[cmp] = true;
			};

			$scope.initMaterialWizard = function(){

				demo.initMaterialWizard();


			};

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

			};

			$scope.ppmFromMsg =false;

			/*$('#dateFilterPpmFrom').datetimepicker().on('dp.show', function (e) {
				return $(this).data('DateTimePicker').minDate(e.date);
			});*/

			/*$('input#dateFilterPpmFrom').on('dp.change', function(e){
				$scope.ppmTo = "";
				$scope.assetPPM.startDate = new Date(e.date._d);
				$scope.ppmFrom = $filter('date')(e.date._d, 'dd/MM/yyyy');
				$('#dateFilterPpmTo').datetimepicker().on('dp.show', function () {
					return $(this).data('DateTimePicker').minDate(e.date);
				});

				$scope.assetPPM.jobStartTime = '';
				$scope.ppmJobStartTime ='';
				$scope.ppmJobStartTimeTmp ='';

				$('input#ppmJobStartTime').datetimepicker().on('dp.show', function () {
					return $(this).data('DateTimePicker').minDate(e.date);
				});

				// if($scope.assetPPM.startDate > $scope.assetPPM.endDate) {
				//
				//         //scope.showNotifications('top','center','danger','From date cannot be greater than To date');
				//         $scope.ppmFromMsg = true;
				//
				//
				//         //return false;
				// }else {
				//
				//    $scope.ppmFromMsg =false;
				//
				//
				// }
				//
				// if($scope.assetPPM.endDate < $scope.assetPPM.startDate) {
				//         //$scope.showNotifications('top','center','danger','To date cannot be lesser than From date');
				//         $scope.ppmToMsg =true;
				//
				//
				//         //return false;
				// }else {
				//
				//      $scope.ppmToMsg =false;
				//
				//
				// }
			});*/

			$scope.ppmToMsg =false;

			/*$('input#dateFilterPpmTo').on('dp.change', function(e){
				$scope.assetPPM.endDate = new Date(e.date._d);
				$scope.ppmTo = $filter('date')(e.date._d, 'dd/MM/yyyy');
				//
				// if($scope.assetPPM.endDate < $scope.assetPPM.startDate) {
				//         //$scope.showNotifications('top','center','danger','To date cannot be lesser than From date');
				//         $scope.ppmToMsg =true;
				//
				//
				//         //return false;
				// }else {
				//
				//      $scope.ppmToMsg =false;
				//
				//
				// }
				//
				// if($scope.assetPPM.startDate > $scope.assetPPM.endDate) {
				//
				//         //scope.showNotifications('top','center','danger','From date cannot be greater than To date');
				//         $scope.ppmFromMsg = true;
				//
				//
				//         //return false;
				// }else {
				//
				//    $scope.ppmFromMsg =false;
				//
				//
				// }
			});*/

            $('#dateFilterPpmFrom').datetimepicker().on('dp.show', function (e) {
                return $(this).data('DateTimePicker').minDate(e.date);
            });

            $scope.assetPPM.startDate  = null;
            $scope.assetPPM.endDate = null;

			$('input#dateFilterPpmFrom').on('dp.change', function(e){

            $scope.assetPPM.jobStartTime = '';
            $scope.ppmJobStartTime ='';
            $scope.ppmJobStartTimeTmp ='';
            $scope.assetPPM.startDate = new Date(e.date._d);
            $scope.ppmFrom = $filter('date')(e.date._d, 'dd/MM/yyyy');
            $scope.assetPPM.startDate.setHours(0,0,0,0);
            if($scope.assetPPM.endDate){
                $scope.assetPPM.endDate.setHours(0,0,0,0);
            }

            if($scope.assetPPM.startDate && $scope.assetPPM.endDate){
                if($scope.assetPPM.startDate > $scope.assetPPM.endDate && $scope.assetPPM.startDate != $scope.assetPPM.endDate){
                    $scope.fromErrMsg = 'From date cannot be greater than To date';

                    alert($scope.fromErrMsg);

                    $('input#dateFilterPpmFrom').data('DateTimePicker').clear();
                    $('input#dateFilterPpmTo').data('DateTimePicker').clear();
                    $scope.assetPPM.startDate = new Date();
                    $scope.ppmFrom = $filter('date')(new Date(), 'dd/MM/yyyy');
                    $scope.assetPPM.endDate = new Date();
                    $scope.ppmTo = $filter('date')(new Date(), 'dd/MM/yyyy');
                    $('input#dateFilterPpmFrom').val($scope.ppmFrom);
                    $('input#dateFilterPpmTo').val($scope.ppmTo);

                    return false;
                }
            }


        });

        $('input#dateFilterPpmTo').on('dp.change', function(e){

            $scope.toErrMsg = '';

            $scope.assetPPM.endDate = new Date(e.date._d);
            $scope.ppmTo = $filter('date')(e.date._d, 'dd/MM/yyyy');
            $scope.assetPPM.endDate.setHours(0,0,0,0);
            if($scope.assetPPM.startDate){
                $scope.assetPPM.startDate.setHours(0,0,0,0);
            }

            if($scope.assetPPM.startDate && $scope.assetPPM.endDate){
                if($scope.assetPPM.startDate > $scope.assetPPM.endDate && $scope.assetPPM.startDate != $scope.assetPPM.endDate){
                    $scope.toErrMsg = 'To date cannot be lesser than From date';

                    alert($scope.toErrMsg);

                    $('input#dateFilterPpmFrom').data('DateTimePicker').clear();
                    $('input#dateFilterPpmTo').data('DateTimePicker').clear();
                    $scope.assetPPM.startDate = new Date();
                    $scope.ppmFrom = $filter('date')(new Date(), 'dd/MM/yyyy');
                    $scope.assetPPM.endDate = new Date();
                    $scope.ppmTo = $filter('date')(new Date(), 'dd/MM/yyyy');
                    $('input#dateFilterPpmFrom').val($scope.ppmFrom);
                    $('input#dateFilterPpmTo').val($scope.ppmTo);

                    return false;
                }
            }


        });

			$('input#ppmJobStartTime').on('dp.change', function(e){
				$scope.assetPPM.jobStartTime = new Date(e.date._d);
				$scope.ppmJobStartTime =$filter('date')(e.date._d, 'hh:mm a');
				$scope.ppmJobStartTimeTmp =$filter('date')(e.date._d, 'dd/MM/yyyy hh:mm a');
			});


			//Filter

			// Load Clients for selectbox //
			$scope.clientFilterDisable = true;
			$scope.uiClient = [];
			$scope.getClient = function (search) {
				var newSupes = $scope.uiClient.slice();
				if (search && newSupes.indexOf(search) === -1) {
					newSupes.unshift(search);
				}

				return newSupes;
			}
			//

			// Load Sites for selectbox //
			$scope.siteFilterDisable = true;
			$scope.uiSite = [];
			$scope.getSite = function (search) {
				var newSupes = $scope.uiSite.slice();
				if (search && newSupes.indexOf(search) === -1) {
					newSupes.unshift(search);
				}
				return newSupes;
			}

			//

			// Load Asset Type for selectbox //
			$scope.typeFilterDisable = true;
			$scope.uiType = [];
			$scope.getType = function (search) {
				var newSupes = $scope.uiType.slice();
				if (search && newSupes.indexOf(search) === -1) {
					newSupes.unshift(search);
				}

				return newSupes;
			}
			//

			// Load Group Type for selectbox //
			$scope.groupFilterDisable = true;
			$scope.uiGroup = [];
			$scope.getGroup = function (search) {
				var newSupes = $scope.uiGroup.slice();
				if (search && newSupes.indexOf(search) === -1) {
					newSupes.unshift(search);
				}

				return newSupes;
			}
			//

			//
			$scope.hideType = false;
			$scope.hideGroup = false;
			$scope.loadSearchProject = function (searchProject) {
				$scope.filter = false;
				$scope.siteSpin = true;
				$scope.hideSite = false;
				$scope.hideType = false;
				$scope.hideGroup = false;
				$scope.clearField = false;
				$scope.uiSite.splice(0,$scope.uiSite.length)
				$scope.searchSite = null;
				$scope.searchProject = $scope.projects[$scope.uiClient.indexOf(searchProject)];
			}


			$scope.loadSearchSite = function (searchSite) {
				$scope.hideSite = true;
				$scope.hideType = false;
				$scope.hideGroup = false;
				$scope.searchSite = $scope.sites[$scope.uiSite.indexOf(searchSite)];
			}

			$scope.loadSearchType = function (searchAssetType) {
				$scope.filter = false;
				$scope.clearField = false;
				$scope.hideType = true;
				$scope.hideGroup = false;
				$scope.searchAssetType = $scope.assetTypes[$scope.uiType.indexOf(searchAssetType)];
				//console.log($scope.searchAssetType)
			}

			$scope.loadSearchGroup = function (searchAssetGroup) {
				$scope.clearField = false;
				$scope.hideGroup = true;
				$scope.searchAssetGroup = $scope.assetGroups[$scope.uiGroup.indexOf(searchAssetGroup)];
			}

			//

			// Filter End



			$scope.initPPMSchedule = function() {
				$scope.loadSiteShifts();
			}

			$scope.savePPMSchedule = function (){


				//console.log(" --- Create asset ppm ---" ,$scope.assetPPM.title);


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

                    if($scope.assetPPM.jobStartTime){
                        var startDate= $scope.assetPPM.startDate;
                        var startDateTime= $scope.assetPPM.jobStartTime;
                        var startTime = startDate.setHours(startDateTime.getHours());
                        $scope.assetPPM.jobStartTime = new Date(startTime);
                    }
					//console.log("To be create PPM",$scope.assetPPM);

					$scope.loadingStart();

					AssetComponent.createPPM($scope.assetPPM).then(function(response) {



						////console.log("PPM schedule response",JSON.stringify(response));

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
						//console.log('Error - '+ response.data);
						//console.log('status - '+ response.status + ' , message - ' + response.data.message);
						if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
							$scope.errorAssetsExists = 'ERROR';
							$scope.showNotifications('top','center','danger','PPM schedule Already Exists');

							//console.log($scope.errorAssetsExists);
						} else {
							$scope.showNotifications('top','center','danger','Unable to creating PPM schedule. Please try again later..');
							$scope.error = 'ERROR';
						}
					});


				}
			}


			//Conformation modal

			$scope.conform = function(text)
			{
				//console.log($scope.selectedProject)
				$rootScope.conformText = text;
				$('#conformationModal').modal();

			}
			$rootScope.back = function (text) {
				if(text == 'cancel'  || text == 'back')
				{
					/** @reatin - retaining scope value.**/
					$rootScope.retain=1;
					$scope.cancel();
				}
				else if(text == 'save')
				{
					$scope.saveAsset();
				}
				else if(text == 'update')
				{
					/** @reatin - retaining scope value.**/
					$rootScope.retain=1;
					$scope.updateAsset()
				}
			};

			//

			$scope.loadProjects = function () {
				ProjectComponent.findAll().then(function (data) {
					//console.log("Loading all projects")
					$scope.projects = data;

					/** Ui-select scope **/
					$scope.clients[0] = $scope.allClients;
					/*for(var i=0;i<$scope.projectsList.length;i++)
                {
                    $scope.uiClient[i] = $scope.projectsList[i].name;
                }*/
					for(var i=0;i<$scope.projects.length;i++)
					{
						$scope.clients[i+1] = $scope.projects[i];
					}

					$scope.clientDisable = false;
					$scope.clientFilterDisable = false;
					//
				});
			}


			$scope.loadManufacturer = function () {
				ManufacturerComponent.findAll().then(function (data) {
					////console.log("Loading all Manufacturer -- " , data);
					$scope.manufacturers = data;
					$scope.loadingStop();
				});
			}

			$scope.addManufacturer = function () {

				//console.log("add manufacturer",$scope.manufacturer);
				$scope.loadingStart();
				if($scope.manufacturer){
					//console.log("Manufacturer entered");
					ManufacturerComponent.create($scope.manufacturer).then(function (response) {
						//console.log(response);
						$scope.manufacturer = "";
						$scope.showNotifications('top','center','success','Manufacturer has been added Successfully!!');
						$scope.loadManufacturer();


					}).catch(function(){
						$scope.loadingStop();
						$scope.showNotifications('top','center','danger','Unable to Manufacturer add. Please try again later..');
						$scope.error = 'ERROR';
					});
				}else{
					//console.log("Manufacturer not entered");
				}


			}

			$scope.loadVendor = function () {

				VendorComponent.findAll().then(function (data) {
					////console.log("Loading all Vendor -- " , data)
					$scope.vendors = data;
					$scope.loadingStop();
				});
			}

			$scope.addVendor = function () {
				$scope.loadingStart();
				//console.log("add vendor",$scope.vendor);
				if($scope.vendor){

					//console.log("Asset Type entered");
					VendorComponent.create($scope.vendor).then(function (response) {
						//console.log(response);
						$scope.vendor = "";
						$scope.showNotifications('top','center','success','Vendor has been added Successfully!!');
						$scope.loadVendor();


					}).catch(function(){
						$scope.loadingStop();
						$scope.showNotifications('top','center','danger','Unable to in Vendor add. Please try again later..');
						$scope.error = 'ERROR';
					});
				}else{
					//console.log("Vendor not entered");
				}


			}

			$scope.loadWarranty = function () {
				AssetComponent.getWarList().then(function (data) {
					//console.log("Loading all service warranties -- " , data)
					$scope.servicewarranties = data;
					$scope.loadingStop();
				});
			}

			$scope.addWarranty = function () {
				$scope.loadingStart();
				//console.log("add Warranty",$scope.Warranty);
				if($scope.Warranty){

					//console.log("Asset Type entered");
					AssetComponent.createWar($scope.Warranty).then(function (response) {
						//console.log(response);
						$scope.servicewarranties = "";
						$scope.showNotifications('top','center','success','Service Warranty has been added Successfully!!');
						$scope.loadWarranty();


					}).catch(function(){
						$scope.loadingStop();
						$scope.showNotifications('top','center','danger','Unable to Service Warranty add. Please try again later..');
						$scope.error = 'ERROR';
					});
				}else{
					//console.log("Warranty not entered");
				}


			}


			/*  $scope.createAssetType = function () {
               AssetTypeComponent.create().then(function (data) {
                //console.log("Loading all AssetType -- " , data)
                $scope.assetTypes = data;
            });
        }*/



			$scope.loadAssetType = function () {
				$scope.searchAssetType = null;
				$scope.clearField = false;
				$scope.uiType.splice(0,$scope.uiType.length);
                var siteId = $scope.selectedSites ? $scope.selectedSites.id : 0;
                    AssetTypeComponent.findAll().then(function (data) {
                        ////console.log("Loading all AssetType -- " , data)
                        //$scope.selectedAssetType = null;
                        $scope.searchAssetType = null;
                        $scope.assetTypes = data;

                        //Filter
                        for(var i=0;i<$scope.assetTypes.length;i++)
                        {
                            $scope.uiType[i] = $scope.assetTypes[i].name;
                        }
                        $scope.typeFilterDisable = false;
                        //
                    });


			};

			$scope.relationShipBased = function(assetType){
			    console.log("Asset type changes");
			    console.log(assetType);
                if(assetType.relationShipBased){
                    $scope.isReleationShipEnabled = true;
                }else{
                    $scope.isReleationShipEnabled = false;
                }
            }

			$scope.loadAssetGroup = function () {
			    console.log("Loading Asset group");
				$scope.searchAssetGroup = null;
				$scope.clearField = false;
				$scope.uiGroup.splice(0,$scope.uiGroup.length);
				AssetComponent.loadAssetGroup().then(function (data) {
					////console.log("Loading all Asset Group -- " , data)
					$scope.searchAssetGroup = null;
					$scope.assetGroups = data;
					console.log(data);
					$scope.loadingStop();

					//Filter
					//console.log("=========",$scope.assetGroups)
					for(var i=0;i<$scope.assetGroups.length;i++)
					{
						$scope.uiGroup[i] = $scope.assetGroups[i].assetgroup;
					}
					$scope.groupFilterDisable = false;
					//

				});
			}

			$scope.loadAssetParent = function(){


				AssetComponent.loadAssetParent($scope.selectedSites).then(function(data){

					$scope.assetParentList = data;
					$scope.loadingStop();

				});

			}

			$scope.loadSelectedProject = function(projectId) {
				ProjectComponent.findOne(projectId).then(function (data) {
					$scope.selectedProject = data;

				});
			}

			$scope.loadBlocks = function () {
				//console.log('selected project -' + ($scope.selectedProject ? $scope.selectedProject.id : 0) + ', site -' + ($scope.selectedSites ? $scope.selectedSites.id : 0))
				$rootScope.selectedSite = $scope.selectedSites;
				var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
				var siteId = $scope.selectedSites ? $scope.selectedSites.id : 0;
				LocationComponent.findBlocks(0,siteId).then(function (data) {
					$scope.selectedBlock = null;
					$scope.selectedFloor = null;
					$scope.selectedZone = null;
					$scope.selectedAssetType = null;
					$scope.isReleationShipEnabled = false;
					$scope.blocks = data;
					//console.log("Loading all blocks -- " ,  $scope.blocks);
				});
			}

			$scope.loadFloors = function () {
				var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
				var siteId = $scope.selectedSites ? $scope.selectedSites.id : 0;
				var block= $scope.selectedBlock ? $scope.selectedBlock : null;
				LocationComponent.findFloors(0,siteId,block).then(function (data) {
					$scope.selectedFloor = null;
					$scope.selectedZone = null;
					$scope.floors = data;
					//console.log("Loading all floors -- " ,  $scope.floors);
				});
			}

			$scope.loadZones = function () {
				//console.log('load zones - ' + $scope.selectedSites.id +',' +$scope.selectedBlock +','+$scope.selectedFloor);
				var projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
				var siteId = $scope.selectedSites ? $scope.selectedSites.id : 0;
				var block= $scope.selectedBlock ? $scope.selectedBlock : null;
				var floor= $scope.selectedFloor ? $scope.selectedFloor : null;
				LocationComponent.findZones(0,siteId,block,floor).then(function (data) {
					$scope.selectedZone = null;
					$scope.zones = data;
					//console.log('zones list',$scope.zones);
				});
			}


			$scope.loadAllSites = function () {
				$scope.siteSpin = true;
				SiteComponent.findAll().then(function (data) {
					$scope.selectedSite = null;
					$scope.sites = data;
					$scope.loadingStop();

					//Filter
					for(var i=0;i<$scope.sites.length;i++)
					{
						$scope.uiSite[i] = $scope.sites[i].name;
					}
					$scope.siteSpin = false;
					$scope.siteFilterDisable = false;

					//
				});
			}

			$scope.loadDepSites = function () {
				if($scope.searchProject){
					$scope.siteFilterDisable = true;
					$scope.uiSite.splice(0,$scope.uiSite.length);
					$scope.clearField = false;
					$scope.searchSite = null;
					$scope.hideSite = false;
					ProjectComponent.findSites($scope.searchProject.id).then(function (data) {
						$scope.searchSite = null;
						$scope.sites = data;

						//Filter
						for(var i=0;i<$scope.sites.length;i++)
						{
							$scope.uiSite[i] = $scope.sites[i].name;
						}
						$scope.siteSpin = false;
						$scope.siteFilterDisable = false;

						//
					});
				}
			}

			/** Ui-select function **/

			$scope.loadDepSitesList = function (searchProject) {

				$scope.siteSpin = true;
				$scope.searchProject = searchProject;
				if(jQuery.isEmptyObject($scope.searchProject) == true){
					SiteComponent.findAll().then(function (data) {
						$scope.sitesList = data;
						$scope.sitesLists = [];
						$scope.sitesListOne.selected = null;
						$scope.sitesLists[0] = $scope.allSites;

						for(var i=0;i<$scope.sitesList.length;i++)
						{
							$scope.sitesLists[i+1] = $scope.sitesList[i];
						}

						$scope.siteFilterDisable = false;
						$scope.siteSpin = false;
					});
				}else{
					if(jQuery.isEmptyObject($scope.searchProject) == false){
						var depProj=$scope.searchProject.id;
					}else{
						var depProj=0;
					}

					ProjectComponent.findSites(depProj).then(function (data) {
						$scope.sitesList = data;
						$scope.sitesLists = [];
						$scope.sitesListOne.selected = null;
						$scope.sitesLists[0] = $scope.allSites;

						////console.log('Site List',$scope.sitesList);

						for(var i=0;i<$scope.sitesList.length;i++)
						{
							$scope.sitesLists[i+1] = $scope.sitesList[i];

						}

						$scope.siteFilterDisable = false;
						$scope.siteSpin = false;
					});
				}


			};

			$scope.regionFilterDisable = true;
			$scope.branchFilterDisable = true;

			/*** UI select (Region List) **/
			$scope.loadRegionsList = function (projectId, callback) {
				$scope.regionSpin = true;
				$scope.branchsLists = [];
				$scope.branchsListOne.selected = null;
				$scope.branchFilterDisable = true;
				SiteComponent.getRegionByProject(projectId).then(function (response) {
					//console.log(response);
					$scope.regionList = response;
					$scope.regionsLists = [];
					$scope.regionsListOne.selected = null;
					$scope.regionsLists[0] = $scope.allRegions;

					for(var i=0;i<$scope.regionList.length;i++)
					{
						$scope.regionsLists[i+1] = $scope.regionList[i];
					}

					//console.log('region list : ' + JSON.stringify($scope.regionList));
					$scope.regionSpin = false;
					$scope.regionFilterDisable = false;
					//callback();
				})
			};

			/*** UI select (Branch List) **/
			$scope.loadBranchList = function (projectId, callback) {

				if(projectId){

					if($scope.regionsListOne.selected){
						//console.log($scope.regionsListOne.selected);
						$scope.branchSpin = true;
						SiteComponent.getBranchByProject(projectId,$scope.regionsListOne.selected.id).then(function (response) {
							//console.log(response);
							$scope.branchList = response;
							if($scope.branchList) {
								$scope.branchsLists = [];
								$scope.branchsListOne.selected = null;
								$scope.branchsLists[0] = $scope.allBranchs;

								for(var i=0;i<$scope.branchList.length;i++)
								{
									$scope.branchsLists[i+1] = $scope.branchList[i];
								}
								/* if($scope.branchList) {
                                		for(var i = 0; i < $scope.branchList.length; i++) {
                                			$scope.uiBranch.push($scope.branchList[i].name);
                                		}*/
								$scope.branchSpin = false;
								$scope.branchFilterDisable = false;
							}
							else{
								//console.log('branch list : ' + JSON.stringify($scope.branchList));
								$scope.getSitesBYRegionOrBranch(projectId,$scope.regionsListOne.selected.name,null);
								$scope.branchSpin = false;
								$scope.branchFilterDisable = false;
								//callback();
							}

						})

					}else{
						$scope.showNotifications('top','center','danger','Please Select Region to continue...');

					}

				}else{
					$scope.showNotifications('top','center','danger','Please select Project to continue...');

				}
			};

			$scope.loadAllAssetTypes = function() {
				//$scope.loadingStart();
				AssetTypeComponent.findAll().then(function (data) {
					//$scope.selectedAssetType = null;
					$scope.assetTypes = data;
					//console.log('Asset type',$scope.assetTypes);
					/** Ui-select scope **/
					$scope.assetTypesLists[0] = $scope.allAssetType;
					//Filter
					for(var i=0;i<$scope.assetTypes.length;i++)
					{
						$scope.assetTypesLists[i+1] = $scope.assetTypes[i];
					}
					$scope.assetTypeDisable = false;

				});
			}

			$scope.loadAllAssetGroups = function () {

				AssetComponent.loadAssetGroup().then(function (data) {
					////console.log("Loading all Asset Group -- " , data)
					$scope.assetGroups = data;
					////console.log("group",$scope.assetGroups);
					/** Ui-select scope **/
					$scope.assetGroupsLists[0] = $scope.allAssetGroup;
					for(var i=0;i<$scope.assetGroups.length;i++)
					{
						$scope.assetGroupsLists[i+1] = $scope.assetGroups[i];
					}
					$scope.assetTypeDisable = false;
					$scope.groupFilterDisable = false;
					//

				});
			}

			$scope.loadSiteShifts = function() {
				//console.log('selected site - ' + JSON.stringify($scope.selectedSites));
				var now = new Date();
				now = now.toISOString().split('T')[0]
				if($scope.selectedSites) {
					SiteComponent.findShifts($scope.selectedSites.id,now).then(function(data){
						// $scope.shifts = data;
						//console.log('selected shifts - ' + JSON.stringify($scope.shifts));
						//console.log("==================================================")
						//console.log(data);
						// Shift time HH:MM View
						$scope.shifts = data;
						for(var i=0;i<$scope.shifts.length;i++) {
							//console.log($scope.shifts[i].startTime.length);
							var start = $scope.shifts[i].startTime.split(':');
							//console.log(start)
							if(start[0].length == 1)
							{
								start[0] = '0'+start[0];
								$scope.shifts[i].startTime = start[0] +':'+ start[1];
								if(start[1].length == 1)
								{
									if(start[1]==0)
									{
										start[1] = '00';
										$scope.shifts[i].startTime = start[0] +':'+ start[1];
									}
									else {
										start[1] = '0'+start[1];
										$scope.shifts[i].startTime = start[0] +':'+ start[1];
									}
								}
							}
							else if(start[1].length == 1)
							{
								if(start[1]==0)
								{
									start[1] = '00';
									$scope.shifts[i].startTime = start[0] +':'+ start[1];
								}
								else {
									start[1] = '0'+start[1];
									$scope.shifts[i].startTime = start[0] +':'+ start[1];
								}
							}
							else
							{
								$scope.shifts = data
							}


							var end =  $scope.shifts[i].endTime.split(':');
							//console.log(end)
							if(end[0].length == 1)
							{
								end[0] = '0'+end[0];
								$scope.shifts[i].endTime = end[0] +':'+ end[1];
								if(end[1].length == 1)
								{
									if(end[1]==0)
									{
										end[1] = '00';
										$scope.shifts[i].endTime = end[0] +':'+ end[1];
									}
									else {
										end[1] = '0'+start[1];
										$scope.shifts[i].endTime = end[0] +':'+ end[1];
									}
								}
							}
							else if(end[1].length == 1)
							{
								if(end[1].length == 1)
								{
									if(end[1]==0)
									{
										end[1] = '00';
										$scope.shifts[i].endTime = end[0] +':'+ end[1];
									}
									else {
										end[1] = '0'+start[1];
										$scope.shifts[i].endTime = end[0] +':'+ end[1];
									}
								}
							}
							else
							{
								$scope.shifts = data
							}

						}
						//

						//$scope.loadingStop();
					}).catch(function(){
						//$scope.loadingStop();
					});
				}
			}

			$scope.initMaterialWizard();

			$scope.editAsset = function(){
				if(parseInt($stateParams.id) > 0){
					//console.log($stateParams.id);
					$rootScope.loadingStart();
					var assetId = parseInt($stateParams.id);
					AssetComponent.findById(assetId).then(function(data){
						$scope.assetList=data;
						if($scope.assetList){
							//console.log("--- Load asset ---",$scope.assetList);
							$scope.assetEdit.id = $scope.assetList.id;
							$scope.assetEdit.title = $scope.assetList.title;
							$scope.title  = $scope.assetList.title;
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
							$scope.selectedAssetType ={id: $scope.assetList.assetTypeId, name:$scope.assetList.assetType};
							$scope.selectedAssetGroup ={assetgroup:$scope.assetList.assetGroup};
							$scope.selectedSites ={id:$scope.assetList.siteId,name:$scope.assetList.siteName};
							$scope.selectedBlock = $scope.assetList.block;
							$scope.selectedFloor = $scope.assetList.floor;
							$scope.selectedZone = $scope.assetList.zone;
							$scope.selectedManufacturer = {id:$scope.assetList.manufacturerId,name:$scope.assetList.manufacturerName};
							$scope.selectedVendor = {id:$scope.assetList.vendorId};
							$scope.selectedServiceWarranty = {name:$scope.assetList.warrantyType};
							$scope.selectedAssetStatus = $scope.assetList.status;

							for(var a=0;a<$scope.statuses.length;a++){
							    if($scope.statuses[a].status === $scope.selectedAssetStatus){
							        $scope.statuses[a].isCurrentStatus = true;
							        $scope.statuses[a].allowCurrentStatus = true;
                                }

                                for(var b=0;b<$scope.assetList.criticalStatusList.length;b++){
							        if($scope.statuses[a].status === $scope.assetList.criticalStatusList[b].status){
                                        $scope.statuses[a].isSeverity = $scope.assetList.criticalStatusList[b].severity;
                                        $scope.statuses[a].isCritical = $scope.assetList.criticalStatusList[b].ticket;
                                     }
                                }
                            }

							if($scope.assetList.siteId){
								LocationComponent.findBlocks(0,$scope.assetList.siteId).then(function (data) {
									//$scope.selectedBlock = null;
									$scope.blocks = data;
									//console.log("Loading all blocks -- " ,  $scope.blocks);
								});

								LocationComponent.findFloors(0,$scope.assetList.siteId,$scope.assetList.block).then(function (data) {
									//$scope.selectedFloor = null;
									$scope.floors = data;
									//console.log("Loading all floors -- " ,  $scope.floors);
								});

								LocationComponent.findZones(0,$scope.assetList.siteId,$scope.assetList.block,$scope.assetList.floor).then(function (data) {
									//$scope.selectedZone = null;
									$scope.zones = data;
									//console.log('zones list',$scope.zones);
								});

								AssetComponent.getAssetGrpHierarchy($scope.assetList).then(function (data) {
                                    if(data.length > 0) {
                                        initMapAssetGrpTree("", data);
                                    }
                                })

                                $scope.getAssetHierarchy();
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
                            //console.log(data);
                            $scope.assetParameters = data;
                        });

                    }*/
							/*$scope.asset.selectedSite = {id : data.siteId,name : data.siteName}
                    //console.log($scope.selectedSite)*/
						}else{
						    console.log("Asset list error");
							$location.path('/assets');
						}
					}).catch(function(response){
                        console.log("Asset list error");
                        console.log(response);
                        $rootScope.loadingStop();
						$location.path('/assets');

					});
				}else{
                    console.log("Asset list error");
                    $location.path('/assets');
				}
			}





			/* Sorting functions*/

			$scope.isActiveAsc = '';
			$scope.isActiveDesc = 'code';

			$scope.columnAscOrder = function(field){
				$scope.selectedColumn = field;
				//console.log('>>> selected coloumn <<< '+$scope.selectedColumn);
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
				$('.AdvancedFilterModal.in').modal('hide');
				$scope.setPage(1);
				$scope.search();
			}

			/* Asset listing and searching function */

			$scope.search = function () {
				$scope.noData = false;
				$scope.loadingStop();

				var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
				if(!$scope.searchCriteria) {
					var searchCriteria = {
							currPage : currPageVal
					};
					$scope.searchCriteria = searchCriteria;
				}

				$scope.searchCriteria.currPage = currPageVal;

				$scope.searchCriteria.isReport = false;


				if($scope.client.selected && $scope.client.selected.id !=0){
					$scope.searchProject = $scope.client.selected;
                    $stateParams.project = null;
                    $stateParams.site = null;
				}else if($stateParams.project){
                    $scope.searchProject = {id:$stateParams.project.id,name:$stateParams.project.name};
                    $scope.client.selected =$scope.searchProject;
                    $scope.projectFilterFunction($scope.searchProject);
                }else{
					$scope.searchProject = null;
				}
				if($scope.sitesListOne.selected && $scope.sitesListOne.selected.id !=0){
					$scope.searchSite = $scope.sitesListOne.selected;
                    $stateParams.site = null;
				}else if($stateParams.site){
                   $scope.searchSite = {id:$stateParams.site.id,name:$stateParams.site.name};
                   $scope.sitesListOne.selected = $scope.searchSite;
                }else{
					$scope.searchSite = null;
				}
				if($scope.regionsListOne.selected && $scope.regionsListOne.selected.id !=0){
					$scope.searchRegion = $scope.regionsListOne.selected;
				}else{
					$scope.searchRegion = null;
				}
				if($scope.branchsListOne.selected && $scope.branchsListOne.selected.id !=0){
					$scope.searchBranch = $scope.branchsListOne.selected;
				}else{
					$scope.searchBranch = null;
				}
				if($scope.assetTypesListOne.selected && $scope.assetTypesListOne.selected.name != "-- ALL ASSET TYPE --"){
					$scope.searchAssetType = $scope.assetTypesListOne.selected;
				}else{
					$scope.searchAssetType = null;
				}
				if($scope.assetGroupsListOne.selected && $scope.assetGroupsListOne.selected.assetgroup !="-- ALL ASSET GROUP --"){
					$scope.searchAssetGroup = $scope.assetGroupsListOne.selected;
				}else{
					$scope.searchAssetGroup = null;
				}

				//console.log('Selected Asset' + $scope.searchAssetName);

				if(!$scope.searchAcquiredDate && !$scope.searchCreatedDate &&
						jQuery.isEmptyObject($scope.searchProject) == true
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

				if($scope.searchCreatedDate !="") {
					if($scope.searchCreatedDate != undefined){
						$scope.searchCriteria.assetCreatedDate = $scope.searchCreatedDateSer;
						$scope.searchCriteria.findAll = false;
					}else{
						$scope.searchCriteria.assetCreatedDate = null;
						$scope.searchCriteria.findAll = true;
					}
				}else{
					//$scope.searchCriteria.acquiredDate = new Date();
					$scope.searchCriteria.assetCreatedDate = null;
				}


				if(jQuery.isEmptyObject($scope.searchProject) == false) {
					if($scope.searchProject.id != undefined){
						$scope.searchCriteria.projectId = $scope.searchProject.id;
						$scope.searchCriteria.projectName = $scope.searchProject.name;
						$scope.searchCriteria.findAll = false;
					}else{
						$scope.searchCriteria.projectId = null;
						$scope.searchCriteria.findAll = true;
					}

				}else{
					$scope.searchCriteria.projectId =null;
				}
				if(jQuery.isEmptyObject($scope.searchSite) == false) {
					if($scope.searchSite.id != undefined){
						$scope.searchCriteria.siteId = $scope.searchSite.id;
						$scope.searchCriteria.siteName = $scope.searchSite.name;
						$scope.searchCriteria.findAll = false;
					}else{
						$scope.searchCriteria.siteId = null;
						$scope.searchCriteria.findAll = true;
					}

				}else{
					$scope.searchCriteria.siteId =null;
				}
				if($scope.searchRegion) {
					$scope.searchCriteria.regionId = $scope.searchRegion.id;
					$scope.searchCriteria.region = $scope.searchRegion.name;

				}else {
					$scope.searchCriteria.regionId = null;
					$scope.searchCriteria.region = null;
				}

				if($scope.searchBranch) {
					$scope.searchCriteria.branchId = $scope.searchBranch.id;
					$scope.searchCriteria.branch = $scope.searchBranch.name;

				}else {
					$scope.searchCriteria.branchId = null;
					$scope.searchCriteria.branch = null;
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

                if($scope.showInActive){
                    $scope.searchCriteria.showInActive = true;
                }else{
                    $scope.searchCriteria.showInActive = false;
                }

				//----
				if($scope.pageSort){
					$scope.searchCriteria.sort = $scope.pageSort;
				}

				if($scope.selectedColumn){

					$scope.searchCriteria.columnName = $scope.selectedColumn;
					//console.log('>>> $scope.searchCriteria.columnName <<< '+$scope.searchCriteria.columnName);
					$scope.searchCriteria.sortByAsc = $scope.isAscOrder;
					//console.log('>>> $scope.searchCriteria.sortByAsc <<< '+$scope.searchCriteria.sortByAsc);
				}else{
					$scope.searchCriteria.columnName ="code";
					$scope.searchCriteria.sortByAsc = false;
				}

				//console.log("search criteria",$scope.searchCriteria);
				$scope.assets = '';
				$scope.assetsLoader = false;
				$scope.loadPageTop();

				/* Localstorage (Retain old values while edit page to list) start */
				if($rootScope.retain == 1){
					$scope.localStorage = getLocalStorage.getSearch();
					//console.log('Local storage---',$scope.localStorage);

					if($scope.localStorage){
						$scope.filter = true;
						$scope.pages.currPage = $scope.localStorage.currPage;
						if($scope.localStorage.projectId){

							$scope.searchProject = {id:$scope.localStorage.projectId,name:$scope.localStorage.projectName};
							$scope.client.selected = $scope.searchProject;
							//$scope.loadDepSitesList($scope.client.selected);
							$scope.projectFilterFunction($scope.searchProject);
						}else{
							$scope.searchProject = null;
							$scope.client.selected = $scope.searchProject;
						}
						if($scope.localStorage.regionId){
							$scope.searchRegion = {id:$scope.localStorage.regionId,name:$scope.localStorage.region};
							$scope.regionsListOne.selected = $scope.searchRegion;

							$scope.regionFilterFunction($scope.searchProject);
						}else{
							$scope.searchRegion = null;
							$scope.regionsListOne.selected = $scope.searchRegion;
						}
						if($scope.localStorage.branchId){
							$scope.searchBranch = {id:$scope.localStorage.branchId,name:$scope.localStorage.branch};
							$scope.branchsListOne.selected = $scope.searchBranch;
							$scope.branchFilterFunction($scope.searchProject,$scope.searchRegion);

						}else{
							$scope.searchBranch = null;
							$scope.branchsListOne.selected = $scope.searchBranch;
						}
						if($scope.localStorage.siteId){
							$scope.searchSite = {id:$scope.localStorage.siteId,name:$scope.localStorage.siteName};
							$scope.sitesListOne.selected = $scope.searchSite;
							$scope.siteFilterDisable=false;
						}else{
							$scope.searchSite = null;
							$scope.sitesListOne.selected = $scope.searchSite;
						}
						if($scope.localStorage.assetTypeName){
							$scope.searchAssetType = {name:$scope.localStorage.assetTypeName};
							$scope.assetTypesListOne.selected = $scope.searchAssetType;
						}else{
							$scope.searchAssetType = null;
							$scope.assetTypesListOne.selected = $scope.searchAssetType;
						}
						if($scope.localStorage.assetGroupName){
							$scope.searchAssetGroup = {assetgroup:$scope.localStorage.assetGroupName};
							$scope.assetGroupsListOne.selected = $scope.searchAssetGroup;
						}else{
							$scope.searchAssetGroup = null;
							$scope.assetGroupsListOne.selected = $scope.searchAssetGroup;
						}
						if($scope.localStorage.assetTitle){
							$scope.searchAssetName = $scope.localStorage.assetTitle;
						}else{
							$scope.searchAssetName = "";
						}
						if($scope.localStorage.assetCode){
							$scope.searchAssetCode = $scope.localStorage.assetCode;
						}else{
							$scope.searchAssetCode = "";
						}
                        if($scope.localStorage.acquiredDate){
                            $scope.searchAcquiredDate = $filter('date')($scope.localStorage.acquiredDate, 'dd/MM/yyyy');
                            $scope.searchAcquiredDateSer = $scope.localStorage.acquiredDate;
                        }else{
                            $scope.searchAcquiredDate = null;
                            $scope.searchAcquiredDateSer = null;
                        }
                        if($scope.localStorage.assetCreatedDate){
                            $scope.searchCreatedDate = $filter('date')($scope.localStorage.assetCreatedDate, 'dd/MM/yyyy');
                            $scope.searchCreatedDateSer = $scope.localStorage.assetCreatedDate;
                        }else{
                            $scope.searchCreatedDate = null;
                            $scope.searchCreatedDateSer = null;
                        }
                        if($scope.localStorage.showInActive){
                            $scope.searchCriteria.showInActive = $scope.localStorage.showInActive;
                            $scope.showInActive = $scope.localStorage.showInActive;
                        }

					}

					$rootScope.retain = 0;

					$scope.searchCriteras  = $scope.localStorage;
				}else{

					$scope.searchCriteras  = $scope.searchCriteria;
				}

				/* Localstorage (Retain old values while edit page to list) end */



				AssetComponent.search($scope.searchCriteras).then(function (data) {
					$scope.assets = data.transactions;
					$scope.assetsLoader = true;


					/** retaining list search value.**/
					getLocalStorage.updateSearch($scope.searchCriteras);
					/*
					 ** Call pagination  main function **
					 */

					$scope.pager = {};
					$scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
					$scope.totalCountPages = data.totalCount;

					//console.log("Pagination",$scope.pager);
					//console.log("Asset List - ", data);



					$scope.pages.currPage = data.currPage == 0 ? 1 : data.currPage;
					$scope.pages.totalPages = data.totalPages;
					$scope.loading = false;

					if($scope.assets && $scope.assets.length > 0 ){
						$scope.showCurrPage = data.currPage;
						$scope.pageEntries = $scope.assets.length;
						$scope.totalCountPages = data.totalCount;
						$scope.pageSort = 10;

						$scope.noData = false;

						// Select multiple asset check box start
						if($scope.assetQrSite){

							if($scope.assetQrSite){
								$scope.allItemsSelected = true;
								$scope.assetQrSiteVal =$scope.assetQrSite.id;
							}else{
								$scope.allItemsSelected = false;
								$scope.assetQrSiteVal =0;
							}

							$scope.qrAll= "All";
							$scope.checkboxSel=[];

							// Loop through all the entities and set their isChecked property
							for (var i = 0; i < $scope.assets.length; i++) {

								$scope.checkboxSel.push($scope.assets[i].id);

								$scope.assets[i].isChecked = $scope.allItemsSelected;
							}

							if(!$scope.allItemsSelected){

								$scope.checkboxSel=[];


							}

						}

						// Select multiple asset check box end


					}else{
						$scope.noData = true;
					}

				}).catch(function(){
                    $scope.noData = true;
                    $scope.assetsLoader = true;
                    $scope.showNotifications('top','center','danger','Unable to load asset list..');
                });
			}

			/* View asset by id */

			$scope.viewAsset = function(){
				if(parseInt($stateParams.id) > 0){
					var assetId = $stateParams.id;
					$rootScope.loadingStart();
                    $scope.getMTTRForAssets(assetId);
					AssetComponent.findById(assetId).then(function(data){
						//console.log("Asset details List==" + JSON.stringify(data));
						$scope.assetDetail= data;
						if(!$scope.assetDetail){
							$location.path('/assets');
						}
						$rootScope.loadingStop();

                        AssetComponent.findTicketConfigByAssetId(assetId).then(function(ticketConfig){
                            console.log("Asset ticket config details");
                            console.log(ticketConfig);
                            var ticketConfig = ticketConfig;

                            for(var i=0;i<data.length;i++){
                                var status = {};
                                status.status = data[i];
                                console.log(status);
                                $scope.ticketConfigStatuses.push(status);
                            }
                        });

						//$scope.loadCalendar();

					}).catch(function(response){
                        $scope.showNotifications('top','center','danger','Unable to load asset details..');
						$location.path('/assets');
						$rootScope.loadingStop();
					});
				}else{
					$location.path('/assets');
				}
			}

			var date = new Date(), y = date.getFullYear(), m = date.getMonth();
			var firstDay = new Date(y, m, 1);
			var lastDay = new Date(y, m + 1, 0);

			$scope.loadCalendar = function (startDate = firstDay,endDate = lastDay) {

				// $scope.initFullCalendar([]);

				$rootScope.loadingStart();

				$scope.scheduleObj = {assetId:$stateParams.id,checkInDateTimeFrom:startDate,checkInDateTimeTo:endDate};

				AssetComponent.getPPMScheduleCalendar($scope.scheduleObj.assetId,$scope.scheduleObj).then(function(data){

					//console.log("Asset Calendar details ==" + JSON.stringify(data));

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
				}else{
					$scope.assetConfigs.assetType = null;
					$scope.assetConfigs.assetId = 0;
				}
				//console.log("Asset Config load" ,$scope.assetConfigs);

				AssetComponent.findByAssetConfig($scope.assetConfigs).then(function(data){

					//console.log(data);
					$scope.assetParameters = data;

					$scope.loadingStop();

				}).catch(function(){
					$scope.loadingStop();
                    $scope.showNotifications('top','center','danger','Unable to load asset config..');
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
					//console.log('Parameter by id',$scope.parameterConfig);
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
//				alert(aqDate);
				$scope.assetGen.acquiredDate = aqDate;

				$scope.assetEditDate = aqDate;

				//$scope.assetGen.acquiredDate = $filter('date')(e.date._d, 'EEE, dd MMM yyyy HH:mm:ss Z');
				//$scope.assetEditDate = $filter('date')(e.date._d, 'EEE, dd MMM yyyy HH:mm:ss Z');
			});


			$('#warFromDate').datetimepicker().on('dp.show', function (e) {
            return $(this).data('DateTimePicker').maxDate(e.date);
            });

			/*$('input#warFromDate').on('dp.change', function(e){

				$scope.assetGen.warrantyFromDate =  new Date(e.date._d);

				$scope.warFromDate1 = $filter('date')(e.date._d, 'dd/MM/yyyy');
				$scope.warFromDate = new Date(e.date._d);

				$('#warToDate').datetimepicker().on('dp.show', function () {
					return $(this).data('DateTimePicker').minDate(e.date);
				});

				if($scope.warToDate){

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
				}
			});

			$scope.warToMsg =false;

			$('input#warToDate').on('dp.change', function(e){
				$scope.assetGen.warrantyToDate = new Date(e.date._d);
				$scope.warToDate1 = $filter('date')(e.date._d, 'dd/MM/yyyy');
				$scope.warToDate = new Date(e.date._d);

				if($scope.warFromDate){

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
				}
			});*/

			$('input#warFromDate').on('dp.change', function(e){
            $scope.assetGen.warrantyFromDate =  new Date(e.date._d);
            $scope.warFromDate = new Date(e.date._d);
            $scope.warFromDate1 = $filter('date')(e.date._d, 'dd/MM/yyyy');
            $scope.warFromDate.setHours(0,0,0,0);
            if($scope.warToDate){
                $scope.warToDate.setHours(0,0,0,0);
            }
            if($scope.warFromDate1 && $scope.warToDate1){
                if($scope.warFromDate > $scope.warToDate && $scope.warFromDate != $scope.warToDate){
                    $scope.fromErrMsg = 'From date cannot be greater than To date';

                    alert($scope.fromErrMsg);

                    $('input#warFromDate').data('DateTimePicker').clear();
                    $('input#warToDate').data('DateTimePicker').clear();
                    $scope.warFromDate = new Date();
                    $scope.warFromDate1 = $filter('date')(new Date(), 'dd/MM/yyyy');
                    $scope.warToDate = new Date();
                    $scope.warToDate1 = $filter('date')(new Date(), 'dd/MM/yyyy');
                    $('input#warFromDate').val($scope.warFromDate1);
                    $('input#warToDate').val($scope.warToDate1);

                    return false;
                }
            }


        });

        $('input#warToDate').on('dp.change', function(e){

            $scope.toErrMsg = '';
            $scope.assetGen.warrantyToDate = new Date(e.date._d);
            $scope.warToDate = new Date(e.date._d);
            $scope.warToDate1 = $filter('date')(e.date._d, 'dd/MM/yyyy');
            $scope.warToDate.setHours(0,0,0,0);
            if($scope.warFromDate){
                $scope.warFromDate.setHours(0,0,0,0);
            }
            if($scope.warFromDate1 && $scope.warToDate1){
                if($scope.warFromDate > $scope.warToDate && $scope.warFromDate != $scope.warToDate){
                    $scope.toErrMsg = 'To date cannot be lesser than From date';

                    alert($scope.toErrMsg);

                    $('input#warFromDate').data('DateTimePicker').clear();
                    $('input#warToDate').data('DateTimePicker').clear();
                    $scope.warFromDate = new Date();
                    $scope.warFromDate1 = $filter('date')(new Date(), 'dd/MM/yyyy');
                    $scope.warToDate = new Date();
                    $scope.warToDate1 = $filter('date')(new Date(), 'dd/MM/yyyy');
                    $('input#warFromDate').val($scope.warFromDate1);
                    $('input#warToDate').val($scope.warToDate1);

                    return false;
                }
            }


        });



			$('input#searchAcquiredDate').on('dp.change', function(e){
				$scope.searchAcquiredDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
				$scope.searchAcquiredDateSer = new Date(e.date._d);
			});

			$('input#searchCreatedDate').on('dp.change', function(e){
				$scope.searchCreatedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
				$scope.searchCreatedDateSer = new Date(e.date._d);
			});



			/* Create and save asset */

			$scope.saveAsset = function () {
				$scope.saveLoad = true;
				$scope.loadingStart();
				$scope.btnDisabled = true;
				$scope.error = null;
				$scope.success = null;
				$scope.errorSitesExists = null;
				$scope.errorSite = null;

				console.log("Asset Status configuration");
				console.log($scope.statuses);

				for(var a=0; a<$scope.statuses.length;a++){
				    if($scope.statuses[a].allowCurrentStatus){
                        $scope.assetGen.status =$scope.statuses[a].status;
                    }

                    if($scope.statuses[a].isCritical){
                        var criticalConfigDetails = {};
                        criticalConfigDetails.ticket = true;
                        criticalConfigDetails.status = $scope.statuses[a].status;
                        if($scope.statuses[a].isSeverity){
                            criticalConfigDetails.severity = true;
                        }else{
                            criticalConfigDetails.severity = false;
                        }

                        $scope.criticalStatusList.push(criticalConfigDetails);
                    }

                    console.log($scope.criticalStatusList);

                }



				if(!$scope.selectedSites && !$scope.selectedSites.id){
					$scope.errorSite = "true";
					$scope.showNotifications('top','center','danger','Please select site!!!');
					$scope.btnDisabled = false;
					$scope.loadingStop();
					$scope.saveLoad = false;

				}else{

					if($scope.selectedAssetType && $scope.selectedAssetType.id){ $scope.assetGen.assetType = $scope.selectedAssetType.name; }
					if($scope.selectedAssetGroup && $scope.selectedAssetGroup.id){ $scope.assetGen.assetGroup = $scope.selectedAssetGroup.plainName;}
					// if($scope.selectedAssetStatus){ $scope.assetGen.status = $scope.selectedAssetStatus;}
					if($scope.selectedManufacturer && $scope.selectedManufacturer.id){$scope.assetGen.manufacturerId = $scope.selectedManufacturer.id;}
					if($scope.selectedServiceProvider && $scope.selectedServiceProvider.id){$scope.assetGen.serviceProvider = $scope.selectedServiceProvider.id;}
					if($scope.selectedServiceWarranty && $scope.selectedServiceWarranty.id){$scope.assetGen.warrantyType = $scope.selectedServiceWarranty.name;}
					if($scope.selectedVendor && $scope.selectedVendor.id){$scope.assetGen.vendorId = $scope.selectedVendor.id;}
					if($scope.selectedSites && $scope.selectedSites.id){$scope.assetGen.siteId = $scope.selectedSites.id;}
					//alert($scope.choosenAssetParent);
					console.log($scope.choosenAssetParent);
					if($scope.choosenAssetParent && $scope.choosenAssetParent.id){$scope.assetGen.parentAsset = $scope.choosenAssetParent;}

					//if($scope.selectedProject.id){$scope.assetGen.projectId = $scope.selectedProject.id;}
					if($scope.selectedBlock){$scope.assetGen.block = $scope.selectedBlock;}
					if($scope.selectedFloor){$scope.assetGen.floor = $scope.selectedFloor;}
					if($scope.selectedZone){$scope.assetGen.zone = $scope.selectedZone;}
                    $scope.assetGen.criticalStatusList = $scope.criticalStatusList;
                    console.log("After adding critical status list");
                    console.log($scope.assetGen);
					//console.log("Asset Create List -- ",$scope.assetGen);
					AssetComponent.create($scope.assetGen).then(function(response) {
						//console.log("Asset response",JSON.stringify(response));
						$scope.assetVal=response;
						$scope.assetVal.siteId=response.siteId;
						$scope.success = 'OK';
						$scope.saveLoad = false;
						$scope.loadingStop();
						$scope.showNotifications('top','center','success','Asset has been added Successfully!!');
						$scope.loadEmployees();
						$scope.btnDisabled= false;
						$('#dPlayNone').show();
						$('#nxtBtn').removeClass('disabled');
						//$scope.loadAssets();
						//$location.path('/assets');

					}).catch(function (response) {
						$scope.loadingStop();
						$scope.saveLoad = false;
						$scope.btnDisabled= false;
						$scope.success = null;
						console.log('Error - '+ response.data);
						console.log('status - '+ response.status + ' , message - ' + response.data.message);
						if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
							$scope.errorAssetsExists = 'ERROR';
							$scope.showNotifications('top','center','danger','Asset Already Exists');

							//console.log($scope.errorAssetsExists);
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
						//console.log('response qr---',response);
						$scope.qr_img = response.url;
						$scope.assetCode = response.code;
//						//console.log('create qr---',qrAry);
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
				}else{
					var qr_id = 0;
				}


				$scope.qr_img = "";
				$scope.assetCode = "";


				AssetComponent.genQrCode(qr_id).then(function(response){
					$scope.qr_img = response.url;
					$scope.assetCode = response.code;
					//console.log('get qr---',response);

					$scope.loadingStop();

				});
				/*.catch(function(){
                $scope.showNotifications('top','center','danger','Error to retrieve  qr code..');
                $scope.loadingStop();
            });*/

			}

			$scope.updateSite = function(selectedSite) {
				$scope.selectedSites = selectedSite;

			};

			$scope.getMTTRForAssets = function(assetId){
			    console.log("Get MTTR for assets - "+assetId);
			    AssetComponent.getMTTR(assetId).then(function (data) {
                    console.log(data);
                    var mttr = Math.abs(data.maintenanceHours)/data.assetTicketsCount;
                    console.log(mttr);
                    $scope.mttr = mttr;
                });
            };


			/* Update and save asset */

			$scope.updateAsset = function () {
				$scope.saveLoad = true;
				$scope.loadingStart();
				$scope.error = null;
				$scope.success =null;
				$scope.btnDisabled =true;

                for(var a=0; a<$scope.statuses.length;a++){
                    if($scope.statuses[a].allowCurrentStatus){
                        $scope.assetGen.status =$scope.statuses[a].status;
                    }

                    if($scope.statuses[a].isCritical){
                        var criticalConfigDetails = {};
                        criticalConfigDetails.ticket = true;
                        criticalConfigDetails.status = $scope.statuses[a].status;
                        if($scope.statuses[a].isSeverity){
                            criticalConfigDetails.severity = true;
                        }else{
                            criticalConfigDetails.severity = false;
                        }

                        $scope.criticalStatusList.push(criticalConfigDetails);
                    }

                    console.log($scope.criticalStatusList);

                }


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
                $scope.assetGen.criticalStatusList = $scope.criticalStatusList;
				//console.log('--- Edit asset details ---', JSON.stringify($scope.assetEdit));

				//$scope.asset.assetStatus = $scope.selectedStatus.name;
				//var post = $scope.isEdit ? AssetComponent.update : AssetComponent.create
                AssetComponent.update($scope.assetEdit).then(function () {

                    $scope.success = 'OK';
                    $scope.saveLoad = false;
                    $scope.loadingStop();
                    $scope.btnDisabled =false;
                    $scope.showNotifications('top','center','success','Asset has been updated Successfully!!');
                    //$scope.loadAssets();

                    //$location.path('/assets');

                }).catch(function (response) {
                    $scope.saveLoad = false;
                    $rootScope.loadingStop();
                    $scope.success = null;
                    $scope.btnDisabled =false;

                    //console.log('Error - '+ response.data);
                    if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                        $scope.errorProjectExists = 'ERROR';
                        $scope.showNotifications('top','center','danger','Asset has been updated Successfully!!');
                    } else {
                        $scope.error = 'ERROR';
                        $scope.showNotifications('top','center','danger','Asset has been updated Successfully!!');
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
					//console.log("edit asset")
					$scope.editAsset();
				}else {
					//console.log("add asset")
				}
			}
            $scope.weekSchAssetsSpain = false;
			$scope.loadWeekSchAssets = function() {
				if($scope.weekSchSite){
				$scope.weekSchAssetsSpain = true;
					$scope.weekSchAssets = '';
					$scope.searchCriteria.siteId = $scope.weekSchSite.id;
					AssetComponent.search($scope.searchCriteria).then(function(data) {
						//console.log('Asset based tickets -- ',data);
						$scope.weekSchAssets = data.transactions;
						$scope.weekSchAssetsSpain = false;
					}).catch(function(){
					   $scope.weekSchAssetsSpain = false;
					});
				}

			};

			$scope.load52WeekSchedule = function() {
				//console.log('site selection - ' + JSON.stringify($scope.searchSite));
				if(jQuery.isEmptyObject($scope.weekSchSite) == false) {
					$scope.weekSchLoad = true;
					var assetId = 0;
					if($scope.weekSchAsset) {
						assetId =$scope.weekSchAsset.id;
					}
					AssetComponent.exportAsset52WeekSchedule({siteId:$scope.weekSchSite.id,assetId:assetId}).then(function(data){
						$scope.weekSchLoad = false;
						//console.log("response for 52week schedule - "+ JSON.stringify(data));
						if(data) {
							if(data.results) {
								$rootScope.scheduleWebLink = data.results[0].webLink;
								$rootScope.scheduleWebContentLink = data.results[0].webContentLink;
								$scope.weekSchSite = null;
								$scope.weekSchAsset = null;
								$location.path('/schedule-list');
							}else {
								$scope.showNotifications('top','center','error','Unable to get 52 week schedule for the site');
							}
						}else {
							$scope.showNotifications('top','center','error','Unable to get 52 week schedule for the site');
						}
					}).catch(function(){
                        $scope.showNotifications('top','center','danger','Unable to get 52 week schedule.Please try later..');
						$scope.weekSchLoad = false;
					});
				}else {
					$scope.showNotifications('top','center','danger','Please select a site to view 52 week schedule');
				}
			}


			$scope.refreshPage = function(){
				$scope.loadAssets();
			}

			$scope.deleteConfirm = function (asset){
				$scope.deleteAssetId= asset;
			}



			$scope.deleteAsset = function () {
			    $('#deleteModal').modal('hide');
				AssetComponent.remove($scope.deleteAssetId).then(function(){
					$scope.success = 'OK';
					$scope.showNotifications('top','center','success','Asset has been deleted successfully!!');
					$scope.retain = 1;
					$scope.search();
				}).catch(function () {
                    $scope.showNotifications('top','center','danger','Unable to delete asset!!');
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
					//console.log('Deleted data',data);
					$scope.showNotifications('top','center','success','Document has been deleted successfully!!');
                    $scope.loadingStop();
                    $scope.getAllUploadedFiles();
					$scope.getAllUploadedPhotos();
				}).catch(function(){
                    $scope.showNotifications('top','center','warning','Unable to delete Document!!');
					$scope.loadingStop();
				});
			}



			$scope.loadQRCode = function(assetId, qrCodeImage) {

				if(assetId) {
					//console.log("QR Code image - "+ qrCodeImage);
					var uri = '/api/asset/' + assetId +'/qrcode';
					var eleId = 'qrCodeImage';
					//console.log('image element id -' + eleId);
					$http.get(uri).then(function (response) {
						var ele = document.getElementById(eleId);
						//console.log('qrcode response - ' + response.data);
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
				$('input#searchAcquiredDate').data('DateTimePicker').clear();
				$('input#searchCreatedDate').data('DateTimePicker').clear();
				$scope.clearField = true;
				$scope.filter = false;
				$rootScope.exportStatusObj = {};
				$scope.downloader=false;
				$scope.downloaded = true;
				$scope.siteFilterDisable = true;
				$scope.regionFilterDisable = true;
				$scope.branchFilterDisable = true;
				$scope.sites = null;
				$scope.assetQrSite =null;

				/** Ui-select scopes **/
				$scope.client.selected = null;
				$scope.sitesLists =  [];
				$scope.sitesListOne.selected =  null;
				$scope.regionsLists =  [];
				$scope.regionsListOne.selected =  null;
				$scope.branchsLists =  [];
				$scope.branchsListOne.selected =  null;
				$scope.assetTypesListOne.selected = null;
				$scope.assetGroupsListOne.selected = null;

				$scope.selectedAsset = {};
				$scope.selectedProject = null;
				$scope.searchCriteria = {};
				$scope.selectedSite = null;
				$scope.selectedStatus = null;
				$scope.searchAssetName =null;
				$scope.searchAssetCode =null;
				//$scope.searchAcquiredDate = $filter('date')(new Date(), 'dd/MM/yyyy');
				$scope.searchAcquiredDate = null;
				$scope.searchCreatedDate = null;
				$scope.searchAssetType = null;
				$scope.searchSite =null;
				$scope.searchProject =null;
				$scope.searchAssetGroup = null;
				$scope.clearField = true;
				$scope.localStorage = null;
                $stateParams.project = null;
                $stateParams.site = null;
				$scope.pages = {
						currPage: 1,
						totalPages: 0
				}
				//$scope.search();
			};

			$scope.clear = function() {
				$scope.selectedAssetType = null;
				$scope.selectedParameter = null;
				$scope.selectedParameterUOM = null;
				$scope.selectedRule = null;
				$scope.selectedThreshold =null;
				$scope.validationRequired = false;
				$scope.consumptionMonitoringRequired = false;
				$scope.alertRequired = false;
				$scope.selectedMinValue = null;
				$scope.selectedMaxValue = null;
				$scope.isEdit = false;
				return false;
			}

			//init load
			$scope.initLoad = function(){

				$scope.loadPageTop();
				$scope.initPage();
				//$scope.loadAssets();
				$scope.setPage(1);

			}

			$scope.init = function(){

				$scope.loadPageTop();
				//$scope.initPage();
				//$scope.loadAssets();
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

             //console.log("search criteria",$scope.searchCriteria);
                //$scope.assets = '';
                //$scope.assetsLoader = false;
                //$scope.loadPageTop();

        	//console.log(">>> loading ppm! asset id is "+assetId);
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

                 //console.log("Pagination",$scope.pager);
                 //console.log($scope.projects);

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
				}else{
					var assetId = 0;
				}

				AssetComponent.findByAssetPPM(assetId).then(function(data) {


					$scope.ppmScheduleList = data;

					//console.log('ppm schedule data--',$scope.ppmScheduleList);

					/* for(var i = 0;i < $scope.ppmScheduleList.length;i++){


                    var checklistId = $scope.ppmScheduleList[i].checklistId;



                    ChecklistComponent.findOne(checklistId).then(function(response){



                        item_ar.push(response.items);



                        //console.log("array", item_ar);


                        //if (i == item_ar.length) {

                             for(var j= 0;j < $scope.ppmScheduleList.length;j++){

                                 alert(item_ar[j]);


                              $scope.ppmScheduleList[j].items = item_ar[j];

                            }

                       //}

                   });


                }

                //console.log("PPM List" , $scope.ppmScheduleList);*/
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
				if($scope.searchModule =='PPM'){
					$scope.loadPPMJobs();
				}else if($scope.searchModule =='AMC'){
					$scope.loadAMCJobs();
				}else if($scope.searchModule == "Readings"){
					$scope.loadAssetReadings();
				}else if($scope.searchModule == "siteHistory"){
					$scope.loadSiteHistory();
				}else if($scope.searchModule == "statusHistory"){
					$scope.loadStatusHistory();
				}else if($scope.searchModule == "Ticket"){
					$scope.loadTicket();
                }else if($scope.searchModule == "assetSpares"){
                    $scope.loadAssetSpares();
                }else{
					$scope.search();
				}

			}



			/* Add asset type */

			$scope.addAssetType = function () {
//				alert("Code===>"+$scope.assetType.assetTypeCode);
//				alert("Relationship===>"+$scope.assetType.relationShipBased);
				console.log("Asset Type===>" + $scope.assetType);
				$scope.loadingStart();
				if($scope.assetType){
					//console.log("Asset Type entered");
					AssetTypeComponent.create($scope.assetType).then(function (response) {
						console.log($scope.assetType.isRelationShipBased);
						if(response.data.status && response.data.status === "400") {

							$scope.showNotifications('top','center','danger','Asset type already exists.');
						}else{
							$scope.assetType = "";
							$scope.showNotifications('top','center','success','Asset type has been added Successfully!!');
							$scope.loadAssetType();
						}
						$scope.loadingStop();

					}).catch(function(){
						$scope.loadingStop();
						$scope.showNotifications('top','center','danger','Unable to Asset type. Please try again later..');
						$scope.error = 'ERROR';
					});
				}else{
					//console.log("Asset Type not entered");
				}


			}

			/* Add asset group */

			$scope.addAssetGroup = function () {

				console.log($scope.selectedParentGroup);
				if($scope.assetGroup){
				    $scope.loadingStart();
				    //alert($scope.selectedParentGroup.id)
				    $scope.assetGroup.parentGeroup = $scope.selectedParentGroup;
				    //alert("Parent Group===>"+$scope.assetGroup.parentGeroup);
					//console.log("Asset Group entered");
					AssetComponent.createAssetGroup($scope.assetGroup).then(function (response) {
						//console.log(response);
						if(response.data.status && response.data.status === "400") {

							$scope.showNotifications('top','center','danger','Asset Group already exists.');
						}else{
							$scope.assetGroup = "";
							$scope.showNotifications('top','center','success','Asset Group has been added Successfully!!');
							$scope.loadAssetGroup();
							$scope.getAssetGrpHierarchy();
						}
						$scope.loadingStop();

					}).catch(function(){
						$scope.loadingStop();
						$scope.showNotifications('top','center','danger','Unable to Asset group. Please try again later..');
						$scope.error = 'ERROR';
					});
				}else{
					//console.log("Asset Group not entered");
				}


			}

			/* Add asset parameter */

			$scope.addParameter = function () {
				$scope.loadingStart();
				if($scope.parameter){
					//console.log("Parameter entered");
					ParameterComponent.create($scope.parameter).then(function (response) {
						//console.log(response);

						$scope.showNotifications('top','center','success','Parameter has been added Successfully!!');
						$scope.loadAllParameters();

					}).catch(function(){
						$scope.loadingStop();
						$scope.showNotifications('top','center','danger','Unable to Parameter add. Please try again later..');
						$scope.error = 'ERROR';
					});
				}else{
					//console.log("Parameter not entered");
				}
			}

			/* Add asset parameter UOM */

			$scope.addParameterUOM = function () {
				$scope.loadingStart();
				if($scope.parameterUOM){
					//console.log("ParameterUOM entered");
					ParameterUOMComponent.create($scope.parameterUOM).then(function (response) {
						//console.log(response);
						$scope.parameterUOM = "";
						$scope.showNotifications('top','center','success','Parameter UOM has been added Successfully!!');
						$scope.loadAllParameterUOMs();

					}).catch(function(){
						$scope.loadingStop();
						$scope.showNotifications('top','center','danger','Unable to Parameter UOM add. Please try again later..');
						$scope.error = 'ERROR';
					});
				}else{
					//console.log("Parameter UOM not entered");
				}
			}


			/* $scope.loadAssetConfig = function(type) {
        	ParameterConfigComponent.findByAssetConfig(type).then(function(data){
        		//console.log(data);
        		//$scope.assetConfigs = data;
                $scope.assetParameters = data;
        	});
        }*/

			$scope.deleteConfigConfirm = function (id){

				$scope.deleteParamConId= id;

			}

			$scope.deleteAssetConfig = function(id) {
				$scope.loadingStart();
				AssetComponent.deleteConfigById($scope.deleteParamConId).then(function(data){
					//console.log(data);
					$scope.assetParameters = data;
					$scope.parameterConfig = {};
                    $scope.parameter = null;
                    $scope.selectedAssetType = null;
                    $scope.selectedParameter = null;
                    $scope.selectedParameterUOM = null;
                    $scope.selectedRule = null;
                    $scope.selectedThreshold =null;
                    $scope.validationRequired = false;
                    $scope.consumptionMonitoringRequired = false;
                    $scope.alertRequired = false;
                    $scope.selectedMinValue = null;
                    $scope.selectedMaxValue = null;
                    $scope.isEdit = false;
                    $scope.assetConfig();
					$scope.loadingStop();

				});
			}

			$scope.siteChangeAssetConfig = function() {
				$scope.loadBlocks();
				$scope.loadEmployees();
			}

			$scope.cancelSiteChange = function() {
				$scope.selectedSites ={id:$scope.assetList.siteId,name:$scope.assetList.siteName};
			}


			$scope.loadAllParameters = function() {
				//$rootScope.loadingStart();
				ParameterComponent.findAll().then(function (data) {
					$scope.selectedParameter = null;
					$scope.parameters = data;
					//console.log('param list --',$scope.parameters);
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

						//console.log('Edit parameterConfig details ='+ JSON.stringify($scope.parameterConfig));

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
						//console.log('Add parameterConfig details ='+ JSON.stringify($scope.parameterConfig));
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
						$scope.parameterConfig = {};
						$scope.parameter = null;
                        $scope.selectedAssetType = null;
                        $scope.selectedParameter = null;
                        $scope.selectedParameterUOM = null;
                        $scope.selectedRule = null;
                        $scope.selectedThreshold =null;
                        $scope.validationRequired = false;
                        $scope.consumptionMonitoringRequired = false;
                        $scope.alertRequired = false;
                        $scope.selectedMinValue = null;
                        $scope.selectedMaxValue = null;
                        $scope.isEdit = false;
                        $scope.assetConfig();
						$scope.loadingStop();

						//$scope.loadAllParameters();
					}).catch(function (response) {
						$scope.loadingStop();
						$scope.success = null;
						//console.log('Error - '+ response.data);
						if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
							$scope.errorProjectExists = 'ERROR';
						} else {
							$scope.error = 'ERROR';
						}
					});

				}

			};


            $scope.assetsFileLoader=false;
            $scope.noFile=true;
			$scope.getAllUploadedFiles = function() {

				//$scope.loadingStart();

				$scope.uploadObj.type = 'document';


				if($scope.assetVal.id){

					$scope.uploadObj.assetId = $scope.assetVal.id;

				}else if($stateParams.id){

					$scope.uploadObj.assetId = $stateParams.id;
				}else{
					$scope.uploadObj.assetId = 0;
				}
                $scope.assetsFileLoader=true;
                $scope.noFile=false;
                $scope.uploadFiles = [];
				AssetComponent.getAllUploadedFiles($scope.uploadObj).then(function(data){
					$scope.uploadFiles=data;
                    $scope.assetsFileLoader=false;
					if($scope.uploadFiles){
                        $scope.fileCount = ($scope.uploadFiles).length;
                        if($scope.fileCount > 0){
                            $scope.noFile=false;
                        }else{
                            $scope.noFile=true;
                        }
                    }else{
                        $scope.noFile=true;
                    }

					//console.log("-- Upload files --" , $scope.uploadFiles);
					//$scope.loadingStop();
				}).catch(function(response){
					//$scope.loadingStop();
                    $scope.assetsFileLoader=false;
                    $scope.noFile=true;
				});
			}

            $scope.assetsPhotoLoader=false;
            $scope.noPhoto=true;
			$scope.getAllUploadedPhotos = function() {

				//$scope.loadingStart();

				$scope.photoObj.type = 'image';

				if($scope.assetVal.id){

					$scope.photoObj.assetId = $scope.assetVal.id;

				}else if($stateParams.id){

					$scope.photoObj.assetId = $stateParams.id;
				}else{
					$scope.photoObj.assetId = 0;
				}
                $scope.assetsPhotoLoader=true;
                $scope.noPhoto=false;
                $scope.uploadAssetPhotos = [];
				AssetComponent.getAllUploadedPhotos($scope.photoObj).then(function(data){
					$scope.uploadAssetPhotos=data;
                    $scope.assetsPhotoLoader=false;
                    if($scope.uploadAssetPhotos){
                        $scope.photoCount = ($scope.uploadAssetPhotos).length;
                        $scope.displayImage = $scope.uploadAssetPhotos[0];
                        if($scope.photoCount > 0){
                            $scope.noPhoto=false;
                        }else{
                            $scope.noPhoto=true;
                        }
                    }else{
                        $scope.noPhoto=true;
                    }
					//console.log("-- Uploaded Photos --",$scope.uploadAssetPhotos);
					//$scope.loadingStop();
				}).catch(function(response){
                    $scope.noPhoto=false;
                    $scope.assetsPhotoLoader=false;
					//$scope.loadingStop();
				});
			}

			$scope.uploadAssetFile = function() {

				if(!$scope.assetVal.id && !$stateParams.id){

					$scope.showNotifications('top','center','danger','Please create asset first..');

				}else{

					if($scope.selectedClientFile) {

						//console.log("file title - " + $scope.uploadAsset.title + "file name -" + $scope.selectedClientFile);

						if($scope.assetVal.id){
							$scope.uploadAsset.assetId = $scope.assetVal.id;

						}else if($stateParams.id){

							$scope.uploadAsset.assetId = $stateParams.id;
						}


						$scope.uploadAsset.uploadFile = $scope.selectedClientFile;
						//$scope.uploadAsset.assetId = 1;
						$scope.uploadAsset.type = 'document';
						//console.log($scope.uploadAsset);


						$rootScope.loadingStart();
						AssetComponent.uploadAssetFile($scope.uploadAsset).then(function(data){
							$scope.loadingStop();
							//console.log("-- Upload file --",data);
							if(data) {
								$scope.uploadFiles =[];
								$scope.uploadFiles.push(data);
								$scope.getAllUploadedFiles();
							}else{
								//console.log('No data found!');
							}
							$scope.uploadAsset  ={};
							$scope.selectedClientFile = "";
                            $scope.showNotifications('top','center','success','File has been uploaded Successfully!!');

						},function(err){
							$scope.loadingStop();
                            $scope.showNotifications('top','center','danger','Unable to  upload file..');
							//console.log('Import error');
							//console.log(err);
						}).catch(function(response){
							$scope.loadingStop();
							$scope.showNotifications('top','center','danger','Unable to  upload file..');
						});
					} else {
						//console.log('select a file');
					}
				}

			}

			$scope.uploadAssetPhotoFile = function() {

				if(!$scope.assetVal.id && !$stateParams.id){

					$scope.showNotifications('top','center','danger','Please create asset first..');

				}else{
					//console.log($scope.selectedPhotoFile);

					//console.log($scope.uploadAssetPhoto.title);

					if($scope.selectedPhotoFile) {
						//console.log('selected asset file - ' + $scope.selectedPhotoFile);

						$scope.uploadAssetPhoto.uploadFile = $scope.selectedPhotoFile;

						if($scope.assetVal.id){
							$scope.uploadAssetPhoto.assetId = $scope.assetVal.id;

						}else if($stateParams.id){

							$scope.uploadAssetPhoto.assetId = $stateParams.id;
						}
						//$scope.uploadAssetPhoto.assetId = 1;
						$scope.uploadAssetPhoto.type = 'image';

						//console.log($scope.uploadAssetPhoto);
						$scope.loadingStart();
						AssetComponent.uploadAssetPhoto($scope.uploadAssetPhoto).then(function(data){
							//console.log(data);
							$scope.loadingStop();
							if(data) {
								$scope.uploadAssetPhotos =[];
								$scope.uploadAssetPhotos.push(data);
								$scope.getAllUploadedPhotos();
							}else{
								//console.log('No data found!');
							}

							$scope.uploadAssetPhoto  ={};
							$scope.selectedPhotoFile = "";
                            $scope.showNotifications('top','center','success','Photo has been uploaded Successfully!!');

						},function(err){
							$scope.loadingStop();
                            $scope.showNotifications('top','center','danger','Unable to  upload Photo..');
							//console.log('Import error');
							//console.log(err);
						}).catch(function(response){
							$scope.loadingStop();
							$scope.showNotifications('top','center','danger','Unable to  upload Photo..');
						});
					} else {
						//console.log('select a file');
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
				//console.log(docId);
				var document = {};
				document.id = docId;
				document.fileName = filename;
				var fileExt = filename.split('.').pop();
				//console.log(fileExt);
				AssetComponent.readFile(document).then(function(data){
					//console.log("-- Download file --",data);
					//console.log(data.fileName);
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

			/*$('input#dateFilterAmcFrom').on('dp.show',function (e) {
				return $(this).data('DateTimePicker').minDate(e.date);
			})*/

			/*$('input#dateFilterAmcFrom').on('dp.change', function(e){
				$scope.amcTo = "";
				$scope.amcSchedule.startDate = new Date(e.date._d);
				$scope.amcFrom = $filter('date')(e.date._d, 'dd/MM/yyyy');
				$('input#dateFilterAmcTo').on('dp.show',function () {
					return $(this).data('DateTimePicker').minDate(e.date);
				});

				$scope.amcSchedule.jobStartTime = '';
				$scope.amcJobStartTime ='';
				$scope.amcJobStartTimeTmp ='';

				$('input#amcJobStartTime').datetimepicker().on('dp.show', function () {
					return $(this).data('DateTimePicker').minDate(e.date);
				});


				// if($scope.amcSchedule.startDate > $scope.amcSchedule.endDate) {
				//
				//         //scope.showNotifications('top','center','danger','From date cannot be greater than To date');
				//         $scope.amcFromMsg = true;
				//
				//
				//         //return false;
				// }else {
				//
				//    $scope.amcFromMsg =false;
				//
				//
				// }
				// if($scope.amcSchedule.endDate < $scope.amcSchedule.startDate) {
				//         //$scope.showNotifications('top','center','danger','To date cannot be lesser than From date');
				//         $scope.amcToMsg =true;
				//
				//
				//         //return false;
				// }else {
				//
				//      $scope.amcToMsg =false;
				//
				//
				// }
			});*/

			$scope.amcToMsg =false;

			/*$('input#dateFilterAmcTo').on('dp.change', function(e){
				$scope.amcSchedule.endDate = new Date(e.date._d);
				$scope.amcTo = $filter('date')(e.date._d, 'dd/MM/yyyy');

				// if($scope.amcSchedule.endDate < $scope.amcSchedule.startDate) {
				//         //$scope.showNotifications('top','center','danger','To date cannot be lesser than From date');
				//         $scope.amcToMsg =true;
				//
				//
				//         //return false;
				// }else {
				//
				//      $scope.amcToMsg =false;
				//
				//
				// }
				// if($scope.amcSchedule.startDate > $scope.amcSchedule.endDate) {
				//
				//         //scope.showNotifications('top','center','danger','From date cannot be greater than To date');
				//         $scope.amcFromMsg = true;
				//
				//
				//         //return false;
				// }else {
				//
				//    $scope.amcFromMsg =false;
				//
				//
				// }
			});*/
            $scope.amcSchedule.startDate = null;
            $scope.amcSchedule.endDate = null;
			$('input#dateFilterAmcFrom').on('dp.change', function(e){

                $scope.amcSchedule.jobStartTime = '';
                $scope.amcJobStartTime ='';
                $scope.amcJobStartTimeTmp ='';
                $scope.amcSchedule.startDate = new Date(e.date._d);
                $scope.amcFrom = $filter('date')(e.date._d, 'dd/MM/yyyy');
                $scope.amcSchedule.startDate.setHours(0,0,0,0);
                if($scope.amcSchedule.endDate){
                    $scope.amcSchedule.endDate.setHours(0,0,0,0);
                }

                if($scope.amcSchedule.startDate && $scope.amcSchedule.endDate){
                    if($scope.amcSchedule.startDate > $scope.amcSchedule.endDate && $scope.amcSchedule.startDate != $scope.amcSchedule.endDate){
                        $scope.fromErrMsg = 'From date cannot be greater than To date';

                        alert($scope.fromErrMsg);

                        $('input#dateFilterAmcFrom').data('DateTimePicker').clear();
                        $('input#dateFilterAmcTo').data('DateTimePicker').clear();
                        $scope.amcSchedule.startDate = new Date();
                        $scope.amcFrom = $filter('date')(new Date(), 'dd/MM/yyyy');
                        $scope.amcSchedule.endDate = new Date();
                        $scope.amcTo = $filter('date')(new Date(), 'dd/MM/yyyy');
                        $('input#dateFilterAmcFrom').val($scope.amcFrom);
                        $('input#dateFilterAmcTo').val($scope.amcTo);

                        return false;
                    }
                }


            });

            $('#dateFilterAmcFrom').datetimepicker().on('dp.show', function (e) {
                return $(this).data('DateTimePicker').minDate(e.date);
            });

            $('input#dateFilterAmcTo').on('dp.change', function(e){

                $scope.toErrMsg = '';

                $scope.amcSchedule.endDate = new Date(e.date._d);
                $scope.amcTo = $filter('date')(e.date._d, 'dd/MM/yyyy');
                $scope.amcSchedule.endDate.setHours(0,0,0,0);
                if($scope.amcSchedule.startDate){
                    $scope.amcSchedule.startDate.setHours(0,0,0,0);
                }
                if($scope.amcSchedule.startDate && $scope.amcSchedule.endDate){
                    if($scope.amcSchedule.startDate > $scope.amcSchedule.endDate && $scope.amcSchedule.startDate != $scope.amcSchedule.endDate){
                        $scope.toErrMsg = 'To date cannot be lesser than From date';

                        alert($scope.toErrMsg);

                        $('input#dateFilterAmcFrom').data('DateTimePicker').clear();
                        $('input#dateFilterAmcTo').data('DateTimePicker').clear();
                        $scope.amcSchedule.startDate = new Date();
                        $scope.amcFrom = $filter('date')(new Date(), 'dd/MM/yyyy');
                        $scope.amcSchedule.endDate = new Date();
                        $scope.amcTo = $filter('date')(new Date(), 'dd/MM/yyyy');
                        $('input#dateFilterAmcFrom').val($scope.amcFrom);
                        $('input#dateFilterAmcTo').val($scope.amcTo);

                        return false;
                    }
                }


            })
			$('input#amcJobStartTime').on('dp.change', function(e){
				$scope.amcSchedule.jobStartTime = new Date(e.date._d);
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

            //console.log('loadChecklist -' + id);
            ChecklistComponent.findOne(id).then(function (data) {

                return data.name;
                //$scope.checklist = data;
               /* //console.log("--Checklist Data--",$scope.checklist);
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

					//console.log($scope.selectedChecklist);


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

                    if($scope.amcSchedule.jobStartTime){
                        var startDate= $scope.amcSchedule.startDate;
                        var startDateTime= $scope.amcSchedule.jobStartTime;
                        var startTime = startDate.setHours(startDateTime.getHours());
                        $scope.amcSchedule.jobStartTime = new Date(startTime);
                    }

					//$scope.amcSchedule.maintenanceType = 'AMC';

					//console.log("To be create AMC schedule",$scope.amcSchedule);

					$scope.loadingStart();

					AssetComponent.saveAmcSchedule($scope.amcSchedule).then(function(data){
						//console.log(data);
						if(data) {
							//console.log(data.checklistId);
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
				}else{
					var assetId = 0;
				}

				AssetComponent.findByAssetAMC(assetId).then(function(data) {

					$scope.loadingStop();

					////console.log(data);

					$scope.amcScheduleList = data;

					for(var i = 0;i < $scope.amcScheduleList.length;i++){

						var amcId = $scope.amcScheduleList[i].checklistId;


						ChecklistComponent.findOne(amcId).then(function(data){

							item_ar.push(data.items);


							//console.log("array", item_ar);


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

					//console.log("AMC List" , $scope.amcScheduleList);
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
				popupWin.document.write('<html><head><link href="../assets/css/bootstrap.min.css" type="text/css" rel="stylesheet" /><link rel="stylesheet" type="text/css" href="../assets/css/custom.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
				popupWin.document.close();
			}

			/**
			 * View Readings*/

			$scope.noReading = false;

			$scope.loadAssetReadings = function() {
				$rootScope.loadingStart();
				$rootScope.loadPageTop();
				var redCurrPageVal = ($scope.pages ? $scope.pages.currPage : 1);
				if(!$scope.redSearchCriteria) {
					var redSearchCriteria = {
							currPage : redCurrPageVal
					};
					$scope.redSearchCriteria = redSearchCriteria;
				}

				$scope.redSearchCriteria.currPage = redCurrPageVal;
				$scope.redSearchCriteria.module = "Readings";
				$scope.searchModule = "Readings";
				$scope.redSearchCriteria.assetId = $stateParams.id;
				$scope.redSearchCriteria.sort = $scope.pageSort;
				$scope.assetReadings = "";
				//console.log('Readings search criteria',$scope.redSearchCriteria);
				AssetComponent.findByAssetReadings($scope.redSearchCriteria).then(function(data){
					$rootScope.loadingStop();
					//console.log('View Readings - ' +JSON.stringify(data));
					/*if(data.transactions != null) {*/
					$scope.assetReadings = data.transactions;
					//$scope.viewAssetReading(data.transactions[0].id);


					/*
					 ** Call pagination  main function **
					 */

					$scope.pager = {};
					$scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);

					$scope.totalCountPages = data.totalCount;

					//console.log("Pagination",$scope.pager);
					//console.log("Readings List - ", data);


					/*}else{
        			//console.log('No readings');
        			$scope.noReading = true;
        			$scope.assetReadings = "";
        		}*/

				});
			}

			$scope.viewAssetReading = function(id) {
				$rootScope.loadingStart();
				$scope.viewRead = id;
				AssetComponent.findByReadingId(id).then(function(data){
					$rootScope.loadingStop();
					//console.log(data);
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
				if(empParam){
					EmployeeComponent.search(empParam).then(function (data) {
						$scope.selectedEmployee = null;
						$scope.employees = data.transactions;
						//deferred.resolve($scope.employees);
					});
					//return deferred.promise;

				}


			}

			$scope.loadAMCJobs = function() {
				$scope.loadingStart();
				$rootScope.loadPageTop();
				var amcCurrPageVal = ($scope.pages ? $scope.pages.currPage : 1);
				if(!$scope.amcSearchCriteria) {
					var amcSearchCriteria = {
							currPage : amcCurrPageVal
					};
					$scope.amcSearchCriteria = amcSearchCriteria;
				}

				$scope.amcSearchCriteria.currPage = amcCurrPageVal;

				$scope.amcSearchCriteria.maintenanceType = "AMC";
				$scope.searchModule = "AMC";
				$scope.amcSearchCriteria.assetId = $stateParams.id;
				$scope.amcSearchCriteria.sort = $scope.pageSort;
				$scope.amcJobLists = "";
				//console.log('AMC search criteria',$scope.amcSearchCriteria);
				JobComponent.search($scope.amcSearchCriteria).then(function(data){
					$scope.loadingStop();
					//console.log(data);
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

            $scope.loadDLPJobs = function() {
                $scope.loadingStart();
                $rootScope.loadPageTop();
                var dlpCurrPageVal = ($scope.pages ? $scope.pages.currPage : 1);
                if(!$scope.dlpSearchCriteria) {
                    var dlpSearchCriteria = {
                        currPage : dlpCurrPageVal
                    };
                    $scope.dlpSearchCriteria = dlpSearchCriteria;
                }

                $scope.dlpSearchCriteria.currPage = dlpCurrPageVal;

                $scope.dlpSearchCriteria.maintenanceType = "DLP";
                $scope.searchModule = "DLP";
                $scope.dlpSearchCriteria.assetId = $stateParams.id;
                $scope.dlpSearchCriteria.sort = $scope.pageSort;
                $scope.dlpJobLists = "";
                //console.log('AMC search criteria',$scope.amcSearchCriteria);
                JobComponent.search($scope.dlpSearchCriteria).then(function(data){
                    $scope.loadingStop();
                    //console.log(data);
                    $scope.dlpJobLists = data.transactions;

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
				$scope.loadPageTop();
				var ppmCurrPageVal = ($scope.pages ? $scope.pages.currPage : 1);
				if(!$scope.ppmSearchCriteria) {
					var ppmSearchCriteria = {
							currPage : ppmCurrPageVal
					};
					$scope.ppmSearchCriteria = ppmSearchCriteria;
				}

				$scope.ppmSearchCriteria.currPage = ppmCurrPageVal;
				$scope.ppmSearchCriteria.maintenanceType = "PPM";
				$scope.searchModule  = "PPM";
				$scope.ppmSearchCriteria.assetId = $stateParams.id;
				$scope.ppmSearchCriteria.sort = $scope.pageSort;


				//console.log('PPM search criteria',$scope.ppmSearchCriteria);
				$scope.ppmJobLists = "";
				JobComponent.search($scope.ppmSearchCriteria).then(function(data){
					$rootScope.loadingStop();
					//console.log(data);
					$scope.ppmJobLists = data.transactions;

					/*
					 ** Call pagination  main function **
					 */

					$scope.pager = {};
					$scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
					$scope.totalCountPages = data.totalCount;

					//console.log("Pagination",$scope.pager);
					//console.log("PPM Job List - ", data);

				}).catch(function(){
					$scope.showNotifications('top','center','danger','Unable toLoading PPM Jobs. Please try again later..');
					$scope.loadingStop();
				});

			}

            $scope.loadAssetSpares = function() {
                $scope.loadingStart();
                $rootScope.loadPageTop();
                var assetSparesPageVal = ($scope.pages ? $scope.pages.currPage : 1);
                if(!$scope.assetSparesSearchCriteria) {
                    var assetSparesSearchCriteria = {
                        currPage : assetSparesPageVal
                    };
                    $scope.assetSparesSearchCriteria = assetSparesSearchCriteria;
                }

                $scope.assetSparesSearchCriteria.currPage = assetSparesPageVal;
                $scope.searchModule = "assetSpares";
                $scope.assetSparesSearchCriteria.assetId = $stateParams.id;
                $scope.assetSparesSearchCriteria.sort = $scope.pageSort;
                $scope.assetSparesLists = "";
                console.log('AssetSpares search criteria',$scope.assetSparesSearchCriteria);
                AssetComponent.getAssetMaterial($scope.assetSparesSearchCriteria).then(function(data){
                    $scope.loadingStop();
                    console.log(data);
                    $scope.assetSparesLists = data.transactions;

                    /*
                     ** Call pagination  main function **
                     */

                    $scope.pager = {};
                    $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                    $scope.totalCountPages = data.totalCount;
                }).catch(function(){
                    $scope.loadingStop();
                    $scope.showNotifications('top','center','danger','Unable to loading Asset Spares. Please try again later..');
                });
            }

			$scope.loadStatus = function() {
				AssetComponent.getStatus().then(function(data) {
					console.log('Asset status list-- '  );
					console.log(data);
					for(var i=0;i<data.length;i++){
                        var status = {};
                        status.status = data[i];
					    status.isCurrentStatus = false;
					    status.allowCurrentStatus = true;
					    console.log(status);
					    $scope.statuses.push(status);
                    }
				});
			};

			$scope.setCritical = function(status,i){
			    console.log("Status");
			    console.log(status);
			    console.log(i);
			    $scope.statuses[i].isSeverity = false;

            };

			$scope.setCurrentStatus = function(status,i){
			    console.log("Current Status");
			    console.log(status);
			    console.log(i);
			    if($scope.statuses[i].isCurrentStatus){
                    for(var j=0;j<$scope.statuses.length;j++){
                        if(j===i){
                            $scope.statuses[j].allowCurrentStatus = true;
                        }else{
                            $scope.statuses[j].allowCurrentStatus = false;
                            $scope.statuses[j].isCurrentStatus = false;
                        }
                    }
                }else{
                    for(var k=0;k<$scope.statuses.length;k++){
                        $scope.statuses[k].allowCurrentStatus = true;
                    }
                }

            };


			$scope.loadAllRules = function() {
				AssetComponent.getAllRules().then(function(data) {
					//console.log(data);
					$scope.readingRules = data;
				});
			}


			$scope.cancel = function(){

				$location.path('/assets');

			}

			$scope.imgNotValid=false;
			$scope.imgSizeHigh=false;


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

			$scope.fileNotValid=false;
			$scope.fileSizeHigh=false;

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

					/* select: function(start, end) {

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
					},*/
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
							'<input type="text" class="form-control" placeholder="Schedule Title" id="input-title" value="'+calEvent.title+'" disabled>' +
							'</div>'+
							'<div class="form-group">' +
							'<input type="text" class="form-control" placeholder="Schedule Description" id="input-desc" disabled>' +
							'</div>'+
							'<div class="form-group">' +
							'<input type="text" class="form-control" placeholder="DD/MM/YYYY" id="input-fdate" value="'+inputFdate+'" disabled>' +
							'</div>'+
							'<div class="form-group">' +
							'<input type="text" class="form-control" placeholder="DD/MM/YYYY" id="input-tdate" value="'+inputTdate+'" disabled>' +
							'</div>'+
							'<div class="form-group">' +
							'<input type="text" class="form-control" placeholder="Weekly" id="input-frq" value="" disabled>' +
							'</div>',
							showCancelButton: true,
							confirmButtonClass: 'btn btn-success',
							cancelButtonClass: 'btn btn-danger',
							buttonsStyling: false
						}).catch(function(err) {
                            //console.error(err);
                            //throw err;
                        })

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

				$scope.qrAll= "Odd";

				if($scope.checkboxSel.indexOf(id) <= -1){

					$scope.checkboxSel.push(id);

				}else if($scope.checkboxSel.indexOf(id) > -1){

					var remId =$scope.checkboxSel.indexOf(id);

					$scope.checkboxSel.splice(remId, 1);
				}

				if($scope.checkboxSel.length == 0){
					$scope.assetQrSiteVal ='';
					$scope.qrAll='';
				}
				// If any entity is not checked, then uncheck the "allItemsSelected" checkbox

				for (var i = 0; i < $scope.assets.length; i++) {

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
				$scope.searchSite = $scope.assetQrSite;
				$scope.sitesListOne.selected = $scope.searchSite;
				$scope.setPage(1);
				$scope.search();
				/*if($scope.assetQrSite){
                	$scope.allItemsSelected = true;
                    $scope.assetQrSiteVal =$scope.assetQrSite.id;
                }else{
                	$scope.allItemsSelected = false;
                    $scope.assetQrSiteVal =0;
                }

                $scope.qrAll= "All";
                $scope.checkboxSel=[];

                // Loop through all the entities and set their isChecked property
                for (var i = 0; i < $scope.assets.length; i++) {

                    $scope.checkboxSel.push($scope.assets[i].id);

                    $scope.assets[i].isChecked = $scope.allItemsSelected;
                }

                if(!$scope.allItemsSelected){

                    $scope.checkboxSel=[];


                }*/


				//alert($scope.checkboxSel);


			};

			/* Multiple check box select(Multiple qr printing) End */

			$scope.qrListLoad= function(ids){
				$scope.loadingStart();
				if($stateParams.qrStatus == 'All'){
					$scope.assetQrList ={}
					AssetComponent.printAllQr({siteId:$stateParams.siteId}).then(function(data){
						$scope.loadingStop();
						$scope.assetQrList = data;
						//$location.path('/qr-code-list');
						//console.log('Qr List',$scope.assetQrList);

					});
				}
				else if ($stateParams.qrStatus == 'Odd'){
					$scope.assetQrList ={}
					AssetComponent.multipleQr($stateParams.ids).then(function(data){
						$scope.loadingStop();
						$scope.assetQrList = data;
						//$location.path('/qr-code-list');
						//console.log('Qr List',$scope.assetQrList);
					});
				}else{

					$scope.loadingStop();
				}

			}


			$scope.loadSiteHistory = function() {
				$rootScope.loadingStart();
				$rootScope.loadPageTop();
				var siteHistoryCurrPageVal = ($scope.pages ? $scope.pages.currPage : 1);
				if(!$scope.siteHistoryCriteria) {
					var siteHistorySearchCriteria = {
							currPage : siteHistoryCurrPageVal
					};
					$scope.siteHistorySearchCriteria = siteHistorySearchCriteria;
				}

				$scope.siteHistorySearchCriteria.currPage = siteHistoryCurrPageVal;
				$scope.searchModule = "siteHistory";
				$scope.siteHistorySearchCriteria.assetId = $stateParams.id;
				$scope.siteHistorySearchCriteria.sort = $scope.pageSort;
				$scope.siteHistories = "";
				//console.log('Site historys search criteria',$scope.siteHistorySearchCriteria);
				AssetComponent.getSiteHistory($scope.siteHistorySearchCriteria).then(function(data) {
					$rootScope.loadingStop();
					//console.log(data);
					$scope.siteHistories = data.transactions;

					/*
					 ** Call pagination  main function **
					 */

					$scope.pager = {};
					$scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
					$scope.totalCountPages = data.totalCount;

					//console.log("Pagination",$scope.pager);
					//console.log("Site historys List - ", data);

				});

			}

			$scope.loadStatusHistory = function() {
				$rootScope.loadingStart();
				$rootScope.loadPageTop();
				var statusHistoryCurrPageVal = ($scope.pages ? $scope.pages.currPage : 1);
				if(!$scope.statusHistoryCriteria) {
					var statusHistorySearchCriteria = {
							currPage : statusHistoryCurrPageVal
					};
					$scope.statusHistorySearchCriteria = statusHistorySearchCriteria;
				}

				$scope.statusHistorySearchCriteria.currPage = statusHistoryCurrPageVal;
				$scope.statusHistorySearchCriteria.module = "statusHistory";
				$scope.searchModule = "statusHistory";
				$scope.statusHistorySearchCriteria.assetId = $stateParams.id;
				$scope.statusHistorySearchCriteria.sort = $scope.pageSort;
				$scope.statusHistories = "";
				//console.log('Status historys search criteria',$scope.statusHistorySearchCriteria);
				AssetComponent.getStatusHistory($scope.statusHistorySearchCriteria).then(function(data) {
					$rootScope.loadingStop();
					//console.log(data);
					$scope.statusHistories = data.transactions;

					/*
					 ** Call pagination  main function **
					 */

					$scope.pager = {};
					$scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
					$scope.totalCountPages = data.totalCount;

					//console.log("Pagination",$scope.pager);
					//console.log("Status historys List - ", data);
				});

			}


			$scope.loadTicket = function() {

				$rootScope.loadingStart();
				$rootScope.loadPageTop();
				var ticketCurrPageVal = ($scope.pages ? $scope.pages.currPage : 1);
				if(!$scope.ticketCriteria) {
					var ticketSearchCriteria = {
							currPage : ticketCurrPageVal
					};
					$scope.ticketSearchCriteria = ticketSearchCriteria;
				}

				$scope.ticketSearchCriteria.currPage = ticketCurrPageVal;
				$scope.ticketSearchCriteria.module = "Ticket";
				$scope.searchModule = "Ticket";
				$scope.ticketSearchCriteria.assetId = $stateParams.id;
				$scope.ticketSearchCriteria.sort = $scope.pageSort;
				$scope.tickets = "";
				//console.log('Ticket search criteria',$scope.ticketSearchCriteria);
				AssetComponent.getTicketHistory($scope.ticketSearchCriteria).then(function(data) {
					$rootScope.loadingStop();
					//console.log(data);
					$scope.tickets = data.transactions;

					/*
					 ** Call pagination  main function **
					 */

					$scope.pager = {};
					$scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
					$scope.totalCountPages = data.totalCount;

					//console.log("Pagination",$scope.pager);
					//console.log("Asset tickets - ", data);

				});

			}

			$scope.checkMinMax = function(){

				if($scope.selectedMinValue != null && $scope.selectedMaxValue != null){

					if($scope.selectedMinValue >= $scope.selectedMaxValue){

						$scope.minError =true;
						$scope.maxError =true;

					}else{
						$scope.minError =false;
						$scope.maxError =false;
					}

				}else{
					$scope.minError =false;
					$scope.maxError =false;
				}
			}


			$scope.exportAllData = function(type){
				$rootScope.exportStatusObj = {};
				$scope.downloader=true;
				$scope.downloaded = false;
				$scope.searchCriteria.exportType = type;
				$scope.searchCriteria.report = true;
				$scope.searchCriteria.isReport = true;
				$scope.searchCriteria.columnName = "createdDate";
				$scope.searchCriteria.sortByAsc = false;
				$scope.typeMsg = type;

				//console.log('calling asset export api');
				AssetComponent.exportAllData($scope.searchCriteria).then(function(data){
					var result = data.results[0];
					//console.log(result.file + ', ' + result.status + ',' + result.msg);
					var exportAllStatus = {
							fileName : result.file,
							exportMsg : 'Exporting All...',
							url: result.url
					};
					$scope.exportStatusMap[0] = exportAllStatus;
					//console.log('exportStatusMap size - ' + $scope.exportStatusMap.length);
					$scope.start();
				},function(err){
					//console.log('error message for export all ')
					//console.log(err);
				});
			};

			// store the interval promise in this variable
			var promise;

			// starts the interval
			$scope.start = function() {
				// stops any running interval to avoid two intervals running at the same time
				$scope.stop();

				// store the interval promise
				promise = $interval($scope.exportStatus, 5000);
				//console.log('promise -'+promise);
			};

			// stops the interval
			$scope.stop = function() {
				$interval.cancel(promise);
			};

			$scope.exportStatusMap = [];


			$scope.exportStatus = function() {
				////console.log('empId='+$scope.empId);
				//console.log('exportStatusMap length -'+$scope.exportStatusMap.length);
				angular.forEach($scope.exportStatusMap, function(exportStatusObj, index){
					if(!exportStatusObj.empId) {
						exportStatusObj.empId = 0;
					}
					AssetComponent.exportStatus(exportStatusObj.fileName).then(function(data) {
						if(data) {
							exportStatusObj.exportStatus = data.status;
							//console.log('exportStatus - '+ exportStatusObj);
							exportStatusObj.exportMsg = data.msg;
							$scope.downloader=false;
							//console.log('exportMsg - '+ exportStatusObj.exportMsg);
							if(exportStatusObj.exportStatus == 'COMPLETED'){
								if(exportStatusObj.url) {
									exportStatusObj.exportFile = exportStatusObj.url;
								}else {
									exportStatusObj.exportFile = data.file;
								}
								//console.log('exportFile - '+ exportStatusObj.exportFile);
								$scope.stop();
							}else if(exportStatusObj.exportStatus == 'FAILED'){
								$scope.stop();
							}else if(!exportStatusObj.exportStatus){
								$scope.stop();
							}else {
								exportStatuObj.exportFile = '#';
							}
						}

					});
				});

			}

			$scope.exportFile = function(empId) {
				if(empId != 0) {
					var exportFile = '';
					angular.forEach($scope.exportStatusMap, function(exportStatusObj, index){
						if(empId == exportStatusObj.empId){
							exportFile = exportStatusObj.exportFile;
							return exportFile;
						}
					});
					return exportFile;
				}else {
					return ($scope.exportStatusMap[empId] ? $scope.exportStatusMap[empId].exportFile : '#');
				}
			}


			$scope.exportMsg = function(empId) {
				if(empId != 0) {
					var exportMsg = '';
					angular.forEach($scope.exportStatusMap, function(exportStatusObj, index){
						if(empId == exportStatusObj.empId){
							exportMsg = exportStatusObj.exportMsg;
							return exportMsg;
						}
					});
					return exportMsg;
				}else {
					return ($scope.exportStatusMap[empId] ? $scope.exportStatusMap[empId].exportMsg : '');
				}

			};

			$scope.downloaded = false;

			$scope.clsDownload = function(){
				$scope.downloaded = true;
				$rootScope.exportStatusObj = {};
			}

			$scope.mulSel = function(){

				if($scope.allItemsSelected){
					$("#qrModal").modal();
					$scope.allItemsSelected = false;

				}
				else{
					$scope.allItemsSelected = false;
					$scope.checkboxSel=[];
					$scope.assetQrSiteVal ='';
					$scope.qrAll='';
					// Loop through all the entities and set their isChecked property
					for (var i = 0; i < $scope.assets.length; i++) {

						$scope.assets[i].isChecked = $scope.allItemsSelected;

					}

				}

			}

			$scope.loadSubModule = function(cb){
				$scope.pages = { currPage : 1};
				$scope.pager = {};
				return cb();
			}

			$scope.siteChange = function(){

				if($scope.selectedSites && $scope.assetList.siteId != $scope.selectedSites.id){

					$('#siteChangeModalConfig').modal();

				}
			}

			$scope.backToView = function(){

				$location.path('view-asset/'+ $scope.scheduleObj.assetId);
			}

			//Search Filter Site Load Function

			$scope.projectFilterFunction = function (searchProject){
				$scope.siteSpin = true;
				ProjectComponent.findSites(searchProject.id).then(function (data) {
					$scope.selectedSite = null;
					$scope.sitesList = data;
					$scope.sitesLists = [];
					$scope.sitesLists[0] = $scope.allSites;

					for(var i=0;i<$scope.sitesList.length;i++)
					{
						$scope.sitesLists[i+1] = $scope.sitesList[i];
					}
					$scope.siteFilterDisable = false;
					$scope.siteSpin = false;
				});

			};

			//Search Filter Region Load Function

			$scope.regionFilterFunction = function (searchProject){
				$scope.regionSpin = true;
				SiteComponent.getRegionByProject(searchProject.id).then(function (response) {
					//console.log(response);
					$scope.regionList = response;
					$scope.regionsLists = [];
					//$scope.regionsListOne.selected = null;
					$scope.regionsLists[0] = $scope.allRegions;

					for(var i=0;i<$scope.regionList.length;i++)
					{
						$scope.regionsLists[i+1] = $scope.regionList[i];
					}

					//console.log('region list : ' + JSON.stringify($scope.regionList));
					$scope.regionSpin = false;
					$scope.regionFilterDisable = false;
					//callback();
				});
			};

			//Search Filter Branch Load Function

			$scope.branchFilterFunction = function (searchProject,searchRegion){
				$scope.branchSpin = true;
				SiteComponent.getBranchByProject(searchProject.id,searchRegion.id).then(function (response) {
					// //console.log('branch',response);
					$scope.branchList = response;
					if($scope.branchList) {
						$scope.branchsLists = [];
						// $scope.branchsListOne.selected = null;
						$scope.branchsLists[0] = $scope.allBranchs;

						for(var i=0;i<$scope.branchList.length;i++)
						{
							$scope.branchsLists[i+1] = $scope.branchList[i];
						}
						/* if($scope.branchList) {
                 		for(var i = 0; i < $scope.branchList.length; i++) {
                 			$scope.uiBranch.push($scope.branchList[i].name);
                 		}*/
						$scope.branchSpin = false;
						$scope.branchFilterDisable = false;
					}
					else{
						//console.log('branch list : ' + JSON.stringify($scope.branchList));
						$scope.getSitesBYRegionOrBranch($scope.searchProject.id,$scope.searchRegion.name,null);
						$scope.branchSpin = false;
						$scope.branchFilterDisable = false;
						//callback();
					}

				})
			};


			$scope.getSitesBYRegionOrBranch = function (projectId, region, branch) {
				if(branch){
					$scope.siteFilterDisable = true;
					$scope.siteSpin = true;
					SiteComponent.getSitesByBranch(projectId,region,branch).then(function (data) {
						$scope.selectedSite = null;
						$scope.sitesList = data;
						$scope.sitesLists = [];
						$scope.sitesListOne.selected = null;
						$scope.sitesLists[0] = $scope.allSites;

						for(var i=0;i<$scope.sitesList.length;i++)
						{
							$scope.sitesLists[i+1] = $scope.sitesList[i];
						}
						$scope.siteFilterDisable = false;
						$scope.siteSpin = false;
					});

				}else if(region){
					$scope.siteFilterDisable = true;
					$scope.siteSpin = true;

					SiteComponent.getSitesByRegion(projectId,region).then(function (data) {
						$scope.selectedSite = null;
						$scope.sitesList = data;
						$scope.sitesLists = [];
						$scope.sitesListOne.selected = null;
						$scope.sitesLists[0] = $scope.allSites;

						for(var i=0;i<$scope.sitesList.length;i++)
						{
							$scope.sitesLists[i+1] = $scope.sitesList[i];
						}
						$scope.siteFilterDisable = false;
						$scope.siteSpin = false;
					})

				}/*else if(projectId >0){
            $scope.siteFilterDisable = true;
            $scope.siteSpin = true;
            ProjectComponent.findSites(projectId).then(function (data) {
                $scope.selectedSite = null;
                $scope.sitesList = data;
                $scope.sitesLists = [];
                $scope.sitesListOne.selected = null;
                $scope.sitesLists[0] = $scope.allSites;

                for(var i=0;i<$scope.sitesList.length;i++)
                {
                    $scope.sitesLists[i+1] = $scope.sitesList[i];
                }
                $scope.siteFilterDisable = false;
                $scope.siteSpin = false;
            });
        }else{

        }*/
			};

			/*
			 * Ui select allow-clear modified function start
			 *
			 * */


			$scope.clearProject = function($event) {
				$event.stopPropagation();
				$scope.client.selected = undefined;
				$scope.regionsListOne.selected = undefined;
				$scope.branchsListOne.selected = undefined;
				$scope.sitesListOne.selected = undefined;
				$scope.regionFilterDisable = true;
				$scope.branchFilterDisable = true;
				$scope.siteFilterDisable = true;
			};

			$scope.clearRegion = function($event) {
				$event.stopPropagation();
				$scope.regionsListOne.selected = undefined;
				$scope.branchsListOne.selected = undefined;
				$scope.sitesListOne.selected = undefined;
				$scope.branchFilterDisable = true;
				$scope.siteFilterDisable = true;
			};

			$scope.clearBranch = function($event) {
				$event.stopPropagation();
				$scope.branchsListOne.selected = undefined;
				$scope.sitesListOne.selected = undefined;
				$scope.siteFilterDisable = true;
			};

			$scope.clearSite = function($event) {
				$event.stopPropagation();
				$scope.sitesListOne.selected = undefined;

			};



			/*
			 * Ui select allow-clear modified function end
			 *
			 * */
        $scope.assetFinalLists = [];
        $scope.assetParentList = [];
       // $scope.selectedAssetParent = {};
		$scope.getAssetHierarchy = function() {
		    var obj = {
		        "siteId": $scope.selectedSites.id,
                "assetTypeId" : $scope.selectedAssetType ? $scope.selectedAssetType.id : 0
            };
		    AssetComponent.getAssetHierarchy(obj).then(function(data){
                console.log("AssetHierarchy is" +JSON.stringify(data));
                if(data.length > 0) {
                    initMapAssetTree("", data);   // { assetTitle : "LG Invertor"}, "LG Invertor
                    console.log($scope.assetFinalLists);
                }else{
                    $scope.assetFinalLists = [];
                    //$scope.selectedAssetParent = null;
                    console.log(JSON.stringify($scope.assetFinalLists));
                }
            });
        }

        $scope.getAssetGrpHierarchy = function() {

        	$scope.choosenAssetParent = {};

		    var obj = {
		        "siteId": $scope.selectedSites.id
            }
            AssetComponent.getAssetGrpHierarchy(obj).then(function(data) {
                console.log("Asset Group Hierarchy" +JSON.stringify(data));
                if(data.length > 0) {
                    initMapAssetGrpTree("", data)
                }else{
                    $scope.assetParentList = [];
                }
            });
        }

        function initMapAssetTree(prefix, assetList){

            for( var i in assetList ){

                $scope.assetFinalLists.push({"id": assetList[i].id, "title": (prefix + assetList[i].title) });

                if(assetList[i].assets && assetList[i].assets.length > 0) {
                    initMapAssetTree("|__"+prefix,assetList[i].assets);
                }
            }

        }

        function initMapAssetGrpTree(prefix, assetGrpList){

            for( var i in assetGrpList ){

                $scope.assetParentList.push({id: assetGrpList[i].id, group: (prefix + assetGrpList[i].assetgroup),plainName: assetGrpList[i].assetgroup });

                if(assetGrpList[i].assetGroup && assetGrpList[i].assetGroup.length > 0) {
                    initMapAssetGrpTree("|__"+prefix,assetGrpList[i].assetGroup);
                }
            }

        }




        });
