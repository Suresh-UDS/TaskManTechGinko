'use strict';

angular.module('timeSheetApp')
    .controller('FeedbackQueController', function ($rootScope, $scope, $state, $timeout, FeedbackComponent,ProjectComponent,SiteComponent, $http, $stateParams, $location) {
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorUserExists = null;
        $scope.validationError = null;
        $scope.validationErrorMsg = null;
        $scope.authorities = ["User", "Admin"];

        $timeout(function (){angular.element('[ng-model="name"]').focus();});

        $scope.pages = { currPage : 1};

        $scope.feedbackMasterList;

        $scope.feedbackItem=null;
        $scope.newFeedbackItem=null;
        $scope.feedbackItems = [];
        $scope.selectedFeedback=null;
        $rootScope.searchCriteriaFeedback = null;

        $scope.selectedProject;

        $scope.selectedSite;


        $scope.init = function(){
            $scope.feedbackItem = {};
            $scope.feedbackItem.displayType = 'form';
            $scope.loading = true;
          $scope.loadProjects();
          $scope.search();
          $scope.qType();
          $scope.ratRadioActive();
        };
        
        
        // Question option types y/n and rating
        
        $scope.qType = function(){
        	
            var quesType = $('#displayType:checked').val();
        
            if(quesType == 'form'){
            	$('#answerType1').prop('checked', true);
            	
            }else if(quesType == 'wizard'){
            	
            	$('#answerType2').prop('checked', true);
            	
            }
            $("#YesOrNo").removeClass("in", 2000);
            //alert($('#answerType2:checked').val());
        }
        
         // Question option type rating
        
        $scope.ratRadio = function(){
        	
        	$("#YesOrNo").removeClass("in");
        }
        
       $scope.ratRadioActive = function(){
        	
        	$("#YesOrNo").addClass("in");
        }
        
       $scope.yesMarkP = function(){
    	  
    	   $('#noMarkP').prop('checked', false);
    	   $('#noMarkN').prop('checked', true);
        }
       $scope.yesMarkN = function(){
    	  
    	   $('#noMarkP').prop('checked', true);
    	   $('#noMarkN').prop('checked', false);
        }
       $scope.noMarkP = function(){
    	   
    	   $('#yesMarkN').prop('checked', true);
    	   $('#yesMarkP').prop('checked', false);
       }
       
       $scope.noMarkN = function(){
    	   
    	   $('#yesMarkP').prop('checked', true);
    	   $('#yesMarkN').prop('checked', false);
       }
        
        
        $scope.loadProjects = function () {
	    		ProjectComponent.findAll().then(function (data) {
	            $scope.projects = data;
	        });
	    };

	    $scope.loadSites = function () {
	    		return ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
	    			$scope.selectedSite = null;
	            $scope.sites = data;
	        });
	    };


        $scope.addFeedbackItem = function(newItem){
            console.log("Adding feedback questions");
            console.log(newItem);
            $scope.feedbackItems.push(newItem);
            $scope.newFeedbackItem = null;
            console.log($scope.feedbackItems);
        };

        $scope.removeItem = function(ind) {
        		$scope.feedbackItems.splice(ind,1);
        }


        $scope.cancelFeedbackQuestions = function () {
	        	$scope.feedbackItems = [];
	        	$scope.feedback = {};
        };

        $scope.loadFeedbackItems = function () {
        		console.log('called loadFeedbackItems');
        		$scope.search();
        };

        $scope.refreshPage = function() {
        		$scope.clearFilter();
        		$scope.loadFeedbackItems();
        }



        $scope.loadFeedback = function(id) {
        	console.log('loadFeedback -' + id);
               $scope.loadingStart();
        		FeedbackComponent.findOneFeedbackMaster(id).then(function (data) {
                    $scope.loadingStop();
        			$scope.feedbackItem = data;
        			console.log('Feedback retrieved - ' + JSON.stringify($scope.feedbackItem));
                    for(var i in data.questions) {
                		$scope.feedbackItems.push(data.questions[i]);
                }
                $scope.selectedProject = {id: data.projectId, name: data.projectName};
                $scope.loadSites().then(function(){
                    $scope.selectedSite = {id: data.siteId, name: data.siteName};
                })

            });
        		
          $scope.loadPageTop();
        };


        $scope.updateFeebackQuestions = function () {
        	console.log('Feedback questions details - ' + JSON.stringify($scope.feedbackItem));

        	FeedbackComponent.updateFeedbackMaster($scope.feedbackItem).then(function () {
            	$scope.success = 'OK';
            	$scope.feedbackItems = [];
            	$scope.feedbackItem = {};
            	//$scope.loadFeedbackItems();
            	//$location.path('/feedback-questions');
            	$scope.loadFeedbackItems();
            }).catch(function (response) {
                $scope.success = null;
                console.log('Error - '+ response.data);
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

        $scope.saveFeedback = function(){
          console.log($scope.feedbackItems);
  		$scope.feedbackItem.projectName = $scope.selectedProject.name;
		$scope.feedbackItem.projectId = $scope.selectedProject.id;
		$scope.feedbackItem.siteId = $scope.selectedSite.id;
		$scope.feedbackItem.siteName = $scope.selectedSite.name;

          $scope.feedbackItem.questions= $scope.feedbackItems;
          console.log("Before pushing feedback to server");
          console.log($scope.feedbackItem);
          FeedbackComponent.createFeedbackMaster($scope.feedbackItem).then(function(){
            console.log("success");
          	$scope.feedbackItems = [];
	        	$scope.feedbackItem = {};
	        	//$location.path('/feedback-questions');
	        	$scope.loadFeedbackItems();
	        }).catch(function (response) {
	            $scope.success = null;
	            console.log(response.data);
	            if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
	                $scope.errorChecklistExists = true;
	            } else if(response.status === 400 && response.data.message === 'error.validation'){
	            	$scope.validationError = true;
	            	$scope.validationErrorMsg = response.data.description;
	            } else {
	                $scope.error = 'ERROR';
	            }
	        });
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
            console.log('Selected feedback' + $scope.selectedFeedback);

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
                    console.log('selected user role id ='+ $scope.selectedFeedback);
                }else {
                    $scope.searchCriteria.feedbackId = 0;
                }
            }
            console.log($scope.searchCriteria);
            FeedbackComponent.searchFeedbackMaster($scope.searchCriteria).then(function (data) {
                $scope.feedbackMasterList = data.transactions;
                $scope.feedbackMasterListLoader = true;
                console.log($scope.feedbackMasterList);
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                $scope.loading = false;
                if($scope.feedbackMasterList == null){
                    $scope.pages.startInd = 0;
                }else{
                    $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
                }

                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
                $scope.pages.totalCnt = data.totalCount;
                $scope.hide = true;
            });
            $rootScope.searchCriteriaFeedback = $scope.searchCriteria;
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


            $scope.inputType = "password";
            $scope.passwordCheckbox = "true";
        $scope.showPwd = function(){
              if($scope.inputType == "password"){
                    $scope.inputType = "text";
                    $scope.passwordCheckbox = "false";

              }else{
                $scope.inputType = "password";
                    $scope.passwordCheckbox = "true";

              }

        }


        //init load
        $scope.initLoad = function(){ 
             $scope.loadPageTop(); 
             $scope.init();
            
          
         }

       //Loading Page go to top position
        $scope.loadPageTop = function(){
            //alert("test");
            //$("#loadPage").scrollTop();
            $("#loadPage").animate({scrollTop: 0}, 2000);
        }

        // Page Loader Function

        $scope.loadingStart = function(){ $('.pageCenter').show();}
        $scope.loadingStop = function(){
            
            console.log("Calling loader");
            $('.pageCenter').hide();
                    
        }
        
        
    });


