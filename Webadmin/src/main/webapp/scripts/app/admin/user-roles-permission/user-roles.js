'use strict';

angular.module('timeSheetApp').config(function($stateProvider) {
	$stateProvider.state('add-user-role', {
		parent : 'admin',
		url : '/add-user-role',
		controller : 'UserRolesController',
		data : {
			authorities : [],
			pageTitle : 'Add User Role'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/user-roles-permission/add-user-roles.html',
				controller : 'UserRolesController'
			}
		},
		resolve : {

		}
	}).state('edit-user-role', {
		parent : 'admin',
		url : '/edit-user/:id',
		controller : 'UserRolesController',
		data : {
			authorities : [],
			pageTitle : 'Edit User Role'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/user-roles-permission/edit-user-roles.html',
				controller : 'UserRolesController'
			}
		},
		resolve : {

		}
	}).state('view-user-role', {
		parent : 'admin',
		url : '/view-user/:id',
		controller : 'UserRolesController',
		data : {
			authorities : [],
			pageTitle : 'View User Role'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/user-roles-permission/view-user-roles.html',
				controller : 'UserRolesController'
			}
		},
		resolve : {

		}
	});
});
