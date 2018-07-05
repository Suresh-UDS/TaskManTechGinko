'use strict';

angular.module('timeSheetApp')
    .controller('SlaController', function ($rootScope, $scope, $state, $timeout,
    		ProjectComponent, SiteComponent, SlaComponent, $http,$stateParams,$location) {


    	$scope.sla = {};
    	$rootScope.loginView = false;
    	$scope.selectedProject = {};
    	$scope.selectedSite = {};
    	
			//init load
			$scope.initLoad = function(){
				$scope.loadProjects();
			     $scope.loadPageTop();

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

                };
                
               // List ALL SLA 

                $scope.loadSlaList = function () {
                	SlaComponent.findAll().then(function (data) {
                        $scope.slaList = data;
                        console.log("SLA Loading data");
                        console.log(data);
                         $scope.loadingStop();
                    });
                };
                
                $scope.addSla = function() {
                	console.log($scope.sla);
                	console.log(selectedProject.name);
                	console.log(selectedSite.name);
                	$scope.sla.projectName = selectedProject.name;
                	$scope.sla.siteName = selectedSite.name;
                	SlaComponent.createSla($scope.sla).then(function (data) {
                		$scope.saveSla = data;
                		console.log("SLA saving");
                		console.log(data);
                		$scope.loadingStop();
                	});
                };
                
                $scope.loadProjects = function() {
                	ProjectComponent.findAll().then(function (data) {
                		console.log("SLA projects");
                		$scope.projects = data;
                		console.log(data);
                		$scope.loadingStop();
                	});
                	
                };
                
                $scope.loadSites = function () {
                	console.log('selected project - ' + JSON.stringify($scope.selectedProject));
                	if($scope.selectedProject) {
                    	ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
                            $scope.sites = data;
                        });
                	}else {
                    	SiteComponent.findAll().then(function (data) {
                            $scope.sites = data;
                        });
                	}
                };
    });
