'use strict';

angular.module('timeSheetApp')
    .controller('SiteController', function ($rootScope, $scope, $state, $timeout, ProjectComponent, SiteComponent,$http,$stateParams,$location) {
        $rootScope.loginView = false;
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

        $scope.newShiftItem ={}

        $scope.shiftFrom = new Date();
        $scope.shiftTo = new Date();


        $scope.loadProjects = function () {
        	ProjectComponent.findAll().then(function (data) {
                $scope.projects = data;
                 $scope.loadingStop();
            });
        };

        $scope.initCalender = function(){
            demo.initFormExtendedDatetimepickers();
        }

        $('#shiftFrom').on('dp.change', function(e){

            console.log(e.date._d);
            if(e.date._d > $scope.newShiftItem.endTime) {
            		$scope.showNotifications('top','center','danger','From time cannot be after To time');
            		$scope.shiftFrom = $scope.newShiftItem.startTime;
            		return false;
            }else {
                $scope.newShiftItem.startTime = e.date._d.getHours() + ':' + e.date._d.getMinutes();
            }
        });

        $('#shiftTo').on('dp.change', function(e){

            console.log(e.date._d);
            if($scope.newShiftItem.startTime > e.date._d) {
            		$scope.showNotifications('top','center','danger','To time cannot be before From time');
            		$scope.shiftTo = $scope.newShiftItem.endTime;
            		return false;
            }else {
                $scope.newShiftItem.endTime = e.date._d.getHours() + ':' + e.date._d.getMinutes();
            }

        });
        $scope.initCalender();

        $scope.saveSite = function () {
	        	$scope.error = null;
	        	$scope.success = null;
	        	$scope.errorSitesExists = null;
	        	$scope.errorProject = null;
	        	if(!$scope.selectedProject.id){
	        		$scope.errorProject = "true";
	        	}else{
	        		$scope.site.projectId = $scope.selectedProject.id;
	        		console.log('shifts - ' + JSON.stringify($scope.shiftItems));
	        		$scope.site.shifts = $scope.shiftItems;
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

        $scope.shiftItems=[];

        $scope.newshiftItem = {};

        $scope.addShiftItem = function(event) {
        		event.preventDefault();
        		console.log('new shift item - ' + JSON.stringify($scope.newShiftItem));
        		$scope.shiftItems.push($scope.newShiftItem);
        		console.log('shiftItems - '+ JSON.stringify($scope.shiftItems));
        		$scope.newShiftItem = {};
        }

        $scope.removeItem = function(ind) {
        		$scope.shiftItems.splice(ind,1);
        }


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
	        	$scope.search();
        };

        $scope.refreshPage = function(){
               $scope.clearFilter();
               $scope.search();
        }


        $scope.loadSite = function() {
        	SiteComponent.findOne($stateParams.id).then(function (data) {
                $scope.site = data;
                console.log('$scope.site.shifts - '+$scope.site.shifts);
                $scope.shiftItems = $scope.site.shifts;
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
        		$scope.site.shifts = $scope.shiftItems;
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


        $scope.pageSizes = [{
            value: 10
        }, {
            value: 15
        }, {
            value: 20
        }];

        $scope.sort = $scope.pageSizes[0];
        $scope.pageSort = $scope.pageSizes[0].value;

        $scope.hasChanged = function(){
            alert($scope.sort.value)
            $scope.pageSort = $scope.sort.value;
            $scope.search();
        }

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isAscOrder = true;
            $scope.search();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isAscOrder = false;
            $scope.search();
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
        	console.log('Selected  project -' + JSON.stringify($scope.selectedProject) +" , "+ $scope.selectedSite);
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
		        	if(!$scope.searchCriteria.siteId) {
		        		$scope.searchCriteria.siteName = $scope.selectedSite;
		        	}else {
			        	$scope.searchCriteria.siteName = $scope.selectedSite.name;
		        	}
		        	console.log('selected site id ='+ $scope.searchCriteria.siteId);
	        	}else {
	        		$scope.searchCriteria.siteId = 0;
	        	}

	        	if($scope.selectedProject) {
		        	$scope.searchCriteria.projectId = $scope.selectedProject.id;
		        	if(!$scope.searchCriteria.projectId) {
		        		$scope.searchCriteria.projectName = $scope.selectedProject;
		        		console.log('selected project name ='+ $scope.selectedProject + ', ' +$scope.searchCriteria.projectName);
		        	}else {
			        	$scope.searchCriteria.projectName = $scope.selectedProject.name;
		        	}
		        	console.log('selected project id ='+ $scope.searchCriteria.projectId);
	        	}else {
	        		$scope.searchCriteria.projectId = 0;
	        	}

        	}
        	console.log($scope.searchCriteria);

            if($scope.pageSort){
                $scope.searchCriteria.sort = $scope.pageSort;
            }

            if($scope.selectedColumn){

                $scope.searchCriteria.columnName = $scope.selectedColumn;
                $scope.searchCriteria.sortByAsc = $scope.isAscOrder;

            }else{
                $scope.searchCriteria.columnName ="id";
            }


            console.log("search Criteria to be sent - "+JSON.stringify($rootScope.searchCriteriaSite));
            SiteComponent.search($scope.searchCriteria).then(function (data) {
                $scope.sites = data.transactions;
                $scope.sitesLoader = true;
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

                if($scope.jobs && $scope.sites.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.sites.length;
                    $scope.totalCountPages = data.totalCount;

                    if($scope.showCurrPage != data.totalPages){
                    	$scope.pageStartIntex =  (data.currPage - 1) * $scope.pageSort + 1; // 1 to // 11 to

                        $scope.pageEndIntex = $scope.pageEntries * $scope.showCurrPage; // 10 entries of 52 // 10 * 2 = 20 of 52 entries

                    }else if($scope.showCurrPage === data.totalPages){
                    	$scope.pageStartIntex =  (data.currPage - 1) * $scope.pageSort + 1;
                    	$scope.pageEndIntex = $scope.totalCountPages;
                    }
                }

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
	    		$scope.search();
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
        	}

        };

        $scope.next = function() {
            console.log("Calling next")

            if($scope.pages.currPage < $scope.pages.totalPages) {
            	$scope.pages.currPage = $scope.pages.currPage + 1;
	    		$scope.search();
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
        	}

        };

        $scope.last = function() {
            console.log("Calling last")
        	if($scope.pages.currPage < $scope.pages.totalPages) {
            	$scope.pages.currPage = $scope.pages.totalPages;
            	$scope.search();
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
        	//$scope.search();
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

      //init load
        $scope.initLoad = function(){
             $scope.loadPageTop();
             $scope.loadProjects();

         }

       //Loading Page go to top position
        $scope.loadPageTop = function(){
            //alert("test");
            //$("#loadPage").scrollTop();
            $("#loadPage").animate({scrollTop: 0}, 2000);
        }

        // Page Loader Function

        $scope.loadingStart = function(){ $('.pageCenter').show();$('.overlay').show();}
        $scope.loadingStop = function(){

            console.log("Calling loader");
            $('.pageCenter').hide();
            $('.overlay').hide();

        }

        //-------
        /*$scope.loadingAuto = function(){
            $scope.loadingStart();
            $scope.loadtimeOut = $timeout(function(){

                //console.log("Calling loader stop");
                $('.pageCenter').hide();$('.overlay').hide();

            }, 2000);}


        /!*
            ** Page navigation init function **
            @Params:integer

        *!/

        $scope.setPage = function (page) {

            if (page < 1 || page > $scope.pager.totalPages) {
                return;
            }

            //alert(page);
            $scope.pages.currPage = page;
            $scope.search();
            //alert($scope.totalCountPages);

        };

        /!*
            ** Page navigation main function**
            @Params:integer
            sort:10
        *!/

        $scope.GetPager = function(totalItems, currentPage, pageSize) {
            // default to first page
            currentPage = currentPage || 1;

            // default page size is 10
            pageSize = pageSize || 10;

            // calculate total pages
            var totalPages = Math.ceil(totalItems / pageSize);

            var startPage, endPage;

            if(totalPages > 0) {
                if (totalPages <= 5) {
                    // less than 5 total pages so show all
                    startPage = 1;
                    endPage = totalPages;
                }
                else {
                    // more than 5 total pages so calculate start and end pages
                    if (currentPage <= 4) {
                        startPage = 1;
                        endPage = 5;
                    } else if (currentPage + 1 >= totalPages) {
                        startPage = totalPages - 4;
                        endPage = totalPages;
                    } else {
                        startPage = currentPage - 2;
                        endPage = currentPage + 2;
                    }
                }

                // calculate start and end item indexes
                if(currentPage == 1){
                    var startIndex = 1;
                    if(totalItems < 10){
                        var endIndex = Math.min(totalItems);
                    }
                    else{
                        var endIndex = Math.min(startIndex + pageSize-1 , totalItems);
                    }


                }else{
                    // var startIndex = (currentPage - 1) * pageSize;
                    var startIndex =   ((currentPage - 1) * pageSize) + 1;
                    var endIndex = Math.min(startIndex + pageSize - 1 , totalItems);
                }
            }else{
                var startIndex = 0;
                var endIndex = 0;
            }


            // create an array of pages to ng-repeat in the pager control
            var pages = _.range(startPage, endPage + 1);

            // return object with all pager properties required by the view
            return {
                totalItems: totalItems,
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                startPage: startPage,
                endPage: endPage,
                startIndex: startIndex,
                endIndex: endIndex,
                pages: pages
            };
        }

*/

    });
