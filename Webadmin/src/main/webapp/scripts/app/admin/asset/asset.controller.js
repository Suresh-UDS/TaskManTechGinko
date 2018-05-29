'use strict';

angular.module('timeSheetApp')
		    .controller(
				'AssetController',
				function($scope, $rootScope, $state, $timeout, AssetComponent,
						ProjectComponent, SiteComponent,EmployeeComponent, $http, $stateParams,
						$location,PaginationComponent) {
                     
        $rootScope.loadingStop();
        $rootScope.loginView = false;
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.pager = {};
        $scope.searchCriteria = {};
        $scope.pages = { currPage : 1};
        $scope.isEdit = !!$stateParams.id;
        $scope.selectedAsset = null;
        $scope.pageSort = 10;
        $scope.pager = {};

        console.log($stateParams)
                    var that =  $scope;

        $scope.calendar = {
            actualStart : false,
            actualEnd : false,
            plannedStart : false,
            plannedEnd : false,
        };

        $scope.initCalender = function(){

            demo.initFormExtendedDatetimepickers();


        };

        $scope.initCalender();

        demo.initFullCalendar();

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
            $scope.clearFilter();
        	$scope.search();
        };

        $scope.isActiveAsc = 'code';
        $scope.isActiveDesc = '';

        $scope.columnAscOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveAsc = field;
            $scope.isActiveDesc = '';
            $scope.isAscOrder = true;
            //$scope.search();
            $scope.loadAssets();
        }

        $scope.columnDescOrder = function(field){
            $scope.selectedColumn = field;
            $scope.isActiveDesc = field;
            $scope.isActiveAsc = '';
            $scope.isAscOrder = false;
            //$scope.search();
            $scope.loadAssets();
        }

        $scope.searchFilter = function () {
            $scope.setPage(1);
            $scope.search();
         }

        $scope.search = function () {
           
            var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
          if(!$scope.searchCriteria) {

            var searchCriteria = {
                currPage : currPageVal
            }

            $scope.searchCriteria = searchCriteria;

           }

            $scope.searchCriteria.currPage = currPageVal;
            console.log('Selected Assets' + $scope.selectedLocation);

            if(!$scope.selectedAsset) {
                if($rootScope.searchCriteriaAssets) {
                    $scope.searchCriteria = $rootScope.searchCriteriaAssets;
                }else {
                    $scope.searchCriteria.findAll = true;
                }

            }else {
                if($scope.selectedAsset) {
                    $scope.searchCriteria.findAll = false;
                    $scope.searchCriteria.id = $scope.selectedAsset.id;
                    
            }
            }
            console.log($scope.searchCriteria);
            //----
            if($scope.pageSort){
                $scope.searchCriteria.sort = $scope.pageSort;
            }

            if($scope.selectedColumn){
              
                $scope.searchCriteria.columnName = $scope.selectedColumn;
                $scope.searchCriteria.sortByAsc = $scope.isAscOrder;

            }else{
                $scope.searchCriteria.columnName ="id";
                $scope.searchCriteria.sortByAsc = true;
            }
             
             console.log("search criteria",$scope.searchCriteria);
                $scope.locations = '';
                $scope.locationsLoader = false;
                $scope.loadPageTop();

            AssetComponent.search().then(function (data) {
                $scope.assets = data;
                $scope.assetsLoader = true;
                /*
                    ** Call pagination  main function **
                */
                $scope.pager = {};
                $scope.pager = PaginationComponent.GetPager(data.totalCount, $scope.pages.currPage);
                $scope.totalCountPages = data.totalCount;

                console.log("Pagination",$scope.pager);
                console.log("Asset List - ", data);

                $scope.pages.currPage = data.currPage;
                $scope.pages.totalPages = data.totalPages;
                $scope.loading = false;

                if($scope.assets && $scope.assets.length > 0 ){
                    $scope.showCurrPage = data.currPage;
                    $scope.pageEntries = $scope.assets.length;
                    $scope.totalCountPages = data.totalCount;
                    $scope.pageSort = 10; 

                }

            });
        };


         $scope.viewAsset = function(){

            var assetId = $stateParams.id;

            AssetComponent.findById(assetId).then(function(data){
                console.log("Asset details List==" + JSON.stringify(data));
                $scope.assetDeatil= data;
            });
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
               $scope.loadAssets();
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



        $scope.clearFilter = function() {
            $scope.selectedAsset = null;
            $scope.selectedProject = null;
            $scope.searchCriteria = {};
            $scope.selectedSite = null;
            $scope.selectedStatus = null;
            $scope.pages = {
                currPage: 1,
                totalPages: 0
            }
            //$scope.search();
        };

        //init load
        $scope.initLoad = function(){ 

             $scope.loadPageTop(); 
             $scope.initPage();
             $scope.loadAssets(); 
             $scope.setPage(1);
          
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
        }


    });
