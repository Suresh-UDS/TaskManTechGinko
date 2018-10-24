'use strict';

angular.module('timeSheetApp')
    .controller('TicketReportController', function ($rootScope, $scope, $state, $timeout,
        ProjectComponent, SiteComponent, EmployeeComponent,TicketComponent,JobComponent,
        DashboardComponent, $http,$stateParams,$location,$interval,PaginationComponent,$filter) {
        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.errorMessage = null;
        $scope.doNotMatch = null;
        $scope.errorEmployeeExists = null;
        $scope.employeeDesignations = ["MD","Operations Manger","Supervisor"]
        //$timeout(function (){angular.element('[ng-model="name"]').focus();});
        $scope.pages = { currPage : 1};
        $scope.selectedEmployee;
        $scope.searchCriteria = {};
        $scope.selectedProject = null;
        $scope.selectedSite = null;
        $scope.selectedStatus = null;
        $scope.existingEmployee;
        $scope.selectedManager;
        $scope.selectedTicket;
        $scope.searchCriteriaTicket;
        $scope.regionList=null;
        $scope.BranchList=null;
        $scope.selectedBranch = null;
        $scope.selectedRegion=null;
        //$scope.selectedDateFrom = $filter('date')('01/01/2018', 'dd/MM/yyyy');
        $scope.selectedDateFrom = $filter('date')(new Date(), 'dd/MM/yyyy');
        $scope.selectedDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');
        var d = new Date();
        d.setFullYear(2018, 0, 1);
        //$scope.selectedDateFromSer= d;
        $scope.selectedDateFromSer= new Date();
        $scope.selectedDateToSer= new Date();
        $scope.pageSort = 10;
        $scope.pager = {};
        $rootScope.exportStatusObj  ={};


        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();

        };
        $scope.showNotifications= function(position,alignment,color,msg){
                    demo.showNotification(position,alignment,color,msg);
                }


         $('input#dateFilterFrom').on('dp.change', function(e){
            console.log(e.date);
            console.log(e.date._d);
            $scope.selectedDateFromSer= new Date(e.date._d);

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
            $scope.selectedDateToSer= new Date(e.date._d);

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

        $scope.initCalender();



        // Load Clients for selectbox //
        $scope.clientFilterDisable = true;
        $scope.uiClient = [];
        $scope.getClient = function (search) {
            var newSupes = $scope.uiClient.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }

            return newSupes;
        };
        //

        // Load Sites for selectbox //
        $scope.siteFilterDisable = true;
        $scope.uiSite = [];
        $scope.getSite = function (search) {
            var newSupes = $scope.uiSite.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }
            return newSupes;
        };
        //
        // Load Status for selectbox //
        $scope.statusFilterDisable = true;
        $scope.uiStatus = [];

        $scope.getStatus= function (search) {
            var newSupes = $scope.uiStatus.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }

            return newSupes;
        };

        //
        $scope.loadSearchProject = function (searchProject) {
            $scope.siteSpin = true;
            $scope.hideSite = false;
            $scope.clearField = false;
            $scope.hideStatus = false;
            $scope.siteFilterDisable = true;
            $scope.uiSite.splice(0,$scope.uiSite.length)
            $scope.searchSite = null;
            $scope.selectedProject = $scope.projects[$scope.uiClient.indexOf(searchProject)];
            $scope.loadDepSites();
        };
        $scope.loadSearchSite = function (searchSite) {
            $scope.hideSite = true;
            $scope.hideStatus = false;
            $scope.selectedSite = $scope.sites[$scope.uiSite.indexOf(searchSite)];
        };
        $scope.loadSearchStatus = function (searchStatus) {
             $scope.hideStatus = true;
            $scope.clearField = false;
            $scope.selectedStatus = $scope.ticketStatuses[$scope.uiStatus.indexOf(searchStatus)]
        };



        //

        $scope.loadRegions = function () {
            if($scope.selectedProject){
                SiteComponent.getRegionByProject($scope.selectedProject.id).then(function (response) {
                    console.log(response);
                    $scope.regionList = response;
                })
            }

        };

        $scope.loadBranch = function () {

            if($scope.selectedProject){

                if($scope.selectedRegion){
                    console.log($scope.selectedRegion);
                    $scope.loadSites();
                    SiteComponent.getBranchByProject($scope.selectedProject.id,$scope.selectedRegion.id).then(function (response) {
                        console.log(response);
                        $scope.branchList = response;
                    })

                }else{
                    $scope.showNotifications('top','center','danger','Please Select Region to continue...');

                }

            }else{
                $scope.showNotifications('top','center','success','Please select Project to continue...');

            }


        };


        $scope.refreshReport = function() {
                $scope.search();
        }


        $scope.init = function() {
                $scope.loadPageTop();
                $scope.loadAllProjects();
                $scope.loadTicketStatuses();
                $scope.loadSites();
                $scope.loadTickets();
        }

        $scope.loadAllTickets = function () {
                if(!$scope.allTickets) {
                    JobComponent.findAll().then(function (data) {
                    console.log(data)
                        $scope.allTickets = data;
                        // $scope.ticketSites();
                        //$scope.employeeSearch();
                    })
                }
        }

        $scope.loadTicketStatuses = function() {
                TicketComponent.loadTicketStatuses().then(function(data){
                    $scope.ticketStatuses = data;
                    console.log("========",$scope.ticketStatuses)
                    //
                    for(var i=0;i<$scope.ticketStatuses.length;i++)
                    {
                        $scope.uiStatus[i] = $scope.ticketStatuses[i];
                    }
                    $scope.statusFilterDisable = false;
                    //
                })
        }
        $scope.loadDepSites = function () {

            if(jQuery.isEmptyObject($scope.selectedProject) == false) {
                var depProj=$scope.selectedProject.id;
            }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                var depProj=$scope.searchProject.id;
            }else{
                var depProj=0;
            }

            ProjectComponent.findSites(depProj).then(function (data) {
                $scope.searchSite = null;
                $scope.sites = data;

                //

                for(var i=0;i<$scope.sites.length;i++)
                {
                    $scope.uiSite[i] = $scope.sites[i].name;
                }
                $scope.siteFilterDisable = false;
                $scope.siteSpin = false;
                //
            });
        };

        $scope.loadTickets = function () {
            $scope.clearFilter();
            $scope.search();
        };

        $scope.ticketSites = function () {
            SiteComponent.findAll().then(function (data) {
                console.log("site tickets");
                $scope.sites = data;
            });
        };

        $scope.loadAllProjects = function () {
            ProjectComponent.findAll().then(function (data) {
                console.log("projects");
                $scope.projects = data;
                //
                for(var i=0;i<$scope.projects.length;i++)
                {
                    $scope.uiClient[i] = $scope.projects[i].name;
                }
                $scope.clientFilterDisable = false;
                //
            });
        };

        $scope.changeProject = function() {
                console.log('selected project - ' + JSON.stringify($scope.selectedProject));
                $scope.loadSites($scope.selectedProject.id);
                $scope.selectedSite = null;
                $scope.refreshReport();
        }

        $scope.loadSites = function () {

                console.log('selected project - ' + JSON.stringify($scope.selectedProject));
                if($scope.selectedProject) {
                    if($scope.selectedBranch){

                        SiteComponent.getSitesByBranch($scope.selectedProject.id,$scope.selectedRegion.name,$scope.selectedBranch.name).then(function (response) {
                            $scope.sites = response;
                        })

                    }else if($scope.selectedRegion){

                        SiteComponent.getSitesByRegion($scope.selectedProject.id,$scope.selectedRegion.name).then(function (response) {
                            $scope.sites = response;
                        })

                    }else{
                        ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
                            $scope.sites = data;

                        });
                    }

                }else {
                    SiteComponent.findAll().then(function (data) {
                        $scope.sites = data;
                        //
                        for(var i=0;i<$scope.sites.length;i++)
                        {
                            $scope.uiSite[i] = $scope.sites[i].name;
                        }
                        $scope.siteSpin = false;
                        $scope.siteFilterDisable = false;

                        //
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

        $scope.sites=[]



       $scope.refreshPage = function() {

           $scope.loadTickets();

       }


        $scope.loadTicket = function() {
            JobComponent.findOne($stateParams.id).then(function (data) {
                $scope.ticket = data;
            });

        };

        $scope.isActiveAsc = 'id';
        $scope.isActiveDesc = '';

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveAsc = field;
            $scope.isActiveDesc = '';
            $scope.isAscOrder = true;
            $scope.search();
            //$scope.loadTickets();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
            $scope.search();
            //$scope.loadTickets();
        }

        $scope.searchFilter = function () {
            $scope.setPage(1);
            $scope.search();
         }

        $scope.search = function () {

            var reportUid = $stateParams.uid;
            console.log($scope.datePickerDate);
            var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
            if(!$scope.searchCriteria) {
                var searchCriteria = {
                        currPage : currPageVal
                }
                $scope.searchCriteria = searchCriteria;
            }
            // console.log('criteria in root scope -'+JSON.stringify($rootScope.searchCriteriaTickets));
            // console.log('criteria in scope -'+JSON.stringify($scope.searchCriteria));
            //
            // console.log('Selected  project -' + $scope.selectedEmployee + ", " + $scope.selectedProject +" , "+ $scope.selectedSite);
            // console.log('Selected  date range -' + $scope.checkInDateTimeFrom + ", " + $scope.checkInDateTimeTo);
            $scope.searchCriteria.ticketStatus = $scope.selectedStatus;
            $scope.searchCriteria.currPage = currPageVal;
            $scope.searchCriteria.findAll = false;
            $scope.searchCriteria.isReport = false;

            $scope.searchCriteria.region = $scope.selectedRegion!=null?$scope.selectedRegion.name:" ";
            $scope.searchCriteria.branch = $scope.selectedBranch!=null?$scope.selectedBranch.name:" ";

            console.log($scope.selectedProject , $scope.selectedSite)
             if( !$scope.selectedProject && !$scope.selectedSite
                &&  !$scope.selectedStatus) {
                $scope.searchCriteria.findAll = true;
            }

            if($scope.selectedDateFrom) {
                    $scope.searchCriteria.fromDate = $scope.selectedDateFromSer;
                }
                if($scope.selectedDateTo) {
                    $scope.searchCriteria.toDate = $scope.selectedDateToSer;
                }


                if($scope.selectedTitle)
                {
                    $scope.searchCriteria.ticketTitle = $scope.selectedTitle;
                    console.log('selected Title ='+ $scope.searchCriteria.ticketTitle);
                }
                if($scope.selectedDescription)
                {
                    $scope.searchCriteria.ticketDescription = $scope.selectedDescription;
                    console.log('selected ticket Description ='+ $scope.searchCriteria.ticketDescription);
                }


                if($scope.selectedProject) {
                    $scope.searchCriteria.projectId = $scope.selectedProject.id;
                    $scope.searchCriteria.projectName = $scope.selectedProject.name;

                }

                if($scope.selectedSite) {
                    $scope.searchCriteria.siteId = $scope.selectedSite.id;
                    $scope.searchCriteria.siteName = $scope.selectedSite.name;
                    }

                if($scope.selectedEmployee)
                {
                   $scope.searchCriteria.employeeId = $scope.selectedEmployee.id;
                }
                if($scope.selectedStatus)
                {

                   $scope.searchCriteria.ticketStatus = $scope.selectedStatus;
                }

            if($scope.pageSort){
                $scope.searchCriteria.sort = $scope.pageSort;
            }

            if($scope.selectedColumn){

                $scope.searchCriteria.columnName = $scope.selectedColumn;
                $scope.searchCriteria.sortByAsc = $scope.isAscOrder;

            }
            else{
                // $scope.searchCriteria.columnName ="id";
                // $scope.searchCriteria.sortByAsc = true;
            }

               console.log("search criteria ==================",$scope.searchCriteria);
                     $scope.ticketsData = '';
                     $scope.ticketsDataLoader = false;
                     $scope.loadPageTop();


            //JobComponent.searchTickets($scope.searchCriteria, reportUid).then(function (data) {
            JobComponent.searchTickets($scope.searchCriteria).then(function (data) {
                $scope.ticketsData = data.transactions;
                $scope.ticketsDataLoader = true;
                console.log('Ticket search result list -' + JSON.stringify($scope.ticketsData));

                 /*
                    ** Call pagination  main function **
                */
                 $scope.pager = {};
                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                 $scope.totalCountPages = data.totalCount;

                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;

                if($scope.ticketsData && $scope.ticketsData.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.ticketsData.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10;
                }

            });

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

        $scope.clearFilter = function() {
            $rootScope.exportStatusObj = {};
            $scope.exportStatusMap = [];
            $scope.downloader=false;
            $scope.downloaded = true;
            $scope.clearField = true;
            $scope.siteFilterDisable = true;
            $scope.sites = null;
            //$scope.selectedDateFrom = $filter('date')('01/01/2018', 'dd/MM/yyyy');
            $scope.selectedDateFrom = $filter('date')(new Date(), 'dd/MM/yyyy');
            $scope.selectedDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');
            //$scope.selectedDateFromSer = d;
            $scope.selectedDateFromSer = new Date();
            $scope.selectedDateToSer =  new Date();
            $scope.selectedEmployee = null;
            $scope.selectedProject = null;
            $scope.selectedSite = null;
            $scope.selectedStatus = null;
            $scope.searchCriteria = {};
            $rootScope.searchCriteriaTickets   = null;
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

        $scope.loadTicketImage = function(checkInImage) {
            console.log(checkInImage)
            $('.modal-body img').attr('src',checkInImage);

        };

        $scope.exportAllData = function(type){
                $rootScope.exportStatusObj = {};
                $scope.exportStatusMap = [];
                $scope.downloader=true;
                $scope.downloaded = false;
                $scope.searchCriteria.isReport = true;
                $scope.searchCriteria.exportType = type;
                $scope.searchCriteria.report = true;
                $scope.typeMsg = type;

                console.log('calling ticket export api');
                TicketComponent.exportAllData($scope.searchCriteria).then(function(data){
                    var result = data.results[0];
                    console.log(result.file + ', ' + result.status + ',' + result.msg);
                    var exportAllStatus = {
                            fileName : result.file,
                            exportMsg : 'Exporting All...',
                            url: result.url
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
            $rootScope.exportStatusObj = {};
            console.log('exportStatusMap length -'+$scope.exportStatusMap.length);
            angular.forEach($scope.exportStatusMap, function(exportStatusObj, index){
                if(!exportStatusObj.empId) {
                    exportStatusObj.empId = 0;
                }
                TicketComponent.exportStatus(exportStatusObj.fileName).then(function(data) {
                    if(data) {
                        exportStatusObj.exportStatus = data.status;
                        console.log('exportStatus - '+ exportStatusObj);
                        exportStatusObj.exportMsg = data.msg;
                        $scope.downloader=false;
                        console.log('exportMsg - '+ exportStatusObj.exportMsg);
                        if(exportStatusObj.exportStatus == 'COMPLETED'){
                            if(exportStatusObj.url) {
                                exportStatusObj.exportFile = exportStatusObj.url;
                            }else {
                                exportStatusObj.exportFile = data.file;
                            }
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

          //init load
        $scope.initLoad = function(){
             $scope.loadPageTop();
             $scope.loadTickets();


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
