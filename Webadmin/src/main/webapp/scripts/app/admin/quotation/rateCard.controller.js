'use strict';

angular.module('timeSheetApp')
    .controller('RateCardController', function ($scope, $rootScope, $state, $timeout,$http,$stateParams,$location, RateCardComponent    ) {

    	$scope.rateCard;

    	$scope.saveRateCard = function(rateCardDetails){
    		console.log(rateCardDetails);
            RateCardComponent.createRateCard(rateCardDetails).then(function (response) {
                console.log(response);
            })
    	}

    });
