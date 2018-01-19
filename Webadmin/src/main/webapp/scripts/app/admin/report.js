'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('report', {
                abstract: true,
                parent: 'site'
            });
    });
