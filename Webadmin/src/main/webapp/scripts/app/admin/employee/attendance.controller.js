'use strict';

angular.module('timeSheetApp')
    .controller('AttendanceController', function ($rootScope, $scope, $state, $timeout, 
        ProjectComponent, SiteComponent, EmployeeComponent,AttendanceComponent, $http,
        $stateParams,$location,$interval,PaginationComponent,$filter) {
        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.errorMessage = null;
        $scope.doNotMatch = null;
        $scope.errorEmployeeExists = null;
        $scope.selectedDateFrom = $filter('date')(new Date(), 'dd/MM/yyyy'); 
        $scope.selectedDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');
        $scope.selectedDateFromSer=  new Date();
        $scope.selectedDateToSer= new Date();
        $scope.pageSort = 10;
        $scope.pager = {};

        $scope.employeeDesignations = ["MD","Operations Manger","Supervisor"]

        $timeout(function (){angular.element('[ng-model="name"]').focus();});

        $scope.pages = { currPage : 1};

        $scope.selectedEmployee = null;

        $scope.selectedEmployeeId = null;

        $scope.selectedEmployeeName = null;

        $scope.selectedProject = null;

        $scope.selectedSite = null;

        $scope.existingEmployee = null;

        $scope.selectedManager = null;

        $scope.selectedAttendance = null;

        $scope.searchCriteriaAttendance = null;

        $scope.searchCriteria = {};
        $scope.pages = { currPage : 1};

        $scope.now = new Date()

        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();

        };

        $('input#dateFilterFrom').on('dp.change', function(e){
            console.log(e.date);
            console.log(e.date._d);
            $scope.selectedDateFromSer= e.date._d; 
            
            $.notifyClose();
             
            if($scope.selectedDateFromSer > $scope.selectedDateToSer) {

                    $scope.showNotifications('top','center','danger','From date cannot be greater than To date');
                    $scope.selectedDateFrom =$filter('date')(new Date(), 'dd/MM/yyyy');
                    return false;
            }else {
               $scope.selectedDateFrom= $filter('date')(e.date._d, 'dd/MM/yyyy');
               // $scope.refreshReport();
            }
            
            

        });
        $('input#dateFilterTo').on('dp.change', function(e){
            console.log(e.date);
            console.log(e.date._d);
            $scope.selectedDateToSer= e.date._d;

            $.notifyClose();
            
            if($scope.selectedDateFromSer > $scope.selectedDateToSer) {
                    $scope.showNotifications('top','center','danger','To date cannot be lesser than From date');
                    $scope.selectedDateTo=$filter('date')(new Date(), 'dd/MM/yyyy');
                    return false;
            }else {
                $scope.selectedDateTo= $filter('date')(e.date._d, 'dd/MM/yyyy');
                //$scope.refreshReport();
            }

        });

        $scope.init = function() {
        		$scope.loadAttendances();
        }

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
           $scope.clearFilter();
            $scope.search();
        };

        $scope.attendanceSites = function () {
            SiteComponent.findAll().then(function (data) {
                console.log("site attendances");
                $scope.allSites = data;
            });
        };

        $scope.loadProjects = function () {
    	    console.log("Loading all projects")
    	    		ProjectComponent.findAll().then(function (data) {
                $scope.projects = data;
            });
        };

        $scope.loadSites = function () {
            $scope.showLoader();
	        	console.log('selected project - ' + JSON.stringify($scope.selectedProject));
	        	if($scope.selectedProject) {
	            	ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
	                    $scope.sites = data;
	                    $scope.hideLoader();

	                });
	        	}else {
	            	SiteComponent.findAll().then(function (data) {
	                    $scope.sites = data;
	                    $scope.hideLoader();

	                });
	        	}
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
           $scope.loadAttendances();
       }


        $scope.loadAttendance = function() {
        	AttendanceComponent.findOne($stateParams.id).then(function (data) {
                $scope.attendance = data;
            });

        };

        $scope.loadSites = function () {
            $scope.showLoader();
	        	console.log('selected project - ' + JSON.stringify($scope.selectedProject));
	        	if($scope.selectedProject) {
	            	ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
	                    $scope.sites = data;
	                    $scope.hideLoader();

	                });
	        	}else {
	            	SiteComponent.findAll().then(function (data) {
	                    $scope.sites = data;
	                    $scope.hideLoader();

	                });
	        	}
        };

        $scope.isActiveAsc = 'employee.id';
        $scope.isActiveDesc = '';

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveAsc = field;
            $scope.isActiveDesc = '';
            $scope.isAscOrder = true;
            $scope.search();
            //$scope.loadAttendances();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
            $scope.search();
            //$scope.loadAttendances();
        }


        $scope.searchFilter = function () {
            $scope.setPage(1);
            $scope.search();
         }


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
        	$scope.searchCriteria.findAll = false;

               if($scope.selectedDateFrom) {
                    $scope.searchCriteria.checkInDateTimeFrom = $scope.selectedDateFromSer;
                }
                if($scope.selectedDateTo) {
                    $scope.searchCriteria.checkInDateTimeTo = $scope.selectedDateToSer;
                }
        	

