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

			findShifts: function(id,date){
				  return $http.get('api/site/'+id + '/shifts/' + date).then(function (response) {
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

					//console.log("response is--->>>"+JSON.stringify(response.data));
					return response.data;
				});
			},
			setSiteProximity: function(userId,siteId,lat,lng){
				return $http.post('http://ec2-52-77-216-21.ap-southeast-1.compute.amazonaws.com:8000/api/site/location?'+'userId='+userId+'&siteId='+siteId+'&lat='+lat+'&lng='+lng).then(function (response) {
					return response.data
				})
			},
			importSiteFile: function(file){
				var fileFormData = new FormData();
				fileFormData.append('siteFile', file);
				return $http.post('api/import/site', fileFormData, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}

				}).then(function (response) {
						return response.data;
				});


			},
			importStatus: function(fileName) {
				console.log('import site service file name : '+fileName);
					return $http.get('api/site/import/'+fileName+"/status").then(function (response) {
						return response.data;
					});
			},

            employeeSiteChange: function(file){
                var fileFormData = new FormData();
                fileFormData.append('siteFile', file);
                return $http.post('api/change/site/employee', fileFormData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}

                }).then(function (response) {
                    return response.data;
                });

            },

            addRegion: function (region) {
                return $http.post('api/region',region).then(function (response) {
                    return response.data;
                })
            },

            addBranch: function(branch){
			    return $http.post('api/branch',branch).then(function (response) {
                    return response.data;
                })
            },

            getAllRegions : function () {
                return $http.get('api/region').then(function (response) {
                    return response.data;
                })
            },

            getAllBranches : function () {
                return $http.get('api/branch').then(function (response) {
                    return response.data;
                })
            },

            getRegionByProject:function(projectId){
			    return $http.get('api/region/projectId/'+projectId).then(function (response) {
                    return response.data;
                })
            },

            getBranchByProject: function (projectId,regionId) {
                return $http.get('api/branch/projectId/'+projectId+'/region/'+regionId).then(function (response) {
                    return response.data;
                })
            },
            
            getBranchByProjectAndRegionName: function (projectId,region) {
                return $http.get('api/branch/projectId/'+projectId+'/regionName/'+region).then(function (response) {
                    return response.data;
                })
            },

            getSitesByRegion: function (projectId, region) {
                return $http.post('api/project/region/'+region+'/projectId/'+projectId).then(function (response) {
                    return response.data;
                })
            },

            getSitesByBranch: function (projectId, region,branch) {
                return $http.get('api/project/branch/'+branch+'/region/'+region+'/projectId/'+projectId).then(function (response) {
                    return response.data;
                })

            }
		};
	});
