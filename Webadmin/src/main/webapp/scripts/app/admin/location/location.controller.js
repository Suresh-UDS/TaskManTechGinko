'use strict';

angular.module('timeSheetApp')
    .controller('LocationController', function ($rootScope, $scope, $state, $timeout,
        LocationComponent,ProjectComponent, SiteComponent, $http, $stateParams,
         $location,PaginationComponent,getLocalStorage ) {
        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorUserExists = null;
        $scope.validationError = null;
        $scope.validationErrorMsg = null;
        $scope.authorities = ["User", "Admin"];
        $scope.searchCriteria = {};
        $scope.location = {};
        $scope.selectedProject = null;
        $scope.selectedSite = null;
        $scope.selectedBlock = null;
        $scope.selectedFloor = null;
        $scope.selectedZone = null;
        $scope.searchSite = null;
        $scope.searchProject = null;
        $scope.searchBlock = null;
        $scope.searchFloor = null;
        $scope.searchZone = null;
        $scope.selectedLocation = null;
        $scope.pages = {currPage: 1};
        $scope.pageSort = 10;
        $scope.pager = {};
        $scope.noData = false;
        $rootScope.conformText = null;
        $scope.sitesList = null;
        $scope.qrInfoBlock = "";
        $scope.siteSpin = false;
        $scope.btnDisable = false;
        
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
        $scope.blockLists = [];
        //$scope.SelectClientsNull = {id:0 , name: '-- SELECT CLIENT --'};
        $scope.blocksListOne = {};
        $scope.blocksListOne.selected = null;
        $scope.floorsLists = [];
        $scope.floorsListOne = {};
        $scope.floorsListOne.selected = null;
        $scope.zonesLists = [];
        $scope.zonesListOne = {};
        $scope.zonesListOne.selected = null;
        $scope.SelectClient = {};
        $scope.SelectClients = [];
        $scope.SelectSite = {};
        $scope.SelectSites = [];

        /*$timeout(function () {
            angular.element('[ng-model="name"]').focus();
        });*/

        $scope.clientDisable = true;

        $scope.loadProjectsList = function () {
            ProjectComponent.findAll().then(function (data) {
                $scope.projectsList = data;
                /** Ui-select scope **/
                $scope.clients[0] = $scope.allClients;
                /*for(var i=0;i<$scope.projectsList.length;i++)
                {
                    $scope.uiClient[i] = $scope.projectsList[i].name;
                }*/
                for(var i=0;i<$scope.projectsList.length;i++)
                {
                    $scope.SelectClients[i] = $scope.projectsList[i];
                    $scope.clients[i+1] = $scope.projectsList[i];
                }
                
                $scope.clientDisable = false;
                $scope.clientFilterDisable = false;
            });
        };

        $scope.loadSitesList = function () {
            SiteComponent.findAll().then(function (data) {
                $scope.sitesList = data;
            });
        };

        // Filter //

        $scope.siteSpin = false;

        //

        // Load Clients for selectbox //
        $scope.clienteDisable = true;
        $scope.clientFilterDisable = true;
        $scope.uiClient = [];

        $scope.getClient = function (search) {
            var newSupes = $scope.uiClient.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }

            return newSupes;
        }

        //

        $scope.loadBloack = function(selectedSite)
        {
            $scope.selectedSite = $scope.sitesList[$scope.uiSite.indexOf(selectedSite)]
            //console.log("==========Selected sites ==========");
            //console.log($scope.selectedProject);
            //console.log($scope.selectedSite);
        }

        // Load sites for selectbox//
         $scope.filter = false;
         /*$scope.loadDepSites = function (selectedProject) {
             if(selectedProject){
                $scope.clearField = false;
                $scope.filter = false;
                $scope.siteFilterDisable = true;
                $scope.uiSite.splice(0,$scope.uiSite.length);
                $scope.selectedProject = $scope.projectsList[$scope.uiClient.indexOf(selectedProject)]
                $scope.searchProject = $scope.projectsList[$scope.uiClient.indexOf(selectedProject)]
                $scope.siteSpin = true;
                $scope.siteDisable = true;
                $scope.selectedSite = null;
                $scope.hideSite = false;
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
                   for(var i=0;i<$scope.sitesList.length;i++)
                   {
                       $scope.uiSite[i] = $scope.sitesList[i].name;
                   }
                   $scope.siteDisable = false;
                   $scope.siteSpin = false;
                   $scope.siteFilterDisable = false;
               });
             }

        };*/
         
         $scope.siteDisable = true;
         
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
 	                  
 	                  ////console.log('Site List',$scope.sitesList);
 	                  
 	                  for(var i=0;i<$scope.sitesList.length;i++)
 	                  {
 	                      $scope.sitesLists[i+1] = $scope.sitesList[i];
 	                      $scope.SelectSites[i] = $scope.sitesList[i];
 	                      
 	                  }
 	                  
 	                  $scope.siteFilterDisable = false;
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


        $scope.siteFilterDisable = true;
        $scope.siteDisable = false;
        $scope.uiSite = [];
        $scope.getSites = function (search) {

            var newSupes = $scope.uiSite.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }
            return newSupes;
        }

        //

        $scope.loadLocationsList = function() {
        		LocationComponent.findAll().then(function(data) {
        			$scope.locationsList = data;
        		})
        }

      /*  $scope.loadDepBlocks = function (site) {
             if(site){
                 $scope.searchSite = '';
                 $scope.uiBlock.splice(0,$scope.uiBlock.length);
                 $scope.searchSite = $scope.sitesList[$scope.uiSite.indexOf(site)];
                 $scope.show = false;
                 $scope.hideSite = true;
                 $scope.hideBlock = false;
                 if($scope.client.selected){
             		$scope.searchProject = $scope.client.selected;
             	}else{
             	   $scope.searchProject = null;
             	}
                 if($scope.SelectSite.selected){
             		$scope.selectedSite = $scope.SelectSite.selected;
             	}else{
             	   $scope.selectedSite = null;
             	}
                 if(jQuery.isEmptyObject($scope.selectedProject) == false) {

                        var depProj=$scope.selectedProject.id;
                 }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                         var depProj=$scope.searchProject.id;
                 }else{
                         var depProj=0;
                 }
                 if(jQuery.isEmptyObject($scope.selectedSite) == false) {
                       //console.log('selected project -' + $scope.selectedProject.id + ', site -' + $scope.selectedSite.id);
                        var depSite=$scope.selectedSite.id;
                 }else if(jQuery.isEmptyObject($scope.searchSite) == false){
                         var depSite=$scope.searchSite.id;
                 }else{
                         var depSite=0;
                 }
                    LocationComponent.findBlocks(depProj,depSite).then(function (data) {
                        $scope.selectedBlock = null;
                    $scope.blocksList = data;

                    //
                         for(var i=0;i<$scope.blocksList.length;i++)
                         {
                             $scope.uiBlock[i] = $scope.blocksList[i];
                         }
                         //console.log($scope.uiBlock)
                         $scope.blockDisable = false;
                         $scope.blockSpin = false;
                         $scope.blockFilterDisable = false;
                });
             }else{
                $scope.searchSite = '';
             }

	    };*/
	    
	    $scope.loadDepBlocksList = function (site) {
            if(site){
            	$scope.blockLists = [];
            	$scope.blocksListOne.selected = null;
                $scope.show = false;
                if($scope.client.selected){
            		$scope.searchProject = $scope.client.selected;
            	}else{
            	   $scope.searchProject = null;
            	}
                if($scope.sitesListOne.selected){
            		$scope.searchSite = $scope.sitesListOne.selected;
            	}else{
            	   $scope.searchSite = null;
            	}
                if($scope.SelectSite.selected){
            		$scope.selectedSite = $scope.SelectSite.selected;
            	}else{
            	   $scope.selectedSite = null;
            	}
                if(jQuery.isEmptyObject($scope.selectedProject) == false) {

                       var depProj=$scope.selectedProject.id;
                }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                        var depProj=$scope.searchProject.id;
                }else{
                        var depProj=0;
                }
                if(jQuery.isEmptyObject($scope.selectedSite) == false) {
                      //console.log('selected project -' + $scope.selectedProject.id + ', site -' + $scope.selectedSite.id);
                       var depSite=$scope.selectedSite.id;
                }else if(jQuery.isEmptyObject($scope.searchSite) == false){
                        var depSite=$scope.searchSite.id;
                }else{
                        var depSite=0;
                }
                   LocationComponent.findBlocks(depProj,depSite).then(function (data) {
                       $scope.selectedBlock = null;
                   $scope.blocksList = data;
                   
                   //console.log("block List",$scope.blocksList);
  
                        $scope.blocksLists = $scope.blocksList;
                        
                        //console.log($scope.uiBlock)
                        $scope.blockDisable = false;
                        $scope.blockSpin = false;
                        $scope.blockFilterDisable = false;
               });
            }else{
               $scope.searchSite = '';
            }

	    };

        // Load Blocks for selectbox //
        $scope.blockFilterDisable = true;
        $scope.BlockDisable = true;
        $scope.uiBlock = [];

        $scope.getBlock = function (search) {
            var newSupes = $scope.uiBlock.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }

            return newSupes;
        }

        //

	   /* $scope.loadDepFloors = function (searchBlock) {
            $scope.uiFloor.splice(0,$scope.uiFloor.length);
            $scope.hideBlock = true;
            $scope.hideFloor = false;
            $scope.searchBlock = searchBlock;
            if(jQuery.isEmptyObject($scope.selectedProject) == false) {
                   var depProj=$scope.selectedProject.id;
            }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                    var depProj=$scope.searchProject.id;
            }else{
                    var depProj=0;
            }
            if(jQuery.isEmptyObject($scope.selectedSite) == false) {
                   var depSite=$scope.selectedSite.id;
            }else if(jQuery.isEmptyObject($scope.searchSite) == false){
                    var depSite=$scope.searchSite.id;
            }else{
                    var depSite=0;
            }
             if($scope.selectedBlock !=null) {
                   var depBlock=$scope.selectedBlock;
            }else if($scope.searchBlock !=null){
                    var depBlock=$scope.searchBlock;
            }else{
                    var depBlock=null;
            }
            if(depBlock){
                    LocationComponent.findFloors(depProj,depSite,depBlock).then(function (data) {
                    $scope.selectedFloor = null;
                    $scope.floorsList = data;
                    //
                        //console.log($scope.floorsList)
                        for(var i=0;i<$scope.floorsList.length;i++)
                        {
                            $scope.uiFloor[i] = $scope.floorsList[i];
                        }
                        //console.log($scope.floorsList)
                        $scope.floorDisable = false;
                        $scope.floorSpin = false;
                        $scope.floorFilterDisable = false;
                });
	        }
	    };*/
        
        $scope.loadDepFloorsList = function (searchBlock) {
           
            $scope.floorsLists = [];
        	$scope.floorsListOne.selected = null;
            if($scope.client.selected){
        		$scope.searchProject = $scope.client.selected;
        	}else{
        	   $scope.searchProject = null;
        	}
            if($scope.sitesListOne.selected){
        		$scope.searchSite = $scope.sitesListOne.selected;
        	}else{
        	   $scope.searchSite = null;
        	}
            if($scope.blocksListOne.selected){
        		$scope.searchBlock = $scope.blocksListOne.selected;
        	}else{
        	   $scope.searchBlock = null;
        	}
            if(jQuery.isEmptyObject($scope.selectedProject) == false) {
                   var depProj=$scope.selectedProject.id;
            }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                    var depProj=$scope.searchProject.id;
            }else{
                    var depProj=0;
            }
            if(jQuery.isEmptyObject($scope.selectedSite) == false) {
                   var depSite=$scope.selectedSite.id;
            }else if(jQuery.isEmptyObject($scope.searchSite) == false){
                    var depSite=$scope.searchSite.id;
            }else{
                    var depSite=0;
            }
             if($scope.selectedBlock !=null) {
                   var depBlock=$scope.selectedBlock;
            }else if($scope.searchBlock !=null){
                    var depBlock=$scope.searchBlock;
            }else{
                    var depBlock=null;
            }
            if(depBlock){
                    LocationComponent.findFloors(depProj,depSite,depBlock).then(function (data) {
                    $scope.selectedFloor = null;
                    $scope.floorsList = data;
                    //
                        //console.log($scope.floorsList);
                       
                            $scope.floorsLists = $scope.floorsList;
                        
                        //console.log($scope.floorsList);
                        $scope.floorDisable = false;
                        $scope.floorSpin = false;
                        $scope.floorFilterDisable = false;
                });
	        }
	    };

        // Load Floors for selectbox //
        $scope.floorFilterDisable = true;
        $scope.floorDisable = true;

        $scope.getFloor = function (search) {
            var newSupes = $scope.uiFloor.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }
            return newSupes;
        }
        //

	    /*$scope.loadDepZones = function (searchFloor) {
            $scope.uiZone.splice(0,$scope.uiZone.length);
            $scope.hideFloor = true;
            $scope.hideZone = false;
            $scope.searchFloor = searchFloor;
            //console.log($scope.searchFloor)
            if(jQuery.isEmptyObject($scope.selectedProject) == false) {
                   var depProj=$scope.selectedProject.id;
            }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                    var depProj=$scope.searchProject.id;
            }else{
                    var depProj=0;
            }
            if(jQuery.isEmptyObject($scope.selectedSite) == false) {
                   var depSite=$scope.selectedSite.id;
            }else if(jQuery.isEmptyObject($scope.searchSite) == false){
                    var depSite=$scope.searchSite.id;
            }else{
                    var depSite=0;
            }
             if($scope.selectedBlock !=null) {
                   var depBlock=$scope.selectedBlock;
            }else if($scope.searchBlock !=null){
                    var depBlock=$scope.searchBlock;
            }else{
                    var depBlock=null;
            }
            if($scope.selectedZone !=null) {
                   //console.log('load zones - ' + $scope.selectedProject.id +',' +$scope.selectedSite.id +',' +$scope.selectedBlock +','+$scope.selectedFloor);
                   var depZone=$scope.selectedZone;
            }else if($scope.searchFloor !=null){
                    var depFloor=$scope.searchFloor;
            }else{
                    var depZone=null;
            }
            if(depBlock && depFloor){
                LocationComponent.findZones(depProj,depSite,depBlock,depFloor).then(function (data) {
                         $scope.selectedZone = null;
                         $scope.zonesList = data;
                        //
                        //console.log($scope.zonesList)
                        for(var i=0;i<$scope.zonesList.length;i++)
                        {
                            $scope.uiZone[i] = $scope.zonesList[i];
                        }
                        //console.log($scope.zonesList)
                        $scope.zoneDisable = false;
                        $scope.zoneSpin = false;
                        $scope.zoneFilterDisable = false;
                });

            }

	    };*/
	    
	    $scope.loadDepZonesList = function (searchFloor) {
    	    $scope.zonesLists = [];
        	$scope.zonesListOne.selected = null;
            if($scope.client.selected){
        		$scope.searchProject = $scope.client.selected;
        	}else{
        	   $scope.searchProject = null;
        	}
            if($scope.sitesListOne.selected){
        		$scope.searchSite = $scope.sitesListOne.selected;
        	}else{
        	   $scope.searchSite = null;
        	}
            if($scope.blocksListOne.selected){
        		$scope.searchBlock = $scope.blocksListOne.selected;
        	}else{
        	   $scope.searchBlock = null;
        	}
            if($scope.floorsListOne.selected){
        		$scope.searchFloor = $scope.floorsListOne.selected;
        	}else{
        	   $scope.searchFloor = null;
        	}
            if(jQuery.isEmptyObject($scope.selectedProject) == false) {
                   var depProj=$scope.selectedProject.id;
            }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                    var depProj=$scope.searchProject.id;
            }else{
                    var depProj=0;
            }
            if(jQuery.isEmptyObject($scope.selectedSite) == false) {
                   var depSite=$scope.selectedSite.id;
            }else if(jQuery.isEmptyObject($scope.searchSite) == false){
                    var depSite=$scope.searchSite.id;
            }else{
                    var depSite=0;
            }
             if($scope.selectedBlock !=null) {
                   var depBlock=$scope.selectedBlock;
            }else if($scope.searchBlock !=null){
                    var depBlock=$scope.searchBlock;
            }else{
                    var depBlock=null;
            }
            if($scope.selectedFloor !=null) {
                   //console.log('load zones - ' + $scope.selectedProject.id +',' +$scope.selectedSite.id +',' +$scope.selectedBlock +','+$scope.selectedFloor);
                   var depFloor=$scope.selectedFloor;
            }else if($scope.searchFloor !=null){
                    var depFloor=$scope.searchFloor;
            }else{
                    var depFloor=null;
            }
            if(depBlock && depFloor){
                LocationComponent.findZones(depProj,depSite,depBlock,depFloor).then(function (data) {
                         $scope.selectedZone = null;
                         $scope.zonesList = data;
                        //
                        //console.log($scope.zonesList);
                        
                            $scope.zonesLists = $scope.zonesList;
                        
                        //console.log($scope.zonesList);
                        $scope.zoneDisable = false;
                        $scope.zoneSpin = false;
                        $scope.zoneFilterDisable = false;
                });

            }

	    };

        // Load Zones for selectbox //
        $scope.zoneFilterDisable = true;
        $scope.zoneDisable = true;
        $scope.uiZone = [];

        $scope.getZone = function (search) {
            var newSupes = $scope.uiZone.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }
            return newSupes;
        }

        //
        //

        $scope.loadSearchZones = function (searchZone) {
            $scope.searchZone = searchZone;
            $scope.hideZone = true;
        }
        //

        $scope.conform = function(text)
        {
            //console.log($scope.selectedProject)
            $rootScope.conformText = text;
            $('#conformationModal').modal();

        }

        $rootScope.back = function (text) {
            if(text == 'cancel' || text == 'back'){
               $scope.cancelLocation();
            }else if(text == 'save'){
                $scope.saveLocation();
            }
        };

        $scope.refreshPage = function() {

    			$scope.loadLocations();
        };

        $scope.loadLocations = function () {
                $scope.clearFilter();
	    		$scope.search();
	    };

        $scope.loadLocation = function(id) {
        		//console.log('loadLocation -' + id);
        		LocationComponent.findOneLocation(id).then(function (data) {
        			$scope.location = data;
        			//console.log('Location mapping retrieved - ' + JSON.stringify($scope.location));

            });

        };

        $scope.updateLocation = function () {
        		//console.log('Location mapping details - ' + JSON.stringify($scope.location));
                $scope.btnDisable = true;
        		LocationComponent.updateLocation($scope.location).then(function () {
	            	$scope.success = 'OK';
	            	$location.path('/locations');
	            }).catch(function (response) {
	                $scope.success = null;
	                //console.log('Error - '+ response.data);
	                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
	                    $scope.errorChecklistExists = true;
	                } else if(response.status === 400 && response.data.message === 'error.validation'){
	                	$scope.validationError = true;
	                	$scope.validationErrorMsg = response.data.description;
	                } else {
	                    $scope.error = 'ERROR';
	                }
	                $scope.btnDisable = false;
            });
        };

        $scope.saveLocation = function(){
            $scope.saveLoad = true;
            $scope.btnDisable = true;
            $rootScope.conformText = "";
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
            //console.log("---------------------------------------------------")
            //console.log($scope.selectedProject)
        		$scope.location.projectName = $scope.selectedProject.name;
        		$scope.location.projectId = $scope.selectedProject.id;
        		$scope.location.siteId = $scope.selectedSite.id;
        		$scope.location.siteName = $scope.selectedSite.name;
        		$scope.location.block = $scope.selectedBlock;
        		$scope.location.floor = $scope.selectedFloor;
        		$scope.location.zone = $scope.selectedZone;
            //console.log("Before pushing location to server");
            //console.log(JSON.stringify($scope.location));
            LocationComponent.createLocation($scope.location).then(function(){
                $scope.saveLoad = false;
            		//console.log("success");
  	        		$location.path('/locations');
  	        		// $scope.loadLocationItems();
  	        }).catch(function (response) {
                $scope.saveLoad = false;
  	            $scope.success = null;
  	            //console.log(response.data);
  	            if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
  	                $scope.errorLocationExists = true;
  	            } else if(response.status === 400 && response.data.message === 'error.validation'){
  	            	$scope.validationError = true;
  	            	$scope.validationErrorMsg = response.data.description;
  	            } else {
  	                $scope.error = 'ERROR';
  	            }
  	            $scope.btnDisable = false;
  	        });
        };

        $scope.isActiveAsc = 'id';
        $scope.isActiveDesc = '';

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveAsc = field;
            $scope.isActiveDesc = '';
            $scope.isAscOrder = true;
            // $scope.search();
            $scope.loadLocations();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
            // $scope.search();
            $scope.loadLocations();
        }

         $scope.searchFilter1 = function () {
            $scope.searchBlock = null;
            $scope.searchFloor = null;
            $scope.searchZone = null;
            $scope.searchCriteria.block =null;
            $scope.searchCriteria.floor =null;
            $scope.searchCriteria.zone =null;
            $scope.setPage(1);
            // $scope.search();
         }

        $scope.errorMsg = function(){
            $scope.show = true;
        }

        $scope.searchFilter = function () {
        	$('.AdvancedFilterModal.in').modal('hide');
            // $scope.setPage(1);
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
        	}else{
        	   $scope.searchSite = null;
        	}
        	
        	if($scope.blocksListOne.selected){
        		$scope.searchBlock = $scope.blocksListOne.selected;
        	}else{
        	   $scope.searchBlock = null;
        	}
        	if($scope.floorsListOne.selected){
        		$scope.searchFloor = $scope.floorsListOne.selected;
        	}else{
        	   $scope.searchFloor = null;
        	}
        	if($scope.zonesListOne.selected){
        		$scope.searchZone = $scope.zonesListOne.selected;
        	}else{
        	   $scope.searchZone = null;
        	}
            //console.log('Selected Location' + $scope.searchBlock + ',' + $scope.searchFloor +  ',' + $scope.searchZone);

            if(!$scope.searchSite && !$scope.searchProject && !$scope.searchBlock && !$scope.searchFloor && !$scope.searchZone) {
                if($rootScope.searchCriteriaLocation) {
                    $scope.searchCriteria = $rootScope.searchCriteriaLocation;
                }else {
                    $scope.searchCriteria.findAll = true;
                }

            }else {
                $scope.searchCriteria.findAll = false;
                    if($scope.searchProject) {
                    $scope.searchCriteria.projectId = $scope.searchProject.id;
                    $scope.searchCriteria.projectName = $scope.searchProject.name;
                    }else {
    	        		$scope.searchCriteria.projectId = 0;
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
                    }else {
    	        		$scope.searchCriteria.siteId = 0;
    	        		$scope.searchCriteria.siteName = null;
    	        	}
                    if($scope.searchBlock) {
                        $scope.searchCriteria.block = $scope.searchBlock;
                    }else{
                        $scope.searchCriteria.block = null;
                    }
                    if($scope.searchFloor) {
                        $scope.searchCriteria.floor = $scope.searchFloor;
                    }else{
                        $scope.searchCriteria.floor = null;
                    }
                    if($scope.searchZone) {
                        $scope.searchCriteria.zone = $scope.searchZone;
                    }else{
                        $scope.searchCriteria.zone = null;
                    }
                }
            //console.log($scope.searchCriteria);
            // ----
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
            
           

             //console.log('search criteria',$scope.searchCriteria);

                $scope.locations = '';
                $scope.locationsLoader = false;
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
                       
                       LocationComponent.findBlocks($scope.searchProject.id,$scope.searchSite.id).then(function (data) {
	                          $scope.selectedBlock = null;
	                      $scope.blocksList = data;
	                      
	                      //console.log("block List",$scope.blocksList);
	     
	                           $scope.blocksLists = $scope.blocksList;
	                           
	                           //console.log($scope.uiBlock)
	                           $scope.blockDisable = false;
	                           $scope.blockSpin = false;
	                           $scope.blockFilterDisable = false;
	                  });
                       
                       
                     }else{
                        $scope.searchSite = null;
                        $scope.sitesListOne.selected = $scope.searchSite;
                     }
                    
                    if($scope.localStorage.block){
                        $scope.searchBlock = $scope.localStorage.block;
                        $scope.blocksListOne.selected = $scope.searchBlock;
                        $scope.blockFilterDisable=false;
                        
                        LocationComponent.findFloors($scope.searchProject.id,$scope.searchSite.id,$scope.searchBlock).then(function (data) {
                            $scope.selectedFloor = null;
                            $scope.floorsList = data;
                            //
                                //console.log($scope.floorsList);
                               
                                    $scope.floorsLists = $scope.floorsList;
                                
                                //console.log($scope.floorsList);
                                $scope.floorDisable = false;
                                $scope.floorSpin = false;
                                $scope.floorFilterDisable = false;
                        });
                        
                      }else{
                         $scope.searchBlock = null;
                      }
                    if($scope.localStorage.floor){
                        $scope.searchFloor = $scope.localStorage.floor;
                        $scope.floorsListOne.selected = $scope.searchFloor;
                        $scope.floorFilterDisable=false;
                        
                        LocationComponent.findZones($scope.searchProject.id,$scope.searchSite.id,$scope.searchBlock,$scope.searchFloor).then(function (data) {
                            $scope.selectedZone = null;
                            $scope.zonesList = data;
                           //
                           //console.log($scope.zonesList);
                           
                               $scope.zonesLists = $scope.zonesList;
                           
                           //console.log($scope.zonesList);
                           $scope.zoneDisable = false;
                           $scope.zoneSpin = false;
                           $scope.zoneFilterDisable = false;
                         });
                      }else{
                         $scope.searchFloor = null;
                      }
                    if($scope.localStorage.zone){
                        $scope.searchZone = $scope.localStorage.zone;
                        $scope.zonesListOne.selected = $scope.searchZone;
                        $scope.ZoneFilterDisable=false;
                      }else{
                         $scope.searchZone = null;
                      }



                }

                $rootScope.retain = 0;

                $scope.searchCriteras  = $scope.localStorage;
            }else{

            	$scope.searchCriteras  = $scope.searchCriteria;
            }

            /* Localstorage (Retain old values while edit page to list) end */



            LocationComponent.search($scope.searchCriteras).then(function (data) {
                $scope.locations = data.transactions;
                $scope.locationsLoader = true;

                // if($scope.locations){
                // for(var i=0;i<$scope.locations.length;i++){
                // var qr ={
                // siteId:$scope.locations[i].siteId,
                // locationId:$scope.locations[i].id
                // };
                // LocationComponent.createQr(qr).then(function(response){
                //
                // //console.log('response qr---',response);
                //
                // var qrAry = response.split('.');
                // $scope.qr_img = qrAry[0];
                // $scope.assetCode = qrAry[1];
                // //console.log('create qr---',qrAry);
                //
                // });
                // $scope.locations[i].qr_img = $scope.qr_img;
                // //console.log('qr')
                // //console.log($scope.locations[i]);
                // }
                // }


                /** retaining list search value.* */
                getLocalStorage.updateSearch($scope.searchCriteras);


                /*
				 * * Call pagination main function **
				 */
                $scope.pager = {};
                $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                $scope.totalCountPages = data.totalCount;

                //console.log("Pagination",$scope.pager);
                //console.log($scope.locations);

                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                $scope.loading = false;

                if($scope.locations && $scope.locations.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.locations.length;
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
            $scope.sitesList = null;
            
            /** Ui-select scopes **/
        	$scope.client.selected = null;
        	$scope.sitesLists =  [];
        	$scope.sitesListOne.selected =  null;
        	$scope.regionsLists =  [];
        	$scope.regionsListOne.selected =  null;
        	$scope.branchsLists =  [];
        	$scope.branchsListOne.selected =  null;
        	$scope.blocksLists =  [];
        	$scope.blocksListOne.selected =  null;
        	$scope.floorsLists =  [];
        	$scope.floorsListOne.selected =  null;
        	$scope.zonesLists =  [];
        	$scope.zonesListOne.selected =  null;
        	
            $scope.selectedSite = null;
            $scope.selectedProject = null;
            $scope.selectedBlock = null;
            $scope.selectedFloor = null;
            $scope.selectedZone = null;
            $scope.searchSite = null;
            $scope.searchProject = null;
            $scope.searchBlock = null;
            $scope.searchFloor = null;
            $scope.searchZone = null;
            $scope.searchCriteria = {};
            $rootScope.searchCriteriaSite = null;
            $("#collapseTwo").removeClass("in");
            $("#collapseOne").addClass("in");
            $("#collapseOne").css("height", "110px");
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            // $scope.search();
        };

        $scope.cancelLocation = function () {

            /** @reatin - retaining scope value.* */
            $rootScope.retain=1;

        	$location.path('/locations');

        };

      // init load

        $scope.initLoad = function(){
             $scope.loadPageTop();
             $scope.loading = true;
             // $scope.loadLocations();
             $scope.setPage(1);
             if($stateParams.location){
                 $scope.qrcodePage($stateParams.location);
             }
         };


        $scope.printDiv = function(printable) {
            //console.log("Print Screen")
            var printContents = document.getElementById(printable).innerHTML;
            var originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
        }

        $scope.printPage = function () {
            window.print();
        }
       /*
		 * * Pagination init function ** @Param:integer
		 *
		 */

        $scope.setPage = function (page) {

            if (page < 1 || page > $scope.pager.totalPages) {
                return;
            }

            // alert(page);
            $scope.pages.currPage = page;
            $scope.search();
        };

        $scope.generateQR = function(qrDetails){
            $rootScope.loadingStart();
            // var qr = {
            // siteId:siteId,
            // locationId:locationId
            // };
            // //console.log(qr.siteId);
            // //console.log(qr.locationId);
            // LocationComponent.createQr(qr).then(function(response){
            LocationComponent.createQr(qrDetails).then(function(response){

                //console.log('response qr---',response);

                $scope.qr_img = response.url;

                // var eleId = 'qrImage';
               // var ele = document.getElementById(eleId);
                    // ele.setAttribute('src',$scope.qr_img);
                    $rootScope.loadingStop();
                // //console.log('create qr---',$scope.qr_img);

            });
        }

        $scope.loadQRImage = function(image,qId) {
            var eleId = 'qrImage';
            var ele = document.getElementById(eleId);
            ele.setAttribute('src',image);
        };

        $scope.printDiv = function(printable) {
            // var printContents = document.getElementById(printable).innerHTML;
            // var originalContents = document.body.innerHTML;
            // document.body.innerHTML = printContents;
            // window.print();
            // document.body.innerHTML = originalContents;

            var printContents = document.getElementById(printable).innerHTML;
            var popupWin = window.open('', '_blank', 'width=1000,height=1000');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head>' +
                '<body onload="window.print()">' + printContents + '</body>' +
                '</html>');
            popupWin.document.close();
        }

        $scope.printPage = function () {
            window.print();
        }

        $scope.qrcodePage = function(){
           if(parseInt($stateParams.location) > 0){
                //console.log($stateParams.location);
                var locationId = parseInt($stateParams.location);
                LocationComponent.findOne(locationId).then(function (response) {
                    //console.log(response);
                    $scope.qrInfoDetails  = response;
                    if(!$scope.qrInfoDetails){
                       $location.path('/locations');
                    }
                    // $scope.generateQR(response.siteId,response.id);
                    $scope.generateQR(response);
                });
           }else{
              $location.path('/locations');
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

    });




