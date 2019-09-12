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
            
            scope.parentItem = scope.$parent.curItem; 
             
            if (angular.isArray(scope.parentItem.childElements)) {
                element.append("<ul style='display:none'><nested-check-box ng-repeat='curItem in parentItem.childElements' item='[curItem,item[1]]' ></nested-check-box></ul>");
                $compile(element.contents())(scope)
            }
      
            scope.$watch('item[1]', function(newValue, oldValue) {

                console.log(newValue);

            });

            if(_.find(scope.item[1],{'elementCode':scope.item[0].elementCode})){
  
                scope.$parent.curItem.checked = true;
 
            }
        
            // toggle

            $(element).find(".elementText").click(function(){

                $($(element).find("ul")[0]).toggle(500);

            });
             
            $(element).find("input").each(function(){  

                $(this).click(function(){

                    // toggle
 
                    if($(this).is(":checked")){
 
                        $(this).parent().find("input").prop("checked",true);

                    }
                    else{

                        $(this).parent().find("input").prop("checked",false);

                    }
                    
                    // make check parent

                    if(scope.item.length == 2){

                        if($(element).parent().parent().find("input").length > 0){

                            $($(element).parent().parent().find("input")[0]).prop("checked",true);

                        }

                        if($(element).parent().parent().parent().parent().find("input").length > 0){

                            $($(element).parent().parent().parent().parent().find("input")[0]).prop("checked",true);

                        }

                    }

                })

            });

        }
         
    };

});