//Create the AngularJS module named StorageService
    //Create getLocalStorage service to access UpdateEmployees and getEmployees method  
    var storageService = angular.module('storageService', []);  
    storageService.factory('getLocalStorage', function () {                  
        var searchList = {};  
        return {  
            list: searchList,  
            updateSearch: function (searchArr) {  
                if (window.localStorage && searchArr) {  
                    //Local Storage to add Data  
                    localStorage.setItem("location", angular.toJson(searchArr));  
                }  
                searchList = searchArr;  
                 
            },  
            getSearch: function () {  
                //Get data from Local Storage  
                searchList = angular.fromJson(localStorage.getItem("location"));                         
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