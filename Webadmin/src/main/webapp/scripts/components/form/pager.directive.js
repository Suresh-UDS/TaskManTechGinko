/* globals $ */
'use strict';

angular.module('timeSheetApp')
    .directive('timeSheetAppPager', function() {
        return {
            templateUrl: 'scripts/components/form/pager.html'
        };
    });
