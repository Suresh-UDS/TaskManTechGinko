'use strict';

angular.module('timeSheetApp')
    .factory('SiteComponent', function SiteComponent(Site,$http,SiteDelete) {
        return {
        	createSite: function (site, callback) {
                var cb = callback || angular.noop;

                return Site.save(site,
                    function () {
                        return cb(site);
                    },
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    }.bind(this)).$promise;
            },
            findAll: function () {
                return $http.get('api/site').then(function (response) {
                    return response.data;
                });
            },
            findOne: function(id){
            	  return $http.get('api/site/'+id).then(function (response) {
                      return response.data;
                  });
            },
            updateSite: function (site, callback) {
                var cb = callback || angular.noop;

                return Site.update(site,
                    function () {
                        return cb(site);
                    },
                    function (err) {
                        return cb(err);
                    }.bind(this)).$promise;
            },
            deleteSite: function (site, callback) {

                var cb = callback || angular.noop;

                return SiteDelete.deleteSite(site,
                    function () {
                        return cb(site);
                    },
                    function (err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            search: function(searchCriteria) {
            	return $http.post('api/site/search', searchCriteria).then(function (response) {
            		return response.data;
            	});
            },
            setSiteProximity: function(userId,siteId,lat,lng){
                return $http.post('http://ec2-52-77-216-21.ap-southeast-1.compute.amazonaws.com:8000/api/site/location?'+'userId='+userId+'&siteId='+siteId+'&lat='+lat+'&lng='+lng).then(function (response) {
                    return response.data
                })
            }
        };
    });
