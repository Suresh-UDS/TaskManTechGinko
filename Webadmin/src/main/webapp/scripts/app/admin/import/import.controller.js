'use strict';

angular.module('timeSheetApp')
.controller(
		'ImportController',
		function($scope, $rootScope, $state, $timeout, JobComponent,
				ProjectComponent, SiteComponent,EmployeeComponent,ChecklistComponent, AssetComponent, LocationComponent, $http, $stateParams,
				$location,$interval) {
			$rootScope.loadingStop();
			$rootScope.loginView = false;
			$scope.success = null;
			$scope.error = null;
			$scope.doNotMatch = null;
			$scope.errorProjectExists = null;

			$scope.selectedJobFile;
			$scope.selectedEmployeeFile;
			$scope.selectedChecklistFile;
			$scope.selectedEmployeeShiftFile;
			//client file
			$scope.selectedClientFile;
			$scope.clientImportStatus = {};
			$scope.checklistImportStatus = {};
			$scope.employeeShiftImportStatus = {};
			$scope.siteImportStatus = {};
			$scope.jobImportStatus = {};
			$scope.jobImportStatusLoad = false;
			$scope.empImportStatusLoad = false;
			$scope.checklistImportStatusLoad = false;
			$scope.clientImportStatusLoad = false;
			$scope.siteImportStatusLoad = false;
			$scope.locationImportStatusLoad = false;
			$scope.employeeImportStatus = {};
			$scope.employeeShiftImportStatusLoad = false;
			$scope.assetImportStatus = {};
			$scope.assetImportStatusLoad = false;
			$scope.assetPPMImportStatus = {};
			$scope.assetPPMImportStatusLoad = false;
			$scope.assetAMCImportStatus = {};
			$scope.assetAMCImportStatusLoad = false;
            $scope.inventoryImportStatus = {};
            $scope.inventoryImportStatusLoad = false;
			$scope.importStatus;
			$scope.importEmployeeStatus;
			$scope.pager = {};
			$scope.selectFile = function() {
				console.log($scope.selectedJobFile);
			}



			// upload Job File
			$scope.uploadJobFile = function() {
				console.log('selected job file - ' + $scope.selectedJobFile);
				if($scope.selectedJobFile){
					$scope.jobImportStatusLoad = true;
					console.log('$rootScope.jobImportStatus msg - '+$rootScope.jobImportStatus);

					JobComponent.importFile($scope.selectedJobFile).then(function(data){
						console.log(data);
						var result = data;
						console.log(result.file + ', ' + result.status + ',' + result.msg);
						var importStatus = {
								fileName : result.file,
								importMsg : result.msg
						};
						$scope.jobImportStatus = importStatus;
						if(result.status == 'COMPLETED') {
							$scope.showNotification('top','center','success','Job data imported successfuly');
							$scope.jobImportStatusLoad = false;
						}else if(result.status == 'PROCESSING') {
							$rootScope.start('job');
						}
					},function(err){
						console.log('Import error');
						if(err && err.data && err.data.msg) {
							$scope.showNotification('top','center','danger',err.data.msg);
						}else {
							$scope.showNotification('top','center','danger','Error importing Job data, Please check the data and try again');
						}
						console.log(err);
						$scope.jobImportStatusLoad = false;
					});
				}else {
					console.log('Choose a file!!!');
				}

			}
			// Job Import Status
			$scope.jobImportStatus = function() {
				console.log('$scope.jobImportStatus import controller -'+JSON.stringify($scope.jobImportStatus));
				JobComponent.importStatus($scope.jobImportStatus.fileName).then(function(data) {
					if(data) {

						$scope.jobImportStatus.importStatus = data.status;
						console.log('jobimportStatus - '+ $scope.jobImportStatus);
						$scope.jobImportStatus.importMsg = data.msg;
						console.log('jobimportMsg - '+ $scope.jobImportStatus.importMsg);
						if($scope.jobImportStatus.importStatus == 'COMPLETED'){
							$scope.showNotification('top','center','success','Job data imported successfully');
							$scope.jobImportStatus.fileName = data.file;
							console.log('jobimportFile - '+ $scope.jobImportStatus.fileName);
							$rootScope.stop('job');
							$scope.jobImportStatusLoad = false;
							$timeout(function() {
								$scope.jobImportStatus = {};
							}, 3000);
						}else if($scope.jobImportStatus.importStatus == 'FAILED'){
							$scope.showNotification('top','center','danger',$scope.jobImportStatus.importMsg);
							$rootScope.stop('job');
							$scope.jobImportStatusLoad = false;
							$timeout(function() {
								$scope.jobImportStatus = {};
							}, 3000);
//							}else if(!$rootScope.jobImportStatus.importStatus){
//							$rootScope.stop('job');
//							$scope.showNotifications('top','center','danger',$rootScope.jobImportStatus.importMsg);
						}else if($scope.employeeImportStatus.importStatus == 'PROCESSING'){
							//do nothing
						}else {
							$scope.jobImportStatus.fileName = '#';
						}

					}
					$scope.jobImportStatusLoad = false;

				});

			}
			$scope.jobImportMsg = function() {
				console.log('$scope.jobImportStatus message - '+ JSON.stringify($scope.jobImportStatus));
				return (' Job msg - '+$scope.jobImportStatus ? $scope.jobImportStatus.importMsg : '');
			};
			/* $scope.jobImportStatusLoad = function(){
	    	console.log('$rootScope.jobImportStatusLoad message '+ $rootScope.jobImportStatusLoad);
	    	return ($rootScope.jobImportStatusLoad ? $rootScope.jobImportStatusLoad : '');
	    };*/
			// Job end



			// upload Employee File  start
			$scope.uploadEmployeeFile = function(){
				if($scope.selectedEmployeeFile){
					$scope.empImportStatusLoad = true;
					console.log('selected employee file - ' + $scope.selectedEmployeeFile);
					EmployeeComponent.importEmployeeFile($scope.selectedEmployeeFile).then(function(data){
						console.log(data);
						var result = data;
						console.log(result.file + ', ' + result.status + ',' + result.msg);
						var importStatus = {
								fileName : result.file,
								importMsg : result.msg
						};
						$scope.employeeImportStatus = importStatus;
						if(result.status == 'COMPLETED') {
							$scope.showNotification('top','center','success','Employee data imported successfuly');
							$scope.empImportStatusLoad = false;
						}else if(result.status == 'PROCESSING') {
							$rootScope.start('employee');
						}
					},function(err){
						console.log('Import error');
						if(err && err.data && err.data.msg) {
							$scope.showNotification('top','center','danger',err.data.msg);
						}else {
							$scope.showNotification('top','center','danger','Error importing Employee data, Please check the data and try again');
						}
						console.log(err);
						$scope.empImportStatusLoad = false;
					});
				}else{
					console.log('select a file');
				}
			}

			$scope.employeeImportStatus = function() {
				EmployeeComponent.importEmployeeStatus($scope.employeeImportStatus.fileName).then(function(data) {
					if(data) {
						$scope.employeeImportStatus.importStatus = data.status;
						console.log('employeeimportStatus - '+ $scope.employeeImportStatus);
						$scope.employeeImportStatus.importMsg = data.msg;
						console.log('employeeimportMsg - '+ $scope.employeeImportStatus.importMsg);
						if($scope.employeeImportStatus.importStatus == 'COMPLETED'){
							$scope.employeeImportStatus.fileName = data.file;
							console.log('importEmployeeFile - '+ $rootScope.employeeImportStatus.fileName);
							$scope.empImportStatusLoad = false;
							$scope.showNotification('top','center','success','Employee data imported successfully');
							$rootScope.stop('employee');
							$timeout(function() {
								$scope.employeeImportStatus = {};
							}, 3000);
						}else if($scope.employeeImportStatus.importStatus == 'FAILED'){
							$scope.showNotification('top','center','danger',$scope.employeeImportStatus.importMsg);
							$rootScope.stop('employee');
							$scope.empImportStatusLoad = false;
							$timeout(function() {
								$scope.employeeImportStatus = {};
							}, 3000);
						}else if($scope.employeeImportStatus.importStatus == 'PROCESSING'){
							//do nothing
						}else {
							$rootScope.stop('employee');
							$scope.showNotification('top','center','danger',$scope.employeeImportStatus.importMsg);
							$scope.employeeImportStatus.fileName = '#';
							$scope.empImportStatusLoad = false;
							$timeout(function() {
								$scope.employeeImportStatus = {};
							}, 3000);
						}
					}
					$scope.empImportStatusLoad = false;
				});
			}

			$scope.employeeImportMsg = function() {
				return ('employeeMsg - '+$scope.employeeImportStatus ? $scope.employeeImportStatus.importMsg : '');
			};
			/*$scope.empImportStatusLoad = function(){
	    	console.log('$scope.empImportStatusLoad message '+ $scope.empImportStatusLoad);
	    	return ($scope.empImportStatusLoad ? $scope.empImportStatusLoad : '');
	   };*/
			//Employee end

			//client upload file start
			$scope.uploadClients = function() {
				if($scope.selectedClientFile){
					$scope.clientImportStatusLoad = true;
					console.log('************************selected Client file - ' + $scope.selectedClientFile);
					ProjectComponent.importFile($scope.selectedClientFile).then(function(data){
						console.log(data);
						var result = data;
						console.log(result.file + ', ' + result.status + ',' + result.msg);
						var importStatus = {
								fileName : result.file,
								importMsg : result.msg
						};
						$scope.clientImportStatus = importStatus;
						if(result.status == 'COMPLETED') {
							$scope.showNotification('top','center','success','Client data imported successfuly');
							$scope.clientImportStatusLoad = false;
						}else if(result.status == 'PROCESSING') {
							$rootScope.start('client');
						}

					},function(err){
						console.log('Client Import error');
						if(err && err.data && err.data.msg) {
							$scope.showNotification('top','center','danger',err.data.msg);
						}else {
							$scope.showNotification('top','center','danger','Error importing Client data, Please check the data and try again');
						}
						console.log(err);
						$scope.clientImportStatusLoad = false;
					});
				}

			}

			$scope.clientImportStatus = function() {
				console.log('$scope.clientImportStatus -'+JSON.stringify($scope.clientImportStatus));

				ProjectComponent.importStatus($scope.clientImportStatus.fileName).then(function(data) {
					if(data) {
						$scope.clientImportStatus.importStatus = data.status;
						console.log('*****************importStatus - '+ JSON.stringify($scope.clientImportStatus));
						$scope.clientImportStatus.importMsg = data.msg;
						console.log('**************importMsg - '+ $scope.clientImportStatus.importMsg);
						if($scope.clientImportStatus.importStatus == 'COMPLETED'){
							$scope.clientImportStatus.fileName = data.file;
							console.log('importFile - '+ $scope.clientImportStatus.fileName);
							$rootScope.stop('client');
							$scope.clientImportStatusLoad = false;
							$scope.showNotification('top','center','success','Client data imported successfully');
							$timeout(function() {
								$scope.clientImportStatus = {};
							}, 3000);
						}else if($scope.clientImportStatus.importStatus == 'FAILED'){
							$scope.showNotification('top','center','danger',$scope.clientImportStatus.importMsg);
							$rootScope.stop('client');
							$scope.clientImportStatusLoad = false;
							$timeout(function() {
								$scope.clientImportStatus = {};
							}, 3000);
						}else if($scope.employeeImportStatus.importStatus == 'PROCESSING'){
							//do nothing
						}else {
							$scope.showNotification('top','center','danger',$scope.clientImportStatus.importMsg);
							$scope.clientImportStatus.fileName = '#';
							$scope.clientImportStatusLoad = false;
						}
					}
					$scope.clientImportStatusLoad = false;

				});

			}
			$scope.clientImportMsg = function() {
				return ($scope.clientImportStatus ? $scope.clientImportStatus.importMsg : '');
			};
			/*$scope.clientImportStatusLoad = function(){
		    	console.log('$scope.clientImportStatusLoad message '+ $scope.clientImportStatusLoad);
		    	return ($scope.clientImportStatusLoad ? $scope.clientImportStatusLoad : '');
		};*/
			// client upload end

			// upload Site File start
			$scope.uploadSitesFile = function(){
				if($scope.selectedSiteFile){
					$scope.siteImportStatusLoad = true;
					console.log('selected site file -'+ $scope.selectedSiteFile);
					SiteComponent.importSiteFile($scope.selectedSiteFile).then(function(data){
						console.log(data);
						var result = data;
						console.log(result.file + ', '+result.status + ',' + result.msg);
						var importStatus = {
								fileName : result.file,
								importMsg : result.msg
						};
						$scope.siteImportStatus = importStatus;
						if(result.status == 'COMPLETED') {
							$scope.showNotification('top','center','success','Site data imported successfuly');
							$scope.siteImportStatusLoad = false;
						}else if(result.status == 'PROCESSING') {
							$rootScope.start('site');
						}
					},function(err){
						console.log();
						if(err && err.data && err.data.msg) {
							$scope.showNotification('top','center','danger',err.data.msg);
						}else {
							$scope.showNotification('top','center','danger','Error importing Site data, Please check the data and try again');
						}
						$scope.siteImportStatusLoad = false;
					});
				}
			}

			$scope.siteImportStatus = function() {
				console.log('$scope.siteImportStatus -'+JSON.stringify($scope.siteImportStatus));

				SiteComponent.importStatus($scope.siteImportStatus.fileName).then(function(data) {
					if(data) {
						$scope.siteImportStatus.importStatus = data.status;
						console.log('*****************importStatus - '+ JSON.stringify($scope.siteImportStatus));
						$scope.siteImportStatus.importMsg = data.msg;
						console.log('**************importMsg - '+ $scope.siteImportStatus.importMsg);
						if($scope.siteImportStatus.importStatus == 'COMPLETED'){
							$scope.siteImportStatus.fileName = data.file;
							console.log('importFile - '+ $scope.siteImportStatus.fileName);
							$rootScope.stop('site');
							$scope.siteImportStatusLoad = false;
							$scope.showNotification('top','center','Success','Site data imported successfully');
							$timeout(function() {
								$scope.siteImportStatus = {};
							}, 3000);
						}else if($scope.siteImportStatus.importStatus == 'FAILED'){
							$scope.showNotification('top','center','danger',$scope.siteImportStatus.importMsg);
							$rootScope.stop('site');
							$scope.siteImportStatusLoad = false;
							$timeout(function() {
								$scope.siteImportStatus = {};
							}, 3000);
						}else if($scope.employeeImportStatus.importStatus == 'PROCESSING'){
							//do nothing
						}else {
							$scope.showNotification('top','center','danger',$scope.clientImportStatus.importMsg);
							$scope.siteImportStatus.fileName = '#';
							$scope.siteImportStatusLoad = false;
						}
					}
					$scope.siteImportStatusLoad = false;
				});
			}

			/*$scope.siteImportMsg = function() {
			   return ($scope.siteImportStatus ? $scope.siteImportStatus.importMsg : '');
			};  */
			/*$scope.siteImportStatusLoad = function(){
			    	console.log('$scope.siteImportStatusLoad message '+ $scope.siteImportStatusLoad);
			    	return ($scope.siteImportStatusLoad ? $scope.siteImportStatusLoad : '');
			};*/

			$scope.uploadSiteEmployeeFile = function(){
				if($scope.selectedSiteEmployeeFile){
					SiteComponent.employeeSiteChange($scope.selectedSiteEmployeeFile).then(function (data) {
						console.log(data);
					},function (err) {
						console.log("Error in saving employee");
						console.log(err);
					})
				}
			}

			// upload Location File start
			$scope.uploadLocationsFile = function(){
				if($scope.selectedLocationFile){
					$scope.locationImportStatusLoad = true;
					console.log('selected location file -'+ $scope.selectedLocationFile);
					LocationComponent.importLocationFile($scope.selectedLocationFile).then(function(data){
						console.log(data);
						var result = data;
						console.log(result.file + ', '+result.status + ',' + result.msg);
						var importStatus = {
								fileName : result.file,
								importMsg : result.msg
						};
						$scope.locationImportStatus = importStatus;
						if(result.status == 'COMPLETED') {
							$scope.showNotification('top','center','success','Location data imported successfuly');
							$scope.locationImportStatusLoad = false;
						}else if(result.status == 'PROCESSING') {
							$rootScope.start('location');
						}
					},function(err){
						console.log();
						if(err && err.data && err.data.msg) {
							$scope.showNotification('top','center','danger',err.data.msg);
						}else {
							$scope.showNotification('top','center','danger','Error importing Location data, Please check the data and try again');
						}
						$scope.locationImportStatusLoad = false;

					});
				}
			}

			$scope.locationImportStatus = function() {
				console.log('$scope.locationImportStatus -'+JSON.stringify($scope.locationImportStatus));

				LocationComponent.importStatus($scope.locationImportStatus.fileName).then(function(data) {
					if(data) {

						$scope.locationImportStatus.importStatus = data.status;
						console.log('*****************importStatus - '+ JSON.stringify($scope.locationImportStatus));
						$scope.locationImportStatus.importMsg = data.msg;
						console.log('**************importMsg - '+ $scope.locationImportStatus.importMsg);
						if($scope.locationImportStatus.importStatus == 'COMPLETED'){
							$scope.locationImportStatus.fileName = data.file;
							console.log('importFile - '+ $scope.locationImportStatus.fileName);
							$rootScope.stop('location');
							$scope.locationImportStatusLoad = false;
							$scope.showNotification('top','center','success','Location data imported successfully');
							$timeout(function() {
								$scope.locationImportStatus = {};
							}, 3000);
						}else if($scope.locationImportStatus.importStatus == 'FAILED'){
							$scope.showNotification('top','center','danger',$scope.locationImportStatus.importMsg);
							$rootScope.stop('location');
							$scope.locationImportStatusLoad = false;
							$timeout(function() {
								$scope.locationImportStatus = {};
							}, 3000);
						}else if($scope.employeeImportStatus.importStatus == 'PROCESSING'){
							//do nothing
						}else {
							$scope.showNotification('top','center','danger',$scope.locationImportStatus.importMsg);
							$scope.locationImportStatus.fileName = '#';
							$scope.locationImportStatusLoad = false;
						}
					}

					$scope.locationImportStatusLoad = false;
				});
			}

			/*$scope.locationImportMsg = function() {
				   return ($scope.locationImportStatus ? $scope.locationImportStatus.importMsg : '');
				};  */
			/*$scope.locationImportStatusLoad = function(){
				    	console.log('$scope.locationImportStatusLoad message '+ $scope.locationImportStatusLoad);
				    	return ($scope.locationImportStatusLoad ? $scope.locationImportStatusLoad : '');
				};*/



			// site file end

			//Checklist upload file start
			$scope.uploadChecklist = function() {
				//var extn = checklistFile.substr(fileName.lastIndexOf('.')+1);
				//alert(extn);
				//return false;
				if($scope.selectedChecklistFile){
					$scope.checklistImportStatusLoad = true;
					console.log('************************selected checklist file - ' + $scope.selectedChecklistFile);
					ChecklistComponent.importChecklistFile($scope.selectedChecklistFile).then(function(data){
						console.log(data);
						var result = data;
						console.log(result.file + ', ' + result.status + ',' + result.msg);
						var importStatus = {
								fileName : result.file,
								importMsg : result.msg
						};
						$scope.checklistImportStatus = importStatus;
						if(result.status == 'COMPLETED') {
							$scope.showNotification('top','center','success','Checklist data imported successfuly');
							$scope.checklistImportStatusLoad = false;
						}else if(result.status == 'PROCESSING') {
							$rootScope.start('checklist');
						}
					},function(err){
						console.log('Checklist Import error');
						if(err && err.data && err.data.msg) {
							$scope.showNotification('top','center','danger',err.data.msg);
						}else {
							$scope.showNotification('top','center','danger','Error importing Checklist data, Please check the data and try again');
						}
						console.log(err);
						$scope.checklistImportStatusLoad = false;
					});

				}
			}

			$scope.checklistImportStatus = function() {
				console.log('$scope.checklistImportStatus -'+JSON.stringify($scope.checklistImportStatus));
				ChecklistComponent.importStatus($scope.checklistImportStatus.fileName).then(function(data) {
					if(data) {
						$scope.checklistImportStatus.importStatus = data.status;
						console.log('*****************importStatus - '+ JSON.stringify($scope.checklistImportStatus));
						$scope.checklistImportStatus.importMsg = data.msg;
						console.log('**************importMsg - '+ $scope.checklistImportStatus.importMsg);
						if($scope.checklistImportStatus.importStatus == 'COMPLETED'){
							$scope.checklistImportStatus.fileName = data.file;
							console.log('importFile - '+ $scope.checklistImportStatus.fileName);
							$rootScope.stop('checklist');
							$scope.checklistImportStatusLoad = false;
							$scope.showNotification('top','center','success','Checklist data imported successfully');
							$timeout(function() {
								$scope.checklistImportStatus = {};
							}, 3000);
						}else if($scope.checklistImportStatus.importStatus == 'FAILED'){
							$scope.showNotification('top','center','danger',$scope.checklistImportStatus.importMsg);
							$rootScope.stop('checklist');
							$scope.checklistImportStatusLoad = false;
							$timeout(function() {
								$scope.checklistImportStatus = {};
							}, 3000);
						}else if($scope.employeeImportStatus.importStatus == 'PROCESSING'){
							//do nothing
						}else {
							$scope.showNotification('top','center','danger',$scope.checklistImportStatus.importMsg);
							$scope.checklistImportStatus.fileName = '#';
						}
					}
					$scope.checklistImportStatusLoad = false;

				});

			}


			/*$scope.checklistImportStatusLoad = function(){
		   	console.log('$scope.checklistImportStatusLoad message '+ $rootScope.checklistImportStatusLoad);
		   	return ($rootScope.checklistImportStatusLoad ? $rootScope.checklistImportStatusLoad : '');
<<<<<<< HEAD
	   };

	   //Employee shift upload file start
	    $scope.uploadEmployeeShift = function() {
		    	if($scope.selectedEmployeeShiftFile){
		    		$rootScope.employeeShiftImportStatusLoad = true;
	   		console.log('************************selected employee shift file - ' + $scope.selectedEmployeeShiftFile);
	   		EmployeeComponent.importEmployeeShiftFile($scope.selectedEmployeeShiftFile).then(function(data){
	   			console.log(data);
	   			var result = data;
	   			console.log(result.file + ', ' + result.status + ',' + result.msg);
	   			var importStatus = {
	       				fileName : result.file,
	       				importMsg : result.msg
	       		};
	       		$rootScope.employeeShiftImportStatus = importStatus;
	       		$rootScope.start('employeeShift');
	        },function(err){
	           	  console.log('Client Import error')
	           	  console.log(err);
	        });

		  }
	   }

	    $scope.employeeShiftImportStatus = function() {
	    		console.log('$rootScope.employeeShiftImportStatus -'+JSON.stringify($rootScope.employeeShiftImportStatus));
       		EmployeeComponent.importEmployeeShiftStatus($rootScope.employeeShiftImportStatus.fileName).then(function(data) {
           		if(data) {
           			$rootScope.employeeShiftImportStatus.importStatus = data.status;
               		console.log('*****************importStatus - '+ JSON.stringify($rootScope.employeeShiftImportStatus));
               		$rootScope.employeeShiftImportStatus.importMsg = data.msg;
               		console.log('**************importMsg - '+ $rootScope.employeeShiftImportStatus.importMsg);
               		if($rootScope.employeeShiftImportStatus.importStatus == 'COMPLETED'){
               			$rootScope.employeeShiftImportStatus.fileName = data.file;
                   		console.log('importFile - '+ $rootScope.employeeShiftImportStatus.fileName);
                   		$scope.stop('employeeShift');
                   		$rootScope.employeeShiftImportStatusLoad = false;
                   		$timeout(function() {
                   			$rootScope.employeeShiftImportStatus = {};
                   	    }, 3000);
               		}else if($rootScope.employeeShiftImportStatus.importStatus == 'FAILED'){
                   		$scope.stop('employeeShift');
               		}else if(!$rootScope.employeeShiftImportStatus.importStatus){
               			$scope.stop('employeeShift');
               		}else {
               			$rootScope.employeeShiftImportStatus.fileName = '#';
               		}
           		}

           	});

	    }


	   $scope.employeeShiftImportStatusLoad = function(){
		   	console.log('$scope.employeeShiftImportStatusLoad message '+ $rootScope.employeeShiftImportStatusLoad);
		   	return ($rootScope.employeeShiftImportStatusLoad ? $rootScope.employeeShiftImportStatusLoad : '');
	   };



	   //Asset upload file start
	    $scope.uploadAsset = function() {
		    	if($scope.selectedAssetFile){
		    		$rootScope.assetImportStatusLoad = true;
	   		console.log('************************selected asset file - ' + $scope.selectedAssetFile);
	   		AssetComponent.importAssetFile($scope.selectedAssetFile).then(function(data){
	   			console.log(data);
	   			var result = data;
	   			console.log(result.file + ', ' + result.status + ',' + result.msg);
	   			var importStatus = {
	       				fileName : result.file,
	       				importMsg : result.msg
	       		};
	       		$rootScope.assetImportStatus = importStatus;
	       		$rootScope.start('asset');
	        },function(err){
	           	  console.log('Asset Import error')
	           	  console.log(err);
	        });

		  }
	   }

	    $scope.assetImportStatus = function() {
	    		console.log('$rootScope.assetImportStatus -'+JSON.stringify($rootScope.assetImportStatus));
      		AssetComponent.importAssetStatus($rootScope.assetImportStatus.fileName).then(function(data) {
          		if(data) {
          			$rootScope.assetImportStatus.importStatus = data.status;
              		console.log('*****************importStatus - '+ JSON.stringify($rootScope.assetImportStatus));
              		$rootScope.assetImportStatus.importMsg = data.msg;
              		console.log('**************importMsg - '+ $rootScope.assetImportStatus.importMsg);
              		if($rootScope.assetImportStatus.importStatus == 'COMPLETED'){
              			$rootScope.assetImportStatus.fileName = data.file;
                  		console.log('importFile - '+ $rootScope.assetImportStatus.fileName);
                  		$scope.stop('asset');
                  		$rootScope.assetImportStatusLoad = false;
                  		$timeout(function() {
                  			$rootScope.assetImportStatus = {};
                  	    }, 3000);
              		}else if($rootScope.assetImportStatus.importStatus == 'FAILED'){
                  		$scope.stop('asset');
              		}else if(!$rootScope.assetImportStatus.importStatus){
              			$scope.stop('asset');
              		}else {
              			$rootScope.assetImportStatus.fileName = '#';
              		}
          		}

          	});

	    }


	   $scope.assetImportStatusLoad = function(){
		   	console.log('$scope.assetImportStatusLoad message '+ $rootScope.assetImportStatusLoad);
		   	return ($rootScope.assetImportStatusLoad ? $rootScope.assetImportStatusLoad : '');
	   };


	   //Asset PPM upload file start
	    $scope.uploadAssetPPM = function() {
		    	if($scope.selectedAssetPPMFile){
		    		$rootScope.assetImportPPMStatusLoad = true;
	   		console.log('************************selected asset PPM file - ' + $scope.selectedAssetPPMFile);
	   		AssetComponent.importAssetPPMFile($scope.selectedAssetPPMFile).then(function(data){
	   			console.log(data);
	   			var result = data;
	   			console.log(result.file + ', ' + result.status + ',' + result.msg);
	   			var importStatus = {
	       				fileName : result.file,
	       				importMsg : result.msg
	       		};
	       		$rootScope.assetPPMImportStatus = importStatus;
	       		$rootScope.start('assetPPM');
	        },function(err){
	           	  console.log('Asset PPM Import error')
	           	  console.log(err);
	        });

		  }
	   }

	    $scope.assetPPMImportStatus = function() {
	    		console.log('$rootScope.assetPPMImportStatus -'+JSON.stringify($rootScope.assetPPMImportStatus));
     		AssetComponent.importAssetPPMStatus($rootScope.assetPPMImportStatus.fileName).then(function(data) {
         		if(data) {
         			$rootScope.assetPPMImportStatus.importStatus = data.status;
             		console.log('*****************importStatus - '+ JSON.stringify($rootScope.assetPPMImportStatus));
             		$rootScope.assetPPMImportStatus.importMsg = data.msg;
             		console.log('**************importMsg - '+ $rootScope.assetPPMImportStatus.importMsg);
             		if($rootScope.assetPPMImportStatus.importStatus == 'COMPLETED'){
             			$rootScope.assetPPMImportStatus.fileName = data.file;
                 		console.log('importFile - '+ $rootScope.assetPPMImportStatus.fileName);
                 		$scope.stop('assetPPM');
                 		$rootScope.assetPPMImportStatusLoad = false;
                 		$timeout(function() {
                 			$rootScope.assetPPMImportStatus = {};
                 	    }, 3000);
             		}else if($rootScope.assetPPMImportStatus.importStatus == 'FAILED'){
                 		$scope.stop('assetPPM');
             		}else if(!$rootScope.assetPPMImportStatus.importStatus){
             			$scope.stop('assetPPM');
             		}else {
             			$rootScope.assetPPMImportStatus.fileName = '#';
             		}
         		}

         	});

	    }


	   $scope.assetPPMImportStatusLoad = function(){
		   	console.log('$scope.assetPPMImportStatusLoad message '+ $rootScope.assetPPMImportStatusLoad);
		   	return ($rootScope.assetPPMImportStatusLoad ? $rootScope.assetPPMImportStatusLoad : '');
	   };

	 //Asset AMC upload file start
	    $scope.uploadAssetAMC = function() {
		    	if($scope.selectedAssetAMCFile){
		    		$rootScope.assetImportAMCStatusLoad = true;
	   		console.log('************************selected asset AMC file - ' + $scope.selectedAssetAMCFile);
	   		AssetComponent.importAssetAMCFile($scope.selectedAssetAMCFile).then(function(data){
	   			console.log(data);
	   			var result = data;
	   			console.log(result.file + ', ' + result.status + ',' + result.msg);
	   			var importStatus = {
	       				fileName : result.file,
	       				importMsg : result.msg
	       		};
	       		$rootScope.assetAMCImportStatus = importStatus;
	       		$rootScope.start('assetAMC');
	        },function(err){
	           	  console.log('Asset AMC Import error')
	           	  console.log(err);
	        });

		  }
	   }

	    $scope.assetAMCImportStatus = function() {
	    		console.log('$rootScope.assetAMCImportStatus -'+JSON.stringify($rootScope.assetAMCImportStatus));
	    		AssetComponent.importAssetAMCStatus($rootScope.assetAMCImportStatus.fileName).then(function(data) {
	        		if(data) {
	        			$rootScope.assetAMCImportStatus.importStatus = data.status;
	            		console.log('*****************importStatus - '+ JSON.stringify($rootScope.assetAMCImportStatus));
	            		$rootScope.assetAMCImportStatus.importMsg = data.msg;
	            		console.log('**************importMsg - '+ $rootScope.assetAMCImportStatus.importMsg);
	            		if($rootScope.assetAMCImportStatus.importStatus == 'COMPLETED'){
	            			$rootScope.assetAMCImportStatus.fileName = data.file;
	                		console.log('importFile - '+ $rootScope.assetAMCImportStatus.fileName);
	                		$scope.stop('assetAMC');
	                		$rootScope.assetAMCImportStatusLoad = false;
	                		$timeout(function() {
	                			$rootScope.assetAMCImportStatus = {};
	                	    }, 3000);
	            		}else if($rootScope.assetAMCImportStatus.importStatus == 'FAILED'){
	                		$scope.stop('assetAMC');
	            		}else if(!$rootScope.assetAMCImportStatus.importStatus){
	            			$scope.stop('assetAMC');
	            		}else {
	            			$rootScope.assetAMCImportStatus.fileName = '#';
	            		}
	        		}

	        	});

	    }


	   $scope.assetAMCImportStatusLoad = function(){
		   	console.log('$scope.assetAMCImportStatusLoad message '+ $rootScope.assetAMCImportStatusLoad);
		   	return ($rootScope.assetAMCImportStatusLoad ? $rootScope.assetAMCImportStatusLoad : '');
	   };

	   //Inventory Master upload file start
	    $scope.uploadInventoryMaster = function() {
		    	if($scope.selectedMasterFile){
		    		$rootScope.inventoryImportStatusLoad = true;
	   		console.log('************************selected asset file - ' + $scope.selectedMasterFile);
	   		InventoryComponent.importInventoryFile($scope.selectedMasterFile).then(function(data){
	   			console.log(data);
	   			var result = data;
	   			console.log(result.file + ', ' + result.status + ',' + result.msg);
	   			var importStatus = {
	       				fileName : result.file,
	       				importMsg : result.msg
	       		};
	       		$rootScope.inventoryImportStatus = importStatus;
	       		$rootScope.start('inventory');
	        },function(err){
	           	  console.log('Inventory Import error')
	           	  console.log(err);
	        });

		  }
	   }

	    $scope.inventoryImportStatus = function() {
	    		console.log('$rootScope.assetImportStatus -'+JSON.stringify($rootScope.inventoryImportStatus));
     		InventoryComponent.importInventoryStatus($rootScope.inventoryImportStatus.fileName).then(function(data) {
         		if(data) {
         			$rootScope.inventoryImportStatus.importStatus = data.status;
             		console.log('*****************importStatus - '+ JSON.stringify($rootScope.inventoryImportStatus));
             		$rootScope.inventoryImportStatus.importMsg = data.msg;
             		console.log('**************importMsg - '+ $rootScope.inventoryImportStatus.importMsg);
             		if($rootScope.inventoryImportStatus.importStatus == 'COMPLETED'){
             			$rootScope.inventoryImportStatus.fileName = data.file;
                 		console.log('importFile - '+ $rootScope.inventoryImportStatus.fileName);
                 		$scope.stop('inventory');
                 		$rootScope.inventoryImportStatusLoad = false;
                 		$timeout(function() {
                 			$rootScope.inventoryImportStatus = {};
                 	    }, 3000);
             		}else if($rootScope.inventoryImportStatus.importStatus == 'FAILED'){
                 		$scope.stop('inventory');
             		}else if(!$rootScope.inventoryImportStatus.importStatus){
             			$scope.stop('inventory');
             		}else {
             			$rootScope.inventoryImportStatus.fileName = '#';
             		}
         		}

         	});

	    }


	   $scope.inventoryImportStatusLoad = function(){
		   	console.log('$scope.assetImportStatusLoad message '+ $rootScope.inventoryImportStatusLoad);
		   	return ($rootScope.inventoryImportStatusLoad ? $rootScope.inventoryImportStatusLoad : '');
	   };


	 // store the interval promise in this variable
	 var promiseJob;
	 var promiseEmployee;
	 var promiseClient;
	 var promiseSite;
	 var promiseChecklist;
	 var promiseEmployeeShift;
	 var promiseAsset;
	 var promiseAssetPPM;
	 var promiseAssetAMC;
	 // starts the interval
	    $rootScope.start = function(typeImport) {
	      // stops any running interval to avoid two intervals running at the same time
	    	//$rootScope.stop('job');

	      // store the interval promise
	    	if(typeImport == 'job'){
	    		$rootScope.stop('job');
	    		console.log('Import Job Start Method');
	    		promiseJob = $interval($scope.jobImportStatus, 5000);
	    		console.log('promise -'+promiseJob);
	    	}
	    	if(typeImport == 'employee'){
	    		$rootScope.stop('employee');
	    		console.log('Import Employee Start Method');
	    		promiseEmployee = $interval($scope.employeeImportStatus, 5000);
	    		console.log('promise -'+promiseEmployee);
	    	}
	    	if(typeImport == 'client'){
	    		$rootScope.stop('client');
	    		console.log('Import Client Start Method');
	    		promiseClient = $interval($scope.clientImportStatus, 5000);
	    		console.log('promise -'+promiseClient);
	    	}
	    	if(typeImport == 'site'){
	    		$rootScope.stop('site');
	    		console.log('Import Site Start Method');
	    		promiseSite = $interval($scope.siteImportStatus, 5000);
	    		console.log('promise -'+promiseSite);
	    	}
	    	if(typeImport == 'checklist'){
	    		$rootScope.stop('checklist');
	    		console.log('Import checklist Start Method');
	    		promiseChecklist = $interval($scope.checklistImportStatus, 5000);
	    		console.log('promise -'+promiseChecklist);
	    	}
	    	if(typeImport == 'employeeShift'){
	    		$rootScope.stop('employeeShift');
	    		console.log('Import employeeShift Start Method');
	    		promiseEmployeeShift = $interval($scope.employeeShiftImportStatus, 5000);
	    		console.log('promise -'+promiseEmployeeShift);
	    	}
	    	if(typeImport == 'asset'){
	    		$rootScope.stop('asset');
	    		console.log('Import asset Start Method');
	    		promiseAsset = $interval($scope.assetImportStatus, 5000);
	    		console.log('promise -'+promiseAsset);
	    	}
	    	if(typeImport == 'assetPPM'){
	    		$rootScope.stop('assetPPM');
	    		console.log('Import asset PPM Start Method');
	    		promiseAssetPPM = $interval($scope.assetPPMImportStatus, 5000);
	    		console.log('promise -'+promiseAssetPPM);
	    	}
	    	if(typeImport == 'assetAMC'){
	    		$rootScope.stop('assetAMC');
	    		console.log('Import asset AMC Start Method');
	    		promiseAssetAMC = $interval($scope.assetAMCImportStatus, 5000);
	    		console.log('promise -'+promiseAssetAMC);
	    	}
	    	if(typeImport == 'inventory'){
	    		$rootScope.stop('inventory');
	    		console.log('Import inventory start method');
	    		promiseInventory = $inventory($scope.inventoryImportStatus, 5000);
	    		console.log('promise -' +promiseInventory);
	    	}
	    };
	    // stops the interval
	    $rootScope.stop = function(stopInterval) {
	      if(stopInterval == 'job'){
	    	  $interval.cancel(promiseJob);
	      }
	      if(stopInterval == 'employee'){
	    	  $interval.cancel(promiseEmployee);
	      }
	      if(stopInterval == 'client'){
	    	  $interval.cancel(promiseClient);
	      }
	      if(stopInterval == 'site'){
	    	  $interval.cancel(promiseSite);
	      }
	      if(stopInterval == 'checklist'){
	    	  $interval.cancel(promiseChecklist);
	      }
	      if(stopInterval == 'employeeShift'){
	    	  	$interval.cancel(promiseEmployeeShift);
	      }
	      if(stopInterval == 'asset'){
	    	  	$interval.cancel(promiseAsset);
	      }
	      if(stopInterval == 'assetPPM'){
	    	  	$interval.cancel(promiseAssetPPM);
	      }
	      if(stopInterval == 'assetAMC'){
	    	  	$interval.cancel(promiseAssetAMC);
	      }
	      if(stopInterval == 'inventory'){
	    	  $inventory.cancel(promiseInventory);
	      }
	    };


         //init load
        $scope.initLoad = function(){
             $scope.loadPageTop();
             $scope.initPage();

         }


    });
=======
	   };*/

			//Employee shift upload file start
			$scope.uploadEmployeeShift = function() {
				if($scope.selectedEmployeeShiftFile){
					$scope.employeeShiftImportStatusLoad = true;
					console.log('************************selected employee shift file - ' + $scope.selectedEmployeeShiftFile);
					EmployeeComponent.importEmployeeShiftFile($scope.selectedEmployeeShiftFile).then(function(data){
						console.log(data);
						var result = data;
						console.log(result.file + ', ' + result.status + ',' + result.msg);
						var importStatus = {
								fileName : result.file,
								importMsg : result.msg
						};
						$scope.employeeShiftImportStatus = importStatus;
						if(result.status == 'COMPLETED') {
							$scope.showNotification('top','center','success','Employee Shift data imported successfuly');
							$scope.employeeShiftImportStatusLoad = false;
						}else if(result.status == 'PROCESSING') {
							$rootScope.start('employeeShift');
						}
					},function(err){
						console.log('Employee shift Import error');
						if(err && err.data && err.data.msg) {
							$scope.showNotification('top','center','danger',err.data.msg);
						}else {
							$scope.showNotification('top','center','danger','Error importing Employee Shift data, Please check the data and try again');
						}
						console.log(err);
						$scope.employeeShiftImportStatusLoad = false;
					});

				}
			}

			$scope.employeeShiftImportStatus = function() {
				console.log('$scope.employeeShiftImportStatus -'+JSON.stringify($scope.employeeShiftImportStatus));
				EmployeeComponent.importEmployeeShiftStatus($scope.employeeShiftImportStatus.fileName).then(function(data) {
					if(data) {
						$scope.employeeShiftImportStatus.importStatus = data.status;
						console.log('*****************importStatus - '+ JSON.stringify($scope.employeeShiftImportStatus));
						$scope.employeeShiftImportStatus.importMsg = data.msg;
						console.log('**************importMsg - '+ $scope.employeeShiftImportStatus.importMsg);
						if($scope.employeeShiftImportStatus.importStatus == 'COMPLETED'){
							$scope.employeeShiftImportStatus.fileName = data.file;
							console.log('importFile - '+ $scope.employeeShiftImportStatus.fileName);
							$rootScope.stop('employeeShift');
							$scope.employeeShiftImportStatusLoad = false;
							$scope.showNotification('top','center','success','Employee Shift data imported successfully');
							$timeout(function() {
								$scope.employeeShiftImportStatus = {};
							}, 3000);
						}else if($scope.employeeShiftImportStatus.importStatus == 'FAILED'){
							$scope.showNotification('top','center','danger',$scope.employeeShiftImportStatus.importMsg);
							$rootScope.stop('employeeShift');
							$scope.employeeShiftImportStatusLoad = false;
							$timeout(function() {
								$scope.employeeShiftImportStatus = {};
							}, 3000);

						}else if($scope.employeeImportStatus.importStatus == 'PROCESSING'){
							//do nothing
						}else {
							$scope.showNotification('top','center','danger',$scope.employeeShiftImportStatus.importMsg);
							$scope.employeeShiftImportStatus.fileName = '#';
						}
					}
					$scope.employeeShiftImportStatusLoad = false;

				});

			}


			/* $scope.employeeShiftImportStatusLoad = function(){
		   	console.log('$scope.employeeShiftImportStatusLoad message '+ $scope.employeeShiftImportStatusLoad);
		   	return ($scope.employeeShiftImportStatusLoad ? $scope.employeeShiftImportStatusLoad : '');
	   };*/



			//Asset upload file start
			$scope.uploadAsset = function() {

				if($scope.selectedAssetFile){

					$scope.assetImportStatusLoad = true;
					console.log('************************selected asset file - ' + $scope.selectedAssetFile);
					AssetComponent.importAssetFile($scope.selectedAssetFile).then(function(data){
						console.log(data);
						var result = data;
						console.log(result.file + ', ' + result.status + ',' + result.msg);
						var importStatus = {
								fileName : result.file,
								importMsg : result.msg
						};
						$scope.assetImportStatus = importStatus;
						if(result.status == 'COMPLETED') {
							$scope.showNotification('top','center','success','Asset data imported successfuly');
							$scope.assetImportStatusLoad = false;
						}else if(result.status == 'PROCESSING') {
							$rootScope.start('asset');
						}
					},function(err){
						console.log('Asset Import error');
						if(err && err.data && err.data.msg) {
							$scope.showNotification('top','center','danger',err.data.msg);
						}else {
							$scope.showNotification('top','center','danger','Error importing Asset data, Please check the data and try again');
						}
						console.log(err);
						$scope.assetImportStatusLoad = false;
					});

				}
			}

			$scope.assetImportStatus = function() {

				console.log('$scope.assetImportStatus -'+JSON.stringify($scope.assetImportStatus));
				AssetComponent.importAssetStatus($scope.assetImportStatus.fileName).then(function(data) {
					if(data) {
						$scope.assetImportStatus.importStatus = data.status;
						console.log('*****************importStatus - '+ JSON.stringify($scope.assetImportStatus));
						$scope.assetImportStatus.importMsg = data.msg;
						console.log('**************importMsg - '+ $scope.assetImportStatus.importMsg);
						if($scope.assetImportStatus.importStatus == 'COMPLETED'){
							$scope.assetImportStatus.fileName = data.file;
							console.log('importFile - '+ $scope.assetImportStatus.fileName);
							$rootScope.stop('asset');
							$scope.assetImportStatusLoad = false;
							$scope.showNotification('top','center','success','Asset data imported successfully');
							$timeout(function() {
								$scope.assetImportStatus = {};
							}, 3000);
						}else if($scope.assetImportStatus.importStatus == 'FAILED'){
							$rootScope.stop('asset');
							$scope.showNotification('top','center','danger',$scope.assetImportStatus.importMsg);
							$scope.assetImportStatusLoad = false;
						}else if($scope.employeeImportStatus.importStatus == 'PROCESSING'){
							//do nothing
						}else {
							$scope.showNotification('top','center','danger',$scope.assetImportStatus.importMsg);
							$scope.assetImportStatus.fileName = '#';
						}
					}
					$scope.assetImportStatusLoad = false;

				});

			}


			/*  $scope.assetImportStatusLoad = function(){
		   	console.log('$scope.assetImportStatusLoad message '+ $scope.assetImportStatusLoad);
		   	return ($scope.assetImportStatusLoad ? $scope.assetImportStatusLoad : '');
	   };*/


			//Asset PPM upload file start
			$scope.uploadAssetPPM = function() {
				if($scope.selectedAssetPPMFile){
					$scope.assetPPMImportStatusLoad = true;
					console.log('************************selected asset PPM file - ' + $scope.selectedAssetPPMFile);
					AssetComponent.importAssetPPMFile($scope.selectedAssetPPMFile).then(function(data){
						console.log(data);
						var result = data;
						console.log(result.file + ', ' + result.status + ',' + result.msg);
						var importStatus = {
								fileName : result.file,
								importMsg : result.msg
						};
						$scope.assetPPMImportStatus = importStatus;
						if(result.status == 'COMPLETED') {
							$scope.showNotification('top','center','success','Asset PPM data imported successfuly');
							$scope.assetPPMImportStatusLoad = false;
						}else if(result.status == 'PROCESSING') {
							$rootScope.start('assetPPM');
						}
					},function(err){
						console.log('Asset PPM Import error');
						if(err && err.data && err.data.msg) {
							$scope.showNotification('top','center','danger',err.data.msg);
						}else {
							$scope.showNotification('top','center','danger','Error importing Asset PPM data, Please check the data and try again');
						}
						console.log(err);
						$scope.assetPPMImportStatusLoad = false;
					});

				}
			}

			$scope.assetPPMImportStatus = function() {
				console.log('$scope.assetPPMImportStatus -'+JSON.stringify($scope.assetPPMImportStatus));
				AssetComponent.importAssetPPMStatus($scope.assetPPMImportStatus.fileName).then(function(data) {
					if(data) {
						$scope.assetPPMImportStatus.importStatus = data.status;
						console.log('*****************importStatus - '+ JSON.stringify($scope.assetPPMImportStatus));
						$scope.assetPPMImportStatus.importMsg = data.msg;
						console.log('**************importMsg - '+ $scope.assetPPMImportStatus.importMsg);
						if($scope.assetPPMImportStatus.importStatus == 'COMPLETED'){
							$scope.assetPPMImportStatus.fileName = data.file;
							console.log('importFile - '+ $scope.assetPPMImportStatus.fileName);
							$rootScope.stop('assetPPM');
							$scope.assetPPMImportStatusLoad = false;
							$scope.showNotification('top','center','success','Asset PPM data imported successfully');
							$timeout(function() {
								$scope.assetPPMImportStatus = {};
							}, 3000);
						}else if($scope.assetPPMImportStatus.importStatus == 'FAILED'){
							$scope.showNotification('top','center','danger',$scope.assetPPMImportStatus.importMsg);
							$rootScope.stop('assetPPM');
							$scope.assetPPMImportStatusLoad = false;
						}else if($scope.employeeImportStatus.importStatus == 'PROCESSING'){
							//do nothing
						}else {
							$scope.showNotification('top','center','danger',$scope.assetPPMImportStatus.importMsg);
							$scope.assetPPMImportStatus.fileName = '#';
						}
					}
					$scope.assetPPMImportStatusLoad = false;

				});

			}


			/* $scope.assetPPMImportStatusLoad = function(){
		   	console.log('$scope.assetPPMImportStatusLoad message '+ $scope.assetPPMImportStatusLoad);
		   	return ($scope.assetPPMImportStatusLoad ? $scope.assetPPMImportStatusLoad : '');
	   };*/

			//Asset AMC upload file start
			$scope.uploadAssetAMC = function() {
				if($scope.selectedAssetAMCFile){
					$scope.assetAMCImportStatusLoad = true;
					console.log('************************selected asset AMC file - ' + $scope.selectedAssetAMCFile);
					AssetComponent.importAssetAMCFile($scope.selectedAssetAMCFile).then(function(data){
						console.log(data);
						var result = data;
						console.log(result.file + ', ' + result.status + ',' + result.msg);
						var importStatus = {
								fileName : result.file,
								importMsg : result.msg
						};
						$scope.assetAMCImportStatus = importStatus;
						if(result.status == 'COMPLETED') {
							$scope.showNotification('top','center','success','Asset AMC data imported successfuly');
							$scope.assetAMCImportStatusLoad = false;
						}else if(result.status == 'PROCESSING') {
							$rootScope.start('assetAMC');
						}
					},function(err){
						console.log('Asset AMC Import error')
						console.log(err);
						if(err && err.data && err.data.msg) {
							$scope.showNotification('top','center','danger',err.data.msg);
						}else {
							$scope.showNotification('top','center','danger','Error importing Asset AMC data, Please check the data and try again');
						}
						$scope.assetAMCImportStatusLoad = false;
					});

				}
			}

			$scope.assetAMCImportStatus = function() {
				console.log('$scope.assetAMCImportStatus -'+JSON.stringify($scope.assetAMCImportStatus));
				AssetComponent.importAssetAMCStatus($scope.assetAMCImportStatus.fileName).then(function(data) {
					if(data) {
						$scope.assetAMCImportStatus.importStatus = data.status;
						console.log('*****************importStatus - '+ JSON.stringify($scope.assetAMCImportStatus));
						$scope.assetAMCImportStatus.importMsg = data.msg;
						console.log('**************importMsg - '+ $scope.assetAMCImportStatus.importMsg);
						if($scope.assetAMCImportStatus.importStatus == 'COMPLETED'){
							$scope.assetAMCImportStatus.fileName = data.file;
							console.log('importFile - '+ $scope.assetAMCImportStatus.fileName);
							$rootScope.stop('assetAMC');
							$scope.assetAMCImportStatusLoad = false;
							$scope.showNotification('top','center','success','Asset AMC data imported successfully');
							$timeout(function() {
								$scope.assetAMCImportStatus = {};
							}, 3000);
						}else if($scope.assetAMCImportStatus.importStatus == 'FAILED'){
							$scope.showNotification('top','center','danger',$scope.assetAMCImportStatus.importMsg);
							$rootScope.stop('assetAMC');
							$scope.assetAMCImportStatusLoad = false;
						}else if($scope.employeeImportStatus.importStatus == 'PROCESSING'){
							//do nothing
						}else {
							$scope.showNotification('top','center','danger',$scope.assetAMCImportStatus.importMsg);
							$scope.assetAMCImportStatus.fileName = '#';
						}
					}
					$scope.assetAMCImportStatusLoad = false;

				});

			}


			/* $scope.assetAMCImportStatusLoad = function(){
		   	console.log('$scope.assetAMCImportStatusLoad message '+ $scope.assetAMCImportStatusLoad);
		   	return ($scope.assetAMCImportStatusLoad ? $scope.assetAMCImportStatusLoad : '');
	   };*/


			// store the interval promise in this variable
			var promiseJob;
			var promiseEmployee;
			var promiseClient;
			var promiseSite;
			var promiseLocation;
			var promiseChecklist;
			var promiseEmployeeShift;
			var promiseAsset;
			var promiseAssetPPM;
			var promiseAssetAMC;
			// starts the interval
			$rootScope.start = function(typeImport) {
				// stops any running interval to avoid two intervals running at the same time
				//$rootScope.stop('job');

				// store the interval promise
				if(typeImport == 'job'){
					$rootScope.stop('job');
					console.log('Import Job Start Method');
					promiseJob = $interval($scope.jobImportStatus, 5000);
					console.log('promise -'+promiseJob);
				}
				if(typeImport == 'employee'){
					$rootScope.stop('employee');
					console.log('Import Employee Start Method');
					promiseEmployee = $interval($scope.employeeImportStatus, 5000);
					console.log('promise -'+promiseEmployee);
				}
				if(typeImport == 'client'){
					$rootScope.stop('client');
					console.log('Import Client Start Method');
					promiseClient = $interval($scope.clientImportStatus, 5000);
					console.log('promise -'+promiseClient);
				}
				if(typeImport == 'site'){
					$rootScope.stop('site');
					console.log('Import Site Start Method');
					promiseSite = $interval($scope.siteImportStatus, 5000);
					console.log('promise -'+promiseSite);
				}
				if(typeImport == 'location'){
					$rootScope.stop('location');
					console.log('Import location Start Method');
					promiseLocation = $interval($scope.locationImportStatus, 5000);
					console.log('promise -'+promiseLocation);
				}
				if(typeImport == 'checklist'){
					$rootScope.stop('checklist');
					console.log('Import checklist Start Method');
					promiseChecklist = $interval($scope.checklistImportStatus, 5000);
					console.log('promise -'+promiseChecklist);
				}
				if(typeImport == 'employeeShift'){
					$rootScope.stop('employeeShift');
					console.log('Import employeeShift Start Method');
					promiseEmployeeShift = $interval($scope.employeeShiftImportStatus, 5000);
					console.log('promise -'+promiseEmployeeShift);
				}
				if(typeImport == 'asset'){
					$rootScope.stop('asset');
					console.log('Import asset Start Method');
					promiseAsset = $interval($scope.assetImportStatus, 5000);
					console.log('promise -'+promiseAsset);
				}
				if(typeImport == 'assetPPM'){
					$rootScope.stop('assetPPM');
					console.log('Import asset PPM Start Method');
					promiseAssetPPM = $interval($scope.assetPPMImportStatus, 5000);
					console.log('promise -'+promiseAssetPPM);
				}
				if(typeImport == 'assetAMC'){
					$rootScope.stop('assetAMC');
					console.log('Import asset AMC Start Method');
					promiseAssetAMC = $interval($scope.assetAMCImportStatus, 5000);
					console.log('promise -'+promiseAssetAMC);
				}
			};
			// stops the interval
			$rootScope.stop = function(stopInterval) {
				if(stopInterval == 'job'){
					$interval.cancel(promiseJob);
				}
				if(stopInterval == 'employee'){
					$interval.cancel(promiseEmployee);
				}
				if(stopInterval == 'client'){
					$interval.cancel(promiseClient);
				}
				if(stopInterval == 'site'){
					$interval.cancel(promiseSite);
				}
				if(stopInterval == 'location'){
					$interval.cancel(promiseLocation);
				}
				if(stopInterval == 'checklist'){
					$interval.cancel(promiseChecklist);
				}
				if(stopInterval == 'employeeShift'){
					$interval.cancel(promiseEmployeeShift);
				}
				if(stopInterval == 'asset'){
					$interval.cancel(promiseAsset);
				}
				if(stopInterval == 'assetPPM'){
					$interval.cancel(promiseAssetPPM);
				}
				if(stopInterval == 'assetAMC'){
					$interval.cancel(promiseAssetAMC);
				}
			};


			//init load
			$scope.initLoad = function(){
				$scope.loadPageTop();
				//$scope.initPage();

			}

			$scope.showNotification= function(position,alignment,color,msg){
				demo.showNotification(position,alignment,color,msg);
			}

			$scope.showNotification = function(position,alignment,color,msg){
				demo.showNotificationLonger(position,alignment,color,msg);
			}


		});
