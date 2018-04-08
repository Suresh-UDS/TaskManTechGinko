'use strict';

angular.module('timeSheetApp')
		    .controller(
				'AssetController',
				function($scope, $rootScope, $state, $timeout, AssetComponent,
						ProjectComponent, SiteComponent,EmployeeComponent, $http, $stateParams,
						$location) {
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;

        $scope.searchCriteria = {};
        $scope.pages = { currPage : 1};
        $scope.isEdit = !!$stateParams.id;

        console.log($stateParams)
                    var that =  $scope;

        $scope.calendar = {
            actualStart : false,
            actualEnd : false,
            plannedStart : false,
            plannedEnd : false,
        };

        $scope.openCalendar = function(e,cmp) {
            e.preventDefault();
            e.stopPropagation();

            that.calendar[cmp] = true;
        };

        $scope.initMaterialWizard = function(){

            demo.initMaterialWizard();


        }


        $scope.loadAllSites = function () {
            SiteComponent.findAll().then(function (data) {
                $scope.selectedSite = null;
                $scope.sites = data;
                $scope.loadingStop();
            });
        };

        $scope.initMaterialWizard();

        $scope.editAsset = function(){
        	AssetComponent.findById($stateParams.id).then(function(data){
        		$scope.asset=data;
        		console.log($scope.asset);
        		$scope.asset.selectedSite = {id : data.siteId,name : data.siteName}
        		console.log($scope.selectedSite)
        	})
        }
        $scope.loadAssets = function(){
        	$scope.search();
        };

        $scope.search = function () {
            var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
            var searchCriteria = {
                currPage : currPageVal
            }
            $scope.searchCriteria = searchCriteria;
            //}

            $scope.searchCriteria.currPage = currPageVal;
            console.log('Selected  project -' + $scope.selectedProject);
            console.log('Selected  job -' + $scope.selectedJob);
            console.log('search criteria - '+JSON.stringify($rootScope.searchCriteriaProject));

            console.log($scope.searchCriteria);
            AssetComponent.search().then(function (data) {
                console.log(data);
                $scope.assets = data;
                $scope.assetsLoader = true;
                $scope.loadingStop();
                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                if($scope.assets == null){
                    $scope.pages.startInd = 0;
                }else{
                    $scope.pages.startInd = (data.currPage - 1) * 10 + 1;
                }

                $scope.pages.endInd = data.totalCount > 10  ? (data.currPage) * 10 : data.totalCount ;
                $scope.pages.totalCnt = data.totalCount;

            });

            if($scope.pages.currPage == 1) {
                $scope.firstStyle();
            }
        };



        $scope.initPage=function (){

            $scope.loadAllSites();
        	if($scope.isEdit){
        	    console.log("edit asset")
        		$scope.editAsset();
        	}else {
        	}
        }



        $scope.saveAsset = function () {
        	$scope.error = null;
        	$scope.success =null;
        	if($scope.asset.selectedSite!=null){
        	    $scope.asset.siteId = $scope.asset.selectedSite.id;
        	    delete $scope.asset.selectedSite;
            }
        	console.log('asset details ='+ JSON.stringify($scope.asset));
        	//$scope.asset.assetStatus = $scope.selectedStatus.name;
        	var post = $scope.isEdit ? AssetComponent.update : AssetComponent.create
        	post($scope.asset).then(function () {
                $scope.success = 'OK';
            	$location.path('/assets');
            }).catch(function (response) {
                $scope.success = null;
                console.log('Error - '+ response.data);
                if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
                    $scope.errorProjectExists = 'ERROR';
                } else {
                    $scope.error = 'ERROR';
                }
            });;

        };


        $scope.refreshPage = function(){
                $scope.clearFilter();
                //$scope.loadAssets();
        }

        $scope.deleteConfirm = function (asset){
        	$scope.deleteAssetId= asset.id;
        }

        $scope.deleteAsset = function () {
        	AssetComponent.remove($scope.deleteAssetId).then(function(){

            	$scope.success = 'OK';
            	$state.reload();
        	});
        };

        $scope.loadQRCode = function(assetId, qrCodeImage) {
            console.log("calling asset")
            if(assetId) {
                console.log("QR Code image - "+ qrCodeImage);
                var uri = '/api/asset/' + assetId +'/qrcode';
                var eleId = 'qrCodeImage';
                console.log('image element id -' + eleId);
                $http.get(uri).then(function (response) {
                    var ele = document.getElementById(eleId);
                    console.log('qrcode response - ' + response.data);
                    //ele.setAttribute('src',response.data);
                    $('.modal-body img').attr('src',response.data);
                }, function(response) {
                    var ele = document.getElementById('qrCodeImage');
                    ele.setAttribute('src',"//placehold.it/250x250");
                });
            }else {
                var ele = document.getElementById('qrCodeImage');
                ele.setAttribute('src',"//placehold.it/250x250");
            }
        };

                  $scope.first = function() {
                	if($scope.pages.currPage > 1) {
                    	$scope.pages.currPage = 1;
                    	$scope.firstStyle();
                    	$scope.search();
                	}
                };

                $scope.firstStyle = function() {
               	 var ele = angular.element('#first');
            	 ele.addClass('disabledLink');
            	 ele = angular.element('#previous');
            	 ele.addClass('disabledLink');
            	 if($scope.pages.totalPages > 1) {
         	       	 var ele = angular.element('#next');
        	    	 ele.removeClass('disabledLink');
        	    	 ele = angular.element('#last');
        	    	 ele.removeClass('disabledLink');
            	 }

                }

                $scope.previous = function() {
                	if($scope.pages.currPage > 1) {
                    	$scope.pages.currPage = $scope.pages.currPage - 1;
                    	if($scope.pages.currPage == 1) {
        	       	       	 var ele = angular.element('#first');
        	    	    	 ele.addClass('disabled');
        	    	    	 ele = angular.element('#previous');
        	    	    	 ele.addClass('disabled');
                    	}
             	       	 var ele = angular.element('#next');
            	    	 ele.removeClass('disabled');
            	    	 ele = angular.element('#last');
            	    	 ele.removeClass('disabled');
        	    		$scope.search();
                	}

                };

                $scope.next = function() {
                	if($scope.pages.currPage < $scope.pages.totalPages) {
                    	$scope.pages.currPage = $scope.pages.currPage + 1;
                    	if($scope.pages.currPage == $scope.pages.totalPages) {
        	       	       	 var ele = angular.element('#next');
        	    	    	 ele.addClass('disabled');
        	    	    	 ele = angular.element('#last');
        	    	    	 ele.addClass('disabled');
                    	}
             	       	 var ele = angular.element('#first');
            	    	 ele.removeClass('disabled');
            	    	 ele = angular.element('#previous');
            	    	 ele.removeClass('disabled');
        	    		$scope.search();
                	}

                };

                $scope.last = function() {
                	if($scope.pages.currPage < $scope.pages.totalPages) {
                    	$scope.pages.currPage = $scope.pages.totalPages;
                    	if($scope.pages.currPage == $scope.pages.totalPages) {
        	       	       	 var ele = angular.element('#next');
        	    	    	 ele.addClass('disabled');
        	    	    	 ele = angular.element('#last');
        	    	    	 ele.addClass('disabled');
                    	}
              	       	var ele = angular.element('#first');
            	    	ele.removeClass('disabled');
            	    	ele = angular.element('#previous');
            	    	ele.removeClass('disabled');
            	    	$scope.search();
                	}

                };

        $scope.clearFilter = function() {
            $scope.selectedProject = null;
            $scope.searchCriteria = {};
            $scope.selectedSite = null;
            $scope.selectedStatus = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            $scope.search();
        };

        //init load
        $scope.initLoad = function(){ 
             $scope.loadPageTop(); 
             $scope.initPage(); 
          
         }

       //Loading Page go to top position
        $scope.loadPageTop = function(){
            //alert("test");
            //$("#loadPage").scrollTop();
            $("#loadPage").animate({scrollTop: 0}, 2000);
        }

        // Page Loader Function

        $scope.loadingStart = function(){ $('.pageCenter').show();}
        $scope.loadingStop = function(){
            
            console.log("Calling loader");
            $('.pageCenter').hide();
                    
        }
    });
