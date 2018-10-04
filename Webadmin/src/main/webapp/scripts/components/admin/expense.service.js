'use strict';

angular.module('timeSheetApp')
    .factory('ExpenseComponent', function ExpenseComponent(ExpenseUpdate,$http,ExpenseDelete) {
        return {
            createExpense: function (expense, callback) {
                var cb = callback || angular.noop;

                return ExpenseUpdate.save(expense,
                    function () {
                        return cb(expense);
                    },
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    }.bind(this)).$promise;
            },
            findAll: function () {
                return $http.get('api/expense').then(function (response) {
                    return response.data;
                });
            },
            findOne: function(id){
                return $http.get('api/expenses/'+id).then(function (response) {
                    return response.data;
                });
            },
            search: function(searchCriteria) {
                return $http.post('api/expenses', searchCriteria).then(function (response) {

                    //console.log("response is--->>>"+JSON.stringify(response.data));
                    return response.data;
                });
            },

            searchExpenseCategories: function(){

                return $http.get('api/expenseCategories').then(function (response) {
                    return response.data;
                })

            },

            getLatestRecordBySite: function(siteId){
              return $http.get('api/expenses/latest/'+siteId).then(function (response) {
                  return response.data;
              })
            },

            updateExpense: function (expense, callback) {
                var cb = callback || angular.noop;

                return ExpenseUpdate.update(expense,
                    function () {
                        return cb(expense);
                    },
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    }.bind(this)).$promise;
            },
            deleteExpense: function (expense, callback) {

                var cb = callback || angular.noop;

                return ExpenseDelete.deleteExpense(expense,
                    function () {
                        return cb(expense);
                    },
                    function (err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },

            getCurrencies: function(){
                return $http.get('scripts/components/admin/Common-Currency.json').then(function (response) {
                    return response.data;
                })
            },

                uploadExpenseFile : function(expense) {
                var file = expense.uploadFile;
                var fileFormData = new FormData();

                fileFormData.append('title', expense.title);
                fileFormData.append('expenseId', expense.expenseId);
                fileFormData.append('uploadFile', file);
                fileFormData.append('type', expense.type);

                return $http.post('api/expenses/uploadFile', fileFormData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).then(function (response) {
                    return response.data;
                });
            },

            uploadExpensePhoto : function(expense) {
                var file = expense.uploadFile;
                var fileFormData = new FormData();

                fileFormData.append('title', expense.title);
                fileFormData.append('expenseId', expense.expenseId);
                fileFormData.append('uploadFile', file);
                fileFormData.append('type', expense.type);

                return $http.post('api/expenses/uploadExpensePhoto', fileFormData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).then(function (response) {
                    return response.data;
                });
            }
        }

    });
