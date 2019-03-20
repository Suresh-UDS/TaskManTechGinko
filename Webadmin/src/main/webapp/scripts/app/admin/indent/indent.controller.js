'use strict';

angular.module('timeSheetApp')
    .controller('IndentController', function ($rootScope, $scope, $state, $timeout,
    		ProjectComponent, SiteComponent, EmployeeComponent, InventoryComponent, IndentComponent, $http, $stateParams, $location, PaginationComponent,getLocalStorage,$filter) {

		$scope.selectedProject = null;

		$scope.selectedSite = null;

		$scope.selectedEmployee = null;

		$scope.selectedItemCode = null;

		$scope.selectedMaterialItems = [];

		$scope.indentObject = null;

		$scope.selectedRefNumber = null;

		$rootScope.loginView = false;

		$scope.pages = { currPage : 1};
        $scope.pageSort = 10;
		$scope.pager = {};

        $scope.searchReferenceNo = null;
        $scope.searchRequestedDate = null;
        $scope.searchIssuedDate = null;
        $scope.searchRequestedDateSer = null;
        $scope.searchIssuedDateSer = null;

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

        $scope.clientFilterDisable = true;
        $scope.siteFilterDisable = true;

	    $scope.noData = false;

	    $scope.issuedQty = null;

		$scope.refreshPage = function() {
            $scope.clearFilter();
            $scope.search();
		}

        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();
        }

        $scope.initCalender();

        $scope.conform = function(text,material=null)
        {
            $rootScope.conformText = text;
            $scope.materialFlag= material;
            $('#conformationModal').modal();

        }
        $rootScope.back = function (text) {
            if(text == 'cancel' || text == 'back'){
                /** @reatin - retaining scope value.**/
                $rootScope.retain=1;
                $scope.cancelIndent();
            }else if(text == 'save'){
                if($scope.materialFlag){
                  $scope.saveIndentTrans();
                }else{
                  $scope.saveIndent();
                }

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
            $scope.searchReferenceNo = null;
            $scope.searchRequestedDate = null;
			$scope.searchIssuedDate = null;
            $scope.searchRequestedDateSer = null;
            $scope.searchIssuedDateSer = null;
            $scope.localStorage = null;
            $rootScope.searchCriteriaSite = null;

            $scope.siteFilterDisable = true;
            $scope.regionFilterDisable = true;
            $scope.branchFilterDisable = true;
            $scope.downloader=false;
            $scope.downloaded = true;

            /** Ui-select scopes **/
            $scope.client.selected = null;
            $scope.sitesLists =  [];
            $scope.sitesListOne.selected =  null;
            $scope.regionsLists =  [];
            $scope.regionsListOne.selected =  null;
            $scope.branchsLists =  [];
            $scope.branchsListOne.selected =  null;

            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            //$scope.search();
        };

		//init load
		$scope.initLoad = function(){
			$scope.loadProjects();
		    $scope.loadPageTop();
		    $scope.loadAllUOM();
		 }

		$scope.initList = function() {
			//$scope.loadMaterialIndents();
            $scope.loadPageTop();
			$scope.setPage(1);
		}

		$scope.loadMaterialIndents = function() {
			$scope.refreshPage();
	    	$scope.search();
	    	$location.path('/indent-list');
		}

        $scope.loadProjects = function () {

            ProjectComponent.findAll().then(function (data) {
                $scope.projects = data;
                /** Ui-select scope **/
                $scope.clients[0] = $scope.allClients;
                //
                for(var i=0;i<$scope.projects.length;i++)
                {
                    //$scope.uiClient[i] = $scope.projects[i].name;
                    $scope.clients[i+1] = $scope.projects[i];
                }

                $scope.clientDisable = false;
                $scope.clientFilterDisable = false;
            });
        };

        /** Ui-select function **/

        $scope.loadDepSitesList = function (searchProject) {
            if(searchProject){
                $scope.siteSpin = true;
                $scope.searchProject = searchProject;
                if(jQuery.isEmptyObject($scope.searchProject) == false && $scope.searchProject.id == 0){
                    SiteComponent.findAll().then(function (data) {
                        //$scope.selectedSite = null;
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
                    }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                        var depProj=$scope.searchProject.id;
                    }else{
                        var depProj=0;
                    }

                    ProjectComponent.findSites(depProj).then(function (data) {
                        // $scope.selectedSite = null;
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

        $scope.selectProject = function(project)
        {
            $scope.searchProject = $scope.projectsList[$scope.uiClient.indexOf(project)]
            console.log('Project dropdown list:',$scope.searchProject)
        }
        //

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
        	}
        	/*else {
            	SiteComponent.findAll().then(function (data) {
                    $scope.sites = data;
                });
        	}*/
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

        $scope.chkEmp = function(){
            if(!$scope.selectedSite){
                alert('Please select site before select employee...!!!');
                return false;
            }
        }

        //Employees
        $scope.empSpin = false;
        $scope.loadEmployees = function () {
            if($scope.selectedSite && $scope.selectedSite.id){
                $scope.employees = "";
                $scope.empSpin = true;
               var empParam = {siteId: $scope.selectedSite.id, list: true};
               EmployeeComponent.search(empParam).then(function (data) {
                   console.log(data);
                   $scope.employees = data.transactions;
                   $scope.empSpin = false;

               });
            }
        }

        //Material
        $scope.matSpin = false;
        $scope.loadMaterials = function() {
        	$scope.searchLoadMaterials = {};
        	if($scope.selectedSite && $scope.selectedProject) {
                $scope.matSpin = true;
        		$scope.searchLoadMaterials.projectId = $scope.selectedProject.id;
    			$scope.searchLoadMaterials.siteId = $scope.selectedSite.id;
            	InventoryComponent.search($scope.searchLoadMaterials).then(function(data) {
    				console.log(data);
    				$scope.materials = data.transactions;
                    $scope.matSpin = false;
                    $scope.materials = $scope.materials === null ? [] : $scope.materials;
    			});
        	}
        }

        $scope.loadAllUOM = function() {
            $scope.UOMs = "";
        	InventoryComponent.getMaterialUOM().then(function(data){
        		console.log(data);
        		$scope.UOMs = data;
        	});
        }

		$scope.viewIndents = function() {
            if(parseInt($stateParams.id) > 0){
                $rootScope.loadingStart();
                $scope.materialIndentObj = "";
                IndentComponent.findById($stateParams.id).then(function(data) {
                    console.log(data);
                    $scope.materialIndentObj = data;
                    $rootScope.loadingStop();
                }).catch(function () {
                    $scope.showNotifications('top','center','danger','Unable to load Indent');
                    $location.path('/indent-list');
                    $rootScope.loadingStop();
                })
            }else{
                $location.path('/indent-list');
            }

		}

		$scope.editIndent = function() {
            if(parseInt($stateParams.id) > 0){
                $scope.loadingStart();
                IndentComponent.findById($stateParams.id).then(function(data) {
                    $scope.editIndentObj = data;
                    $scope.selectedRefNumber = $scope.editIndentObj.indentRefNumber;
                    $scope.selectedProject = {id: $scope.editIndentObj.projectId };
                    $scope.selectedSite = {id: $scope.editIndentObj.siteId };
                    $scope.loadSites();
                    $scope.loadEmployees();
                    $scope.selectedEmployee = {id: $scope.editIndentObj.requestedById }
                    $scope.materialItems = $scope.editIndentObj.items;
                    $scope.searchEditIndent = {};
                    $scope.searchEditIndent.projectId = $scope.editIndentObj.projectId;
                    $scope.searchEditIndent.siteId = $scope.editIndentObj.siteId;
                    InventoryComponent.search($scope.searchEditIndent).then(function(data) {
                        console.log(data);
                        $scope.materials = data.transactions;
                        $scope.loadingStop();
                    }).catch(function () {
                        $scope.loadingStop();
                    });

                }).catch(function () {
                    $scope.showNotifications('top','center','danger','Unable to load Indent');
                    $location.path('/indent-list');
                    $rootScope.loadingStop();
                })
            }else{
                $location.path('/indent-list');
            }
		}

		$scope.change = function() {
            if($scope.selectedItemCode){
                console.log($scope.selectedItemCode);
                $scope.selectedItemName = $scope.selectedItemCode.name;
                $scope.selectedStoreStock = $scope.selectedItemCode.storeStock;
                $scope.selectedQuantity = "";
            }
		}
        $scope.materialItems = [];
		$scope.addMaterialItem = function() {
			$scope.material = {};
			$scope.materialItems = $scope.materialItems ? $scope.materialItems : [];
			if($scope.selectedItemCode){
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
                    $scope.showNotifications('top','center','danger','Quantity cannot exceed store stock');
                    return false;
                }
            }else{
                $scope.showNotifications('top','center','danger','Please select itemcode...!!');
                return false;
            }


		}

		$scope.clearMaterialItem = function(){
            $scope.selectedItemCode = null;
            $scope.selectedItemName = null;
            $scope.selectedStoreStock = null;
            $scope.selectedQuantity = null;
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
				$scope.showNotifications('top','center','danger','Quantity cannot exceed required quantity');
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
            if($scope.selectedItemCode) {
                if ($scope.updateMaterial.materialStoreStock >= $scope.selectedQuantity) {
                    /*if(checkDuplicateInObject($scope.selectedItemCode.id, $scope.materialItems)) {
                        $scope.showNotifications('top','center','danger','Already exists same item in the list');
                    }else {*/
                        $scope.updateMaterial.quantity = $scope.selectedQuantity;
                        $scope.updateMaterial.pendingQuantity = $scope.selectedQuantity;
                        console.log($scope.indexOf);
                        console.log($scope.updateMaterial);
                        updateItems($scope.indexOf, $scope.updateMaterial);
                    /*}*/
                } else {
                    $scope.showNotifications('top', 'center', 'danger', 'Quantity cannot exceed store stock');
                    return false;
                }
            }else{
                $scope.showNotifications('top', 'center', 'danger', 'Quantity cannot exceed store stock');
                return false;
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

        $scope.isActiveAsc = 'indentRefNumber';
        $scope.isActiveDesc = '';

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveAsc = field;
            $scope.isActiveDesc = '';
            $scope.isAscOrder = true;
            $scope.search();

        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
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

            $scope.searchCriteria.isReport = false;

            if(!$scope.searchReferenceNo && !$scope.searchIssuedDate && !$scope.searchRequestedDate && !$scope.searchProject && !$scope.searchSite ) {
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
            }else{
                $scope.searchCriteria.siteId = null;
                $scope.searchCriteria.siteName = null
            }

        	if($scope.searchRequestedDateSer) {
        		$scope.searchCriteria.requestedDate = $scope.searchRequestedDateSer;
        	}else{
                $scope.searchCriteria.requestedDate = null;
            }
        	if($scope.searchIssuedDateSer) {
        		$scope.searchCriteria.issuedDate = $scope.searchIssuedDateSer;
        	}else{
                $scope.searchCriteria.issuedDate = null;
            }
        	if($scope.searchReferenceNo){
        		$scope.searchCriteria.indentRefNumber = $scope.searchReferenceNo;
        	}else{
                $scope.searchCriteria.indentRefNumber = "";
            }

            if($scope.pageSort){
                $scope.searchCriteria.sort = $scope.pageSort;
            }

            if($scope.selectedColumn){

                $scope.searchCriteria.columnName = $scope.selectedColumn;
                $scope.searchCriteria.sortByAsc = $scope.isAscOrder;

            }else{
                $scope.searchCriteria.columnName = 'indentRefNumber';
                $scope.searchCriteria.sortByAsc = true;
            }

            $scope.materialIndents = '';
            $scope.materialIndentsLoader = false;
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
                    if($scope.localStorage.indentRefNumber){
                        $scope.searchReferenceNo  = $scope.localStorage.indentRefNumber;
                    }else{
                        $scope.searchReferenceNo  = null;
                    }

                    $scope.searchRequestedDate = $filter('date')($scope.localStorage.requestedDate, 'dd/MM/yyyy');
                    $scope.searchRequestedDateSer = new Date($scope.localStorage.requestedDate);
                    $scope.searchIssuedDate = $filter('date')($scope.localStorage.issuedDate, 'dd/MM/yyyy');
                    $scope.searchIssuedDateSer = new Date($scope.localStorage.issuedDate);

                }

                $rootScope.retain = 0;

                $scope.searchCriteras  = $scope.localStorage;
            }else{

                $scope.searchCriteras  = $scope.searchCriteria;
            }

            /* Localstorage (Retain old values while edit page to list) end */
            IndentComponent.search($scope.searchCriteras).then(function (data) {
            	console.log(data);
                $scope.materialIndents = data.transactions;
                $scope.materialIndentsLoader = true;
                $scope.loadingStop();

                /** retaining list search value.**/
                getLocalStorage.updateSearch($scope.searchCriteras);

                 /*
                    ** Call pagination  main function **
                */
                 $scope.pager = {};
                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                 $scope.pages.totalPages = data.totalPages == 0 ? 1:data.totalPages;

                 console.log("Pagination",$scope.pager);
                console.log("Indent List - ", data);

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
            $('.AdvancedFilterModal.in').modal('hide');
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

        /*$('#dateFilterRequestedDate').datepicker().on('dp.show', function (e) {
            return $(this).data('DateTimePicker');
        });*/

        $('input#dateFilterRequestedDate').on('dp.change', function(e){
            $scope.searchRequestedDateSer = e.date._d;
            $scope.searchRequestedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
        });

        /*$('#dateFilterIssuedDate').datepicker().on('dp.show', function (e) {
            return $(this).data('DateTimePicker');
        });*/

        $('input#dateFilterIssuedDate').on('dp.change', function(e){
            $scope.searchIssuedDateSer = e.date._d;
            $scope.searchIssuedDate = $filter('date')(e.date._d, 'dd/MM/yyyy');
        });

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
            $scope.sitesListOne.selected = null;
        };



        /*
         * Ui select allow-clear modified function end
         *
         * */


});
