'use strict';

angular.module('timeSheetApp')
    .factory('SettingsComponent', function SettingsComponent(AppSettings,$http) {
        return {
        		saveSettings: function (settings, callback) {
                var cb = callback || angular.noop;

                return AppSettings.save(settings,
                    function () {
                        return cb(settings);
                    },
                    function (err) {
                        return cb(err);
                    }.bind(this)).$promise;
            },
            findAll: function (projectId, siteId) {
                return $http.get('api/settings/project/' + projectId + '/site/' + siteId).then(function (response) {
                console.log(response)
                    return response.data;
                });
            }
        }
    });