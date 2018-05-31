'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('notice-board', {
                parent: 'manage',
                url: '/notice-board',
                controller: 'NoticeBoardController',
                data: {
                    authorities: [],
                    pageTitle: 'Notice Board'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/notice-board/notice-board.html',
                        controller: 'NoticeBoardController'
                    }
                },
                resolve: {

                }
            });

    });
