'use strict';

angular.module('timeSheetApp')
    .factory('TicketComponent', function TicketComponent(Ticket,$http) {
        return {

	    loadTicketStatuses : function(){
		    console.log("Loading ticket statuses")
		    return $http.get('api/ticket/lookup/status').then(function (response) {
	            console.log(response)
		        return response.data;
	        })
	    },

        generateReport: function(searchCriteria) {
            	return $http.post('api/ticket/report', searchCriteria).then(function (response) {
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
            	return $http.post('api/ticket/export', searchCriteria).then(function (response) {
            		return response.data;
            	});
        },
        exportStatus: function(fileName) {
            	return $http.get('api/ticket/export/'+fileName+"/status").then(function (response) {
            		return response.data;
            	});
        },

        getExportFile: function(fileName) {
            	return $http.get('api/ticket/export/'+fileName).then(function (response) {
            		return response.data;
            	});
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
        
        getTicketsByAssetId : function(id) { 
	        	return $http.get('api/ticket/'+id+'/view').then(function(response) { 
	        		console.log(response);
	        		return response.data;
	        	});
        },

        upload: function(ticketId,ticketImage) {
             var fileFormData = new FormData();
             fileFormData.append('ticketFile', ticketImage);
             fileFormData.append('ticketId', ticketId);
             return $http.post('api/ticket/image/upload', fileFormData, {
                 transformRequest: angular.identity,
                 headers: {'Content-Type': undefined}

             }).then(function (response) {
                 return response.data;
             });

        },

        findTicketImage: function(ticketId,imageId){
            return $http.get('api/ticket/image/'+ticketId+'/'+imageId).then(function (response) {
                console.log("Ticket image response");
                console.log(response.data);
                return response.data;
            })
        },

        getStatusCountsByCategory : function () {
            return $http.get('api/reports/ticketStatus/count').then(function (response) {
               return response.data;
            });
        },

        getTicketsCountsByStatus : function (searchCriteria) {
            return $http.post('api/reports/tickets/count', searchCriteria).then(function (response) {
               return response.data;
            });
        },
        
        getAverageAge : function() {
        	return $http.get('api/getAvgTicket').then(function(response) {
        		return response.data;
        	});
        }
    };
});
