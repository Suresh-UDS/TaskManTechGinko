'use strict';

angular.module('timeSheetApp')
    .controller('InventoryController', function ($rootScope, $scope, $state, $timeout, ProjectComponent, SiteComponent,$http,$stateParams,$location,
    		ManufacturerComponent, InventoryComponent) {

          
    	$rootScope.loginView = false;
    	$scope.inventory = {};
    	$scope.client = {};
    	$scope.projectSite = {};
    	$scope.selectedManufacturer = {};
    	$scope.selectedUOM;
    	$scope.selectedItemGroup = {};
    	$scope.materialItemGroup = {};
    	$scope.pages = { currPage : 1};
    	
    	$scope.refreshPage = function() { 
    		 $scope.pages = {
    	                currPage: 1,
    	                totalPages: 0
    	            }
    	}
    	
    	$scope.showNotifications= function(position,alignment,color,msg){

            /*if(nottifShow == true){*/
               $rootScope.overlayShow();
               demo.showNotification(position,alignment,color,msg);

            /*}else if(nottifShow == false){*/
                $timeout(function() {
                  $rootScope.overlayHide() ;
                }, 5000);

            /*}*/

        }
    	
    	$scope.loadProjects = function () {
            ProjectComponent.findAll().then(function (data) {
                console.log("Loading all projects")
                $scope.projects = data;
            });
        }
    	
    	$scope.loadAllSites = function () {
    		if($scope.client) { 
    			ProjectComponent.findSites($scope.client.id).then(function (data) {
                    $scope.searchSite = null;
                    $scope.sites = data;
                });
    		}
        }
    	
    	$scope.loadManufacturer = function () {
            ManufacturerComponent.findAll().then(function (data) {
                //console.log("Loading all Manufacturer -- " , data);
                $scope.manufacturers = data;
                $scope.loadingStop();
            });
        }
    	
    	$scope.loadUOM = function() {
    		InventoryComponent.getMaterialUOM().then(function(data){
    			console.log(data);
    			$scope.materialUOMs = data;
    		});
    	}
    	
    	$scope.cancelInventory = function(){
            $location.path('/inventory-list');
       }
    	
    	/* Add item group */

        $scope.addMaterialItemGroup = function () {
            console.log($scope.materialItemGroup);
             $scope.loadingStart();
            if($scope.materialItemGroup){
                console.log("MaterialItmGroup Group entered");
                InventoryComponent.createItemGroup($scope.materialItemGroup).then(function (response) {
                    console.log(response);
                    $scope.materialItemGroup = "";
                    $scope.showNotifications('top','center','success','Item group has been added Successfully!!');
                    $scope.loadMaterialItmGroup();

                }).catch(function(){
                $scope.loadingStop();
                $scope.showNotifications('top','center','danger','Unable to add Item group. Please try again later..');
                $scope.error = 'ERROR';
            });
            }else{
                console.log("Item Group not entered");
            }
        }
        
        $scope.loadMaterialItmGroup = function () {
        	InventoryComponent.loadItemGroup().then(function (data) {
                $scope.materialItmGroups = data;
                $scope.loadingStop();
            });
        }
        
        $scope.loadMaterials = function() { 
        	$scope.search();
        	$location.path('/inventory-list');
        }
    	
    	$scope.saveInventory = function() {
    		if($scope.client){
    			$scope.inventory.projectId = $scope.client.id;
    		}
    		
    		if($scope.projectSite){
    			$scope.inventory.siteId = $scope.projectSite.id;
    		}
    		
    		if($scope.selectedManufacturer) { 
    			$scope.inventory.manufacturerId = $scope.selectedManufacturer.id;
    		}
    		
    		if($scope.selectedItemGroup) {
    			$scope.inventory.itemGroup = $scope.selectedItemGroup.itemGroup;
    		}
    		
    		if($scope.selectedUOM){
    			$scope.inventory.uom = $scope.selectedUOM;
    		}
    		
    		console.log(JSON.stringify($scope.inventory));
    		
    		InventoryComponent.create($scope.inventory).then(function(data) { 
    			console.log(data);
                $scope.loadingStop();
                $scope.inventory = "";
                $scope.showNotifications('top','center','success','Material has been added Successfully!!');
                $scope.loadMaterials();
    		}).catch(function (response) {
                $scope.loadingStop();
                $scope.btnDisabled= false;
                $scope.success = null;
                console.log('Error - '+ response.data);
                console.log('status - '+ response.status + ' , message - ' + response.data.message);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                        $scope.errorAssetsExists = 'ERROR';
                    $scope.showNotifications('top','center','danger','Material Already Exists');
                } else {
                    $scope.showNotifications('top','center','danger','Unable to creating Inventory. Please try again later..');
                    $scope.error = 'ERROR';
                }
            });
    		
    		
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
        	console.log('Selected  module action -' + $scope.selectedInventorylist);

        	if(!$scope.selectedInventorylist) {
        		if($rootScope.searchCriteriaInventorylist) {
            		$scope.searchCriteria = $rootScope.searchCriteriaInventorylist;
        		}else {
        			$scope.searchCriteria.findAll = true;
        		}

        	}else {
	        	if($scope.selectedInventorylist) {
	        		$scope.searchCriteria.findAll = false;
		        	$scope.searchCriteria.inventorylistId = $scope.selectedInventorylist.id;
		        	$scope.searchCriteria.name = $scope.selectedInventorylist.name;
		        	$scope.searchCriteria.activeFlag = $scope.selectedInventorylist.activeFlag;
		        	console.log('selected inventory id ='+ $scope.searchCriteria.inventorylistId);
	        	}else {
	        		$scope.searchCriteria.inventorylistId = 0;
	        	}
        	}
        	console.log($scope.searchCriteria);
        	InventoryComponent.search($scope.searchCriteria).then(function (data) {
        		console.log(data);
                $scope.inventorylists = data.transactions;
                $scope.loadingStop();
                $scope.inventorylistLoader = true;
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                if($scope.checklists == null){
                    $scope.pages.startInd = 0;
                }else{
                    $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
                }

                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
                $scope.pages.totalCnt = data.totalCount;
            	$scope.hide = true;
            });
        	$rootScope.searchCriteriaChecklist = $scope.searchCriteria;
        	if($scope.pages.currPage == 1) {
            	$scope.firstStyle();
        	}
        };


			//init load
			$scope.initLoad = function(){ 
			     $scope.loadPageTop(); 
			     $scope.loadProjects();
			     $scope.loadManufacturer();
			     $scope.loadUOM();
			  
			 }
			
			$scope.initList = function() { 
				$scope.loadMaterials();
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
