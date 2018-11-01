'use strict';

angular.module('timeSheetApp')
    .controller('SiteController', function ($rootScope, $scope, $state, $timeout,$filter,
        ProjectComponent, SiteComponent,$http,$stateParams,$location,PaginationComponent,
        getLocalStorage) {
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

        /** Ui-select scopes **/
        $scope.allClients = {id:0 , name: '-- ALL CLIENTS --'};
        $scope.client = {};
        $scope.clients = [];
        $scope.allSites = {id:0 , name: '-- ALL SITES --'};
        $scope.sitesListOne = {};
        $scope.sitesLists = [];
        $scope.sitesListOne.selected =  null;
        $scope.allRegions = {id:0 , name: '-- ALL REGIONS --'};
        $scope.regionsListOne = {};
        $scope.regionsLists = [];
        $scope.regionsListOne.selected =  null;
        $scope.allBranchs = {id:0 , name: '-- ALL BRANCHES --'};
        $scope.branchsListOne = {};
        $scope.branchsLists = [];
        $scope.branchsListOne.selected =  null;
        //$scope.SelectClientsNull = {id:0 , name: '-- SELECT CLIENT --'};
        $scope.SelectClient = {};
        $scope.SelectClients = [];


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
        "Sikkim","Tamil Nadu","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"];


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
                     console.log('Sites - ');
                     console.log(data);
                     $scope.sitesList = data;
                 });

             }else if(region){

                 SiteComponent.getSitesByRegion(projectId,region).then(function (data) {
                     $scope.sitesList = data;
                     console.log("Sites - ");
                     console.log(data);
                 })

             }else if(projectId && projectId >0){
                 console.log('projectid - ' + projectId);
                 DashboardComponent.loadSites(projectId).then(function(data){
                     console.log('sites ' + JSON.stringify(data));
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
            console.log('Project dropdown list:',$scope.searchProject)
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
               console.log('Site dropdown list:',$scope.searchSite)
             }
        }

        $scope.addProject = function (selectedProject) {
            console.log(selectedProject);
            $scope.selectedProject = $scope.projectsList[$scope.uiClient.indexOf(selectedProject)]
            $scope.edit = false;
            console.log($scope.selectedProject);
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
            console.log('Region dropdown list:',$scope.searchRegion)
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
            console.log('Branch dropdown list:',$scope.searchBranch)
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
              console.log("Regions of project "+depProj);
              console.log(data);

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
            if(searchProject){
              $scope.siteSpin = true;
              $scope.searchProject = searchProject;
              if(jQuery.isEmptyObject($scope.searchProject) == false && $scope.searchProject.id == 0){
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
	              }else if(jQuery.isEmptyObject($scope.searchProject) == false){
	                      var depProj=$scope.searchProject.id;
	              }else{
	                      var depProj=0;
	              }

	              ProjectComponent.findSites(depProj).then(function (data) {
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
              }
            }

            };

        $scope.initCalender = function(){
            demo.initFormExtendedDatetimepickers();
        }

        $scope.initCalender();

        $('#shiftFrom').on('dp.change', function(e){

            console.log('shiftFrom', e.date._d);

            if(e.date._d) {
                $scope.newShiftItem.startTime = $filter('date')(e.date._d, 'HH:mm');
                $scope.newShiftItem.startTimeDup = $filter('date')(e.date._d, 'hh:mm a');
            }


        });


        $('#shiftTo').on('dp.change', function(e){

            console.log('shiftTo', e.date._d);

            if(e.date._d) {
                $scope.newShiftItem.endTime = $filter('date')(e.date._d, 'HH:mm');
                $scope.newShiftItem.endTimeDup = $filter('date')(e.date._d, 'hh:mm a');
            }

        });




        $scope.valid= null;

        $scope.conform = function(text,validation)
        {
            console.log($scope.selectedProject)
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
	        	    console.log($scope.selectedRegion!=null?$scope.selectedRegion:" ");
	        	    $scope.btnDisable = true;
	        		$scope.site.projectId = $scope.selectedProject ? $scope.selectedProject.id : 0;
	        		console.log('shifts - ' + JSON.stringify($scope.shiftItems));
	        		$scope.site.shifts = $scope.shiftItems;
	        		$scope.site.region = $scope.selectedRegion!=null?$scope.selectedRegion.name:" ";
	        		$scope.site.branch = $scope.selectedBranch!=null?$scope.selectedBranch.name:" "
                    console.log($scope.site);
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
	                    console.log('Error - '+ response.data);
	                    console.log('status - '+ response.status + ' , message - ' + response.data.message);
	                    if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
	                            $scope.errorSitesExists = 'ERROR';
	                        $scope.showNotifications('top','center','danger','Site already exists');

	                        console.log($scope.errorSitesExists);
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
                    console.log(shiftFrom,shiftTo);
            		event.preventDefault();

                    if($scope.shiftItems.length > 0){

                        for(var i=0; i < $scope.shiftItems.length;i++){

                            var oldshiftStart = $scope.shiftItems[i].startTime;
                            var oldshiftEnd = $scope.shiftItems[i].endTime;

                            if((oldshiftStart == $scope.newShiftItem.startTime)
                                && (oldshiftEnd == $scope.newShiftItem.endTime)){
                                $scope.dupStatus = true;
                                return;
                            }

                            $scope.dupStatus = false;
                        }
                    }
            		console.log('new shift item - ' + JSON.stringify($scope.newShiftItem));
            		$scope.shiftItems.push($scope.newShiftItem);
            		console.log('shiftItems - '+ JSON.stringify($scope.shiftItems));
            		$scope.newShiftItem = {};
                    $scope.sStatus = false;
                    $scope.eStatus = false;
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
                        console.log('$scope.site.shifts - '+$scope.site.shifts);
                        $scope.selectedProject = {id:$scope.site.projectId,name:$scope.site.projectName};
                        $scope.SelectClient.selected = $scope.selectedProject;
                        $scope.selectedRegion= {name:$scope.site.region};
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
                        console.log('Selected project' , $scope.selectedProject);
                        $scope.title = $scope.site.name;

                        // Shift time HH:MM
                        console.log(data);
                        for(var i=0;i<$scope.shiftItems.length;i++) {
                            console.log($scope.shiftItems[i].startTime.length);
                            var start = $scope.shiftItems[i].startTime.split(':');
                            console.log(start);
                            if(start[0].length == 1)
                            {
                                console.log("Yes");
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
                            console.log(end)
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
                console.log("=======Update=========")
                if(validation){
                    return false;
                }
                $scope.error = null;
                $scope.success = null;
                $scope.errorProject = null;
                if(!$scope.selectedProject){
                    $scope.errorProject = "true";
                    console.log("=======Update=========")
                }else{
                    $scope.btnDisable = true;
                    console.log("update site");
                    console.log($scope.site);
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
                        // console.log('Error - '+ response.data);
                        // console.log('status - '+ response.status + ' , message - ' + response.data.message);

                        if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                            $scope.$apply(function() {
                                $scope.errorSitesExists = 'ERROR';
                                $scope.success = 'OK';
                                $scope.showNotifications('top','center','danger','Site already exists');
                            })
                            console.log($scope.errorSitesExists);
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

        $scope.isActiveAsc = 'id';
        $scope.isActiveDesc = '';

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
        	if($scope.regionsListOne.selected && $scope.regionsListOne.selected.id !=0){
        		$scope.searchRegion = $scope.regionsListOne.selected;
        	}else{
        	   $scope.searchRegion = null;
        	}
        	if($scope.branchsListOne.selected && $scope.branchsListOne.selected.id !=0){
        		$scope.searchBranch = $scope.branchsListOne.selected;
        	}else{
        	   $scope.searchBranch = null;
        	}
        	console.log('Selected  project -' , JSON.stringify($scope.searchProject) + '' +$scope.searchSite);


        	if(!$scope.searchSite && !$scope.searchProject) {
        		if($rootScope.searchCriteriaSite) {
            		$scope.searchCriteria = $rootScope.searchCriteriaSite;
        		}else {
        			$scope.searchCriteria.findAll = true;
        		}
        	}else if(($scope.searchSite) || ($scope.searchProject)) {
        		$scope.searchCriteria.findAll = false;
	        	if($scope.searchSite) {
		        	$scope.searchCriteria.siteId = $scope.searchSite.id;
                    $scope.searchCriteria.siteName = $scope.searchSite.name;
		        	if(!$scope.searchCriteria.siteId) {
		        		$scope.searchCriteria.siteName = $scope.searchSite.name;
		        	}else {
			        	$scope.searchCriteria.siteName = $scope.searchSite.name;
		        	}
		        	console.log('selected site id ='+ $scope.searchCriteria.siteId);
	        	}else {
	        		$scope.searchCriteria.siteId = 0;
	        		$scope.searchCriteria.siteName = null;
	        	}

	        	if($scope.searchProject) {
		        	$scope.searchCriteria.projectId = $scope.searchProject.id;
                    $scope.searchCriteria.projectName = $scope.searchProject.name;
		        	if(!$scope.searchCriteria.projectId) {
		        		$scope.searchCriteria.projectName = $scope.searchProject.name;
		        		console.log('selected project name ='+ $scope.searchProject + ', ' +$scope.searchCriteria.projectName);
		        	}
		        	console.log('selected project id ='+ $scope.searchCriteria.projectId);
	        	}else {
	        		$scope.searchCriteria.projectId = 0;
	        		$scope.searchCriteria.projectName = null;
	        	}
	        	
	        	if($scope.searchRegion) {
		        	$scope.searchCriteria.regionId = $scope.searchRegion.id;
                    $scope.searchCriteria.regionName = $scope.searchRegion.name;
		        	if(!$scope.searchCriteria.regionId) {
		        		$scope.searchCriteria.regionName = $scope.searchRegion.name;
		        		console.log('selected region name ='+ $scope.searchRegion + ', ' +$scope.searchCriteria.regionName);
		        	}
		        	console.log('selected region id ='+ $scope.searchCriteria.regionId);
	        	}else {
	        		$scope.searchCriteria.regionId = 0;
	        		$scope.searchCriteria.regionName = null;
	        	}
	        	
	        	if($scope.searchBranch) {
		        	$scope.searchCriteria.branchId = $scope.searchBranch.id;
                    $scope.searchCriteria.branchName = $scope.searchBranch.name;
		        	if(!$scope.searchCriteria.branchId) {
		        		$scope.searchCriteria.branchName = $scope.searchBranch.name;
		        		console.log('selected branch name ='+ $scope.searchBranch + ', ' +$scope.searchCriteria.branchName);
		        	}
		        	console.log('selected branch id ='+ $scope.searchCriteria.branchId);
	        	}else {
	        		$scope.searchCriteria.branchId = 0;
	        		$scope.searchCriteria.branchName = null;
	        	}

        	}
        	console.log($scope.searchCriteria);

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
                $scope.sites = '';
                $scope.sitesLoader = false;
                $scope.loadPageTop();

                 /* Localstorage (Retain old values while edit page to list) start */

                 if($rootScope.retain == 1){
                    $scope.localStorage = getLocalStorage.getSearch();
                    console.log('Local storage---',$scope.localStorage);

                    if($scope.localStorage){
                            $scope.filter = true;
                            $scope.pages.currPage = $scope.localStorage.currPage;
                            if($scope.localStorage.projectId){
                                $scope.searchProject = {id:$scope.localStorage.projectId,name:$scope.localStorage.projectName};
                                $scope.client.selected = $scope.searchProject;
                                //$scope.loadDepSitesList($scope.client.selected);
                                ProjectComponent.findSites($scope.searchProject.id).then(function (data) {
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
                             }else{
                                $scope.searchProject = null;
                                $scope.client.selected = $scope.searchProject;
                             }
                            if($scope.localStorage.regionId){
                                $scope.searchRegion = {id:$scope.localStorage.regionId,name:$scope.localStorage.regionName};
                                $scope.regionsListOne.selected = $scope.searchRegion;
                                $scope.regionSpin = true;
                                SiteComponent.getRegionByProject($scope.searchProject.id).then(function (response) {
                                    console.log(response);
                                    $scope.regionList = response;
                                    $scope.regionsLists = [];
                                    //$scope.regionsListOne.selected = null;
                                    $scope.regionsLists[0] = $scope.allRegions;

                                    for(var i=0;i<$scope.regionList.length;i++)
                                    {
                                        $scope.regionsLists[i+1] = $scope.regionList[i];
                                    }
                                    
                                    console.log('region list : ' + JSON.stringify($scope.regionList));
                                    $scope.regionSpin = false;
                                    $scope.regionFilterDisable = false;
                                    //callback();
              	              });
                             }else{
                                $scope.searchRegion = null;
                                $scope.regionsListOne.selected = $scope.searchRegion;
                             }
                            if($scope.localStorage.branchId){
                            	$scope.searchBranch = {id:$scope.localStorage.branchId,name:$scope.localStorage.branchName};
                                $scope.branchsListOne.selected = $scope.searchBranch;
                                $scope.branchSpin = true;
	                            SiteComponent.getBranchByProject($scope.searchProject.id,$scope.searchRegion.id).then(function (response) {
	                                console.log('branch',response);
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
	                                	console.log('branch list : ' + JSON.stringify($scope.branchList));
	                                    $scope.getSitesBYRegionOrBranch($scope.searchProject.id,$scope.searchRegion.name,null);
	                                    $scope.branchSpin = false;
                                        $scope.branchFilterDisable = false;
	                                    //callback();
	                                }
	
	                            })

                            }else{
                                $scope.searchBranch = null;
                                $scope.branchsListOne.selected = $scope.searchBranch;
                             }
                             if($scope.localStorage.siteId){
                               $scope.searchSite = {id:$scope.localStorage.siteId,name:$scope.localStorage.siteName};
                               $scope.sitesListOne.selected = $scope.searchSite;
                               $scope.siteFilterDisable=false;
                             }else{
                                $scope.searchSite = null;
                                $scope.sitesListOne.selected = $scope.searchSite;
                             }

                    }

                    $rootScope.retain = 0;

                    var searchCriteras  = $scope.localStorage;
                 }else{

                    var searchCriteras  = $scope.searchCriteria;
                 }

                 /* Localstorage (Retain old values while edit page to list) end */



            SiteComponent.search(searchCriteras).then(function (data) {
                $scope.sites = data.transactions;
                $scope.sitesLoader = true;


                 /** retaining list search value.**/
                getLocalStorage.updateSearch(searchCriteras);


                 /*
                    ** Call pagination  main function **
                */
                 $scope.pager = {};
                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                 $scope.totalCountPages = data.totalCount;

                 console.log("Pagination",$scope.pager);
                 console.log($scope.sites);

                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;

                if($scope.sites && $scope.sites.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.sites.length;
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
                console.log(response);
                $scope.regionList = response;
                for(var i=0;i<$scope.regionList.length; i++) {
	            		$scope.uiRegion.push($scope.regionList[i].name);
	            }
                
                console.log('region list : ' + JSON.stringify($scope.regionList));
                //callback();
            })
        };
        
        /*** UI select (Region List) **/
        $scope.loadRegionsList = function (projectId, callback) {
        	$scope.regionSpin = true;
            SiteComponent.getRegionByProject(projectId).then(function (response) {
                console.log(response);
                $scope.regionList = response;
                $scope.regionsLists = [];
                $scope.regionsListOne.selected = null;
                $scope.regionsLists[0] = $scope.allRegions;

                for(var i=0;i<$scope.regionList.length;i++)
                {
                    $scope.regionsLists[i+1] = $scope.regionList[i];
                }
                
                console.log('region list : ' + JSON.stringify($scope.regionList));
                $scope.regionSpin = false;
                $scope.regionFilterDisable = false;
                //callback();
            })
        };
        
        $scope.loadBranch = function (projectId, callback) {
        		
            if(projectId){

                if($scope.selectedRegion){
                    console.log($scope.selectedRegion);
                    SiteComponent.getBranchByProject(projectId,$scope.selectedRegion.id).then(function (response) {
                        console.log(response);
                        $scope.branchList = response;
                        if($scope.branchList) {
                        		for(var i = 0; i < $scope.branchList.length; i++) {
                        			$scope.uiBranch.push($scope.branchList[i].name);
                        		}
                        }	
                        console.log('branch list : ' + JSON.stringify($scope.branchList));
                        $scope.getSitesBYRegionOrBranch(projectId,$scope.selectedRegion.name,null);
                        //callback();



                    })

                }else{
                    $scope.showNotifications('top','center','danger','Please Select Region to continue...');

                }

            }else{
                $scope.showNotifications('top','center','danger','Please select Project to continue...');

            }
        };
        
        /*** UI select (Branch List) **/
        $scope.loadBranchList = function (projectId, callback) {
    		
            if(projectId){

                if($scope.regionsListOne.selected){
                    console.log($scope.regionsListOne.selected);
                    $scope.branchSpin = true;
                    SiteComponent.getBranchByProject(projectId,$scope.regionsListOne.selected.id).then(function (response) {
                        console.log(response);
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
                        	console.log('branch list : ' + JSON.stringify($scope.branchList));
                            $scope.getSitesBYRegionOrBranch(projectId,$scope.regionsListOne.selected.name,null);
                            $scope.branchSpin = false;
                            $scope.branchFilterDisable = false;
                            //callback();
                        }
                        	
                    })

                }else{
                    $scope.showNotifications('top','center','danger','Please Select Region to continue...');

                }

            }else{
                $scope.showNotifications('top','center','danger','Please select Project to continue...');

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

            }else if(projectId >0){
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

            }
        }

        $scope.addRegion = function () {
            if($scope.selectedProject){

                if($scope.regionDetails && $scope.regionDetails.name){
                    console.log("Region entered");
                    console.log($scope.regionDetails);
                    var region ={
                        name:$scope.regionDetails.name,
                        projectId:$scope.selectedProject.id
                    };
                    SiteComponent.addRegion(region).then(function (response) {
                        console.log(response);
                        $scope.designation= null;
                        $scope.showNotifications('top','center','success','Region Added Successfully');
                        $scope.loadRegions($scope.selectedProject.id);

                    })
                }else{
                    console.log("Desgination not entered")
                    $scope.showNotifications('top','center','danger','Please enter Region Name...');

                }
            }else{
                $scope.showNotifications('top','center','danger','Please select Client to continue...');
            }


        };


        $scope.addBranch = function () {
            if($scope.selectedProject){

                if($scope.selectedRegion){
                    console.log($scope.selectedRegion);

                    if($scope.branchDetails && $scope.branchDetails.name){
                        console.log("Region entered");
                        console.log($scope.branchDetails);
                        var branch ={
                            name:$scope.branchDetails.name,
                            projectId:$scope.selectedProject.id,
                            regionId: $scope.selectedRegion.id
                        };
                        SiteComponent.addBranch(branch).then(function (response) {
                            console.log(response);
                            $scope.branch= null;
                            $scope.showNotifications('top','center','success','Branch Added Successfully');
                            $scope.loadBranch($scope.selectedProject.id);

                        })
                    }else{
                        console.log("Branch not entered");
                        $scope.showNotifications('top','center','danger','Please enter Branch Name...');

                    }

                }else{

                    $scope.showNotifications('top','center','danger','Please select Region to continue...');

                }

            }else{
                $scope.showNotifications('top','center','danger','Please select Client to continue...');
            }


        };




    });
