'use strict';

angular
		.module('timeSheetApp')
		.controller(
				'QuotationController',
				function($scope, $rootScope, $state, $timeout, $http, $document, $window,
						$stateParams, $location, RateCardComponent,TicketComponent, JobComponent,
						 ProjectComponent, SiteComponent,PaginationComponent,$filter,getLocalStorage,Idle) {
                    Idle.watch();

                    $rootScope.loadingStop();

                    $rootScope.loginView = false;

					 $scope.selectedProject = null;

                     $scope.selectedSite = null;

					$scope.quotations;

					$scope.quotationImages=[];

                    $scope.selectedImageFile;

					$scope.materialName;

					$scope.materialQty;

					$scope.materialUnitPrice;

					$scope.materialItemCost;

					$scope.materialTotalCost = 0;

					$scope.serviceName;

					$scope.serviceQty;

					$scope.serviceUnitPrice;

					$scope.serviceItemCost;

					$scope.serviceTotalCost = 0;

					$scope.labourCategory;

					$scope.labourQty;

					$scope.labourUnitPrice;

					$scope.labourItemCost;

					$scope.labourTotalCost = 0;

					$scope.quotation = {};

					$scope.rateCardDetails = [];

					$scope.materialRateCardDetails = [];

					$scope.serviceRateCardDetails = [];

					$scope.labourRateCardDetails = [];

					$scope.totalCost = 0;

					$scope.searchCriteria = {};

					$scope.pages = { currPage : 1};

					$scope.pageSort = 10;

					$scope.pager = {};

					$scope.status = 0;

					$scope.quoteStatus = true;

					$scope.noData = false;
					$scope.searchProject = null;
					$scope.searchSite = null;
					$scope.searchId = null;
					$scope.searchTitle = null;
					$scope.searchCreatedBy = null;
					$scope.searchApprovedBy = null;
					$scope.searchStatus = null;
					$scope.btnDisable = false;
					$scope.ticketQuot = false;
					$scope.searchCreatedDate = $filter('date')(new Date(), 'dd/MM/yyyy');
					$scope.searchCreatedDateSer = new Date();
					$scope.searchToDate = $filter('date')(new Date(), 'dd/MM/yyyy');
	                $scope.searchToDateSer = new Date();

					/** Ui-select scopes **/
			        $scope.allClients = {id:0 , name: '-- ALL CLIENTS --'};
			        $scope.client = {};
			        $scope.clients = [];
			        $scope.allSites = {id:0 , name: '-- ALL SITES --'};
			        $scope.sitesListOne = {};
			        $scope.sitesLists = [];
			        $scope.sitesListOne.selected =  null;
			        $scope.SelectClient = {};
			        $scope.SelectClients = [];
			        $scope.SelectSite = {};
			        $scope.SelectSites = [];
			        $scope.allRegions = {id:0 , name: '-- SELECT REGIONS --'};
			        $scope.regionsListOne = {};
			        $scope.regionsLists = [];
			        $scope.regionsListOne.selected =  null;
			        $scope.allBranchs = {id:0 , name: '-- SELECT BRANCHES --'};
			        $scope.branchsListOne = {};
			        $scope.branchsLists = [];
			        $scope.branchsListOne.selected =  null;


			        $scope.selectedSubmittedDate = $filter('date')(new Date(), 'dd/MM/yyyy');
			        $scope.selectedApprovedDate = $filter('date')(new Date(), 'dd/MM/yyyy');

			        $scope.selectedSubmittedDateSer = new Date();
			        $scope.selectedApprovedDateSer = new Date();

			        $scope.initCalender = function(){

			            demo.initFormExtendedDatetimepickers();

			        };

			        $rootScope.initScrollBar();

			        $('input#submittedDateFilter').on('dp.change', function(e){
			          //console.log(e.date);
			          //console.log(e.date._d);
			            $scope.selectedSubmittedDateSer = e.date._d;

			            $.notifyClose();

		               $scope.selectedSubmittedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');



			        });
			        $('input#approvedDateFilter').on('dp.change', function(e){
			          //console.log(e.date);
			          //console.log(e.date._d);
			            $scope.selectedApprovedDateSer = e.date._d;

			            $.notifyClose();

		                $scope.selectedApprovedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');

			        });

			        /*$('input#searchCreatedDate').on('dp.change', function(e){
		                $scope.searchCreatedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
		                $scope.searchCreatedDateSer = new Date(e.date._d);
		                *//*if($scope.searchToDate < $scope.searchCreatedDate){
		                	$scope.searchToDate = "";
			                $scope.searchToDateSer = "";
		                }
		                $('input#searchToDate').datetimepicker().on('dp.show', function () {
		                return $(this).data('DateTimePicker').minDate(e.date);
		                });*//*
		            });

			        $('input#searchToDate').on('dp.change', function(e){
		                $scope.searchToDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
		                $scope.searchToDateSer = new Date(e.date._d);
		            });*/

		            $('#searchCreatedDate').on('dp.change', function(e){
                        $scope.searchCreatedDateSer =new Date(e.date._d);
                        $scope.searchCreatedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
                        $scope.searchCreatedDateSer.setHours(0,0,0,0);
                        if($scope.searchToDateSer){
                            $scope.searchToDateSer.setHours(0,0,0,0);
                        }


                        if($scope.searchCreatedDateSer > $scope.searchToDateSer && $scope.searchCreatedDateSer != $scope.searchToDateSer){
                            $scope.fromErrMsg = 'From date cannot be greater than To date';

                            alert($scope.fromErrMsg);

                            $('input#searchCreatedDate').data('DateTimePicker').clear();
                            $('input#searchToDate').data('DateTimePicker').clear();
                            $scope.searchCreatedDateSer = new Date();
                            $scope.searchCreatedDate = $filter('date')(new Date(), 'dd/MM/yyyy');
                            $scope.searchToDateSer = new Date();
                            $scope.searchToDate = $filter('date')(new Date(), 'dd/MM/yyyy');
                            $('input#searchCreatedDate').val($scope.searchCreatedDate);
                            $('input#searchToDate').val($scope.searchToDate);

                            return false;
                        }

                    });
                    $('#searchToDate').on('dp.change', function(e){
                        $scope.searchToDateSer =new Date(e.date._d);
                        $scope.searchToDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
                        $scope.searchToDateSer.setHours(0,0,0,0);
                        if($scope.searchCreatedDateSer){
                            $scope.searchCreatedDateSer.setHours(0,0,0,0);
                        }

                        if($scope.searchCreatedDateSer > $scope.searchToDateSer && $scope.searchCreatedDateSer != $scope.searchToDateSer){
                            $scope.toErrMsg = 'To date cannot be lesser than From date';

                            alert($scope.toErrMsg);

                            $('input#searchCreatedDate').data('DateTimePicker').clear();
                            $('input#searchToDate').data('DateTimePicker').clear();
                            $scope.searchCreatedDateSer = new Date();
                            $scope.searchCreatedDate = $filter('date')(new Date(), 'dd/MM/yyyy');
                            $scope.searchToDateSer = new Date();
                            $scope.searchToDate = $filter('date')(new Date(), 'dd/MM/yyyy');
                            $('input#searchCreatedDate').val($scope.searchCreatedDate);
                            $('input#searchToDate').val($scope.searchToDate);

                            return false;
                        }

                    });

			        $scope.initCalender();

					$scope.init = function() {

                      //console.log("State parameters");
                      //console.log($stateParams);
                        if($stateParams.ticketId){
                            TicketComponent.getTicketDetails($stateParams.ticketId).then(function(data){
                              //console.log("Ticket details");
                              //console.log(data);
                                $scope.quotation.title =data.title;
                                $scope.quotation.description = data.description;
                                $scope.quotation.ticketId = data.id;
                                $scope.selectedProject = {id:data.projectId, name:data.projectName};
                                $scope.SelectClient.selected = $scope.selectedProject;
                                $scope.selectedSite = {id:data.siteId,name:data.siteName};
                                $scope.SelectSite.selected = $scope.selectedSite;
                                $scope.status = 1;
                                $scope.ticketQuot = true;
                                $scope.clientDisable = true;
                                $scope.siteDisable = true;

                                /*if(data.siteId){
                                    SiteComponent.findOne(data.siteID).then(function (data) {
                                      //console.log(data);
                                        $scope.selectedSite = data;
                                    })
                                }*/
                            }).catch(function(){
                                $scope.showNotifications('top','center','danger','Unable to load ticket details..');
                            });
                        }


						console.log('readonly value -'+ $stateParams.viewOnly);
						if($state.current.name == 'view-quotation') {

							$scope.viewOnly = $stateParams.viewOnly;
							$document[0].getElementById('quotationTitle').disabled = $stateParams.viewOnly;
							$document[0].getElementById('quotationDescription').disabled = $stateParams.viewOnly;
							$document[0].getElementById('project').disabled = $stateParams.viewOnly;
							$document[0].getElementById('site').disabled = $stateParams.viewOnly;
							$document[0].getElementById('serviceEntryFields').style.display = $stateParams.viewOnly ? 'none' : 'block';
							$document[0].getElementById('labourEntryFields').style.display = $stateParams.viewOnly ? 'none' : 'block';
							$document[0].getElementById('materialEntryFields').style.display = $stateParams.viewOnly ? 'none' : 'block';
							//$document[0].getElementById('actionButtons').style.display = $stateParams.viewOnly ? 'none' : 'block';
							//$document[0].getElementById('closeButton').style.display = $stateParams.viewOnly ? 'visible' : 'none';
						}

						$scope.loadProjects();
					}

					$scope.actionsShow = function() {
                     $('#approveButton').show();
                      $('#actionButtons').show();
					};

					$scope.actionsHide= function() {
					  $('#approveButton').hide();
                      $('#actionButtons').hide();
					};

					 $scope.stepsModel = [];

					    $scope.imageUpload = function(event){

					    	alert(event);
					         //var files = event.target.files; //FileList object

					        /* for (var i = 0; i < files.length; i++) {
					             var file = files[i];
					                 var reader = new FileReader();
					                 reader.onload = $scope.imageIsLoaded;
					                 reader.readAsDataURL(file);
					         }*/
					    }

					    $scope.imageIsLoaded = function(e){
					        $scope.$apply(function() {
					            $scope.stepsModel.push(e.target.result);
					        });
					    }



					    //


                    $scope.conform = function(text,msg)
                    {
                      //console.log($scope.selectedProject)
                        $rootScope.conformText = text;
                        $scope.msg = msg;
                        $('#conformationModal').modal();

                    }
                    $rootScope.back = function (text) {
                        if(text == 'cancel')
                        {
                            $scope.cancelQuotation();
                        }
                        else if(text == 'save')
                        {
                            $scope.saveQuotation($scope.msg);
                        }
                        else if(text == 'send')
                        {
                            $scope.saveQuotation($scope.msg);
                        }
                        else if(text == 'update')
                        {
                            /** @reatin - retaining scope value.**/
                            $rootScope.retain=1;
                            $scope.updateSite($scope.msg);
                        }
                    };

                    //

					$scope.loadProjects = function() {
                            $scope.loadSites();
                            ProjectComponent.findAll().then(function(data) {
                              //console.log("Loading all projects")
                                $scope.projects = data;
                                //$scope.selectedProject = $scope.projects[0];
                                /** Ui-select scope **/
                                $scope.clients[0] = $scope.allClients;
                                if($state.current.name != 'edit-quotation' && $state.current.name != 'view-quotation')
                                {
                                    $scope.selectedProject = null;
                                }
                                for(var i=0;i<$scope.projects.length;i++)
                                {
                                    //$scope.uiClient[i] = $scope.projects[i].name;
                                    $scope.SelectClients[i] = $scope.projects[i];
                                    $scope.clients[i+1] = $scope.projects[i];
                                }

                                $scope.clientDisable = false;
                                $scope.clientFilterDisable = false;
                            });

					};

                    // Load Clients for selectbox //
                    $scope.clientDisable = true;
                    $scope.clienteFilterDisable = true;
                    $scope.uiClient = [];
                    $scope.getClient = function (search) {
                        var newSupes = $scope.uiClient.slice();
                        if (search && newSupes.indexOf(search) === -1) {
                            newSupes.unshift(search);
                        }

                        return newSupes;
                    }

                    //


			        $scope.loadSelectedProject = function(projectId) {
				        	ProjectComponent.findOne(projectId).then(function (data) {
				                $scope.selectedProject = data;
				                $scope.loadSites();
			            });
			        };


			        $scope.loadSites = function () {
			            $scope.showLoader();
				        	console.log('selected project - ' + JSON.stringify($scope.selectedProject));
				        	if($scope.selectedProject) {
				            	ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
				                    $scope.sites = data;
				                    $scope.selectedSite = $scope.sites[0];
                                    for(var i=0;i<$scope.sites.length;i++)
                                    {
                                        $scope.uiSite[i] = $scope.sites[i].name;
                                    }
				                    $scope.hideLoader();

				                });
				        	}else {
				            	SiteComponent.findAll().then(function (data) {
				                    $scope.sites = data;
                                    for(var i=0;i<$scope.sites.length;i++)
                                    {
                                        $scope.uiSite[i] = $scope.sites[i].name;
                                    }
				                    $scope.hideLoader();

				                });
				        	}
			        };


			        //Searchsite
                    $scope.loadSearchSite = function (searchSite) {

                        if($state.current.name == 'add-quotation')
                        {
                            $scope.selectedSite = $scope.sitesList[$scope.uiSite.indexOf(searchSite)];
                            $scope.hideSite = false;
                        }
                        else if($state.current.name == 'edit-quotation')
                        {
                            $scope.selectedSite = $scope.sitesList[$scope.uiSite.indexOf(searchSite)];
                            $scope.hideSite = false;
                        }
                        else {
                            $scope.searchSite = $scope.sitesList[$scope.uiSite.indexOf(searchSite)];
                            $scope.hideSite = true;
                        }
                        //console.log('<<<< Site >>>>',$scope.selectedSite);

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
			        $scope.loadDepSites = function (searchProject) {
			           if(searchProject){
			              $scope.siteSpin = true;
                          $scope.hideSite = false;
                          $scope.clearField = false;

                              $scope.uiSite.splice(0,$scope.uiSite.length)

                          if($state.current.name == 'add-quotation')
                          {
                              $scope.selectedProject = $scope.projects[$scope.uiClient.indexOf(searchProject)]
                          }
                          else if($state.current.name == 'edit-quotation')
                          {
                              $scope.selectedProject = $scope.projects[$scope.uiClient.indexOf(searchProject)]
                          }
                          else {
                              $scope.searchSite = null;
                              $scope.siteSpin = true;
                              $scope.filter = false;
                              $scope.clearField = false;
                              $scope.searchProject = $scope.projects[$scope.uiClient.indexOf(searchProject)]
                          }

                        if(jQuery.isEmptyObject($scope.selectedProject) == false) {
                               var depProj=$scope.selectedProject.id;
                        }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                                var depProj=$scope.searchProject.id;
                        }else{
                                var depProj=0;
                        }

                        ProjectComponent.findSites(depProj).then(function (data) {
                            $scope.searchSite = null;
                            $scope.sitesList = data;

                            //
                            //console.log($scope.sitesList)
                              for(var i=0;i<$scope.sitesList.length;i++)
                              {
                                  $scope.uiSite[i] = $scope.sitesList[i].name;
                              }
                              $scope.siteFilterDisable = false;
                              $scope.siteDisable = false;
                              $scope.siteSpin = false;
                        });
			           }
					};

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
			 	                      $scope.Selectsites[i] = $scope.sitesList[i];
			 	                  }

			 	                  $scope.siteFilterDisable = false;
			 	                  $scope.siteSpin = false;
			 	              });
			               }else{
			 	              if(jQuery.isEmptyObject($scope.SelectClient.selected) == false) {
			 	                     var depProj=$scope.SelectClient.selected.id;
			 	                     $scope.SelectSites = [];
					                 $scope.SelectSite.selected = null;
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
			 	                  $scope.sitesLists[0] = $scope.allSites;

			 	                  //console.log('Site List',$scope.sitesList);

			 	                  for(var i=0;i<$scope.sitesList.length;i++)
			 	                  {
			 	                      $scope.sitesLists[i+1] = $scope.sitesList[i];

			 	                  }

			 	                 for(var i=0;i<$scope.sitesList.length;i++)
				                  {

				                      $scope.SelectSites[i] = $scope.sitesList[i];
				                  }

			 	                  $scope.siteFilterDisable = false;
			 	                  $scope.siteDisable = false;
			 	                  $scope.siteSpin = false;
			 	              });
			               }


			             };

			             $scope.regionFilterDisable = true;
			             $scope.branchFilterDisable = true;

			             /*** UI select (Region List) **/
			             $scope.loadRegionsList = function (projectId, callback) {
			             	$scope.regionSpin = true;
			             	$scope.branchsLists = [];
			             	$scope.branchsListOne.selected = null;
			             	$scope.branchFilterDisable = true;
			                 SiteComponent.getRegionByProject(projectId).then(function (response) {
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

			                     }else{
			                         $scope.showNotifications('top','center','danger','Please Select Region to continue...');

			                     }

			                 }else{
			                     $scope.showNotifications('top','center','danger','Please select Project to continue...');

			                 }
			             };

					$scope.loadAllQuotations = function() {
						$scope.clearFilter();
						$scope.search();
						 /*$scope.quotations = '';
                         $scope.quotationsLoader = false;
						RateCardComponent.getAllQuotations().then(
								function(response) {
									console.log('quotations - '+ JSON.stringify(response));
									$scope.quotations = response;
									$scope.quotationsLoader = true;
									$scope.selectedProject= {id:response.projectId,name:response.projectName};
						             $scope.selectedSite = {id:response.siteId,name:response.siteName};

								})*/

					};

					$scope.addMaterial = function() {
						console.log('material cost - '
								+ parseInt($scope.materialQty) + ', '
								+ parseFloat($scope.materialUnitPrice))
						if($scope.materialQty > 0 && $scope.materialUnitPrice > 0) {
							$scope.materialItemCost = parseInt($scope.materialQty)
														* parseFloat($scope.materialUnitPrice);
							var rateCardDetail = {};
							rateCardDetail.title = $scope.materialName
							rateCardDetail.type = 'MATERIAL'
							rateCardDetail.cost = $scope.materialItemCost
							rateCardDetail.uom = 'PER_QTY'
							rateCardDetail.qty = $scope.materialQty
							rateCardDetail.unitPrice = $scope.materialUnitPrice
							$scope.materialTotalCost += parseFloat($scope.materialItemCost)
							$scope.totalCost += parseFloat($scope.materialItemCost)
							$scope.materialRateCardDetails.push(rateCardDetail);
                            $scope.validCheck();
						}
					}

					$scope.removeMaterial = function(ind) {
						$scope.materialTotalCost -= parseFloat($scope.materialRateCardDetails[ind].cost);
						$scope.totalCost -= parseFloat($scope.materialRateCardDetails[ind].cost);
						$scope.materialRateCardDetails.splice(ind, 1);
						$scope.validCheck();
					}

					$scope.addService = function() {
						console.log('service cost - '
								+ parseInt($scope.serviceQty) + ', '
								+ parseFloat($scope.serviceUnitPrice))
						if($scope.serviceQty > 0 && $scope.serviceUnitPrice > 0) {
							$scope.serviceItemCost = parseInt($scope.serviceQty)
									* parseFloat($scope.serviceUnitPrice);
							var rateCardDetail = {};
							rateCardDetail.title = $scope.serviceName
							rateCardDetail.type = 'SERVICE'
							rateCardDetail.cost = $scope.serviceItemCost
							rateCardDetail.uom = 'FIXED'
							rateCardDetail.qty = $scope.serviceQty
							rateCardDetail.unitPrice = $scope.serviceUnitPrice
							$scope.serviceTotalCost += parseFloat($scope.serviceItemCost)
							$scope.totalCost += parseFloat($scope.serviceItemCost)
							$scope.serviceRateCardDetails.push(rateCardDetail);
							$scope.validCheck();
						}
					}

					$scope.removeService = function(ind) {
						$scope.serviceTotalCost -= parseFloat($scope.serviceRateCardDetails[ind].cost);
						$scope.totalCost -= parseFloat($scope.serviceRateCardDetails[ind].cost);
						$scope.serviceRateCardDetails.splice(ind, 1);
						$scope.validCheck();
					}

					$scope.addLabour = function() {
						console.log('Labour cost - '
								+ parseInt($scope.labourQty) + ', '
								+ parseFloat($scope.labourUnitPrice))
						if($scope.labourQty > 0 && $scope.labourUnitPrice > 0) {
							$scope.labourItemCost = parseInt($scope.labourQty)
									* parseFloat($scope.labourUnitPrice);
							var rateCardDetail = {};
							rateCardDetail.title = $scope.labourCategory
							rateCardDetail.type = 'LABOUR'
							rateCardDetail.cost = $scope.labourItemCost
							rateCardDetail.uom = 'PER_HOUR'
							rateCardDetail.qty = $scope.labourQty
							rateCardDetail.unitPrice = $scope.labourUnitPrice
							$scope.labourTotalCost += parseFloat($scope.labourItemCost)
							$scope.totalCost += parseFloat($scope.labourItemCost)
							$scope.labourRateCardDetails.push(rateCardDetail);
							$scope.validCheck();
						}
					}

					$scope.removeLabour = function(ind) {
						$scope.labourTotalCost -= parseFloat($scope.labourRateCardDetails[ind].cost);
						$scope.totalCost -= parseFloat($scope.labourRateCardDetails[ind].cost);
						$scope.labourRateCardDetails.splice(ind, 1);
						$scope.validCheck();
					}

                    $scope.saveLoad = false;
					$scope.saveQuotation = function(mode) {
                        $scope.saveLoad = true;
                        $scope.btnDisable = true;
						console.log("Image file",$scope.selectedImageFile);

						if($scope.SelectClient.selected){
			        		$scope.selectedProject = $scope.SelectClient.selected;
			        	}else{
			        	   $scope.selectedProject = null;
			        	}
			            if($scope.SelectSite.selected){
			        		$scope.selectedSite = $scope.SelectSite.selected;

			        	}else{
			        	   $scope.selectedSite = null;
			        	}

						$scope.quotation.siteId = $scope.selectedSite.id;
						$scope.quotation.siteName = $scope.selectedSite.name;
						$scope.quotation.projectId = $scope.selectedProject.id;
						$scope.quotation.projectName = $scope.selectedProject.name;


						$scope.rateCardDetails = $scope.serviceRateCardDetails
								.concat($scope.labourRateCardDetails,
										$scope.materialRateCardDetails);
						$scope.quotation.rateCardDetails = $scope.rateCardDetails;
						if(mode == 'submit') {
							$scope.quotation.submitted = true;
						}else {
							$scope.quotation.drafted = true;
						}
						$scope.quotation.mode = mode;
						$scope.quotation.ticketId = $stateParams.ticketId;

						console.log('Quotation details - ' + JSON.stringify($scope.quotation));

						RateCardComponent.createQuotation($scope.quotation)
								.then(function(response) {
                                    $scope.saveLoad = false;
									console.log(response);
                              //console.log($scope.selectedImageFile);
								if($scope.selectedImageFile){

								RateCardComponent.upload(response._id,$scope.selectedImageFile)
								    .then(function(response) {
									console.log("image uploaded",response);

								}).catch(function (response) {
									console.log("Failed to image upload",response);
								});

								}
									$scope.showNotifications('top','center','success','Quotation saved Successfully');
									//$scope.loadAllQuotations();
									$location.path('/quotation-list');
								}).catch(function (response) {
                                    $scope.saveLoad = false;
			                        $scope.success = null;
			                        $scope.btnDisable = false;
			                      //console.log('Error - '+ JSON.stringify(response.data));
			                        if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
			                            $scope.errorEmployeeExists = true;
			                            $scope.errorMessage = response.data.description;
			                            $scope.showNotifications('top','center','danger', $scope.errorMessage);
			                        } else {
			                            $scope.error = 'ERROR';
			                            $scope.showNotifications('top','center','danger', response.data.description);

			                        }
			                    });
					};

					$scope.selectQuotation = function(quotation) {

						$scope.quotation = quotation;
					};

                    $scope.loadQuotationImage = function(image) {
                        var eleId = 'photoStart';
                        var ele = document.getElementById(eleId);
                        ele.setAttribute('src',image);

                    };

                    // *
			        $scope.loadQuotation = function() {
                          if($stateParams.id){
                          	        $scope.serviceTotalCost = 0;
			        				$scope.labourTotalCost = 0;
			        				$scope.materialTotalCost = 0;
			        				$scope.totalCost = 0;
			        				var qId = $stateParams.id;
                          //console.log('quotation id - ' + $stateParams.id);
			        		RateCardComponent.findQuotation(qId).then(function (data) {

			        				console.log('quotation response - '+ JSON.stringify(data))
				                $scope.quotation = data;
				                    if($scope.quotation){
                                        var rateCardDetails = $scope.quotation.rateCardDetails;
                                        for(var i =0;i < rateCardDetails.length; i++) {
                                            var rateCardDetail = rateCardDetails[i];
                                            if(rateCardDetail.type == 'SERVICE') {
                                                $scope.serviceTotalCost += rateCardDetail.cost;
                                                $scope.serviceRateCardDetails.push(rateCardDetail);
                                            }else if(rateCardDetail.type == 'LABOUR') {
                                                $scope.labourTotalCost += rateCardDetail.cost;
                                                $scope.labourRateCardDetails.push(rateCardDetail);
                                            }else if(rateCardDetail.type == 'MATERIAL') {
                                                $scope.materialTotalCost += rateCardDetail.cost;
                                                $scope.materialRateCardDetails.push(rateCardDetail);
                                            }
                                            $scope.totalCost += rateCardDetail.cost;
                                        }

                                    //$scope.loadSelectedProject($scope.quotation.projectId);
                                    $scope.selectedProject = {};
                                    $scope.selectedProject.id = $scope.quotation.projectId;
                                    $scope.selectedProject.name = $scope.quotation.projectName;
                                    $scope.selectedSite = {};
                                    $scope.selectedSite.id = $scope.quotation.siteId;
                                    $scope.selectedSite.name = $scope.quotation.siteName;
                                    //UI scope values
                                    $scope.SelectClient.selected  = $scope.selectedProject;

                                    ProjectComponent.findSites($scope.quotation.projectId).then(function (data) {

  	               	                  for(var i=0;i<data.length;i++)
  	               	                  {
  	               	                      $scope.SelectSites[i+1] = data[i];
  	               	                      $scope.siteDisable = false;
  	               	                  }

                                    });
                                    $scope.SelectSite.selected = $scope.selectedSite;

                                    if($scope.quotation.images.length>0){
                                      //console.log("images found");
                                        for(var i=0;i<$scope.quotation.images.length;i++){
                                            RateCardComponent.findQuotationImages($scope.quotation._id,$scope.quotation.images[i]).
                                            then(function (response) {
                                              //console.log(response);
                                              //console.log(response.image);
                                                $scope.quotationImages.push(response);
                                            })
                                        }
                                    }

                                     $scope.loadQImagesNew = function(image,qId) {
                                        var eleId = 'quoImage';
                                        var ele = document.getElementById(eleId);
                                        ele.setAttribute('src',image);
                                    };

                                    if($scope.quotation.ticketId > 0) {
                                        TicketComponent.getTicketDetails($scope.quotation.ticketId).then(function(data){
                                          //console.log("Ticket details");
                                          //console.log(data);
                                            $scope.ticketStatus = data.status;
                                            $scope.loadingStop();
                                            });

                                    }else{
                                      $scope.loadingStop();
                                    }

                                    $scope.validCheck();

				                }else{
				                    $location.path('/quotation-list');
				                }

				            });


                          }else{
                             $location.path('/quotation-list');
                          }

			        };


					$scope.approveQuotation = function(quotation) {
					  //console.log(quotation)
						$('#approveQuotationModal').modal('hide');
						$scope.rejectOnBoardingLoader = true;
						$scope.quotation.remarks = $scope.remarks;
						console.log("Remarks for approve quotation");
						console.log($scope.quotation);

						RateCardComponent.approveQuotation(quotation).then(
								function(response) {
									$scope.rejectOnBoardingLoader = false;
									console.log(response);
									$scope.showNotifications('top','center','success','Quotation approved Successfully');
									//$scope.loadAllQuotations();
									//$location.path('/quotation-list');
									//$scope.refreshPage();
                                    $scope.retain = 1;
                                    $scope.search();
								})
					}

					$scope.rejectQuotation = function(quotation) {
						$('#rejectQuotationModal').modal('hide');
						$scope.rejectOnBoardingLoader = true;
						$scope.quotation.remarks = $scope.remarks;
						console.log("Remarks for approve quotation");
						console.log($scope.quotation);
						RateCardComponent.rejectQuotation(quotation).then(
								function(response) {
									$scope.rejectOnBoardingLoader = false;
									console.log(response);
									$scope.showNotifications('top','center','success','Quotation rejected Successfully');
									//$scope.loadAllQuotations();
									//$location.path('/quotation-list');
									//$scope.refreshPage();
                                    $scope.retain = 1;
                                    $scope.search();
								})
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

			        $scope.cancelQuotation = function () {

					 if($scope.status == 1){

			        	 $location.path('/tickets');
			        	 return false;

			         }else{

			         	/** @reatin - retaining scope value.**/
                        $rootScope.retain=1;
			         	$location.path('/quotation-list');
			         	return false;
			         }


			        };

			        $scope.refreshPage = function() {

			           $scope.loadAllQuotations();
			           //check
                        $scope.loadQuotation();
			        };

			        $scope.clearFilter = function() {
			        	//$('input#searchCreatedDate').data('DateTimePicker').clear();
			            //$('input#searchToDate').data('DateTimePicker').clear();
			            $scope.noData = false;
			        	$scope.clearField = true;
			        	$scope.siteFilterDisable = true;
			        	$scope.regionFilterDisable = true;
			            $scope.branchFilterDisable = true;
                        $scope.sitesList = null;

                        /** Ui-select scopes **/
                    	$scope.client.selected = null;
                    	$scope.sitesLists =  [];
                    	$scope.sitesListOne.selected =  null;
                    	$scope.regionsLists =  [];
                        $scope.regionsListOne.selected =  null;
                        $scope.branchsLists =  [];
                        $scope.branchsListOne.selected =  null;

                        $scope.searchCreatedDate = $filter('date')(new Date(), 'dd/MM/yyyy');
    					$scope.searchCreatedDateSer = new Date();
    					$scope.searchToDate = $filter('date')(new Date(), 'dd/MM/yyyy');
    	                $scope.searchToDateSer = new Date();
	        		    $scope.selectedProject = null;
			            $scope.selectedSite = null;
			            $scope.selectedStatus = null;
			            $scope.selectedId = null;
			            $scope.selectedTitle = null;
			            $scope.selectedCreatedBy = null;
			            $scope.selectedSentBy = null;
			            $scope.selectedApprovedBy = null;
			            $scope.searchProject = null;
						$scope.searchSite = null;
						$scope.searchId = null;
						$scope.searchTitle = null;
						$scope.searchCreatedBy = null;
						$scope.searchApprovedBy = null;
						$scope.searchStatus = null;
			            $scope.searchCriteria = {};
                        $scope.clearField = true;
			            $scope.pages = {
			                currPage: 1,
			                totalPages: 0
			            }

			            /* Root scope (search criteria) */
                        $rootScope.searchFilterCriteria.isDashboard = false;
			        }

			        $scope.isActiveAsc = '';
			        $scope.isActiveDesc = 'createdDate';

			        $scope.columnAscOrder = function(field){
			            $scope.selectedColumn = field;
			            $scope.isActiveAsc = field;
			            $scope.isActiveDesc = '';
			            $scope.isAscOrder = true;
			            $scope.search();
			            $scope.setPage(1);
			           //$scope.loadQuotations();
			        }

			        $scope.columnDescOrder = function(field){
			            $scope.selectedColumn = field;
			            $scope.isActiveDesc = field;
			            $scope.isActiveAsc = '';
			            $scope.isAscOrder = false;
			            $scope.search();
			            $scope.setPage(1);
			            //$scope.loadQuotations();
			        }

			        $scope.loadQuotations = function () {
			        	$scope.clearFilter();
			        	$scope.search();
		            };


			        $scope.searchFilter = function () {
			            $('.AdvancedFilterModal.in').modal('hide');
			            $scope.setPage(1);
			            $scope.search();
			         }



			          $scope.searchFilter1 = function () {
			            $scope.searchId = null;
						$scope.searchTitle = null;
						$scope.searchCreatedBy = null;
						$scope.searchApprovedBy = null;
						$scope.searchStatus = null;
			            $scope.searchCriteria={};
			            $scope.searchCriteria.quotationTitle =null;
			            $scope.searchCriteria.quotationCreatedBy =null;
			            $scope.searchCriteria.quotationApprovedBy =null;
			            $scope.searchCriteria.quotationStatus =null;
			            //$scope.setPage(1);
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
		        		/* Root scope (search criteria) start*/

                    if($rootScope.searchFilterCriteria.isDashboard){
                         $rootScope.isDashboard = true;
                         if($rootScope.searchFilterCriteria.projectId){
                            $scope.searchProject ={id:$rootScope.searchFilterCriteria.projectId,name:$rootScope.searchFilterCriteria.projectName};
                            $scope.client.selected =$scope.searchProject;
                            $scope.projectFilterFunction($scope.searchProject);
                        }else{
                           $scope.searchProject = null;
                           $scope.client.selected =$scope.searchProject;
                        }
                         if($rootScope.searchFilterCriteria.regionId){
                            $scope.searchRegion = {id:$rootScope.searchFilterCriteria.regionId,name:$rootScope.searchFilterCriteria.region}
                            $scope.regionsListOne.selected = $scope.searchRegion;
                            $scope.regionFilterFunction($scope.searchProject);
                        }else{
                           $scope.searchRegion = null;
                          $scope.regionsListOne.selected = $scope.searchRegion;
                        }
                        if($rootScope.searchFilterCriteria.branchId){
                            $scope.searchBranch = {id:$rootScope.searchFilterCriteria.branchId,name:$rootScope.searchFilterCriteria.branch}
                            $scope.branchsListOne.selected= $scope.searchBranch;
                             $scope.branchFilterFunction($scope.searchProject,$scope.searchRegion);

                        }else{
                           $scope.searchBranch = null;
                          $scope.branchsListOne.selected = $scope.searchBranch;

                        }

                         if($rootScope.searchFilterCriteria.siteId){
                            $scope.searchSite = {id:$rootScope.searchFilterCriteria.siteId,name:$rootScope.searchFilterCriteria.siteName};
                            $scope.sitesListOne.selected = $scope.searchSite;
                            $scope.siteFilterDisable=false;

                        }else{
                          $scope.searchSite = null;
                          $scope.sitesListOne.selected=$scope.searchSite;
                        }
                        if($rootScope.searchFilterCriteria.quotStatus){
                            $scope.searchStatus = $rootScope.searchFilterCriteria.quotStatus;
                        }else{
                           $scope.searchStatus = null;
                        }

                        if($rootScope.searchFilterCriteria.selectedFromDate) {
                            $scope.searchCriteria.quotationCreatedDate = $rootScope.searchFilterCriteria.selectedFromDate;
                            $scope.searchCreatedDate = $filter('date')($rootScope.searchFilterCriteria.selectedFromDate, 'dd/MM/yyyy');
                            $scope.searchCreatedDateSer = new Date($rootScope.searchFilterCriteria.selectedFromDate);
                        }
                        if($rootScope.searchFilterCriteria.selectedToDate) {
                            $scope.searchCriteria.toDate = $rootScope.searchFilterCriteria.selectedToDate;
                            $scope.searchToDate = $filter('date')($rootScope.searchFilterCriteria.selectedToDate, 'dd/MM/yyyy');
                            $scope.searchToDateSer = new Date($rootScope.searchFilterCriteria.selectedToDate);
                        }

                         /* Root scope (search criteria) end*/
                    }else{

		        	    if($scope.client.selected && $scope.client.selected.id !=0){
                            $scope.searchProject = $scope.client.selected;
                        }else if($stateParams.project){
                             $scope.searchProject = {id:$stateParams.project.id,name:$stateParams.project.name};
                             $scope.client.selected =$scope.searchProject;
                             $scope.projectFilterFunction($scope.searchProject);
                        }else{
                           $scope.searchProject = null;
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
                        if($scope.sitesListOne.selected && $scope.sitesListOne.selected.id !=0){
                            $scope.searchSite = $scope.sitesListOne.selected;
                        }else if($stateParams.site){
                              $scope.searchSite = {id:$stateParams.site.id,name:$stateParams.site.name};
                              $scope.sitesListOne.selected = $scope.searchSite;
                        }else{
                           $scope.searchSite = null;
                        }
		        	}

		        	$rootScope.searchFilterCriteria.isDashboard = false;

		        	 $scope.searchCriteria.findAll = false;

			        	if(!$scope.searchId && !$scope.searchTitle  && !$scope.searchProject && !$scope.searchSite
			        		&& !$scope.searchCreatedBy && !$scope.searchSentBy && !$scope.searchApprovedBy && !$scope.searchStatus
			        		&& !$scope.searchCreatedDate && !$scope.searchToDate){
			        		$scope.searchCriteria.findAll = true;
			        	}

			        	if($scope.searchProject) {
			        		$scope.searchCriteria.projectId = $scope.searchProject.id;
                            $scope.searchCriteria.projectName = $scope.searchProject.name;
			        	}else{
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

			        	if($scope.searchSite) {
			        		$scope.searchCriteria.siteId = $scope.searchSite.id;
                            $scope.searchCriteria.siteName = $scope.searchSite.name;
				    }/*else if($scope.sites) {
				    		$scope.searchCriteria.siteId = $scope.sites[0].id;
				    }*/
				    else{
				    	$scope.searchCriteria.siteId =null;
				    	$scope.searchCriteria.siteName = null;
				    }


			        	if($scope.searchStatus){
			        		$scope.searchCriteria.quotationStatus = $scope.searchStatus;

			        		$scope.searchCriteria.quotationIsSubmitted = false;
			        		$scope.searchCriteria.quotationIsArchived = false;
			        		$scope.searchCriteria.quotationIsRejected = false;
			        		$scope.searchCriteria.quotationIsDrafted = false;
			        		$scope.searchCriteria.quotationIsApproved = false;

			        		switch($scope.searchStatus){

				        		case "Waiting for approval" : $scope.searchCriteria.quotationIsSubmitted = true; break;
				        		case "Archived" : $scope.searchCriteria.quotationIsArchived = true; break;
				        		case "Rejected" : $scope.searchCriteria.quotationIsRejected = true; break;
				        		case "Pending" : $scope.searchCriteria.quotationIsDrafted = true; break;
				        		case "Approved" : $scope.searchCriteria.quotationIsApproved = true; break;
				        		//default:

			        		}
			        }else{
			        	$scope.searchCriteria.quotationStatus = null;
			        }

			        if($scope.searchId){
			        		$scope.searchCriteria.id = $scope.searchId;
			        }else{
			        	   $scope.searchCriteria.id = null;
			        }
	                if($scope.searchTitle){
	                    $scope.searchCriteria.quotationTitle = $scope.searchTitle;
	                }else{
	                	 $scope.searchCriteria.quotationTitle = null;
	                }

			        if($scope.searchCreatedBy) {
			        		$scope.searchCriteria.quotationCreatedBy = $scope.searchCreatedBy;
			        }else{
			        	$scope.searchCriteria.quotationCreatedBy = null;
			        }
			        if($scope.searchApprovedBy) {
			        		$scope.searchCriteria.quotationApprovedBy = $scope.searchApprovedBy;
			        }else{
			        	$scope.searchCriteria.quotationApprovedBy = null;
			        }


			        if($scope.searchCreatedDateSer) {
			        	 $scope.searchCriteria.quotationCreatedDate = $scope.searchCreatedDateSer;

		             }

			        if($scope.searchToDateSer) {
			        	 $scope.searchCriteria.toDate = $scope.searchToDateSer;

		             }

			        if($scope.searchSubmittedDateSer) {
			        		$scope.searchCriteria.quotationSubmittedDate = $scope.searchSubmittedDateSer;
			        }
			        /*else{
			        	$scope.searchCriteria.quotationSubmittedDate = null;
			        }*/
			        if($scope.searchApprovedDateSer) {
			        		$scope.searchCriteria.quotationApprovedDate = $scope.searchApprovedDateSer;
			        }
			        /*else{
			        	$scope.searchCriteria.quotationApprovedDate = null;
			        }*/


		           if($scope.pageSort){
		                $scope.searchCriteria.sort = $scope.pageSort;
		            }


		            if($scope.selectedColumn){

		                $scope.searchCriteria.columnName = $scope.selectedColumn;
		                $scope.searchCriteria.sortByAsc = $scope.isAscOrder;

		            }else{
		                $scope.searchCriteria.columnName ="createdDate";
		                $scope.searchCriteria.sortByAsc = false;
		            }

                     console.log("search criteria", JSON.stringify($scope.searchCriteria));
                     $scope.quotations = '';
                     $scope.quotationsLoader = false;
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
	                             if($scope.localStorage.quotationStatus){
	                             	$scope.searchStatus  = $scope.localStorage.quotationStatus;

	                             }else{
	                            	 $scope.searchStatus  = null;
	                             }
	                             if($scope.localStorage.quotationCreatedBy){
	                            	 $scope.searchCreatedBy = $scope.localStorage.quotationCreatedBy;
	                            }else{
	                            	 $scope.searchCreatedBy = "";
	                            }

	                             if($scope.localStorage.quotationCreatedDate){
	                            	 $scope.searchCreatedDate=$filter('date')($scope.localStorage.quotationCreatedDate, 'dd/MM/yyyy');
	                            	 $scope.searchCreatedDateSer= $scope.localStorage.quotationCreatedDate;
	                            }
	                             if($scope.localStorage.toDate){
	                            	 $scope.searchToDate=$filter('date')($scope.localStorage.toDate, 'dd/MM/yyyy');
	                            	 $scope.searchToDateSer= $scope.localStorage.toDate;
	                            }
	                             if($scope.localStorage.quotationApprovedBy){
	                            	 $scope.searchApprovedBy = $scope.localStorage.quotationApprovedBy;
	                            }else{
	                            	 $scope.searchApprovedBy = "";
	                            }

	                             if($scope.localStorage.quotationTitle){
	                            	 $scope.searchTitle = $scope.localStorage.quotationTitle;
	                            }else{
	                            	 $scope.searchTitle = "";
	                            }

	                    }

	                    $rootScope.retain = 0;

	                    $scope.searchCriteras  = $scope.localStorage;
	                 }else{

	                	 $scope.searchCriteras  = $scope.searchCriteria;
	                 }

	                 //$scope.searchCriteria.quotationCreatedDate = new Date();
	                 //$scope.searchCriteria.toDate = new Date();
	                 /* Localstorage (Retain old values while edit page to list) end */


                        //RateCardComponent.search($scope.searchCriteria).then(function (data) {
		        	RateCardComponent.getAllQuotations($scope.searchCriteras).then(function (data) {
		        	    $scope.quotations = data.transactions;
		        	    console.log('quotation',$scope.quotations);
		                $scope.quotationsLoader = true;

		                 /** retaining list search value.**/
                         getLocalStorage.updateSearch($scope.searchCriteras);

		                  /*
		                        ** Call pagination  main function **
		                    */
		                     $scope.pager = {};
		                     $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
		                     $scope.totalCountPages = data.totalCount;

		                   //console.log("Pagination",$scope.pager);
		                   //console.log("quotations",$scope.quotations);

			        		$scope.pages.currPage = $scope.pages.currPage;
			                $scope.pages.totalPages = data.totalPages;

			                if($scope.quotations && $scope.quotations.length > 0 ){
			                    $scope.showCurrPage = data.currPage;
			                    $scope.pageEntries = $scope.quotations.length;
			                    $scope.totalCountPages = data.totalCount;
		                        $scope.pageSort = 10;

								$scope.noData = false;

			                }else{
			                     $scope.noData = true;
			                }
		            }).catch(function(){
                        $scope.noData = true;
                        $scope.quotationsLoader = true;
                        $scope.showNotifications('top','center','danger','Unable to load quotation list..');
                    });

		        };



			         //init load
                        $scope.initLoad = function(){
                             $scope.loadPageTop();
                             //$scope.loadAllQuotations();
                             $scope.setPage(1);
                             $scope.init();

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

					        $scope.closeTicket = function (ticket){

					            $scope.cTicket={id :ticket,status :'Closed'};
					        }

					        $scope.closeTicketConfirm =function(cTicket){

					        JobComponent.updateTicket(cTicket).then(function(data) {
						        		if(data.errorMessage) {
							                $scope.success = null;
							                $scope.showNotifications('top','center','danger',data.errorMessage);
							                $(".fade").removeClass("modal-backdrop");
							                $state.reload();
						        		}else {
						                $scope.success = 'OK';
						                $scope.showNotifications('top','center','success','Ticket status updated');
						                $(".fade").removeClass("modal-backdrop");
						                $scope.ticketStatus = 'Closed';
						                $state.reload();
						        		}
					            }).catch(function(){
                                    $scope.showNotifications('top','center','danger','Unable to updating ticket list..');
                               });
					        }



					        $scope.validCheck = function(){

                               if(($scope.serviceRateCardDetails.length > 0 ) ||
                               	($scope.labourRateCardDetails.length > 0) ||
                               	($scope.materialRateCardDetails.length > 0)){
	                               $scope.quoteStatus = false;
						        }else{
						        	$scope.quoteStatus = true;
						        }

					        }


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
					        };


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
