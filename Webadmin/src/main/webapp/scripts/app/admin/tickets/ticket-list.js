'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('tickets', {
                parent: 'manage',
                url: '/tickets',
                controller: 'TicketController',
                data: {
                    authorities: [],
                    pageTitle: 'Tickets'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/tickets/ticket-list.html',
                        controller: 'TicketController'
                    }
                },
                resolve: {
                    
                }
            });      
       
    });
