'use strict';

angular.module('timeSheetApp')
    .controller('TicketController', function ($rootScope, $scope, $state, $timeout, SiteComponent, JobComponent,EmployeeComponent,$http,$stateParams,$location) {
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorTicketsExists = null;
        $scope.searchCriteria = {};
        $scope.selectedSite = null;
        $scope.cTicket ={};


        $timeout(function (){angular.element('[ng-model="name"]').focus();});

        $scope.pages = { currPage : 1};

        $scope.selectedProject;

        $scope.selectedTicket;

        $scope.calendar = {
        		start : false,
        		end : false,
        }
        

        $scope.loadTickets = function(){
            $scope.search();
        }
        
        $scope.initCalender = function(){
            demo.initFormExtendedDatetimepickers();
        }

        $('#shiftFrom').on('dp.change', function(e){

            console.log(e.date._d);
            if(e.date._d > $scope.newShiftItem.endTime) {
            		$scope.showNotifications('top','center','danger','From time cannot be after To time');
            		$scope.shiftFrom = $scope.newShiftItem.startTime;
            		return false;
            }else {
                $scope.newShiftItem.startTime = e.date._d.getHours() + ':' + e.date._d.getMinutes();
            }
        });
        
        $('#shiftTo').on('dp.change', function(e){

            console.log(e.date._d);
            if($scope.newShiftItem.startTime > e.date._d) {
            		$scope.showNotifications('top','center','danger','To time cannot be before From time');
            		$scope.shiftTo = $scope.newShiftItem.endTime;
            		return false;
            }else {
                $scope.newShiftItem.endTime = e.date._d.getHours() + ':' + e.date._d.getMinutes();
            }

        });
        $scope.initCalender();

        $scope.saveTicket = function () {
	        	$scope.error = null;
	        	$scope.success = null;
	        	$scope.errorTicketsExists = null;
	        	$scope.errorSite = null;
	        	if(!$scope.selectedSite.id){
	        		$scope.errorSite = "true";
	        	}else{
                    $scope.tickets.title = $scope.tickets.title;
                    $scope.tickets.description = $scope.tickets.description;
                    $scope.tickets.siteId = $scope.selectedSite.id;
                    $scope.tickets.employeeId = $scope.selectedEmployee.id; 
                    $scope.tickets.severity = $scope.tickets.severity;
	        		$scope.tickets.comments = $scope.tickets.comments;
                    console.log('Tickets - ' + JSON.stringify($scope.tickets));
	            	JobComponent.createTicket($scope.tickets).then(function() {
	                    $scope.success = 'OK';
	                    $scope.showNotifications('top','center','success','Ticket Added');
	                    $scope.selectedSite = null;
	                	$scope.loadTickets();
	                	$location.path('/tickets');
	                }).catch(function (response) {
	                    $scope.success = null;
	                    console.log('Error - '+ response.data);
	                    console.log('status - '+ response.status + ' , message - ' + response.data.message);
	                    if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
	                            $scope.errorTicketsExists = 'ERROR';
	                        $scope.showNotifications('top','center','danger','Ticket Already Exists');
	
	                        console.log($scope.errorTicketsExists);
	                    } else {
	                        $scope.showNotifications('top','center','danger','Error in creating Ticket. Please try again later..');
	                        $scope.error = 'ERROR';
	                    }
	                });
	        	}

        };
        
       
        

        $scope.cancelTicket = function () {
        		$location.path('/tickets');
        };

        $scope.loadAllSites = function () {
            SiteComponent.findAll().then(function (data) {
                // $scope.selectedSite = null;
                $scope.sites = data;
            });
        };

       

        $scope.refreshPage = function(){
               $scope.clearFilter();
               $scope.search();
        }


        $scope.loadSites = function () {
            SiteComponent.findAll().then(function (data) {
                $scope.sites = data;
                $scope.loadingStop();
            });
        };

        $scope.loadEmployees = function () {
                $scope.searchCriteria.siteId = $scope.selectedSite.id;
                EmployeeComponent.search($scope.searchCriteria).then(function (data) {
                    $scope.selectedEmployee = null;
                $scope.employees = data.transactions;

            });
        };



          $scope.loadselectedSite = function() {
           var sId = parseInt($stateParams.id);
            JobComponent.getTicketDetails(sId).then(function (data) {
                var siteId = parseInt(data.siteId);
                $scope.selectedSite(siteId);

                
            });
            
        };
        
        $scope.selectedSite = function(siteId) {
          
            SiteComponent.findOne(siteId).then(function (data) {
                   var data = parseInt(data);
               var selectedSite = {id : data.siteId,name : data.siteName};
                console.log("Sites==" + selectedSite);
                
                
            });
        };

        $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
        }

         $scope.editTicket = function(){
            var tId =parseInt($stateParams.id);
            JobComponent.getTicketDetails(tId).then(function(data){
                $scope.loadingStop();
                console.log("Ticket details==" + JSON.stringify(data));
                $scope.tickets=data;
                $scope.tickets.title = $scope.tickets.title;
                $scope.tickets.description = $scope.tickets.description;
                $scope.selectedSite = {id : data.siteId,name : data.siteName};
                $scope.selectedEmployee = {id : data.employeeId,name : data.employeeName};
                $scope.tickets.severity = $scope.tickets.severity;
                $scope.tickets.comments = $scope.tickets.comments;
                $scope.tickets.status = $scope.tickets.status;

              
            });
        };
        
        $scope.viewTicket = function(id){
            var tId =parseInt(id);

            JobComponent.getTicketDetails(tId).then(function(data){
                console.log("Ticket details List==" + JSON.stringify(data));
                var tlist= data;
                $scope.listId = tlist.id;
                $scope.listTitle = tlist.title;
                $scope.listDescription = tlist.description;
                $scope.listSite = tlist.siteName;
                $scope.listEmployee = tlist.employeeName;
                $scope.listSeverity = tlist.severity;
                $scope.listComments = tlist.comments;
                $scope.listCreatedBy = tlist.created_by;
                $scope.listCreatedDate = tlist.created_date;
                $scope.listStatus = tlist.status;

              
            });
        };


        $scope.updatedTicket = function () {
        	$scope.error = null;
        	$scope.success = null;
        	$scope.errorProject = null;
        	if(!$scope.selectedSite.id){
                    $scope.errorSite = "true";
                }else{
        	    console.log("update ticket");
        	    $scope.tickets.title = $scope.tickets.title;
                $scope.tickets.description = $scope.tickets.description;
                $scope.tickets.site = $scope.siteName;
                $scope.tickets.employee = $scope.employeeName; 
                $scope.tickets.severity = $scope.tickets.severity;
                $scope.tickets.comments = $scope.tickets.comments;
                $scope.tickets.createdBy = $scope.tickets.created_by;
                $scope.tickets.createdDate = $scope.tickets.created_date;
                $scope.tickets.status = $scope.tickets.status;
                console.log('Tickets - ' + JSON.stringify($scope.tickets));
	        	JobComponent.updateTicket($scope.tickets).then(function() {
	                $scope.success = 'OK';
	                $scope.showNotifications('top','center','success','Ticket updated');
                    $scope.search();
                    $location.path('/tickets');
	            }).catch(function (response) {
	                $scope.success = null;
	                // console.log('Error - '+ response.data);
	                // console.log('status - '+ response.status + ' , message - ' + response.data.message);

	                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
	                	$scope.$apply(function() {
	                        $scope.errorTicketsExists = 'ERROR';
	                		$scope.success = 'OK';
                            $scope.showNotifications('top','center','danger','Ticket Already Exists');
	                	})
	                    console.log($scope.errorTicketsExists);
	                } else {
	                    $scope.error = 'ERROR';
	                }
	            });;
        	}
        };

            $scope.closeTicket = function (ticket){
                
                $scope.cTicket={id :ticket,status :'Closed'};
            }

            $scope.closeTicketConfirm =function(cTicket){
                
            JobComponent.updateTicket(cTicket).then(function() {
                    $scope.success = 'OK';
                    $scope.showNotifications('top','center','success','Ticket status updated');
                    $(".fade").removeClass("modal-backdrop");
                    $state.reload();        
                });        
            }
       

        $scope.deleteConfirm = function (ticket){
        	$scope.confirmTicket = ticket;
        }

        $scope.deleteTicket = function (ticket) {
        	JobComponent.deleteTicket($scope.confirmTicket);
        	$scope.success = 'OK';
        	$state.reload();
        };

        var that =  $scope;

        $scope.openCalendar = function(e,cmp) {
            e.preventDefault();
            e.stopPropagation();

            that.calendar[cmp] = true;
        };



        $scope.search = function () {
        	var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
        	if(!$scope.searchCriteria) {
            	var searchCriteria = {
            			currPage : currPageVal
            	}
            	$scope.searchCriteria = searchCriteria;
        	}

        	$scope.searchCriteria.currPage = currPageVal;
        	console.log('Selected  filters' + JSON.stringify($scope.selectedSite) +" , "+ $scope.selectedEmployee
                +" , "+ $scope.selectedTitle+" , "+ $scope.selectedDescription);
        	console.log('search criteria - '+JSON.stringify($rootScope.searchCriteriaTicket));

        	if(!$scope.selectedTitle && !$scope.selectedDescription && !$scope.selectedSite && !$scope.selectedEmployee) {
        		if($rootScope.searchCriteriaTicket) {
            		$scope.searchCriteria = $rootScope.searchCriteriaTicket;
        		}else {
        			$scope.searchCriteria.findAll = true;
        		}
        	}else if($scope.selectedTitle || $scope.selectedDescription || $scope.selectedSite || $scope.selectedEmployee) {
        		$scope.searchCriteria.findAll = false;
	        	if($scope.selectedTitle) {
		        	$scope.searchCriteria.ticketTitle = $scope.selectedTitle;
		    
	        	}else {
	        		$scope.searchCriteria.ticketTitle = '';
	        	}

                if($scope.selectedDescription) {
                    $scope.searchCriteria.ticketDescription = $scope.selectedDescription;
            
                }else {
                    $scope.searchCriteria.ticketDescription = '';
                }

	        	if($scope.selectedSite) {
		        	$scope.searchCriteria.siteId = $scope.selectedSite.id;
		        	if(!$scope.searchCriteria.siteId) {
		        		$scope.searchCriteria.siteName = $scope.selectedSite.name;
		        		console.log('selected site name ='+ $scope.selectedSite.id + ', ' +$scope.searchCriteria.siteName);
		        	}else {
			        	$scope.searchCriteria.siteName = $scope.selectedSite.name;
		        	}
		        	console.log('selected site id ='+ $scope.searchCriteria.siteId);
	        	}else {
	        		$scope.searchCriteria.siteId = 0;
	        	}

                if($scope.selectedEmployee) {
                    $scope.searchCriteria.employeeId = $scope.selectedEmployee.id;
                    if(!$scope.searchCriteria.employeeId) {
                        $scope.searchCriteria.employeeName = $scope.selectedEmployee.name;
                        console.log('selected employee name ='+ $scope.selectedEmployee + ', ' +$scope.searchCriteria.employeeName);
                    }else {
                        $scope.searchCriteria.employeeName = $scope.selectedEmployee.name;
                    }
                    console.log('selected employee id ='+ $scope.searchCriteria.employeeId);
                }else {
                    $scope.searchCriteria.employeeId = 0;
                }

        	}
            
        	console.log('criterias -' + JSON.stringify($scope.searchCriteria));
        	JobComponent.searchTickets($scope.searchCriteria).then(function (data) {
                $scope.tickets = data;
                $scope.ticketsLoader = true;
                $scope.loadingStop();
                console.log('Ticket List -' + JSON.stringify($scope.tickets));
                $scope.tickets.forEach(function(ticket){
                		console.log('ticket status - ' + ticket.status);
                })
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                
                $scope.numberArrays = [];
                var startPage = 1;
                if(($scope.pages.totalPages - $scope.pages.currPage) >= 10) {
                		startPage = $scope.pages.currPage;
                }else if($scope.pages.totalPages > 10) {
                		startPage = $scope.pages.totalPages - 10;
                }
                var cnt = 0;
                for(var i=startPage; i<=$scope.pages.totalPages; i++){
                		cnt++;
                		if(cnt <= 10) {
	                		$scope.numberArrays.push(i);
                		}
                }

                if($scope.jobs && $scope.tickets.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.tickets.length;
                    $scope.totalCountPages = data.totalCount;

                    if($scope.showCurrPage != data.totalPages){
                    	$scope.pageStartIntex =  (data.currPage - 1) * $scope.pageSort + 1; // 1 to // 11 to

                        $scope.pageEndIntex = $scope.pageEntries * $scope.showCurrPage; // 10 entries of 52 // 10 * 2 = 20 of 52 entries

                    }else if($scope.showCurrPage === data.totalPages){
                    	$scope.pageStartIntex =  (data.currPage - 1) * $scope.pageSort + 1;
                    	$scope.pageEndIntex = $scope.totalCountPages;
                    }
                }
                
                if($scope.tickets == null){
                    $scope.pages.startInd = 0;
                }else{
                    $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
                }

                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
                $scope.pages.totalCnt = data.totalCount;
            	$scope.hide = true;
            });
        	$rootScope.searchCriteriaTicket = $scope.searchCriteria;
        	if($scope.pages.currPage == 1) {
            	$scope.firstStyle();
        	}
        };
        
       

        $scope.clickNextOrPrev = function(number){
	        	$scope.pages.currPage = number;
	        	$scope.search();
	    }
        

        $scope.first = function() {
        	if($scope.pages.currPage > 1) {
            	$scope.pages.currPage = 1;
            	$scope.firstStyle();
            	$scope.search();
        	}
        };

        $scope.firstStyle = function() {
         var first = document.getElementById('#first');
       	 var ele = angular.element(first);
    	 ele.addClass('disabledLink');
         var previous = document.getElementById('#previous');
    	 ele = angular.element(previous);
    	 ele.addClass('disabledLink');
    	 if($scope.pages.totalPages > 1) {
             var nextTicketPage = document.getElementById('#next');
 	       	 var ele = angular.element(next);
	    	 ele.removeClass('disabledLink');
             var lastTicketPage = document.getElementById('#lastTicketPage');
	    	 ele = angular.element(lastTicketPage);
	    	 ele.removeClass('disabledLink');
    	 }

        }

        $scope.previous = function() {
            console.log("Calling previous")

            if($scope.pages.currPage > 1) {
            	$scope.pages.currPage = $scope.pages.currPage - 1;
	    		$scope.search();
            	if($scope.pages.currPage == 1) {
                    var first = document.getElementById('#first');
	       	       	 var ele = angular.element(first);
	    	    	 ele.addClass('disabled');
                    var previous = document.getElementById('#previous');
	    	    	 ele = angular.element(previous);
	    	    	 ele.addClass('disabled');
            	}
                var next = document.getElementById('#next');
     	       	 var ele = angular.element(next);
    	    	 ele.removeClass('disabled');
                var lastTicketPage = document.getElementById('#last');
    	    	 ele = angular.element(last);
    	    	 ele.removeClass('disabled');
        	}

        };

        $scope.next = function() {
            console.log("Calling next")

            if($scope.pages.currPage < $scope.pages.totalPages) {
            	$scope.pages.currPage = $scope.pages.currPage + 1;
	    		$scope.search();
            	if($scope.pages.currPage == $scope.pages.totalPages) {
            	    var next = document.getElementById('#next');
	       	       	 var ele = angular.element(next);
	    	    	 ele.addClass('disabled');
                    var last = document.getElementById('#last');
	    	    	 ele = angular.element(last);
	    	    	 ele.addClass('disabled');
            	}
                var first = document.getElementById('#first')
                var ele = angular.element(first);
    	    	 ele.removeClass('disabled');
                var previous = document.getElementById('#previous')
                ele = angular.element(previous);
    	    	 ele.removeClass('disabled');
        	}

        };

        $scope.last = function() {
            console.log("Calling last")
        	if($scope.pages.currPage < $scope.pages.totalPages) {
            	$scope.pages.currPage = $scope.pages.totalPages;
            	$scope.search();
            	if($scope.pages.currPage == $scope.pages.totalPages) {
                    var next = document.getElementById('#next');
            	    var ele = angular.element(next);
	    	    	 ele.addClass('disabled');
                    var last = document.getElementById('#last');
                    ele = angular.element(last);
	    	    	 ele.addClass('disabled');
            	}
                var first = document.getElementById('#first');
      	       	var ele = angular.element(first);
    	    	ele.removeClass('disabled');
                var previous = document.getElementById('#previous');
    	    	ele = angular.element(previous);
    	    	ele.removeClass('disabled');
        	}

        };

        $scope.clearFilter = function() {
        	$scope.selectedTicket = null;
        	$scope.selectedProject = null;
        	$scope.searchCriteria = {};
        	$rootScope.searchCriteriaTicket = null;
        	$scope.pages = {
        		currPage: 1,
        		totalPages: 0
        	}
        	//$scope.search();
        };


        // Datatable
        $scope.initDataTables = function(){

            console.log("Data tables function")

            $('#datatables').DataTable({
                "pagingType": "full_numbers",
                "lengthMenu": [
                    [10, 25, 50, -1],
                    [10, 25, 50, "All"]
                ],
                responsive: true,
                language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Search records",
                }

            });


            var table = $('#datatables').DataTable();

            // Edit record
            table.on('click', '.edit', function() {
                $tr = $(this).closest('tr');

                var data = table.row($tr).data();
                alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
            });

            // Delete a record
            table.on('click', '.remove', function(e) {
                $tr = $(this).closest('tr');
                table.row($tr).remove().draw();
                e.preventDefault();
            });

            //Like record
            table.on('click', '.like', function() {
                alert('You clicked on Like button');
            });

            $('.card .material-datatables label').addClass('form-group');

        }

      //init load
        $scope.initLoad = function(){ 
             $scope.loadPageTop(); 
             $scope.loadSites();
             $scope.loadEmployees();
             $scope.loadselectedSite();
          
         }

       //Loading Page go to top position
        $scope.loadPageTop = function(){
            //alert("test");
            //$("#loadPage").scrollTop();
            $("#loadPage").animate({scrollTop: 0}, 2000);
        }

        // Page Loader Function

        $scope.loadingStart = function(){ $('.pageCenter').show();$('.overlay').show();}
        $scope.loadingStop = function(){
            
            console.log("Calling loader");
            $('.pageCenter').hide();$('.overlay').hide();
                    
        }
    });
