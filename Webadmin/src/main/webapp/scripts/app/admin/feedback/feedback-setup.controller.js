'use strict';

angular.module('timeSheetApp')
    .controller('FeedbackSetupController', function ($rootScope, $scope, $state, $timeout,
     FeedbackComponent,ProjectComponent,SiteComponent, LocationComponent, $http, $stateParams,
     $location,PaginationComponent) {
        $rootScope.loadingStop();
        $rootScope.loginView = false;
    	$scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorUserExists = null;
        $scope.validationError = null;
        $scope.validationErrorMsg = null;
        $scope.authorities = ["User", "Admin"];
        $scope.pager = {};
        $scope.noData = false;
        $scope.btnDisable = false;

        //$timeout(function (){angular.element('[ng-model="name"]').focus();});

        $scope.pages = { currPage : 1};

        $scope.feedbackMappingList;

        $scope.selectedProject;

        $scope.selectedSite;

        $scope.selectedBlock;

        $scope.selectedFloor;

        $scope.selectedZone;

        $scope.selectedFeedbackMaster;

        $scope.feedbackMapping ={};

        $scope.projects;

        $scope.sites;

        $scope.blocks;

        $scope.floors;

        $scope.zones;

        $scope.searchCriteria = {};
        $scope.selectedProject = null;
        $scope.selectedSite = null;
        $scope.selectedBlock = null;
        $scope.selectedFloor = null;
        $scope.selectedZone = null;
        $scope.selectedLocation = null;

        $scope.feedbackMasterList;
        
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

        $scope.pageSort = 10;

        $scope.init = function(){
	        $scope.loading = true;
	        //$scope.loadFeedbackMasters();
            $scope.loadProjects()
	        $scope.loadFeedbackMappings();
        };


        //Filter

        // Load Clients for selectbox //
        $scope.clientFilterDisable = true;
        $scope.uiClient = [];
        $scope.getClient = function (search) {
            var newSupes = $scope.uiClient.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }
            return newSupes;
        }

        //Load Sites for selectbox //
        $scope.siteFilterDisable = true;
        $scope.uiSite = [];
        $scope.getSites = function (search) {

            var newSupes = $scope.uiSite.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }
            return newSupes;
        }

        //
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

        // Load Floors for selectbox //
        $scope.floorFilterDisable = true;
        $scope.floorDisable = true;
        $scope.uiFloor = [];
        $scope.getFloor = function (search) {
            var newSupes = $scope.uiFloor.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }
            return newSupes;
        }
        //

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

        $scope.loadSearchProject = function (searchProject) {
            $scope.clearField = false;
            $scope.hideSite = false;
            $scope.siteSpin = true;
            $scope.uiSite.splice(0,$scope.uiSite.length);
            $scope.searchProject = $scope.projects[$scope.uiClient.indexOf(searchProject)]
        }
        $scope.loadSearchSite = function (searchSite) {
            //console.log($scope.searchProject)
            $scope.hideBlock = false;
            $scope.hideSite = true;
            $scope.uiBlock.splice(0,$scope.uiBlock.length);
            $scope.searchSite = $scope.sites[$scope.uiSite.indexOf(searchSite)]
            $scope.show = false;
        }
        $scope.loadSearchBlock = function (searchBlock) {
            $scope.hideBlock = true;
            $scope.hideFloor = false;
            $scope.uiFloor.splice(0,$scope.uiFloor.length);
            $scope.searchBlock = $scope.blocks[$scope.uiBlock.indexOf(searchBlock)]
        }
        $scope.loadSearchFloor = function (searchFloor) {
            $scope.hideZone = false;
            $scope.hideFloor = true;
            $scope.uiBlock.splice(0,$scope.uiZone.length);
            $scope.searchFloor = $scope.floors[$scope.uiFloor.indexOf(searchFloor)]
        }
        $scope.loadSearchZone = function (searchZone) {
            $scope.hideZone = true;
            $scope.searchZone = $scope.zones[$scope.uiZone.indexOf(searchZone)]
        }


        //Filter end

        $scope.loadProjects = function () {
        		ProjectComponent.findAll().then(function (data) {
                $scope.projects = data;
                /** Ui-select scope **/
                $scope.clients[0] = $scope.allClients;
                //console.log('project list --' ,$scope.projects);
                    //
                    /*for(var i=0;i<$scope.projects.length;i++)
                    {
                        $scope.uiClient[i] = $scope.projects[i].name;
                    }*/
                    
	                for(var i=0;i<$scope.projects.length;i++)
	                {
	                   
	                    $scope.clients[i+1] = $scope.projects[i];
	                }
                
                    $scope.clientFilterDisable = false;
                    //
            });
        };

        $scope.loadSites = function () {

            var projectId = $scope.selectedProject ? $scope.selectedProject.id : $scope.searchProject ? $scope.searchProject.id : 0;
        		ProjectComponent.findSites(projectId).then(function (data) {
        			$scope.selectedSite = null;
                $scope.sites = data;
                    //
                    for(var i=0;i<$scope.sites.length;i++)
                    {
                        $scope.uiSite[i] = $scope.sites[i].name;
                    }
                    $scope.siteSpin = false;
                    $scope.siteFilterDisable = false;
                    //
            });
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
	              /*if(jQuery.isEmptyObject($scope.SelectClient.selected) == false) {
	                     var depProj=$scope.SelectClient.selected.id;
	                     $scope.SelectSites = [];
	                     $scope.SelectSite.selected = null;
	                     $scope.selectedSite = null;
	              }else */
            	  if(jQuery.isEmptyObject($scope.searchProject) == false){
	                      var depProj=$scope.searchProject.id;
	              }else{
	                      var depProj=0;
	              }
	        
	              ProjectComponent.findSites(depProj).then(function (data) {
	                  $scope.sitesList = data;
	                  $scope.sitesLists = [];
	                  $scope.sitesListOne.selected = null;
	                  $scope.sitesLists[0] = $scope.allSites;
	                  
	                  //////console.log('Site List',$scope.sitesList);
	                  
	                  for(var i=0;i<$scope.sitesList.length;i++)
	                  {
	                      $scope.sitesLists[i+1] = $scope.sitesList[i];
	                      
	                      
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
                    /*if($scope.SelectSite.selected){
                		$scope.selectedSite = $scope.SelectSite.selected;
                	}else{
                	   $scope.selectedSite = null;
                	}*/
                    if(jQuery.isEmptyObject($scope.selectedProject) == false) {

                           var depProj=$scope.selectedProject.id;
                    }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                            var depProj=$scope.searchProject.id;
                    }else{
                            var depProj=0;
                    }
                    if(jQuery.isEmptyObject($scope.selectedSite) == false) {
                          ////console.log('selected project -' + $scope.selectedProject.id + ', site -' + $scope.selectedSite.id);
                           var depSite=$scope.selectedSite.id;
                    }else if(jQuery.isEmptyObject($scope.searchSite) == false){
                            var depSite=$scope.searchSite.id;
                    }else{
                            var depSite=0;
                    }
                       LocationComponent.findBlocks(depProj,depSite).then(function (data) {
                           $scope.selectedBlock = null;
                       $scope.blocksList = data;
                       
                       ////console.log("block List",$scope.blocksList);
      
                            $scope.blocksLists = $scope.blocksList;
                            
                            ////console.log($scope.uiBlock)
                            $scope.blockDisable = false;
                            $scope.blockSpin = false;
                            $scope.blockFilterDisable = false;
                   });
                }else{
                   $scope.searchSite = '';
                }

    	    };
    	    
    	    
    	    
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
                            ////console.log($scope.floorsList);
                           
                                $scope.floorsLists = $scope.floorsList;
                            
                            ////console.log($scope.floorsList);
                            $scope.floorDisable = false;
                            $scope.floorSpin = false;
                            $scope.floorFilterDisable = false;
                    });
    	        }
    	    };
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
                       ////console.log('load zones - ' + $scope.selectedProject.id +',' +$scope.selectedSite.id +',' +$scope.selectedBlock +','+$scope.selectedFloor);
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
                            ////console.log($scope.zonesList);
                            
                                $scope.zonesLists = $scope.zonesList;
                            
                            ////console.log($scope.zonesList);
                            $scope.zoneDisable = false;
                            $scope.zoneSpin = false;
                            $scope.zoneFilterDisable = false;
                    });

                }

    	    };

        $scope.loadBlocks = function () {

            var projectId = $scope.selectedProject ? $scope.selectedProject.id : $scope.searchProject ? $scope.searchProject.id : 0;
            var siteId = $scope.selectedSite ? $scope.selectedSite.id : $scope.searchSite ? $scope.searchSite.id : 0;

	    		LocationComponent.findBlocks(projectId ,siteId).then(function (data) {
	    			$scope.selectedBlock = null;
	            $scope.blocks = data;
                    //
                    for(var i=0;i<$scope.blocks.length;i++)
                    {
                        $scope.uiBlock[i] = $scope.blocks[i];
                    }
                    $scope.blockSpin = false;
                    $scope.blockFilterDisable = false;

                    //
	        });
	    };

        $scope.loadFloors = function () {
            var projectId = $scope.selectedProject ? $scope.selectedProject.id : $scope.searchProject ? $scope.searchProject.id : 0;
            var siteId = $scope.selectedSite ? $scope.selectedSite.id : $scope.searchSite ? $scope.searchSite.id : 0;
            var block = $scope.selectedBlock ? $scope.selectedBlock : $scope.searchBlock ? $scope.searchBlock : null;

            LocationComponent.findFloors(projectId,siteId,block).then(function (data) {
	    			$scope.selectedFloor = null;
	            $scope.floors = data;
                    //
                    for(var i=0;i<$scope.floors.length;i++)
                    {
                        $scope.uiFloor[i] = $scope.floors[i];
                    }
                    $scope.floorSpin = false;
                    $scope.floorFilterDisable = false;
                    //
	        });
	    };

        $scope.loadZones = function () {
            var projectId = $scope.selectedProject ? $scope.selectedProject.id : $scope.searchProject ? $scope.searchProject.id : 0;
            var siteId = $scope.selectedSite ? $scope.selectedSite.id : $scope.searchSite ? $scope.searchSite.id : 0;
            var block = $scope.selectedBlock ? $scope.selectedBlock : $scope.searchBlock ? $scope.searchBlock : null;
            var floor = $scope.selectedFloor ? $scope.selectedFloor : $scope.searchFloor ? $scope.searchFloor : null;
        		// //console.log('load zones - ' + $scope.selectedProject.id +',' +$scope.selectedSite.id +',' +$scope.selectedBlock +','+$scope.selectedFloor);
	    		LocationComponent.findZones(projectId,siteId,block, floor).then(function (data) {
	    			$scope.selectedZone = null;
	            $scope.zones = data;
	            //
                    for(var i=0;i<$scope.zones.length;i++)
                    {
                        $scope.uiZone[i] = $scope.zones[i];
                    }
                    $scope.zoneSpin = false;
                    $scope.zoneFilterDisable = false;

                    //
	        });
	    };


	    $scope.loadFeedbackMasters = function() {
	    		if($scope.selectedProject) {
		    		$scope.searchCriteria.projectId = $scope.selectedProject.id;
	    		}
	    		if($scope.selectedSite) {
		    		$scope.searchCriteria.siteId = $scope.selectedSite.id;
	    		}
	    		if(!$scope.selectedProject && !$scope.selectedSite) {
	    			$scope.searchCriteria.findAll = true;
	    		}
	    		$scope.searchCriteria.isList = true;
        		FeedbackComponent.searchFeedbackMaster($scope.searchCriteria).then(function(data) {
        			$scope.feedbackMasterList = data.transactions;
        		})
        }


        $scope.refreshPage = function() {

    			$scope.loadFeedbackMappings();
        }

        $scope.loadFeedbackMappings = function () {
	    		//console.log('called loadFeedbackMappings');
                $scope.clearFilter();
	    		$scope.search();
	    };

        $scope.loadFeedbackMapping = function(id) {
        		//console.log('loadFeedbackMapping -' + id);
        		FeedbackComponent.findOneFeedbackMapping(id).then(function (data) {
        			$scope.feedbackMapping = data;
        			//console.log('Feedback mapping retrieved - ' + JSON.stringify($scope.feedbackMapping));

            });

        };

        $scope.updateFeebackMapping = function () {
        		//console.log('Feedback mapping details - ' + JSON.stringify($scope.feedbackMapping));

        		FeedbackComponent.updateFeedbackMapping($scope.feedbackMapping).then(function () {
	            	$scope.success = 'OK';
	            	$location.path('/feedback-setup');
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
            });
        };

        $scope.saveFeedbackMapping = function(){
        		$scope.feedbackMapping.projectName = $scope.selectedProject.name;
        		$scope.feedbackMapping.projectId = $scope.selectedProject.id;
        		$scope.feedbackMapping.siteId = $scope.selectedSite.id;
        		$scope.feedbackMapping.siteName = $scope.selectedSite.name;
        		$scope.feedbackMapping.block = $scope.selectedBlock;
        		$scope.feedbackMapping.floor = $scope.selectedFloor;
        		$scope.feedbackMapping.zone = $scope.selectedZone;
        		$scope.feedbackMapping.feedback = $scope.selectedFeedback;
            //console.log("Before pushing feedback mapping to server");
            //console.log(JSON.stringify($scope.feedbackMapping));
            $scope.btnDisable = true;
            FeedbackComponent.createFeedbackMapping($scope.feedbackMapping).then(function(){
            		//console.log("success");
  	        		$location.path('/feedback-setup');
  	        		//$scope.loadFeedbackItems();
  	        }).catch(function (response) {
  	            $scope.success = null;
                $scope.btnDisable = false;
  	            //console.log(response.data);
  	            if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
  	                $scope.errorFeedbackMappingExists = true;
  	            } else if(response.status === 400 && response.data.message === 'error.validation'){
  	            	$scope.validationError = true;
  	            	$scope.validationErrorMsg = response.data.description;
  	            } else {
  	                $scope.error = 'ERROR';
  	            }
  	        });
        };

          $scope.viewFbSetup = function(id){
            var FbSetupId =parseInt(id);
         if(FbSetupId){

            FeedbackComponent.findOneFeedbackMapping(FbSetupId).then(function(data){

                //console.log("Feedback mapping details ==" + JSON.stringify(data));

                $scope.FbSetupList= data;

            });

         }else{

            $location.path('/feedback-setup');
         }

        };


        $scope.isActiveAsc = 'id';
        $scope.isActiveDesc = '';

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveAsc = field;
            $scope.isActiveDesc = '';
            $scope.isAscOrder = true;
            $scope.search();
            //$scope.loadModuleActions();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
            $scope.search();
            //$scope.loadModuleActions();
        }

        $scope.searchFilter = function () {
        	$('.AdvancedFilterModal.in').modal('hide');
            $scope.setPage(1);
            $scope.search();
         }

         $scope.searchFilter1 = function () {
            $scope.selectedBlock=null;
            $scope.selectedFloor = null;
            $scope.selectedZone = null;
            $scope.setPage(1);
            $scope.search();
         }


        $scope.errorMsg = function(){
            $scope.show = true;
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
            //console.log('Selected feedback' + $scope.selectedFeedback);

            if(!$scope.selectedFeedback) {
                if($rootScope.searchCriteriaFeedback) {
                    $scope.searchCriteria = $rootScope.searchCriteriaFeedback;
                }else {
                    $scope.searchCriteria.findAll = true;
                }

            }else {
                if($scope.selectedFeedback) {
                    $scope.searchCriteria.findAll = false;
                    $scope.searchCriteria.feedbackId = $scope.selectedFeedback.id;
                    $scope.searchCriteria.title = $scope.selectedFeedback.title;
                    //console.log('selected user role id ='+ $scope.selectedFeedback);
                }else {
                    $scope.searchCriteria.feedbackId = 0;
                }
            }


             $scope.searchCriteria.currPage = currPageVal;
             $scope.searchCriteria.findAll = false;
             $scope.searchCriteria.isList = false;

             if( !$scope.searchProject && !$scope.searchSite
                &&  !$scope.searchBlock &&  !$scope.searchFloor &&  !$scope.searchZone) {
                $scope.searchCriteria.findAll = true;
            }


                if($scope.selectedTitle)
                {
                    $scope.searchCriteria.ticketTitle = $scope.selectedTitle;
                    //console.log('selected Title ='+ $scope.searchCriteria.ticketTitle);
                }
                if($scope.selectedDescription)
                {
                    $scope.searchCriteria.ticketDescription = $scope.selectedDescription;
                    //console.log('selected ticket Description ='+ $scope.searchCriteria.ticketDescription);
                }


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

                if($scope.pageSort){
                    $scope.searchCriteria.sort = $scope.pageSort;
                }

                if($scope.selectedColumn){

                    $scope.searchCriteria.columnName = $scope.selectedColumn;
                    $scope.searchCriteria.sortByAsc = $scope.isAscOrder;

                }
                else{
                    $scope.searchCriteria.columnName ="id";
                    $scope.searchCriteria.sortByAsc = true;
                }
                
                $scope.searchCriteras = $scope.searchCriteria;

               //console.log("search criteria",$scope.searchCriteria);
                     $scope.feedbackMappingList = '';
                     $scope.feedbackMappingListLoader = false;
                     $scope.loadPageTop();


            FeedbackComponent.searchFeedbackMapping($scope.searchCriteria).then(function (data) {
                $scope.feedbackMappingList = data.transactions;
                $scope.feedbackMappingListLoader = true;

                 /*
                    ** Call pagination  main function **
                */
                 $scope.pager = {};
                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                 $scope.totalCountPages = data.totalCount;

                //console.log("Pagination",$scope.pager);
                //console.log('feedback Mapping list -' + JSON.stringify($scope.feedbackMappingList));
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                $scope.loading = false;

                if($scope.feedbackMappingList && $scope.feedbackMappingList.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.feedbackMappingList.length;
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
            $scope.siteFilterDisable = true;
            $scope.regionFilterDisable = true;
            $scope.branchFilterDisable = true;
            $scope.sites = null;
            
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
        	
            $scope.searchSite = null;
            $scope.searchProject = null;
            $scope.searchBlock = null;
            $scope.searchFloor = null;
            $scope.searchZone = null;
            $scope.searchCriteria = {};
            $rootScope.searchCriteriaSite = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
             $("#collapseTwo").removeClass("in");
             $("#collapseOne").addClass("in");
             $("#collapseOne").css("height", "180px");
            //$scope.search();
        };

        $scope.cancelFeedbackMapping = function () {
        		$location.path('/feedback-setup');
        };

      //init load
        $scope.initLoad = function(){
             $scope.loadPageTop();
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


