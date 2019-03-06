'use strict';

angular.module('timeSheetApp')
    .factory('$forget', function() {
        return {
            unsetCookie:function (cname, cvalue) {
                var expires = "expires="+ new Date();
                document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
            }
        }
});
