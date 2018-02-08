'use strict';

angular.module('timeSheetApp')
    .factory('JobComponent', function SiteComponent(Site,$http) {
        return {

        	findBySiteId: function (siteId,page) {
              return $http.get('api/site/'+siteId+'/job?currPage='+page).then(function (response) {
                  return response.data;
              });
        	},
        	findEmployees : function(search){
        		return $http.get('api/job/employee').then(function (response) {
                    return response.data;
                })
        	},
            loadLocations : function(){
        	    console.log("Load locations")
        	    return $http.get('api/location').then(function (response) {
                    console.log(response)
        	        return response.data;
                })
            },
        	create : function(job,callback){
        	    var cb = callback || angular.noop;
                return $http.post('api/job',job).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })

        	},
        	update : function(job,callback){
        	    var cb = callback || angular.noop;
                return $http.put('api/job/'+job.id,job).then(
                    function (response) {
                        return cb(response);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(err);
                    })

        	},

        	remove: function (id, callback) {

		      var cb = callback || angular.noop;

		      return  $http.delete('api/job/'+id).then(
		           function (response) {
		               return cb(response);
		           }).catch(
		           function (err) {
		               console.log(JSON.stringify(err));
		               return cb(err);
               })
	       },
        	findById : function(id){
		          	  return $http.get('api/job/'+id).then(function (response) {
		              return response.data;
		          });
		    },
            search: function(searchCriteria) {
            	return $http.post('api/jobs/search', searchCriteria).then(function (response) {
            		return response.data;
            	});
            },

            standardPrices: function () {
                return $http.get('api/price').then(function (response) {
                    console.log("Job service standard prices")
                    console.log(response.data);
                    return response.data;
                });
            },
            
            exportAllData: function(searchCriteria) {
	            	return $http.post('api/job/export', searchCriteria).then(function (response) {
	            		return response.data;
	            	});
	        },
	        exportStatus: function(fileName) {
	            	if(empId == 0) {
	                	return $http.get('api/job/export/'+fileName+"/status").then(function (response) {
	                		return response.data;
	                	});
	            	}
	        },
	
	        getExportFile: function(fileName) {
	            	return $http.get('api/job/export/'+fileName).then(function (response) {
	            		return response.data;
	            	});
	        }
            
        };
    });
