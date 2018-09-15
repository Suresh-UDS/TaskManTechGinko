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
        $rootScope.clientImportStatus = {};
        $rootScope.checklistImportStatus = {};
        $rootScope.employeeShiftImportStatus = {};
        $rootScope.siteImportStatus = {};
        $rootScope.jobImportStatus = {};
        $rootScope.jobImportStatusLoad = false;
        $rootScope.empImportStatusLoad = false;
        $rootScope.checklistImportStatusLoad = false;
        $rootScope.clientImportStatusLoad = false;
        $rootScope.siteImportStatusLoad = false;
        $rootScope.employeeImportStatus = {};
        $rootScope.employeeShiftImportStatusLoad = false;
        $rootScope.assetImportStatus = {};
        $rootScope.assetImportStatusLoad = false;
        $rootScope.assetPPMImportStatus = {};
        $rootScope.assetPPMImportStatusLoad = false;
        $rootScope.assetAMCImportStatus = {};
        $rootScope.assetAMCImportStatusLoad = false;
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
        	$rootScope.jobImportStatusLoad = true;
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
	            	  console.log('Import error')
	            	  console.log(err);
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
	                    		$scope.stop('job');
	                    		$rootScope.jobImportStatusLoad = false;
	                    		$timeout(function() {
	                    			$rootScope.jobImportStatus = {};
	                    	      }, 3000);
	                		}else if($rootScope.jobImportStatus.importStatus == 'FAILED'){
	                    		$scope.stop('job');
	                		}else if(!$rootScope.jobImportStatus.importStatus){
	                			$scope.stop('job');
	                		}else {
	                			$rootScope.jobImportStatus.fileName = '#';
	                		}
	            		}
	
	            	});
	
	    }
	    $scope.jobImportMsg = function() {
	    	console.log('$rootScope.jobImportStatus message - '+ JSON.stringify($rootScope.jobImportStatus));
		return (' Job msg - '+$rootScope.jobImportStatus ? $rootScope.jobImportStatus.importMsg : '');
	    };
	    $scope.jobImportStatusLoad = function(){
	    	console.log('$rootScope.jobImportStatusLoad message '+ $rootScope.jobImportStatusLoad);
	    	return ($rootScope.jobImportStatusLoad ? $rootScope.jobImportStatusLoad : '');
	    };
	    // Job end
	    
	    
	    
	    // upload Employee File  start
        $scope.uploadEmployeeFile = function(){
        	if($scope.selectedEmployeeFile){
        	$rootScope.empImportStatusLoad = true;
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
        		console.log(err);
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
                    		$scope.stop('employee');
                    		$rootScope.empImportStatusLoad = false;
                    		$timeout(function() {
                    			$rootScope.employeeImportStatus = {};
                    	      }, 3000);
                		}else if($rootScope.employeeImportStatus.importStatus == 'FAILED'){
                    		$scope.stop('employee');
                		}else if(!$rootScope.employeeImportStatus.importStatus){
                			$scope.stop('employee');
                		}else {
                			$rootScope.employeeImportStatus.fileName = '#';
                		}
            		}
            	});
	    }
	    
	  $scope.employeeImportMsg = function() {
        return ('employeeMsg - '+$rootScope.employeeImportStatus ? $rootScope.employeeImportStatus.importMsg : '');
	  }; 
	  $scope.empImportStatusLoad = function(){
	    	console.log('$scope.empImportStatusLoad message '+ $rootScope.empImportStatusLoad);
	    	return ($rootScope.empImportStatusLoad ? $rootScope.empImportStatusLoad : '');
	   };  
	  //Employee end
        
      //client upload file start
	    $scope.uploadClients = function() {
	    	if($scope.selectedClientFile){
	    		$rootScope.clientImportStatusLoad = true;
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
            	  console.log('Client Import error')
            	  console.log(err);
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
	                    		$scope.stop('client');
	                    		$rootScope.clientImportStatusLoad = false;
	                    		$timeout(function() {
	                    			$rootScope.clientImportStatus = {};
	                    	    }, 3000);
	                		}else if($rootScope.clientImportStatus.importStatus == 'FAILED'){
	                    		$scope.stop('client');
	                		}else if(!$rootScope.clientImportStatus.importStatus){
	                			$scope.stop('client');
	                		}else {
	                			$rootScope.clientImportStatus.fileName = '#';
	                		}
	            		}

	            	});

	    }
	    $scope.clientImportMsg = function() {
		   return ($rootScope.clientImportStatus ? $rootScope.clientImportStatus.importMsg : '');
		};  
		$scope.clientImportStatusLoad = function(){
		    	console.log('$scope.clientImportStatusLoad message '+ $rootScope.clientImportStatusLoad);
		    	return ($rootScope.clientImportStatusLoad ? $rootScope.clientImportStatusLoad : '');
		}; 
	   // client upload end 
		
		 // upload Site File start
	     $scope.uploadSitesFile = function(){
	    	 if($scope.selectedSiteFile){
	    		 $rootScope.siteImportStatusLoad = true;
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
	                    		$scope.stop('site');
	                    		$rootScope.siteImportStatusLoad = false;
	                    		$timeout(function() {
	                    			$rootScope.siteImportStatus = {};
	                    	    }, 3000);
	                		}else if($rootScope.siteImportStatus.importStatus == 'FAILED'){
	                    		$scope.stop('client');
	                		}else if(!$rootScope.siteImportStatus.importStatus){
	                			$scope.stop('client');
	                		}else {
	                			$rootScope.siteImportStatus.fileName = '#';
	                		}
	            		}
	            	});
	    }
	    
	     /*$scope.siteImportMsg = function() {
			   return ($rootScope.siteImportStatus ? $rootScope.siteImportStatus.importMsg : '');
			};  */
			$scope.siteImportStatusLoad = function(){
			    	console.log('$scope.siteImportStatusLoad message '+ $rootScope.siteImportStatusLoad);
			    	return ($rootScope.siteImportStatusLoad ? $rootScope.siteImportStatusLoad : '');
			}; 
	     
			 // upload Location File start
		     $scope.uploadLocationsFile = function(){
		    	 if($scope.selectedLocationFile){
		    		 $rootScope.locationImportStatusLoad = true;
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
		                    		$scope.stop('location');
		                    		$rootScope.locationImportStatusLoad = false;
		                    		$timeout(function() {
		                    			$rootScope.locationImportStatus = {};
		                    	    }, 3000);
		                		}else if($rootScope.locationImportStatus.importStatus == 'FAILED'){
		                    		$scope.stop('client');
		                		}else if(!$rootScope.locationImportStatus.importStatus){
		                			$scope.stop('client');
		                		}else {
		                			$rootScope.locationImportStatus.fileName = '#';
		                		}
		            		}
		            	});
		    }
		    
		     /*$scope.locationImportMsg = function() {
				   return ($rootScope.locationImportStatus ? $rootScope.locationImportStatus.importMsg : '');
				};  */
				$scope.locationImportStatusLoad = function(){
				    	console.log('$scope.locationImportStatusLoad message '+ $rootScope.locationImportStatusLoad);
				    	return ($rootScope.locationImportStatusLoad ? $rootScope.locationImportStatusLoad : '');
				}; 
		     
	        
	        
	      // site file end  
	    
	    //Checklist upload file start
	    $scope.uploadChecklist = function() {
	    	//var extn = checklistFile.substr(fileName.lastIndexOf('.')+1);
	    	//alert(extn);
	    	//return false;
	    	if($scope.selectedChecklistFile){
	    		$rootScope.checklistImportStatusLoad = true;
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
            	  console.log('Client Import error')
            	  console.log(err);
         });
	  
	  }
    }
	
	    $scope.checklistImportStatus = function() {
        	console.log('$rootScope.checklistImportStatus -'+JSON.stringify($rootScope.checklistImportStatus));        		
        	ChecklistComponent.importStatus($rootScope.checklistImportStatus.fileName).then(function(data) {
            		if(data) {
            			$rootScope.checklistImportStatus.importStatus = data.status;
                		console.log('*****************importStatus - '+ JSON.stringify($rootScope.checklistImportStatus));
                		$rootScope.checklistImportStatus.importMsg = data.msg;
                		console.log('**************importMsg - '+ $rootScope.checklistImportStatus.importMsg);
                		if($rootScope.checklistImportStatus.importStatus == 'COMPLETED'){
                			$rootScope.checklistImportStatus.fileName = data.file;
                    		console.log('importFile - '+ $rootScope.checklistImportStatus.fileName);
                    		$scope.stop('checklist');
                    		$rootScope.checklistImportStatusLoad = false;
                    		$timeout(function() {
                    			$rootScope.checklistImportStatus = {};
                    	    }, 3000);
                		}else if($rootScope.checklistImportStatus.importStatus == 'FAILED'){
                    		$scope.stop('checklist');
                		}else if(!$rootScope.checklistImportStatus.importStatus){
                			$scope.stop('checklist');
                		}else {
                			$rootScope.checklistImportStatus.fileName = '#';
                		}
            		}

            	});

    }    
	    
	   
	   $scope.checklistImportStatusLoad = function(){
		   	console.log('$scope.checklistImportStatusLoad message '+ $rootScope.checklistImportStatusLoad);
		   	return ($rootScope.checklistImportStatusLoad ? $rootScope.checklistImportStatusLoad : '');
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
