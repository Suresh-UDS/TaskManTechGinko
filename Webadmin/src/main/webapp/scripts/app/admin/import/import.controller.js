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
	        		$rootScope.jobImportStatus = importStatus;
	        		$rootScope.start('job');
	         },function(err){
	            	  console.log('Import error');
	            	  $scope.showNotification('top','center','danger','Unnable to job data import');
	            	  console.log(err);
	            	  $scope.jobImportStatusLoad = false;
	         });
        	}else {
        		console.log('Choose a file!!!');
        	}

        }
	    // Job Import Status
	    $scope.jobImportStatus = function() {
	        	console.log('$rootScope.jobImportStatus import controller -'+JSON.stringify($rootScope.jobImportStatus));
	            	JobComponent.importStatus($rootScope.jobImportStatus.fileName).then(function(data) {
	            		if(data) {
	            			
	            			$rootScope.jobImportStatus.importStatus = data.status;
	                		console.log('jobimportStatus - '+ $rootScope.jobImportStatus);
	                		$rootScope.jobImportStatus.importMsg = data.msg;
	                		console.log('jobimportMsg - '+ $rootScope.jobImportStatus.importMsg);
	                		if($rootScope.jobImportStatus.importStatus == 'COMPLETED'){
	                			$rootScope.jobImportStatus.fileName = data.file;
	                    		console.log('jobimportFile - '+ $rootScope.jobImportStatus.fileName);
	                    		$scope.showNotification('top','center','success','Job data imported successfully');
	                    		$scope.stop('job');
	                    		$timeout(function() {
	                    			$rootScope.jobImportStatus = {};
	                    	      }, 3000);
	                		}else if($rootScope.jobImportStatus.importStatus == 'FAILED'){
	                			$scope.showNotification('top','center','danger',$rootScope.jobImportStatus.importMsg);
	                    		$scope.stop('job');
	                    		
	                		}else if(!$rootScope.jobImportStatus.importStatus){
	                			$scope.showNotification('top','center','danger','Unnable to job data import');
	                			$scope.stop('job');
	                		}else {
	                			$scope.showNotification('top','center','danger','Unnable to job data import');
	                			$rootScope.jobImportStatus.fileName = '#';
	                		}
	                		
	            		}
	            		$rootScope.jobImportStatusLoad = false;

	            	});

	    }
	    $scope.jobImportMsg = function() {
	    	console.log('$rootScope.jobImportStatus message - '+ JSON.stringify($rootScope.jobImportStatus));
		return (' Job msg - '+$rootScope.jobImportStatus ? $rootScope.jobImportStatus.importMsg : '');
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
        		$rootScope.employeeImportStatus = importStatus;
        		$rootScope.start('employee');
        	},function(err){
        		console.log('Import error');
        		$scope.showNotification('top','center','danger','Unnable to employee data import');
        		console.log(err);
        		$rootScope.empImportStatusLoad = false;
        	});
        	}else{
        		console.log('select a file');
        	}
        }

	    $scope.employeeImportStatus = function() {
        	EmployeeComponent.importEmployeeStatus($rootScope.employeeImportStatus.fileName).then(function(data) {
            		if(data) {
            			$rootScope.employeeImportStatus.importStatus = data.status;
                		console.log('employeeimportStatus - '+ $rootScope.employeeImportStatus);
                		$rootScope.employeeImportStatus.importMsg = data.msg;
                		console.log('employeeimportMsg - '+ $rootScope.employeeImportStatus.importMsg);
                		if($rootScope.employeeImportStatus.importStatus == 'COMPLETED'){
                			$rootScope.employeeImportStatus.fileName = data.file;
                    		console.log('importEmployeeFile - '+ $rootScope.employeeImportStatus.fileName);
                    		$scope.showNotification('top','center','success','Employee data imported successfully');
                    		$scope.stop('employee');
                    		
                    		$timeout(function() {
                    			$rootScope.employeeImportStatus = {};
                    	      }, 3000);
                		}else if($rootScope.employeeImportStatus.importStatus == 'FAILED'){
                			$scope.showNotification('top','center','danger',$rootScope.employeeImportStatus.importMsg);
                    		$scope.stop('employee');
                		}else if(!$rootScope.employeeImportStatus.importStatus){
                			$scope.showNotification('top','center','danger','Unnable to import employee data');
                			$scope.stop('employee');
                		}else {
                			$scope.showNotification('top','center','danger','Unnable to import employee data');
                			$rootScope.employeeImportStatus.fileName = '#';
                		}
            		}
            		$rootScope.empImportStatusLoad = false;
            	});
	    }

	  $scope.employeeImportMsg = function() {
        return ('employeeMsg - '+$rootScope.employeeImportStatus ? $rootScope.employeeImportStatus.importMsg : '');
	  };
	  /*$scope.empImportStatusLoad = function(){
	    	console.log('$scope.empImportStatusLoad message '+ $rootScope.empImportStatusLoad);
	    	return ($rootScope.empImportStatusLoad ? $rootScope.empImportStatusLoad : '');
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
        		$rootScope.clientImportStatus = importStatus;
        		$rootScope.start('client');
         },function(err){
            	  console.log('Client Import error');
            	  $scope.showNotification('top','center','danger','Unnable to client data import');
            	  console.log(err);
            	  $scope.clientImportStatusLoad = false;
         });
	    }

    }

	    $scope.clientImportStatus = function() {
	        	console.log('$rootScope.clientImportStatus -'+JSON.stringify($rootScope.clientImportStatus));

	            	ProjectComponent.importStatus($rootScope.clientImportStatus.fileName).then(function(data) {
	            		if(data) {
	            			$rootScope.clientImportStatus.importStatus = data.status;
	                		console.log('*****************importStatus - '+ JSON.stringify($rootScope.clientImportStatus));
	                		$rootScope.clientImportStatus.importMsg = data.msg;
	                		console.log('**************importMsg - '+ $rootScope.clientImportStatus.importMsg);
	                		if($rootScope.clientImportStatus.importStatus == 'COMPLETED'){
	                			$rootScope.clientImportStatus.fileName = data.file;
	                    		console.log('importFile - '+ $rootScope.clientImportStatus.fileName);
	                    		$scope.showNotification('top','center','success','Client data imported successfully');
	                    		$scope.stop('client');
	                    		$timeout(function() {
	                    			$rootScope.clientImportStatus = {};
	                    	    }, 3000);
	                		}else if($rootScope.clientImportStatus.importStatus == 'FAILED'){
	                			$scope.showNotification('top','center','danger',$rootScope.employeeImportStatus.importMsg);
	                    		$scope.stop('client');
	                		}else if(!$rootScope.clientImportStatus.importStatus){
	                			$scope.showNotification('top','center','danger','Unnable to client data import');
	                			$scope.stop('client');
	                		}else {
	                			$scope.showNotification('top','center','danger','Unnable to client data import');
	                			$rootScope.clientImportStatus.fileName = '#';
	                		}
	            		}
	            		$scope.clientImportStatusLoad = false;

	            	});

	    }
	    $scope.clientImportMsg = function() {
		   return ($rootScope.clientImportStatus ? $rootScope.clientImportStatus.importMsg : '');
		};
		/*$scope.clientImportStatusLoad = function(){
		    	console.log('$scope.clientImportStatusLoad message '+ $rootScope.clientImportStatusLoad);
		    	return ($rootScope.clientImportStatusLoad ? $rootScope.clientImportStatusLoad : '');
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
	        		$rootScope.siteImportStatus = importStatus;
	        		$rootScope.start('site');
	        	},function(err){
	        		console.log();
	        		$scope.showNotification('top','center','danger','Unnable to site data import');
	        		$scope.siteImportStatusLoad = false;
	        	});
	    	 }
	     }

	     $scope.siteImportStatus = function() {
	        	console.log('$rootScope.siteImportStatus -'+JSON.stringify($rootScope.siteImportStatus));

	        	SiteComponent.importStatus($rootScope.siteImportStatus.fileName).then(function(data) {
	            		if(data) {
	            			$rootScope.siteImportStatus.importStatus = data.status;
	                		console.log('*****************importStatus - '+ JSON.stringify($rootScope.siteImportStatus));
	                		$rootScope.siteImportStatus.importMsg = data.msg;
	                		console.log('**************importMsg - '+ $rootScope.siteImportStatus.importMsg);
	                		if($rootScope.siteImportStatus.importStatus == 'COMPLETED'){
	                			$rootScope.siteImportStatus.fileName = data.file;
	                    		console.log('importFile - '+ $rootScope.siteImportStatus.fileName);
	                    		$scope.showNotification('top','center','Success','Site data imported successfully');
	                    		$scope.stop('site');
	                    		$timeout(function() {
	                    			$rootScope.siteImportStatus = {};
	                    	    }, 3000);
	                		}else if($rootScope.siteImportStatus.importStatus == 'FAILED'){
	                			$scope.showNotification('top','center','danger',$rootScope.employeeImportStatus.importMsg);
	                    		$scope.stop('site');
	                		}else if(!$rootScope.siteImportStatus.importStatus){
	                			$scope.showNotification('top','center','danger','Unnable to site data import');
	                			$scope.stop('site');
	                		}else {
	                			$scope.showNotification('top','center','danger','Unnable to site data import');
	                			$rootScope.siteImportStatus.fileName = '#';
	                		}
	            		}
	            		$scope.siteImportStatusLoad = false;
	            	});
	    }

	     /*$scope.siteImportMsg = function() {
			   return ($rootScope.siteImportStatus ? $rootScope.siteImportStatus.importMsg : '');
			};  */
			/*$scope.siteImportStatusLoad = function(){
			    	console.log('$scope.siteImportStatusLoad message '+ $rootScope.siteImportStatusLoad);
			    	return ($rootScope.siteImportStatusLoad ? $rootScope.siteImportStatusLoad : '');
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
		        		$rootScope.locationImportStatus = importStatus;
		        		$rootScope.start('location');
		        	},function(err){
		        		console.log();
		        		$scope.showNotification('top','center','danger','Unnable to location data import');
		        		$scope.locationImportStatusLoad = false;
			        	
		        	});
		    	 }
		     }

		     $scope.locationImportStatus = function() {
		        	console.log('$rootScope.locationImportStatus -'+JSON.stringify($rootScope.locationImportStatus));

		        LocationComponent.importStatus($rootScope.locationImportStatus.fileName).then(function(data) {
		            		if(data) {
		            			
		            			$rootScope.locationImportStatus.importStatus = data.status;
		                		console.log('*****************importStatus - '+ JSON.stringify($rootScope.locationImportStatus));
		                		$rootScope.locationImportStatus.importMsg = data.msg;
		                		console.log('**************importMsg - '+ $rootScope.locationImportStatus.importMsg);
		                		if($rootScope.locationImportStatus.importStatus == 'COMPLETED'){
		                			$rootScope.locationImportStatus.fileName = data.file;
		                    		console.log('importFile - '+ $rootScope.locationImportStatus.fileName);
		                    		$scope.showNotification('top','center','success','Location data imported successfully');
		                    		$scope.stop('location');
		                    		
		                    		$timeout(function() {
		                    			$rootScope.locationImportStatus = {};
		                    	    }, 3000);
		                		}else if($rootScope.locationImportStatus.importStatus == 'FAILED'){
		                			$scope.showNotification('top','center','danger',$rootScope.locationImportStatus.importMsg);
		                    		$scope.stop('location');
		                		}else if(!$rootScope.locationImportStatus.importStatus){
		                			$scope.showNotification('top','center','danger','Unnable to location data import');
		                			$scope.stop('location');
		                		}else {
		                			$scope.showNotification('top','center','danger','Unnable to location data import');
		                			$rootScope.locationImportStatus.fileName = '#';
		                		}
		            		}
		            		
		            		$scope.locationImportStatusLoad = false;
		            	});
		    }

		     /*$scope.locationImportMsg = function() {
				   return ($rootScope.locationImportStatus ? $rootScope.locationImportStatus.importMsg : '');
				};  */
				/*$scope.locationImportStatusLoad = function(){
				    	console.log('$scope.locationImportStatusLoad message '+ $rootScope.locationImportStatusLoad);
				    	return ($rootScope.locationImportStatusLoad ? $rootScope.locationImportStatusLoad : '');
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
        		$rootScope.checklistImportStatus = importStatus;
        		$rootScope.start('checklist');
         },function(err){
            	  console.log('Checklist Import error');
            	  $scope.showNotification('top','center','danger','Unnable to checklist data import');
            	  console.log(err);
            	  $scope.checklistImportStatusLoad = false;
         });

	  }
    }

	    $scope.checklistImportStatus = function() {
        	console.log('$rootScope.checklistImportStatus -'+JSON.stringify($rootScope.checklistImportStatus));
        	ChecklistComponent.importStatus($rootScope.checklistImportStatus.fileName).then(function(data) {
            		if(data) {
            			$scope.checklistImportStatus.importStatus = data.status;
                		console.log('*****************importStatus - '+ JSON.stringify($rootScope.checklistImportStatus));
                		$rootScope.checklistImportStatus.importMsg = data.msg;
                		console.log('**************importMsg - '+ $rootScope.checklistImportStatus.importMsg);
                		if($rootScope.checklistImportStatus.importStatus == 'COMPLETED'){
                			$rootScope.checklistImportStatus.fileName = data.file;
                    		console.log('importFile - '+ $rootScope.checklistImportStatus.fileName);
                    		$scope.showNotification('top','center','success','Checklist data imported successfully');
                    		$scope.stop('checklist');
                    		
                    		$timeout(function() {
                    			$rootScope.checklistImportStatus = {};
                    	    }, 3000);
                		}else if($rootScope.checklistImportStatus.importStatus == 'FAILED'){
                			$scope.showNotification('top','center','danger',$rootScope.checklistImportStatus.importMsg);
                    		$scope.stop('checklist');
                		}else if(!$rootScope.checklistImportStatus.importStatus){
                			$scope.showNotification('top','center','danger','Unnable to checklist data import');
                			$scope.stop('checklist');
                		}else {
                			$scope.showNotification('top','center','danger','Unnable to checklist data import');
                			$rootScope.checklistImportStatus.fileName = '#';
                		}
            		}
            		$scope.checklistImportStatusLoad = false;

            	});

    }


	   /*$scope.checklistImportStatusLoad = function(){
		   	console.log('$scope.checklistImportStatusLoad message '+ $rootScope.checklistImportStatusLoad);
		   	return ($rootScope.checklistImportStatusLoad ? $rootScope.checklistImportStatusLoad : '');
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
	       		$rootScope.employeeShiftImportStatus = importStatus;
	       		$rootScope.start('employeeShift');
	        },function(err){
	           	  console.log('Client Import error');
	              $scope.showNotification('top','center','danger','Unnable to employee shift  data import');
	           	  console.log(err);
	           	  $scope.employeeShiftImportStatusLoad = false;
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
                   		$scope.showNotification('top','center','success','Employee Shift data imported successfully');
                   		$scope.stop('employeeShift');
                   		
                   		$timeout(function() {
                   			$rootScope.employeeShiftImportStatus = {};
                   	    }, 3000);
               		}else if($rootScope.employeeShiftImportStatus.importStatus == 'FAILED'){
               			$scope.showNotification('top','center','danger',$rootScope.employeeShiftImportStatus.importMsg);
                   		$scope.stop('employeeShift');
               		}else if(!$rootScope.employeeShiftImportStatus.importStatus){
               			$scope.showNotification('top','center','danger','Unnable to Employee Shift data import');
               			$scope.stop('employeeShift');
               		}else {
               			$scope.showNotification('top','center','danger','Unnable to Employee Shift data import');
               			$rootScope.employeeShiftImportStatus.fileName = '#';
               		}
           		}
           		$scope.employeeShiftImportStatusLoad = false;

           	});

	    }


	  /* $scope.employeeShiftImportStatusLoad = function(){
		   	console.log('$scope.employeeShiftImportStatusLoad message '+ $rootScope.employeeShiftImportStatusLoad);
		   	return ($rootScope.employeeShiftImportStatusLoad ? $rootScope.employeeShiftImportStatusLoad : '');
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
	       		$rootScope.assetImportStatus = importStatus;
	       		$rootScope.start('asset');
	        },function(err){
	           	  console.log('Asset Import error');
	           	  $scope.showNotification('top','center','danger','Unnable to asset  data import');
	           	  console.log(err);
	              $scope.assetImportStatusLoad = false;
	        });

		  }
	   }

	    $scope.assetImportStatus = function() {
	    	
	    		console.log('$rootScope.assetImportStatus -'+JSON.stringify($rootScope.assetImportStatus));
      		AssetComponent.importAssetStatus($rootScope.assetImportStatus.fileName).then(function(data) {
          		if(data) {
          			alert(JSON.stringyfy(data));
          			$rootScope.assetImportStatus.importStatus = data.status;
              		console.log('*****************importStatus - '+ JSON.stringify($rootScope.assetImportStatus));
              		$rootScope.assetImportStatus.importMsg = data.msg;
              		console.log('**************importMsg - '+ $rootScope.assetImportStatus.importMsg);
              		if($rootScope.assetImportStatus.importStatus == 'COMPLETED'){
              			$rootScope.assetImportStatus.fileName = data.file;
                  		console.log('importFile - '+ $rootScope.assetImportStatus.fileName);
                  		$scope.showNotification('top','center','success','Asset data imported successfully');
                  		$scope.stop('asset');
                  		
                  		$timeout(function() {
                  			$rootScope.assetImportStatus = {};
                  	    }, 3000);
              		}else if($rootScope.assetImportStatus.importStatus == 'FAILED'){
              			$scope.showNotification('top','center','danger',$rootScope.assetImportStatus.importMsg);
                  		$scope.stop('asset');
              		}else if(!$rootScope.assetImportStatus.importStatus){
              			$scope.showNotification('top','center','danger','Unnable to asset data import');
              			$scope.stop('asset');
              		}else {
              			$scope.showNotification('top','center','danger','Unnable to asset data import');
              			$rootScope.assetImportStatus.fileName = '#';
              		}
          		}
          		$scope.assetImportStatusLoad = false;

          	});

	    }


	 /*  $scope.assetImportStatusLoad = function(){
		   	console.log('$scope.assetImportStatusLoad message '+ $rootScope.assetImportStatusLoad);
		   	return ($rootScope.assetImportStatusLoad ? $rootScope.assetImportStatusLoad : '');
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
	       		$rootScope.assetPPMImportStatus = importStatus;
	       		$rootScope.start('assetPPM');
	        },function(err){
	           	  console.log('Asset PPM Import error');
	           	  $scope.showNotification('top','center','danger','Unnable to asset ppm  data import');
	           	  console.log(err);
	           	  $scope.assetPPMImportStatusLoad = false;
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
                 		$scope.showNotification('top','center','success','Asset PPM data imported successfully');
                 		$scope.stop('assetPPM');
                 		
                 		$timeout(function() {
                 			$rootScope.assetPPMImportStatus = {};
                 	    }, 3000);
             		}else if($rootScope.assetPPMImportStatus.importStatus == 'FAILED'){
             			$scope.showNotification('top','center','danger',$rootScope.assetPPMImportStatus.importMsg);
                 		$scope.stop('assetPPM');
             		}else if(!$rootScope.assetPPMImportStatus.importStatus){
             			$scope.showNotification('top','center','danger','Unnable to asset ppm data import');
             			$scope.stop('assetPPM');
             		}else {
             			$scope.showNotification('top','center','danger','Unnable to asset ppm data import');
             			$rootScope.assetPPMImportStatus.fileName = '#';
             		}
         		}
         		$scope.assetPPMImportStatusLoad = false;

         	});

	    }


	  /* $scope.assetPPMImportStatusLoad = function(){
		   	console.log('$scope.assetPPMImportStatusLoad message '+ $rootScope.assetPPMImportStatusLoad);
		   	return ($rootScope.assetPPMImportStatusLoad ? $rootScope.assetPPMImportStatusLoad : '');
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
	       		$rootScope.assetAMCImportStatus = importStatus;
	       		$rootScope.start('assetAMC');
	        },function(err){
	           	  console.log('Asset AMC Import error')
	           	  console.log(err);
	           	  $scope.showNotification('top','center','danger','Unnable to asset amc  data import');
	           	  $scope.assetAMCImportStatusLoad = false;
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
	                		$scope.showNotification('top','center','success','Asset AMC data imported successfully');
	                		$scope.stop('assetAMC');
	                		
	                		$timeout(function() {
	                			$rootScope.assetAMCImportStatus = {};
	                	    }, 3000);
	            		}else if($rootScope.assetAMCImportStatus.importStatus == 'FAILED'){
	            			$scope.showNotification('top','center','danger',$rootScope.assetAMCImportStatus.importMsg);
	                		$scope.stop('assetAMC');
	            		}else if(!$rootScope.assetAMCImportStatus.importStatus){
	            			$scope.showNotification('top','center','danger','Unnable to asset amc data import');
	            			$scope.stop('assetAMC');
	            		}else {
	            			$scope.showNotification('top','center','danger','Unnable to asset amc data import');
	            			$rootScope.assetAMCImportStatus.fileName = '#';
	            		}
	        		}
	        		$scope.assetAMCImportStatusLoad = false;

	        	});

	    }


	  /* $scope.assetAMCImportStatusLoad = function(){
		   	console.log('$scope.assetAMCImportStatusLoad message '+ $rootScope.assetAMCImportStatusLoad);
		   	return ($rootScope.assetAMCImportStatusLoad ? $rootScope.assetAMCImportStatusLoad : '');
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


    });
