'use strict';

angular.module('timeSheetApp')
    .factory('JobComponent', function JobComponent($http) {
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
	    loadJobStatuses : function(){
		    console.log("Loading job statuses")
		    return $http.get('api/job/lookup/status').then(function (response) {
	            console.log(response)
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
                        return cb(response,null);
                    }).catch(
                    function (err) {
                        console.log(' Error response ' + JSON.stringify(err));
                        return cb(null,err);
                    })

        	},
        	update : function(job,callback){
        	    var cb = callback || angular.noop;
                return $http.put('api/job/'+job.id,job).then(
                    function (response) {
                        return cb(response, null);
                    }).catch(
                    function (err) {
                        console.log(JSON.stringify(err));
                        return cb(null,err);
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
            search: function(searchCriteria,uid) {
            		console.log('uid in search call - ' + uid);
	            	if(uid) {
		            	return $http.post('api/jobs/report/'+uid).then(function (response) {
		            		return response.data;
		            	});

	            	}else {
	                	return $http.post('api/jobs/search', searchCriteria).then(function (response) {
	                		return response.data;
	                	});

	            	}
            },

            generateReport: function(searchCriteria) {
	            	return $http.post('api/jobs/report', searchCriteria).then(function (response) {
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
                	return $http.get('api/job/export/'+fileName+"/status").then(function (response) {
                		return response.data;
                	});
	        },

	        getExportFile: function(fileName) {
	            	return $http.get('api/job/export/'+fileName).then(function (response) {
	            		return response.data;
	            	});
	        },

	        importFile: function(file) {
	        		var fileFormData = new FormData();
	            fileFormData.append('jobFile', file);
	            	return $http.post('api/jobs/import', fileFormData, {
	                    transformRequest: angular.identity,
	                    headers: {'Content-Type': undefined}

	                }).then(function (response) {
	            			return response.data;
	                });

	        },
	        importStatus: function(fileName) {
	        	console.log('import job service file name : '+fileName);
                	return $http.get('api/jobs/import/'+fileName+"/status").then(function (response) {
                		return response.data;
                	});
	        },

            getCompletedDetails: function (jobId) {
                return $http.get('api/job/'+jobId+'/checkInOut').then(function (response) {
                    return response.data;
                })
            },

            getCompleteImage: function(employeeId,imageId){
        	    console.log("Get completed images");
        	    console.log(employeeId);
        	    return $http.get('api/employee/'+employeeId+'/checkInOut/'+imageId).then(function (response) {
        	        console.log(response);
                    return response.data;
                })
            },

            createTicket: function(ticket){
                return $http.post('api/ticket',ticket).then(function (response) {
                    console.log(response);
                    return response.data;
                })
            },

            updateTicket: function (ticket) {
                return $http.post('api/ticket/update',ticket).then(function (response) {
                    console.log(response);
                    return response.data;
                })
            },

            getTicketDetails:function (id) {
                return $http.get('api/ticket/details/'+id).then(function (response) {
                    console.log(response);
                    return response.data;
                })
            },

            searchTickets:function(search){
                return $http.post('api/tickets/search',search).then(function (response) {
                    console.log(response);
                    return response.data;
                })
            },

            getTotalCounts : function (searchCriteria) {
                return $http.post('api/reports/jobs/count',searchCriteria).then(function (response) {
                    return response.data;
                });
            }



        };
    });
