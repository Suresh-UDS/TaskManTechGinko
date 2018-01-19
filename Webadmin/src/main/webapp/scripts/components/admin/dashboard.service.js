'use strict';

angular.module('timeSheetApp')
    .factory('DashboardComponent', function DashboardComponent(Project,$http,ProjectDelete) {
        return {

            loadAttendanceReport: function (siteId,selectedDate,endDate) {
                return $http.get('api/reports/attendance/site/'+siteId+'/selectedDate/'+selectedDate).then(function (response) {
                    return response.data;
                });
            },

            loadAllProjects: function(){
                return $http.get('api/project').then(function(response){
                    return response.data;
                })
            },
            loadSites: function(projectId){
                return $http.get('api/project/'+projectId+'/sites').then(function (response) {
                    return response.data;
                })
            },
            loadAllSites: function(){
                return $http.get('api/site').then(function (response) {
                    return response.data;
                })
            }
        }
    })
