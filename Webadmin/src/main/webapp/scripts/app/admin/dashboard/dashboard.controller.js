'use strict';

angular.module('timeSheetApp')
    .controller('DashboardController', function ($timeout,$scope,$rootScope,DashboardComponent,JobComponent, $state,$http,$stateParams,$location) {
        $rootScope.loginView = false;
        if($rootScope.loginView == false){
            $(".content").removeClass("remove-mr");
            $(".main-panel").removeClass("remove-hght");
        }
    	$scope.selectedProject;
        $scope.selectedSite;
        $scope.siteCount;
        $scope.totalEmployeeCount;
        $scope.employeeCount;
        $scope.presentCount;
        $scope.absentCount;

        $scope.selectedFromDate;
        $scope.selectedToDate;

        $scope.dateFilterFrom = new Date();
        $scope.dateFilterTo = new Date();
        
        $scope.result = {
        		assignedJobCount :0,
        		completedJobCount :0,
        		overdueJobCount :0,
        		totalJobCount: 0
        };
        
        
        $scope.init = function() {
        		$scope.selectedFromDate = $scope.dateFilterFrom;
        		$scope.selectedToDate = $scope.dateFilterTo;
        		$scope.loadAllProjects();
        		$scope.loadAllSites();
        		$scope.loadQuotationReport();
                $scope.loadJobReport();
                $scope.loadingStart();
        		
        }

        $scope.loadJobs = function(siteId){
            var siteId = 176;
            //var selectedDate = new Date();
            DashboardComponent.loadJobs(siteId,$scope.selectedFromDate).then(function (data) {
                console.log(data);
            })
        }

        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();
            

        }
        $scope.initCharts = function(){
                    console.log("Calling charts")
                    demo.initCharts();
        }

        $('#dateFilterFrom').on('dp.change', function(e){
            console.log(e.date);

            console.log(e.date._d);
            if(e.date._d > $scope.selectedToDate) {
            		$scope.showNotifications('top','center','danger','From date cannot be greater than To date');
            		$scope.dateFilterFrom = $scope.selectedFromDate;
            		return false;
            }else {
                $scope.selectedFromDate = e.date._d;
                $scope.refreshReport();
            }
        });
        
        $('#dateFilterTo').on('dp.change', function(e){
            console.log(e.date);

            console.log(e.date._d);
            if($scope.selectedFromDate > e.date._d) {
            		$scope.showNotifications('top','center','danger','To date cannot be lesser than From date');
            		$scope.dateFilterTo = $scope.selectedToDate;
            		return false;
            }else {
                $scope.selectedToDate = e.date._d;
                $scope.refreshReport();
            }

        });

        $scope.siteOptions = function(sites){

        }

        $scope.loadAllProjects = function(){
            DashboardComponent.loadAllProjects().then(function(data){
                console.log(data)
                $scope.projects = data;
                $scope.projectCount = data.length;
                $scope.initialProject = data[0];
                $scope.loadSites($scope.initialProject.id);
            })
        }

        $scope.loadSites = function(projectId){
        		console.log('projectid - ' + projectId);
            DashboardComponent.loadSites(projectId).then(function(data){
                console.log('sites ' + JSON.stringify(data));
                $scope.sites = data;
            })
        }

        $scope.loadAllSites = function () {
            DashboardComponent.loadAllSites().then(function (data) {
                console.log(data);
                $scope.loadingStop();
                $scope.sites = data;
                $scope.siteCount = data.length;
            })
            console.log($scope.selectedFromDate)
             $scope.selectedFromDate.setHours(0,0,0,0);
            	 $scope.selectedToDate.setHours(23,59,59,0);
            console.log($scope.selectedFromDate + ' ' + $scope.selectedToDate)
            DashboardComponent.loadAttendanceReport(0,$scope.selectedFromDate,$scope.selectedToDate).then(function(data){
                console.log(data)
                $scope.totalEmployeeCount = data.totalEmployeeCount;
                $scope.employeeCount = data.totalEmployeeCount;
                $scope.presentCount = data.presentEmployeeCount;
                $scope.absentCount = data.absentEmployeeCount;
            })

        }
        
        $scope.loadQuotationReport = function() {
        		$scope.quotationCount = 0;
        }

        $scope.changeProject = function() {
        		console.log('selected project - ' + JSON.stringify($scope.selectedProject));
        		$scope.loadSites($scope.selectedProject.id);
        		$scope.selectedSite = null;
        		$scope.refreshReport();
        }
        
        $scope.refreshReport = function() {
        		if($scope.selectedSite) {
        			$scope.refreshReportBySite();
        		}else if($scope.selectedProject) {
        			$scope.refreshReportByProject();
        		}
        		$scope.loadJobReport();
        }
        
        $scope.refreshReportByProject = function() {
             $scope.selectedFromDate.setHours(0,0,0,0);
             $scope.selectedToDate.setHours(23,59,59,0);
             DashboardComponent.loadAttendanceReportByProject($scope.selectedProject.id,$scope.selectedFromDate,$scope.selectedToDate).then(function(data){
                console.log(data)
                $scope.employeeCount = data.totalEmployeeCount;
                $scope.presentCount = data.presentEmployeeCount;
                $scope.absentCount = data.absentEmployeeCount;
            })

        }
        
        $scope.refreshReportBySite = function() {
            $scope.selectedFromDate.setHours(0,0,0,0);
            $scope.selectedToDate.setHours(23,59,59,0);
            DashboardComponent.loadAttendanceReport($scope.selectedSite.id,$scope.selectedFromDate,$scope.selectedToDate).then(function(data){
               console.log(data)
               $scope.employeeCount = data.totalEmployeeCount;
               $scope.presentCount = data.presentEmployeeCount;
               $scope.absentCount = data.absentEmployeeCount;
           })

       }

        
        
        $scope.loadJobReport = function () {
	        	var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
	        		var searchCriteria = {
	            			currPage : currPageVal
	            	}
	            	$scope.searchCriteria = searchCriteria;
	        	//}
	
	        	$scope.searchCriteria.currPage = currPageVal;
	        	console.log('Selected  project -' + $scope.selectedProject);
	        	console.log('Selected  job -' + $scope.selectedJob);
	        	console.log('search criteria - '+JSON.stringify($rootScope.searchCriteriaProject));
	
	        	if($scope.selectedProject) {
	        		$scope.searchCriteria.projectId = $scope.selectedProject.id;
	        	}
	
	        	if($scope.selectedSite) {
	        		$scope.searchCriteria.siteId = $scope.selectedSite.id;
		    }
	
	        	$scope.searchCriteria.consolidated = true;
	
	        	if($scope.selectedJob){
	        		$scope.searchCriteria.jobTitle = $scope.selectedJob;
	        	}
	        	$scope.searchCriteria.checkInDateTimeFrom = $scope.selectedFromDate;
	        	$scope.searchCriteria.checkInDateTimeTo = $scope.selectedToDate;
	
	        	console.log($scope.searchCriteria);
	        	JobComponent.generateReport($scope.searchCriteria).then(function (data) {
	        		$scope.result.assignedJobCount = 0;
	        		$scope.result.completedJobCount = 0;
	        		$scope.result.overdueJobCount = 0;
	        		$scope.result.totalJobCount = 0;
	        		for(var i = 0; i < data.length; i++) {
	        			$scope.result.assignedJobCount += data[i].assignedJobCount; 
	        			$scope.result.completedJobCount += data[i].completedJobCount;
	        			$scope.result.overdueJobCount += data[i].overdueJobCount;
	        			$scope.result.totalJobCount += data[i].totalJobCount;
	        		}
	        		//$scope.result = data[0];
	        		console.log('job report - ' + $scope.result.assignedJobCount);
	        		console.log('job report - ' + $scope.result.completedJobCount);
	        		console.log('job report - ' + $scope.result.overdueJobCount);
	        		console.log('job report - ' + $scope.result.totalJobCount);
	
	        	});

                
	        	
        };

        $scope.initCalender();

        $scope.initCharts();

//
//        $scope.overDueJobs=[35,42,67,89];
//        $scope.completedJobs=[28,40,39,36];
//        $scope.upcomingJobs = [21,75,55,81];
//    $scope.value = "Chart"
//        var chartData = {
//            type: "bar",  // Specify your chart type here.
//            title: {
//                text: $scope.value // Adds a title to your chart
//            },
//            legend: {}, // Creates an interactive legend
//            series: [  // Insert your series data here.
//                { values: $scope.overDueJobs},
//                { values: $scope.completedJobs},
//                { values: $scope.upcomingJobs}
//            ]
//        };
//        zingchart.render({ // Render Method[3]
//            id: "chartDiv",
//            data: chartData,
//            height: 400,
//            width: 600
//        });
//        zingchart.render({ // Render Method[3]
//            id: "chartDiv2",
//            data: chartData,
//            height: 400,
//            width: 600
//        });
//

        $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
        }


        // Page Loader Function

        $scope.loadingStart = function(){ $('.pageCenter').show();$('.overlay').show();}
        $scope.loadingStop = function(){
            
            console.log("Calling loader");
            $('.pageCenter').hide();$('.overlay').hide();
                    
        }

        //Loading Page go to top position
        $scope.loadPageTop = function(){
            //alert("test");
            //$("#loadPage").scrollTop();
            $("#loadPage").animate({scrollTop: 0}, 2000);
        }

    });
