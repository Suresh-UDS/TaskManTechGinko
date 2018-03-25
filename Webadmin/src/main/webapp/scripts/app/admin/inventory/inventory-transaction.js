'use strict';

angular.module('timeSheetApp').config(function($stateProvider) {
	$stateProvider.state('add-inventory-transaction', {
		parent : 'manage',
		url : '/add-inventory-transaction',
		controller : 'InventoryTransactionController',
		data : {
			authorities : [],
			pageTitle : 'Add inventory Transaction'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/inventory/add-inventory-transaction.html',
				controller : 'InventoryTransactionController'
			}
		},
		resolve : {

		}
	}).state('edit-inventory-transaction', {
		parent : 'manage',
		url : '/edit-inventory-transaction',
		controller : 'InventoryTransactionController',
		data : {
			authorities : [],
			pageTitle : 'Edit inventory Transaction'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/inventory/edit-inventory-transaction.html',
				controller : 'InventoryTransactionController'
			}
		},
		resolve : {

		}
	}).state('view-inventory-transaction', {
		parent : 'manage',
		url : '/view-inventory-transaction',
		controller : 'InventoryTransactionController',
		data : {
			authorities : [],
			pageTitle : 'View inventory Transaction'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/inventory/view-inventory-transaction.html',
				controller : 'InventoryTransactionController'
			}
		},
		resolve : {

		}
	});
});
