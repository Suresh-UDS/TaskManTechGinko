/* globals $ */
'use strict';

angular.module('timeSheetApp')
    .directive('timeSheetAppPagination', function() {
        return {
            templateUrl: 'scripts/components/form/pagination.html'
        };
    });
