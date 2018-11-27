'use strict';

angular.module('timeSheetApp')
    .controller('TicketController', function ($rootScope, $scope,
     $state, $timeout,ProjectComponent, SiteComponent,JobComponent,
     EmployeeComponent,TicketComponent,$http,
     $stateParams,$location,PaginationComponent,$filter,AssetComponent,getLocalLocation,getLocalStorage,$interval) {
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
        $scope.btnDisable = false;

        //$timeout(function (){angular.element('[ng-model="name"]').focus();});

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

         $rootScope.initScrollBar();

        $('input#dateFilterFrom').on('dp.change', function(e){
            $scope.selectedDateFromSer= e.date._d;
            $scope.selectedDateFrom= $filter('date')(e.date._d, 'dd/MM/yyyy');
            if($scope.selectedDateFromSer > $scope.selectedDateToSer) {
                $scope.selectedDateToSer=null;
                scope.selectedDateTo=null;
            }
        });
        $('input#dateFilterTo').on('dp.change', function(e){
            $scope.selectedDateToSer= e.date._d;
            $scope.selectedDateTo= $filter('date')(e.date._d, 'dd/MM/yyyy');
            if($scope.selectedDateFromSer > $scope.selectedDateToSer) {
                 $scope.selectedDateFromSer = null;
                 $scope.selectedDateFrom = null;
            }

        });

        $scope.initCalender();

        $scope.keyPressHandler = function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                e.stopPropagation();
            }
        }



        //Conformation modal

        $scope.conform = function(text)
        {
            console.log($scope.selectedProject)
            $rootScope.conformText = text;
            $('#conformationModal').modal();

        }
        $rootScope.back = function (text) {
            if(text == 'cancel')
            {
                /** @reatin - retaining scope value.**/
                $rootScope.retain=1;
                $scope.cancelTicket();
            }
            else if(text == 'save')
            {
                $scope.saveTicket();
            }
            else if(text == 'update')
            {
                /** @reatin - retaining scope value.**/
                $rootScope.retain=1;
                $scope.updatedTicket()
            }
        };

        //

        $scope.saveTicket = function () {
            console.log("Form submited")
            $scope.saveLoad = true;
                $scope.error = null;
                $scope.success = null;
                $scope.errorTicketsExists = null;
                $scope.errorSite = null;
                if(!$scope.selectedSite){
                    $scope.errorSite = true;
                }else{
                    $scope.btnDisable = true;
                    $scope.tickets.title = $scope.tickets.title;
                    $scope.tickets.description = $scope.tickets.description;
                    $scope.tickets.siteId = $scope.selectedSite.id;
                    $scope.tickets.employeeId = $scope.selectedEmployee.id;
                    $scope.tickets.severity = $scope.tickets.severity;
                    $scope.tickets.comments = $scope.tickets.comments;
                    $scope.tickets.remarks = $scope.tickets.remarks;
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
                    		$scope.saveLoad = false;
                        $scope.showNotifications('top','center','success','Ticket has been added successfuly!!');
                        $scope.selectedSite = null;
                        //$scope.loadTickets();
                        $location.path('/tickets');
                    }).catch(function (response) {
                        $scope.success = null;
                        $scope.saveLoad = false;
                        $scope.btnDisable = false;
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

             }if($scope.status == 2){

                 $location.path('/view-quotation/'+ $scope.qid);

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
                //
                        for(var i=0;i<$scope.projects.length;i++)
                        {
                            $scope.uiClient[i] = $scope.projects[i].name;
                        }
                        $scope.clientDisable = false;
                        $scope.clientFilterDisable = false;
            });
        };

        // Load Clients for selectbox //
        $scope.siteSpin = false;
        $scope.clientFilterDisable = true;
        $scope.uiClient = [];
        $scope.getClient = function (search) {
            var newSupes = $scope.uiClient.slice();
            if (search && newSupes.indexOf(search) === -1) {
                newSupes.unshift(search);
            }

            return newSupes;
        }
        //
        // Load Sites for selectbox //
        $scope.siteDisable = true;
        $scope.uiSite = [];
        $scope.siteFilterDisable = true;
        $scope.getSite = function (search) {
            var newSupes = $scope.uiSite.slice();
            if(search){
              if (search && newSupes.indexOf(search) === -1) {
                  newSupes.unshift(search);
              }
            }
            return newSupes;
        }
        //

        // Load Status for selectbox //
        $scope.statusFilterDisable = true;
        $scope.uiStatus = [];

        $scope.getStatus= function (search) {
            var newSupes = $scope.uiStatus.slice();
            if(search){
              if (search && newSupes.indexOf(search) === -1) {
                  newSupes.unshift(search);
              }
            }
            return newSupes;
        }

        //
        // Load Sites for selectbox //
        $scope.employeeFilterDisable = true;
        $scope.uiEmployee = [];

        $scope.getEmp = function (search) {
            var newSupes = $scope.uiEmployee.slice();
            if(search){
               if (search && newSupes.indexOf(search) === -1) {
                   newSupes.unshift(search);
               }
            }
            return newSupes;
        }

        //
        //

        $scope.loadSearchProject = function (searchProject) {
            $scope.clearField = false;
            $scope.hideSite = false;
            $scope.siteSpin = true;
            $scope.hideEmp = false;
            $scope.hideStatus=false;
            $scope.uiSite.splice(0,$scope.uiSite.length);
            $scope.searchProject = $scope.projects[$scope.uiClient.indexOf(searchProject)]
        }
        $scope.loadSearchSite = function (searchSite) {
            $scope.hideEmp = false;
            $scope.empSpin = true;
            $scope.hideSite = true;
            $scope.hideStatus=false;
            $scope.uiEmployee.splice(0,$scope.uiEmployee.length);
            $scope.searchSite = $scope.sites[$scope.uiSite.indexOf(searchSite)]
            console.log($scope.uiEmployee)
        }

        $scope.loadSearchStatus = function (searchStatus) {
             $scope.hideStatus = true;
            $scope.clearField = false;
            $scope.searchStatus = $scope.ticketStatuses[$scope.uiStatus.indexOf(searchStatus)]
        }


        $scope.loadSearchEmployee = function (searchEmployee) {
             $scope.hideStatus = true;
            if(searchEmployee){
               console.log(searchEmployee)
               $scope.hideEmp = true;
               $scope.clearField = false;
               $scope.searchEmployee = $scope.employees[$scope.uiEmployee.indexOf(searchEmployee)];
            }

        }
        //


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
                     //
                         if($scope.employees){
                             for(var i=0;i<$scope.employees.length;i++)
                             {
                                 $scope.uiEmployee[i] = $scope.employees[i].name;
                             }
                         }

                         $scope.employeeFilterDisable = false;
                         $scope.empSpin = false;

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

                //

                for(var i=0;i<$scope.sites.length;i++)
                {
                    $scope.uiSite[i] = $scope.sites[i].name;
                }
                $scope.siteFilterDisable = false;
                $scope.siteSpin = false;
                //
            });
        };

        $scope.loadFilterEmployee = function()
        {
            $scope.empSpin = true;
            $scope.employeeFilterDisable = true;
            if( $scope.searchProject || $scope.searchSite)
            {
                if($scope.searchProject){
                    $scope.searchCriteria.projectId = $scope.searchProject.id;
                }else{
                    $scope.searchCriteria.projectId = null;
                }
                if($scope.searchSite){
                    $scope.searchCriteria.siteId = $scope.searchSite.id;
                }else{
                   $scope.searchCriteria.siteId = null;
                }

                console.log('Employee Load',$scope.searchCriteria);
                EmployeeComponent.search($scope.searchCriteria).then(function (data) {
                    $scope.selectedEmployee = null;
                    $scope.employees = data.transactions;
                    //
                    if($scope.employees){
                        for(var i=0;i<$scope.employees.length;i++)
                        {
                            $scope.uiEmployee[i] = $scope.employees[i].name;
                        }
                    }
                    $scope.employeeFilterDisable = false;
                    $scope.empSpin = false;
                });

            }
            else{
                    EmployeeComponent.findAll().then(function (data) {
                        console.log(data)
                        $scope.employees = data;
                        //
                        if($scope.employees){
                            for(var i=0;i<$scope.employees.length;i++)
                            {
                                $scope.uiEmployee[i] = $scope.employees[i].name;
                            }
                        }
                        $scope.employeeFilterDisable = false;
                        $scope.empSpin = false;
                    })
            }
        }


        $scope.loadEmployees = function () {
           if($scope.selectedSite){
                   $scope.searchCriteria.siteId = $scope.selectedSite.id;
                   $scope.searchCriteria.list = true;
                   $scope.searchCriteria.module = 'Ticket';
                   $scope.searchCriteria.action = 'Add';
                   EmployeeComponent.search($scope.searchCriteria).then(function (data) {
                       //$scope.selectedEmployee = null;
                   $scope.employees = data.transactions;
                   console.log('Site based employees -- ',$scope.employees);
               });
           }
        };

        $scope.loadAssets = function() {
            if($scope.selectedSite){
               $scope.searchCriteria.siteId = $scope.selectedSite.id;
                AssetComponent.search($scope.searchCriteria).then(function(data) {
                    console.log('Asset based tickets -- ',data);
                    $scope.assets = data.transactions;
                });
            }

        };


          $scope.loadselectedSite = function() {
           var sId = parseInt($stateParams.id);
            JobComponent.getTicketDetails(sId).then(function (data) {
                //var siteId = parseInt(data.siteId);
                //$scope.selectedSite(siteId);
                $scope.sites = data;


            });

        };

        /*$scope.selectedSite = function(siteId) {

            SiteComponent.findOne(siteId).then(function (data) {
                   var data = parseInt(data);
               var selectedSite = {id : data.siteId,name : data.siteName};
                console.log("Sites==" + selectedSite);


            });
        };*/

        $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
        }

         $scope.editTicket = function(){
         if(parseInt($stateParams.id) > 0){
            var tId =parseInt($stateParams.id);
            $scope.status =$stateParams.status;
            $scope.qid =$stateParams.qid;
            if(tId){

                JobComponent.getTicketDetails(tId).then(function(data){
                    $scope.loadingStop();
                    console.log("Ticket details==" + JSON.stringify(data));
                    $scope.tickets=data;
                    if(!$scope.tickets){
                       $location.path('/tickets');
                    }
                    $scope.tickets.title = $scope.tickets.title;
                    $scope.tickets.description = $scope.tickets.description;
                    $scope.tickets.pendingAtUDS = true;
                    $scope.selectedSite = {id : data.siteId,name : data.siteName};
                    $scope.selectedEmployee = {id : data.assignedToId,name : data.assignedToName};
                    $scope.tickets.severity = $scope.tickets.severity;
                    $scope.tickets.comments = $scope.tickets.comments;
                    $scope.tickets.remarks = $scope.tickets.remarks;
                    $scope.tickets.status = $scope.tickets.status;
                    $scope.loadAssets();
                    $scope.loadEmployees();
                    if($scope.tickets){

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
                                    $scope.extension = response.split('.').pop();
                                    $scope.ticketImage = response;
                            })
                        }


                    }

                }).catch(function(){
                    $location.path('/tickets');
                    $scope.loadingStop();

                });

            }else{

                $location.path('/tickets');
            }
          }else{
             $location.path('/tickets');
          }
        };

        $scope.viewTicket = function(id){
            var tId =parseInt(id);
         if(tId){

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
                $scope.listRemarks = tlist.remarks;
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
                            $scope.extension = response.split('.').pop();
                            $scope.ticketImage = response;
                    })
                }else{
                	// $scope.ticketImage = "#";
                    $scope.ticketImage = null;
                }

            });

         }else{
            $location.path('/tickets');
         }

        };

