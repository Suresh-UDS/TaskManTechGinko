//Create the AngularJS module named StorageService
    //Create getLocalStorage service to access module's search criteria
    var storageService = angular.module('storageService', []);
    storageService.factory('getLocalStorage', function () {
        var searchList = {};
        return {
            list: searchList,
            updateSearch: function (searchArr) {
                if (window.localStorage && searchArr) {
                    //Local Storage to add Data
                    localStorage.setItem("moduleSearch", angular.toJson(searchArr));
                }
                searchList = searchArr;

            },
            getSearch: function () {
                //Get data from Local Storage
                searchList = angular.fromJson(localStorage.getItem("moduleSearch"));
                return searchList ? searchList : [];
            }
        };

    });

    storageService.factory('getLocalLocation', function () {
        var locationList = {};
        return {
            list: locationList,
            updateLocation: function (locationArr) {
                if (window.localLocation && locationArr) {
                    //Local Storage to add Data
                    localLocation.setItem("location", angular.toJson(locationArr));
                }
                locationList = locationArr;

            },
            getLocation: function () {
                //Get data from Local Storage
                locationList = angular.fromJson(localLocation.getItem("location"));
                return locationList ? locationList : [];
            }
        };

    });

    //Create getLocalStorage service to access dashboard's search criteria

    storageService.factory('getLocalDbStorage', function () {
            var searchList = {};
            return {
                list: searchList,
                updateSearch: function (searchArr) {
                    if (window.localStorage && searchArr) {
                        //Local Storage to add Data
                        localStorage.setItem("dashboard", angular.toJson(searchArr));
                    }
                    searchList = searchArr;

                },
                getSearch: function () {
                    //Get data from Local Storage
                    searchList = angular.fromJson(localStorage.getItem("dashboard"));
                    return searchList ? searchList : [];
                }
            };

        });

