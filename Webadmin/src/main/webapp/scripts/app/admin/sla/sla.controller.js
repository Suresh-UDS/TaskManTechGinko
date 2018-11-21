'use strict';

angular
		.module('timeSheetApp')
		.controller(
				'SlaController',
				function($rootScope, $scope, $state, $timeout,
						ProjectComponent, SiteComponent, SlaComponent, $http,
						$stateParams, $location, PaginationComponent) {

					$scope.sla = {};

					$scope.slaList = [];

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

					// Filter
					$scope.filter = false;
					$scope.clientFilterDisable = true;
					$scope.regionFilterDisable = true;
					$scope.branchFilterDisable = true;
					$scope.siteFilterDisable = true;
					$scope.regionSpin = false;
					$scope.branchSpin = false;
					$scope.siteSpin = false;

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
						//$scope.selectedSite = null;
						$scope.slaList = null;

						/** Ui-select scopes * */
						// $scope.client.selected = null;
						$scope.slaEscalationList = [];
						// $scope.sitesListOne.selected = null;

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
						if (text == 'cancel') {
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
						$scope.setPage(1);
						$scope.search();
					}
					$scope.setPage = function(page) {

						if (page < 1 || page > $scope.pager.totalPages) {
							return;
						}
						$scope.pages.currPage = page;
						//$scope.search();
					};

					$scope.search = function() {
						//alert("123");
						$scope.noData = false;
						var currPageVal = ($scope.pages ? $scope.pages.currPage
								: 1);
						if (!$scope.searchCriteria) {
							var searchCriteria = {
								currPage : currPageVal
							}
							$scope.searchCriteria = searchCriteria;
						}
						$scope.searchCriteria.currPage = currPageVal;

						if ($scope.selectedColumn) {
							$scope.searchCriteria.columnName = $scope.selectedColumn;
							$scope.searchCriteria.sortByAsc = $scope.isAscOrder;
						} else {
							$scope.searchCriteria.columnName = "id";
							$scope.searchCriteria.sortByAsc = true;
						}
						if ($scope.pageSort) {
							$scope.searchCriteria.sort = $scope.pageSort;
						}
						if (!$scope.selectedSite) {
							if ($rootScope.searchCriteriaSite) {
								$scope.searchCriteria = $rootScope.searchCriteriaSite;
							} else {
								$scope.searchCriteria.findAll = false;
							}
						} else if ($scope.selectedSite) {
							$scope.searchCriteria.findAll = false;
							if ($scope.selectedSite) {
								$scope.searchCriteria.siteId = $scope.selectedSite.id;
								if (!$scope.searchCriteria.siteId) {
									$scope.searchCriteria.siteName = $scope.selectedSite.name;
								} else {
									$scope.searchCriteria.siteName = $scope.selectedSite.name;
								}

								console.log('selected site id ='
										+ $scope.searchCriteria.siteId);
							} else {
								$scope.searchCriteria.siteId = 0;
							}
						}

						console.log("search criteria", $scope.searchCriteria);
						$scope.slas = '';
						$scope.sitesLoader = false;
						$scope.loadPageTop();
						SlaComponent
								.search($scope.searchCriteria)
								.then(
										function(data) {
											$scope.slas = data.transactions;
											$scope.sitesLoader = true;

											/*
											 * * Call pagination main function **
											 */
											$scope.pager = {};
											$scope.pager = PaginationComponent
													.GetPager(
															data.totalCount,
															$scope.pages.currPage);
											$scope.totalCountPages = data.totalCount;

											console.log("Pagination",
													$scope.pager);
											console.log($scope.slas);

											$scope.pages.currPage = data.currPage;
											$scope.pages.totalPages = data.totalPages;

											if ($scope.slas
													&& $scope.slas.length > 0) {
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
						console.log("*****Selected SLA id " + $stateParams.id);
						SlaComponent
								.findOne($stateParams.id)
								.then(
										function(data) {
											$scope.sla = data;
											$scope.slaList.push($scope.sla);
											$scope.selectedProject.id = $scope.sla.projectId;
											$scope.selectedProject.name = $scope.sla.projectName;
											// alert($scope.selectedProject);
											$scope.selectedProject = {
												id : $scope.sla.projectId,
												name : $scope.sla.projectName
											};
											// $scope.selectedSite =
											// {id:$scope.sla.siteId,name:$scope.sla.siteName};
											$scope.selectedSite.id = $scope.sla.siteId;
											$scope.selectedSite.name = $scope.sla.siteName;
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
											console
													.log("Selected SLA Loading data");
											console.log(data);
											console.log($scope.sla.slaesc);
											$scope.loadingStop();
										});
					};

					$scope.addSla = function(validation) {
						if (validation) {
							return false;
						}
						for (var i = 0; i < $scope.slaList.length; i++) {
							console.log("SlaList add "
									+ JSON.stringify($scope.slaList));
							$scope.sla = $scope.slaList[i];
							console
									.log("Sla add "
											+ JSON.stringify($scope.sla));
							SlaComponent
									.createSla($scope.sla)
									.then(
											function(data) {
												$scope.saveSla = data;
												console.log("SLA saving");
												$scope
														.showNotifications(
																'top',
																'center',
																'success',
																'Sla has been saved successfully!!');
												console.log(data);
												$scope.loadingStop();
											});
						}
						$location.path('/sla-list');
						$scope.initLoad();
					};

					$scope.updateSla = function() {
						for (var i = 0; i < $scope.slaList.length; i++) {
							console.log("SlaList add "
									+ JSON.stringify($scope.slaList));
							$scope.sla = $scope.slaList[i];
							console
									.log("Sla add "
											+ JSON.stringify($scope.sla));
							SlaComponent
									.updateSla($scope.sla)
									.then(
											function(data) {
												$scope.saveSla = data;
												$scope
														.showNotifications(
																'top',
																'center',
																'success',
																'Sla has been updated successfully!!');
												console.log("SLA saving");
												console.log(data);
												$scope.loadingStop();
											});
						}
						$location.path('/sla-list');
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
						console.log("selected project - "
								+ JSON.stringify($scope.selectedProject));
						if ($scope.selectedProject) {
							ProjectComponent.findSites(
									$scope.selectedProject.id).then(
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
								$scope.slaEscalationList
										.push($scope.escalation);
								$scope.escalation = {};
							}
						}
					};

					$scope.updateSlaEscalations = function() {
						console.log("Escaltions "
								+ JSON.stringify($scope.escalation));
						$scope.slaEscalationList.push($scope.escalation);
						$scope.escalation = {};
						console.log("Escaltion List "
								+ JSON.stringify($scope.slaEscalationList));
					};

					$scope.removeEscalation = function(ind) {
						$scope.slaEscalationList.splice(ind, 1);
						console.log("remove escalation"
								+ $scope.slaEscalationList)
					};

					$scope.editesc = function(ind) {
						console.log("Edit Esclation:"
								+ $scope.slaEscalationList.slice(ind, ind + 1));
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
						console.log("SLA Escalation List "
								+ JSON.stringify($scope.slaEscalationList));
						$scope.sla.slaesc = $scope.slaEscalationList;
						$scope.slaEscalationList = [];
						var slas = {
							"projectId" : $scope.selectedProject.id,
							"siteId" : $scope.selectedSite.id,
							"processType" : $scope.sla.processType,
							"category" : $scope.sla.category,
							"severity" : $scope.sla.severity,
							"hours" : $scope.sla.hours,
							"slaesc" : $scope.sla.slaesc,
						}
						console
								.log("Sla slaEscalation "
										+ JSON.stringify(slas));
						$scope.slaList.push(slas);
						// $scope.selectedProject = {};
						// $scope.selectedSite = {};
						// $scope.sla = {};
						console
								.log("SlaList "
										+ JSON.stringify($scope.slaList));
					};

					$scope.updateEscalation = function() {
						console.log("Sla " + JSON.stringify($scope.sla));
						console.log("SLA Escalation List "
								+ JSON.stringify($scope.slaEscalationList));
						$scope.sla.slaesc = $scope.slaEscalationList;
						$scope.slaEscalationList = [];
						$scope.escalationShowOnce = false;
						console
								.log("SlaList "
										+ JSON.stringify($scope.slaList));
					};

					$scope.removeSla = function(ind) {
						console.log("remove index " + ind)
						$scope.slaList.splice(ind, 1);
						console.log("remove sla " + $scope.slaList);
					};

					$scope.editEscalation = function() {
						console.log("Selected SLA "
								+ JSON.stringify($scope.sla.slaesc));
						if ($scope.escalationShowOnce == false) {
							$scope.escalationShowOnce = true;
							for (var i = 0; i < $scope.sla.slaesc.length; i++) {
								$scope.escalation = $scope.sla.slaesc[i];
								console.log("Selected SLA"
										+ $scope.escalation.level);
								$scope.updateSlaEscalations();
							}
						}
					};

					$scope.deleteConfirm = function(sla) {
						$scope.deleteSlaId = sla;
					}
					$scope.deleteSla = function() {
						SlaComponent.deleteSla($scope.deleteSlaId).then(
								function() {
									$scope.success = 'OK';
									$scope.initLoad();
								});
					};

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

				});
