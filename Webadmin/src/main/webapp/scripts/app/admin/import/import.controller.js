'use strict';

angular.module('timeSheetApp')
		    .controller(
				'ImportController',
				function($scope, $rootScope, $state, $timeout, JobComponent,
						ProjectComponent, SiteComponent,EmployeeComponent,ChecklistComponent, $http, $stateParams,
						$location,$interval) {
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorProjectExists = null;
        
        $scope.selectedJobFile;
        $scope.selectedEmployeeFile;
        //client file
        $scope.selectedClientFile;
        $rootScope.clientImportStatus = {};
        $rootScope.jobImportStatus = {};
        $rootScope.employeeImportStatus = {};
        $scope.importStatus;
        $scope.importEmployeeStatus;
        $scope.selectFile = function() {
        		console.log($scope.selectedJobFile);
        }
        // upload Job File
        $scope.uploadJobFile = function() {
        		console.log('selected job file - ' + $scope.selectedJobFile);
        		JobComponent.importFile($scope.selectedJobFile).then(function(data){
        			console.log(data);
        			var result = data;
        			console.log(result.file + ', ' + result.status + ',' + result.msg);
        			var importStatus = {
	        				fileName : result.file,
	        				importMsg : result.msg
	        		};
	        		$rootScope.jobImportStatus = importStatus;
	        		$rootScope.start();
	         },function(err){
	            	  console.log('Import error')
	            	  console.log(err);
	         });
        		
        }
        
	    
	 // store the interval promise in this variable
	    var promise;
	
	 // starts the interval
	    $rootScope.start = function() {
	      // stops any running interval to avoid two intervals running at the same time
	    	$rootScope.stop();
	
	      // store the interval promise
	      promise = $interval($scope.jobImportStatus, 5000);
	      console.log('promise -'+promise);
	    };
	
	    // stops the interval
	    $rootScope.stop = function() {
	      $interval.cancel(promise);
	    };
	    
	   
	    // Job Import Status
	    $scope.jobImportStatus = function() {
	        	console.log('$rootScope.jobImportStatus -'+JSON.stringify($rootScope.jobImportStatus));
	        		
	            	JobComponent.importStatus($rootScope.jobImportStatus.fileName).then(function(data) {
	            		if(data) {
	            			$rootScope.jobImportStatus.importStatus = data.status;
	                		console.log('jobimportStatus - '+ $rootScope.jobImportStatus);
	                		$rootScope.jobImportStatus.importMsg = data.msg;
	                		console.log('jobimportMsg - '+ $rootScope.jobImportStatus.importMsg);
	                		if($rootScope.jobImportStatus.importStatus == 'COMPLETED'){
	                			$rootScope.jobImportStatus.fileName = data.file;
	                    		console.log('jobimportFile - '+ $rootScope.jobImportStatus.fileName);
	                    		$scope.stop();
	                		}else if($rootScope.jobImportStatus.importStatus == 'FAILED'){
	                    		$scope.stop();
	                		}else if(!$rootScope.jobImportStatus.importStatus){
	                			$scope.stop();
	                		}else {
	                			$rootScope.jobImportStatus.fileName = '#';
	                		}
	            		}
	
	            	});
	
	    }
	    $scope.jobImportMsg = function() {
		return (' Job msg - '+$rootScope.jobImportStatus ? $rootScope.jobImportStatus.importMsg : '');
	    };
	    
	    
	    
	    // upload Employee File by prem
        $scope.uploadEmployeeFile = function(){
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
        		$rootScope.start();
        	},function(err){
        		console.log('Import error');
        		console.log(err);
        	});
        }
        
        // upload Site File
        $scope.uploadSitesFile = function(){
        	console.log('selected site file -'+ $scope.selectedSiteFile);
        	SiteComponent.importSiteFile($scope.selectedSiteFile).then(function(data){
        		console.log(data);
        		var result = data;
        		console.log(result.file + ', '+result.status + ',' + result.msg);
        		
        	},function(err){
        		console.log();
        	});
        }
        
        
        
        // employee job status by prem
	    $scope.employeeImportStatus = function() {
        	console.log('$rootScope.employeeImportStatus -'+JSON.stringify($rootScope.employeeImportStatus));
        		
        	EmployeeComponent.importEmployeeStatus($rootScope.employeeImportStatus.fileName).then(function(data) {
            		if(data) {
            			$rootScope.employeeImportStatus.importStatus = data.status;
                		console.log('employeeimportStatus - '+ $rootScope.employeeImportStatus);
                		$rootScope.employeeImportStatus.importMsg = data.msg;
                		console.log('employeeimportMsg - '+ $rootScope.employeeImportStatus.importMsg);
                		if($rootScope.employeeImportStatus.importStatus == 'COMPLETED'){
                			$rootScope.employeeImportStatus.fileName = data.file;
                    		console.log('importEmployeeFile - '+ $rootScope.employeeImportStatus.fileName);
                    		$scope.stop();
                		}else if($rootScope.employeeImportStatus.importStatus == 'FAILED'){
                    		$scope.stop();
                		}else if(!$rootScope.employeeImportStatus.importStatus){
                			$scope.stop();
                		}else {
                			$rootScope.employeeImportStatus.fileName = '#';
                		}
            		}
            	});
    }
	   // starts the employee interval by prem
	    $rootScope.start = function() {
	      // stops any running interval to avoid two intervals running at the same time
	    	$rootScope.stop();
	
	      // store the interval promise
	      promise = $interval($scope.employeeImportStatus, 5000);
	      console.log('promise -'+promise);
	    };    
	    
	    
	    $scope.employeeImportMsg = function() {
	        return ('employeeMsg - '+$rootScope.employeeImportStatus ? $rootScope.employeeImportStatus.importMsg : '');
	    }; 
	    
       //client upload file
	    $scope.uploadClients = function() {
    		console.log('selected Client file - ' + $scope.selectedClientFile);
    		ProjectComponent.importFile($scope.selectedClientFile).then(function(data){
    			console.log(data);
    			var result = data;
    			console.log(result.file + ', ' + result.status + ',' + result.msg);
    			var importStatus = {
        				fileName : result.file,
        				importMsg : result.msg
        		};
        		$rootScope.clientImportStatus = importStatus;
        		$rootScope.start();
         },function(err){
            	  console.log('Client Import error')
            	  console.log(err);
         });
    		
    }

	    $scope.clientImportStatus = function() {
        	console.log('$rootScope.clientImportStatus -'+JSON.stringify($rootScope.clientImportStatus));
        		
            	ProjectComponent.importStatus($rootScope.clientImportStatus.fileName).then(function(data) {
            		if(data) {
            			$rootScope.clientImportStatus.importStatus = data.status;
                		console.log('importStatus - '+ $rootScope.clientImportStatus);
                		$rootScope.clientImportStatus.importMsg = data.msg;
                		console.log('importMsg - '+ $rootScope.clientImportStatus.importMsg);
                		if($rootScope.clientImportStatus.importStatus == 'COMPLETED'){
                			$rootScope.clientImportStatus.fileName = data.file;
                    		console.log('importFile - '+ $rootScope.clientImportStatus.fileName);
                    		$scope.stop();
                		}else if($rootScope.clientImportStatus.importStatus == 'FAILED'){
                    		$scope.stop();
                		}else if(!$rootScope.clientImportStatus.importStatus){
                			$scope.stop();
                		}else {
                			$rootScope.clientImportStatus.fileName = '#';
                		}
            		}

            	});

    }


	    $scope.clientImportMsg = function() {
	        return ($rootScope.clientImportStatus ? $rootScope.clientImportStatus.importMsg : '');
	    };  
        
        
    });
