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
				return $http.get('api/sla').then(function (response) {
					return response.data;
				});
			},
			findOne: function(id){
				  return $http.get('api/sla/search/'+id).then(function (response) {
					  return response.data;
				  });
			},
			search: function(searchCriteria) {
				return $http.post('api/sla/search', searchCriteria).then(function (response) {

					//console.log("response is--->>>"+JSON.stringify(response.data));
					return response.data;
				});
			},
			updateSla: function (sla, callback) {
				var cb = callback || angular.noop;

				return SlaUpdate.update(sla,
					function () {
						return cb(sla);
					},
					function (err) {
						console.log(JSON.stringify(err));
						return cb(err);
					}.bind(this)).$promise;
			},
			
			
			deleteSla: function (id, callback) {

	                var cb = callback || angular.noop;
	                alert("id: "+id);
	                return  $http.delete('api/sla/delete/'+id).then(
	                    function (response) {
	                        return cb(response);
	                    }).catch(
	                    function (err) {
	                        console.log(JSON.stringify(err));
	                        return cb(err);
	                    })
	            },
			
			
			}
		
	});
