'use strict';

angular.module('timeSheetApp')
    .controller('TicketController', function ($rootScope, $scope,
     $state, $timeout,ProjectComponent, SiteComponent,JobComponent,
     EmployeeComponent,TicketComponent,$http,
     $stateParams,$location,PaginationComponent,$filter,AssetComponent,getLocalLocation) {
        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorTicketsExists = null;
        $scope.searchCriteria = {};
        $scope.selectedProject = null;
        $scope.selectedSite = null;
        $scope.selectedStatus = null;
        $scope.searchCriteria = {};
        $scope.selectedEmployee = null;
        $scope.pages = { currPage : 1};
        $scope.cTicket ={};
        var fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 30);
        $scope.selectedDateFrom = $filter('date')(fromDate, 'dd/MM/yyyy');
        $scope.selectedDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');
        //var d = new Date();
        //d.setFullYear(2018, 0, 1);
        $scope.selectedDateFromSer= fromDate;
        $scope.selectedDateToSer= new Date();
        $scope.pager = {};
        $scope.noData = false;
        $scope.searchEmployee = null;
        $scope.searchTitle = null;
        $scope.searchDescription = null;
        $scope.searchStatus = null;
        $scope.selectedAsset = {};

        $timeout(function (){angular.element('[ng-model="name"]').focus();});

        $scope.pages = { currPage : 1};

        $scope.selectedProject = null;

        $scope.selectedTicket = null;
        $scope.selectedImageFile;

        $scope.calendar = {
                start : false,
                end : false,
        };

        $scope.status = 0;


         //getLocalLocation.updateLocation($scope.searchCriteria); 

         //Read the Local locations from LocalStorage    
         //$scope.localSearch = getLocalStorage.getLocation();


        $scope.loadTickets = function(){
            $scope.clearFilter();
            $scope.search();
        }


        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();

        };
        $scope.showNotifications= function(position,alignment,color,msg){
                    demo.showNotification(position,alignment,color,msg);
                }

        $('input#dateFilterFrom').on('dp.change', function(e){
            console.log(e.date);
            console.log(e.date._d);
            $scope.selectedDateFromSer= e.date._d;

            $.notifyClose();

            if($scope.selectedDateFromSer > $scope.selectedDateToSer) {

                    $scope.showNotifications('top','center','danger','From date cannot be greater than To date');
                    $scope.selectedDateFrom =$filter('date')(new Date(), 'dd/MM/yyyy');
                    return false;
            }else {
               $scope.selectedDateFrom= $filter('date')(e.date._d, 'dd/MM/yyyy');
               // $scope.refreshReport();
            }



        });
        $('input#dateFilterTo').on('dp.change', function(e){
            console.log(e.date);
            console.log(e.date._d);
            $scope.selectedDateToSer= e.date._d;

            $.notifyClose();

            if($scope.selectedDateFromSer > $scope.selectedDateToSer) {
                    $scope.showNotifications('top','center','danger','To date cannot be lesser than From date');
                    $scope.selectedDateTo=$filter('date')(new Date(), 'dd/MM/yyyy');
                    return false;
            }else {
                $scope.selectedDateTo= $filter('date')(e.date._d, 'dd/MM/yyyy');
                //$scope.refreshReport();
            }

        });

        $scope.initCalender();

        $scope.keyPressHandler = function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                e.stopPropagation();
            }
        }

        $scope.saveTicket = function () {
            console.log("Form submited")
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
                    if($scope.selectedAsset) {
                    	$scope.tickets.assetId = $scope.selectedAsset.id;
                    }

                    if($scope.assetObj) {
                    	$scope.tickets.assetId = $scope.assetObj.id;
                    	$scope.tickets.siteId = $scope.assetObj.siteId;
                    }


                    console.log('Tickets - ' + JSON.stringify($scope.tickets));
                    JobComponent.createTicket($scope.tickets).then(function(response) {
                    		if($scope.selectedImageFile){
		                    	TicketComponent.upload(response.id,$scope.selectedImageFile)
							    .then(function(response) {
								console.log("ticket image uploaded",response);

							}).catch(function (response) {
								console.log("Failed to image upload",response);
							});
                    		}

                        $scope.success = 'OK';
                        $scope.showNotifications('top','center','success','Ticket has been added successfuly!!');
                        $scope.selectedSite = null;
                        //$scope.loadTickets();
                        $location.path('/tickets');
                    }).catch(function (response) {
                        $scope.success = null;
                        console.log('Error - '+ response.data);
                        console.log('status - '+ response.status + ' , message - ' + response.data.message);
                        if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                                $scope.errorTicketsExists = 'ERROR';
                            $scope.showNotifications('top','center','danger','Ticket already exists');

                            console.log($scope.errorTicketsExists);
                        } else {
                            $scope.showNotifications('top','center','danger','Unable to creating ticket. Please try again later..');
                            $scope.error = 'ERROR';
                        }
                    });
                }

        };


        $scope.cancelTicket = function () {
                            
             if($scope.status == 1){

                 $location.path('/assets');

             }else{

                $location.path('/tickets');
             }

            
        };

        $scope.loadAllSites = function () {
            SiteComponent.findAll().then(function (data) {
                // $scope.selectedSite = null;
                $scope.sites = data;
            });
        };



        $scope.refreshPage = function(){

               $scope.loadTickets();
        }

         $scope.loadProjects = function () {
            console.log("Loading all projects");
                    ProjectComponent.findAll().then(function (data) {
                $scope.projects = data;
            });
        };


        $scope.loadSites = function () {
            SiteComponent.findAll().then(function (data) {
                $scope.sites = data;
                $scope.loadingStop();
            });
        };

        if($stateParams.assetId) {
       	 AssetComponent.findById($stateParams.assetId).then(function(data) {
       		 console.log(data);
       		 if(data != null){
       			 $scope.assetObj = data;
       			 SiteComponent.findOne($scope.assetObj.siteId).then(function (data) {
                     $scope.siteObj = data;
                     $scope.selectedSite = $scope.siteObj;
                     $scope.searchCriteria.siteId = $scope.siteObj.id;
                     $scope.searchCriteria.list = true;
                     EmployeeComponent.search($scope.searchCriteria).then(function (data) {
                         $scope.selectedEmployee = null;
                     $scope.employees = data.transactions;
                     });

                 });
       		 };
       	 });
         $scope.status = 1;
        }

        $scope.loadDepSites = function () {

            if(jQuery.isEmptyObject($scope.selectedProject) == false) {
                   var depProj=$scope.selectedProject.id;
            }else if(jQuery.isEmptyObject($scope.searchProject) == false){
                    var depProj=$scope.searchProject.id;
            }else{
                    var depProj=0;
            }

            ProjectComponent.findSites(depProj).then(function (data) {
                $scope.searchSite = null;
                $scope.sites = data;
            });
        };

        $scope.loadEmployees = function () {
                $scope.searchCriteria.siteId = $scope.selectedSite.id;
                $scope.searchCriteria.list = true;
                EmployeeComponent.search($scope.searchCriteria).then(function (data) {
                    $scope.selectedEmployee = null;
                $scope.employees = data.transactions;
            });
        };

        $scope.loadAssets = function() {
        	$scope.searchCriteria.siteId = $scope.selectedSite.id;
        	AssetComponent.search($scope.searchCriteria).then(function(data) {
        		console.log(data);
        		$scope.assets = data.transactions;
        	});
        };


          $scope.loadselectedSite = function() {
           var sId = parseInt($stateParams.id);
            JobComponent.getTicketDetails(sId).then(function (data) {
                //var siteId = parseInt(data.siteId);
                //$scope.selectedSite(siteId);
                $scope.sites = data;


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
                $scope.tickets.pendingAtUDS = true;
                $scope.selectedSite = {id : data.siteId,name : data.siteName};
                $scope.selectedEmployee = {id : data.assignedToId,name : data.assignedToName};
                $scope.tickets.severity = $scope.tickets.severity;
                $scope.tickets.comments = $scope.tickets.comments;
                $scope.tickets.status = $scope.tickets.status;

                if($scope.tickets.siteId){
                    SiteComponent.findOne($scope.tickets.siteId).then(
                        function (response) {
                            console.log(response)
                        }
                    )
                }

                if($scope.tickets.assetId) {
                	AssetComponent.findById($scope.tickets.assetId).then(function(data) {
                		console.log(data);
                		$scope.selectedAsset = {id: data.id, title: data.title}
                	});
                }else{
                	var searchObj = {};
                	searchObj.siteId = $scope.tickets.siteId;
                	AssetComponent.search(searchObj).then(function(data) {
                		console.log(data);
                		$scope.assets = data.transactions;
                	});
                }

                if($scope.tickets.image){
                    console.log("image found");
                    TicketComponent.findTicketImage($scope.tickets.id,$scope.tickets.image).
	                    	then(function (response) {
	                        console.log(response);
	                        $scope.ticketImage = response;
                    })
                }
            });
        };

        $scope.viewTicket = function(id){
            var tId =parseInt(id);

            JobComponent.getTicketDetails(tId).then(function(data){
                console.log("Ticket details ==" + JSON.stringify(data));
                var tlist= data;
                $scope.listId = tlist.id;
                $scope.listTitle = tlist.title;
                $scope.listDescription = tlist.description;
                $scope.listSite = tlist.siteName;
                $scope.listEmployee = tlist.assignedToName;
                $scope.listSeverity = tlist.severity;
                $scope.listComments = tlist.comments;
                $scope.listCreatedBy = tlist.createdBy;
                $scope.listCreatedDate = tlist.createdDate;
                $scope.listStatus = tlist.status;
                $scope.listAssets = tlist.assetTitle;
                $scope.listJobId = tlist.jobId;
                if(tlist.pendingAtUDS){
                    $scope.listPendingStatus = "Pending at UDS"
                }else if(tlist.pendingAtClient){
                    $scope.listPendingStatus = "Pending at "+$scope.listSite;
                }else{
                    $scope.listPendingStatus = "Completed"
                }
                if(tlist.image){
                    console.log("image found");
                    TicketComponent.findTicketImage(tlist.id,tlist.image).
	                    	then(function (response) {
	                        console.log(response);
	                        $scope.ticketImage = response;
                    })
                }

            });
        };


        $scope.loadTicketImage = function(image,qId) {
            var eleId = 'ticketImage';
            var ele = document.getElementById(eleId);
            ele.setAttribute('src',image);
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
                if($scope.selectedSite) {
                    $scope.tickets.siteId = $scope.selectedSite.id;
                    $scope.tickets.siteName = $scope.selectedSite.name;
                }
                console.log('selected employee - ' + JSON.stringify($scope.selectedEmployee));
                if($scope.selectedEmployee) {
                    $scope.tickets.employeeId = $scope.selectedEmployee.id;
                    $scope.tickets.employeeName = $scope.selectedEmployee.name;
                }
                if($scope.selectedAsset) {
                	$scope.tickets.assetId = $scope.selectedAsset.id;
                }
                $scope.tickets.comments = $scope.tickets.comments;
                console.log('Tickets - ' + JSON.stringify($scope.tickets));
                JobComponent.updateTicket($scope.tickets).then(function(response) {
                		console.log('ticket updated successfuly');
	                	if($scope.selectedImageFile){
	                		console.log('ticket image found');
	                    	TicketComponent.upload(response.id,$scope.selectedImageFile)
						    .then(function(response) {
							console.log("ticket image uploaded",response);

						}).catch(function (response) {
							console.log("Failed to image upload",response);
						});
	            		}
                    $scope.success = 'OK';
                    //$(".fadeInDown").setAttribute("aria-hidden", "false");
                    $scope.showNotifications('top','center','success','Ticket has been updated successfuly!!');
                    //$scope.search();
                    $location.path('/tickets');
                }).catch(function (response) {
                    $scope.success = null;
                    // console.log('Error - '+ response.data);
                    // console.log('status - '+ response.status + ' , message -
                    // ' + response.data.message);

                    if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                        $scope.$apply(function() {
                            $scope.errorTicketsExists = 'ERROR';
                            $scope.success = 'OK';
                            $scope.showNotifications('top','center','danger','Ticket already exists');
                        })
                        console.log($scope.errorTicketsExists);
                    } else {
                        $scope.error = 'ERROR';
                        $scope.showNotifications('top','center','danger','Unable to updating ticket,please try again later.');
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
                    $scope.showNotifications('top','center','success','Ticket status has been updated successfuly!!');
                    $(".fade").removeClass("modal-backdrop");
                    $('#deleteModalNew').modal('hide');
                    $state.reload();
                });
            }

            $scope.reopenTicket = function (ticket){

                $scope.cTicket={id :ticket,status :'Reopen'};
            }

            $scope.reopenTicketConfirm =function(cTicket){

            		JobComponent.updateTicket(cTicket).then(function() {
                    $scope.success = 'OK';
                    $scope.showNotifications('top','center','success','Ticket status has been updated successfuly!!');
                    $(".fade").removeClass("modal-backdrop");
                    $('#reopenModalNew').modal('hide');
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


        $scope.loadTicketStatuses = function() {
                TicketComponent.loadTicketStatuses().then(function(data){
                    $scope.ticketStatuses = data;
                })
        }


        $scope.isActiveAsc = 'id';
        $scope.isActiveDesc = '';

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveAsc = field;
            $scope.isActiveDesc = '';
            $scope.isAscOrder = true;
            $scope.search();
            //$scope.loadTickets();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
            $scope.search();
            //$scope.loadTickets();
        }

        $scope.searchFilter = function () {
            $scope.setPage(1);
            $scope.search();
         }
         $scope.searchFilter1 = function () {
            $scope.searchEmployee = null;
            $scope.searchTitle = '';
            $scope.searchDescription = '';
            $scope.searchStatus = null;

            $scope.searchCriteria.ticketTitle ='';
            $scope.searchCriteria.ticketDescription ='';
            $scope.searchCriteria.employeeId =null;
            $scope.searchCriteria.ticketStatus =null;
            $scope.setPage(1);
            $scope.search();
         }


        $scope.search = function () {
            $scope.noData = false;
            var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
            if(!$scope.searchCriteria) {
                var searchCriteria = {
                        currPage : currPageVal
                }
                $scope.searchCriteria = searchCriteria;
            }

            $scope.searchCriteria.currPage = currPageVal;
            $scope.searchCriteria.findAll = false;

             if(!$scope.searchTitle && !$scope.searchDescription && !$scope.searchProject && !$scope.searchSite
                && !$scope.searchEmployee && !$scope.searchStatus) {
                $scope.searchCriteria.findAll = true;
            }

            if($scope.selectedDateFrom) {
                    $scope.searchCriteria.fromDate = $scope.selectedDateFromSer;
                }
                if($scope.selectedDateTo) {
                    $scope.searchCriteria.toDate = $scope.selectedDateToSer;
                }

                if($scope.searchTitle)
                {
                    $scope.searchCriteria.ticketTitle = $scope.searchTitle;
                    console.log('selected Title ='+ $scope.searchCriteria.ticketTitle);
                }else{
                    $scope.searchCriteria.ticketTitle = '';
                }
                if($scope.searchDescription)
                {
                    $scope.searchCriteria.ticketDescription = $scope.searchDescription;
                    console.log('selected ticket Description ='+ $scope.searchCriteria.ticketDescription);
                }else{
                    $scope.searchCriteria.ticketDescription = '';
                }

                if($scope.searchProject) {
                    $scope.searchCriteria.projectId = $scope.searchProject.id;

                }else{
                    $scope.searchCriteria.projectId = null;
                }

                if($scope.searchSite) {
                    $scope.searchCriteria.siteId = $scope.searchSite.id;
                }else{
                   $scope.searchCriteria.siteId = null;
                }

                if($scope.searchEmployee)
                {
                   $scope.searchCriteria.employeeId = $scope.searchEmployee.id;
                }else{
                    $scope.searchCriteria.employeeId =null;
                }

                if($scope.searchStatus)
                {

                   $scope.searchCriteria.ticketStatus = $scope.searchStatus;
                }else{
                    $scope.searchCriteria.ticketStatus = null;
                }


            console.log('search criterias - ',JSON.stringify($scope.searchCriteria));
            //-------
            if($scope.pageSort){
                $scope.searchCriteria.sort = $scope.pageSort;
            }

            if($scope.selectedColumn){

                $scope.searchCriteria.columnName = $scope.selectedColumn;
                $scope.searchCriteria.sortByAsc = $scope.isAscOrder;

            }
            /*else{
                $scope.searchCriteria.columnName ="id";
                $scope.searchCriteria.sortByAsc = true;
            }*/

               console.log("search criteria",$scope.searchCriteria);
                     $scope.tickets = '';
                     $scope.ticketsLoader = false;
                     $scope.loadPageTop();

            JobComponent.searchTickets($scope.searchCriteria).then(function (data) {
                $scope.tickets = data.transactions;
                $scope.ticketsLoader = true;
                $scope.loadingStop();
                console.log('Ticket List -' + JSON.stringify($scope.tickets));
                $scope.tickets.forEach(function(ticket){
                        console.log('ticket status - ' + ticket.status);
                });

                /*
                    ** Call pagination  main function **
                */
                 $scope.pager = {};
                 $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                 $scope.totalCountPages = data.totalCount;

                console.log("Pagination",$scope.pager);
                console.log('Ticket search result list -' + JSON.stringify($scope.tickets));
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;

                if($scope.tickets && $scope.tickets.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.tickets.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10;
                    $scope.noData = false;

                    }else{
                         $scope.noData = true;
                    }

            });

        };

        $scope.clearFilter = function() {
        	$scope.noData = false;	
            $scope.selectedDateFrom = $filter('date')(fromDate, 'dd/MM/yyyy');
            $scope.selectedDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');
            $scope.selectedDateFromSer = fromDate;
            $scope.selectedDateToSer =  new Date();
            $scope.selectedTicket = null;
            $scope.selectedProject = null;
            $scope.selectedEmployee = null;
            $scope.searchProject = null;
            $scope.searchSite = null;
            $scope.selectedStatus = null;
            $scope.searchEmployee = null;
            $scope.searchTitle = null;
            $scope.searchDescription = null;
            $scope.searchStatus = null;
            $scope.searchCriteria = {};
            $rootScope.searchCriteriaTicket = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            // $scope.search();
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

            // Like record
            table.on('click', '.like', function() {
                alert('You clicked on Like button');
            });

            $('.card .material-datatables label').addClass('form-group');

        }

      // init load
        $scope.initLoad = function(){
             $scope.loadPageTop();
             /*$scope.loadSites();
             $scope.loadEmployees();
             $scope.loadTicketStatuses();
             $scope.setPage(1);*/
             $scope.loadTickets();
             //$scope.loadselectedSite();

         }

    /*

    ** Pagination init function **
    @Param:integer

    */

        $scope.setPage = function (page) {

            if (page < 1 || page > $scope.pager.totalPages) {
                return;
            }
            //alert(page);
            $scope.pages.currPage = page;
            $scope.search();
        };
    });
