'use strict';

angular
		.module('timeSheetApp')
		.controller(
				'QuotationController',
				function($scope, $rootScope, $state, $timeout, $http, $document, $window,
						$stateParams, $location, RateCardComponent,TicketComponent, JobComponent,
						 ProjectComponent, SiteComponent,PaginationComponent,$filter,getLocalStorage) {

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


			        $scope.selectedSubmittedDate = $filter('date')(new Date(), 'dd/MM/yyyy');
			        $scope.selectedApprovedDate = $filter('date')(new Date(), 'dd/MM/yyyy');

			        $scope.selectedSubmittedDateSer = new Date();
			        $scope.selectedApprovedDateSer = new Date();

			        $scope.initCalender = function(){

			            demo.initFormExtendedDatetimepickers();

			        };

			        $rootScope.initScrollBar();

			        $('input#submittedDateFilter').on('dp.change', function(e){
			            console.log(e.date);
			            console.log(e.date._d);
			            $scope.selectedSubmittedDateSer = e.date._d;

			            $.notifyClose();

		               $scope.selectedSubmittedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');



			        });
			        $('input#approvedDateFilter').on('dp.change', function(e){
			            console.log(e.date);
			            console.log(e.date._d);
			            $scope.selectedApprovedDateSer = e.date._d;

			            $.notifyClose();

		                $scope.selectedApprovedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');

			        });

			        $scope.initCalender();

					$scope.init = function() {

                        console.log("State parameters");
                        console.log($stateParams);
                        if($stateParams.ticketId){
                            TicketComponent.getTicketDetails($stateParams.ticketId).then(function(data){
                                console.log("Ticket details");
                                console.log(data);
                                $scope.quotation.title =data.title;
                                $scope.quotation.description = data.description;
                                $scope.quotation.ticketId = data.id;
                                $scope.selectedProject = {id:data.projectId, name:data.projectName};
                                $scope.selectedSite = {id:data.siteId,name:data.siteName};
                                $scope.status = 1;
                                $scope.ticketQuot = true;

                                /*if(data.siteId){
                                    SiteComponent.findOne(data.siteID).then(function (data) {
                                        console.log(data);
                                        $scope.selectedSite = data;
                                    })
                                }*/
                            })
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
                        console.log($scope.selectedProject)
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
                                console.log("Loading all projects")
                                $scope.projects = data;
                                //$scope.selectedProject = $scope.projects[0];
                                console.log()
                                if($state.current.name != 'edit-quotation' && $state.current.name != 'view-quotation')
                                {
                                    $scope.selectedProject = null;
                                }
                                for(var i=0;i<$scope.projects.length;i++)
                                {
                                    $scope.uiClient[i] = $scope.projects[i].name;
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
                              console.log($scope.sitesList)
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
                                console.log($scope.selectedImageFile);
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
			                        console.log('Error - '+ JSON.stringify(response.data));
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
                            console.log('quotation id - ' + $stateParams.id);
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

                                    if($scope.quotation.images.length>0){
                                        console.log("images found");
                                        for(var i=0;i<$scope.quotation.images.length;i++){
                                            RateCardComponent.findQuotationImages($scope.quotation._id,$scope.quotation.images[i]).
                                            then(function (response) {
                                                console.log(response);
                                                console.log(response.image);
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
                                            console.log("Ticket details");
                                            console.log(data);
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
					    console.log(quotation)
						RateCardComponent.approveQuotation(quotation).then(
								function(response) {
									console.log(response);
									$scope.showNotifications('top','center','success','Quotation approved Successfully');
									//$scope.loadAllQuotations();
									//$location.path('/quotation-list');
									$scope.refreshPage();
								})
					}

					$scope.rejectQuotation = function(quotation) {
						RateCardComponent.rejectQuotation(quotation).then(
								function(response) {
									console.log(response);
									$scope.showNotifications('top','center','success','Quotation rejected Successfully');
									//$scope.loadAllQuotations();
									//$location.path('/quotation-list');
									$scope.refreshPage();
								})
					}

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

			        $scope.showNotifications= function(position,alignment,color,msg){
			            demo.showNotification(position,alignment,color,msg);
			        }

			        $scope.cancelQuotation = function () {

					 if($scope.status == 1){

			        	 $location.path('/tickets');

			         }else{

			         	/** @reatin - retaining scope value.**/
                        $rootScope.retain=1;

			         	$location.path('/quotation-list');
			         }


			        };

			        $scope.refreshPage = function() {

			           $scope.loadAllQuotations();
			           //check
                        $scope.loadQuotation();
			        };

			        $scope.clearFilter = function() {
			            $scope.noData = false;
			        	$scope.clearField = true;
			        	$scope.siteFilterDisable = true;
                        $scope.sitesList = null;
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
			        }

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
			            $('.AdvancedFilterModal.in').modal('hide');
			            //$scope.setPage(1);
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
		        	 $scope.searchCriteria.findAll = false;

			        	if(!$scope.searchId && !$scope.searchTitle  && !$scope.searchProject && !$scope.searchSite
			        		&& !$scope.searchCreatedBy && !$scope.searchSentBy && !$scope.searchApprovedBy && !$scope.searchStatus){
			        		$scope.searchCriteria.findAll = true;
			        	}

			        	if($scope.searchProject) {
			        		$scope.searchCriteria.projectId = $scope.searchProject.id;
                            $scope.searchCriteria.projectName = $scope.searchProject.name;
			        	}else{
			        		$scope.searchCriteria.projectId = null;
			        	}

			        	if($scope.searchSite) {
			        		$scope.searchCriteria.siteId = $scope.searchSite.id;
                            $scope.searchCriteria.siteName = $scope.searchSite.name;
				    }/*else if($scope.sites) {
				    		$scope.searchCriteria.siteId = $scope.sites[0].id;
				    }*/
				    else{
				    	$scope.searchCriteria.siteId =null;
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

			        if($scope.searchSubmittedDateSer) {
			        		$scope.searchCriteria.quotationSubmittedDate = $scope.searchSubmittedDateSer;
			        }/*else{
			        	$scope.searchCriteria.quotationSubmittedDate = null;
			        }*/
			        if($scope.searchApprovedDateSer) {
			        		$scope.searchCriteria.quotationApprovedDate = $scope.searchApprovedDateSer;
			        }/*else{
			        	$scope.searchCriteria.quotationApprovedDate = null;
			        }*/


		            if($scope.pageSort){
		                $scope.searchCriteria.sort = $scope.pageSort;
		            }


		            /*if($scope.selectedColumn){

		                $scope.searchCriteria.columnName = $scope.selectedColumn;
		                $scope.searchCriteria.sortByAsc = $scope.isAscOrder;

		            }else{
		                $scope.searchCriteria.columnName ="id";
		                $scope.searchCriteria.sortByAsc = true;
		            }*/

                     console.log("search criteria", JSON.stringify($scope.searchCriteria));
                     $scope.quotations = '';
                     $scope.quotationsLoader = false;
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
	                            }else{
	                               $scope.searchProject = null;
	                            }
	                            if($scope.localStorage.siteId){
	                              $scope.searchSite = {id:$scope.localStorage.siteId,name:$scope.localStorage.siteName};
	                            }else{
	                               $scope.searchSite = null;
	                            }

	                    }

	                    $rootScope.retain = 0;

	                    var searchCriteras  = $scope.localStorage;
	                 }else{

	                    var searchCriteras  = $scope.searchCriteria;
	                 }

	                 $scope.searchCriteria.quotationCreatedDate = new Date();
	                 $scope.searchCriteria.toDate = new Date();
	                 /* Localstorage (Retain old values while edit page to list) end */


                        //RateCardComponent.search($scope.searchCriteria).then(function (data) {
		        	RateCardComponent.getAllQuotations(searchCriteras).then(function (data) {
		        	    $scope.quotations = data;
		                //$scope.quotations = data.transactions;
		                $scope.quotationsLoader = true;

		                 /** retaining list search value.**/
                         getLocalStorage.updateSearch(searchCriteras);

		                  /*
		                        ** Call pagination  main function **
		                    */
		                     $scope.pager = {};
		                     $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
		                     $scope.totalCountPages = data.totalCount;

		                     console.log("Pagination",$scope.pager);
		                     console.log("quotations",$scope.quotations);

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
		            });

		        };



			         //init load
                        $scope.initLoad = function(){
                             $scope.loadPageTop();
                             $scope.loadAllQuotations();
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
					            })
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



				});
