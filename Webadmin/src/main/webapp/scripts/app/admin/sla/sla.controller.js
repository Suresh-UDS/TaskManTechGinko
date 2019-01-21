'use strict';

angular.module('timeSheetApp')
		.controller('SlaController',function($rootScope, $scope, $state, $timeout,
						ProjectComponent, SiteComponent, SlaComponent, $http,
						$stateParams, $location, PaginationComponent,getLocalStorage) {

					$scope.sla = {};

                    $scope.slaList = [];

					$scope.slaView = [];

					$scope.escalation = {};

					$scope.slaEscalationList = [];

					$scope.selectedProject = {};

					$scope.selectedSite = {};

					$scope.selectedSla = {};

					$rootScope.loginView = false;

					$scope.pages = {
						currPage : 1
					};

					$scope.pager = {};

					$scope.noData = false;

					$scope.escalationShowOnce = false;

					$scope.slaShowOnce = false;

					$scope.selectedSlaList = {};

					$scope.status = 0;
					$scope.searchCriteria = {};

					$scope.removeSlaInd = null;
					$scope.searchPType = null;
					$scope.searchSeverity = null;

					// Filter
					$scope.filter = false;
					$scope.clientFilterDisable = true;
					$scope.regionFilterDisable = true;
					$scope.branchFilterDisable = true;
					$scope.siteFilterDisable = true;
					$scope.regionSpin = false;
					$scope.branchSpin = false;
					$scope.siteSpin = false;

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

					// init load
					$scope.initLoad = function() {
						$scope.loadProjects();
						$scope.loadPageTop();
						$scope.searchFilter();
					}

					$scope.refreshPage = function() {
						$scope.clearFilter();
						$scope.search();
					}

					$scope.clearFilter = function() {

						$scope.selectedColumn = null;

						$scope.clearField = true;
						$scope.filter = false;
						$scope.siteFilterDisable = true;
                        $scope.regionFilterDisable = true;
                        $scope.branchFilterDisable = true;
                        $scope.searchPType = null;
                        $scope.searchSeverity = null;
						//$scope.selectedSite = null;
						$scope.slaView = [];

						/** Ui-select scopes * */
						// $scope.client.selected = null;
						$scope.slaEscalationList = [];
						// $scope.sitesListOne.selected = null;

						/** Ui-select scopes **/
                        $scope.client.selected = null;
                        $scope.sitesLists =  [];
                        $scope.sitesListOne.selected =  null;
                        $scope.regionsLists =  [];
                        $scope.regionsListOne.selected =  null;
                        $scope.branchsLists =  [];
                        $scope.branchsListOne.selected =  null;

						$scope.selectedSla = null;
						$scope.selectedSite = null;
						$scope.selectedProject = null;
						$scope.searchProject = null;
						$scope.searchSite = null;
						$scope.searchCriteria = {};

						// $scope.localStorage = null;
						// $rootScope.searchCriteriaSite = null;
						$scope.pages = {
							currPage : 1,
							totalPages : 0
						}

						// $scope.search();
					};
					$scope.pageSort = 10;

					$scope.categories = ["Electrical","Cleaning","Beauty","Ac","Carpentry","Plumbing"];

                    $scope.multipleCategories = {};
                    $scope.multipleCategories.selectedCategory = [];


					$scope.loadPageTop = function() {
						$("#loadPage").animate({
							scrollTop : 0
						}, 2000);
					}

					// Page Loader Function

					$scope.loadingStart = function() {
						$('.pageCenter').show();
						$('.overlay').show();
					}
					$scope.loadingAuto = function() {
						$scope.loadingStart();
						$scope.loadtimeOut = $timeout(function() {

							// console.log("Calling loader stop");
							$('.pageCenter').hide();
							$('.overlay').hide();

						}, 2000);
					}
					$scope.loadingStop = function() {

						console.log("Calling loader");
						$('.pageCenter').hide();
						$('.overlay').hide();

					};

					$scope.conform = function(text, validation) {
						console.log($scope.selectedProject)
						$rootScope.conformText = text;
						$scope.valid = validation;
						$('#conformationModal').modal();
					};

					$rootScope.back = function(text) {
						if (text == 'cancel' || text == 'back') {
							/** @reatin - retaining scope value.* */
							$rootScope.retain = 1;
							$scope.cancelSla();
						} else if (text == 'save') {
							$scope.addSla($scope.valid);
						} else if (text == 'update') {
							/** @reatin - retaining scope value.* */
							$rootScope.retain = 1;
							$scope.updateSla();
						}
					};

					$scope.cancelSla = function() {
						if ($scope.status == 1) {

							// $location.path('/assets');

						}
						if ($scope.status == 2) {

							// $location.path('/view-quotation/'+ $scope.qid);

						} else {

							$location.path('/sla-list');
						}

					};
					// List ALL SLA

					/*
					 * $scope.loadSlaList = function () { console.log("Selected
					 * Project id "+$scope.selectedProject.id); var id =
					 * $scope.selectedProject.id; if(id == null){
					 * SlaComponent.findAll().then(function (data) {
					 * $scope.slaList = data; console.log("SLA Loading data");
					 * console.log(data); $scope.loadingStop(); }); } else{
					 * SlaComponent.findBySiteSLA(id).then(function (data){
					 * $scope.slaList = data; console.log("SLA Loading data");
					 * console.log(data); $scope.loadingStop(); }); }
					 * $scope.loadProjects(); };
					 */

					$scope.searchFilter = function() {
					    $('.AdvancedFilterModal.in').modal('hide');
						$scope.setPage(1);
						$scope.search();
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

					$scope.search = function() {
						$scope.noData = false;
						var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
						if (!$scope.searchCriteria) {
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

                         $scope.searchCriteria.findAll = false;

						if(!$scope.searchSite && !$scope.searchProject && !$scope.searchPType && !$scope.searchSeverity) {

                            $scope.searchCriteria.findAll = true;

                        }else {

                            if($scope.searchSite) {
                                $scope.searchCriteria.siteId = $scope.searchSite.id;
                                $scope.searchCriteria.siteName = $scope.searchSite.name;

                            }else {
                                $scope.searchCriteria.siteId = null;
                                $scope.searchCriteria.siteName = null;
                            }

                            if($scope.searchProject) {
                                $scope.searchCriteria.projectId = $scope.searchProject.id;
                                $scope.searchCriteria.projectName = $scope.searchProject.name;

                            }else {
                                $scope.searchCriteria.projectId = null;
                                $scope.searchCriteria.projectName = null;
                            }

                            if($scope.searchRegion) {
                                $scope.searchCriteria.regionId = $scope.searchRegion.id;
                                $scope.searchCriteria.region = $scope.searchRegion.name;

                            }else {
                                $scope.searchCriteria.regionId = null;
                                $scope.searchCriteria.region = null;
                            }

                            if($scope.searchBranch) {
                                $scope.searchCriteria.branchId = $scope.searchBranch.id;
                                $scope.searchCriteria.branch = $scope.searchBranch.name;

                            }else {
                                $scope.searchCriteria.branchId = null;
                                $scope.searchCriteria.branch = null;
                            }
                            if($scope.searchPType){
                              $scope.searchCriteria.processType = $scope.searchPType;
                            }else{
                              $scope.searchCriteria.processType = null;
                            }
                            if($scope.searchSeverity){
                              $scope.searchCriteria.severity = $scope.searchSeverity;
                            }else{
                              $scope.searchCriteria.severity = null;
                            }

                        }
                        //console.log($scope.searchCriteria);

                        if($scope.pageSort){
                            $scope.searchCriteria.sort = $scope.pageSort;
                        }

                        if($scope.selectedColumn){

                            $scope.searchCriteria.columnName = $scope.selectedColumn;
                            $scope.searchCriteria.sortByAsc = $scope.isAscOrder;

                        }else{
                            $scope.searchCriteria.columnName ="id";
                            $scope.searchCriteria.sortByAsc = false;
                        }

						console.log("search criteria", $scope.searchCriteria);
						$scope.slas = '';
						$scope.slaLoader = false;
						$scope.loadPageTop();

						/* Localstorage (Retain old values while edit page to list) start */

                        if($rootScope.retain == 1){
                            $scope.localStorage = getLocalStorage.getSearch();

                            //console.log('Local storage---',$scope.localStorage);

                            if($scope.localStorage){
                                $scope.filter = true;
                                $scope.pages.currPage = $scope.localStorage.currPage;
                                if($scope.localStorage.projectId){

                                    $scope.searchProject = {id:$scope.localStorage.projectId,name:$scope.localStorage.projectName};
                                    $scope.client.selected = $scope.searchProject;
                                    //$scope.loadDepSitesList($scope.client.selected);
                                    $scope.projectFilterFunction($scope.searchProject);
                                }else{
                                    $scope.searchProject = null;
                                    $scope.client.selected = $scope.searchProject;
                                }
                                if($scope.localStorage.regionId){
                                    $scope.searchRegion = {id:$scope.localStorage.regionId,name:$scope.localStorage.region};
                                    $scope.regionsListOne.selected = $scope.searchRegion;

                                    $scope.regionFilterFunction($scope.searchProject);
                                }else{
                                    $scope.searchRegion = null;
                                    $scope.regionsListOne.selected = $scope.searchRegion;
                                }
                                if($scope.localStorage.branchId){
                                    $scope.searchBranch = {id:$scope.localStorage.branchId,name:$scope.localStorage.branch};
                                    $scope.branchsListOne.selected = $scope.searchBranch;
                                    $scope.branchFilterFunction($scope.searchProject,$scope.searchRegion);

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
                                if($scope.localStorage.processType){
                                  $scope.selectedPType = $scope.localStorage.processType;
                                }else{
                                  $scope.selectedPType = null;
                                }
                                if($scope.localStorage.severity){
                                 $scope.searchSeverity = $scope.localStorage.severity;
                                }else{
                                  $scope.searchSeverity = null;
                                }

                            }

                            $rootScope.retain = 0;

                            $scope.searchCriteras  = $scope.localStorage;
                        }else{

                            $scope.searchCriteras  = $scope.searchCriteria;
                        }

                        /* Localstorage (Retain old values while edit page to list) end */

						SlaComponent.search($scope.searchCriteras).then(function(data) {
                            $scope.slas = data.transactions;
                            $scope.slaLoader = true;

                            /** retaining list search value.**/
                            getLocalStorage.updateSearch($scope.searchCriteras);

                            /*
                             * * Call pagination main function **
                             */
                            $scope.pager = {};
                            $scope.pager = PaginationComponent .GetPager(data.totalCount,$scope.pages.currPage);
                            $scope.totalCountPages = data.totalCount;

                            console.log("Pagination",
                                    $scope.pager);
                            console.log($scope.slas);

                            $scope.pages.currPage = data.currPage;
                            $scope.pages.totalPages = data.totalPages;

                            if ($scope.slas && $scope.slas.length > 0) {
                                $scope.showCurrPage = data.currPage;
                                $scope.pageEntries = $scope.slas.length;
                                $scope.totalCountPages = data.totalCount;
                                $scope.pageSort = 10;
                                $scope.noData = false;

                            } else {
                                $scope.noData = true;
                            }
                        });

					};

					$scope.loadSla = function() {
					   if($stateParams.id){
					      console.log("*****Selected SLA id " + $stateParams.id);
					        $scope.slaView = [];
                            SlaComponent.findOne($stateParams.id).then(function(data) {
                            $scope.sla = data;
                            $scope.title = "SLA - " + $scope.sla.id;
                            $scope.slaView.push($scope.sla);
                            console.log("sla array",$scope.slaList);
                            $scope.selectedProject = {id:$scope.sla.projectId,name:$scope.sla.projectName};
                            $scope.selectedSite ={id:$scope.sla.siteId,name:$scope.sla.siteName};
                            if ($scope.selectedProject) {
                                ProjectComponent.findSites($scope.selectedProject.id).then(
                                function(data) {
                                    $scope.sites = data;
                                });
                            }
                            $scope.selectedPType = $scope.sla.processType;
                            $scope.selectedSeverity = $scope.sla.severity;
                            $scope.multipleCategories.selectedCategory = $scope.sla.category;
                            /*
                             * for(int i = 0;
                             * $scope.sla.slaesc.length; i++) {
                             * var slaOne = { "level" :
                             * $scope.sla.slaesc.level, "hours" :
                             * $scope.sla.slaesc.hours,
                             * "minutes" :
                             * $scope.sla.slaesc.minutes,
                             * "email" :
                             * $scope.sla.slaesc.email, }
                             * $scope.slaEscalationList.push(slaOne); }
                             */
                            // $scope.slaEscalationList.push($scope.sla.slaesc);
                            console.log("Selected SLA Loading data",data);
                            console.log($scope.sla.slaesc);
                            $scope.loadingStop();
                        });
					   }

					};

					$scope.getSlaDetails = function(id, mode) {
                        $scope.loadingStart();
                        $scope.slaView = [];
                        SlaComponent.findOne(id).then(function (data) {
                            $scope.sla = data;
                            $scope.title = "SLA - " + $scope.sla.id;
                            $scope.slaView.push($scope.sla);
                            console.log("sla by id >>>",$scope.slaList);
                            $scope.loadingStop();
                        });
                    };


					$scope.addSla = function(validation) {
						if (validation) {
							return false;
						}
						for (var i = 0; i < $scope.slaList.length; i++) {
							console.log("SlaList add " + JSON.stringify($scope.slaList));
							$scope.sla = $scope.slaList[i];
							console.log("Sla add "+ JSON.stringify($scope.sla));
							SlaComponent.createSla($scope.sla).then(function(data) {
                                $scope.saveSla = data;
                                console.log("SLA saving");
                                $scope.showNotifications('top','center','success','Sla has been saved successfully!!');
                                console.log(data);
                                $scope.loadingStop();
                                $location.path('/sla-list');
                            });
						}
					};

					$scope.updateSla = function() {
                        if($scope.slaView){
                            for (var i = 0; i < $scope.slaView.length; i++) {
                                console.log("SlaList add "+ JSON.stringify($scope.slaView));
                                  $scope.sla.projectId =$scope.selectedProject.id;
                                  $scope.sla.siteId= $scope.selectedSite.id;
                                  $scope.sla.projectName =$scope.selectedProject.name;
                                  $scope.sla.siteName= $scope.selectedSite.name;
                                $scope.sla.processType = $scope.selectedPType;
                                $scope.sla.severity = $scope.selectedSeverity;
                                $scope.sla.category = $scope.multipleCategories.selectedCategory;
                                $scope.sla = $scope.slaView[i];
                                console.log("Sla add " + JSON.stringify($scope.sla));
                                SlaComponent.updateSla($scope.sla).then(function(data) {
                                      $scope.saveSla = data;
                                      $scope.showNotifications('top','center','success','Sla has been updated successfully!!');
                                      console.log("SLA saving");
                                      console.log(data);
                                      $scope.loadingStop();
                                  });
                            }
                             $location.path('/sla-list');
                        }


					};

					$scope.loadProjects = function() {
						ProjectComponent.findAll().then(function(data) {
							console.log("SLA projects");
							$scope.projects = data;
							console.log(data);
							$scope.loadingStop();
						});

					};

					$scope.loadSites = function() {
						if ($scope.selectedProject) {
						    console.log("selected project - ", JSON.stringify($scope.selectedProject));
							ProjectComponent.findSites($scope.selectedProject.id).then(
                                function(data) {
                                    console.log(JSON.stringify(data));
                                    $scope.sites = data;
                                });
						} else {
							SiteComponent.findAll().then(function(data) {
								$scope.sites = data;
							});
						}
					};

					$scope.addSlaEscalations = function() {
						var level = $scope.escalation.level;
						var hour = $scope.escalation.hours;
						var minute = $scope.escalation.minutes;
						var email = $scope.escalation.email;
						if (hour <= 0 && minute <= 0) {
							return false;
						}
						if (level == null || level == "", hour == null
								|| hour == "", minute == null || minute == "",
								email == null || email == "",
								typeof level == 'undefined'
										|| typeof hour == 'undefined'
										|| typeof minute == 'undefined'
										|| typeof email == 'undefined') {
							return false;
						} else {
							var arr = $scope.escalation;
							var arr1 = $scope.slaEscalationList;

							var exists = false;
							angular.forEach(arr1, function(value1, key) {
								if (angular.equals(arr.level, value1.level)
										|| arr.level == value1.level) {
									value1.hours = arr.hours;
									value1.minutes = arr.minutes;
									value1.email = arr.email;
									// $scope.slaEscalationList.push($scope.escalation);
									// $scope.escalation = {};
									exists = true
									// break;
									$scope.escalation = {};
								}
								;
							});
							if (exists == false) {
								$scope.slaEscalationList.push($scope.escalation);
								$scope.escalation = {};
							}
						}
					};

					$scope.updateSlaEscalations = function() {
						console.log("Escaltions " + JSON.stringify($scope.escalation));
						$scope.slaEscalationList.push($scope.escalation);
						$scope.escalation = {};
						console.log("Escaltion List "+ JSON.stringify($scope.slaEscalationList));
					};

					$scope.removeEscalation = function(ind) {
						$scope.slaEscalationList.splice(ind, 1);
						console.log("remove escalation"+ $scope.slaEscalationList)
					};

					$scope.editesc = function(ind) {
						console.log("Edit Esclation:"+ $scope.slaEscalationList.slice(ind, ind + 1));
						var slaesc = $scope.slaEscalationList.slice(ind,
								ind + 1);

						console.log("Sla " + JSON.stringify(slaesc));
						$scope.escalation.level = (slaesc[0].level).toString();
						$scope.escalation.hours = slaesc[0].hours;
						$scope.escalation.minutes = slaesc[0].minutes;
						$scope.escalation.email = slaesc[0].email;
						// $scope.slaEscalationList.splice(ind, 1);
					}

					$scope.addSlas = function() {
						console.log("Sla " + JSON.stringify($scope.sla));
						console.log("SLA Escalation List "+ JSON.stringify($scope.slaEscalationList));
						$scope.sla.slaesc = $scope.slaEscalationList;
						$scope.sla.category = $scope.multipleCategories.selectedCategory;
						$scope.slaEscalationList = [];
						var slas = {
							"projectId" : $scope.selectedProject.id,
							"siteId" : $scope.selectedSite.id,
							"processType" : $scope.selectedPType,
							"category" : $scope.sla.category,
							"severity" : $scope.selectedSeverity,
							"hours" : $scope.sla.hours,
							"slaesc" : $scope.sla.slaesc,
						}
						console.log("Sla slaEscalation "+ JSON.stringify(slas));
						$scope.slaList.push(slas);
						// $scope.selectedProject = {};
						// $scope.selectedSite = {};
						// $scope.sla = {};
						console.log("SlaList "+ JSON.stringify($scope.slaList));
					};

					$scope.updateEscalation = function() {
						console.log("Sla " + JSON.stringify($scope.sla));
						console.log("SLA Escalation List "+ JSON.stringify($scope.slaEscalationList));
						$scope.sla.slaesc = $scope.slaEscalationList;
						$scope.slaEscalationList = [];
						$scope.escalationShowOnce = false;
						console.log("SlaList "+ JSON.stringify($scope.slaList));
					};

					$scope.editEscalation = function() {
						console.log("Selected SLA ", JSON.stringify($scope.sla.slaesc));
						if ($scope.escalationShowOnce == false) {
							$scope.escalationShowOnce = true;
							$scope.escalation = "";
							for (var i = 0; i < $scope.sla.slaesc.length; i++) {
								$scope.escalation = $scope.sla.slaesc[i];
								console.log("Selected SLA", $scope.escalation.level);
								$scope.updateSlaEscalations();
							}
						}
					};

					$scope.deleteConfirm = function(sla) {
						$scope.deleteSlaId = sla;
					}
					$scope.deleteSla = function() {
                        if($scope.deleteSlaId){
                           SlaComponent.deleteSla($scope.deleteSlaId).then(
                            function() {
                                $scope.success = 'OK';
                                $scope.initLoad();
                            });
                        }
					};

					$scope.removeSlaConfirm = function(ind) {
                        $scope.removeSlaInd = ind;
                    };

                    $scope.removeSla = function() {
                           console.log("remove index " + $scope.removeSlaInd);
                           $scope.slaList.splice($scope.removeSlaInd, 1);
                           console.log("remove sla " + $scope.slaList);
                    };
                    $scope.isActiveAsc = '';
                    $scope.isActiveDesc = 'id';
					$scope.columnAscOrder = function(field) {
						$scope.selectedColumn = field;
						$scope.isActiveAsc = field;
						$scope.isActiveDesc = '';
						$scope.isAscOrder = true;
						// $scope.search();
						$scope.search();
					};

					$scope.columnDescOrder = function(field) {
						$scope.selectedColumn = field;
						$scope.isActiveDesc = field;
						$scope.isActiveAsc = '';
						$scope.isAscOrder = false;
						// $scope.search();
						$scope.search();
					};

					$scope.showNotifications = function(position, alignment,
							color, msg) {
						demo.showNotification(position, alignment, color, msg);
					};
					/*
					 * $scope.editSla = function() { console.log("Updated SLA " +
					 * JSON.stringify($scope.sla)); $scope.slaList = [];
					 * $scope.slaList.push($scope.sla); }
					 */

					// Levels orderby function

					$scope.sorterFunc = function(esc){
					    return parseInt(esc.level);
					};

                $scope.loadProjectsList = function () {
                        ProjectComponent.findAll().then(function (data) {
                            $scope.projectsList = data;
                            /** Ui-select scope **/
                            $scope.clients[0] = $scope.allClients;
                            //$scope.SelectClients[0] = $scope.SelectClientsNull;

                            $scope.loadingStop();

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

                $scope.sitesList = data;
            });

        }else if(region){

            SiteComponent.getSitesByRegion(projectId,region).then(function (data) {
                $scope.sitesList = data;

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

        $scope.loadRegions = function (projectId, callback) {
            SiteComponent.getRegionByProject(projectId).then(function (response) {

                $scope.regions = response;



            })
    };



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
