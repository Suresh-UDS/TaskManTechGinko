'use strict';

angular.module('timeSheetApp')
.controller('RateCardController', function ($scope, $rootScope, $state, $timeout,$http,$stateParams,$location, RateCardComponent,ProjectComponent    ) {
	$rootScope.loadingStop();
	$rootScope.loginView = false;
	$scope.success = null;
	$scope.error = null;
	$scope.doNotMatch = null;
	$scope.errorRateCardExists = null;
	$scope.saveLoad = false;
	$scope.pager = {};



	//$timeout(function (){angular.element('[ng-model="name"]').focus();});

	$scope.pages = { currPage : 1};

	$scope.rateCard;

	$scope.rateCards;

	$scope.rateCardTypes;

	$scope.uomTypes;

	$scope.projects;

	$scope.sites;

	$scope.selectedProject;

	$scope.selectedSite;

	$scope.init = function() {
		$scope.loadProjects();
		$scope.loadRateCardTypes();
		$scope.loadUomTypes();
		$scope.loadRateCards();
	}

	$scope.loadProjects = function () {
		ProjectComponent.findAll().then(function (data) {
			$scope.projects = data;
		});
	};

	$scope.loadSites = function () {
		ProjectComponent.findSites($scope.selectedProject.id).then(function (data) {
			$scope.selectedSite = null;
			$scope.sites = data;
		});
	};

	$scope.saveRateCard = function () {
		console.log("-------")
		$scope.error = null;
		$scope.success =null;
		$scope.errorRateCardExists = null;
		$scope.rateCard.projectId = $scope.selectedProject.id;
		$scope.rateCard.type = $scope.rateCard.type.name;
		$scope.saveLoad = true;
		console.log('rateCard details - ' +JSON.stringify($scope.rateCard));
		RateCardComponent.createRateCard($scope.rateCard).then(function () {
			$scope.success = 'OK';
			$scope.loadRateCards();
			$location.path('/rateCardList');
		}).catch(function (response) {
			$scope.success = null;
			$scope.saveLoad = false;
			console.log('Error - '+ response.data);
			if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
				$scope.errorRateCardExists = 'ERROR';
			} else {
				$scope.error = 'ERROR';
			}
		});;

	};

	$scope.loadRateCardTypes = function() {
		RateCardComponent.getRateTypes().then(function(data) {
			console.log('rateCard types - ' + JSON.stringify(data));
			$scope.rateCardTypes = data;
		})
	}

	$scope.loadUomTypes = function() {
		RateCardComponent.getUomTypes().then(function(data) {
			console.log('uom types - ' + data);
			$scope.uomTypes = data;
		})
	}

	$scope.loadRateCards = function () {
		$scope.search();
	};

	$scope.refreshPage = function(){
		$scope.clearFilter();
		$scope.loadRateCards();
	}

	$scope.loadRateCard = function(rateCard) {
		//RateCardComponent.findOne($stateParams.id).then(function (data) {
		//    $scope.rateCard = data;
		//});
		console.log(rateCard);
		$scope.rateCard = rateCard;

	};

	$scope.updateRateCard = function () {
		$scope.saveLoad = true;
		RateCardComponent.updateRateCard($scope.rateCard).then(function () {
			$scope.success = 'OK';
			$scope.loadRateCards();
			$location.path('/rateCardList');
		}).catch(function (response) {
			$scope.success = null;
			$scope.saveLoad = false;
			console.log('Error - '+ response.data);
			if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
				$scope.errorRateCardExists = 'ERROR';
			} else {
				$scope.error = 'ERROR';
			}
		});;
	};

	$scope.cancelRateCard = function () {
		$location.path('/rateCardList');
	};


	$scope.deleteConfirm = function (rateCard){
		$scope.confirmRateCard = rateCard;
	}

	$scope.deleteRateCard = function () {
		console.log($scope.confirmRateCard);
		$scope.confirmRateCard.id = $scope.confirmRateCard._id;
		RateCardComponent.deleteRateCard($scope.confirmRateCard);
		$scope.success = 'OK';
		$state.reload();
	};

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
		console.log('Selected  rateCard -' + $scope.selectedRateCard);
		console.log('search criteria - '+JSON.stringify($rootScope.searchCriteriaRateCard));

		if(!$scope.selectedRateCard) {
			if($rootScope.searchCriteriaRateCard) {
				$scope.searchCriteria = $rootScope.searchCriteriaRateCard;
			}else {
				$scope.searchCriteria.findAll = true;
			}
		}else if($scope.selectedRateCard) {
			$scope.searchCriteria.findAll = false;
			if($scope.selectedRateCard) {
				$scope.searchCriteria.rateCardId = $scope.selectedRateCard.id;
				$scope.searchCriteria.rateCardName = $scope.selectedRateCard.name;
				console.log('selected RateCard id ='+ $scope.searchCriteria.rateCardId);
			}else {
				$scope.searchCriteria.rateCardId = 0;
			}



		}
		console.log($scope.searchCriteria);
		RateCardComponent.search($scope.searchCriteria).then(function (data) {
			$scope.rateCards = data;
			$scope.rateCardsLoader = true;
			console.log('Ratecard' + $scope.rateCards);
			$scope.pages.currPage = data.currPage;
			$scope.pages.totalPages = data.totalPages;
			if($scope.rateCards == null){
				$scope.pages.startInd = 0;
			}else{
				$scope.pages.startInd = (data.currPage - 1) * 10 + 1;
			}
			$scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
			$scope.pages.totalCnt = data.totalCount;
			$scope.hide = true;
		});
		$rootScope.searchCriteriaRateCard = $scope.searchCriteria;
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
			$scope.search();
		}

	};

	$scope.next = function() {
		if($scope.pages.currPage < $scope.pages.totalPages) {
			$scope.pages.currPage = $scope.pages.currPage + 1;
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
			$scope.search();
		}

	};

	$scope.last = function() {
		if($scope.pages.currPage < $scope.pages.totalPages) {
			$scope.pages.currPage = $scope.pages.totalPages;
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
			$scope.search();
		}

	};

	$scope.clearFilter = function() {
		$scope.selectedRateCard = null;
		$scope.searchCriteria = {};
		$rootScope.searchCriteriaRateCard = null;
		$scope.pages = {
				currPage: 1,
				totalPages: 0
		}
		$scope.search();
	};

	//init load
	$scope.initLoad = function(){
		$scope.loadPageTop();


	}


});