//        	if($scope.selectedEmployee){
//        	    console.log($scope.selectedEmployee);
//                $scope.searchCriteria.employeeEmpId = $scope.selectedEmployee.empId;
//                $scope.searchCriteria.findAll = false;
//            }
//            if($scope.selectedSite){
//        	    $scope.searchCriteria.siteId = $scope.selectedSite.id;
//                $scope.searchCriteria.findAll = false;
//            }

            	if(!$scope.selectedEmployeeId && !$scope.selectedEmployeeName && !$scope.selectedSite && !$scope.selectedProject) {
                    $scope.searchCriteria.findAll = true;
                }

        		if($scope.selectedEmployeeId)
	        	{
	        		$scope.searchCriteria.employeeEmpId = $scope.selectedEmployeeId;
		        	console.log('selected emp id ='+ $scope.searchCriteria.employeeEmpId);
	        	}
                else{
                    $scope.searchCriteria.employeeEmpId = null;
                }
                if($scope.selectedEmployeeName)
	        	{
	        		$scope.searchCriteria.name = $scope.selectedEmployeeName;
		        	console.log('selected emp name ='+ $scope.searchCriteria.name);
	        	}
                else{
                    $scope.searchCriteria.name = null;
                }


	        	if($scope.selectedSite) {
		        	$scope.searchCriteria.siteId = $scope.selectedSite.id;
		        	}
		        	

	        	if($scope.selectedProject) {
		        	$scope.searchCriteria.projectId = $scope.selectedProject.id;
		        
	        	}
                
        	
        	console.log('search criterias - ',JSON.stringify($scope.searchCriteria));
            //-------
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
                     $scope.attendancesData = '';
                     $scope.attendancesDataLoader = false;
                     $scope.loadPageTop();
        	AttendanceComponent.search($scope.searchCriteria).then(function (data) {
                $scope.attendancesData = data.transactions;
                $scope.attendancesDataLoader = true;

                /*
                    ** Call pagination  main function **
                */
                 $scope.pager = {};
                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                 $scope.totalCountPages = data.totalCount;

                console.log("Pagination",$scope.pager);
                console.log('Attendance search result list -' + JSON.stringify($scope.attendancesData));
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;

                

                if($scope.jobs && $scope.projects.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.projects.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10;
                }

            });
    
        };

        $scope.loadEnrImage = function(enrollId) {

        //Employee Enrolled Image
            EmployeeComponent.findOne(enrollId).then(function (data) {
                console.log(data);
                var enrollImg = data.enrolled_face;
                
                var eleId1 = 'photoEnrolled';
                var ele1 = document.getElementById(eleId1);
                ele1.setAttribute('src',enrollImg);
           });
        }


        $scope.loadImagesNew = function(image,enrollId) {

            $scope.loadEnrImage(enrollId);
            //Attendance Image
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

        $scope.clearFilter = function() {
             $scope.selectedDateFrom = $filter('date')(new Date(), 'dd/MM/yyyy'); 
            $scope.selectedDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');
            $scope.selectedDateFromSer =  new Date();
            $scope.selectedDateToSer =  new Date();
            $scope.selectedEmployee = null;
            $scope.selectedProject = null;
            $scope.selectedSite = null;
            $scope.searchCriteria = {};
            $rootScope.searchCriteriaAttendances   = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            //$scope.search();
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

        $scope.showLoader = function(){
            console.log("Show Loader");
            $scope.loading = true;
            $scope.notLoading=false;
        };

        $scope.hideLoader = function(){
            console.log("Show Loader");
            $scope.loading = false;
            $scope.notLoading=true;
        };


        $scope.initCalender();

        //init load
        $scope.initLoad = function(){
             $scope.loadPageTop();
             $scope.init();
             $scope.setPage(1);

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
            $scope.search();
        };

    });
