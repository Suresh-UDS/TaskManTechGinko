'use strict';

angular.module('timeSheetApp').config(function($stateProvider) {
	$stateProvider.state('add-sla', {
		parent : 'manage',
		url : '/add-sla',
		//controller : 'SlaController',
		data : {
			authorities : [],
			pageTitle : 'Add SLA'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/sla/add-sla.html',
				controller : 'SlaController'
			}
		},
		resolve : {

		}
	}).state('edit-sla', {
		parent : 'manage',
		url : '/edit-sla/:id',
		//controller : 'SlaController',
		data : {
			authorities : [],
			pageTitle : 'Edit Sla'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/sla/edit-sla.html',
				controller : 'SlaController'
			}
		},
		resolve : {

		}
	}).state('view-sla', {
		parent : 'manage',
		url : '/view-sla/:id',
		//controller : 'SlaController',
		data : {
			authorities : [],
			pageTitle : 'View Sla'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/sla/view-sla.html',
				controller : 'SlaController'
			}
		},
		resolve : {

		}
	});
});
