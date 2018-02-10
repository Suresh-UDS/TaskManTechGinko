'use strict';

	angular.module('timeSheetApp')	
		.directive('fileModel', function ($parse) {
			return {
				require: "ngModel",
	            restrict: 'A', //the directive can be used as an attribute only
	
	            /*
	             link is a function that defines functionality of directive
	             scope: scope associated with the element
	             element: element on which this directive used
	             attrs: key value pair of element attributes
	             */
	            link: function ($scope, element, attrs, ngModel) {
	            		element.bind('change', function (event) {
	                    ngModel.$setViewValue(event.target.files[0]);
	                    $scope.$apply();
	                });

	                $scope.$watch(function () {
	                    return ngModel.$viewValue;
	                }, function (value) {
	                    if (!value) {
	                        element.val("");
	                    }
	                });
	            }
			};
		});
