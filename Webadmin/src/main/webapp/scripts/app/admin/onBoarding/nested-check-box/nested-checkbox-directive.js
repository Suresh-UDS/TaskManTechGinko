'use strict';
angular.module('timeSheetApp')
.directive('nestedCheckBox',function($timeout,$compile) {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            item: '='
        },
        templateUrl: 'scripts/app/admin/onBoarding/nested-check-box/nested-checkbox-tpl.html',
        link: function (scope, element, attrs) {
            
            if (angular.isArray(scope.item.childElements)) {
                element.append("<ul><nested-check-box ng-repeat='item in item.childElements' item='item'></nested-check-box></ul>");
                $compile(element.contents())(scope)
            }

            $(element).find("input").each(function(){ console.log("hi");

                $(this).click(function(){

                    console.log("che");

                    if($(this).is(":checked")){

                        console.log("chek");

                        $(this).parent().find("input").prop("checked",true);

                    }
                    else{

                        $(this).parent().find("input").prop("checked",false);

                    }
                    

                })

            });

        }
         
    };

});