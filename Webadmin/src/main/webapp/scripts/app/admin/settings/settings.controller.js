'use strict';

angular.module('timeSheetApp')
    .controller('SettingsController', function ($rootScope, $scope, $state, $timeout, $http, $stateParams, $location, ProjectComponent, SettingsComponent) {

    		$scope.selectedProject;
    		
    		$scope.selectedSite;
    		
    		$scope.settings = {
    				
    			overdueEmailIds : [],
    			eodJobEmailIds : []
    		};
    		
    	
    		$scope.init = function() {
    			$scope.loadProjects();
    			$scope.loadSettings();
    		}
    		
        $scope.addOverdueEmail = function() {
	        	var email = $scope.overdueEmail;
	        	$scope.settings.overdueEmailIds.push(email);
        }
        
        $scope.removeOverdueEmail = function(ind) {
        		$scope.settings.overdueEmailIds.splice(ind,1);
        }
        
        $scope.addEodJobEmail = function() {
	        	var email = $scope.eodJobEmail;
	        	$scope.settings.eodJobEmailIds.push(email);
	    }
    
	    $scope.removeEodJobEmail = function(ind) {
	    		$scope.settings.eodJobEmailIds.splice(ind,1);
	    }
    		
    		
        $scope.loadProjects = function () {
			console.log("Loading all projects")
        		ProjectComponent.findAll().then(function (data) {
        			console.log("Loading all projects")
                $scope.projects = data;
            });
        };

        $scope.loadSites = function () {
            $scope.showLoader();
        		console.log('selected project - ' + JSON.stringify($scope.selectedProject));
        		if($scope.selectedProject) {
        			ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
                    $scope.sites = data;
                    $scope.hideLoader();

                });
	        	}else {
	            	SiteComponent.findAll().then(function (data) {
	                    $scope.sites = data;
	                    $scope.hideLoader();
	
	                });
	        	}
        };
        
        $scope.showLoader = function(){
            console.log("Show Loader");
            $scope.loading = true;
            $scope.notLoading=false;
        };

        $scope.hideLoader = function(){
            console.log("Show Loader");
            $scope.loading = false;
            $scope.notLoading=true;
        };
        
        $scope.saveSettings = function() {
        		$scope.showLoader();
        		if($scope.selectedProject) {
            		$scope.settings.projectId = $scope.selectedProject.id;
            		$scope.settings.projectName = $scope.selectedProject.name;
        		}
        		
        		if($scope.selectedSite) {
            		$scope.settings.siteId = $scope.selectedSite.id;
            		$scope.settings.siteName = $scope.selectedSite.name;
        		}
        		
        		SettingsComponent.saveSettings($scope.settings).then(function() {
        			$scope.hideLoader();  
        			$scope.showNotifications('top','center','success','Settings updated successfully');
        			$location.path('/app_settings');
        		}).catch(function (response) {
        			$scope.showNotifications('top','center','success','Settings updation failed. Invalid input');    
        		});
        	
        }
        
        $scope.loadSettings = function() {
        		var projectId = 0;
        		var siteId = 0;
        		if($scope.selectedProject) {
        			projectId = $scope.selectedProject.id;
        		}
        		if($scope.selectedSite) {
        			siteId = $scope.selectedSite.id;
        		}
        		$scope.showLoader();
        		SettingsComponent.findAll(projectId, siteId).then(function(data) {
        			console.log('all settings response- '+ JSON.stringify(data));
        			if(data) {
            			$scope.settings = data;
        			}
                $scope.hideLoader();
        		})
        }

        $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
        }

    });


