'use strict';

angular.module('timeSheetApp')
    .controller('SiteController', function ($rootScope, $scope, $state, $timeout, ProjectComponent, SiteComponent,$http,$stateParams,$location) {
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorSitesExists = null;

        $timeout(function (){angular.element('[ng-model="name"]').focus();});

        $scope.pages = { currPage : 1};

        $scope.selectedProject;

        $scope.selectedSite;

        $scope.calendar = {
        		start : false,
        		end : false,
        }
        $scope.loadProjects = function () {
        	ProjectComponent.findAll().then(function (data) {
                $scope.projects = data;
            });
        };

        $scope.saveSite = function () {
        	$scope.error = null;
        	$scope.success = null;
        	$scope.errorSitesExists = null;
        	$scope.errorProject = null;
        	if(!$scope.selectedProject.id){
        		$scope.errorProject = "true";
        	}else{
        		$scope.site.projectId = $scope.selectedProject.id;
            	SiteComponent.createSite($scope.site).then(function() {
                    $scope.success = 'OK';
                    $scope.showNotifications('top','center','success','Site Added');
                    $scope.selectedProject = null;
                	$scope.loadSites();
                	$location.path('/sites');
                }).catch(function (response) {
                    $scope.success = null;
                    console.log('Error - '+ response.data);
                    console.log('status - '+ response.status + ' , message - ' + response.data.message);
                    if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                            $scope.errorSitesExists = 'ERROR';
                        $scope.showNotifications('top','center','danger','Site Already Exists');

                        console.log($scope.errorSitesExists);
                    } else {
                        $scope.showNotifications('top','center','danger','Error in creating Site. Please try again later..');
                        $scope.error = 'ERROR';
                    }
                });
        	}

        };

        $scope.cancelSite = function () {
        	$location.path('/sites');
        };

        $scope.loadAllSites = function () {
        	SiteComponent.findAll().then(function (data) {
        		$scope.allSites = data;
        	});
        };

        $scope.loadSites = function () {
        	$scope.clearFilter();
//        	if($rootScope.searchCriteriaSite) {
//        		$scope.search();
//        	}else {
//            	SiteComponent.findAll().then(function (data) {
//                    $scope.sites = data;
//                });
//        	}
        	//$scope.search();
        };

        $scope.refreshPage = function(){
               $scope.clearFilter();
               $scope.loadSites();
        }


        $scope.loadSite = function() {
        	SiteComponent.findOne($stateParams.id).then(function (data) {
                $scope.site = data;
                $scope.loadSelectedProject($scope.site.projectId);
            });
        };

        $scope.loadSelectedProject = function(projectId) {
        	ProjectComponent.findOne(projectId).then(function (data) {
                $scope.selectedProject = data;
            });
        };

        $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
        }


        $scope.updateSite = function () {
        	$scope.error = null;
        	$scope.success = null;
        	$scope.errorProject = null;
        	if(!$scope.selectedProject.id){
        		$scope.errorProject = "true";
        	}else{
        	    console.log("update site");
        	    console.log($scope.site);
        		$scope.site.projectId = $scope.selectedProject.id;
	        	SiteComponent.updateSite($scope.site).then(function() {
	                $scope.success = 'OK';
	                $scope.showNotifications('top','center','success','Site updated');
                    $scope.loadSites();
                    $location.path('/sites');
	            }).catch(function (response) {
	                $scope.success = null;
	                // console.log('Error - '+ response.data);
	                // console.log('status - '+ response.status + ' , message - ' + response.data.message);

	                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
	                	$scope.$apply(function() {
	                        $scope.errorSitesExists = 'ERROR';
	                		$scope.success = 'OK';
                            $scope.showNotifications('top','center','danger','Site Already Exists');
	                	})
	                    console.log($scope.errorSitesExists);
	                } else {
	                    $scope.error = 'ERROR';
	                }
	            });;
        	}
        };

        $scope.deleteConfirm = function (site){
        	$scope.confirmSite = site;
        }

        $scope.deleteSite = function (site) {
        	SiteComponent.deleteSite($scope.confirmSite);
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
        	console.log('Selected  project -' + $scope.selectedProject +" , "+ $scope.selectedSite);
        	console.log('search criteria - '+JSON.stringify($rootScope.searchCriteriaSite));

        	if(!$scope.selectedSite && !$scope.selectedProject) {
        		if($rootScope.searchCriteriaSite) {
            		$scope.searchCriteria = $rootScope.searchCriteriaSite;
        		}else {
        			$scope.searchCriteria.findAll = true;
        		}
        	}else if($scope.selectedSite || $scope.selectedProject) {
        		$scope.searchCriteria.findAll = false;
	        	if($scope.selectedSite) {
		        	$scope.searchCriteria.siteId = $scope.selectedSite.id;
		        	$scope.searchCriteria.siteName = $scope.selectedSite.name;
		        	console.log('selected site id ='+ $scope.searchCriteria.siteId);
	        	}else {
	        		$scope.searchCriteria.siteId = 0;
	        	}

	        	if($scope.selectedProject) {
		        	$scope.searchCriteria.projectId = $scope.selectedProject.id;
		        	$scope.searchCriteria.projectName = $scope.selectedProject.name;
		        	console.log('selected project id ='+ $scope.searchCriteria.projectId);
	        	}else {
	        		$scope.searchCriteria.projectId = 0;
	        	}

        	}
        	console.log($scope.searchCriteria);
        	SiteComponent.search($scope.searchCriteria).then(function (data) {
                $scope.sites = data.transactions;
                console.log($scope.sites);
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                if($scope.sites == null){
                    $scope.pages.startInd = 0;
                }else{
                    $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
                }

                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
                $scope.pages.totalCnt = data.totalCount;
            	$scope.hide = true;
            });
        	$rootScope.searchCriteriaSite = $scope.searchCriteria;
        	if($scope.pages.currPage == 1) {
            	$scope.firstStyle();
        	}
        };


        $scope.first = function() {
        	if($scope.pages.currPage > 1) {
            	$scope.pages.currPage = 1;
            	$scope.firstStyle();
            	$scope.search();
        	}
        };

        $scope.firstStyle = function() {
         var first = document.getElementById('#first');
       	 var ele = angular.element(first);
    	 ele.addClass('disabledLink');
         var previous = document.getElementById('#previous');
    	 ele = angular.element(previous);
    	 ele.addClass('disabledLink');
    	 if($scope.pages.totalPages > 1) {
             var nextSitePage = document.getElementById('#next');
 	       	 var ele = angular.element(next);
	    	 ele.removeClass('disabledLink');
             var lastSitePage = document.getElementById('#lastSitePage');
	    	 ele = angular.element(lastSitePage);
	    	 ele.removeClass('disabledLink');
    	 }

        }

        $scope.previous = function() {
            console.log("Calling previous")

            if($scope.pages.currPage > 1) {
            	$scope.pages.currPage = $scope.pages.currPage - 1;
            	if($scope.pages.currPage == 1) {
                    var first = document.getElementById('#first');
	       	       	 var ele = angular.element(first);
	    	    	 ele.addClass('disabled');
                    var previous = document.getElementById('#previous');
	    	    	 ele = angular.element(previous);
	    	    	 ele.addClass('disabled');
            	}
                var next = document.getElementById('#next');
     	       	 var ele = angular.element(next);
    	    	 ele.removeClass('disabled');
                var lastSitePage = document.getElementById('#last');
    	    	 ele = angular.element(last);
    	    	 ele.removeClass('disabled');
	    		$scope.search();
        	}

        };

        $scope.next = function() {
            console.log("Calling next")

            if($scope.pages.currPage < $scope.pages.totalPages) {
            	$scope.pages.currPage = $scope.pages.currPage + 1;
            	if($scope.pages.currPage == $scope.pages.totalPages) {
            	    var next = document.getElementById('#next');
	       	       	 var ele = angular.element(next);
	    	    	 ele.addClass('disabled');
                    var last = document.getElementById('#last');
	    	    	 ele = angular.element(last);
	    	    	 ele.addClass('disabled');
            	}
                var first = document.getElementById('#first')
                var ele = angular.element(first);
    	    	 ele.removeClass('disabled');
                var previous = document.getElementById('#previous')
                ele = angular.element(previous);
    	    	 ele.removeClass('disabled');
	    		$scope.search();
        	}

        };

        $scope.last = function() {
            console.log("Calling last")
        	if($scope.pages.currPage < $scope.pages.totalPages) {
            	$scope.pages.currPage = $scope.pages.totalPages;
            	if($scope.pages.currPage == $scope.pages.totalPages) {
                    var next = document.getElementById('#next');
            	    var ele = angular.element(next);
	    	    	 ele.addClass('disabled');
                    var last = document.getElementById('#last');
                    ele = angular.element(last);
	    	    	 ele.addClass('disabled');
            	}
                var first = document.getElementById('#first');
      	       	var ele = angular.element(first);
    	    	ele.removeClass('disabled');
                var previous = document.getElementById('#previous');
    	    	ele = angular.element(previous);
    	    	ele.removeClass('disabled');
    	    	$scope.search();
        	}

        };

        $scope.clearFilter = function() {
        	$scope.selectedSite = null;
        	$scope.selectedProject = null;
        	$scope.searchCriteria = {};
        	$rootScope.searchCriteriaSite = null;
        	$scope.pages = {
        		currPage: 1,
        		totalPages: 0
        	}
        	$scope.search();
        };


        // Datatable
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
    });
