'use strict';

angular.module('timeSheetApp')
    .factory('DeviceComponent', function DeviceComponent(Device,$http,DeviceDelete) {
        return {
        	createDevice: function (device, callback) {
                var cb = callback || angular.noop;

                return Device.save(device,
                    function () {
                        return cb(device);
                    },
                    function (err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            findAll: function () {
                return $http.get('api/device').then(function (response) {
                    return response.data;
                });
            },
            findOne: function(id){
            	  return $http.get('api/device/'+id).then(function (response) {
                      return response.data;
                  });
            },
            updateDevice: function (device, callback) {
                var cb = callback || angular.noop;

                return Device.update(device,
                    function () {
                        return cb(device);
                    },
                    function (err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            deleteDevice: function (device, callback) {
            	
                var cb = callback || angular.noop;

                return DeviceDelete.deleteDevice(device,
                    function () {
                        return cb(device);
                    },
                    function (err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            search: function(searchCriteria) {
            	return $http.post('api/device/search', searchCriteria).then(function (response) {
            		return response.data;
            	});
            }
        
        };
    });