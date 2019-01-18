'use strict';

angular.module('timeSheetApp').config(function($stateProvider) {
	$stateProvider.state('add-user', {
		parent : 'admin',
		url : '/add-user',
		//controller : 'UserController',
		data : {
			authorities : [],
			pageTitle : 'Add User'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/user/add-user.html',
				controller : 'UserController'
			}
		},
		resolve : {

		}
	}).state('edit-user', {
		parent : 'admin',
		url : '/edit-user/:id',
		//controller : 'UserController',
		data : {
			authorities : [],
			pageTitle : 'Edit User'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/user/edit-user.html',
				controller : 'UserController'
			}
		},
		resolve : {

		}
	}).state('view-user', {
		parent : 'admin',
		url : '/view-user/:id',
		//controller : 'UserController',
		data : {
			authorities : [],
			pageTitle : 'View User'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/user/view-user.html',
				controller : 'UserController'
			}
		},
		params:{checkStatus:':checkStatus'},
		resolve : {

		}
	});
});
