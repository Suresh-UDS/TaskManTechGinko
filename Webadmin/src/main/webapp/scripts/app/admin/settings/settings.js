'use strict';

angular.module('timeSheetApp').config(function($stateProvider) {
	$stateProvider.state('app_settings', {
		parent : 'admin',
		url : '/app_settings',
		//controller : 'SettingsController',
		data : {
			authorities : [],
			pageTitle : 'Settings'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/settings/settings.html',
				controller : 'SettingsController'
			}
		},
		resolve : {

		}
	});
});
