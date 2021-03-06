/*
    Angular magic
 */

var app = angular.module('app', ['ngRoute', 'Services', 'ngCookies', 'pascalprecht.translate', 'ngFileUpload']);

/*
    Routes for part of page
 */
app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'parts/login.html',
            controller: 'loginctrl'
        })
        .when('/dashboard', {
            templateUrl: 'parts/dashboard.html',
            controller: 'dashboardctrl'
        })
        .when('/daemons', {
            templateUrl: 'parts/daemons.html',
            controller: 'daemonsctrl'
        })
        .when('/daemons/add', {
            templateUrl: 'parts/daemons.add.html',
            controller: 'daemonsctrl'
        })
        .when('/plugins', {
            templateUrl: 'parts/plugins.html',
            controller: 'pluginsctrl'
        })
        .when('/plugins/add', {
            templateUrl: 'parts/plugins.add.html',
            controller: 'pluginsctrl'
        })
        .when('/worlds', {
            templateUrl: 'parts/worlds.html',
            controller: 'worldsctrl'
        })
        .when('/worlds/add', {
            templateUrl: 'parts/worlds.add.html',
            controller: 'worldsctrl'
        })
        .when('/servertypes', {
            templateUrl: 'parts/servertypes.html',
            controller: 'servertypesctrl'
        })
        .when('/statistics', {
            templateUrl: 'parts/statistics.html',
            controller: 'statisticsctrl'
        })
        .when('/settings', {
            templateUrl: 'parts/settings.html',
            controller: 'settingsctrl'
        })
        .when('/profile', {
            templateUrl: 'parts/profile.html',
            controller: 'profilectrl'
        })
        .when('/setup', {
            templateUrl: 'parts/setup.html',
            controller: 'setupctrl'
        })
        .when('/networkmap', {
            templateUrl: 'parts/networkmap.html',
            controller: 'networkmapctrl'
        })
        .when('/', {
            templateUrl: 'parts/dashboard.html',
            controller: 'dashboardctrl'
        })
        .otherwise({
            templateUrl: 'parts/dashboard.html',
            controller: 'dashboardctrl'
        });
    $locationProvider.html5Mode(true);
});

/*
    Translate config for use of lang files
 */
app.config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'lang/',
        suffix: '.json'
    });
    $translateProvider.useLocalStorage();
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.determinePreferredLanguage();
    $translateProvider.fallbackLanguage('en_US');
});

app.run(function($rootScope, $templateCache, $cookies, $http, Socket, $location) {
    $rootScope.loggedIn = false;
    $rootScope.setup = false;

    var templates = ['dashboard', 'networkmap', 'plugins', 'profile', 'daemons', 'daemons.add', 'login', 'servertypes', 'statistics', 'worlds', 'setup'];
    angular.forEach(templates, function(templateUrl) {
        templateUrl = 'parts/'+templateUrl+'.html';
        $http({method: 'GET', url: templateUrl}).success(function(data) {
            $templateCache.put(templateUrl, data);
        });
    });

    if(!$rootScope.loggedIn) {
        Socket.emit("setup-req-req", {});
        Socket.on("setup-req-res", function(data) {
            if(data.required == true) {
                $location.path('/setup');
            }
            $rootScope.setup = data.required;
        });
        if($cookies.get("session") !== undefined && $cookies.get("username") !== undefined && !($rootScope.setup)) {
            Socket.emit("clogin-req", {username: $cookies.get("username"), session: $cookies.get("session")});
            Socket.on("clogin-res", function(data) {
                if(data.reason == "success") {
                    $rootScope.loggedIn = true;
                    $location.path('/');
                } else {
                    $location.path('/login');
                }
            });
        } else {
            $location.path('/login');
        }
    }

    var unlink = $rootScope.$on('$translateChangeEnd', function(){
        setTimeout(function() {
            var loader = $('.loader');
            loader.fadeOut(950);
            unlink();
        }, 500);
    });
});

/*
    Services for easy use of socket.io etc.
 */
angular.module('Services', []).factory('Socket', function($rootScope) {
    var socket = io.connect();

    return {
        on: function(eventName, callback){
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback){
            if(typeof data === 'function') {
                callback = data;
                data = {};
            }
            socket.emit(eventName, data, function(){
                var args = arguments;
                $rootScope.$apply(function() {
                    if(callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});