'use strict';

angular.module('timeSheetApp')
    .controller('EmployeeRelieverController', function ($rootScope, $scope, $state, $timeout,$filter,
                                            ProjectComponent, SiteComponent,$http,$stateParams,$location,PaginationComponent,
                                            getLocalStorage,EmployeeComponent) {
        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorSitesExists = null;
        $scope.selectedProject = null;
        $scope.selectedRegion = null;
        $scope.selectedBranch = null;
        $scope.selectedSite = null;
        $scope.searchProject = null;
        $scope.searchRegion = null;
        $scope.searchBranch = null;
        $scope.searchSite = null;
        $scope.regionList = null;
        $scope.branchList = [];
        $scope.searchCriteria = {};
        $scope.regionDetails = {};
        $scope.branchDetails = {};
        $scope.pages = { currPage : 1};
        $scope.pager = {};
        $scope.noData = false;
        $scope.btnDisable = false;
        $scope.localStorage = null;
        $scope.sitesList = null;
        $scope.selectedRegionOne = {};
        $scope.regionSelectedProject={};
        $scope.branchSelectedProject={};

        /** Ui-select scopes **/
        $scope.allClients = {id:0 , name: '-- ALL CLIENTS --'};
        $scope.client = {};
        $scope.clients = [];
        $scope.allSites = {id:0 , name: '-- ALL SITES --'};
        $scope.sitesListOne = {};
        $scope.sitesLists = [];
        $scope.sitesListOne.selected =  null;
        $scope.allRegions = {id:0 , name: '-- SELECT REGIONS --'};
        $scope.regionsListOne = {};
        $scope.regionsLists = [];
        $scope.regionsListOne.selected =  null;
        $scope.allBranchs = {id:0 , name: '-- SELECT BRANCHES --'};
        $scope.branchsListOne = {};
        $scope.branchsLists = [];
        $scope.branchsListOne.selected =  null;
        //$scope.SelectClientsNull = {id:0 , name: '-- SELECT CLIENT --'};
        $scope.SelectClient = {};
        $scope.SelectClients = [];
        $scope.site = {};
        $scope.site.country='INDIA';



        //$timeout(function (){angular.element('[ng-model="name"]').focus();});

        $scope.pageSort = 10;


        $scope.calendar = {
            start : false,
            end : false,
        }

        $scope.newShiftItem ={};
        $scope.shiftItems=[];

        $scope.shiftFrom = new Date();
        $scope.shiftTo = new Date();

        $scope.stateNames = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Chandigarh",
            "Dadra and Nagar Haveli","Daman and Diu","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh",
            "Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra",
            "Manipur","Meghalaya","Mizoram","Nagaland","Orissa","Punjab","Pondicherry","Rajasthan",
            "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"];


        $scope.loadProjectsList = function () {
            ProjectComponent.findAll().then(function (data) {
                $scope.projectsList = data;
                /** Ui-select scope **/
                $scope.clients[0] = $scope.allClients;
                //$scope.SelectClients[0] = $scope.SelectClientsNull;

                $scope.loadingStop();
                /* for(var i=0;i<$scope.projectsList.length;i++)
                    {
                        $scope.uiClient[i] = $scope.projectsList[i].name;

                    }*/
                for(var i=0;i<$scope.projectsList.length;i++)
                {
                    $scope.SelectClients[i] = $scope.projectsList[i];

                }

                /** Ui-select scope **/
                for(var i=0;i<$scope.projectsList.length;i++)
                {
                    $scope.clients[i+1] = $scope.projectsList[i];

                }
                $scope.clientDisable = false;
                $scope.clientFilterDisable = false;
            });
        };

        $scope.loadSitesList = function (projectId,region,branch) {
            if(branch){

                SiteComponent.getSitesByBranch(projectId,region,branch).then(function (data) {

                    //console.log('Sites - ');
                    //console.log(data);


                    $scope.sitesList = data;
                });

            }else if(region){

                SiteComponent.getSitesByRegion(projectId,region).then(function (data) {
                    $scope.sitesList = data;

                    //console.log("Sites - ");
                    //console.log(data);
                })

            }else if(projectId && projectId >0){
                //console.log('projectid - ' + projectId);
                DashboardComponent.loadSites(projectId).then(function(data){
                    //console.log('sites ' + JSON.stringify(data));

                    $scope.sitesList = data;
                })
            }else{
                SiteComponent.findAll().then(function (data) {
                    $scope.sitesList = data;

                });
            }

        };

        // Load Clients for selectbox //
        $scope.clienteDisable = true;
        $scope.uiClient = [];
        $scope.getClient = function (search) {
            var newSupes = $scope.uiClient.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }

            return newSupes;
        };



        $scope.selectProject = function(project)
        {
            $scope.searchProject = $scope.projectsList[$scope.uiClient.indexOf(project)];
            //console.log('Project dropdown list:',$scope.searchProject)


        };

        //

        // Load Sites for selectbox //
        $scope.siteDisable = true;
        $scope.uiSite = [];

        $scope.getSite = function (search) {
            var newSupes = $scope.uiSite.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }

            return newSupes;
        }

        $scope.selectSite = function(site)
        {
            if(site){
                $scope.searchSite = $scope.sitesList[$scope.uiSite.indexOf(site)];
                $scope.hideSite = true;

                //console.log('Site dropdown list:',$scope.searchSite)


            }
        }

        $scope.addProject = function (selectedProject) {

            //console.log(selectedProject);
            $scope.selectedProject = $scope.projectsList[$scope.uiClient.indexOf(selectedProject)]
            $scope.edit = false;
            //console.log($scope.selectedProject);

            $scope.loadRegions($scope.selectedProject.id);
            // $scope.loadBranch($scope.selectedProject.id);
        }
        //

        //Load Regions for selectbox

        $scope.regionDisable = true;
        $scope.uiRegion = [];

        $scope.getRegion = function (search) {
            var newSupes = $scope.uiRegion.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }

            return newSupes;
        };

        $scope.selectRegion = function (region, callback) {
            $scope.selectedRegion = $scope.regionList[$scope.uiRegion.indexOf(region)];

            //console.log('Region dropdown list:',$scope.searchRegion)
            //callback();

        }

        //

        //Load Branches for selectbox

        $scope.branchDisable = true;
        $scope.uiBranch = [];

        $scope.getBranch = function (search) {
            var newSupes = $scope.uiBranch.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }

            return newSupes;
        };

        $scope.selectBranch = function (branch) {
            $scope.selectedBranch = $scope.branchList[$scope.uiBranch.indexOf(branch)];

            //console.log('Branch dropdown list:',$scope.searchBranch)

        }

        $scope.markSelection = function (project) {
            $scope.selectedProject = project;
        }
        //

        //Filter
        $scope.filter = false;
        $scope.clientFilterDisable = true;
        $scope.regionFilterDisable = true;
        $scope.branchFilterDisable = true;
        $scope.siteFilterDisable = true;
        $scope.regionSpin = false;
        $scope.branchSpin = false;
        $scope.siteSpin = false;

        /*$scope.loadDepSites = function (searchProject) {
            if(searchProject){
              $scope.siteFilterDisable = true;
              $scope.uiSite.splice(0,$scope.uiSite.length);
              $scope.clearField = false;
              $scope.searchRegion = null;
              $scope.searchBranch = null;
              $scope.searchSite = null;
              $scope.hideRegion = false;
              $scope.hideBranch = false;
              $scope.hideSite = false;
              if($scope.localStorage)
              {
                  $scope.localStorage.region = null;
                  $scope.localStorage.branch = null;
                  $scope.localStorage.siteName = null;
              }
              $scope.searchCriteria.siteName = null;
              $scope.searchCriteria.region = null;
              $scope.searchCriteria.branch = null;
              $scope.siteSpin = true;
              $scope.filter = false;
              $scope.searchProject = $scope.projectsList[$scope.uiClient.indexOf(searchProject)];
              if(jQuery.isEmptyObject($scope.selectedProject) == false) {
                     var depProj=$scope.selectedProject.id;
              }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                      var depProj=$scope.searchProject.id;
              }else{
                      var depProj=0;
              }


              SiteComponent.getRegionByProject(depProj).then(function (data) {

                //console.log("Regions of project "+depProj);
                //console.log(data);


              });

              ProjectComponent.findSites(depProj).then(function (data) {
                  $scope.selectedSite = null;
                  $scope.sitesList = data;
                  for(var i=0;i<$scope.sitesList.length;i++)
                  {
                      $scope.uiSite[i] = $scope.sitesList[i].name;
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
                    $scope.sitesLists[0] = $scope.allSites;

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
                }else if(jQuery.isEmptyObject($scope.addRegionProject) == false){
                    var depProj=$scope.addRegionProject.id;
                }else{
                    var depProj=0;
                }

                ProjectComponent.findSites(depProj).then(function (data) {

                    $scope.sitesList = data;
                    $scope.sitesLists = [];
                    $scope.sitesListOne.selected = null;
                    $scope.sitesLists[0] = $scope.allSites;

                    for(var i=0;i<$scope.sitesList.length;i++)
                    {
                        $scope.sitesLists[i+1] = $scope.sitesList[i];
                    }
                    $scope.siteFilterDisable = false;
                    $scope.siteSpin = false;
                });
            }

        };

        $scope.initCalender = function(){
            demo.initFormExtendedDatetimepickers();
        }

        $scope.initCalender();

        $('#shiftFrom').on('dp.change', function(e){


            // //console.log('shiftFrom', e.date._d);



            if(e.date._d) {
                $scope.newShiftItem.startTime = $filter('date')(e.date._d, 'HH:mm');
                $scope.newShiftItem.startTimeDup = $filter('date')(e.date._d, 'hh:mm a');
            }


        });


        $('#shiftTo').on('dp.change', function(e){


            // //console.log('shiftTo', e.date._d);


            if(e.date._d) {
                $scope.newShiftItem.endTime = $filter('date')(e.date._d, 'HH:mm');
                $scope.newShiftItem.endTimeDup = $filter('date')(e.date._d, 'hh:mm a');
            }

        });




        $scope.valid= null;

        $scope.conform = function(text,validation)
        {

            //console.log($scope.selectedProject)

            $rootScope.conformText = text;
            $scope.valid = validation;
            $('#conformationModal').modal();

        }

        $rootScope.back = function (text) {
            if(text == 'cancel' || text == 'back'){
                /** @reatin - retaining scope value.**/
                $rootScope.retain=1;
                $scope.cancelSite();
            }else if(text == 'save'){
                $scope.saveSite($scope.valid);
            }else if(text == 'update'){
                /** @reatin - retaining scope value.**/
                $rootScope.retain=1;
                $scope.updateSite($scope.valid);
            }
        };

        $scope.saveLoad = false;

        $scope.saveSite = function (validation) {
            $scope.saveLoad = true;
            if(validation){
                return false;
            }

            $scope.error = null;
            $scope.success = null;
            $scope.errorSitesExists = null;
            $scope.errorProject = null;
            if($scope.SelectClient.selected){
                $scope.selectedProject = $scope.SelectClient.selected;
            }else{
                $scope.selectedProject = null;
            }
            if(!$scope.selectedProject){
                $scope.errorProject = "true";
            }else{

                //console.log($scope.selectedRegion!=null?$scope.selectedRegion:" ");

                $scope.btnDisable = true;
                $scope.site.projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
                //console.log('shifts - ' + JSON.stringify($scope.shiftItems));
                $scope.site.shifts = $scope.shiftItems;
                $scope.site.region = $scope.selectedRegion!=null?$scope.selectedRegion.name:" ";
                $scope.site.branch = $scope.selectedBranch!=null?$scope.selectedBranch.name:" "

                //console.log('To be save site information -- ' , $scope.site);

                SiteComponent.createSite($scope.site).then(function() {
                    $scope.success = 'OK';
                    $scope.saveLoad = false;
                    $scope.showNotifications('top','center','success','Site has been added successfully!!');
                    $scope.selectedProject = null;
                    $scope.loadSites();
                    $location.path('/sites');
                }).catch(function (response) {
                    $scope.success = null;
                    $scope.saveLoad = false;

                    //console.log('Error - ')
                    //console.log(response.data);
                    //console.log('status - '+ response.status + ' , message - ' + response.data.message);

                    if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                        $scope.errorSitesExists = 'ERROR';
                        $scope.showNotifications('top','center','danger','Site already exists');


                        //console.log($scope.errorSitesExists);

                    } else {
                        $scope.showNotifications('top','center','danger','Unable to add site. Please try again later..');
                        $scope.error = 'ERROR';
                    }
                    $scope.btnDisable = false;
                });
            }

        };


        $scope.sStatus = false;
        $scope.eStatus = false;
        $scope.dupStatus = false;



        $scope.addShiftItem = function(event) {

            if(jQuery.isEmptyObject($scope.newShiftItem) == false){
                //alert($scope.newShiftItem.endTime);
                if(!$scope.newShiftItem.startTime){
                    $scope.sStatus = true;
                    $scope.eStatus = false;

                    return;
                }
                else if(!$scope.newShiftItem.endTime){
                    $scope.eStatus = true;
                    $scope.sStatus = false;

                    return;
                }else{

                    //console.log(shiftFrom,shiftTo);

                    event.preventDefault();

                    if($scope.shiftItems.length > 0){

                        for(var i=0; i < $scope.shiftItems.length;i++){

                            var oldshiftStart = $scope.shiftItems[i].startTime;
                            var oldshiftEnd = $scope.shiftItems[i].endTime;

                            if((oldshiftStart == $scope.newShiftItem.startTime)
                                && (oldshiftEnd == $scope.newShiftItem.endTime)){

                                $scope.showNotifications('top','center','warning','This shift time already available..');
                                $scope.dupStatus = true;
                                return;
                            }

                            $scope.dupStatus = false;
                        }
                    }
                    //console.log('new shift item - ' + JSON.stringify($scope.newShiftItem));
                    $scope.shiftItems.push($scope.newShiftItem);
                    //console.log('shiftItems - '+ JSON.stringify($scope.shiftItems));
                    $scope.newShiftItem = {};
                    $scope.sStatus = false;
                    $scope.eStatus = false;
                    $('input#shiftFrom').data('DateTimePicker').clear();
                    $('input#shiftTo').data('DateTimePicker').clear();
                }
            }else{
                $scope.sStatus = false;
                $scope.eStatus = false;


            }
        }

        $scope.removeItem = function(ind) {
            $scope.shiftItems.splice(ind,1);
        }


        $scope.cancelSite = function () {

            $location.path('/sites');

        };

        $scope.loadSites = function () {
            $scope.clearFilter();
            $scope.search();
        };

        $scope.refreshPage = function(){
            $scope.loadSites();
        }


        $scope.loadSite = function() {
            if(parseInt($stateParams.id) > 0){
                var siteId = parseInt($stateParams.id);
                SiteComponent.findOne(siteId).then(function (data) {
                    $scope.site = data;
                    if($scope.site){

                        /** add region and branch scopes **/
                        $scope.regionSelectedProject = {};
                        $scope.branchSelectedProject = {};
                        $scope.selectedRegionOne = {};

                        //console.log('$scope.site.shifts - '+$scope.site.shifts);

                        $scope.selectedProject = {id:$scope.site.projectId,name:$scope.site.projectName};
                        $scope.SelectClient.selected = $scope.selectedProject;


                        /** add region and branch scopes **/
                        $scope.regionSelectedProject = $scope.selectedProject;
                        $scope.branchSelectedProject = $scope.selectedProject;
                        $scope.regions = null;
                        $scope.loadRegions($scope.selectedProject.id);
                        $scope.selectedRegionOne= {name:$scope.site.region};

                        SiteComponent.getRegionByProject($scope.selectedProject.id).then(function (response) {

                            $scope.regionList = response;

                        });
                        $scope.selectedRegion= {name:$scope.site.region};
                        $scope.selectedRegionOne = $scope.selectedRegion;
                        SiteComponent.getBranchByProjectAndRegionName($scope.selectedProject.id,$scope.selectedRegion.name).then(function (data) {
                            $scope.branchList = data;
                        });
                        $scope.selectedBranch= {name:$scope.site.branch};
                        $scope.shiftItems = $scope.site.shifts;
                        $scope.loadRegions($scope.site.projectId, function(resp) {
                            $scope.selectRegion($scope.site.region, function(resp) {
                                $scope.loadBranch($scope.site.projectId, function(resp) {
                                    $scope.selectBranch($scope.site.branch);
                                })
                            });
                        });

                        //console.log('Selected project' , $scope.selectedProject);
                        $scope.title = $scope.site.name;

                        // Shift time HH:MM
                        //console.log(data);
                        for(var i=0;i<$scope.shiftItems.length;i++) {
                            //console.log($scope.shiftItems[i].startTime.length);
                            var start = $scope.shiftItems[i].startTime.split(':');
                            //console.log(start);
                            if(start[0].length == 1)
                            {
                                //console.log("Yes");

                                start[0] = '0'+start[0];
                                $scope.shiftItems[i].startTime = start[0] +':'+ start[1];
                                if(start[1].length == 1)
                                {

                                    if(start[1]==0)
                                    {
                                        start[1] = '00';
                                        $scope.shiftItems[i].startTime = start[0] +':'+ start[1];
                                    }
                                    else {
                                        start[1] = '0'+start[1];
                                        $scope.shiftItems[i].startTime = start[0] +':'+ start[1];
                                    }


                                }
                            }
                            else if(start[1].length == 1)
                            {
                                if(start[1]==0)
                                {
                                    start[1] = '00';
                                    $scope.shiftItems[i].startTime = start[0] +':'+ start[1];
                                }
                                else {
                                    start[1] = '0'+start[1];
                                    $scope.shiftItems[i].startTime = start[0] +':'+ start[1];
                                }
                            }
                            else
                            {
                                $scope.shiftItems =$scope.site.shifts;
                            }


                            var end =  $scope.shiftItems[i].endTime.split(':');

                            //console.log(end)

                            if(end[0].length == 1)
                            {
                                end[0] = '0'+end[0];
                                $scope.shiftItems[i].endTime = end[0] +':'+ end[1];
                                if(end[1].length == 1)
                                {
                                    if(end[1]==0)
                                    {
                                        end[1] = '00';
                                        $scope.shiftItems[i].endTime = end[0] +':'+ end[1];
                                    }
                                    else {
                                        end[1] = '0'+start[1];
                                        $scope.shiftItems[i].endTime = end[0] +':'+ end[1];
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
                                        $scope.shiftItems[i].endTime = end[0] +':'+ end[1];
                                    }
                                    else {
                                        end[1] = '0'+start[1];
                                        $scope.shiftItems[i].endTime = end[0] +':'+ end[1];
                                    }
                                }
                            }
                            else
                            {
                                $scope.shiftItems = $scope.site.shifts;
                            }


                        }
                        //

                        //$scope.loadSelectedProject($scope.site.projectId);
                    }else{
                        $location.path('/sites');
                    }
                });
            }else{
                $location.path('/sites');
            }
        };

        $scope.loadSelectedProject = function(projectId) {
            ProjectComponent.findOne(projectId).then(function (data) {
                $scope.selectedProject = data;
                $scope.edit = true;
            });
        };

        $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
        }


        $scope.updateSite = function (validation) {
            if(parseInt($stateParams.id) > 0){
                $scope.saveLoad = true;

                //console.log("=======Update=========")

                if(validation){
                    return false;
                }
                $scope.error = null;
                $scope.success = null;
                $scope.errorProject = null;
                if(!$scope.selectedProject){
                    $scope.errorProject = "true";

                    //console.log("=======Update=========")
                }else{
                    $scope.btnDisable = true;
                    //console.log("update site");
                    //console.log($scope.site);

                    if($scope.SelectClient.selected){
                        $scope.selectedProject = $scope.SelectClient.selected;
                    }
                    $scope.site.projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
                    $scope.site.shifts = $scope.shiftItems;
                    $scope.site.region = $scope.selectedRegion!=null?$scope.selectedRegion.name:" ";
                    $scope.site.branch = $scope.selectedBranch!=null?$scope.selectedBranch.name:" "
                    SiteComponent.updateSite($scope.site).then(function() {
                        $scope.success = 'OK';
                        $scope.showNotifications('top','center','success','Site has been updated successfully!!');
                        $scope.loadSites();
                        $location.path('/sites');
                    }).catch(function (response) {
                        $scope.success = null;
                        // //console.log('Error - '+ response.data);
                        // //console.log('status - '+ response.status + ' , message - ' + response.data.message);

                        if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                            $scope.$apply(function() {
                                $scope.errorSitesExists = 'ERROR';
                                $scope.success = 'OK';
                                $scope.showNotifications('top','center','danger','Site already exists');
                            })

                            // //console.log($scope.errorSitesExists);

                        } else {
                            $scope.error = 'ERROR';
                            $scope.showNotifications('top','center','danger','Unable to update site,please try again later.');
                        }
                        $scope.saveLoad = false;
                        $scope.btnDisable = false;
                    });
                }
            }else{
                $location.path('/sites');
            }
        };

        $scope.deleteConfirm = function (site){
            $scope.confirmSite = site;
        }

        $scope.deleteSite = function (site) {
            SiteComponent.deleteSite($scope.confirmSite);
            $scope.success = 'OK';
            $state.reload();
        };

        var that =  $scope;

        $scope.openCalendar = function(e,cmp) {
            e.preventDefault();
            e.stopPropagation();

            that.calendar[cmp] = true;
        };

        $scope.isActiveAsc = '';
        $scope.isActiveDesc = 'id';

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveAsc = field;
            $scope.isActiveDesc = '';
            $scope.isAscOrder = true;
            //$scope.search();
            $scope.loadSites();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
            //$scope.search();
            $scope.loadSites();
        }

        $scope.searchFilter = function () {
            $('.BasicFilterModal.in').modal('hide');
            $scope.setPage(1);
            $scope.search();
        }


        $scope.search = function () {
            $scope.noData = false;
            var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
            if(!$scope.searchCriteria) {
                var searchCriteria = {
                    currPage : currPageVal
                }
                $scope.searchCriteria = searchCriteria;
            }

            $scope.searchCriteria.currPage = currPageVal;
            $scope.searchCriteria.findAll = false;

            $scope.searchCriteria.fromDate = new Date;
            $scope.searchCriteria.toDate = new Date;

            EmployeeComponent.getEmpRelievers($scope.searchCriteria).then(function (data) {
                console.log(data);
                $scope.relievers = data.transactions;
                $scope.sitesLoader = true;

                /*
                ** Call pagination  main function **
                */
                $scope.pager = {};
                $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                $scope.totalCountPages = data.totalCount;

                // //console.log("Pagination",$scope.pager);
                // //console.log($scope.sites);


                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;

                if($scope.relievers && $scope.relievers.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.relievers.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10;
                    $scope.noData = false;

                }else{
                    $scope.noData = true;
                }


            });

        };



        $scope.clearFilter = function() {
            $scope.clearField = true;
            $scope.filter = false;
            $scope.siteFilterDisable = true;
            $scope.regionFilterDisable = true;
            $scope.branchFilterDisable = true;
            $scope.selectedSite = null;
            $scope.sitesList = null;

            /** Ui-select scopes **/
            $scope.client.selected = null;
            $scope.sitesLists =  [];
            $scope.sitesListOne.selected =  null;
            $scope.regionsLists =  [];
            $scope.regionsListOne.selected =  null;
            $scope.branchsLists =  [];
            $scope.branchsListOne.selected =  null;

            $scope.selectedProject = null;
            $scope.searchProject = null;
            $scope.searchSite = null;
            $scope.searchCriteria = {};
            $scope.localStorage = null;
            $rootScope.searchCriteriaSite = null;

            /* Root scope (search criteria) */
            $rootScope.searchFilterCriteria.isDashboard = false;

            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }

            //$scope.search();
        };


        //init load
        $scope.initLoad = function(){
            $scope.loadPageTop();
            //$scope.loadSites();
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

        $scope.loadRegions = function (projectId, callback) {
            SiteComponent.getRegionByProject(projectId).then(function (response) {

                $scope.regions = response;



            })
        };





        /** UI select (Region List) **/
        $scope.loadRegionsList = function (projectId, callback) {

            /** add region and branch scopes **/
            $scope.regionSelectedProject = {};
            $scope.branchSelectedProject = {};
            $scope.selectedRegionOne = {};
            $scope.regions = null;
            $scope.loadRegions(projectId.id);
            $scope.regionSelectedProject = projectId;
            $scope.branchSelectedProject = projectId;

            $scope.regionSpin = true;
            $scope.branchsLists = [];
            $scope.branchsListOne.selected = null;
            $scope.branchFilterDisable = true;
            $scope.selectedBranch = {};
            SiteComponent.getRegionByProject(projectId.id).then(function (response) {
                // //console.log(response);
                $scope.regionList = response;
                $scope.regionsLists = [];
                $scope.regionsListOne.selected = null;
                $scope.regionsLists[0] = $scope.allRegions;


                for(var i=0;i<$scope.regionList.length;i++)
                {
                    $scope.regionsLists[i+1] = $scope.regionList[i];
                }

                // //console.log('region list : ' + JSON.stringify($scope.regionList));
                $scope.regionSpin = false;
                $scope.regionFilterDisable = false;
                //callback();
            })
        };


        $scope.loadBranch = function (projectId, callback) {

            if(projectId){

                if($scope.selectedRegion){

                    /** add region and branch scopes **/
                    $scope.selectedRegionOne = {};
                    $scope.selectedRegionOne = $scope.selectedRegion;


                    // //console.log($scope.selectedRegion);
                    SiteComponent.getBranchByProject(projectId,$scope.selectedRegion.id).then(function (response) {
                        //console.log(response);
                        $scope.branchList = response;
                        if($scope.branchList) {
                            for(var i = 0; i < $scope.branchList.length; i++) {
                                $scope.uiBranch.push($scope.branchList[i].name);
                            }
                        }
                        // //console.log('branch list : ' + JSON.stringify($scope.branchList));

                        $scope.getSitesBYRegionOrBranch(projectId,$scope.selectedRegion.name,null);
                        //callback();



                    })

                }


            }

        };

        /*** UI select (Branch List) **/
        $scope.loadBranchList = function (projectId, callback) {

            if(projectId){

                if($scope.regionsListOne.selected){
                    //console.log($scope.regionsListOne.selected);
                    $scope.branchSpin = true;
                    SiteComponent.getBranchByProject(projectId,$scope.regionsListOne.selected.id).then(function (response) {
                        //console.log(response);
                        $scope.branchList = response;
                        if($scope.branchList) {
                            $scope.branchsLists = [];
                            $scope.branchsListOne.selected = null;
                            $scope.branchsLists[0] = $scope.allBranchs;

                            for(var i=0;i<$scope.branchList.length;i++)
                            {
                                $scope.branchsLists[i+1] = $scope.branchList[i];
                            }
                            /* if($scope.branchList) {
                                        for(var i = 0; i < $scope.branchList.length; i++) {
                                            $scope.uiBranch.push($scope.branchList[i].name);
                                        }*/
                            $scope.branchSpin = false;
                            $scope.branchFilterDisable = false;
                        }
                        else{
                            //console.log('branch list : ' + JSON.stringify($scope.branchList));
                            $scope.getSitesBYRegionOrBranch(projectId,$scope.regionsListOne.selected.name,null);
                            $scope.branchSpin = false;
                            $scope.branchFilterDisable = false;
                            //callback();
                        }

                    })

                }

            }
        };

        $scope.getSitesBYRegionOrBranch = function (projectId, region, branch) {
            if(branch){
                $scope.siteFilterDisable = true;
                $scope.siteSpin = true;
                SiteComponent.getSitesByBranch(projectId,region,branch).then(function (data) {
                    $scope.selectedSite = null;
                    $scope.sitesList = data;
                    $scope.sitesLists = [];
                    $scope.sitesListOne.selected = null;
                    $scope.sitesLists[0] = $scope.allSites;

                    for(var i=0;i<$scope.sitesList.length;i++)
                    {
                        $scope.sitesLists[i+1] = $scope.sitesList[i];
                    }
                    $scope.siteFilterDisable = false;
                    $scope.siteSpin = false;
                });

            }else if(region){
                $scope.siteFilterDisable = true;
                $scope.siteSpin = true;

                SiteComponent.getSitesByRegion(projectId,region).then(function (data) {
                    $scope.selectedSite = null;
                    $scope.sitesList = data;
                    $scope.sitesLists = [];
                    $scope.sitesListOne.selected = null;
                    $scope.sitesLists[0] = $scope.allSites;

                    for(var i=0;i<$scope.sitesList.length;i++)
                    {
                        $scope.sitesLists[i+1] = $scope.sitesList[i];
                    }
                    $scope.siteFilterDisable = false;
                    $scope.siteSpin = false;
                })

            }/*else if(projectId >0){
                $scope.siteFilterDisable = true;
                $scope.siteSpin = true;
                ProjectComponent.findSites(projectId).then(function (data) {
                    $scope.selectedSite = null;
                    $scope.sitesList = data;
                    $scope.sitesLists = [];
                    $scope.sitesListOne.selected = null;
                    $scope.sitesLists[0] = $scope.allSites;

                    for(var i=0;i<$scope.sitesList.length;i++)
                    {
                        $scope.sitesLists[i+1] = $scope.sitesList[i];
                    }
                    $scope.siteFilterDisable = false;
                    $scope.siteSpin = false;
                });
            }else{

            }*/
        }

        $scope.addRegion = function () {
            if($scope.regionSelectedProject){

                if($scope.clientRegion){

                    $scope.btnDisable = true;

                    // //console.log("Region entered");
                    // //console.log($scope.regionDetails);

                    var region ={
                        name:$scope.clientRegion,
                        projectId:$scope.regionSelectedProject.id
                    };
                    SiteComponent.addRegion(region).then(function () {

                        $scope.region = null;

                        $scope.showNotifications('top','center','success','Region Added Successfully');
                        $scope.loadRegions($scope.regionSelectedProject.id);


                        $scope.btnDisable = false;
                        $scope.clientRegion = null;
                        //$scope.regionSelectedProject = {};
                        $scope.loadRegionsList($scope.regionSelectedProject);
                        $('.rModal.in').modal('hide');

                    }).catch(function (response) {

                        if (response.status === 400 && response.data.errorMessage === 'error.duplicateRecordError') {

                            $scope.showNotifications('top','center','danger', 'Region already exists!.. Please choose another one');
                        } else {
                            $scope.error = 'ERROR';
                            $scope.showNotifications('top','center','danger', 'Region Not Saved!.. Please try again later.');
                        }
                        $scope.btnDisable = false;
                        $scope.clientRegion = null;
                        //$scope.regionSelectedProject = {};
                        $('.rModal.in').modal('hide');
                    });
                }else{

                    // //console.log("Desgination not entered")

                    $scope.showNotifications('top','center','danger','Please enter Region Name...');

                }
            }else{
                $scope.showNotifications('top','center','danger','Please select Client to continue...');
            }


        };


        $scope.addBranch = function () {
            if($scope.branchSelectedProject){

                if($scope.selectedRegionOne){

                    $scope.btnDisable = true;

                    // //console.log($scope.selectedRegion);

                    if($scope.regionBranch){
                        // //console.log("Region entered");
                        // //console.log($scope.branchDetails);

                        var branch ={
                            name:$scope.regionBranch,
                            projectId:$scope.branchSelectedProject.id,
                            regionId: $scope.selectedRegionOne.id
                        };
                        SiteComponent.addBranch(branch).then(function () {
                            $scope.branch= null;

                            $scope.showNotifications('top','center','success','Branch Added Successfully');
                            $scope.loadBranch($scope.branchSelectedProject.id);

                            $scope.btnDisable = false;
                            $scope.regionBranch = null;
                            //$scope.selectedRegionOne = {};
                            //$scope.branchSelectedProject = {};

                            $('.bModal.in').modal('hide');

                        }).catch(function (response) {

                            if (response.status === 400 && response.data.errorMessage === 'error.duplicateRecordError') {

                                $scope.showNotifications('top','center','danger', 'Branch already exists!.. Please choose another one');
                            } else {
                                $scope.error = 'ERROR';
                                $scope.showNotifications('top','center','danger', 'Branch Not Saved!.. Please try again later.');
                            }
                            $scope.btnDisable = false;
                            $scope.regionBranch = null;
                            //$scope.selectedRegionOne = {};
                            //$scope.branchSelectedProject = {};
                            $('.bModal.in').modal('hide');
                        });
                    }else{

                        // //console.log("Branch not entered");

                        $scope.showNotifications('top','center','danger','Please enter Branch Name...');

                    }

                }else{

                    $scope.showNotifications('top','center','danger','Please select Region to continue...');

                }

            }else{
                $scope.showNotifications('top','center','danger','Please select Client to continue...');
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

        //Search Filter Region Load Function

        $scope.regionFilterFunction = function (searchProject){
            $scope.regionSpin = true;
            SiteComponent.getRegionByProject(searchProject.id).then(function (response) {
                //console.log(response);
                $scope.regionList = response;
                $scope.regionsLists = [];
                //$scope.regionsListOne.selected = null;
                $scope.regionsLists[0] = $scope.allRegions;

                for(var i=0;i<$scope.regionList.length;i++)
                {
                    $scope.regionsLists[i+1] = $scope.regionList[i];
                }

                //console.log('region list : ' + JSON.stringify($scope.regionList));
                $scope.regionSpin = false;
                $scope.regionFilterDisable = false;
                //callback();
            });
        };

        //Search Filter Branch Load Function

        $scope.branchFilterFunction = function (searchProject,searchRegion){
            $scope.branchSpin = true;
            SiteComponent.getBranchByProject(searchProject.id,searchRegion.id).then(function (response) {
                // //console.log('branch',response);
                $scope.branchList = response;
                if($scope.branchList) {
                    $scope.branchsLists = [];
                    // $scope.branchsListOne.selected = null;
                    $scope.branchsLists[0] = $scope.allBranchs;

                    for(var i=0;i<$scope.branchList.length;i++)
                    {
                        $scope.branchsLists[i+1] = $scope.branchList[i];
                    }
                    /* if($scope.branchList) {
                                 for(var i = 0; i < $scope.branchList.length; i++) {
                                     $scope.uiBranch.push($scope.branchList[i].name);
                                 }*/
                    $scope.branchSpin = false;
                    $scope.branchFilterDisable = false;
                }
                else{
                    //console.log('branch list : ' + JSON.stringify($scope.branchList));
                    $scope.getSitesBYRegionOrBranch($scope.searchProject.id,$scope.searchRegion.name,null);
                    $scope.branchSpin = false;
                    $scope.branchFilterDisable = false;
                    //callback();
                }

            })
        }

        /*
         * Ui select allow-clear modified function start
         *
         * */


        $scope.clearProject = function($event) {
            $event.stopPropagation();
            $scope.client.selected = undefined;
            $scope.regionsListOne.selected = undefined;
            $scope.branchsListOne.selected = undefined;
            $scope.sitesListOne.selected = undefined;
            $scope.regionFilterDisable = true;
            $scope.branchFilterDisable = true;
            $scope.siteFilterDisable = true;
        };

        $scope.clearRegion = function($event) {
            $event.stopPropagation();
            $scope.regionsListOne.selected = undefined;
            $scope.branchsListOne.selected = undefined;
            $scope.sitesListOne.selected = undefined;
            $scope.branchFilterDisable = true;
            $scope.siteFilterDisable = true;
        };

        $scope.clearBranch = function($event) {
            $event.stopPropagation();
            $scope.branchsListOne.selected = undefined;
            $scope.sitesListOne.selected = undefined;
            $scope.siteFilterDisable = true;
        };

        $scope.clearSite = function($event) {
            $event.stopPropagation();
            $scope.sitesListOne.selected = undefined;

        };


        /*
         * Ui select allow-clear modified function end
         *
         * */


    });