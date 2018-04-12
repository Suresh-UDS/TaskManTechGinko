'use strict';

angular
		.module('timeSheetApp')
		.controller(
				'QuotationController',
				function($scope, $rootScope, $state, $timeout, $http, $document, $window,
						$stateParams, $location, RateCardComponent, ProjectComponent, SiteComponent) {

					$scope.selectedProject;

					$scope.selectedSite;

					$scope.quotations;

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
					
					$scope.init = function() {
						console.log('readonly value -'+ $stateParams.viewOnly);
						if($state.current.name == 'view-quotation') {
							$scope.viewOnly = $stateParams.viewOnly;
							$document[0].getElementById('quotationTitle').disabled = $stateParams.viewOnly;
							$document[0].getElementById('quotationDescription').disabled = $stateParams.viewOnly;
							$document[0].getElementById('project').disabled = $stateParams.viewOnly;
							$document[0].getElementById('site').disabled = $stateParams.viewOnly;
							$document[0].getElementById('serviceEntryFields').style.visibility = $stateParams.viewOnly ? 'hidden' : 'visible';
							$document[0].getElementById('labourEntryFields').style.visibility = $stateParams.viewOnly ? 'hidden' : 'visible';
							$document[0].getElementById('materialEntryFields').style.visibility = $stateParams.viewOnly ? 'hidden' : 'visible';
							$document[0].getElementById('actionButtons').style.visibility = $stateParams.viewOnly ? 'hidden' : 'visible';
							$document[0].getElementById('closeButton').style.visibility = $stateParams.viewOnly ? 'visible' : 'hidden';							
						}

						$scope.loadProjects();
					}

					$scope.loadProjects = function() {
						ProjectComponent.findAll().then(function(data) {
							console.log("Loading all projects")
							$scope.projects = data;
						});
					};
					
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
				                    $scope.hideLoader();
	
				                });
				        	}else {
				            	SiteComponent.findAll().then(function (data) {
				                    $scope.sites = data;
				                    $scope.hideLoader();
	
				                });
				        	}
			        };					

					$scope.loadAllQuotations = function() {
						RateCardComponent.getAllQuotations().then(
								function(response) {
									console.log('quotations - '+ response);
									$scope.quotations = response;
								})

					};

					$scope.addMaterial = function() {
						console.log('material cost - '
								+ parseInt($scope.materialQty) + ', '
								+ parseFloat($scope.materialUnitPrice))
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
					}

					$scope.removeMaterial = function(ind) {
						$scope.materialTotalCost -= parseFloat($scope.materialRateCardDetails[ind].cost);
						$scope.totalCost -= parseFloat($scope.materialRateCardDetails[ind].cost);
						$scope.materialRateCardDetails.splice(ind, 1);
					}

					$scope.addService = function() {
						console.log('service cost - '
								+ parseInt($scope.serviceQty) + ', '
								+ parseFloat($scope.serviceUnitPrice))
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
					}

					$scope.removeService = function(ind) {
						$scope.serviceTotalCost -= parseFloat($scope.serviceRateCardDetails[ind].cost);
						$scope.totalCost -= parseFloat($scope.serviceRateCardDetails[ind].cost);
						$scope.serviceRateCardDetails.splice(ind, 1);
					}

					$scope.addLabour = function() {
						console.log('Labour cost - '
								+ parseInt($scope.labourQty) + ', '
								+ parseFloat($scope.labourUnitPrice))
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
					}

					$scope.removeLabour = function(ind) {
						$scope.labourTotalCost -= parseFloat($scope.labourRateCardDetails[ind].cost);
						$scope.totalCost -= parseFloat($scope.labourRateCardDetails[ind].cost);
						$scope.labourRateCardDetails.splice(ind, 1);
					}

					$scope.saveQuotation = function(mode) {
						$scope.quotation.siteId = $scope.selectedSite.id;
						$scope.quotation.siteName = $scope.selectedSite.name;
						$scope.quotation.projectId = $scope.selectedProject.id;
						$scope.quotation.projectName = $scope.selectedProject.name;
						
						$scope.rateCardDetails = $scope.serviceRateCardDetails
								.concat($scope.labourRateCardDetails,
										$scope.materialRateCardDetails);
						$scope.quotation.rateCardDetails = $scope.rateCardDetails;
						$scope.quotation.drafted = true;
						$scope.quotation.mode = mode;
						RateCardComponent.createQuotation($scope.quotation)
								.then(function(response) {
									console.log(response);
									$scope.showNotifications('top','center','success','Quotation saved Successfully');									
									//$scope.loadAllQuotations();
									$location.path('/quotation-list');
								}).catch(function (response) {
			                        $scope.success = null;
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
					}

					$scope.selectQuotation = function(quotation) {

						$scope.quotation = quotation;
					}
					
			        $scope.loadQuotation = function() {
			        		console.log('quotation id - ' + $stateParams.id);
			        		RateCardComponent.findQuotation($stateParams.id).then(function (data) {
			        			$scope.loadingStart();
			        				console.log('quotation response - '+ JSON.stringify(data))
				                $scope.quotation = data;
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
				                $scope.loadSelectedProject($scope.quotation.projectId);
				                $scope.selectedSite = {};
				                $scope.selectedSite.id = $scope.quotation.siteId;
				                $scope.selectedSite.name = $scope.quotation.siteName;
				            });
			        };


					$scope.approveQuotation = function(quotation) {
						RateCardComponent.approveQuotation(quotation).then(
								function(response) {
									console.log(response);
									$scope.showNotifications('top','center','success','Quotation approved Successfully');									
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
			        		$location.path('/quotation-list');
			        };

			        $scope.refreshPage = function() {
			           $scope.clearFilter();
			           $scope.loadQuotations();
			        };

			        $scope.clearFilter = function() {
			        		$scope.searchCriteria = {};
			        }


			        $scope.search = function () {
		        	var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
		        	if(!$scope.searchCriteria) {
		            	var searchCriteria = {
		            			currPage : currPageVal
		            	}
		            	$scope.searchCriteria = searchCriteria;
		        	}

		        	$scope.searchCriteria.currPage = currPageVal;
		        	console.log('Selected  module action -' + $scope.selectedQuotations);

		        	if(!$scope.selectedQuotations) {
		        		if($rootScope.searchCriteriaChecklist) {
		            		$scope.searchCriteria = $rootScope.searchCriteriaChecklist;
		        		}else {
		        			$scope.searchCriteria.findAll = true;
		        		}

		        	}else {
			        	if($scope.selectedQuotations) {
			        		$scope.searchCriteria.findAll = false;
				        	$scope.searchCriteria.checklistId = $scope.selectedQuotations.id;
				        	$scope.searchCriteria.name = $scope.selectedQuotations.name;
				        	$scope.searchCriteria.activeFlag = $scope.selectedQuotations.activeFlag;
				        	console.log('selected user role id ='+ $scope.searchCriteria.checklistId);
			        	}else {
			        		$scope.searchCriteria.checklistId = 0;
			        	}
		        	}
		        	console.log($scope.searchCriteria);
		        	QuotationsComponent.search($scope.searchCriteria).then(function (data) {
		                $scope.quotations = data.transactions;
		                $scope.quotationsLoader = true;
		                console.log($scope.quotations);
		                $scope.pages.currPage = data.currPage;
		                $scope.pages.totalPages = data.totalPages;
		                if($scope.quotations == null){
		                    $scope.pages.startInd = 0;
		                }else{
		                    $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
		                }

		                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
		                $scope.pages.totalCnt = data.totalCount;
		            	$scope.hide = true;
		            });
		        	$rootScope.searchQuotations = $scope.searchCriteria;
		        	if($scope.pages.currPage == 1) {
		            	$scope.firstStyle();
		        	}
		        };

			        

			         //init load
                        $scope.initLoad = function(){ 
                             $scope.loadPageTop(); 
                             $scope.loadAllQuotations(); 
                             $scope.init(); 
                          
                         }

                       //Loading Page go to top position
                        $scope.loadPageTop = function(){
                            //alert("test");
                            //$("#loadPage").scrollTop();
                            $("#loadPage").animate({scrollTop: 0}, 2000);
                        }

                           // Page Loader Function

					        $scope.loadingStart = function(){ $('.pageCenter').show();$('.overlay').show();}
					        $scope.loadingAuto = function(){
					            $scope.loadingStart(); 
					            $scope.loadtimeOut = $timeout(function(){
					            
					            //console.log("Calling loader stop");
					            $('.pageCenter').hide();$('.overlay').hide();
					                    
					        }, 2000);
					           // alert('hi');
					        }
					        $scope.loadingStop = function(){
					            
					            console.log("Calling loader");
					            $('.pageCenter').hide();$('.overlay').hide();
					                    
					        }

				});
