'use strict';

angular.module('timeSheetApp')
    .factory('FeedbackComponent', function FeedbackComponent(Feedback,$http,FeedbackDelete) {
        return {
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
                    return response.data;
                });
            }
        };
    });
