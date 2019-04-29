'use strict';

angular.module('timeSheetApp')
    .controller('LoginController', function ($rootScope, $scope, $state, $timeout, Auth,$remember,$forget,$parse,$uibModal, Idle, Keepalive) {
        $rootScope.loginView = true;
        $rootScope.isSingIn = false;
        if($rootScope.loginView == true){
            $(".content").addClass("remove-mr");
            $(".main-panel").addClass("remove-hght");
        }

        Idle.unwatch();

        $scope.user = {};
        $scope.errors = {};
        $scope.oldPassword='';
        $scope.newPassword='';

        // Cookie values get
        if($remember.getCookie('username')){
            $scope.rememberMe = true;
            $scope.username = $remember.getCookie('username');
        }
        if($remember.getCookie('password')){
            $scope.password = $remember.getCookie('password');
        }

        //$timeout(function (){angular.element('[ng-model="username"]').focus();});

        $scope.login = function (event) {
            $rootScope.isSingIn = true;
            event.preventDefault();

            Auth.login({

                username: $scope.username,
                password: $scope.password,
                rememberMe: $scope.rememberMe

            }).then(function () {
                $rootScope.sessionOut =false;
                $scope.authenticationError = false;
                if ($rootScope.previousStateName === 'register') {
                    $rootScope.isLoggedIn = true;
                    $state.go('dashboard');
                } else {
                    $rootScope.isLoggedIn = true;
                    $rootScope.retainUrl();
                }
                // Cookie set and unset
                if($scope.rememberMe){
                    $remember.setCookie('username', $scope.username,300);
                    $remember.setCookie('password', $scope.password,300);
                }else{
                    $forget.unsetCookie('username','');
                    $forget.unsetCookie('password','');
                }
                $rootScope.confirmBoxHide = false;
                $rootScope.resLoader=true;
                $rootScope.isSingIn = false;
                $('.sidebar-mini').removeClass('modal-open');
            }).catch(function () {
                $rootScope.isSingIn = false;
                $rootScope.sessionOut =false;
                $scope.authenticationError = true;
                $rootScope.resLoader=false;
                Idle.unwatch();
            });

            $rootScope.resLoader=true;
        };


        //Loading Page go to top position

        $scope.loadPageTop = function(){
            //alert("test");
            //$("#loadPage").scrollTop();
            $("#loadPage").animate({scrollTop: 0}, 0);
        };

        $scope.showNotifications= function(position,alignment,color,msg){

            demo.showNotification(position,alignment,color,msg);
        }

        $scope.changeNewPassword = function(event){
            // event.preventDefault();
            var changePasswordData = {
                newPassword:this.newPassword,
                oldPassword:this.oldPassword
            }

            Auth.changeNewPassword(changePasswordData).then(function (response) {

                console.log("Password successfully  changed");
                $scope.showNotifications('top','center','success','Password Successfully Changed..');

            }).catch(function (err) {

                $scope.showNotifications('top','center','failure','Password Successfully Changed..');
                console.log("Error in change password");

            })

        };


        // Username and Password validations

    	var msg="";
    	var elements = document.getElementsByTagName("INPUT");

    	for (var i = 0; i < elements.length; i++) {

    	   elements[i].oninvalid =function(e) {

    	        if (!e.target.validity.valid) {

        	        switch(e.target.id){
        	            case 'password' :
        	            e.target.setCustomValidity("Password cannot be blank");break;
        	            case 'username' :
        	            e.target.setCustomValidity("Username cannot be blank");break;
        	            default : e.target.setCustomValidity("");break;

    	            }

    	        }

    	    };

    	   elements[i].oninput = function(e) {
    	        e.target.setCustomValidity(msg);
    	    };
    	}
    });
