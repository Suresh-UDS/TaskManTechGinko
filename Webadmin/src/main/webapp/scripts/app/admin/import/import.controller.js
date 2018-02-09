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
        $rootScope.jobImportStatus = {};
        $scope.importStatus;
        $scope.selectFile = function() {
        		console.log($scope.selectedJobFile);
        }
        
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
	    
	
	
	    $scope.jobImportStatus = function() {
	        	console.log('$rootScope.jobImportStatus -'+JSON.stringify($rootScope.jobImportStatus));
	        		
	            	JobComponent.importStatus($rootScope.jobImportStatus.fileName).then(function(data) {
	            		if(data) {
	            			$rootScope.jobImportStatus.importStatus = data.status;
	                		console.log('importStatus - '+ $rootScope.jobImportStatus);
	                		$rootScope.jobImportStatus.importMsg = data.msg;
	                		console.log('importMsg - '+ $rootScope.jobImportStatus.importMsg);
	                		if($rootScope.jobImportStatus.importStatus == 'COMPLETED'){
	                			$rootScope.jobImportStatus.fileName = data.file;
	                    		console.log('importFile - '+ $rootScope.jobImportStatus.fileName);
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
	        return ($rootScope.jobImportStatus ? $rootScope.jobImportStatus.importMsg : '');
	    };
        
    });
