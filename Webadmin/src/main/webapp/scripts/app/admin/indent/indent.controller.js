'use strict';

angular.module('timeSheetApp')
    .controller('IndentController', function ($rootScope, $scope, $state, $timeout,
    		ProjectComponent, SiteComponent, EmployeeComponent, InventoryComponent, IndentComponent, $http, $stateParams, $location, PaginationComponent) {

		$scope.selectedProject = {};

		$scope.selectedSite = {};

		$scope.selectedEmployee = {};

		$scope.selectedItemCode = {};

		$scope.selectedMaterialItems = [];

		$scope.indentObject = {};

		$scope.selectedRefNumber = null;

		$rootScope.loginView = false;

		$scope.pages = { currPage : 1};

		$scope.pager = {};

	    $scope.noData = false;

	    $scope.issuedQty = null;

		$scope.refreshPage = function() {
			 $scope.clearFilter();
		}

        $scope.conform = function(text)
        {
            $rootScope.conformText = text;
            $('#conformationModal').modal();

        }
        $rootScope.back = function (text) {
            if(text == 'cancel' || text == 'back'){
                /** @reatin - retaining scope value.**/
                $rootScope.retain=1;
                // $scope.cancelEmployee();
            }else if(text == 'save'){
                $scope.saveIndent();
            }else if(text == 'update'){
                /** @reatin - retaining scope value.**/
                $rootScope.retain=1;
                $scope.updateIndent()
            }
        };
        $scope.clearFilter = function() {
            $scope.selectedSite = null;
            $scope.selectedProject = null;
            $scope.searchProject = null;
            $scope.searchSite = null;
            $scope.searchCriteria = {};
            $scope.searchRequestedDate = null;
			$scope.searchIssuedDate = null;
            $scope.localStorage = null;
            $rootScope.searchCriteriaSite = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            $scope.search();
        };

		//init load
		$scope.initLoad = function(){
			$scope.loadProjects();
		    $scope.loadPageTop();
		    $scope.loadAllUOM();
		    $scope.searchFilter();
		 }

		$scope.initList = function() {
			$scope.loadMaterialIndents();
			$scope.setPage(1);
		}

		$scope.loadMaterialIndents = function() {
			$scope.refreshPage();
	    	$scope.search();
	    	$location.path('/indent-list');
		}

		$scope.loadProjects = function() {
        	ProjectComponent.findAll().then(function (data) {
        		console.log("All projects");
        		$scope.projects = data;
        		console.log(data);
        		$scope.loadingStop();
        	     for(var i=0;i<$scope.projects.length;i++)
                 {
                     $scope.uiClient[i] = $scope.projects[i].name;
                 }
                 $scope.clientDisable = false;
                 $scope.clientFilterDisable = false;
        	});

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
        }

        $scope.selectProject = function(project)
        {
            $scope.searchProject = $scope.projectsList[$scope.uiClient.indexOf(project)]
            console.log('Project dropdown list:',$scope.searchProject)
        }
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
            $scope.searchSite = $scope.sites[$scope.uiSite.indexOf(site)]
            $scope.hideSite = true;
            console.log('Site dropdown list:',$scope.searchSite)
        }
        $scope.addProject = function (selectedProject) {
            $scope.selectedProject = $scope.projects[$scope.uiClient.indexOf(selectedProject)]
            $scope.edit = false;
        }

        //Filter
        $scope.filter = false;
        $scope.clientFilterDisable = true;
        $scope.siteFilterDisable = true;
        $scope.siteSpin = false;
        $scope.loadDepSites = function (searchProject) {
            $scope.searchSite = null;
            $scope.hideSite = false;
            if($scope.localStorage)
            {
                $scope.localStorage.siteName = null;
            }
            $scope.searchCriteria.siteName = null;
            $scope.siteSpin = true;
            $scope.filter = false;
            $scope.searchProject = $scope.projects[$scope.uiClient.indexOf(searchProject)]
            if(jQuery.isEmptyObject($scope.selectedProject) == false) {
                   var depProj=$scope.selectedProject.id;
            }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                    var depProj=$scope.searchProject.id;
            }else{
                    var depProj=0;
            }

            ProjectComponent.findSites(depProj).then(function (data) {
                $scope.selectedSite = null;
                $scope.sites = data;
                for(var i=0;i<$scope.sites.length;i++)
                {
                    $scope.uiSite[i] = $scope.sites[i].name;
                }
                $scope.siteFilterDisable = false;
                $scope.siteSpin = false;
            });
        };


        //sites
        $scope.siteSpin = false;
        $scope.loadSites = function () {

        	console.log("selected project - " + JSON.stringify($scope.selectedProject));
        	if($scope.selectedProject) {
                $scope.siteSpin = true;
            	ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
                    $scope.sites = data;
                    $scope.siteSpin = false;
                    // alert(JSON.stringify($scope.sites));
                });
        	}else {
            	SiteComponent.findAll().then(function (data) {
                    $scope.sites = data;
                });
        	}
        };

        $scope.loadAllSites = function() {
        	SiteComponent.findAll().then(function (data) {
                $scope.sites = data;
            });
        }

        $scope.loadAllEmployee = function() {
        	EmployeeComponent.findAll().then(function (data) {
                $scope.employees = data;
            });
        }

        //Employees
        $scope.empSpin = false;
        $scope.loadEmployees = function () {

            if($scope.selectedSite && $scope.selectedSite.id){
                $scope.empSpin = true;
               var empParam = {siteId: $scope.selectedSite.id, list: true};
               EmployeeComponent.search(empParam).then(function (data) {
                   console.log(data);
                   $scope.employees = data.transactions;
                   $scope.empSpin = false;
                   $scope.employees = $scope.employees === null ? [] : $scope.employees;
               });
            }
        }

        //Material
        $scope.matSpin = false;
        $scope.loadMaterials = function() {

        	$scope.search = {};
        	if($scope.selectedSite && $scope.selectedProject) {
                $scope.matSpin = true;
        		$scope.search.projectId = $scope.selectedProject.id;
    			$scope.search.siteId = $scope.selectedSite.id;
            	InventoryComponent.search($scope.search).then(function(data) {
    				console.log(data);
    				$scope.materials = data.transactions;
                    $scope.matSpin = false;
                    $scope.materials = $scope.materials === null ? [] : $scope.materials;
    			});
        	}
        }

        $scope.loadAllUOM = function() {
        	InventoryComponent.getMaterialUOM().then(function(data){
        		console.log(data);
        		$scope.UOMs = data;
        	});
        }

		$scope.viewIndents = function() {
			IndentComponent.findById($stateParams.id).then(function(data) {
				console.log(data);
				$scope.loadingStop();
				$scope.materialIndentObj = data;
			});
		}

		$scope.editIndent = function() {
			IndentComponent.findById($stateParams.id).then(function(data) {
				console.log(data);
				$scope.loadingStop();
				$scope.editIndentObj = data;
				$scope.selectedRefNumber = $scope.editIndentObj.indentRefNumber;
				$scope.selectedProject = {id: $scope.editIndentObj.projectId };
				$scope.selectedSite = {id: $scope.editIndentObj.siteId };
				$scope.selectedEmployee = {id: $scope.editIndentObj.requestedById }
				$scope.materialItems = $scope.editIndentObj.items;
				$scope.search = {};
				$scope.search.projectId = $scope.editIndentObj.projectId;
				$scope.search.siteId = $scope.editIndentObj.siteId;
				InventoryComponent.search($scope.search).then(function(data) {
					console.log(data);
					$scope.materials = data.transactions;
				});

			});
		}

		$scope.change = function() {
			console.log($scope.selectedItemCode);
			$scope.selectedItemName = $scope.selectedItemCode.name;
			$scope.selectedStoreStock = $scope.selectedItemCode.storeStock;
			$scope.selectedQuantity = "";
		}

		$scope.addMaterialItem = function() {
			$scope.material = {};
			$scope.materialItems = $scope.materialItems ? $scope.materialItems : [];
			if($scope.selectedItemCode.storeStock >=  $scope.selectedQuantity){
				if(checkDuplicateInObject($scope.selectedItemCode.id, $scope.materialItems)) {
					$scope.showNotifications('top','center','danger','Already exists same item in the list');
				}else{
					$scope.material.materialName = $scope.selectedItemName;
					$scope.material.materialId = $scope.selectedItemCode.id;
					$scope.material.materialItemCode = $scope.selectedItemCode.itemCode;
					$scope.material.materialStoreStock = $scope.selectedItemCode.storeStock;
					$scope.material.quantity = $scope.selectedQuantity;
					$scope.material.materialUom = $scope.selectedItemCode.uom;
					$scope.material.pendingQuantity = $scope.selectedQuantity;
					$scope.materialItems.push($scope.material);

                    $scope.selectedItemName = null;
                    $scope.selectedItemCode = {};
                    $scope.selectedStoreStock = null;
                    $scope.selectedQuantity = null;


				}
			}else{
				$scope.showNotifications('top','center','danger','Quantity cannot execeeds to store stock');
			}

		}

		function checkDuplicateInObject(id, array) {
			var isDuplicate = false;
			if(array != null){
				array.map(function(item){


					if(item.materialId === id){
						return isDuplicate = true;
					}
				});
			}
			return isDuplicate;
		}

		$scope.saveIndent = function() {
            $scope.saveLoad = true;
			if($scope.selectedProject) {
				$scope.indentObject.projectId = $scope.selectedProject.id;
			}
			if($scope.selectedSite) {
				$scope.indentObject.siteId = $scope.selectedSite.id;
			}
			if($scope.selectedEmployee) {
				$scope.indentObject.requestedById = $scope.selectedEmployee.id;
			}
			if($scope.materialItems) {
				$scope.indentObject.items = $scope.materialItems;
			}
			$scope.indentObject.indentRefNumber = $scope.selectedRefNumber;
			$scope.indentObject.requestedDate = new Date();
			console.log($scope.indentObject);
			$scope.loadingStart();
			IndentComponent.create($scope.indentObject).then(function(response) {
				console.log(response);
                $scope.saveLoad = false;
				$scope.loadingStop();
				if(response.status === 201 && response.statusText==="Created") {
					$scope.showNotifications('top','center','success','Material Indent has been added successfully.');
					$location.path('/indent-list');
				}else{
					$scope.showNotifications('top','center','danger','Material Indent has not been created.');
				}
			}).catch(function(response){
                $scope.saveLoad = false;
				console.log(response);
				$scope.success = null;
                $scope.loadingStop();
                $scope.showNotifications('top','center','danger','Unable to create Material Indent. Please try again later..');
			});

		}

		$scope.validate = function(material, issuedQty) {
			console.log(material);
			console.log(issuedQty);
			if(material.pendingQuantity >= issuedQty){
				console.log("save issued indent");
				material.currentQuantity = issuedQty;
			}else{
				$scope.showNotifications('top','center','danger','Quantity cannot exceeds a required quantity');
			}

		}

		$scope.saveIndentTrans = function() {
			console.log("save indent transaction called");
			console.log($scope.materialIndentObj);
			$scope.loadingStart();
			if($scope.materialIndentObj) {
				if($scope.materialIndentObj.items.length > 0) {
					console.log($scope.materialIndentObj);
					$scope.materialIndentObj.items.map(function(item) {
						if(item.currentQuantity >= 0) {
							item.issuedQuantity = item.currentQuantity;
						}
					});
				}
				console.log($scope.materialIndentObj);
				IndentComponent.createTransaction($scope.materialIndentObj).then(function(data) {
					console.log(data);
					$scope.loadingStop();
					$scope.showNotifications('top','center','success','Material Transaction has been added successfully.');
					$location.path('/inventory-transaction-list');
				}).catch(function(data){
					$scope.success = null;
	                $scope.loadingStop();
	                $scope.showNotifications('top','center','danger','Unable to view Material Transaction.');
				});
			}

		}



		$scope.showUpdateBtn = false;

		$scope.editMaterial = function(index, item) {
			console.log(item);
			console.log(index);
			$scope.updateMaterial = item;
			$scope.indexOf = index;
			$scope.showUpdateBtn = true;
			$scope.selectedItemName = $scope.updateMaterial.materialName;
			$scope.selectedItemCode = {id: $scope.updateMaterial.materialId };
			$scope.selectedStoreStock = $scope.updateMaterial.materialStoreStock;
			$scope.selectedQuantity = $scope.updateMaterial.pendingQuantity;
		}

		$scope.updateMaterialItem = function(){
			if($scope.updateMaterial.materialStoreStock >= $scope.selectedQuantity){
				$scope.updateMaterial.quantity = $scope.selectedQuantity;
				$scope.updateMaterial.pendingQuantity =  $scope.selectedQuantity;
				console.log($scope.indexOf);
				console.log($scope.updateMaterial);
				updateItems($scope.indexOf, $scope.updateMaterial);
			}else{
				$scope.showNotifications('top','center','danger','Quantity cannot execeeds to store stock');
			}
		}

		$scope.selectedRow = null;

		function updateItems(index, object) {
            $scope.showUpdateBtn = false;
			$scope.materialItems[index] = object;
			$scope.selectedRow = index;
			$scope.selectedItemName = null;
			$scope.selectedItemCode = {};
			$scope.selectedStoreStock = null;
			$scope.selectedQuantity = null;
			$timeout(function(){
				$scope.selectedRow = null;
			},1000);
		}

		$scope.updateIndent = function() {
            $scope.saveLoad = true;
			if($scope.selectedProject) {
				$scope.editIndentObj.projectId = $scope.selectedProject.id;
			}
			if($scope.selectedSite) {
				$scope.editIndentObj.siteId = $scope.selectedSite.id;
			}
			if($scope.selectedEmployee) {
				$scope.editIndentObj.requestedById = $scope.selectedEmployee.id;
			}
			if($scope.materialItems) {
				$scope.editIndentObj.items = $scope.materialItems;
			}
			$scope.editIndentObj.indentRefNumber = $scope.selectedRefNumber;

			console.log($scope.editIndentObj);
			IndentComponent.update($scope.editIndentObj).then(function(resp){
				console.log(resp);
				$scope.loadingStop();
                $scope.saveLoad = false;
				if(resp.status === 200 && resp.statusText==="OK") {
					$scope.showNotifications('top','center','success','Material Indent has been updated successfully.');
					$location.path('/indent-list');
				}else{
					$scope.showNotifications('top','center','danger','Material Indent has not been updated.');
				}
			}).catch(function(resp){
				console.log(resp);
                $scope.saveLoad = false;
				$scope.success = null;
                $scope.loadingStop();
                $scope.showNotifications('top','center','danger','Unable to update Material Indent. Please try again later..');
			});
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
        	console.log('Selected  indent -' + JSON.stringify($scope.selectedIndent));

        	if(!$scope.selectedIndentlist) {
        		if($rootScope.selectedIndentlist) {
            		$scope.searchCriteria = $rootScope.selectedIndentlist;
        		}else {
        			$scope.searchCriteria.findAll = true;
        		}

        	}else {
	        	if($scope.selectedIndentlist) {
	        		$scope.searchCriteria.findAll = false;
		        	$scope.searchCriteria.indentlistId = $scope.selectedIndentlist.id;
		        	$scope.searchCriteria.name = $scope.selectedIndentlist.name;
		        	$scope.searchCriteria.activeFlag = $scope.selectedIndentlist.activeFlag;
		        	console.log('selected inventory id ='+ $scope.searchCriteria.indentlistId);
	        	}else {
	        		$scope.searchCriteria.indentlistId = 0;
	        	}
        	}
        	if($scope.searchProject) {
        		$scope.searchCriteria.projectId = $scope.searchProject.id;
        	}
        	if($scope.searchSite) {
        		$scope.searchCriteria.siteId = $scope.searchSite.id;
        	}
        	if($scope.searchRequestedDate) {
        		$scope.searchCriteria.requestedDate = $scope.searchRequestedDate;
        	}
        	if($scope.searchIssuedDate) {
        		$scope.searchCriteria.issuedDate = $scope.searchIssuedDate;
        	}
        	if($scope.searchReferenceNo){
        		$scope.searchCriteria.indentRefNumber = $scope.searchReferenceNo;
        	}
            console.log("search criteria",$scope.searchCriteria);
            $scope.materialIndents = '';
            $scope.purchaseReqLoader = false;
            $scope.loadPageTop();
            IndentComponent.search($scope.searchCriteria).then(function (data) {
            	console.log(data);
                $scope.materialIndents = data.transactions;
                $scope.purchaseReqLoader = true;
                $scope.loadingStop();

                 /*
                    ** Call pagination  main function **
                */
                 $scope.pager = {};
                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                 $scope.totalCountPages = data.totalCount;

                 console.log("Pagination",$scope.pager);

                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;

                if($scope.materialIndents && $scope.materialIndents.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.materialIndents.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10;
                    $scope.noData = false;
                }else{
                     $scope.noData = true;
                }
            });

        };

        $scope.showNotifications= function(position,alignment,color,msg){
           $rootScope.overlayShow();
           demo.showNotification(position,alignment,color,msg);
            $timeout(function() {
              $rootScope.overlayHide() ;
            }, 5000);
        }

		//Loading Page go to top position
		$scope.loadPageTop = function(){
		    $("#loadPage").animate({scrollTop: 0}, 2000);
		}

       // Page Loader Function
        $scope.loadingStart = function(){ $('.pageCenter').show();$('.overlay').show();}
        $scope.loadingAuto = function(){
            $scope.loadingStart();
            $scope.loadtimeOut = $timeout(function(){
	            $('.pageCenter').hide();$('.overlay').hide();

            }, 2000);
        }

        $scope.loadingStop = function(){
            console.log("Calling loader");
            $('.pageCenter').hide();$('.overlay').hide();
        };

        $scope.searchFilter = function () {
            $scope.setPage(1);
            $scope.search();
         }

        $scope.cancelIndent = function () {
            $location.path('/indent-list');
        };

        $scope.setPage = function (page) {
            if (page < 1 || page > $scope.pager.totalPages) {
                return;
            }
            $scope.pages.currPage = page;
            $scope.search();
        };

        $('#dateFilterRequestedDate').datetimepicker().on('dp.show', function (e) {
            return $(this).data('DateTimePicker');
        });

        $('input#dateFilterRequestedDate').on('dp.change', function(e){
            $scope.searchRequestedDate = e.date._d;
            $scope.requestedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
        });

        $('#dateFilterIssuedDate').datetimepicker().on('dp.show', function (e) {
            return $(this).data('DateTimePicker');
        });

        $('input#dateFilterIssuedDate').on('dp.change', function(e){
            $scope.searchIssuedDate = e.date._d;
            $scope.issuedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
        });


});
