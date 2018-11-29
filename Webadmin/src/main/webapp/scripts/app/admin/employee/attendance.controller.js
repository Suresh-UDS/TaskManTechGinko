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
        $scope.noData = false;
        $scope.SearchEmployeeId = null;
        $scope.SearchEmployeeName = null;
        $rootScope.exportStatusObj  ={};

        $scope.employeeDesignations = ["MD","Operations Manger","Supervisor"]

        //$timeout(function (){angular.element('[ng-model="name"]').focus();});

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

        $scope.searchProject = null;

        $scope.searchSite = null;

        $scope.searchCriteria = {};
        
        /** Ui-select scopes **/
        $scope.allClients = {id:0 , name: '-- ALL CLIENTS --'};
        $scope.client = {};
        $scope.clients = [];
        $scope.allSitesVal = {id:0 , name: '-- ALL SITES --'};
        $scope.sitesListOne = {};
        $scope.sitesLists = [];
        $scope.sitesListOne.selected =  null;


        $scope.now = new Date()

        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();

        };

        $('input#dateFilterFrom').on('dp.change', function(e){
          //console.log(e.date);
          //console.log(e.date._d);
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
          //console.log(e.date);
          //console.log(e.date._d);
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

        // Load Sites for selectbox //
        $scope.siteDisable = true;
        $scope.uiSite = [];
        $scope.siteFilterDisable = true;
        $scope.getSite = function (search) {
            var newSupes = $scope.uiSite.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }

            return newSupes;
        }
        //

        // Load Clients for selectbox //
        $scope.siteSpin = false;
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
              //console.log("site attendances");
                $scope.allSites = data;
            });
        };

        $scope.loadProjects = function () {
    	  //console.log("Loading all projects")
    	    		ProjectComponent.findAll().then(function (data) {
                $scope.projects = data;
                /** Ui-select scope **/
               $scope.clients[0] = $scope.allClients;
                /*for(var i=0;i<$scope.projects.length;i++)
                {
                    $scope.uiClient[i] = $scope.projects[i].name;
                }*/
                for(var i=0;i<$scope.projects.length;i++)
                {
                    $scope.clients[i+1] = $scope.projects[i];
                }
                        $scope.clientDisable = false;
                        $scope.clientFilterDisable = false;
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

        /*$scope.loadDepSites = function (searchProject) {
            if(searchProject){
              $scope.clearField = false;
              $scope.filter = false;
              $scope.searchProject = $scope.projects[$scope.uiClient.indexOf(searchProject)]
              $scope.uiSite.splice(0,$scope.uiSite.length)
              $scope.hideSite = false;
              if(jQuery.isEmptyObject($scope.selectedProject) == false) {
                     var depProj=$scope.selectedProject.id;
              }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                      var depProj=$scope.searchProject.id;
              }else{
                      var depProj=0;
              }
              $scope.siteSpin = true;
              ProjectComponent.findSites(depProj).then(function (data) {
                  $scope.searchSite = null;
                  $scope.sites = data;

                  for(var i=0;i<$scope.sites.length;i++)
                  {
                      $scope.uiSite[i] = $scope.sites[i].name;
                  }
                  $scope.siteFilterDisable = false;
                  $scope.siteSpin = false;
              });
            }

        };*/
        
       /** Ui-select function **/
        
        $scope.loadDepSitesList = function (searchProject) {
              $scope.siteSpin = true;
              $scope.searchProject = searchProject;
              if(jQuery.isEmptyObject($scope.searchProject) == true){
            	  SiteComponent.findAll().then(function (data) {
	                  $scope.selectedSite = null;
	                  $scope.sitesList = data;
	                  $scope.sitesLists = [];
	                  $scope.sitesListOne.selected = null;
	                  $scope.sitesLists[0] = $scope.allSitesVal;
	                  
	                  for(var i=0;i<$scope.sitesList.length;i++)
	                  {
	                      $scope.sitesLists[i+1] = $scope.sitesList[i];
	                  }
	                  $scope.siteFilterDisable = false;
	                  $scope.siteSpin = false;
	              });
              }else{
	              if(jQuery.isEmptyObject($scope.selectedProject) == false) {
	                     var depProj=$scope.selectedProject.id;
	                     $scope.selectedSite = null;
	              }else if(jQuery.isEmptyObject($scope.searchProject) == false){
	                      var depProj=$scope.searchProject.id;
	              }else{
	                      var depProj=0;
	              }
	              
	              ProjectComponent.findSites(depProj).then(function (data) {
	                  
	                  $scope.sitesList = data;
	                  $scope.sitesLists = [];
	                  $scope.sitesListOne.selected = null;
	                  $scope.sitesLists[0] = $scope.allSitesVal;
	                  
	                  for(var i=0;i<$scope.sitesList.length;i++)
	                  {
	                      $scope.sitesLists[i+1] = $scope.sitesList[i];
	                  }
	                  $scope.siteFilterDisable = false;
	                  $scope.siteSpin = false;
	              });
              }
           
            };

        $scope.loadSearchSite = function (searchSite) {
            $scope.searchSite = $scope.sites[$scope.uiSite.indexOf(searchSite)]
            $scope.hideSite = true;
        }
        $scope.employeeSearch = function () {
            if(!$scope.allEmployees) {
                EmployeeComponent.findAll().then(function (data) {
                  //console.log(data)
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
        	$('.AdvancedFilterModal.in').modal('hide');
            $scope.setPage(1);
            $scope.search();
         }

          $scope.searchFilter1 = function () {
            $scope.clearField = false;
            $scope.SearchEmployeeId = null;
            $scope.SearchEmployeeName = null;
            $scope.searchCriteria.employeeEmpId =null;
            $scope.searchCriteria.name =null;
            $scope.setPage(1);
            $scope.search();
         }
         $scope.addRemarksId = function(attendanceId,remarks){
           $scope.attendanceRemarksId = attendanceId;
           $scope.attendanceRemarks = remarks;
         };

         $scope.addRemarks = function(remarks){
          //console.log("remarks clicked");
          //console.log($scope.attendanceRemarksId);
            AttendanceComponent.addRemarks($scope.attendanceRemarksId,remarks).then(function (data) {
                $scope.showNotifications('top','center','success','Remarks Added to the attendance');
              //console.log(data);
                // $scope.showNotifications('top','center','danger','Site Already Exists');
                $scope.search();
            })
         };


        $scope.search = function () {
            $scope.noData = false;
          //console.log($scope.datePickerDate);
           

        	var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
        	if(!$scope.searchCriteria) {
            	var searchCriteria = {
            			currPage : currPageVal
            	}
            	$scope.searchCriteria = searchCriteria;

        	}
    		//console.log('criteria in root scope -'+JSON.stringify($rootScope.searchCriteriaAttendances));
    		//console.log('criteria in scope -'+JSON.stringify($scope.searchCriteria));

        	//console.log('Selected  project -' + $scope.searchEmployee + ", " + $scope.searchProject +" , "+ $scope.searchSite);
        	//console.log('Selected  date range -' + $scope.checkInDateTimeFrom + ", " + $scope.checkInDateTimeTo);
        	$scope.searchCriteria.currPage = currPageVal;
        	
            /* Root scope (search criteria) start*/
            
            if($rootScope.searchFilterCriteria.isDashboard){
            	
            	 if($rootScope.searchFilterCriteria.projectId){
              		$scope.searchProject ={id:$rootScope.searchFilterCriteria.projectId,name:$rootScope.searchFilterCriteria.projectName};
              		$scope.client.selected =$scope.searchProject;
              		$scope.projectFilterFunction($scope.searchProject);
              	}else{
              	   $scope.searchProject = null;
              	   $scope.client.selected =$scope.searchProject;
              	} 
            	
            	 if($rootScope.searchFilterCriteria.siteId){
             		$scope.searchSite = {id:$rootScope.searchFilterCriteria.siteId,name:$rootScope.searchFilterCriteria.siteName};
             		$scope.sitesListOne.selected = $scope.searchSite;
             		$scope.siteFilterDisable=false;
             		
             	}else{
             	   $scope.searchSite = null;
             	  $scope.sitesListOne.selected=$scope.searchSite;
             	}
            	
            	if($rootScope.searchFilterCriteria.selectedFromDate) {
	        		$scope.searchCriteria.checkInDateTimeFrom = $rootScope.searchFilterCriteria.selectedFromDate;
	        		$scope.selectedDateFrom = $filter('date')($rootScope.searchFilterCriteria.selectedFromDate, 'dd/MM/yyyy');
	        		$scope.selectedDateFromSer = $rootScope.searchFilterCriteria.selectedFromDate;
	        	}/*else{
	        	    $scope.searchCriteria.checkInDateTimeFrom = null;
	        	    $scope.selectedDateFrom = null;
	        	}*/

	        	if($rootScope.searchFilterCriteria.selectedToDate) {
	        		$scope.searchCriteria.checkInDateTimeTo = $rootScope.searchFilterCriteria.selectedToDate;
	        		$scope.selectedDateTo = $filter('date')($rootScope.searchFilterCriteria.selectedToDate, 'dd/MM/yyyy');
	        		$scope.selectedDateToSer = $rootScope.searchFilterCriteria.selectedToDate;
	        	}/*else{
	        	    $scope.searchCriteria.checkInDateTimeTo = null;
	        	    $scope.selectedDateTo = null;
	        	}*/
             	
            	 /* Root scope (search criteria) end*/
             	
            }else{
            	
            	if($scope.client.selected && $scope.client.selected.id !=0){
            		$scope.searchProject = $scope.client.selected;
            	}else{
            	   $scope.searchProject = null;
            	}
            	if($scope.sitesListOne.selected && $scope.sitesListOne.selected.id !=0){
            		$scope.searchSite = $scope.sitesListOne.selected;
            	}else{
            	   $scope.searchSite = null;
            	}
	        	 if($scope.selectedDateFrom) {
	                 $scope.searchCriteria.checkInDateTimeFrom = $scope.selectedDateFromSer;
	             }
	             if($scope.selectedDateTo) {
	                 $scope.searchCriteria.checkInDateTimeTo = $scope.selectedDateToSer;
	             }
            	
            }
            
            /* Root scope (search criteria) */
            $rootScope.searchFilterCriteria.isDashboard = false;
        
        	$scope.searchCriteria.findAll = false;
        	$scope.searchCriteria.list = false;
            $scope.searchCriteria.report = false;
            $scope.searchCriteria.isReport = false;

              


//        	if($scope.selectedEmployee){
//        	  //console.log($scope.selectedEmployee);
//                $scope.searchCriteria.employeeEmpId = $scope.selectedEmployee.empId;
//                $scope.searchCriteria.findAll = false;
//            }
//            if($scope.selectedSite){
//        	    $scope.searchCriteria.siteId = $scope.selectedSite.id;
//                $scope.searchCriteria.findAll = false;
//            }

            	if(!$scope.searchEmployeeId && !$scope.searchEmployeeName && !$scope.searchSite && !$scope.searchProject) {
                    $scope.searchCriteria.findAll = true;
                }

        		if($scope.searchEmployeeId)
	        	{
	        		$scope.searchCriteria.employeeEmpId = $scope.searchEmployeeId;
		        	console.log('selected emp id ='+ $scope.searchCriteria.employeeEmpId);
	        	}
                else{
                    $scope.searchCriteria.employeeEmpId = "";
                }
                if($scope.searchEmployeeName)
	        	{
	        		$scope.searchCriteria.name = $scope.searchEmployeeName;
		        	console.log('selected emp name ='+ $scope.searchCriteria.name);
	        	}
                else{
                    $scope.searchCriteria.name = "";
                }

                if(jQuery.isEmptyObject($scope.searchProject) == false) {
                //console.log('selected project -' + $scope.searchProject.id);
                   $scope.searchCriteria.projectId = $scope.searchProject.id;
                    $scope.searchCriteria.projectName = $scope.searchProject.name;
                }else{
                        $scope.searchCriteria.projectId = null;
                        $scope.searchCriteria.projectName = null;
                }

                if(jQuery.isEmptyObject($scope.searchSite) == false) {
                //console.log('selected site -' + $scope.searchSite.id);
                   $scope.searchCriteria.siteId = $scope.searchSite.id;
                    $scope.searchCriteria.siteName = $scope.searchSite.name;
                }else{
                        $scope.searchCriteria.siteId = null;
                        $scope.searchCriteria.siteName = null;
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
            
            $scope.searchCriteras = $scope.searchCriteria;

             //console.log("search criteria",$scope.searchCriteria);
                     $scope.attendancesData = '';
                     $scope.attendancesDataLoader = false;
                     $scope.loadPageTop();
        	AttendanceComponent.search($scope.searchCriteria).then(function (data) {
                $scope.attendancesData = data.transactions;
                $scope.attendancesDataLoader = true;

            if($scope.attendancesData != null){
                // Shift time HH:MM
              //console.log( $scope.attendancesData  );
                for(var i=0;i<$scope.attendancesData.length;i++) {
                    var start = $scope.attendancesData[i].shiftStartTime? $scope.attendancesData[i].shiftStartTime.split(':') : ['0','0'];
                  //console.log(start)
                    if(start[0].length == 1)
                    {
                      //console.log("Yes");
                        start[0] = '0'+start[0];
                        $scope.attendancesData[i].shiftStartTime = start[0] +':'+ start[1];
                        if(start[1].length == 1)
                        {

                            if(start[1]==0)
                            {
                                start[1] = '00';
                                $scope.attendancesData[i].shiftStartTime = start[0] +':'+ start[1];
                            }
                            else {
                                start[1] = '0'+start[1];
                                $scope.attendancesData[i].shiftStartTime = start[0] +':'+ start[1];
                            }


                        }
                    }
                    else if(start[1].length == 1)
                    {
                        if(start[1]==0)
                        {
                            start[1] = '00';
                            $scope.attendancesData[i].shiftStartTime = start[0] +':'+ start[1];
                        }
                        else {
                            start[1] = '0'+start[1];
                            $scope.attendancesData[i].shiftStartTime = start[0] +':'+ start[1];
                        }
                    }
                    else
                    {
                        $scope.attendancesData = data.transactions;
                    }


                    var end =  $scope.attendancesData[i].shiftEndTime ? $scope.attendancesData[i].shiftEndTime.split(':') : ['0','0'];
                  //console.log(end)
                    if(end[0].length == 1)
                    {
                        end[0] = '0'+end[0];
                        $scope.attendancesData[i].shiftEndTime = end[0] +':'+ end[1];
                        if(end[1].length == 1)
                        {
                            if(end[1]==0)
                            {
                                end[1] = '00';
                                $scope.attendancesData[i].shiftEndTime = end[0] +':'+ end[1];
                            }
                            else {
                                end[1] = '0'+start[1];
                                $scope.attendancesData[i].shiftEndTime = end[0] +':'+ end[1];
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
                                $scope.attendancesData[i].shiftEndTime = end[0] +':'+ end[1];
                            }
                            else {
                                end[1] = '0'+start[1];
                                $scope.attendancesData[i].shiftEndTime = end[0] +':'+ end[1];
                            }
                        }
                    }
                    else
                    {
                        $scope.attendancesData = data.transactions;
                    }


                }
            }
                //



                /*
                    ** Call pagination  main function **
                */
                 $scope.pager = {};
                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                 $scope.totalCountPages = data.totalCount;

              //console.log("Pagination",$scope.pager);
              //console.log('Attendance search result list -' + JSON.stringify($scope.attendancesData));
                if(data.currPage == 0){
                    $scope.pages.currPage = 1;
                }else{
                    $scope.pages.currPage = data.currPage;
                }

                $scope.pages.totalPages = data.totalPages;


                if($scope.attendancesData && $scope.attendancesData.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.projects.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10;
                    $scope.noData = false;

                    }else{
                         $scope.noData = true;
                    }

            });

        };

        $scope.loadEnrImage = function(enrollId) {

        //Employee Enrolled Image
            EmployeeComponent.findOne(enrollId).then(function (data) {
              //console.log(data);
                var enrollImg = data.enrolled_face;

                var eleId1 = 'photoEnrolled';
                var ele1 = document.getElementById(eleId1);
                ele1.setAttribute('src',enrollImg);
           });
        }


        $scope.loadImagesNew = function(imageUrl, enrollUrl) {

//            $scope.loadEnrImage(enrollId);
            //Attendance Image
            var eleId = 'photoOutImg';
            var ele = document.getElementById(eleId);
            ele.setAttribute('src',imageUrl);

//            var enrollImg = enrollUrl;

            var eleId1 = 'photoEnrolled';
            var ele1 = document.getElementById(eleId1);
            ele1.setAttribute('src',enrollUrl);
        };

        $scope.initMap = function(container, latIn, lngIn, containerOut, latOut, lngOut) {
            // Create a map object and specify the DOM element for display.
            var myLatLng = {lat: latIn, lng: lngIn};
            var myLatLngOut = {lat:latOut, lng:lngOut};
          //console.log(myLatLng);
          //console.log(myLatLngOut);
          //console.log("Container");
          //console.log(document.getElementById(container));
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
        	/*$('input#dateFilterFrom').data('DateTimePicker').clear();
            $('input#dateFilterTo').data('DateTimePicker').clear();*/
            $scope.noData = false;
            $scope.clearField = true;
            $rootScope.exportStatusObj = {};
            $scope.exportStatusMap = [];
            $scope.downloader=false;
            $scope.downloaded = true;
            $scope.siteFilterDisable = true;
            $scope.sites = null;
            
            /** Ui-select scopes **/
        	$scope.client.selected = null;
        	$scope.sitesLists =  [];
        	$scope.sitesListOne.selected =  null;
        	
            $scope.selectedDateFrom = $filter('date')(new Date(), 'dd/MM/yyyy');
            $scope.selectedDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');
            $scope.selectedDateFromSer =  new Date();
            $scope.selectedDateToSer =  new Date();
            $scope.selectedEmployee = null;
            $scope.selectedProject = null;
            $scope.selectedSite = null;
            $scope.searchProject = null;
            $scope.searchSite = null;
            $scope.searchEmployeeId = null;
            $scope.searchEmployeeName = null;
            $scope.searchCriteria = {};
            $rootScope.searchCriteriaAttendances   = null;
            // $scope.selectedDateFrom = null;
            // $scope.selectedDateTo = null;
            $scope.filter = true;
            $scope.siteFilterDisable = true;
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
          //console.log(checkInImage)
            $('.modal-body img').attr('src',checkInImage);

        };

        $scope.exportAllData = function(){
             $rootScope.exportStatusObj = {};
             $scope.exportStatusMap = [];
             $scope.downloaded = false;
             $scope.downloader=true;
             $scope.searchCriteria.list = true;
             $scope.searchCriteria.report = true;
             $scope.searchCriteria.isReport = true;
             $scope.searchCriteria.columnName = "createdDate";
             $scope.searchCriteria.sortByAsc = false;
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
                		$scope.downloader=false;
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

        $scope.downloaded = false;

        $scope.clsDownload = function(){
          $scope.downloaded = true;
          $rootScope.exportStatusObj = {};
          $scope.exportStatusMap = [];
        }

        $scope.showLoader = function(){
          //console.log("Show Loader");
            $scope.loading = true;
            $scope.notLoading=false;
        };

        $scope.hideLoader = function(){
          //console.log("Show Loader");
            $scope.loading = false;
            $scope.notLoading=true;
        };

        $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
        }

        $scope.initCalender();

        //init load
        $scope.initLoad = function(){
             $scope.loadPageTop();
             $scope.init();
             //$scope.setPage(1);

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

        /*$scope.exportAllData = function(type){
                $scope.searchCriteria.exportType = type;
                $scope.searchCriteria.report = true;
                $rootScope.exportStatusObj.exportMsg = '';
                $scope.downloader=true;
                $scope.typeMsg = type;
                AttendanceComponent.exportAllData($scope.searchCriteria).then(function(data){
                    var result = data.results[0];
                  //console.log(result);
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
        };*/

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
            //console.log('empId='+$scope.empId);

          //console.log('exportStatusMap length -'+$scope.exportStatusMap.length);
            angular.forEach($scope.exportStatusMap, function(exportStatusObj, index){
                if(!exportStatusObj.empId) {
                    exportStatusObj.empId = 0;
                }
                AttendanceComponent.exportStatus(exportStatusObj.empId,exportStatusObj.fileName).then(function(data) {
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

    });
