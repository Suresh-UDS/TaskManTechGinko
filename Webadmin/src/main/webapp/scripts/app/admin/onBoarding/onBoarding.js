'use strict';

angular.module('timeSheetApp').config(function($stateProvider) {
	$stateProvider.state('onBoarding-list', {
		parent : 'manage',
		url : '/onBoarding-list',
		//controller : 'onBoardingController',
		data : {
			authorities : [],
			pageTitle : 'On Boarding List'
		},
		views : {
			'content@' : {
				templateUrl : 'scripts/app/admin/onBoarding/onBoarding-list.html',
				controller : 'OnBoardingController'
			}
		},
		resolve : {

		}
	}).state('view-onBoarding', {
        parent : 'manage',
        url : '/view-onBoarding/:id',
        //controller : 'EmployeeController',
        data : {
            authorities : [],
            pageTitle : 'On Boarding Details'
        },
        views : {
            'content@' : {
                templateUrl : 'scripts/app/admin/onBoarding/view-onBoarding.html',
                controller : 'OnBoardingController'
            }
        },
        resolve : {

        }
    }).state('onBoarding-mapping', {
        parent : 'manage',
        url : '/onBoarding-mapping',
        //controller : 'EmployeeController',
        data : {
            authorities : [],
            pageTitle : 'On Boarding Mapping'
        },
        views : {
            'content@' : {
                templateUrl : 'scripts/app/admin/onBoarding/onBoarding-mapping.html',
                controller : 'OnBoardingController'
            }
        },
        resolve : {

        }
    }).state('edit-onBoarding', {
        parent: 'manage',
        url: '/edit-onBoarding/:id',
        data: {
            authorities: [],
            pageTitle: 'Edit Employee'
        },
        views: {
            'content@': {
                templateUrl: 'scripts/app/admin/onBoarding/edit-onBoarding.html',
                controller: 'OnBoardingController'
            }
        },
        resolve: {}
    });
});