//        $scope.close = function() {
//        	$scope.ticketImage = "#";
//        }


        $scope.loadTicketImage = function(image,qId) {
            var eleId = 'ticketImage';
            var ele = document.getElementById(eleId);
            ele.setAttribute('src',image);
        };


        $scope.updatedTicket = function () {
            $scope.saveLoad = true;
            $scope.error = null;
            $scope.success = null;
            $scope.errorProject = null;
            if(!$scope.selectedSite){
                    $scope.errorSite = "true";
                }else{
                $scope.btnDisable = true;
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
                $scope.tickets.remarks = $scope.tickets.remarks;
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
                            $scope.saveLoad = false;
                            //$(".fadeInDown").setAttribute("aria-hidden", "false");
                            $scope.showNotifications('top','center','success','Ticket has been updated successfuly!!');
                            //$scope.search();
                            $location.path('/tickets');


                }).catch(function (response) {
                    $scope.success = null;
                    $scope.saveLoad = false;
                    $scope.btnDisable = false;
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
                $scope.loadingStart();
                JobComponent.updateTicket(cTicket).then(function(response) {
                    $scope.loadingStop();
                    console.log("Error saving ticket");
                    console.log(response);
                    if(response.errorStatus){
                        $scope.success = null;
                        $scope.error = 'ERROR';
                        $(".fade").removeClass("modal-backdrop");
                        $('#closeTicket').modal('hide');
                        $scope.showNotifications('top','center','danger',response.errorMessage);
                    }else{
                        $scope.success = 'OK';
                        $scope.showNotifications('top','center','success','Ticket status has been updated successfuly!!');
                        $(".fade").removeClass("modal-backdrop");
                        $('#closeTicket').modal('hide');
                        $state.reload();
                    }
                }).catch(function(response){
                    $scope.success = null;
                    $scope.loadingStop();
                    $(".fade").removeClass("modal-backdrop");
                    $('#closeTicket').modal('hide');
                    console.log("Error saving ticket");
                    console.log(response);
                    if(response.errorStatus){
                        $scope.error = 'ERROR';
                        $scope.showNotifications('top','center','danger',response.errorMessage);
                    }else{
                        $scope.showNotifications('top','center','danger',response.message);
                    }

                });
            }

            $scope.addRemarksId = function(ticketId,remarks){
            		$scope.ticketRemarksId = ticketId;
            		$scope.ticketRemarks = remarks;
            };

            $scope.addRemarks = function(remarks){
            		console.log("remarks clicked");
            		console.log($scope.ticketRemarksId);
            		AttendanceComponent.addRemarks($scope.attendanceRemarksId,remarks).then(function (data) {
            			$scope.showNotifications('top','center','success','Remarks Added to the attendance');
            			console.log(data);
            			// $scope.showNotifications('top','center','danger','Site Already Exists');
            			$scope.search();
            		})
            };

            $scope.reopenTicket = function (ticket){

                $scope.cTicket={id :ticket,status :'Reopen'};
            }

            $scope.reopenTicketConfirm =function(cTicket){
                    $scope.loadingStart();
            		JobComponent.updateTicket(cTicket).then(function() {
                    $scope.loadingStop();
                    $scope.success = 'OK';
                    $scope.showNotifications('top','center','success','Ticket status has been updated successfuly!!');
                    $(".fade").removeClass("modal-backdrop");
                    $('#reopenModalNew').modal('hide');
                    $state.reload();

                });
            }

        $scope.closeModal = function () {
            $('#RightModal-view').modal('hide');
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

                    //
                    for(var i=0;i<$scope.ticketStatuses.length;i++)
                    {
                        $scope.uiStatus[i] = $scope.ticketStatuses[i];
                    }
                    console.log($scope.uiStatus )
                    $scope.statusFilterDisable = false;
                    $scope.statusSpin = false;
                    //

                })
        }


        $scope.isActiveAsc = '';
        $scope.isActiveDesc = 'id';

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
             $('.AdvancedFilterModal.in').modal('hide');
             $scope.clearField = false;
            // $scope.searchEmployee = null;
            // $scope.searchTitle = '';
            // $scope.searchDescription = '';
            // $scope.searchStatus = null;

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

            $scope.searchCriteria.isReport = true;

             if(!$scope.searchTitle && !$scope.searchDescription && !$scope.searchProject && !$scope.searchSite
                && !$scope.searchEmployee && !$scope.searchStatus && !$scope.selectedDateFrom && !$scope.selectedDateTo ) {
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

                if($scope.searchProject && $scope.searchProject.searchStatus != '0') {
                    $scope.searchCriteria.projectId = $scope.searchProject.id;
                    $scope.searchCriteria.projectName = $scope.searchProject.name;
                }else{
                    $scope.searchCriteria.projectId = null;
                }

                if($scope.searchSite && $scope.searchSite.searchStatus != '0') {
                    $scope.searchCriteria.siteId = $scope.searchSite.id;
                    $scope.searchCriteria.siteName = $scope.searchSite.name;
                }else{
                   $scope.searchCriteria.siteId = null;
                }

                if($scope.searchEmployee && $scope.searchEmployee.searchStatus != '0')
                {
                   $scope.searchCriteria.employeeId = $scope.searchEmployee.id;
                    $scope.searchCriteria.employeeName = $scope.searchEmployee.fullName;
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




            /* Localstorage (Retain old values while edit page to list) start */

            if($rootScope.retain == 1){
                $scope.localStorage = getLocalStorage.getSearch();
                console.log('Local storage---',$scope.localStorage);

                if($scope.localStorage){
                    $scope.filter = true;
                    $scope.pages.currPage = $scope.localStorage.currPage;
                    $scope.searchProject = {searchStatus:'0',id:$scope.localStorage.projectId,name:$scope.localStorage.projectName};
                    $scope.searchSite = {searchStatus:'0',id:$scope.localStorage.siteId,name:$scope.localStorage.siteName};
                    $scope.searchEmployee = {searchStatus:'0',id:$scope.localStorage.employeeId,name:$scope.localStorage.employeeName};

                }

                $rootScope.retain = 0;

                var searchCriteras  = $scope.localStorage;
            }else{

                var searchCriteras  = $scope.searchCriteria;
            }

            /* Localstorage (Retain old values while edit page to list) end */


            JobComponent.searchTickets(searchCriteras).then(function (data) {
                $scope.tickets = data.transactions;
                $scope.ticketsLoader = true;
                $scope.loadingStop();
                console.log('Ticket List -' + JSON.stringify($scope.tickets));


                /** retaining list search value.**/
                getLocalStorage.updateSearch(searchCriteras);


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
                    $scope.tickets.forEach(function(ticket){
                            console.log('ticket status - ' + ticket.status);
                    });
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
            $rootScope.exportStatusObj = {};
            $scope.exportStatusMap = [];
            $scope.downloader=false;
            $scope.downloaded = true;
        	$scope.noData = false;
            $scope.clearField = true;
            $scope.siteFilterDisable = true;
            $scope.sites = null;
            $scope.selectedDateFrom = $filter('date')(fromDate, 'dd/MM/yyyy');
            $scope.selectedDateTo = $filter('date')(new Date(), 'dd/MM/yyyy');
            // $scope.selectedDateFromSer = fromDate;
            // $scope.selectedDateToSer =  new Date();
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
            $scope.localStorage = null;
            $scope.filter = false;
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
            $scope.loadFilterEmployee();
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

        $scope.exportAllData = function(type){
            $rootScope.exportStatusObj = {};
            $scope.exportStatusMap = [];
            $scope.downloader=true;
            $scope.downloaded = false;
            $scope.searchCriteria.isReport = true;
            $scope.searchCriteria.exportType = type;
            $scope.searchCriteria.report = true;
            $scope.searchCriteria.columnName = "createdDate";
            $scope.searchCriteria.sortByAsc = false;
            $scope.typeMsg = type;

            console.log('calling ticket export api');
            TicketComponent.exportAllData($scope.searchCriteria).then(function(data){
                var result = data.results[0];
                console.log(result.file + ', ' + result.status + ',' + result.msg);
                var exportAllStatus = {
                        fileName : result.file,
                        exportMsg : 'Exporting All...',
                        url: result.url
                };
                $scope.exportStatusMap[0] = exportAllStatus;
                console.log('exportStatusMap size - ' + $scope.exportStatusMap.length);
                $scope.start();
              },function(err){
                  console.log('error message for export all ')
                  console.log(err);
          });
    };

    // store the interval promise in this variable
    var promise;

    // starts the interval
    $scope.start = function() {
      // stops any running interval to avoid two intervals running at the same time
      $scope.stop();

      // store the interval promise
      promise = $interval($scope.exportStatus, 5000);
      console.log('promise -'+promise);
    };

    // stops the interval
    $scope.stop = function() {
      $interval.cancel(promise);
    };

    $scope.exportStatusMap = [];
    $scope.exportStatus = function() {
        //console.log('empId='+$scope.empId);
        $rootScope.exportStatusObj = {};
        console.log('exportStatusMap length -'+$scope.exportStatusMap.length);
        angular.forEach($scope.exportStatusMap, function(exportStatusObj, index){
            if(!exportStatusObj.empId) {
                exportStatusObj.empId = 0;
            }
            TicketComponent.exportStatus(exportStatusObj.fileName).then(function(data) {
                if(data) {
                    exportStatusObj.exportStatus = data.status;
                    console.log('exportStatus - '+ exportStatusObj);
                    exportStatusObj.exportMsg = data.msg;
                    $scope.downloader=false;
                    console.log('exportMsg - '+ exportStatusObj.exportMsg);
                    if(exportStatusObj.exportStatus == 'COMPLETED'){
                        if(exportStatusObj.url) {
                            exportStatusObj.exportFile = exportStatusObj.url;
                        }else {
                            exportStatusObj.exportFile = data.file;
                        }
                        console.log('exportFile - '+ exportStatusObj.exportFile);
                        $scope.stop();
                    }else if(exportStatusObj.exportStatus == 'FAILED'){
                        $scope.stop();
                    }else if(!exportStatusObj.exportStatus){
                        $scope.stop();
                    }else {
                        exportStatuObj.exportFile = '#';
                    }
                }

            });
        });

    }

    $scope.exportFile = function(empId) {
        if(empId != 0) {
            var exportFile = '';
            angular.forEach($scope.exportStatusMap, function(exportStatusObj, index){
                if(empId == exportStatusObj.empId){
                    exportFile = exportStatusObj.exportFile;
                    return exportFile;
                }
            });
            return exportFile;
        }else {
            return ($scope.exportStatusMap[empId] ? $scope.exportStatusMap[empId].exportFile : '#');
        }
    }


    $scope.exportMsg = function(empId) {
            if(empId != 0) {
                var exportMsg = '';
                angular.forEach($scope.exportStatusMap, function(exportStatusObj, index){
                    if(empId == exportStatusObj.empId){
                        exportMsg = exportStatusObj.exportMsg;
                        return exportMsg;
                    }
                });
                return exportMsg;
            }else {
                return ($scope.exportStatusMap[empId] ? $scope.exportStatusMap[empId].exportMsg : '');
            }

    };

    $scope.downloaded = false;

    $scope.clsDownload = function(){
      $scope.downloaded = true;
      $rootScope.exportStatusObj = {};
      $scope.exportStatusMap = [];
    }


    });
