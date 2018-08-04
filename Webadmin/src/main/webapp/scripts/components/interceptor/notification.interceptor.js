 'use strict';

angular.module('timeSheetApp')
    .factory('notificationInterceptor', function ($q, AlertService) {
        return {
            response: function(response) {
                var alertKey = response.headers('X-timeSheetApp-alert');
                if (angular.isString(alertKey)) {
                    AlertService.success(alertKey, { param : response.headers('X-timeSheetApp-params')});
                }
                return response;
            }
        };
    });
