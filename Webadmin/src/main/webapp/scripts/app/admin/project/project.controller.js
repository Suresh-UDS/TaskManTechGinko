'use strict';

angular.module('timeSheetApp')
    .controller('ProjectController', function ($scope, $rootScope, $state, $timeout,
     ProjectComponent,$http,$stateParams,$location,PaginationComponent,getLocalStorage) {
        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorProjectExists = null;
        $scope.selectedProject = null;
        $scope.searchProject = null;
        $scope.searchCriteria = {};
        $scope.pages = { currPage : 1};
        $scope.pager = {};
        $scope.noData = false;
        $scope.btnDisable = false;
        $scope.saveLoad = false;
        $rootScope.conformText = null;
        $scope.clientGroup = {};
        $scope.selectedClientGroup = {};
        $scope.allClients = {id:0 , name: '-- ALL CLIENTS --'};
        $scope.client = {};
        $scope.clients = [];


        //$timeout(function (){angular.element('[ng-model="name"]').focus();});

        $scope.project = $scope.project || {};
        $scope.project.addressLat = $scope.project.addressLat || 0;
        $scope.project.addressLng = $scope.project.addressLng || 0;

        $scope.calendar = {
        		start : false,
        		end : false,
        };

        $scope.printPage = function () {
            window.print();
        }

        $scope.conform = function(text)
        {
            $rootScope.conformText = text;
           $('#conformationModal').modal();


        }


        $scope.saveProject = function () {
        	console.log("-------")
            $rootScope.conformText = "";
            $scope.saveLoad = true;
        	console.log($scope.map)
            // $scope.loadingStart();
        	$scope.error = null;
        	$scope.success =null;
        	$scope.errorProjectExists = null;
        	$scope.btnDisable = true;
        	if($scope.selectedClientGroup && $scope.selectedClientGroup.id) {
        		$scope.project.clientGroup = $scope.selectedClientGroup.clientgroup;
        	}
            ProjectComponent.createProject($scope.project).then(function () {
                $scope.success = 'OK';
                $scope.showNotifications('top','center','success','Client has been added successfully!!');
                $scope.loadingStop();
            	//$scope.loadProjects();
                $scope.saveLoad = false;
            	$location.path('/projects');
            }).catch(function (response) {
                $scope.loadingStop();
                $scope.saveLoad = false;
                $scope.success = null;
              //console.log('Error - '+ response.data);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                    $scope.errorProjectExists = 'ERROR';
                    $scope.showNotifications('top','center','danger','Client already exists');
                } else {
                    $scope.showNotifications('top','center','danger','Unable to add client, please try again later..');
                    $scope.error = 'ERROR';
                }
                $scope.btnDisable = false;
            });

        };

        $rootScope.back = function (text) {
            if(text == 'cancel' || text == 'back'){
                $scope.cancelProject();
            }else if(text == 'save'){
                $scope.saveProject();
            }else if( text== 'update'){
                /** @reatin - retaining scope value.**/
                $rootScope.retain=1;
                $scope.updateProject()
            }
        };

        $scope.cancelProject = function () {

             /** @reatin - retaining scope value.**/
                $rootScope.retain=1;

            $rootScope.conformText = "";
        	$location.path('/projects');
        };

        $scope.loadProjectsList = function () {
            ProjectComponent.findAll().then(function (data) {
                $scope.projectsList = data;
                $scope.clients[0] = $scope.allClients;
                for(var i=0;i<$scope.projectsList.length;i++)
                {
                    //$scope.uiClient[i] = $scope.projectsList[i].name;
                    $scope.clients[i+1] = $scope.projectsList[i];
                  //console.log('Client array',$scope.clients);
                }
                $scope.clientFilterDisable = false;
            });
        };

        // Load Clients for selectbox //
        $scope.clientDisable = true;
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
            $scope.filter = false;
            $scope.clearField = false;
            $scope.searchProject = $scope.projectsList[$scope.uiClient.indexOf(project)]
          //console.log('Project dropdown list:',$scope.searchProject);

        }

        //

        //Filter
        $scope.clientFilterDisable = true;
        $scope.filter = false;
        //

        $scope.loadProjects = function () {
            $scope.clearFilter();
            $scope.search();
        };
        $scope.refreshPage = function(){
            $scope.loadProjects();
        }


        $scope.loadProject = function() {
            if(parseInt($stateParams.id) > 0){
                var projId = parseInt($stateParams.id);
            	ProjectComponent.findOne(projId).then(function (data) {
                    $scope.project.addressLng = data.addressLng
                    $scope.project.addressLat = data.addressLat;
                    $scope.project = data;
                    $scope.selectedClientGroup ={clientgroup:$scope.project.clientGroup};
                    $scope.title = $scope.project.name;
                    if(!$scope.project){
                       $location.path('/projects');
                    }
                });
            }else{
               $location.path('/projects');
            }

        };

        $scope.updateProject = function () {
            if(parseInt($stateParams.id) > 0){
                $scope.saveLoad = true;
                $rootScope.conformText = "";
                $scope.loadingStart();
                $scope.btnDisable = true;
                if($scope.selectedClientGroup){
                	$scope.project.clientGroup = $scope.selectedClientGroup.clientgroup;
                }
                ProjectComponent.updateProject($scope.project).then(function () {
                    $scope.success = 'OK';
                    $scope.showNotifications('top','center','success','Client has been updated successfully!!');
                    $scope.loadingStop();
                    $scope.saveLoad = false;
                    //$scope.loadProjects();
                    $location.path('/projects');
                }).catch(function (response) {
                    $scope.success = null;
                    $scope.loadingStop();
                    $scope.saveLoad = false;
                  //console.log('Error - '+ response.data);
                    if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                        $scope.errorProjectExists = 'ERROR';
                        $scope.showNotifications('top','center','danger','Client already exists');
                    } else {
                        $scope.error = 'ERROR';
                        $scope.showNotifications('top','center','danger','Unable to update client, please try again later..');
                    }
                    $scope.btnDisable = false;
                });
            }else{
               $location.path('/projects');
            }
        };

        $scope.loadClientGroup = function () {
        	$scope.loadingStart();
           ProjectComponent.loadClientGroup().then(function (data) {
             //console.log("Loading all Client Group -- " , data)
               $scope.clientGroups = data;
               $scope.loadingStop();
           });
       }

        /* Add Client group */

       $scope.addClientGroup = function () {
         //console.log($scope.clientGroup);
            $scope.loadingStart();
           if($scope.clientGroup){
             //console.log("client Group entered");
               ProjectComponent.createClientGroup($scope.clientGroup).then(function (response) {
                 //console.log(response);
                   if(response.data.status && response.data.status === "400") {
                   	$scope.loadingStop();
                   	$scope.showNotifications('top','center','danger','Client Group already exists.');
                   }else{
                   	  $scope.clientGroup = "";
                         $scope.showNotifications('top','center','success','Client Group has been added Successfully!!');
                         $scope.loadClientGroup();
                   }

               }).catch(function(){
               $scope.loadingStop();
               $scope.showNotifications('top','center','danger','Unable to Client group. Please try again later..');
               $scope.error = 'ERROR';
           });
           }else{
             //console.log("Client Group not entered");
           }


       }


        $scope.deleteConfirm = function (project){
        	$scope.confirmProject = project;
        }

        $scope.deleteProject = function () {
        	ProjectComponent.deleteProject($scope.confirmProject);
        	$scope.success = 'OK';
        	$state.reload();
        };

        var that =  $scope;

        $scope.openCalendar = function(e,cmp) {
            e.preventDefault();
            e.stopPropagation();

            that.calendar[cmp] = true;
        };

        $scope.isActiveAsc = 'id';
        $scope.isActiveDesc = '';

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveAsc = field;
            $scope.isActiveDesc = '';
            $scope.isAscOrder = true;
            //$scope.search();
            $scope.loadProjects();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
            //$scope.search();
            $scope.loadProjects();
        }


        $scope.searchFilter = function () {
            $('.BasicFilterModal.in').modal('hide');
            $scope.setPage(1);
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
        	
        	 /* Root scope (search criteria) start*/
        
             if($rootScope.searchFilterCriteria.isDashboard){
            	 
            	 if($rootScope.searchFilterCriteria.projectId){
             		$scope.searchProject ={id:$rootScope.searchFilterCriteria.projectId,name:$rootScope.searchFilterCriteria.projectName};
             		$scope.client.selected =$scope.searchProject;
             	}else{
             	   $scope.searchProject = null;
             	   $scope.client.selected =$scope.allClients;
             	} 	
            	 /* Root scope (search criteria) end*/
             } 
             else{
            	 
            	 if($scope.client.selected && $scope.client.selected.id !=0){
             		$scope.searchProject = $scope.client.selected;
             	}else{
             	   $scope.searchProject = null;
             	} 
             }
             
            /* Root scope (search criteria) */
            $rootScope.searchFilterCriteria.isDashboard = false;
             
        	console.log('Selected  project -' , $scope.searchProject);

        	
        	if(!$scope.searchProject) {
        			$scope.searchCriteria.findAll = true;	
        	}
        		
        	if($scope.searchProject) {
	        	$scope.searchCriteria.projectId = $scope.searchProject.id;	
	        	$scope.searchCriteria.projectName = $scope.searchProject.name;
        	}else {
        		$scope.searchCriteria.projectId = null;
        		$scope.searchCriteria.projectName = null;
        	}

        
        	console.log($scope.searchCriteria);

        	//------
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

              
                $scope.projects = '';
                $scope.projectsLoader = false;
                $scope.loadPageTop();

                /* Localstorage (Retain old values while edit page to list) start */

                 if($rootScope.retain == 1){

                    $scope.localStorage = getLocalStorage.getSearch();
                  //console.log('Local storage---',$scope.localStorage);

                    if($scope.localStorage){
                        $scope.pages.currPage = $scope.localStorage.currPage;
                        //$scope.searchProject = {id:$scope.localStorage.projectId,name:$scope.localStorage.projectName,searchStatus:'0'};
                        $scope.filter = true;
                        if($scope.localStorage.projectId){
                             $scope.searchProject ={id:$scope.localStorage.projectId,name:$scope.localStorage.projectName};
                             $scope.client.selected = $scope.searchProject;
                        }else{
                             $scope.searchProject = null;
                             $scope.client.selected = $scope.searchProject;
                        }
                        

                    }

                    $rootScope.retain = 0;

                    $scope.searchCriteras  = $scope.localStorage;
                 }else{

                	 $scope.searchCriteras  = $scope.searchCriteria;
                 }
                 
               //console.log("search criterias",$scope.searchCriteras);

                 /* Localstorage (Retain old values while edit page to list) end */

            ProjectComponent.search($scope.searchCriteras).then(function (data) {
                $scope.projects = data.transactions;
                $scope.projectsLoader = true;

                /** retaining list search value.**/
                getLocalStorage.updateSearch($scope.searchCriteras);

                /*
                    ** Call pagination  main function **
                */
                 $scope.pager = {};
                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                 $scope.totalCountPages = data.totalCount;

               //console.log("Pagination",$scope.pager);
               //console.log($scope.projects);



                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;


                if($scope.projects && $scope.projects.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.projects.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10;
                    $scope.noData = false;

                }else{
                     $scope.noData = true;
                }

            });

        };


        $scope.pageSort = 10;


        $scope.clearFilter = function() {
            $scope.clearField = true;
            $scope.selectedProject = null;
            $scope.searchProject = null;
            $scope.searchCriteria = {};
            $scope.client.selected = $scope.allClients;
            $scope.localStorage = null;
            $rootScope.searchCriteriaProject = null;
            
            /* Root scope (search criteria) */
            $rootScope.searchFilterCriteria.isDashboard = false;
            
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            //$scope.search();
        };

        //init load
        $scope.initLoad = function(){
             $scope.loadPageTop();
             //$scope.loadProjects();
             $scope.setPage(1);

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

        $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
        }

    });
