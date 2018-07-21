'use strict';

angular.module('timeSheetApp')
    .controller('SlaController', function ($rootScope, $scope, $state, $timeout,
    		ProjectComponent, SiteComponent, SlaComponent, $http,$stateParams,$location) {

    	$scope.sla = {};
    	$scope.escalation = {};
    	var slas =new Array();
    	var escalations = new Array();
    	var slaList = [];
    	$scope.selectedProject = {};
    	$scope.selectedSite = {};
    	$rootScope.loginView = false;
    	
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
//					if(jQuery.isEmptyObject($scope.searchProject) == false)
                	for(var i = 0; i < slaList.length; i++){
                	console.log("SlaList add " + JSON.stringify(slaList));
                	$scope.sla = slaList[i];
                	var objString = JSON.stringify($scope.sla); 
                	objString = objString.substr(1);
                	objString = objString.slice(0, -1);
                	console.log("Sla add " + JSON.stringify(objString));
                	console.log("Sla add " + JSON.stringify($scope.sla));
                	SlaComponent.createSla(objString).then(function (data) {
                		$scope.saveSla = data;
                		console.log("SLA saving");
                		console.log(data);
                		$scope.loadingStop();
                	});
                	}
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
                	console.log("selected project - " + JSON.stringify($scope.selectedProject));
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
                
                $scope.addSlaEscalations = function(){
                	console.log("Sla " + JSON.stringify($scope.sla));
                	console.log("Escaltion " + JSON.stringify($scope.escalation));
                	$scope.sla.projectId = $scope.selectedProject.id;
                	$scope.sla.siteId = $scope.selectedSite.id;
                	escalations.push($scope.escalation);
                	$scope.escalation = {};
                	$scope.sla.slaesc = escalations;
                	
                	console.log("Escaltion " + JSON.stringify($scope.sla));
                	
                };
                
                $scope.addSlas = function(){
                	console.log("SLAa " + JSON.stringify($scope.sla));
                	escalations = [];
                	//$scope.addSla();
                	slas.push($scope.sla);
                	$scope.sla = {};
                	console.log("SlaEscaltions " + JSON.stringify(slas));
                	slaList.push(slas);
                	slas = [];
                	
                	console.log("SlaList " + JSON.stringify(slaList));
                }
              
    });
