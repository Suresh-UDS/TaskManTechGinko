'use strict';

angular.module('timeSheetApp')
    .controller('PhotoManagementController', function ($scope, $state, $timeout, EmployeeComponent,CheckInOutComponent,$http,$stateParams,$location) {
       $scope.loadEmployees = function () {      
            EmployeeComponent.findAll().then(function (data) {
                $scope.employees = data;
            });
        };
        $rootScope.loginView = false;
        $scope.code = 0;
        $scope.page = 1
        $scope.totalPages = 0;
        $scope.ITEM_PER_PAGE=10;
        $scope.isAllSelected=false;
        $scope.loadEmployeesCheckInOut = function () {      
            $scope.code = $state.params.empCode;
            
            CheckInOutComponent.findAllByEmployeeId($state.params.empId,$scope.page).then(function (data) {

                $scope.details = data;
                $scope.totalPages=data.totalPages
                $scope.isAllSelected=false;
            });
        };
        
        $scope.deleteConfirm = function(trans){
        	
        	$scope.confirmTrans = trans;
        }
        $scope.checkSelected = function() {
        	 var ids = [];
             var transIds = [];
             var check=0;
             console.log($scope.details.transactions)
             $scope.details.transactions.forEach(function(trans){
                 if(trans.canDelete){
                	 check++;
                 	console.log(trans.canDelete)
                     if(trans.photoIn) ids.push(trans.photoIn)
                     if(trans.photoOut) ids.push(trans.photoOut)
                     transIds.push(trans.id);
                 }
             })
             console.log(ids);
             console.log(check);
             if(ids.length==0){
            	 console.log('check selected');
            	 $scope.notSelected = false;
            	 console.log($scope.notSelected);
            	 if(check>0){
                	 $scope.notAvail = true;
                	 console.log($scope.notAvail);
                	 console.log(check);
                	 check = 0;
                	 console.log(check);
                 }else{
                	 $scope.notAvail = false;
                 }
             }else{
            	 $scope.notSelected = true;
             }

        	
        }
        
        $scope.deleteSelected = function(){
            var ids = [];
            var transIds = [];
            console.log($scope.details.transactions)
            $scope.details.transactions.forEach(function(trans){
                if(trans.canDelete){
                	console.log(trans.canDelete)
                    if(trans.photoIn) ids.push(trans.photoIn)
                    if(trans.photoOut) ids.push(trans.photoOut)
                    transIds.push(trans.id);
                }
            })
            if(ids.length>0)            	$scope.deleteImages(ids,transIds);
            


        }
       
        $scope.deleteTransImage = function(){
            var ids = [] ;
            var transIds = [];
            console.log("delete photo");
            if($scope.confirmTrans.photoIn) ids.push($scope.confirmTrans.photoIn)
            if($scope.confirmTrans.photoOut) ids.push($scope.confirmTrans.photoOut)
            transIds.push($scope.confirmTrans.id);
            if(ids.length>0)  $scope.deleteImages(ids,transIds);
        }

         $scope.deleteImages=function(ids, transIds){
        	 var request = {
        		imageIds : ids,	 
        		transIds : transIds	 
        	 }
        	 console.log('request -' + JSON.stringify(request));
             $http({
                url:'/api/employee/' + $scope.code +'/checkInOut/image',
                method:'DELETE',
                data:request,
                headers:{'content-type':'application/json'}
                }).then(function (response) {
                    $scope.loadEmployeesCheckInOut();
                });
        }

        $scope.getImageUrl = function(ele,image) {
            if(image){
                var uri = '/api/employee/' + $scope.code +'/checkInOut/' + image;
                $http.get(uri).then(function (response) {
                    document.getElementById(image).setAttribute('src',response.data);
                });
            }
           
        };

        $scope.selectAll = function(value){
            $scope.details.transactions.forEach(function(trans){
            	console.log(trans);
                trans.canDelete = !trans.canDelete;
                console.log(trans.canDelete);
            })
        }
        $scope.first = function() {
            if($scope.page > 1) {
                $scope.page = 1;
                $scope.loadEmployeesCheckInOut();
            }
        };
        
       
        
        $scope.previous = function() {
            if($scope.page > 1) {
                $scope.page = $scope.page - 1;
                $scope.loadEmployeesCheckInOut();
            }
            
        };
        
        $scope.next = function() {
            if($scope.page < $scope.totalPages) {
                $scope.page = $scope.page + 1;
                $scope.loadEmployeesCheckInOut();
            }
            
        };
        
        $scope.last = function() {
            if($scope.page < $scope.totalPages) {
                $scope.page = $scope.totalPages;
                $scope.loadEmployeesCheckInOut();
            }
            
        };
        
        $scope.clearFilter = function() {
            $scope.pages[empId] = {
                currPage: 0,
                totalPages: 0
            } 
        };
        
        $scope.loadImages = function(employeeEmpId, photoInId, photoOutId) {
        	if(photoInId) {
	            var uri = '/api/employee/' + employeeEmpId +'/checkInOut/' + photoInId;
	            $http.get(uri).then(function (response) {
	                var ele = document.getElementById('photoInImg');
	                ele.setAttribute('src',response.data);
	            },function(response) {
                    var ele = document.getElementById('photoInImg');
                	ele.setAttribute('src',"//placehold.it/250x250");
                });
        	}else {
                var ele = document.getElementById('photoInImg');
            	ele.setAttribute('src',"//placehold.it/250x250");
        	}
        	if(photoOutId) {
	            uri = '/api/employee/' + employeeEmpId +'/checkInOut/' + photoOutId;
	            $http.get(uri).then(function (response) {
	                var ele = document.getElementById('photoOutImg');
	                ele.setAttribute('src',response.data);
	            },function(response) {
                    var ele = document.getElementById('photoOutImg');
                	ele.setAttribute('src',"//placehold.it/250x250");
                });
        	}else {
                var ele = document.getElementById('photoOutImg');
            	ele.setAttribute('src',"//placehold.it/250x250");
            }    
            
        };
        


    });

