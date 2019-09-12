'use strict';

angular.module('timeSheetApp')
    .controller('HeaderController', function ($rootScope,$scope, $location, $state,
                                              Auth,AuthServerProvider, Principal, ENV, $interval ,$uibModal, Idle,permissions){



        $rootScope.isAuthenticated = Principal.isAuthenticated;
        $scope.$state = $state;
        $scope.inProduction = ENV === 'prod';
        console.log('admin -'+$state.includes('admin'));

        $scope.logout = function () {

            Auth.logout();
            $state.go('login');
            $rootScope.resLoader=false;
            Idle.unwatch();
            $scope.started = false;

            // clear root scope
            $rootScope.onBoardingFilter = {branches:{list:[],selected:{}},projects:{list:[],selected:{}},wbs:{list:[],selected:{}},employee:{name:null,empId:null,page:1,type:1}};

        };

        $scope.init = function() {

        };
        // Session timeout
        $interval(function(){

            //alert($state.current.name);

            if($rootScope.isAuthenticated() == false){
                $scope.loadingStop();
                var absUrl = $location.absUrl();
                var urlArray = absUrl.split("/");
                for(var i=4;i<=urlArray.length;i++){
                    //urlArray[4]
                    //console.log('url array',urlArray);
                    if(urlArray[i] && i==4){
                        $rootScope.stateValue = urlArray[i];
                    }
                    if(urlArray[i] && i!=4){
                        $rootScope.stateValue += '/'+ urlArray[i];
                    }
                }

                //alert($rootScope.stateValue);
                $state.go('login');
            }

        },0);


        $rootScope.initScrollBar();

        $rootScope.inits = function()
        {
            AuthServerProvider.getCurrentVersion('web').then(function (data) {
                console.log(data);
                $scope.version = data[0].displayVersion;
            });


            if($rootScope.isAuthenticated() == true){

                Principal.identity().then(function(response)
                {
                    //alert(response.firstName + response.lastName)
                    //console.log('current user' +JSON.stringify(response.firstName));

                    if(response.firstName || response.lastName){

                        $rootScope.accountNames = response.firstName;

                        if(response.lastName){

                            $rootScope.accountNames += " " + response.lastName;
                        }
                    }
                    else{

                        $rootScope.accountNames = response.login;
                    }

                    //alert($rootScope.accountName);

                });

            }

        };

        $('#minimizeSidebar').click(function() {

            var $btn = $(this);

            if (md.misc.sidebar_mini_active == true) {
                $('body').removeClass('sidebar-mini');
                md.misc.sidebar_mini_active = false;
            } else {
                $('body').addClass('sidebar-mini');
                md.misc.sidebar_mini_active = true;
            }

            // we simulate the window Resize so the charts will get updated in realtime.
            var simulateWindowResize = setInterval(function() {
                window.dispatchEvent(new Event('resize'));
            }, 180);

            // we stop the simulation of Window Resize after the animations are completed
            setTimeout(function() {
                clearInterval(simulateWindowResize);
            }, 1000);
        });

        $scope.loadingStop = function(){

            //console.log("Calling loader");
            $('.pageCenter').hide();$('.overlay').hide();

        };

        // Session Timeout functions start
        function closeModals() {
            if ($scope.warning) {
                $scope.warning.close();
                $scope.warning = null;
            }

            if ($scope.timedout) {
                $scope.timedout.close();
                $scope.timedout = null;
            }
        }

        $scope.$on('IdleStart', function() {
            closeModals();

            $scope.warning = $uibModal.open({
                templateUrl: 'warning-dialog.html',
                windowClass: 'modal-danger'
            });

        });

        $scope.$on('IdleEnd', function() {
            closeModals();
        });

        $scope.$on('IdleTimeout', function() {
            closeModals();
            $rootScope.sessionOut =true;
            $rootScope.confirmBoxHide = true;
            $scope.logout();
            /*$scope.timedout = $uibModal.open({
                templateUrl: 'timedout-dialog.html',
                windowClass: 'modal-danger'
            });*/

        });

        /*$scope.start = function() {
            closeModals();
            Idle.watch();
            $scope.started = true;
        };

        $scope.stop = function() {
            closeModals();
            Idle.unwatch();
            $scope.started = false;

        };*/

        /*User permissions based url allowed service call start*/
        $scope.$on('$stateChangeStart', function(scope, next, current) {
            //alert($rootScope.isAuthenticated());
            if($rootScope.isAuthenticated()){
                //console.log('next val',next);
                var permissionObj = {"permission":next.permission,"pageTitle":next.data.pageTitle};
                /*if(_.isString(permission) && !(permissions.hasPermission(permission))) {
                    $location.path('/projects');
                }*/
                permissions.hasPermission(permissionObj);
                /*if(_.isString(permission) && $rootScope.grant == 0){
                    $location.path('/projects');
                }*/
            }
        });

        /*User permissions based url allowed service call end*/
    })
    .config(function(IdleProvider, KeepaliveProvider) {
        IdleProvider.idle(15*60);// 15 minutes idle
        IdleProvider.timeout(5);// after 5 seconds idle, time the user out
        KeepaliveProvider.interval(15*60); // 15 minutes keep-alive ping
    });
// Session  Timeout functions end
