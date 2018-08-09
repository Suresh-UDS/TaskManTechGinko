'use strict';

angular.module('timeSheetApp').config(function($stateProvider) {
	$stateProvider.state('add-budget', {
		parent : 'manage',
		url : '/add-budget',
		controller : 'BudgetMasterController',
		data : {
			authorities : [],
			pageTitle : 'Add budget'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/expense/add-budget.html',
				controller : 'BudgetMasterController'
			}
		},
		resolve : {

		}
	}).state('edit-budget', {
		parent : 'manage',
		url : '/edit-budget:id',
		controller : 'BudgetMasterController',
		data : {
			authorities : [],
			pageTitle : 'Edit budget'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/expense/edit-budget.html',
				controller : 'BudgetMasterController'
			}
		},
		resolve : {

		}
	}).state('view-budget', {
		parent : 'manage',
		url : '/view-budget:id',
		controller : 'BudgetMasterController',
		data : {
			authorities : [],
			pageTitle : 'View Budget'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/expense/view-budget.html',
				controller : 'BudgetMasterController'
			}
		},
		resolve : {

		}
	});
});
