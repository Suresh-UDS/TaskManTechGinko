'use strict';

angular.module('timeSheetApp').config(function($stateProvider) {
	$stateProvider.state('add-device', {
		parent : 'admin',
		url : '/add-device',
		//controller : 'DeviceController',
		data : {
			authorities : [],
			pageTitle : 'Add Device'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/device/add-device.html',
				controller : 'DeviceController'
			}
		},
		resolve : {

		}
	}).state('edit-device', {
		parent : 'admin',
		url : '/edit-device:id',
		//controller : 'DeviceController',
		data : {
			authorities : [],
			pageTitle : 'Edit Device'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/device/edit-device.html',
				controller : 'DeviceController'
			}
		},
		resolve : {

		}
	}).state('view-device', {
		parent : 'admin',
		url : '/view-device:id',
		//controller : 'DeviceController',
		data : {
			authorities : [],
			pageTitle : 'View Device'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/device/view-device.html',
				controller : 'DeviceController'
			}
		},
		resolve : {

		}
	});
});
