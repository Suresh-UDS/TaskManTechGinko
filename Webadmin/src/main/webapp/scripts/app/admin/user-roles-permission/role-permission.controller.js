'use strict';

angular.module('timeSheetApp')
.controller('RolePermissionController', function ($rootScope, $scope, $state, $timeout, UserRoleComponent, ModuleActionComponent,RolePermissionComponent, $http, $stateParams, $location, JobComponent) {
	$rootScope.loadingStop();
	$rootScope.loginView = false;
	$scope.success = null;
	$scope.error = null;
	$scope.doNotMatch = null;
	$scope.errorUserExists = null;
	$scope.validationError = null;
	$scope.validationErrorMsg = null;
	$scope.authorities = ["User", "Admin"];
	$scope.pager = {};
	$scope.noData = false;

	//$timeout(function (){angular.element('[ng-model="name"]').focus();});

	$scope.pages = { currPage : 1};

	$scope.selectedGroup;

	$scope.selectedUserRole = null;

	$scope.userRoles;

	$scope.moduleActions;

	$scope.selectedModuleAction;

	$scope.moduleActions;

	$scope.moduleName;

	$scope.selectedActions=[];

	$scope.selectedPermissions = [];

	$scope.permissions = {};

	$scope.showNotifications= function(position,alignment,color,msg){
        demo.showNotification(position,alignment,color,msg);
    }

	$scope.selectRole = function() {
        $scope.selectedPermissions = [];
		console.log('selected role - '+ $scope.selectedUserRole);
		if(!$scope.selectedUserRole){
             $scope.loadModuleActions();
        }else{
            $scope.permissions ={};
             $scope.loadPermissions();
        }

	}

	$scope.checkPermission = function(moduleId, moduleName, actionId, actionName) {
		console.log('selected module and action - ' + moduleName + ' , - ' + actionName);
		console.log('selectedPermissions>>>>> ' + JSON.stringify($scope.selectedPermissions));
		if(angular.isArray($scope.selectedPermissions)) {
			var permMatch = false;
			var perms = $scope.selectedPermissions;
			for(var p = 0; p < perms.length; p++) {
				var perm = perms[p];
				if(perm.name) {
					if(perm.name.toUpperCase() === moduleName.toUpperCase()) {
						permMatch = true;
						var actions = perm.moduleActions;
						if(angular.isArray(actions)) {
							var actionMatch = false;
							for(var i = 0; i < actions.length ; i++) {
								var action = actions[i];
								if(action.name == actionName) {
									actionMatch = true;
									actions.splice(i,1);
									break;
								}
							}
							if(!actionMatch) {
								var action = {
										"id" : actionId,
										"name" : actionName
								}
								actions.push(action);
								perm.moduleActions = actions;
							}
						}
						break;

					}
				}


			}

			if(!permMatch){
				var actions = [];
				var action = {
						"id" : actionId,
						"name" : actionName
				}
				actions.push(action);

				var permission = {
						"id" : moduleId,
						"name" : moduleName,
						"moduleActions" : actions

				}

				$scope.selectedPermissions.push(permission);

			}

		}
		console.log('<<<<selectedPermissions - ' + JSON.stringify($scope.selectedPermissions));
	}

	$scope.addAction = function() {
		var action = $scope.actionSelector
		$scope.selectedActions.push(action);
	}

	$scope.removeAction = function(ind) {
		$scope.selectedActions.splice(ind,1);
	}

	$scope.saveRolePermissions = function () {
	    $scope.rolePermissionLoadingStart();
		console.log('selectedRole -'+ $scope.selectedUserRole);
		console.log('selectedRolePermissions -'+ JSON.stringify($scope.selectedPermissions));
		$scope.permissions = {
				"roleId" : $scope.selectedUserRole.id,
				"applicationModules" : $scope.selectedPermissions
		};
		console.log('permission list',$scope.permissions);
		RolePermissionComponent.createRolePermission($scope.permissions).then(function () {
			$scope.success = 'OK';
			$scope.moduleName = '';
			$scope.selectedPermissions = [];
			$scope.selectedUserRole = '';
			//$scope.refreshPage();
            $scope.loadPermissions();
            $scope.selectedUserRole = {id:$scope.searchCriteria.userRoleId};
			$scope.rolePermissionLoadingStop();
			//$location.path('/role-permission');
			$scope.showNotifications('top','center','success','Role Permission Updated Successfully');
		}).catch(function (response) {
			$scope.success = null;
			if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
				$scope.errorModuleActionExists = true;
				$scope.showNotifications('top','center','danger','Role Permission already exists!..');
			} else if(response.status === 400 && response.data.message === 'error.validation'){
				$scope.validationError = true;
				$scope.validationErrorMsg = response.data.description;
				$scope.showNotifications('top','center','danger','Role Permission invalid!..');
			} else {
				$scope.error = 'ERROR';
				$scope.showNotifications('top','center','danger','Unable to update Role Permission!.. Please try again later.');
			}
			$scope.rolePermissionLoadingStop();
		});
	};

	$scope.cancelModuleAction = function () {
		$scope.selectedActions = [];
	};

	$scope.init = function() {
		$scope.loadUserRoles();
		$scope.loadModuleActions();
	}

	$scope.loadModuleActions = function () {
		$scope.noData = false;
		var searchCriteria = {
				"findAll" : true
		}
        $scope.moduleActions = "";
        $scope.moduleActionsLoader = false;
		ModuleActionComponent.search(searchCriteria).then(function (data) {
			$scope.moduleActions = data.transactions;
			$scope.moduleActionsLoader = true;

			if($scope.moduleActions && $scope.moduleActions.length > 0 ){
				$scope.noData = false;

			}else{
				$scope.noData = true;
			}

		})
	};

	$scope.refreshPage = function() {
		//$scope.clearFilter();
		$scope.loadUserRoles();
		$scope.loadModuleActions();
	}

	$scope.loadUserRoles = function () {
		UserRoleComponent.findAll().then(function (data) {
			$scope.userRoles = data;
		});
	};

	$scope.loadModuleAction = function(id) {
		ModuleActionComponent.findOne(id).then(function (data) {
			$scope.moduleName = data.name;
			for(var i in data.moduleActions) {
				$scope.selectedActions.push(data.moduleActions[i].name);
			}

		});

	};

	$scope.updateModuleAction = function () {

		ModuleActionComponent.updateModuleAction($scope.moduleAction).then(function () {
			$scope.success = 'OK';
			$scope.moduleName = '';
			$scope.selectedActions = [];
			$scope.moduleActions = {};
			$scope.loadModuleActions();
			$location.path('/user-roles');
		}).catch(function (response) {
			$scope.success = null;
			console.log('Error - '+ response.data);
			if (response.status === 400 && response.data.message === 'error.duplicateRecordError') {
				$scope.errorModuleActionExists = true;
			} else if(response.status === 400 && response.data.message === 'error.validation'){
				$scope.validationError = true;
				$scope.validationErrorMsg = response.data.description;
			} else {
				$scope.error = 'ERROR';
			}
		});
	};

	$scope.deleteConfirm = function (user){
		console.log('...>>>delete confirm<<<');
		$scope.confirmModuleAction = moduleAction;
	}

	$scope.deleteModuleAction = function () {
		console.log("user>>>>",+$scope.confirmModuleAction);
//		$scope.user = user;
		ModuleActionComponent.deleteModuleAction($scope.confirmModuleAction);
		$scope.success = 'OK';
		$state.reload();
	};

	$scope.loadPermissions = function () {
		var currPageVal = ($scope.pages ? $scope.pages.currPage : 1);
		if(!$scope.searchCriteria) {
			var searchCriteria = {
					currPage : currPageVal
			}
			$scope.searchCriteria = searchCriteria;
		}

		$scope.searchCriteria.currPage = currPageVal;

		if($scope.selectedUserRole) {
			$scope.searchCriteria.findAll = false;
			console.log('selected user role id - '+$scope.selectedUserRole.id)
			$scope.searchCriteria.userRoleId = $scope.selectedUserRole.id;
		}else {
			$scope.searchCriteria.selectedUserRole = 0;
		}
		console.log($scope.searchCriteria);
		$scope.rolePermissionLoadingStart();
        $scope.permissions = "";
		RolePermissionComponent.search($scope.searchCriteria).then(function (data) {
			$scope.permissions = data;
			console.log('permissions - ' + JSON.stringify($scope.permissions));
			if($scope.moduleActions && $scope.permissions) {
				var permAppModules = $scope.permissions.applicationModules;
                if($scope.permissions.applicationModules != 0){
                    for(var i=0; i < $scope.moduleActions.length; i++) {
                        // $scope.moduleActions.forEach(function(module) {
                        var module = $scope.moduleActions[i];
                        //console.log('module - ' + JSON.stringify(module));
                        var permModuleMatch = false;

                        for(var j=0; j< permAppModules.length; j++) {
                            var permModule = permAppModules[j];
                            //console.log('perm module - ' + JSON.stringify(permModule));
                            // permAppModules.forEach(function(permModule) {

                            if(module.name && (module.name.toUpperCase() === permModule.name.toUpperCase())) {
                                permModuleMatch = true;
                                console.log('module match - ' + module.name);
                                var permActions = permModule.moduleActions;
                                var modActions = module.moduleActions;
                                //console.log('permActions - ' + JSON.stringify(permActions) +', modActions -' + JSON.stringify(modActions));
                                for(var k=0; k < modActions.length; k++) {
                                    var action = modActions[k];
                                    console.log('action - ' + JSON.stringify(action));
                                    // modActions.forEach(function(action) {
                                    var permActionMatch = false;
                                    for(var l=0; l < permActions.length; l++) {
                                        var permAction = permActions[l];
                                        console.log('perm action- ' + JSON.stringify(permAction));
                                        // permActions.forEach(function(permAction)
                                        // {

                                        if(action.name.toUpperCase() == (permAction.name.toUpperCase())) {
                                            console.log('action match found -' + action.name);
                                            permActionMatch = true;
                                            console.log('action in scope - ' + $scope.moduleActions[i].moduleActions[k].name);
                                            $scope.moduleActions[i].moduleActions[k].selected = true;
                                            if($scope.selectedPermissions && $scope.selectedPermissions.length > 0) {
                                                var selPerms = $scope.selectedPermissions;
                                                var selPermMatch = false;
                                                for(var p=0; p < selPerms.length; p++) {
                                                    if(selPerms[p].name.toUpperCase() === module.name.toUpperCase()) {
                                                        selPermMatch = true;
                                                        var selPermActions = selPerms[p].moduleActions;
                                                        if(selPermActions) {
                                                            var selActionMatch = false;
                                                            for(var a=0; a < selPermActions.length; a++) {
                                                                console.log('selected permission action = ' + selPermActions[a].name.toUpperCase());
                                                                console.log('master permission action = ' + permAction.name.toUpperCase());
                                                                console.log(selPermActions[a].name.toUpperCase() == (permAction.name.toUpperCase()))
                                                                if(selPermActions[a].name.toUpperCase() == (permAction.name.toUpperCase())) {
                                                                    selActionMatch = true;
                                                                    break;
                                                                }
                                                            }
                                                            if(!selActionMatch) {
                                                                var action = {
                                                                        "id" : permAction.id,
                                                                        "name" : permAction.name
                                                                }

                                                                selPermActions.push(action);
                                                                selPerms[p].moduleActions = selPermActions;
                                                            }
                                                        }else {
                                                            var actions = [];
                                                            var action = {
                                                                    "id" : action.id,
                                                                    "name" : action.name
                                                            }
                                                            actions.push(action);
                                                        }
                                                        break;
                                                    }

                                                }
                                                if(!selPermMatch) { //if the selectedPermissions array does not contain the module
                                                    var actions = [];
                                                    var action = {
                                                            "id" : action.id,
                                                            "name" : action.name
                                                    }
                                                    actions.push(action);
                                                    var permission = {
                                                            "id" : module.id,
                                                            "name" : module.name,
                                                            "moduleActions" : actions

                                                    }

                                                    $scope.selectedPermissions.push(permission);
                                                }
                                            }else {  //if the selectedPermissions array is empty
                                                var actions = [];
                                                var action = {
                                                        "id" : action.id,
                                                        "name" : action.name
                                                }
                                                actions.push(action);

                                                var permission = {
                                                        "id" : module.id,
                                                        "name" : module.name,
                                                        "moduleActions" : actions

                                                }

                                                $scope.selectedPermissions.push(permission);

                                            }
                                            break;
                                        }else {
                                            $scope.moduleActions[i].moduleActions[k].selected = false;
                                        }

                                    }

                                }
                                break;
                            }else {
                                var modActions = module.moduleActions;
                                for(var k=0; k < modActions.length; k++) {
                                    $scope.moduleActions[i].moduleActions[k].selected = false;
                                }
                            }
                        }


                    }
                    console.log('permissions - ' + JSON.stringify($scope.selectedPermissions));
                    $scope.rolePermissionLoadingStop();
                }else{
                    var searchCriteria = {
                            "findAll" : true
                    }
                  ModuleActionComponent.search(searchCriteria).then(function (data) {
                  	$scope.moduleActions = data.transactions;
                  	$scope.rolePermissionLoadingStop();
                  });
                }


			}


			$scope.pages.currPage = data.currPage;
			$scope.pages.totalPages = data.totalPages;
			if($scope.permissions == null){
				$scope.pages.startInd = 0;
			}else{
				$scope.pages.startInd = (data.currPage - 1) * 100 + 1;
			}

			$scope.pages.endInd = data.totalCount > 100  ? (data.currPage) * 100 : data.totalCount ;
			$scope.pages.totalCnt = data.totalCount;
			$scope.hide = true;

		}).catch(function(){
			$scope.rolePermissionLoadingStop();
		});

	};





	$scope.inputType = "password";
	$scope.passwordCheckbox = "true";
	$scope.showPwd = function(){
		if($scope.inputType == "password"){
			$scope.inputType = "text";
			$scope.passwordCheckbox = "false";

		}else{
			$scope.inputType = "password";
			$scope.passwordCheckbox = "true";

		}

	}

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


	//init load
	$scope.initLoad = function(){
		$scope.loadPageTop();


	}

	$scope.cancelAppModule = function() {

		//$location.path('/role-permission');

		$scope.selectedUserRole =null;

		$scope.permissions = {};

		$scope.refreshPage();
	}

	$scope.rolePermissionLoadingStart = function(){

		$('.pageCenter').addClass('pageTopCenter');
		$('.pageTopCenter').show();
		$('.overlay').show();
		$scope.noscroll = true;


	}

	$scope.rolePermissionLoadingStop = function(){

		//console.log("Calling loader");
		$('.pageTopCenter').hide();
		$('.pageCenter').removeClass('pageTopCenter');
		$('.overlay').hide();
		$scope.noscroll = false;



	}

    $scope.conform = function(text)
    {
        $rootScope.conformText = text;
        $('#conformationModal').modal();

    }
    $rootScope.back = function (text) {
        if(text == 'cancel' || text == 'back'){
            /** @reatin - retaining scope value.**/
            $rootScope.retain=1;
            $scope.cancelAppModule();
        }else if(text == 'save'){
            /** @reatin - retaining scope value.**/
            $rootScope.retain=1;
            $scope.saveRolePermissions();
        }
    };



});


