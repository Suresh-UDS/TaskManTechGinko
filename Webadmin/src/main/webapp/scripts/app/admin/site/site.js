'use strict';

angular.module('timeSheetApp').config(function($stateProvider) {
	$stateProvider.state('add-site', {
		parent : 'manage',
		url : '/add-site',
		//controller : 'SiteController',
		data : {
			authorities : [],
			pageTitle : 'Add Site'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/site/add-site.html',
				controller : 'SiteController'
			}
		},
		resolve : {

		}
	}).state('edit-site', {
		parent : 'manage',
		url : '/edit-site/:id',
		//controller : 'SiteController',
		data : {
			authorities : [],
			pageTitle : 'Edit Site'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/site/edit-site.html',
				controller : 'SiteController'
			}
		},
		resolve : {

		}
	}).state('view-site', {
		parent : 'manage',
		url : '/view-site/:id',
		//controller : 'SiteController',
		data : {
			authorities : [],
			pageTitle : 'View Site'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/site/view-site.html',
				controller : 'SiteController'
			}
		},
		resolve : {

		}
	});
});
