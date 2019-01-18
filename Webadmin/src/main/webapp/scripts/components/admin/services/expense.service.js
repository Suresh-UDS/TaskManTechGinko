'use strict';

angular.module('timeSheetApp')
    .factory('ExpenseDelete', function ($resource) {
        return $resource('api/expenseDelete/:id', {}, {

            'deleteExpense' : { method:'DELETE' }

        });
    });
