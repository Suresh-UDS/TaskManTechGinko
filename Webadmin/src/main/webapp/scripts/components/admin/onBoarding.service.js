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

            getElementsByUser: function(){
                return $http.get('api/onBoardingConfig/getUserDetails/'+1).then(function (response) {
                    console.log(response.data);
                    return response.data;
                })
            }
        }

    });
