'use strict';

angular.module('timeSheetApp')
    .controller('AttendanceReportController', function ($rootScope, $scope, $state, $timeout, ProjectComponent, SiteComponent, EmployeeComponent,AttendanceComponent, $http,$stateParams,$location,$interval) {
        $scope.success = null;
        $scope.error = null;
        $scope.errorMessage = null;
        $scope.doNotMatch = null;
        $scope.errorEmployeeExists = null;

        $scope.employeeDesignations = ["MD","Operations Manger","Supervisor"]

        $timeout(function (){angular.element('[ng-model="name"]').focus();});

        $scope.pages = { currPage : 1};

        $scope.selectedEmployee;

        $scope.selectedProject;

        $scope.selectedSite;

        $scope.existingEmployee;

        $scope.selectedManager;

        $scope.selectedAttendance;

        $scope.searchCriteriaAttendance;

        $scope.now = new Date()

        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();

        };

        $('#dateFilterFrom').on('dp.change', function(e){
            console.log(e.date);
            console.log(e.date._d);
            $scope.selectedDateFrom=e.date._d;

        });
        $('#dateFilterTo').on('dp.change', function(e){
            console.log(e.date);

            console.log(e.date._d);
            $scope.selectedDateTo=e.date._d;

        });

        $scope.loadAllAttendances = function () {
        	if(!$scope.allAttendances) {
            	AttendanceComponent.findAll().then(function (data) {
            	console.log(data)
            		$scope.allAttendances = data;
            	// $scope.attendanceSites();
            	$scope.employeeSearch();
            	})
        	}
        }

        $scope.loadAttendances = function () {
//        	if($rootScope.searchCriteriaEmployees) {
//        		$scope.search();
//        	}else {
//            	EmployeeComponent.findAll().then(function (data) {
//                    $scope.employees = data;
//                });
//        	}
            $scope.search();
        };

        $scope.attendanceSites = function () {
            SiteComponent.findAll().then(function (data) {
                console.log("site attendances");
                $scope.allSites = data;
            });
        };

        $scope.employeeSearch = function () {
            if(!$scope.allEmployees) {
                EmployeeComponent.findAll().then(function (data) {
                    console.log(data)
                    $scope.allEmployees = data;
                })
            }
        };

        $scope.allSites=[{name:'UDS'},{name:'Zappy'}]



       $scope.refreshPage = function() {
           $scope.clearFilter();
           $scope.loadEmployees();
       }


        $scope.loadAttendance = function() {
        	AttendanceComponent.findOne($stateParams.id).then(function (data) {
                $scope.attendance = data;
            });

        };


        $scope.search = function () {
            console.log($scope.datePickerDate);
        	var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
        	if(!$scope.searchCriteria) {
            	var searchCriteria = {
            			currPage : currPageVal
            	}
            	$scope.searchCriteria = searchCriteria;
        	}
    		console.log('criteria in root scope -'+JSON.stringify($rootScope.searchCriteriaAttendances));
    		console.log('criteria in scope -'+JSON.stringify($scope.searchCriteria));

        	console.log('Selected  project -' + $scope.selectedEmployee + ", " + $scope.selectedProject +" , "+ $scope.selectedSite);
        	console.log('Selected  date range -' + $scope.checkInDateTimeFrom + ", " + $scope.checkInDateTimeTo);
        	$scope.searchCriteria.currPage = currPageVal;
        	$scope.searchCriteria.findAll = true;
        	if($scope.selectedDateFrom){
                $scope.searchCriteria.checkInDateTimeFrom = $scope.selectedDateFrom;
                $scope.searchCriteria.findAll = false;
                console.log("From date found");
                console.log($scope.searchCriteria.checkInDateTimeFrom)


            }else{
                $scope.searchCriteria.checkInDateTimeFrom = new Date();
                console.log("From date not found")
                console.log($scope.searchCriteria.checkInDateTimeFrom)

            }

            if($scope.selectedDateTo){
                $scope.searchCriteria.checkInDateTimeTo = $scope.selectedDateTo;
                $scope.searchCriteria.findAll = false;
                console.log("To date found")
                console.log($scope.searchCriteria.checkInDateTimeTo)

            }else{
                $scope.searchCriteria.checkInDateTimeTo= new Date();
                console.log("To date not found")
                console.log($scope.searchCriteria.checkInDateTimeTo)
            }

        	if($scope.selectedEmployee){
        	    console.log($scope.selectedEmployee);
                $scope.searchCriteria.employeeEmpId = $scope.selectedEmployee.empId;
                $scope.searchCriteria.findAll = false;
            }
            if($scope.selectedSite){
        	    $scope.searchCriteria.siteId = $scope.selectedSite.id;
                $scope.searchCriteria.findAll = false;
            }
        	console.log(JSON.stringify($scope.searchCriteria));
        	AttendanceComponent.search($scope.searchCriteria).then(function (data) {
                $scope.attendancesData = data.transactions;
                console.log('Attendance search result list -' + $scope.attendancesData);
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                if($scope.employees == null){
                    $scope.pages.startInd = 0;
                }else{
                    $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
                }

                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
                $scope.pages.totalCnt = data.totalCount;
            	$scope.hide = true;
            });
        	$rootScope.searchCriteriaAttendances = $scope.searchCriteria;
    		console.log('criteria in root scope -'+JSON.stringify($rootScope.searchCriteriaAttendances));
            if($scope.pages.currPage == 1) {
                        	$scope.firstStyle();
                    	}
        };




        $scope.first = function() {
        	if($scope.pages.currPage > 1) {
            	$scope.pages.currPage = 1;
            	$scope.firstStyle();
            	$scope.search();
        	}
        };

        $scope.firstStyle = function() {
       	 var ele = angular.element('#first');
    	 ele.addClass('disabledLink');
    	 ele = angular.element('#previous');
    	 ele.addClass('disabledLink');
    	 if($scope.pages.totalPages > 1) {
 	       	 var ele = angular.element('#next');
	    	 ele.removeClass('disabledLink');
	    	 ele = angular.element('#last');
	    	 ele.removeClass('disabledLink');
    	 }

        }

        $scope.previous = function() {
        	if($scope.pages.currPage > 1) {
            	$scope.pages.currPage = $scope.pages.currPage - 1;
            	if($scope.pages.currPage == 1) {
	       	       	 var ele = angular.element('#first');
	    	    	 ele.addClass('disabled');
	    	    	 ele = angular.element('#previous');
	    	    	 ele.addClass('disabled');
            	}
     	       	 var ele = angular.element('#next');
    	    	 ele.removeClass('disabled');
    	    	 ele = angular.element('#last');
    	    	 ele.removeClass('disabled');
	    		$scope.search();
        	}

        };

        $scope.loadImagesNew = function( image) {
            var eleId = 'photoOutImg';
            var ele = document.getElementById(eleId);
            ele.setAttribute('src',image);

        };

        $scope.initMap = function(container, latIn, lngIn, containerOut, latOut, lngOut) {
            // Create a map object and specify the DOM element for display.
            var myLatLng = {lat: latIn, lng: lngIn};
            var myLatLngOut = {lat:latOut, lng:lngOut};
            console.log(myLatLng);
            console.log(myLatLngOut);
            console.log("Container");
            console.log(document.getElementById(container));
            if (latIn == 0 && lngIn == 0) {
                var mapInEle = document.getElementById(container);
                mapInEle.innerHTML = '<img id="mapInImg" width="250" height="250" src="//placehold.it/250x250" class="img-responsive">';
            } else {

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
                    draggable: true
                });

                // Create a marker and set its position.
                var marker = new google.maps.Marker({
                    map: mapIn,
                    position: myLatLng,
                    title: 'Checked-in',
                    draggable: false
                });

            }

            if (latOut == 0 && lngOut == 0) {
                var mapInEle = document.getElementById(containerOut);
                mapInEle.innerHTML = '<img id="mapInImg" width="250" height="250" src="//placehold.it/250x250" class="img-responsive">';
            } else {

                var mapOut = new google.maps.Map(document.getElementById(containerOut), {
                    center: myLatLngOut,
                    scrollwheel: false,
                    streetViewControl: false,
                    zoom: 14,
                    mapTypeControlOptions: {
                        mapTypeIds: []
                    },
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    zoomControl: true,
                    draggable: true
                });

                // Create a marker and set its position.
                var marker = new google.maps.Marker({
                    map: mapOut,
                    position: myLatLngOut,
                    title: 'checked-out',
                    draggable: false
                });
            }


        };

        $scope.newInitMap = function( container, latIn, lngIn, containerOut, latOut, lngOut){
            window.setTimeout(function( ){
                    $scope.initMap(container, latIn, lngIn, containerOut, latOut, lngOut)
                },1000
            )
        }

        $scope.next = function() {
        	if($scope.pages.currPage < $scope.pages.totalPages) {
            	$scope.pages.currPage = $scope.pages.currPage + 1;
            	if($scope.pages.currPage == $scope.pages.totalPages) {
	       	       	 var ele = angular.element('#next');
	    	    	 ele.addClass('disabled');
	    	    	 ele = angular.element('#last');
	    	    	 ele.addClass('disabled');
            	}
     	       	 var ele = angular.element('#first');
    	    	 ele.removeClass('disabled');
    	    	 ele = angular.element('#previous');
    	    	 ele.removeClass('disabled');
	    		$scope.search();
        	}

        };

        $scope.last = function() {
        	if($scope.pages.currPage < $scope.pages.totalPages) {
            	$scope.pages.currPage = $scope.pages.totalPages;
            	if($scope.pages.currPage == $scope.pages.totalPages) {
	       	       	 var ele = angular.element('#next');
	    	    	 ele.addClass('disabled');
	    	    	 ele = angular.element('#last');
	    	    	 ele.addClass('disabled');
            	}
      	       	var ele = angular.element('#first');
    	    	ele.removeClass('disabled');
    	    	ele = angular.element('#previous');
    	    	ele.removeClass('disabled');
    	    	$scope.search();
        	}

        };

        $scope.clearFilter = function() {
            $scope.selectedEmployee = null;
            $scope.selectedProject = null;
            $scope.selectedSite = null;
            $scope.searchCriteria = {};
            $rootScope.searchCriteriaAttendances   = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            $scope.search();
        };

        function pad(num, size) {
            var s = num+"";
            while (s.length < size) s = "0" + s;
            return s;
        }

        $scope.loadAttendanceImage = function(checkInImage) {
            console.log(checkInImage)
            $('.modal-body img').attr('src',checkInImage);

        };

        $scope.exportAllData = function(){

        	AttendanceComponent.exportAllData($scope.searchCriteria).then(function(data){
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
            	AttendanceComponent.exportStatus(exportStatusObj.empId,exportStatusObj.fileName).then(function(data) {
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

        $scope.initCalender();

    });
