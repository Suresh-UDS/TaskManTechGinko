'use strict';

angular.module('timeSheetApp', ['LocalStorageModule',
               'ui.bootstrap', 'ui.bootstrap.datetimepicker', // for modal dialogs
    'ngResource', 'ui.router', 'ngCookies', 'ngAria', 'ngCacheBuster', 'ngFileUpload',
     'infinite-scroll', 'App.filters','uiGmapgoogle-maps','checklist-model',
     'alexjoffroy.angular-loaders','chart.js','jkAngularRatingStars',
     'angular-star-rating-new','paginations','excelGrid'])

    .run(function ($rootScope, $location, $window, $http, $state,  Auth, Principal, ENV, VERSION) {
        $rootScope.isAuthenticated = Principal.isAuthenticated;
        $rootScope.loginView = true;
        $rootScope.ENV = ENV;
        $rootScope.VERSION = VERSION;
        $rootScope.stateValue ="";

       /* Principal.identity().then(function(response)
             {
                 console.log('current user' +JSON.stringify(response.login));
                 $rootScope.accountName = response.login;
             });*/
        $rootScope.logout = function () {
            Auth.logout();
            $state.go('login');
        };
        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;
            console.log("state change start")
            if (Principal.isIdentityResolved()) {
                Auth.authorize();

                $rootScope.isLoggedIn = true;
            }

        });
        console.log('current state - ' +JSON.stringify($state));
        $rootScope.isLoggedIn = true;

        $rootScope.stateDetails = $state;
        $rootScope.pageTile;
        $rootScope.logoutUser = function () {
            Auth.logout();
            $rootScope.isLoggedIn = false;
            $state.go('login');
        };

        $rootScope.$on('$stateChangeSuccess',  function(event, toState, toParams, fromState, fromParams) {
            var titleKey = 'Dashboard' ;

            // Remember previous state unless we've been redirected to login or we've just
            // reset the state memory after logout. If we're redirected to login, our
            // previousState is already set in the authExpiredInterceptor. If we're going
            // to login directly, we don't want to be sent to some previous state anyway
            if (toState.name != 'login' && $rootScope.previousStateName) {
              $rootScope.previousStateName = fromState.name;
              $rootScope.previousStateParams = fromParams;
            }

            // Set the page title key to the one configured in state or use default one
            if (toState.data.pageTitle) {
                titleKey = toState.data.pageTitle;
            }
            $window.document.title = titleKey;
            $rootScope.pageTitle = titleKey;
            console.log(toState.name)
            if(toState.name == 'login'){
                $rootScope.isLoggedIn = false;
            }
            if(toState.name !='dashboard'){
                console.log("Not Dashboard");
                $rootScope.isChartsDisplayed = true;
                console.log($rootScope.isChartsDisplayed);
            }else{
                console.log("Not Dashboard");
                $rootScope.isChartsDisplayed = false;
                console.log($rootScope.isChartsDisplayed);

            }


        });

        $rootScope.back = function() {
            // If previous state is 'activate' or do not exist go to 'home'
            if ($rootScope.previousStateName === 'activate' || $state.get($rootScope.previousStateName) === null) {

                if($rootScope.stateValue != ""){
                    $rootScope.stateValue;
                    $(".content").removeClass("remove-mr");
                    $(".main-panel").removeClass("remove-hght");
                    //$state.go($rootScope.stateValue);
                    window.location = window.location.href+$rootScope.stateValue;
                }
                else{
                $state.go('dashboard');
            }

              $rootScope.stateValue ="";
            } else {
                $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
            }
        };


        // Page Loader Function

        $rootScope.loadingAuto = function(){
            $scope.loadingStart();
            $scope.loadtimeOut = $timeout(function(){

            //console.log("Calling loader stop");
            $('.pageCenter').hide();$('.overlay').hide();

        }, 2000);}

        $rootScope.loadingStart = function(){

         $('.pageCenter').show();
         $('.overlay').show();

        }
        $rootScope.overlayShow = function(){

         $('.overlay').show();

        }
        $rootScope.overlayHide = function(){

         $('.overlay').hide();

        }

        $rootScope.loadingStop = function(){

            console.log("Calling loader");

            $('.pageCenter').hide();
            $('.overlay').hide();

        }

        //Loading Page go to top position

        $rootScope.loadPageTop = function(){

            $("#loadPage").animate({scrollTop: 0}, 0);
        }

        //Perfect scroll bar INIT

        // $rootScope.initScrollBar = function(){
        //
        //     console.log("-- Calling scrollbar -- ");
        //
        //     $('.sidebar .sidebar-wrapper').perfectScrollbar();
        // }
        //
        // $rootScope.initScrollBar();

    })
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider,  httpRequestInterceptorCacheBusterProvider,uiGmapGoogleMapApiProvider) {
    	uiGmapGoogleMapApiProvider.configure({
 //           china: true
        });
        //enable CSRF
        $httpProvider.defaults.xsrfCookieName = 'CSRF-TOKEN';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';

        //Cache everything except rest api requests
        httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*api.*/, /.*protected.*/], true);

        $urlRouterProvider.otherwise('/');
        $stateProvider.state('site', {
            'abstract': true,
            views: {
                'header@': {
                    templateUrl: 'scripts/components/header/header.html',
                    controller: 'HeaderController'
                },
                'navbar@': {
                    templateUrl: 'scripts/components/navbar/navbar.html',
                    controller: 'NavbarController'
                },
                'footer@': {
                    templateUrl: 'scripts/components/footer/footer.html',
                    controller: 'FooterController'
                }
            },
            resolve: {
                authorize: ['Auth',
                    function (Auth) {
                        return Auth.authorize();
                    }
                ]
            }
        });



        $httpProvider.interceptors.push('errorHandlerInterceptor');
        $httpProvider.interceptors.push('authExpiredInterceptor');
        $httpProvider.interceptors.push('notificationInterceptor');

        // No cache settings
        $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.cache = false;

    })
    .config(['$urlMatcherFactoryProvider', function($urlMatcherFactory) {
        $urlMatcherFactory.type('boolean', {
            name : 'boolean',
            decode: function(val) { return val == true ? true : val == "true" ? true : false },
            encode: function(val) { return val ? 1 : 0; },
            equals: function(a, b) { return this.is(a) && a === b; },
            is: function(val) { return [true,false,0,1].indexOf(val) >= 0 },
            pattern: /bool|true|0|1/
        });
    }])
    .filter('trusted', ['$sce', function ($sce) {
	    return function(url) {
	        return $sce.trustAsResourceUrl(url);
	    };
    }]);

    angular.module('App.filters', []).filter('zpad', function() {
    	return function(input, n) {
    		if(input === undefined)
    			input = ""
    		if(input.length >= n)
    			return input
    		var zeros = "0".repeat(n);
    		return (zeros + input).slice(-1 * n)
    	};
    });




