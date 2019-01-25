'use strict';

angular.module('timeSheetApp').config(function($stateProvider) {
	$stateProvider.state('add-employee', {
		parent : 'manage',
		url : '/add-employee',
		//controller : 'EmployeeController',
		data : {
			authorities : [],
			pageTitle : 'Add Employee'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/employee/add-emp.html',
				controller : 'EmployeeController'
			}
		},
		resolve : {

		}
	}).state('edit-employee', {
		parent : 'manage',
		url : '/edit-employee/:id',
		//controller : 'EmployeeController',
		data : {
			authorities : [],
			pageTitle : 'Edit Employee'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/employee/edit-emp.html',
				controller : 'EmployeeController'
			}
		},
		resolve : {

		}
	}).state('view-employee', {
		parent : 'manage',
		url : '/view-employee/:id',
		//controller : 'EmployeeController',
		data : {
			authorities : [],
			pageTitle : 'View Employee'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/employee/view-emp.html',
				controller : 'EmployeeController'
			}
		},
		resolve : {

		}
	}).state('view-employee-hist', {
		parent : 'manage',
		url : '/view-employee-hist/:id',
		//controller : 'EmployeeController',
		data : {
			authorities : [],
			pageTitle : 'View Employee History'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/employee/emp-history-list.html',
				controller : 'EmployeeController'
			}
		},
		resolve : {

		}
	}).state('employee-location', {
        parent : 'manage',
        url : '/employee-location',
        //controller : 'EmployeeController',
        data : {
            authorities : [],
            pageTitle : 'Employee Location'
        },
        views : {
            'content@' : {
                templateUrl : 'scripts/app/admin/employee/emp-location.html',
                controller : 'EmployeeController'
            }
        },
        resolve : {

        }
    });
});
