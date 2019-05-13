'use strict';
//permissions.js
angular.module('timeSheetApp')
    .factory('permissions', function($rootScope,$location,Principal) {
        var permissionList = [];
        return {
            setPermissions: function(permissions) {
                permissionList = permissions;
                $rootScope.$broadcast('permissionsChanged');
            },
            hasPermission: function (permissionObj) {
                if(permissionObj && permissionObj.permission != undefined){
                    var permission;
                    permission = permissionObj.permission;
                    var permissionTrim = permission.trim();
                    var pageName = permissionObj.pageTitle;
                    //alert(pageName);
                    Principal.hasPermission(permissionTrim)
                    .then(function (result) {
                        if (result) {
                            $rootScope.grant = 1;
                            return false;
                        } else {
                            swal({
                                title: 'Permission denied',
                                text: 'You are not permission to access <b>'+ pageName +'</b> page...!!',
                                buttonsStyling: false,
                                confirmButtonClass: "btn btn-danger"
                            }).catch(swal.noop);
                            $rootScope.grant = 0;
                            $location.path('/Dashboard');
                            return false;
                        }
                    });
                }
            }
        };
    });
