'use strict';

angular.module('timeSheetApp')
    .factory('PaginationComponent', function PaginationComponent() {
        return {
            
        /*
            ** Page navigation main function**
            @Params:integer
            sort:10
        */
            GetPager:function(totalItems, currentPage, pageSize) {
            // default to first page
            currentPage = currentPage || 1;

            // default page size is 10
            pageSize = pageSize || 10;

            // calculate total pages
            var totalPages = Math.ceil(totalItems / pageSize);

            var startPage, endPage;

           /* if(totalPages > 0) {
                    if (totalPages <= 5) {
                        // less than 5 total pages so show all
                        startPage = 1;
                        endPage = totalPages;
                    } 
                    else {
                        // more than 5 total pages so calculate start and end pages
                        if (currentPage <= 4) {
                            startPage = 1;
                            endPage = 5;
                        } else if (currentPage + 1 >= totalPages) {
                            startPage = totalPages - 4;
                            endPage = totalPages;
                        } else {
                            startPage = currentPage - 2;
                            endPage = currentPage + 2;
                        }
                    }

                    // calculate start and end item indexes
                    if(currentPage == 1){
                        var startIndex = 1;
                        if(totalItems < 10){
                            var endIndex = Math.min(totalItems);
                        }
                        else{
                            var endIndex = Math.min(startIndex + pageSize-1 , totalItems);
                        }
                        
                        
                    }else{
                       // var startIndex = (currentPage - 1) * pageSize;  
                        var startIndex =   ((currentPage - 1) * pageSize) + 1;
                        var endIndex = Math.min(startIndex + pageSize - 1 , totalItems);
                    }
        }else{
                var startIndex = 0;  
                var endIndex = 0;
        }*/

         if(totalPages > 0) {
                    if (totalPages <= 3) {
                        // less than 5 total pages so show all
                        startPage = 1;
                        endPage = totalPages;
                    } 
                    else {
                        // more than 5 total pages so calculate start and end pages
                        if (currentPage <= 2) {
                            startPage = 1;
                            endPage = 3;
                        } else if (currentPage + 1 >= totalPages) {
                            startPage = totalPages - 2;
                            endPage = totalPages;
                        } else {
                            startPage = currentPage - 1;
                            endPage = currentPage + 1;
                        }
                    }

                    // calculate start and end item indexes
                    if(currentPage == 1){
                        var startIndex = 1;
                        if(totalItems < 10){
                            var endIndex = Math.min(totalItems);
                        }
                        else{
                            var endIndex = Math.min(startIndex + pageSize-1 , totalItems);
                        }
                        
                        
                    }else{
                       // var startIndex = (currentPage - 1) * pageSize;  
                        var startIndex =   ((currentPage - 1) * pageSize) + 1;
                        var endIndex = Math.min(startIndex + pageSize - 1 , totalItems);
                    }
        }else{
                var startIndex = 0;  
                var endIndex = 0;
        }
            

            // create an array of pages to ng-repeat in the pager control
            var pages = _.range(startPage, endPage + 1);

            // return object with all pager properties required by the view
            return {
                totalItems: totalItems,
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                startPage: startPage,
                endPage: endPage,
                startIndex: startIndex,
                endIndex: endIndex,
                pages: pages
            };
        }
        };
    });
