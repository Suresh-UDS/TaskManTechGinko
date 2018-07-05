'use strict';

angular.module('timeSheetApp')
	.factory('SlaComponent', function SlaComponent(SlaUpdate,$http,SlaDelete) {
		return {
			createSla: function (sla, callback) {
				var cb = callback || angular.noop;

				return SlaUpdate.save(sla,
					function () {
						return cb(sla);
					},
					function (err) {
						console.log(JSON.stringify(err));
						return cb(err);
					}.bind(this)).$promise;
			},
			findAll: function () {
				return $http.post('api/sla/search').then(function (response) {
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
			}
		
	});
