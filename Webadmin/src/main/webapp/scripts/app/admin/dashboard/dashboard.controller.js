'use strict';

angular.module('timeSheetApp')
    .controller('DashboardController', function ($timeout,$scope,$rootScope,DashboardComponent,JobComponent,SiteComponent, $state,$http,$stateParams,$location,$filter) {
        $rootScope.loginView = false;

// Chart data sample start

// Chart data sample end
        if($rootScope.loginView == false){
            $(".content").removeClass("remove-mr");
            $(".main-panel").removeClass("remove-hght");
        }
    	$scope.selectedProject ={};
        $scope.selectedSite ={};
        $scope.siteCount;
        $scope.totalEmployeeCount;
        $scope.employeeCount;
        $scope.presentCount;
        $scope.absentCount;
        $scope.regionList=null;
        $scope.branchList=null;
        $scope.selectedRegion=null;
        $scope.selectedBranch = null;

        $scope.selectedFromDate =  $filter('date')(new Date(), 'dd/MM/yyyy') ;
        $scope.selectedToDate = $filter('date')(new Date(), 'dd/MM/yyyy');
        
        $scope.selectedFromDateSer =new Date();
        $scope.selectedToDateSer = new Date();

        $scope.result = {
        		assignedJobCount :0,
        		completedJobCount :0,
        		overdueJobCount :0,
        		totalJobCount: 0
        };


        $scope.init = function() {
        		$scope.loadAllProjects();
        		$scope.loadAllSites();
        		$scope.loadQuotationReport();
                $scope.loadJobReport();
                $scope.loadingStart();
                $scope.loadChartData();

        };

        $scope.loadJobs = function(siteId){
            var siteId = 176;
            //var selectedDate = new Date();
          
            DashboardComponent.loadJobs(siteId,$scope.selectedFromDate).then(function (data) {
                console.log(data);
               
            })
        }

        $scope.printDiv = function(printable) {
            var printContents = document.getElementById(printable).innerHTML;
            var originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
        }

        $scope.printPage = function () {
            window.print();
        }

        $scope.loadChartData = function (projectId,region,branch,siteId) {
        	
            $scope.openTicketsCountArray = [];
            $scope.openTicketsLabels = [];
            $scope.closedTicketsCountArray = [];
            $scope.closedTicketsLabels = [];
            $scope.overAllTicketsCountArray = [];
            $scope.openTicketsDataArray = [];
            $scope.closedTicketsDataArray = [];
 
            $scope.openTicketsTotalCount=0;
            $scope.closedTicketsTotalCount =0;
            $scope.overAllTicketsTotalCount = 0;

            $scope.overallTicketLabels = ['New', 'Closed', 'Pending', 'Pending with Client', 'Pending with UDS'];
            $scope.overallTicketSeries = ['New', 'Closed','Pending', 'Pending with Client', 'Pending with UDS'];

            $scope.startDate = new Date($scope.selectedFromDateSer);
            $scope.endDate =  new Date($scope.selectedToDateSer);
            // var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
            $scope.startDate = $scope.startDate.getDate()+'-0'+($scope.startDate.getUTCMonth()+1)+'-'+$scope.startDate.getFullYear();
            $scope.endDate = $scope.endDate.getDate()+'-0'+($scope.endDate.getMonth()+1)+'-'+$scope.endDate.getFullYear();
            console.log("Startdate---"+$scope.startDate);
            console.log("EndDate---"+$scope.endDate);
            $scope.selectedFromDateSer.setHours(0,0,0,0);
            $scope.selectedToDateSer.setHours(23,59,59,0);
            $scope.startDate = $scope.selectedFromDateSer.getDate() + '-' + ($scope.selectedFromDateSer.getMonth() +1) + '-' + $scope.selectedFromDateSer.getFullYear();
            console.log("Startdate---"+$scope.startDate);
            $scope.endDate = $scope.selectedToDateSer.getDate() + '-' + ($scope.selectedToDateSer.getMonth() +1) + '-' + $scope.selectedToDateSer.getFullYear();
            console.log("EndDate---"+$scope.endDate);

            if(siteId){
            	
                $scope.loadChartDataBySiteId($scope.selectedSite.id,$scope.startDate,$scope.endDate);
                
            }else if(region && branch){
                $scope.loadChartDataByBranch(projectId,region,branch,$scope.startDate,$scope.endDate);
                
            }else if(region){
                $scope.loadChartDataByRegion(projectId,region,$scope.startDate,$scope.endDate);
               
            }else if(projectId){
            	
                $scope.loadChartDataByProjectId(projectId,$scope.startDate,$scope.endDate);

            }

        };

        $scope.loadChartDataByProjectId = function(projectId,startDate,endDate){
        	$scope.loadingStart();
            DashboardComponent.loadTicketChartDataByProject(projectId,startDate,endDate).then(function(response){
                /*console.log("Dashboard ticket data_________");
                console.log(response);
                console.log(response.closedTicketCounts["0-3"]);
                console.log(response.openTicketCounts);*/

                $scope.constructChartData(response);
               

            });
        };

        $scope.loadChartDataBySiteId = function(siteId,startDate,endDate){
        	$scope.loadingStart();
            DashboardComponent.loadTicketChartData(siteId,startDate,endDate).then(function(response){
                /*console.log("Dashboard ticket data_________");
                console.log(response);
                console.log(response.closedTicketCounts["0-3"]);
                console.log(response.openTicketCounts);*/

                $scope.constructChartData(response);
               

            });
        };

        $scope.loadChartDataByRegion = function(projectId,region,startDate,endDate){
        	$scope.loadingStart();
        	var sDate= $filter('date')(startDate, 'yyyy/MM/dd');
        	var eDate = $filter('date')(endDate, 'yyyy/MM/dd') ;
            DashboardComponent.loadTicketChartDataByRegion(projectId,region,sDate,eDate).then(function(response){
               /* console.log("Dashboard ticket data_________");
                console.log(response);
                console.log(response.closedTicketCounts["0-3"]);
                console.log(response.openTicketCounts);*/

                $scope.constructChartData(response);
                
            });
        };

        $scope.loadChartDataByBranch = function(projectId,region,branch,startDate,endDate){
        	$scope.loadingStart();
            DashboardComponent.loadTicketChartDataByBranch(projectId,region,branch,startDate,endDate).then(function(response){
                /*console.log("Dashboard ticket data_________");
                console.log(response);
                console.log(response.closedTicketCounts["0-3"]);
                console.log(response.openTicketCounts)*/;

                $scope.constructChartData(response);
               
            });
        };

        $scope.constructChartData = function(response){
            $scope.chartsDataResponse = response;
            var openTicketsData = {};
            $scope.openTicketsCountArray.push(response.openTicketCounts["0-3"]);
            $scope.openTicketsTotalCount+=parseInt(response.openTicketCounts["0-3"]);
            $scope.openTicketsLabels.push("0-3");
            $scope.openTicketsCountArray.push(response.openTicketCounts["4-5"]);
            $scope.openTicketsTotalCount+=parseInt(response.openTicketCounts["4-5"]);
            $scope.openTicketsLabels.push("4-5");
            $scope.openTicketsCountArray.push(response.openTicketCounts["6-7"]);
            $scope.openTicketsTotalCount+=parseInt(response.openTicketCounts["6-7"]);
            $scope.openTicketsLabels.push("6-7");
            $scope.openTicketsCountArray.push(response.openTicketCounts["8-10"]);
            $scope.openTicketsTotalCount+=parseInt(response.openTicketCounts["8-10"]);
            $scope.openTicketsLabels.push("8-10");
            $scope.openTicketsCountArray.push(response.openTicketCounts["11-365"]);
            $scope.openTicketsTotalCount+=parseInt(response.openTicketCounts["11-365"]);
            console.log("tickets total count - "+$scope.openTicketsTotalCount);
            $scope.openTicketsLabels.push(">-11");

            $scope.closedTicketsCountArray.push(response.closedTicketCounts["0-3"]);
            $scope.closedTicketsTotalCount+=parseInt(response.closedTicketCounts["0-3"]);
            $scope.closedTicketsLabels.push("0-3");
            $scope.closedTicketsCountArray.push(response.closedTicketCounts["4-5"]);
            $scope.closedTicketsTotalCount+=parseInt(response.closedTicketCounts["4-5"]);
            $scope.closedTicketsLabels.push("4-5");
            $scope.closedTicketsCountArray.push(response.closedTicketCounts["6-7"]);
            $scope.closedTicketsTotalCount+=parseInt(response.closedTicketCounts["6-7"]);
            $scope.closedTicketsLabels.push("6-7");
            $scope.closedTicketsCountArray.push(response.closedTicketCounts["8-10"]);
            $scope.closedTicketsTotalCount+=parseInt(response.closedTicketCounts["8-10"]);
            $scope.closedTicketsLabels.push("8-10");
            $scope.closedTicketsCountArray.push(response.closedTicketCounts["> 11"]);
            $scope.closedTicketsTotalCount+=parseInt(response.closedTicketCounts["> 11"]);
            $scope.closedTicketsLabels.push(">-11");
            $scope.overAllTicketsTotalCount=$scope.openTicketsTotalCount+$scope.closedTicketsTotalCount;

            
            if($scope.openTicketsTotalCount > 0) {
            	
	            var ctx = document.getElementById("bar1").getContext('2d');
	            $scope.myChart = new Chart(ctx, {
	                type: 'bar',
	                data: {
	                    labels:$scope.openTicketsLabels ,
	                    datasets: [{
	                        // label: '# of Votes',
	                        data:$scope.openTicketsCountArray ,
	                        backgroundColor: [
	                            'rgba(255, 99, 132, 0.2)',
	                            'rgba(54, 162, 235, 0.2)',
	                            'rgba(255, 206, 86, 0.2)',
	                            'rgba(75, 192, 192, 0.2)',
	                            'rgba(153, 102, 255, 0.2)'
	                        ],
	                        borderColor: [
	                            'rgba(255,99,132,1)',
	                            'rgba(54, 162, 235, 1)',
	                            'rgba(255, 206, 86, 1)',
	                            'rgba(75, 192, 192, 1)',
	                            'rgba(153, 102, 255, 1)'
	                        ],
	                        borderWidth: 1
	                    }]
	                },
	                options: {
	                    scales: {
	                        yAxes: [{
	                            ticks: {
	                                beginAtZero:true
	                            }
	                        }]
	                    }
	                }
	            });
            
            }else {
            		document.getElementById("openTicketPanel").style.display = 'none';
            }

            
            if($scope.closedTicketsTotalCount > 0) {
            
	            var ctx2 = document.getElementById("bar2").getContext('2d');
	            $scope.myChart = new Chart(ctx2, {
	                type: 'bar',
	                data: {
	                    labels:$scope.closedTicketsLabels ,
	                    datasets: [{
	                        // label: '# of Votes',
	                        data:$scope.closedTicketsCountArray ,
	                        backgroundColor: [
	                            'rgba(255, 99, 132, 0.2)',
	                            'rgba(54, 162, 235, 0.2)',
	                            'rgba(255, 206, 86, 0.2)',
	                            'rgba(75, 192, 192, 0.2)',
	                            'rgba(153, 102, 255, 0.2)'
	                        ],
	                        borderColor: [
	                            'rgba(255,99,132,1)',
	                            'rgba(54, 162, 235, 1)',
	                            'rgba(255, 206, 86, 1)',
	                            'rgba(75, 192, 192, 1)',
	                            'rgba(153, 102, 255, 1)'
	                        ],
	                        borderWidth: 1
	                    }]
	                },
	                options: {
	                    scales: {
	                        yAxes: [{
	                            ticks: {
	                                beginAtZero:true
	                            }
	                        }]
	                    }
	                }
	            });
            }else {
            		document.getElementById("closedTicketPanel").style.display = 'none';
            }
            
            if($scope.overAllTicketsTotalCount > 0) {

	            var ctx3 = document.getElementById("bar3").getContext('2d');
	            $scope.myChart = new Chart(ctx3, {
	                type: 'bar',
	                data: {
	                    labels:$scope.overallTicketLabels ,
	                    datasets: [{
	                        // label: '# of Votes',
	                        data:$scope.overAllTicketsCountArray ,
	                        backgroundColor: [
	                            'rgba(255, 99, 132, 0.2)',
	                            'rgba(54, 162, 235, 0.2)',
	                            'rgba(255, 206, 86, 0.2)',
	                            'rgba(75, 192, 192, 0.2)',
	                            'rgba(153, 102, 255, 0.2)'
	                        ],
	                        borderColor: [
	                            'rgba(255,99,132,1)',
	                            'rgba(54, 162, 235, 1)',
	                            'rgba(255, 206, 86, 1)',
	                            'rgba(75, 192, 192, 1)',
	                            'rgba(153, 102, 255, 1)'
	                        ],
	                        borderWidth: 1
	                    }]
	                },
	                options: {
	                    scales: {
	                        yAxes: [{
	                            ticks: {
	                                beginAtZero:true
	                            }
	                        }]
	                    }
	                }
	            });
            }else {
            		document.getElementById("overallTicketPanel").style.display = 'none';
            }




            $scope.overAllTicketsCountArray.push(response.totalNewTicketCount);
            $scope.overAllTicketsCountArray.push(response.totalClosedTicketCount);
            $scope.overAllTicketsCountArray.push(response.totalPendingTicketCount);
            $scope.overAllTicketsCountArray.push(response.totalPendingDueToClientTicketCount);
            $scope.overAllTicketsCountArray.push(response.totalPendingDueToCompanyTicketCount);

            $scope.overallTicketData = $scope.overAllTicketsCountArray;
            $scope.openTicketsData = $scope.openTicketsCountArray;
            $scope.closedTicketsData = $scope.closedTicketsCountArray;

        }

        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();


        }
        $scope.initCharts = function(){
                    console.log("Calling charts")
                    demo.initCharts();
        }

        $('input#dateFilterFrom').on('dp.change', function(e){
         
            if(e.date._d > $scope.selectedToDateSer) {
            		$scope.showNotifications('top','center','danger','From date cannot be greater than To date');
            		$scope.selectedFromDate = "";
            		$scope.selectedFromDateSer = "";
            		return false;
            }else {
                $scope.selectedFromDateSer = new Date(e.date._d);
                $scope.selectedFromDate = $filter('date')(e.date._d, 'dd/MM/yyyy') ;
                $scope.refreshReport();
            }
        });

        $('input#dateFilterTo').on('dp.change', function(e){
            console.log(e.date);

            console.log(e.date._d);
            if($scope.selectedFromDateSer > e.date._d) {
            		$scope.showNotifications('top','center','danger','To date cannot be lesser than From date');
            		$scope.selectedToDate = "";
            		$scope.selectedToDateSer = "";
            		return false;
            }else {
            	$scope.selectedToDateSer = new Date(e.date._d);
                $scope.selectedToDate = $filter('date')(e.date._d, 'dd/MM/yyyy') ;
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
        };

        $scope.loadSites = function(projectId,region,branch){

            if(branch){
        
                SiteComponent.getSitesByBranch(projectId,region,branch).then(function (data) {
                    console.log('Sites - ');
                    console.log(data);
                    $scope.sites = data;
                });

            }else if(region){
            
                SiteComponent.getSitesByRegion(projectId,region).then(function (data) {
                    $scope.sites = data;
                    console.log("Sites - ");
                    console.log(data);
                })

            }else if(projectId >0){
                console.log('projectid - ' + projectId);
                DashboardComponent.loadSites(projectId).then(function(data){
                    console.log('sites ' + JSON.stringify(data));
                    $scope.sites = data;
                })
            }


        };

        $scope.loadAllSites = function () {
            DashboardComponent.loadAllSites().then(function (data) {
                console.log(data);
                
                $scope.sites = data;
                $scope.siteCount = data.length;
            });
            console.log($scope.selectedFromDateSer);
             $scope.selectedFromDateSer.setHours(0,0,0,0);
             $scope.selectedToDateSer.setHours(23,59,59,0);
            console.log($scope.selectedFromDateSer + ' ' + $scope.selectedToDateSer);
            $scope.loadingStart();
            DashboardComponent.loadAttendanceReport(0,$scope.selectedFromDateSer,$scope.selectedToDateSer).then(function(data){
                console.log(data);
                $scope.totalEmployeeCount = data.totalEmployeeCount;
                $scope.employeeCount = data.totalEmployeeCount;
                $scope.presentCount = data.presentEmployeeCount;
                $scope.absentCount = data.absentEmployeeCount;
              
            })

        };

        $scope.loadQuotationReport = function() {
        		$scope.quotationCount = 0;
        };

        $scope.changeProject = function() {
        		console.log('selected project - ' + JSON.stringify($scope.selectedProject));
        		$scope.loadSites($scope.selectedProject.id);
        		$scope.selectedSite = null;
        		$scope.refreshReport();
        };

        $scope.loadRegions = function (projectId) {
            SiteComponent.getRegionByProject(projectId).then(function (response) {
                console.log(response);
                $scope.regionList = response;
            })
        };

        $scope.loadBranch = function (projectId) {

            if($scope.selectedProject){

                if($scope.selectedRegion){
                    console.log($scope.selectedRegion);
                    SiteComponent.getBranchByProject(projectId,$scope.selectedRegion.id).then(function (response) {
                        console.log(response);
                        $scope.branchList = response;
                    })

                }else{
                    $scope.showNotifications('top','center','danger','Please Select Region to continue...');

                }

            }else{
                $scope.showNotifications('top','center','success','Please select Project to continue...');

            }


        };

        $scope.refreshReport = function() {
        		if($scope.selectedSite) {
        			$scope.refreshReportBySite();
                    $scope.loadChartData($scope.selectedProject.id,null,null,$scope.selectedSite.id);

                }else if($scope.selectedBranch){
                	$scope.sites= "";
                    $scope.refreshReportByBranch();
                    $scope.loadSites($scope.selectedProject.id,$scope.selectedRegion.name,$scope.selectedBranch.name);
                    $scope.loadChartData($scope.selectedProject.id,$scope.selectedRegion.name,$scope.selectedBranch.name,null);

                }else if($scope.selectedRegion){
                	$scope.branchList= "";
                	$scope.sites= "";
                    $scope.refreshReportByRegion();
                    $scope.loadBranch($scope.selectedProject.id);
                    $scope.loadSites($scope.selectedProject.id,$scope.selectedRegion.name,null);
                    $scope.loadChartData($scope.selectedProject.id,$scope.selectedRegion.name,null,null);

                }else if($scope.selectedProject) {
                	$scope.regionList= "";
                	$scope.branchList= "";
                	$scope.sites= "";
        			$scope.refreshReportByProject();
        			$scope.loadRegions($scope.selectedProject.id);
        			$scope.loadSites($scope.selectedProject.id,null,null);
                    $scope.loadChartData($scope.selectedProject.id,null,null,null);

                }
        		// $scope.loadJobReport();
            // $scope.myChart.update();
        };
        
        $scope.LoadFilterSites = function(){
        	if($scope.selectedSite) {
    			$scope.refreshReportBySite();
                $scope.loadChartData($scope.selectedProject.id,null,null,$scope.selectedSite.id);

            }
        };
        
        $scope.LoadFilterBranches = function(){
        	$scope.sites= "";
        	if($scope.selectedBranch){
                $scope.refreshReportByBranch();
                $scope.loadSites($scope.selectedProject.id,$scope.selectedRegion.name,$scope.selectedBranch.name);
                $scope.loadChartData($scope.selectedProject.id,$scope.selectedRegion.name,$scope.selectedBranch.name,null);

            }
        };
        
        $scope.LoadFilterRegions = function(){
        	$scope.branchList= "";
        	$scope.sites= "";
        	if($scope.selectedRegion){
                $scope.refreshReportByRegion();
                $scope.loadBranch($scope.selectedProject.id);
                $scope.loadSites($scope.selectedProject.id,$scope.selectedRegion.name,null);
                $scope.loadChartData($scope.selectedProject.id,$scope.selectedRegion.name,null,null);

            }
        };
        
        $scope.LoadFilterProjects = function(){
        	$scope.regionList= "";
        	$scope.branchList= "";
        	$scope.sites= "";
        	if($scope.selectedProject) {
    			$scope.refreshReportByProject();
    			$scope.loadRegions($scope.selectedProject.id);
    			$scope.loadSites($scope.selectedProject.id,null,null);
                $scope.loadChartData($scope.selectedProject.id,null,null,null);

            }
        };


        $scope.refreshReportByProject = function() {
             $scope.selectedFromDateSer.setHours(0,0,0,0);
             $scope.selectedToDateSer.setHours(23,59,59,0);
             $scope.loadJobReport();
             $scope.loadingStart();
             DashboardComponent.loadAttendanceReportByProject($scope.selectedProject.id,$scope.selectedFromDateSer,$scope.selectedToDateSer).then(function(data){
                console.log(data);
                $scope.employeeCount = data.totalEmployeeCount;
                $scope.presentCount = data.presentEmployeeCount;
                $scope.absentCount = data.absentEmployeeCount;
                
            })

        };

        $scope.refreshReportByRegion = function(){
            $scope.selectedFromDateSer.setHours(0,0,0,0);
            $scope.selectedToDateSer.setHours(23,59,59,0);
            $scope.loadJobReport();
            $scope.loadingStart();
            DashboardComponent.loadAttendanceReportByRegion($scope.selectedProject.id,$scope.selectedRegion.name,$scope.selectedFromDateSer,$scope.selectedToDateSer).then(function(data){
                console.log(data);
                $scope.employeeCount = data.totalEmployeeCount;
                $scope.presentCount = data.presentEmployeeCount;
                $scope.absentCount = data.absentEmployeeCount;
                
            })

        };

        $scope.refreshReportByBranch = function(){
            $scope.selectedFromDateSer.setHours(0,0,0,0);
            $scope.selectedToDateSer.setHours(23,59,59,0);
            $scope.loadJobReport();
            $scope.loadingStart();
            DashboardComponent.loadAttendanceReportByBranch($scope.selectedProject.id,$scope.selectedRegion.name,$scope.selectedBranch.name,$scope.selectedFromDateSer,$scope.selectedToDateSer).then(function(data){
                console.log(data);
                $scope.employeeCount = data.totalEmployeeCount;
                $scope.presentCount = data.presentEmployeeCount;
                $scope.absentCount = data.absentEmployeeCount;
               
            })

        };

        $scope.refreshReportBySite = function() {
            $scope.selectedFromDateSer.setHours(0,0,0,0);
            $scope.selectedToDateSer.setHours(23,59,59,0);
            $scope.loadJobReport();
            $scope.loadingStart();
            if($scope.selectedSite && $scope.selectedSite.id){
            	DashboardComponent.loadAttendanceReport($scope.selectedSite.id,$scope.selectedFromDateSer,$scope.selectedToDateSer).then(function(data){
                    console.log(data);
                    $scope.employeeCount = data.totalEmployeeCount;
                    $scope.presentCount = data.presentEmployeeCount;
                    $scope.absentCount = data.absentEmployeeCount;
                    
                })
            }
            

       };



        $scope.loadJobReport = function () {
	        	var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
	        		var searchCriteria = {
	            			currPage : currPageVal
	            	}
	            	$scope.searchCriteria = searchCriteria;
	        	//}
	        	
	        	$scope.searchCriteria.currPage = currPageVal;
	        	console.log('Selected  project -' , $scope.selectedProject);
	        	console.log('Selected  job -' , $scope.selectedJob);
	        	console.log('search criteria - ',JSON.stringify($scope.searchCriteriaProject));

	        	if($scope.selectedProject) {
	        		$scope.searchCriteria.projectId = $scope.selectedProject.id;
	        	}

                $scope.searchCriteria.region = $scope.selectedRegion!=null?$scope.selectedRegion.name:"";
                $scope.searchCriteria.branch = $scope.selectedBranch!=null?$scope.selectedBranch.name:"";

	        	if($scope.selectedSite) {
	        		$scope.searchCriteria.siteId = $scope.selectedSite.id;
		    }

	        	$scope.searchCriteria.consolidated = true;

	        	if($scope.selectedJob){
	        		$scope.searchCriteria.jobTitle = $scope.selectedJob;
	        	}
	        	$scope.searchCriteria.checkInDateTimeFrom = $scope.selectedFromDateSer;
	        	$scope.searchCriteria.checkInDateTimeTo = $scope.selectedToDateSer;

	        	console.log('job report search criteria -' , JSON.stringify($scope.searchCriteria));
	        	JobComponent.generateReport($scope.searchCriteria).then(function (data) {
	        		$scope.result.assignedJobCount = 0;
	        		$scope.result.completedJobCount = 0;
	        		$scope.result.overdueJobCount = 0;
	        		$scope.result.totalJobCount = 0;
	        		$scope.loadingStart();
	        		
	        		for(var i = 0; i < data.length; i++) {
	        			$scope.loadingStart();
	        			$scope.result.assignedJobCount += data[i].assignedJobCount;
	        			$scope.result.completedJobCount += data[i].completedJobCount;
	        			$scope.result.overdueJobCount += data[i].overdueJobCount;
	        			$scope.result.totalJobCount += data[i].totalJobCount;
	        			
	        			if((i+1) == (data.length)){
	        				
	        				$scope.loadingStop();
	        		    }
	        			
	        		}
	        		
	        		if(!$scope.selectedProject.id && !$scope.selectedSite.id && !$scope.selectedRegion && !$scope.selectedBranch){
	        			
	        			$scope.loadingStop();
	        		}
	        		//$scope.result = data[0];
	        		console.log('job report - ' , $scope.result.assignedJobCount);
	        		console.log('job report - ' , $scope.result.completedJobCount);
	        		console.log('job report - ' , $scope.result.overdueJobCount);
	        		console.log('job report - ' , $scope.result.totalJobCount);
	        		

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


    });
