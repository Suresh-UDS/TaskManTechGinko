'use strict';

angular.module('timeSheetApp').config(function($stateProvider) {
	$stateProvider.state('add-indent', {
		parent : 'manage',
		url : '/add-indent',
		controller : 'IndentController',
		data : {
			authorities : [],
			pageTitle : 'Add indent'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/indent/add-indent.html',
				controller : 'IndentController'
			}
		},
		resolve : {

		}
	}).state('edit-indent', {
		parent : 'manage',
		url : '/edit-indent/:id',
		controller : 'IndentController',
		data : {
			authorities : [],
			pageTitle : 'Edit indent'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/indent/edit-indent.html',
				controller : 'IndentController'
			}
		},
		resolve : {

		}
	}).state('view-indent', {
		parent : 'manage',
		url : '/view-indent/:id',
		controller : 'IndentController',
		data : {
			authorities : [],
			pageTitle : 'View Indent'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/indent/view-indent.html',
				controller : 'IndentController'
			}
		},
		resolve : {

		}
	});
});
