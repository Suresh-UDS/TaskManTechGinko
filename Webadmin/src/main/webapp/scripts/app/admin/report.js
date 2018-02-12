'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('reports', {
                abstract: true,
                parent: 'site'
            });
    });
