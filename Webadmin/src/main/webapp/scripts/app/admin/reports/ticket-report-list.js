'use strict';

angular.module('timeSheetApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('ticketReports', {
                parent: 'manage',
                url: '/ticket-report/:uid',
                //controller: 'TicketReportController',
                data: {
                    authorities: [],
                    pageTitle: 'Ticket Report'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/reports/ticket-report-list.html',
                        controller: 'TicketReportController'
                    }
                },
                resolve: {
                    
                }
            });      
       
    });
