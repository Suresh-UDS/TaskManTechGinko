'use strict';

angular.module('timeSheetApp')
    .factory('DashboardComponent', function DashboardComponent(Project,$http,ProjectDelete) {
        return {

            loadAttendanceReportByProject: function (projectId, selectedDate,endDate) {
                return $http.get('api/reports/attendance/project/'+projectId+'/selectedDate/'+selectedDate).then(function (response) {
                    return response.data;
                });
            },
            loadAttendanceReportByRegion: function (projectId, region, selectedDate, endDate) {
                return $http.get('api/reports/attendance/region/'+region+'/project/'+projectId+'/selectedDate/'+selectedDate).then(function (response) {
                    return response.data;
                });
            },

            loadAttendanceReportByBranch: function (projectId, region,branch, selectedDate, endDate) {
                return $http.get('api/reports/attendance/branch/'+branch+'/region/'+region+'/project/'+projectId+'/selectedDate/'+selectedDate).then(function (response) {
                    return response.data;
                });
            },

            // loadAttendanceReport: function (siteId,selectedDate,endDate) {
            //     return $http.get('api/reports/attendance/site/'+siteId+'/selectedDate/'+selectedDate).then(function (response) {
            //         return response.data;
            //     });
            // },

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
            },

            loadTicketChartDataByProject: function(projectId,fromDate,toDate){
                return $http.get('api/reports/ticket/project/'+projectId+'/fromDate/'+fromDate+'/toDate/'+toDate).then(function (response) {
                    return response.data;
                })
            },

            loadTicketChartData: function(siteId,fromDate,toDate){
                return $http.get('api/reports/ticket/site/'+siteId+'/fromDate/'+fromDate+'/toDate/'+toDate).then(function (response) {
                    return response.data;
                })
            },

            loadTicketChartDataByRegion: function(projectId,region,fromDate,toDate){
                return $http.get('api/reports/ticket/region/'+region+'/project/'+projectId+'/fromDate/'+fromDate+'/toDate/'+toDate).then(function (response) {
                    return response.data;
                })
            },

            loadTicketChartDataByBranch: function(projectId,region,branch,fromDate,toDate){
                return $http.get('api/reports/ticket/branch/'+branch+'/region/'+region+'/project/'+projectId+'/fromDate/'+fromDate+'/toDate/'+toDate).then(function (response) {
                    return response.data;
                })
            },

            loadAllJobsByCategoryCnt: function () {
                return $http.get('api/reports/jobType/count').then(function (response) {
                    return response.data;
                })
            },

            loadAllJobsByStatusCnt: function () {
                return $http.get('api/reports/jobStatus/count').then(function (response) {
                    return response.data;
                })
            },

            loadAttendanceReport : function (searchCriteria) {
                return $http.post('api/reports/attendance/todayCount/',searchCriteria).then(function (response) {
                    return response.data;
                });
            }
        }
    })
