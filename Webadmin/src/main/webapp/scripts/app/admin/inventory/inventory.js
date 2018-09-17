'use strict';

angular.module('timeSheetApp').config(function($stateProvider) {
	$stateProvider.state('add-inventory', {
		parent : 'manage',
		url : '/add-inventory',
		controller : 'InventoryController',
		data : {
			authorities : [],
			pageTitle : 'Add Material'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/inventory/add-inventory.html',
				controller : 'InventoryController'
			}
		},
		resolve : {

		}
	}).state('edit-inventory', {
		parent : 'manage',
		url : '/edit-inventory/:id',
		controller : 'InventoryController',
		data : {
			authorities : [],
			pageTitle : 'Edit Material'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/inventory/edit-inventory.html',
				controller : 'InventoryController'
			}
		},
		resolve : {

		}
	}).state('view-inventory', {
		parent : 'manage',
		url : '/view-inventory/:id',
		controller : 'InventoryController',
		data : {
			authorities : [],
			pageTitle : 'View Material'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/inventory/view-inventory.html',
				controller : 'InventoryController'
			}
		},
		resolve : {

		}
	});
});
