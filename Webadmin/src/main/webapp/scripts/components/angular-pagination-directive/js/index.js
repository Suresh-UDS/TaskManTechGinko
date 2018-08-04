'use strict';

angular.module("paginations", [])
    .directive('paginationNew', function() {
        return {
   restrict : "EA",
   scope: false,
   templateUrl: 'scripts/components/angular-pagination-directive/pagination.html'
   
        };
        
});