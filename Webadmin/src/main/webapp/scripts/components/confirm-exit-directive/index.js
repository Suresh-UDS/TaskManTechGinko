'use strict';

angular.module('confirmMsg',[])
.directive('confirmOnExit', function() {
    return {
        link: function($scope, elem, attrs) {
            /*window.onbeforeunload = function(){
                if ($scope.form.$dirty) {
                    return "The form is dirty, do you want to stay on the page?";
                }
            }*/
            var form = $scope[attrs.name];
            $scope.$on('$stateChangeStart', function(event, next, current) {
                if (form.$dirty && !form.$submitted) {
                    if(confirm("are you sure want to leave page without saving?")) {
                        return true;
                    }else{
                        event.preventDefault();
                    }
                }
            });
        }
    };
})
.directive('confirmOnExitTouch', function() {
    return {
        link: function($scope, elem, attrs) {
            /*window.onbeforeunload = function(){
                if ($scope.form.$dirty) {
                    return "The form is dirty, do you want to stay on the page?";
                }
            }*/
            var form = $scope[attrs.name];
            $scope.$on('$stateChangeStart', function(event, next, current) {
                if ((form.$dirty || form.$touched) && !form.$submitted) {
                    if(confirm("are you sure want to leave page without saving?")) {
                        return true;
                    }else{
                        event.preventDefault();
                    }
                }
            });
        }
    };
});
