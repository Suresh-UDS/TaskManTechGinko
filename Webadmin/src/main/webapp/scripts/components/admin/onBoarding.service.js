'use strict';

angular.module('timeSheetApp')
    .factory('OnBoardingComponent', function JobComponent($http) {
        return {
            getSapBusinessCategories: function(){
                return $http.get('api/onBoardingConfig/getDetails').then(function (response) {
                    return response.data;
                });
            },

            create : function(categoryList,onBoardingUserId,callback){
                var cb = callback || angular.noop;
                return $http.post('api/saveOnboardingUserConfigList',categoryList).then(
                    function (response) {
                        return cb(response,null);
                    }).catch(
                    function (err) {
                        console.log(' Error response ' + JSON.stringify(err));
                        return cb(null,err);
                    })

            },

            getElementsByUser: function(userId){
                return $http.get('api/onBoardingConfig/getUserDetails/'+userId).then(function (response) {
                    console.log(response.data);
                    return response.data;
                })
            },

            saveOnBoardingEmployee: function(employee){
              return $http.post('api/saveOnboradingEmployee',employee).then(function (response) {
                  console.log(response.data);
                  return response.data;
              })
            },

            editOnBoardingEmployee: function(employee){
                return $http.post('api/editOnBoardingEmployee',employee).then(function (response) {
                    console.log(response.data);
                    return response.data;
                })
            },

            verifyOnBoardingEmployee: function(employee){
                return $http.post('api/verifyOnBoardingEmployee',employee).then(function (response) {
                    console.log(response.data);
                    return response.data;
                })
            },

            uploadDocumentImages: function(employeeId,addressProofImage,document_type) {
                var fileFormData = new FormData();
                fileFormData.append('imageFile', addressProofImage);
                fileFormData.append('employeeId', employeeId);
                fileFormData.append('document_type', document_type);
                return $http.post('api/onBoarding/document_image/upload', fileFormData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}

                }).then(function (response) {
                    return response.data;
                });

            },

            getBranchList: function () {
                return $http.get('api/getBranchListForUser').then(function (response) {
                    console.log(response.data);
                    return response.data;
                })
            },

            getProjectListByBranchCode: function (branchCode) {
                return $http.get('api/getProjectByBranchCode/'+branchCode).then(function (response) {
                    console.log(response.data);
                    return response.data;
                })
            },

            getWBSListByProjectCode: function (projectCode) {
                return $http.get('api/getWBSByProjectCode/'+projectCode).then(function (response) {
                    console.log(response.data);
                    return response.data;
                })
            },
 
/*************************************Modified by Vinoth************************************************************************************/           
            
//            exportAllData: function(searchCriteria) {
//            	alert("Export service");
//                return $http.post('api/employeeOnboarding/export', searchCriteria).then(function (response) {
//                	alert("Export service after");
//                    console.log("Emp - Export------>"+JSON.stringify(response));
//                    return response.data;
//                });
//            },
//            exportStatus: function(fileName) {
//                return $http.get('api/employeeOnboarding/export/'+fileName+"/status").then(function (response) {
//                    return response.data;
//                });
//            },
//
//            getExportFile: function(fileName) {
//                return $http.get('api/employeeOnboarding/export/'+fileName).then(function (response) {
//                    return response.data;
//                });
//            },
            
/****************************************************************************************************************************************/
            
            searchEmployees: function(searchCriteria) {
                return $http.post('api/onBoarding/employee/search', searchCriteria).then(function (response) {
                    return response.data;
                });
            },

        }

    });
