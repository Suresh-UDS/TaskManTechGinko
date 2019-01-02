'use strict';

angular.module('timeSheetApp').config(function($stateProvider) {
	$stateProvider.state('add-usergroup', {
		parent : 'admin',
		url : '/add-usergroup',
		//controller : 'UserGroupController',
		data : {
			authorities : [],
			pageTitle : 'Add UserGroup'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/usergroup/add-usergroup.html',
				controller : 'UserGroupController'
			}
		},
		resolve : {

		}
	}).state('edit-usergroup', {
		parent : 'admin',
		url : '/edit-usergroup/:id',
		//controller : 'UserGroupController',
		data : {
			authorities : [],
			pageTitle : 'Edit UserGroup'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/usergroup/edit-usergroup.html',
				controller : 'UserGroupController'
			}
		},
		resolve : {

		}
	}).state('view-usergroup', {
		parent : 'admin',
		url : '/view-usergroup/:id',
		//controller : 'UserGroupController',
		data : {
			authorities : [],
			pageTitle : 'View UserGroup'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/usergroup/view-usergroup.html',
				controller : 'UserGroupController'
			}
		},
		resolve : {

		}
	});
});
