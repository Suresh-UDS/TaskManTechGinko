'use strict';

angular.module('timeSheetApp')
    .factory('ExpenseUpdate', function ($resource) {
        return $resource('api/expense/', {}, {
            'update' : { method:'PUT' },
            'deleteExpense' : { method:'POST' }
        });
    });
