'use strict';

angular.module('timeSheetApp')
		    .controller(
				'ImportController',
				function($scope, $rootScope, $state, $timeout, JobComponent,
						ProjectComponent, SiteComponent,EmployeeComponent,ChecklistComponent, $http, $stateParams,
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
	    
	   //Checklist upload file start
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
	    
	    	    
	 // store the interval promise in this variable
	 var promiseJob;
	 var promiseEmployee;
	 var promiseClient;
	 var promiseSite;
	 var promiseChecklist;
	 var promiseEmployeeShift;
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
	    };	   
	    
	    
         //init load
        $scope.initLoad = function(){ 
             $scope.loadPageTop(); 
             $scope.initPage(); 
          
         }
        
        
    });
