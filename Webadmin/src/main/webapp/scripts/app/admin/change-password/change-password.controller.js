'use strict';

angular.module('timeSheetApp')
    .controller('ChangePwdController', function ($rootScope, $scope, $state, $timeout, Auth, $location) {
        $rootScope.loginView = false;
        if($rootScope.loginView == true){
            $(".content").addClass("remove-mr");
            $(".main-panel").addClass("remove-hght");
        }
        $scope.user = {};
        $scope.errors = {};
        $scope.rememberMe = true;
        $scope.oldPassword=null;
        $scope.newPassword=null;
        $scope.confirmPassword = null;
        $scope.saveLoad = false;
       
        $scope.showNotifications= function(position,alignment,color,msg){
            demo.showNotification(position,alignment,color,msg);
        }

        $scope.changeNewPassword = function(){
            $scope.saveLoad = true;
            // event.preventDefault();
            if($scope.newPassword === $scope.confirmPassword) {
            	var changePasswordData = {
                        newPassword:$scope.newPassword,
                        oldPassword:$scope.oldPassword
                    }
                    Auth.changeNewPassword(changePasswordData).then(function (data) {
                        $scope.showNotifications('top','center','success','Password successfully changed..');
                        $scope.saveLoad = false;
//                        Auth.logout();
//                        $location.path('/login');
                        $scope.cancelChangePwd();
                    }).catch(function (err) {
                        $scope.showNotifications('top','center','danger','Password update failed ..');
                        $scope.saveLoad = false;
                    });

            }else{
            	$scope.showNotifications('top','center','danger','Confirm Password does not match.');
                $scope.saveLoad = false;
            }
            
        };

        $scope.conform = function(text,validation)
        {
            console.log($scope.selectedProject)
            $rootScope.conformText = text;
            $scope.valid = validation;
            $('#conformationModal').modal();

        }

        $rootScope.back = function (text) {
            if(text == 'cancel')
            {
                $scope.cancelChangePwd();
            }
            else if(text == 'Reset')
            {
                $scope.changeNewPassword();
            }
            
        };

        $scope.cancelChangePwd = function(){
            $scope.newPassword='';
            $scope.oldPassword='';
            $scope.confirmPassword='';
        };

        

    });
