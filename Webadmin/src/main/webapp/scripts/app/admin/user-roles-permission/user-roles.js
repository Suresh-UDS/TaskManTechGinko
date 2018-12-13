'use strict';

angular.module('timeSheetApp').config(function($stateProvider) {
	$stateProvider.state('add-user-role', {
		parent : 'admin',
		url : '/add-user-role',
		controller : 'UserRolesController',
		data : {
			authorities : [],
			pageTitle : 'Add User Role'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/user-roles-permission/add-user-roles.html',
				controller : 'UserRolesController'
			}
		},
		resolve : {

		}
	}).state('edit-user-role', {
		parent : 'admin',
		url : '/edit-user-role/:id',
		controller : 'UserRolesController',
		data : {
			authorities : [],
			pageTitle : 'Edit User Role'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/user-roles-permission/edit-user-roles.html',
				controller : 'UserRolesController'
			}
		},
		resolve : {

		}
	}).state('view-user-role', {
		parent : 'admin',
		url : '/view-user-role/:id',
		controller : 'UserRolesController',
		data : {
			authorities : [],
			pageTitle : 'View User Role'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/user-roles-permission/view-user-roles.html',
				controller : 'UserRolesController'
			}
		},
		resolve : {

		}
	}).state('role-permission', {
      		parent : 'admin',
      		url : '/role-permission',
      		controller : 'UserRolesController',
      		data : {
      			authorities : [],
      			pageTitle : 'Role Permission'
      		},
      		views : {
      			'content@' : {
      				templateUrl : 'scripts/app/admin/user-roles-permission/role-permission.html',
      				controller : 'UserRolesController'
      			}
      		},
      		resolve : {

      		}
      	}).state('app-module-actions', {
                		parent : 'admin',
                		url : '/app-module-actions',
                		controller : 'UserRolesController',
                		data : {
                			authorities : [],
                			pageTitle : 'App Module Actions'
                		},
                		views : {
                			'content@' : {
                				templateUrl : 'scripts/app/admin/user-roles-permission/app-module-actions.html',
                				controller : 'UserRolesController'
                			}
                		},
                		resolve : {

                		}
                	});
});
