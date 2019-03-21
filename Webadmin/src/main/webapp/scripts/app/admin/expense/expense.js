'use strict';

angular.module('timeSheetApp').config(function($stateProvider) {
	$stateProvider.state('add-expense', {
		parent : 'manage',
		url : '/add-expense',
		controller : 'ExpenseController',
		data : {
			authorities : [],
			pageTitle : 'Add Expense'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/expense/add-expense.html',
				controller : 'ExpenseController'
			}
		},
		resolve : {

		}
	}).state('edit-expense', {
		parent : 'manage',
		url : '/edit-expense/:id',
		controller : 'ExpenseController',
		data : {
			authorities : [],
			pageTitle : 'Edit Expense'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/expense/edit-expense.html',
				controller : 'ExpenseController'
			}
		},
		resolve : {

		}
	}).state('view-expense', {
		parent : 'manage',
		url : '/view-expense/:id',
		controller : 'ExpenseController',
		data : {
			authorities : [],
			pageTitle : 'View Expense'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/expense/view-expense.html',
				controller : 'ExpenseController'
			}
		},
		resolve : {

		}
	});
});
