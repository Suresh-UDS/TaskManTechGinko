'use strict';

angular.module('timeSheetApp')
    .factory('FeedbackComponent', function FeedbackComponent(Feedback,FeedbackQuestions,FeedbackMapping, $http,FeedbackDelete) {
        return {
        		createFeedbackMaster: function(feedbackquestions, callback) {
                    var cb = callback || angular.noop;
                    console.log('Feedback -' + feedbackquestions.name);
                    return FeedbackQuestions.save(feedbackquestions,
                        function () {
                            return cb(feedbackquestions);
                        },
                        function (err) {
                            //this.logout();
                            return cb(err);
                        }.bind(this)).$promise;

        		},
            updateFeedbackMaster: function (feedback, callback) {
                var cb = callback || angular.noop;

                return FeedbackQuestions.update(feedback,
                    function () {
                        return cb(feedback);
                    },
                    function (err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            searchFeedbackMaster: function(searchCriteria) {
                return $http.post('api/feedbackquestions/search', searchCriteria).then(function (response) {
                    return response.data;
                });
            },
            findOneFeedbackMaster: function(id){
                return $http.get('api/feedbackquestions/'+id).then(function (response) {
                    return response.data;
                });
            },
            findAllFeedbackMaster: function () {
                return $http.get('api/feedbackquestions').then(function (response) {
                    return response.data;
                });
            },


            createFeedbackMapping: function(feedbackMapping, callback) {
                var cb = callback || angular.noop;
                console.log('Feedback -' + feedbackMapping.name);
                return FeedbackMapping.save(feedbackMapping,
                    function () {
                        return cb(feedbackMapping);
                    },
                    function (err) {
                        //this.logout();
                        return cb(err);
                    }.bind(this)).$promise;

	    		},
	        updateFeedbackMapping: function (feedbackMapping, callback) {
	            var cb = callback || angular.noop;

	            return FeedbackMapping.update(feedbackMapping,
	                function () {
	                    return cb(feedbackMapping);
	                },
	                function (err) {
	                    this.logout();
	                    return cb(err);
	                }.bind(this)).$promise;
	        },
        		searchFeedbackMapping: function(searchCriteria) {
                return $http.post('api/feedbackmapping/search', searchCriteria).then(function (response) {
                    return response.data;
                });
            },
            findOneFeedbackMapping: function(id){
                return $http.get('api/feedbackmapping/'+id).then(function (response) {
                    return response.data;
                });
            },

            createFeedback: function (feedback, callback) {
                var cb = callback || angular.noop;
                console.log('Feedback -' + feedback.title);
                return Feedback.save(feedback,
                    function () {
                        return cb(feedback);
                    },
                    function (err) {
                        //this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            findAll: function () {
                return $http.get('api/feedback').then(function (response) {
                    return response.data;
                });
            },
            findOne: function(id){
                return $http.get('api/feedback/'+id).then(function (response) {
                    return response.data;
                });
            },
            updateFeedback: function (feedback, callback) {
                var cb = callback || angular.noop;

                return Feedback.update(feedback,
                    function () {
                        return cb(feedback);
                    },
                    function (err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            deleteFeedback: function (feedback, callback) {

                var cb = callback || angular.noop;

                return FeedbackDelete.deleteFeedback(feedback,
                    function () {
                        return cb(feedback);
                    },
                    function (err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },
            search: function(searchCriteria) {
                return $http.post('api/feedback/search', searchCriteria).then(function (response) {
                    console.log("response of feedback -"+JSON.stringify(response));
                    return response.data;
                });
            },
            reports: function(searchCriteria) {
                return $http.post('api/feedback/reports', searchCriteria).then(function (response) {
                    return response.data;
                });
            },
            exportAllData: function(searchCriteria) {
	            	return $http.post('api/feedback/export', searchCriteria).then(function (response) {
	            		return response.data;
	            	});
	        },
	        exportStatus: function(fileName) {
	            	return $http.get('api/feedback/export/'+fileName+"/status").then(function (response) {
	            		return response.data;
	            	});
	        },
	        getExportFile: function(fileName) {
	            	return $http.get('api/feedback/export/'+fileName).then(function (response) {
	            		return response.data;
	            	});
	        }

        };
    });
