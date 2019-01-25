'use strict';

angular.module("timeSheetApp", [])
.directive('enterDirective', function () {
    return {
        link function (scope, element, attrs) {
            $(element).keypress(function (e) {
                if (e.keyCode == 13) {
                    console.log(Enter pressed  + element.val())
                }
            });
        }
    }
});
