'use strict';

angular.module('timeSheetApp').config(function($stateProvider) {
	$stateProvider
	.state('managePhoto', {
		parent : 'manage',
		url : '/managePhoto',
		//controller : 'PhotoManagementController',
		data : {
			authorities : [],
			pageTitle : 'Manage Photos'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/photo-management/emp-list.html',
				controller : 'PhotoManagementController'
			}
		},
		resolve : {

		}
	})
	.state('manageEmployeePhoto', {
		parent : 'manage',
		url : '/managePhoto/:empId/:empCode',
		//controller : 'PhotoManagementController',
		data : {
			authorities : [],
			pageTitle : 'Manage Photos'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/photo-management/photo-list.html',
				controller : 'PhotoManagementController'
			}
		},
		resolve : {

		}
	})
});
