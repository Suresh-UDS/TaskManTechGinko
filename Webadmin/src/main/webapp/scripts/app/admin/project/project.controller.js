'use strict';

angular.module('timeSheetApp')
    .controller('ProjectController', function ($scope, $rootScope, $state, $timeout, ProjectComponent,$http,$stateParams,$location) {
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorProjectExists = null;



        $timeout(function (){angular.element('[ng-model="name"]').focus();});

        $scope.pages = { currPage : 1};

        $scope.selectedProject;

        $scope.project = $scope.project || {};
        $scope.project.addressLat = $scope.project.addressLat || 0;
        $scope.project.addressLng = $scope.project.addressLng || 0;

        $scope.calendar = {
        		start : false,
        		end : false,
        };

        $scope.initDataTables = function(){

        console.log("Data tables function")

        $('#datatables').DataTable({
                    "pagingType": "full_numbers",
                    "lengthMenu": [
                        [10, 25, 50, -1],
                        [10, 25, 50, "All"]
                    ],
                    responsive: true,
                    language: {
                            search: "_INPUT_",
                        searchPlaceholder: "Search records",
                    }

                });


                var table = $('#datatables').DataTable();

                // Edit record
                table.on('click', '.edit', function() {
                    $tr = $(this).closest('tr');

                    var data = table.row($tr).data();
                    alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
                });

                // Delete a record
                table.on('click', '.remove', function(e) {
                    $tr = $(this).closest('tr');
                    table.row($tr).remove().draw();
                    e.preventDefault();
                });

                //Like record
                table.on('click', '.like', function() {
                    alert('You clicked on Like button');
                });

                $('.card .material-datatables label').addClass('form-group');

        }

        $scope.saveProject = function () {
        	console.log("-------")
        	console.log($scope.map)

        	$scope.error = null;
        	$scope.success =null;
        	$scope.errorProjectExists = null;
        	ProjectComponent.createProject($scope.project).then(function () {
                $scope.success = 'OK';
            	//$scope.loadProjects();
            	$location.path('/projects');
            }).catch(function (response) {
                $scope.success = null;
                console.log('Error - '+ response.data);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                    $scope.errorProjectExists = 'ERROR';
                } else {
                    $scope.error = 'ERROR';
                }
            });;

        };

        $scope.cancelProject = function () {
        	$location.path('/projects');
        };

        $scope.loadAllProjects = function () {
        	ProjectComponent.findAll().then(function (data) {
        		$scope.allProjects = data;
        	});
        };

        $scope.loadProjects = function () {
//        	ProjectComponent.findAll().then(function (data) {
//                $scope.projects = data;
//            });
            $scope.search();
        };
        $scope.refreshPage = function(){
                $scope.clearFilter();
                $scope.loadProjects();
        }


        $scope.loadProject = function() {
        	ProjectComponent.findOne($stateParams.id).then(function (data) {
                $scope.project.addressLng = data.addressLng
                $scope.project.addressLat = data.addressLat;
                $scope.project = data;
            });

        };

        $scope.updateProject = function () {
        	ProjectComponent.updateProject($scope.project).then(function () {
                $scope.success = 'OK';
            	//$scope.loadProjects();
            	$location.path('/projects');
            }).catch(function (response) {
                $scope.success = null;
                console.log('Error - '+ response.data);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                    $scope.errorProjectExists = 'ERROR';
                } else {
                    $scope.error = 'ERROR';
                }
            });;
        };

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

        $scope.search = function () {
        	var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
        	if(!$scope.searchCriteria) {
            	var searchCriteria = {
            			currPage : currPageVal
            	}
            	$scope.searchCriteria = searchCriteria;
        	}

        	$scope.searchCriteria.currPage = currPageVal;
        	console.log('Selected  project -' + $scope.selectedProject);
        	console.log('search criteria - '+JSON.stringify($rootScope.searchCriteriaProject));

        	if(!$scope.selectedProject) {
        		if($rootScope.searchCriteriaProject) {
            		$scope.searchCriteria = $rootScope.searchCriteriaProject;
        		}else {
        			$scope.searchCriteria.findAll = true;
        		}
        	}else if($scope.selectedProject) {
        		$scope.searchCriteria.findAll = false;
	        	if($scope.selectedProject) {
		        	$scope.searchCriteria.projectId = $scope.selectedProject.id;
		        	if(!$scope.searchCriteria.projectId) {
		        		$scope.searchCriteria.projectName = $scope.selectedProject;
		        		console.log('selected project name ='+ $scope.selectedProject + ', ' +$scope.searchCriteria.projectName);
		        	}else {
			        	$scope.searchCriteria.projectName = $scope.selectedProject.name;
		        	}
	        	}else {
	        		$scope.searchCriteria.projectId = 0;
	        	}



        	}
        	console.log($scope.searchCriteria);
        	ProjectComponent.search($scope.searchCriteria).then(function (data) {
                $scope.projects = data.transactions;
                console.log($scope.projects);
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                
                $scope.numberArrays = [];
                var startPage = 1;
                if(($scope.pages.totalPages - $scope.pages.currPage) >= 10) {
                		startPage = $scope.pages.currPage;
                }else if($scope.pages.totalPages > 10) {
                		startPage = $scope.pages.totalPages - 10;
                }
                var cnt = 0;
                for(var i=startPage; i<=$scope.pages.totalPages; i++){
                		cnt++;
                		if(cnt <= 10) {
	                		$scope.numberArrays.push(i);
                		}
                }

                if($scope.jobs && $scope.projects.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.projects.length;
                    $scope.totalCountPages = data.totalCount;

                    if($scope.showCurrPage != data.totalPages){
                    	$scope.pageStartIntex =  (data.currPage - 1) * $scope.pageSort + 1; // 1 to // 11 to

                        $scope.pageEndIntex = $scope.pageEntries * $scope.showCurrPage; // 10 entries of 52 // 10 * 2 = 20 of 52 entries

                    }else if($scope.showCurrPage === data.totalPages){
                    	$scope.pageStartIntex =  (data.currPage - 1) * $scope.pageSort + 1;
                    	$scope.pageEndIntex = $scope.totalCountPages;
                    }
                }
                
                
                if($scope.projects == null){
                    $scope.pages.startInd = 0;
                }else{
                    $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
                }
                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
                $scope.pages.totalCnt = data.totalCount;
            	$scope.hide = true;
            });
        	$rootScope.searchCriteriaProject = $scope.searchCriteria;
        	if($scope.pages.currPage == 1) {
                        	$scope.firstStyle();
                    	}
        };

        $scope.clickNextOrPrev = function(number){
	        	$scope.pages.currPage = number;
	        	$scope.search();
	    }


                $scope.first = function() {
                	if($scope.pages.currPage > 1) {
                    	$scope.pages.currPage = 1;
                    	$scope.firstStyle();
                    	$scope.search();
                	}
                };

                $scope.firstStyle = function() {
               	 var ele = angular.element('#first');
	            	 ele.addClass('disabledLink');
	            	 ele = angular.element('#previous');
	            	 ele.addClass('disabledLink');
	            	 if($scope.pages.totalPages > 1) {
	         	       	 var ele = angular.element('#next');
	        	    	 ele.removeClass('disabledLink');
	        	    	 ele = angular.element('#last');
	        	    	 ele.removeClass('disabledLink');
	            	 }

                }

                $scope.previous = function() {
                	if($scope.pages.currPage > 1) {
                    	$scope.pages.currPage = $scope.pages.currPage - 1;
                    	$scope.search();
                    	if($scope.pages.currPage == 1) {
        	       	       	 var ele = angular.element('#first');
        	    	    	 ele.addClass('disabled');
        	    	    	 ele = angular.element('#previous');
        	    	    	 ele.addClass('disabled');
                    	}
             	       	 var ele = angular.element('#next');
            	    	 ele.removeClass('disabled');
            	    	 ele = angular.element('#last');
            	    	 ele.removeClass('disabled');
                	}

                };

                $scope.next = function() {
                	if($scope.pages.currPage < $scope.pages.totalPages) {
                    	$scope.pages.currPage = $scope.pages.currPage + 1;
                    	$scope.search();
                    	if($scope.pages.currPage == $scope.pages.totalPages) {
        	       	       	 var ele = angular.element('#next');
        	    	    	 ele.addClass('disabled');
        	    	    	 ele = angular.element('#last');
        	    	    	 ele.addClass('disabled');
                    	}
             	       	 var ele = angular.element('#first');
            	    	 ele.removeClass('disabled');
            	    	 ele = angular.element('#previous');
            	    	 ele.removeClass('disabled');
                	}

                };

                $scope.last = function() {
                	if($scope.pages.currPage < $scope.pages.totalPages) {
                    	$scope.pages.currPage = $scope.pages.totalPages;
                    	$scope.search();
                    	if($scope.pages.currPage == $scope.pages.totalPages) {
        	       	       	 var ele = angular.element('#next');
        	    	    	 ele.addClass('disabled');
        	    	    	 ele = angular.element('#last');
        	    	    	 ele.addClass('disabled');
                    	}
              	       	var ele = angular.element('#first');
            	    	ele.removeClass('disabled');
            	    	ele = angular.element('#previous');
            	    	ele.removeClass('disabled');
                	}

                };

        $scope.clearFilter = function() {
            $scope.selectedProject = null;
            $scope.searchCriteria = {};
            $rootScope.searchCriteriaProject = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            $scope.search();
        };



    });
