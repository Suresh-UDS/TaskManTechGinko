'use strict';

angular.module('timeSheetApp')
    .factory('LocationComponent', function LocationComponent(Location, $http) {
        return {
        		createLocation: function(location, callback) {
                    var cb = callback || angular.noop;
                    return Location.save(location,
                        function () {
                            return cb(location);
                        },
                        function (err) {
                            //this.logout();
                            return cb(err);
                        }.bind(this)).$promise;
        			
        		},
            updateLocation: function (location, callback) {
                var cb = callback || angular.noop;

                return Location.update(location,
                    function () {
                        return cb(location);
                    },
                    function (err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },  
            findOne: function(id){
                return $http.get('api/location/'+id).then(function (response) {
                    return response.data;
                });
            },
            findAll: function () {
                return $http.get('api/locations').then(function (response) {
                    return response.data;
                });
            },  
            
            findBlocks: function (projectId, siteId) {
                return $http.get('api/location/project/' + projectId +'/site/' + siteId +'/block').then(function (response) {
                    return response.data;
                });
            },  
            
            findFloors: function (projectId, siteId, block) {
                return $http.get('api/location/project/' + projectId +'/site/' + siteId + '/block/' + block + '/floor').then(function (response) {
                    return response.data;
                });
            },  

            findZones: function (projectId, siteId, block, floor) {
                return $http.get('api/location/project/' + projectId +'/site/' + siteId + '/block/' + block + '/floor/' + floor + '/zone').then(function (response) {
                    return response.data;
                });
            },  

            search: function(searchCriteria) {
                return $http.post('api/location/search', searchCriteria).then(function (response) {
                    return response.data;
                });
            }
        };
    });
