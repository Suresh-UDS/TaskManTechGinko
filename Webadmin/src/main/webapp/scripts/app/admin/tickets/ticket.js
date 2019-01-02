'use strict';

angular.module('timeSheetApp').config(function($stateProvider) {
	$stateProvider.state('create-ticket', {
		parent : 'manage',
		url : '/create-ticket/:assetId',
		//controller : 'TicketController',
		data : {
			authorities : [],
			pageTitle : 'Create Ticket'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/tickets/create-ticket.html',
				controller : 'TicketController'
			}
		},
		resolve : {

		}
	}).state('edit-ticket', {
		parent : 'manage',
		url : '/edit-ticket/:id',
		//controller : 'TicketController',
		data : {
			authorities : [],
			pageTitle : 'Update Ticket'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/tickets/update-ticket.html',
				controller : 'TicketController'
			}
		},
		resolve : {

		}
	}).state('view-ticket', {
		parent : 'manage',
		url : '/view-ticket/:id',
		//controller : 'TicketController',
		data : {
			authorities : [],
			pageTitle : 'View Ticket'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/tickets/view-ticket.html',
				controller : 'TicketController'
			}
		},
		params :{qid: null, status: null},
		resolve : {

		}
	});
});
