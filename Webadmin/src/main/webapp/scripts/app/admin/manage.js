'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('manage', {
                abstract: true,
                parent: 'site'
            });
    });
