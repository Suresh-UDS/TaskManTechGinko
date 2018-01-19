'use strict';

angular.module('timeSheetApp')
    .directive('repeatDone', function() {
        return function(scope, elements, attrs) {
            if (scope.$last) { // all are rendered
            scope.$eval(attrs.repeatDone);
        }
        }
    });

