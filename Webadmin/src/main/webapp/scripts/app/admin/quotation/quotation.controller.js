'use strict';

angular.module('timeSheetApp')
    .controller('QuotationController', function ($scope, $rootScope, $state, $timeout,$http,$stateParams,$location, RateCardComponent) {

    	$scope.quotations;

        $scope.loadAllQuotations = function() {
            RateCardComponent.getAllQuotations().then(function (response) {
                console.log(response);
                $scope.quotations = response;
            })

        };

        $scope.selectQuotation = function(quotation){

            $scope.quotation = quotation;
        }

        $scope.approveQuotation = function(quotation){
            RateCardComponent.approveQuotation(quotation).then(function (response) {
                console.log(response);
                // $scope.quotation = response
                $scope.loadAllQuotations();
            })
        }

    });
