'use strict';

angular.module('timeSheetApp')
    .controller('CheckInOutController', function ($rootScope, $scope, $state, $timeout, ProjectComponent, SiteComponent, EmployeeComponent, CheckInOutComponent,$http,$stateParams,$location, $interval) {
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorUserExists = null;
        $scope.end = new Date();

        //$timeout(function (){angular.element('[ng-model="name"]').focus();});
        $scope.hide = false;



        $scope.pages = [];

        $scope.searchCriteria = {
        		checkInDateTimeFrom : new Date(),
        		checkInDateTimeTo : new Date(),

        };

        $scope.isOpenFromDate = false;

        $scope.openCheckInFromDate = function() {

            $scope.isOpenFromDate = true;
        };

        $scope.isOpenToDate = false;

        $scope.openCheckInToDate = function() {

            $scope.isOpenToDate = true;
        };

        $scope.selectedEmployee;

        $scope.selectedProject;

        $scope.selectedSite;

        $scope.loadProjects = function () {
        	ProjectComponent.findAll().then(function (data) {
                $scope.projects = data;
            });
        };

        $scope.loadSites = function () {
        	SiteComponent.findAll().then(function (data) {
                $scope.sites = data;
            });
        };

        $scope.loadEmployees = function () {
        	EmployeeComponent.findAll().then(function (data) {
                $scope.employees = data;
            });
        };

        $scope.search = function (empId) {
        	//if(this.searchForm && this.searchForm.$valid) {
            console.log(empId)
        		$scope.invalidDate = "";
	        	var currPageVal = ($scope.pages[empId] ? $scope.pages[empId].currPage : 1);
	        	if(!$scope.searchCriteria) {
	            	var searchCriteria = {
	            			currPage : currPageVal
	            	}
	            	$scope.searchCriteria = searchCriteria;
	        	}

	        	$scope.searchCriteria.currPage = currPageVal;
	        	console.log('Selected employee -'+$scope.selectedEmployee +", project -" + $scope.selectedProject +" , "+ $scope.selectedSite);
	        	console.log(">>check date<<")
	        	console.log($scope.searchCriteria.checkInDateTimeFrom)
	        	console.log($scope.searchCriteria.checkInDateTimeTo)
	        	$scope.searchCriteria.checkInDateTimeTo.setHours(23);
	        	$scope.searchCriteria.checkInDateTimeTo.setMinutes(59);
	        	console.log($scope.searchCriteria.checkInDateTimeTo)
	        	var ONE_DAY = 1000*60*60*24;
	        	var diffTime = ( $scope.searchCriteria.checkInDateTimeTo - $scope.searchCriteria.checkInDateTimeFrom);
	        	var diffTimeResult = Math.round(diffTime/ONE_DAY);
	        	console.log("Time Difference:"+diffTimeResult);
	        	if(diffTimeResult < 0) {
	        		console.log('invalid Date');
	        		$scope.hide = true;
	        		$scope.invalidDate = "FROM DATE CANNOT BE AFTER TO DATE";
	        		$scope.results = 0;
	        		return;
	        	}
	        	if(($scope.searchCriteria.checkInDateTimeFrom && $scope.searchCriteria.checkInDateTimeTo) || $scope.selectedEmployee || $scope.selectedSite || $scope.selectedProject) {
	        		if(diffTimeResult<0){
	        			$scope.invalidDate = "FROM DATE SHOULD BE AHEAD OF TO DATE";
	        		}else if(diffTimeResult<46){
		        	if($scope.selectedEmployee)
		        	{
		        		$scope.searchCriteria.employeeEmpId = $scope.selectedEmployee.empId;
			        	$scope.searchCriteria.name = $scope.selectedEmployee.name;
			        	$scope.searchCriteria.fullName = $scope.selectedEmployee.fullName;
			        	console.log('selected emp id ='+ $scope.searchCriteria.employeeEmpId);
		        	}else {
		        		$scope.searchCriteria.employeeEmpId = '';
		        		$scope.searchCriteria.name = '';
		        		$scope.searchCriteria.fullName = '';
		        	}


		        	if($scope.selectedSite) {
			        	$scope.searchCriteria.siteId = $scope.selectedSite.id;
			        	console.log('selected site id ='+ $scope.searchCriteria.siteId);
		        	}else {
		        		$scope.searchCriteria.siteId = 0;
		        	}

		        	if($scope.selectedProject) {
			        	$scope.searchCriteria.projectId = $scope.selectedProject.id;
			        	console.log('selected project id ='+ $scope.searchCriteria.projectId);
		        	}else {
		        		$scope.searchCriteria.projectId = 0;
		        	}
		        	if($scope.searchCriteria.employeeEmpId || $scope.searchCriteria.name || $scope.searchCriteria.fullName ||
                     $scope.searchCriteria.siteId || $scope.searchCriteria.projectId){
		        	    console.log(" project or site selected")
                        CheckInOutComponent.search($scope.searchCriteria).then(function (data) {
                            $scope.results = data.results;
                            console.log('results size -' + $scope.results);
                            console.log('results size -' + $scope.results.length);
                            $scope.totalHours = data.totalHours;
                            $scope.checkInDateFrom = data.checkInDateFrom;
                            $scope.checkInDateTo = data.checkInDateTo;
                            //$scope.searchCriteria.employeeEmpIds = data.empIds;
                            for (var i = 0; i < $scope.results.length; i++) {
                                var result = $scope.results[i];
                                $scope.pages[result.employeeEmpId] = {};
                                $scope.pages[result.employeeEmpId].currPage = result.currPage;
                                $scope.pages[result.employeeEmpId].totalPages = result.totalPages;
                                //$scope.pages.startInd = (data.currPage - 1) * 10 + 1;
                                $scope.pages[result.employeeEmpId].startInd = result.startInd;
                                //$scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
                                $scope.pages[result.employeeEmpId].endInd = result.endInd;
                                //$scope.pages.totalCnt = data.totalCount;
                                $scope.pages[result.employeeEmpId].totalCnt = result.totalCount;
                                $scope.firstStyle(result.employeeEmpId);

                            }
                            //                $scope.pages.currPage = data.currPage;
                            //                $scope.pages.totalPages = data.totalPages;
                            //                $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
                            //                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
                            //                $scope.pages.totalCnt = data.totalCount;
                            //if(!$scope.searchCriteria.checkInDateTimeFrom && !$scope.results) {
                            //	$scope.hide = false;
                            //}else {
                            $scope.hide = true;
                            //}
                        });
                    }else{
		        	    console.log($scope.searchCriteria);
		        	    $scope.invalidDate = "PLEASE SELECT ATLEAST ONE FILTER TO CONTINUE";
                    }
		        	console.log(JSON.stringify($scope.searchCriteria));

	        	//}
		        	$rootScope.searchCriteria = $scope.searchCriteria;
	        	}else{
	        		console.log('invalid Date');
	        		$scope.hide = true;
	        		$scope.invalidDate = "DATE RANGE CANNOT BE MORE THAN 45 DAYS";
	                $scope.checkInDateFrom = $scope.searchCriteria.checkInDateTimeFrom;
	                $scope.checkInDateTo = $scope.searchCriteria.checkInDateTimeTo;
	                $scope.totalHours = "00:00";

	        		$scope.results = 0;

	        	}

	        	}
        };

     // store the interval promise in this variable
        var promise;

     // starts the interval
        $scope.start = function() {
          // stops any running interval to avoid two intervals running at the same time
          $scope.stop();

          // store the interval promise
          promise = $interval($scope.exportStatus, 5000);
          console.log('promise -'+promise);
        };

        // stops the interval
        $scope.stop = function() {
          $interval.cancel(promise);
        };

        $scope.exportStatusMap = [];


        $scope.exportStatus = function() {
        	//console.log('empId='+$scope.empId);
        	console.log('exportStatusMap length -'+$scope.exportStatusMap.length);
        	angular.forEach($scope.exportStatusMap, function(exportStatusObj, index){
        		if(!exportStatusObj.empId) {
        			exportStatusObj.empId = 0;
        		}
            	CheckInOutComponent.exportStatus(exportStatusObj.empId,exportStatusObj.fileName).then(function(data) {
            		if(data) {
                		exportStatusObj.exportStatus = data.status;
                		console.log('exportStatus - '+ exportStatusObj);
                		exportStatusObj.exportMsg = data.msg;
                		console.log('exportMsg - '+ exportStatusObj.exportMsg);
                		if(exportStatusObj.exportStatus == 'COMPLETED'){
                    		exportStatusObj.exportFile = data.file;
                    		console.log('exportFile - '+ exportStatusObj.exportFile);
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
//        	for (var i = 0; i < $scope.exportStatusMap.length; i++) {
//        		var exportStatusObj = $scope.exportStatusMap[i];
//            	CheckInOutComponent.exportStatus(exportStatusObj.empId,exportStatusObj.fileName).then(function(data) {
//
//            		exportStatusObj.exportStatus = data.status;
//            		console.log('exportStatus - '+ exportStatusObj);
//            		exportStatusObj.exportMsg = data.msg;
//            		console.log('exportMsg - '+ exportStatusObj.exportMsg);
//            		if(exportStatusObj.exportStatus == 'COMPLETED'){
//                		exportStatusObj.exportFile = data.file;
//                		console.log('exportFile - '+ exportStatusObj.exportFile);
//                		$scope.stop();
//            		}else if(exportStatusObj.exportStatus == 'FAILED'){
//                		$scope.stop();
//            		}else if(!exportStatusObj.exportStatus){
//            			$scope.stop();
//            		}else {
//            			exportStatuObj.exportFile = '#';
//            		}
//            	});
//            }
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

        }

        $scope.exportAllData = function(){

        	CheckInOutComponent.exportAllData($scope.searchCriteria).then(function(data){
        		var result = data.results[0];
        		console.log(result);
        		console.log(result.file + ', ' + result.status + ',' + result.msg);
        		var exportAllStatus = {
        				fileName : result.file,
        				exportMsg : 'Exporting All...'
        		};
        		$scope.exportStatusMap[0] = exportAllStatus;
        		console.log('exportStatusMap size - ' + $scope.exportStatusMap.length);
        		$scope.start();
              },function(err){
            	  console.log('error message for export all ')
            	  console.log(err);
              });
        };

        $scope.exportData = function(empId) {
        	console.log('empId='+empId);
        	CheckInOutComponent.exportData(empId, $scope.searchCriteria).then(function (data) {
        		var result = data.results[0];
        		console.log('result for export -'+result);
        		console.log(result.empId +' , ' + result.file + ', ' + result.status + ',' + result.msg);
        		//$scope.exportStatus;
        		var exportStatus = {
        			fileName : result.file   ,
        			empId : result.empId,
        			exportMsg : 'Exporting...'
        		};
        		console.log('exportStatusMap length -'+ $scope.exportStatusMap.length);
        		if($scope.exportStatusMap.length == 0) {
        			$scope.exportStatusMap[0] = {};
        		}
        		$scope.exportStatusMap.push(exportStatus);
        		//$scope.exportStatusMap[empId] = exportStatus;
        		$scope.start(empId);
        	});
        };


        $scope.first = function(empId) {
        	if($scope.pages[empId].currPage > 1) {
            	$scope.pages[empId].currPage = 1;
            	$scope.firstStyle(empId);
            	$scope.search(empId);
        	}
        };

        $scope.first = function(empId) {
        	if($scope.pages[empId].currPage > 1) {
            	$scope.pages[empId].currPage = 1;
            	$scope.firstStyle();
            	$scope.search(empId);
        	}
        };

        $scope.firstStyle = function(empId) {
       	 var ele = angular.element('#first');
    	 ele.addClass('disabledLink');
    	 ele = angular.element('#previous');
    	 ele.addClass('disabledLink');
    	 if($scope.pages[empId].totalPages > 1) {
 	       	 var ele = angular.element('#next');
	    	 ele.removeClass('disabledLink');
	    	 ele = angular.element('#last');
	    	 ele.removeClass('disabledLink');
    	 }

        }

        $scope.previous = function(empId) {
        	if($scope.pages[empId].currPage > 1) {
            	$scope.pages[empId].currPage = $scope.pages[empId].currPage - 1;
            	if($scope.pages[empId].currPage == 1) {
	       	       	 var ele = angular.element('#first');
	    	    	 ele.addClass('disabled');
	    	    	 ele = angular.element('#previous');
	    	    	 ele.addClass('disabled');
            	}
     	       	 var ele = angular.element('#next');
    	    	 ele.removeClass('disabled');
    	    	 ele = angular.element('#last');
    	    	 ele.removeClass('disabled');
	    		$scope.search(empId);
        	}

        };

        $scope.next = function(empId) {
        	if($scope.pages[empId].currPage < $scope.pages[empId].totalPages) {
            	$scope.pages[empId].currPage = $scope.pages[empId].currPage + 1;
            	if($scope.pages[empId].currPage == $scope.pages[empId].totalPages) {
	       	       	 var ele = angular.element('#next');
	    	    	 ele.addClass('disabled');
	    	    	 ele = angular.element('#last');
	    	    	 ele.addClass('disabled');
            	}
     	       	 var ele = angular.element('#first');
    	    	 ele.removeClass('disabled');
    	    	 ele = angular.element('#previous');
    	    	 ele.removeClass('disabled');
	    		$scope.search(empId);
        	}

        };

        $scope.last = function(empId) {
        	if($scope.pages[empId].currPage < $scope.pages[empId].totalPages) {
            	$scope.pages[empId].currPage = $scope.pages[empId].totalPages;
            	if($scope.pages[empId].currPage == $scope.pages[empId].totalPages) {
	       	       	 var ele = angular.element('#next');
	    	    	 ele.addClass('disabled');
	    	    	 ele = angular.element('#last');
	    	    	 ele.addClass('disabled');
            	}
      	       	var ele = angular.element('#first');
    	    	ele.removeClass('disabled');
    	    	ele = angular.element('#previous');
    	    	ele.removeClass('disabled');
    	    	$scope.search(empId);
        	}

        };


        $scope.clearFilter = function() {
        	$scope.searchCriteria = {
	    		checkInDateTimeFrom : new Date(),
	    		checkInDateTimeTo : new Date(),
        	}
            $scope.selectedEmployee = null;
    		$scope.selectedProject = null;
    		$scope.selectedSite = null;
        	$scope.search(null);
        };

        $scope.loadImages = function(employeeEmpId, photoInId, photoOutId) {
        	if(photoInId) {
            	var uri = '/api/employee/' + employeeEmpId +'/checkInOut/' + photoInId;
                $http.get(uri).then(function (response) {
                    var ele = document.getElementById('photoInImg');
                	ele.setAttribute('src',response.data);
                }, function(response) {
                    var ele = document.getElementById('photoInImg');
                	ele.setAttribute('src',"//placehold.it/250x250");
                });
        	}else {
                var ele = document.getElementById('photoInImg');
            	ele.setAttribute('src',"//placehold.it/250x250");
        	}
            if(photoOutId) {
            	uri = '/api/employee/' + employeeEmpId +'/checkInOut/' + photoOutId;
                $http.get(uri).then(function (response) {
                    var ele = document.getElementById('photoOutImg');
                	ele.setAttribute('src',response.data);
                }, function(response) {
                    var ele = document.getElementById('photoOutImg');
                	ele.setAttribute('src',"//placehold.it/250x250");
                });
            }else {
                var ele = document.getElementById('photoOutImg');
            	ele.setAttribute('src',"//placehold.it/250x250");

            }

        };


        $scope.loadImagesNew = function(employeeEmpId, images) {
        	if(images && images.length > 0) {
        		for(var x=0;x<4;x++) {
                	if(images[x]) {
                		console.log("check out images - "+ images[x].photoOut);
                    	var uri = '/api/employee/' + employeeEmpId +'/checkInOut/' + images[x].photoOut;
                    	var eleId = 'photoOutImg'+(x+1);
                    	console.log('image element id -' + eleId);
                        $http.get(uri).then(function (response) {
                            var ele = document.getElementById(eleId);
                        	ele.setAttribute('src',response.data);
                        }, function(response) {
                            var ele = document.getElementById('photoOutImg'+(x+1));
                        	ele.setAttribute('src',"//placehold.it/250x250");
                        });
                	}else {
                        var ele = document.getElementById('photoOutImg'+(x+1));
                    	ele.setAttribute('src',"//placehold.it/250x250");
                	}
        		}

        	}

        };



        $scope.initMap = function(container, latIn, lngIn, containerOut, latOut, lngOut) {
        	// Create a map object and specify the DOM element for display.
        	  var myLatLng = {lat: latIn, lng: lngIn};
        	  console.log(document.getElementById(container));
        	  if(latIn == 0 && lngIn == 0) {
        		  var mapInEle = document.getElementById(container);
        		  mapInEle.innerHTML = '<img id="mapInImg" width="250" height="250" src="//placehold.it/250x250" class="img-responsive">';
        	  }else {

	        	  var mapIn = new google.maps.Map(document.getElementById(container), {
	        	    center: myLatLng,
	        	    scrollwheel: false,
	        	    streetViewControl: false,
	        	    zoom: 14,
	        	    mapTypeControlOptions: {
	        	        mapTypeIds: []
	        	     },
	        	  	mapTypeId: google.maps.MapTypeId.ROADMAP,
	        	  	zoomControl: true,
	        	  	draggable : true
	        	  });

	        	  // Create a marker and set its position.
	        	  var marker = new google.maps.Marker({
	        	    map: mapIn,
	        	    position: myLatLng,
	        	    title: 'Location',
	        	    draggable: false
	        	  });
        	  }

        	  var myLatLngOut = {lat: latOut, lng: lngOut};
        	  if(latOut == 0 && lngOut == 0) {
        		  var mapOutEle = document.getElementById(containerOut);
        		  mapOutEle.innerHTML = '<img id="mapOutImp" width="250" height="250" src="//placehold.it/250x250" class="img-responsive">';
        	  }else {
		        	  var mapOut = new google.maps.Map(document.getElementById(containerOut), {
		          	    center: myLatLngOut,
		          	    scrollwheel: false,
		          	    zoom: 14,
		          	    streetViewControl: false,

		        	    mapTypeControlOptions: {
		        	        mapTypeIds: []
		        	     },
		        	  	mapTypeId: google.maps.MapTypeId.ROADMAP,
		        	  	zoomControl: true,
		        	  	draggable : true
		          	  });

		          	  // Create a marker and set its position.
		          	  var markerOut = new google.maps.Marker({
		          	    map: mapOut,
		          	    position: myLatLngOut,
		          	    title: 'Location',
		        	    draggable: false
		          	  });

		          	google.maps.event.addListenerOnce(mapIn, 'idle', function() {
		          	    google.maps.event.trigger(mapIn, 'resize');
		                mapIn.setCenter(marker.getPosition());

		          	});
		          	google.maps.event.addListenerOnce(mapOut, 'idle', function() {
		          	    google.maps.event.trigger(mapOut, 'resize');
		                mapOut.setCenter(markerOut.getPosition());

		          	});
    	  	}
        };
    });
