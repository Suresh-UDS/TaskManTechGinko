'use strict';

angular.module('timeSheetApp').config(function($stateProvider) {
	$stateProvider.state('add-purchase-requisition', {
		parent : 'manage',
		url : '/add-purchase-requisition',
		controller : 'PurchaseRequisitionController',
		data : {
			authorities : [],
			pageTitle : 'Add Purchase Requisition'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/purchase-requisition/add-purchase-requisition.html',
				controller : 'PurchaseRequisitionController'
			}
		},
		resolve : {

		}
	}).state('edit-purchase-requisition', {
		parent : 'manage',
		url : '/edit-purchase-requisition/:id',
		controller : 'PurchaseRequisitionController',
		data : {
			authorities : [],
			pageTitle : 'Edit Purchase Requisition'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/purchase-requisition/edit-purchase-requisition.html',
				controller : 'PurchaseRequisitionController'
			}
		},
		resolve : {

		}
	}).state('view-purchase-requisition', {
		parent : 'manage',
		url : '/view-purchase-requisition/:id',
		controller : 'PurchaseRequisitionController',
		data : {
			authorities : [],
			pageTitle : 'View Purchase Requisition'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/purchase-requisition/view-purchase-requisition.html',
				controller : 'PurchaseRequisitionController'
			}
		},
		resolve : {

		}
	});
});
